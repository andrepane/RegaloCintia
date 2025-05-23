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

function hacerDraggable(el) {
  let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

  el.addEventListener("mousedown", dragStart);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("mousemove", drag);

  function dragStart(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    offsetX = el.offsetLeft;
    offsetY = el.offsetTop;
    el.classList.add("arrastrando");
  }

  function drag(e) {
    if (!el.classList.contains("arrastrando")) return;
    el.style.left = `${offsetX + (e.clientX - startX)}px`;
    el.style.top = `${offsetY + (e.clientY - startY)}px`;
    el.style.transform = `translate(0, 0)`; // cancelamos el centrado automático
  }

  function dragEnd() {
    el.classList.remove("arrastrando");
  }
}

hacerDraggable(document.getElementById("tattoo-preview"));

