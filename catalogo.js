// ==== FAVORITOS LOCALSTORAGE ====
function getFavoritos() {
  return JSON.parse(localStorage.getItem("favoritosTatuajes")) || [];
}

function saveFavoritos(favoritos) {
  localStorage.setItem("favoritosTatuajes", JSON.stringify(favoritos));
}

function marcarFavoritos() {
  const favoritos = getFavoritos();
  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    const btn = card.querySelector(".like-btn");
    if (favoritos.includes(id)) {
      btn.classList.add("liked");
      btn.textContent = "❤️";
    } else {
      btn.classList.remove("liked");
      btn.textContent = "🤍";
    }
  });
}

function activarLikeBtns() {
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const id = card.dataset.id;
      let favoritos = getFavoritos();

      if (favoritos.includes(id)) {
        favoritos = favoritos.filter((fav) => fav !== id);
        button.classList.remove("liked");
        button.textContent = "🤍";
      } else {
        favoritos.push(id);
        button.classList.add("liked");
        button.textContent = "❤️";

        button.classList.remove("liked");
        void button.offsetWidth;
        button.classList.add("liked");
      }

      saveFavoritos(favoritos);
      if (soloFavoritosActivo) mostrarSoloFavoritos();
      actualizarContadorFavoritos();
    });
  });
}

// ==== POP-UP EFECTO SCROLL ====
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  },
  { threshold: 0.6 }
);
cards.forEach((card) => observer.observe(card));

// ==== FILTRAR POR FAVORITOS ====
let soloFavoritosActivo = false;
function mostrarSoloFavoritos() {
  const favoritos = getFavoritos();
  let hayFavoritos = false;

  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    const visible = favoritos.includes(id);
    card.style.display = visible ? "block" : "none";
    if (visible) hayFavoritos = true;
  });

  mostrarMensajeNoFavoritos(!hayFavoritos);
}

function mostrarTodos() {
  document.querySelectorAll(".card").forEach((card) => {
    card.style.display = "block";
  });
  mostrarMensajeNoFavoritos(false);
}

function mostrarMensajeNoFavoritos(visible) {
  let msg = document.getElementById("mensaje-favoritos");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "mensaje-favoritos";
    msg.style.textAlign = "center";
    msg.style.marginTop = "2rem";
    msg.style.color = "#888";
    msg.textContent =
      "Aún no has marcado ningún tatuaje como favorito. ¡Explora y elige uno!";
    catalogo.appendChild(msg);
  }
  msg.style.display = visible ? "block" : "none";
}

document.getElementById("toggle-favoritos").addEventListener("click", () => {
  soloFavoritosActivo = !soloFavoritosActivo;
  if (soloFavoritosActivo) {
    mostrarSoloFavoritos();
  } else {
    mostrarTodos();
  }
  actualizarContadorFavoritos();
});

const toggleBtn = document.getElementById("toggle-favoritos");
const menuCategorias = document.getElementById("menu-categorias");
const catalogo = document.getElementById("catalogo");
const volverBtn = document.getElementById("volver-menu");

// ==== MENÚ DE CATEGORÍAS ====
document.querySelectorAll(".categoria-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;
    localStorage.setItem("ultimaCategoria", categoria);

    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.dataset.categoria === categoria ? "block" : "none";
    });

    menuCategorias.style.display = "none";
    catalogo.style.display = "block";
    toggleBtn.style.display = "block";
    volverBtn.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

volverBtn.addEventListener("click", () => {
  catalogo.style.display = "none";
  toggleBtn.style.display = "none";
  volverBtn.style.display = "none";
  menuCategorias.style.display = "flex";
  localStorage.removeItem("ultimaCategoria");
});

// ==== AL CARGAR ====
window.addEventListener("DOMContentLoaded", () => {
  marcarFavoritos();
  activarLikeBtns();
  actualizarContadorFavoritos();

  const ultimaCategoria = localStorage.getItem("ultimaCategoria");
  if (ultimaCategoria) {
    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.dataset.categoria === ultimaCategoria ? "block" : "none";
    });
    menuCategorias.style.display = "none";
    catalogo.style.display = "block";
    toggleBtn.style.display = "block";
    volverBtn.style.display = "block";
    window.scrollTo({ top: 0 });
  }
});

// ==== MODAL PARA AMPLIAR IMAGEN ====
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const cerrarModal = document.getElementById("cerrar-modal");

const verPreviewBtn = document.getElementById("ver-preview");
const tattooPreview = document.getElementById("tattoo-preview");
const previewContainer = document.getElementById("preview-container");

document.querySelectorAll(".card img").forEach((img) => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;

    // Reiniciar preview
    previewContainer.style.display = "none";
    tattooPreview.src = "";
  });
});

verPreviewBtn.addEventListener("click", () => {
  if (modalImg.src) {
    tattooPreview.src = modalImg.src;
    previewContainer.style.display = "block";
    tattooPreview.style.pointerEvents = "auto";

    // ⚠️ Solo se activa cuando se abre el preview
    habilitarMultitouch(tattooPreview);
  }
});

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function actualizarContadorFavoritos() {
  const count = getFavoritos().length;

  // ✅ Esta línea ya sin número en el botón
  toggleBtn.textContent = soloFavoritosActivo ? "Ver todos" : "Ver favoritos";

  // Contador en la esquina
  const contador = document.getElementById("contador-favoritos");
  if (contador) {
    contador.textContent = `${count} ❤️`;
    contador.classList.add("animado");
    setTimeout(() => contador.classList.remove("animado"), 300);
  }
}

function habilitarMultitouch(tattoo) {
  let initialDistance = null;
  let initialAngle = null;
  let initialScale = 1;
  let initialRotation = 0;

  let currentScale = 1;
  let currentRotation = 0;
  let currentX = 0;
  let currentY = 0;

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  // Drag con un dedo
  tattoo.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      offsetX = touch.clientX - tattoo.offsetLeft;
      offsetY = touch.clientY - tattoo.offsetTop;
      isDragging = true;
    } else if (e.touches.length === 2) {
      isDragging = false;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      initialDistance = Math.hypot(dx, dy);
      initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      initialScale = currentScale;
      initialRotation = currentRotation;
    }
  });

  document.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      currentX = touch.clientX - offsetX;
      currentY = touch.clientY - offsetY;
      aplicarTransformacion();
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newDistance = Math.hypot(dx, dy);
      const newAngle = Math.atan2(dy, dx) * (180 / Math.PI);

      currentScale = initialScale * (newDistance / initialDistance);
      currentRotation = initialRotation + (newAngle - initialAngle);
      aplicarTransformacion();
    }
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });

  function aplicarTransformacion() {
    tattoo.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale}) rotate(${currentRotation}deg)`;
  }
}



let escalaActual = 40; // en porcentaje
let rotacionActual = 0;


function actualizarTransformaciones() {
  escalaActual = sliderTamano.value;
  rotacionActual = sliderRotacion.value;

  tattooPreview.style.width = `${escalaActual}%`;
  tattooPreview.style.transform = `rotate(${rotacionActual}deg) scale(${escalaActual / 40})`;
}


