// == FAVORITOS LOCALSTORAGE ==
function getFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("favoritosTatuajes")) || [];
  } catch (e) {
    return [];
  }
}

function saveFavoritos(favoritos) {
  localStorage.setItem("favoritosTatuajes", JSON.stringify(favoritos));
}

// == FEEDBACK VISUAL ==
function showToast(msg, duration = 4000) {
  let toast = document.getElementById("toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-msg";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style = `
      position:fixed;
      bottom:2rem;
      left:50%;
      transform:translateX(-50%);
      background:#bfa76f;
      color:#222;
      padding:1.1rem 2rem;
      border-radius:2rem;
      z-index:9999;
      font-size:1.15rem;
      font-weight:bold;
      box-shadow:0 6px 32px #0007;
      opacity:0;
      pointer-events:none;
      cursor:pointer;
      transition:opacity 0.4s, bottom 0.4s;
    `;
    document.body.appendChild(toast);

    // Permite cerrar tocando el toast
    toast.addEventListener("click", () => {
      toast.style.opacity = "0";
      toast.style.bottom = "1rem";
      toast.style.pointerEvents = "none";
    });
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.bottom = "2rem";
  toast.style.pointerEvents = "auto";
  // Oculta después de la duración especificada
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.bottom = "1rem";
    toast.style.pointerEvents = "none";
  }, duration);
}
// == MARCAR FAVORITOS ==
function marcarFavoritos() {
  const favoritos = getFavoritos();
  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    const btn = card.querySelector(".like-btn");
    if (!btn) return;
    if (favoritos.includes(id)) {
      btn.classList.add("liked");
      btn.textContent = "❤️";
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("title", "Quitar de favoritos");
    } else {
      btn.classList.remove("liked");
      btn.textContent = "🤍";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("title", "Añadir a favoritos");
    }
  });
}

// == Delegación de eventos para like-btn (siempre funciona, incluso en cards nuevas o móviles) ==
const catalogo = document.getElementById("catalogo");
catalogo.addEventListener("click", (event) => {
  const button = event.target.closest(".like-btn");
  if (!button) return;
  const card = button.closest(".card");
  if (!card) return;
  const id = card.dataset.id;
  let favoritos = getFavoritos();

  if (favoritos.includes(id)) {
    favoritos = favoritos.filter((fav) => fav !== id);
    showToast("Eliminado de favoritos");
  } else {
    favoritos.push(id);
    button.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(1.4)", filter: "brightness(1.5)" },
        { transform: "scale(1)", filter: "brightness(1)" }
      ],
      { duration: 400, easing: "ease" }
    );
    showToast("¡Añadido a favoritos!");
  }
  saveFavoritos(favoritos);
  marcarFavoritos();
  if (soloFavoritosActivo) mostrarSoloFavoritos();
  actualizarContadorFavoritos();
});

// == CARDS ENTRADA SUAVE / SCROLL POP-UP ==
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

// == FILTRAR POR FAVORITOS ==
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
    msg.style.fontSize = "1.1rem";
    msg.style.transition = "opacity 0.5s";
    msg.textContent =
      "Aún no has marcado ningún tatuaje como favorito. ¡Explora y elige uno!";
    catalogo.appendChild(msg);
  }
  msg.style.display = visible ? "block" : "none";
  msg.style.opacity = visible ? "1" : "0";
}

// == ELEMENTOS DOM GLOBALES ==
const toggleBtn = document.getElementById("toggle-favoritos");
const btnTatuadores = document.getElementById("btn-tatuadores");
const menuCategorias = document.getElementById("menu-categorias");
const volverBtn = document.getElementById("volver-menu");

function mostrarMenu() {
  menuCategorias.style.display = "flex";
  requestAnimationFrame(() => menuCategorias.classList.add("visible"));
}

function ocultarMenu() {
  menuCategorias.classList.remove("visible");
  setTimeout(() => {
    menuCategorias.style.display = "none";
  }, 450);
}

// == TOGGLE FAVORITOS ==
toggleBtn.addEventListener("click", () => {
  soloFavoritosActivo = !soloFavoritosActivo;
  if (soloFavoritosActivo) {
    mostrarSoloFavoritos();
  } else {
    mostrarTodos();
  }
  actualizarContadorFavoritos();
});

// == MENÚ DE CATEGORÍAS ==
document.querySelectorAll(".categoria-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;
    localStorage.setItem("ultimaCategoria", categoria);

    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.dataset.categoria === categoria ? "block" : "none";
    });

    ocultarMenu();
    catalogo.style.display = "block";
    toggleBtn.style.display = "block";
    volverBtn.style.display = "block";
    btnTatuadores.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

volverBtn.addEventListener("click", () => {
  catalogo.style.display = "none";
  toggleBtn.style.display = "none";
  volverBtn.style.display = "none";
  btnTatuadores.style.display = "none";
  mostrarMenu();
  localStorage.removeItem("ultimaCategoria");
});

// == AL CARGAR: BIENVENIDA Y CATEGORÍA ==
window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("bienvenidaMostrada")) {
    showToast("¡Bienvenida, Cintia! Pulsa en los corazones para guardar tus favoritos ❤️");
    localStorage.setItem("bienvenidaMostrada", "1");
  }
  marcarFavoritos();
  actualizarContadorFavoritos();

  const ultimaCategoria = localStorage.getItem("ultimaCategoria");
  if (ultimaCategoria) {
    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.dataset.categoria === ultimaCategoria ? "block" : "none";
    });
    menuCategorias.classList.remove("visible");
    menuCategorias.style.display = "none";
    catalogo.style.display = "block";
    toggleBtn.style.display = "block";
    volverBtn.style.display = "block";
    btnTatuadores.style.display = "block";
    window.scrollTo({ top: 0 });
  } else {
    mostrarMenu();
  }
});

// == MODAL PARA AMPLIAR IMAGEN ==
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const cerrarModal = document.getElementById("cerrar-modal");

const verPreviewBtn = document.getElementById("ver-preview");
const tattooPreview = document.getElementById("tattoo-preview");
const pantallaPreview = document.getElementById("pantalla-preview");
const cerrarPreview = document.getElementById("cerrar-preview");
const bodyImg = document.getElementById("body-img");
const bodyPartSelect = document.getElementById("body-part-select");
const botonContainer = document.getElementById("boton-container");

const bodyImages = {
  brazo: "assets/brazo.png",
  pierna: "assets/piernas.webp",
  hombro: "assets/hombro.png",
  espalda: "assets/espalda.png",
};

function actualizarBodyImage() {
  const parte = bodyPartSelect.value;
  bodyImg.src = bodyImages[parte] || bodyImages.brazo;
}

bodyPartSelect.addEventListener("change", actualizarBodyImage);

document.querySelectorAll(".card img").forEach((img) => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    pantallaPreview.style.display = "none";
    modalImg.style.display = "block";
    botonContainer.style.display = "block";
    tattooPreview.src = "";
    modalImg.focus();
  });
});

// Accesibilidad: cerrar modal con Escape
if (modal) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      if (pantallaPreview.style.display === "flex") {
        pantallaPreview.style.display = "none";
        modalImg.style.display = "block";
        botonContainer.style.display = "block";
      } else {
        modal.style.display = "none";
      }
    }
  });
}

cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
  pantallaPreview.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    if (pantallaPreview.style.display === "flex") {
      pantallaPreview.style.display = "none";
      modalImg.style.display = "block";
      botonContainer.style.display = "block";
    } else {
      modal.style.display = "none";
    }
  }
});

verPreviewBtn.addEventListener("click", () => {
  if (modalImg.src) {
    tattooPreview.src = modalImg.src;
    pantallaPreview.style.display = "flex";
    modalImg.style.display = "none";
    botonContainer.style.display = "none";
    tattooPreview.style.pointerEvents = "auto";
    actualizarBodyImage();
  }
});

cerrarPreview.addEventListener("click", () => {
  pantallaPreview.style.display = "none";
  modalImg.style.display = "block";
  botonContainer.style.display = "block";
});

// == CONTADOR DE FAVORITOS ==
function actualizarContadorFavoritos() {
  const count = getFavoritos().length;
  toggleBtn.textContent = soloFavoritosActivo ? "Ver todos" : "Ver favoritos";
  const contador = document.getElementById("contador-favoritos");
  if (contador) {
    contador.textContent = `${count} ❤️`;
    contador.classList.add("animado");
    setTimeout(() => contador.classList.remove("animado"), 300);
  }
}

// == HACER DRAGGABLE EL PREVIEW ==
function hacerDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function moverElemento(x, y) {
    el.style.left = `${x - offsetX}px`;
    el.style.top = `${y - offsetY}px`;
  }

  el.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.classList.add("arrastrando");
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    el.classList.remove("arrastrando");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    moverElemento(e.clientX, e.clientY);
  });

  // Touch events
  el.addEventListener("touchstart", (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - el.offsetLeft;
    offsetY = touch.clientY - el.offsetTop;
    el.classList.add("arrastrando");
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
    el.classList.remove("arrastrando");
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    moverElemento(touch.clientX, touch.clientY);
  });
}

hacerDraggable(document.getElementById("tattoo-preview"));

// == SLIDERS PARA TAMAÑO Y ROTACIÓN ==
const sliderTamano = document.getElementById("slider-tamano");
const sliderRotacion = document.getElementById("slider-rotacion");

sliderTamano.addEventListener("input", actualizarTransformaciones);
sliderRotacion.addEventListener("input", actualizarTransformaciones);

let escalaActual = 40; // en porcentaje
let rotacionActual = 0;

function actualizarTransformaciones() {
  escalaActual = sliderTamano.value;
  rotacionActual = sliderRotacion.value;

  tattooPreview.style.width = `${escalaActual}%`;
  tattooPreview.style.transform = `rotate(${rotacionActual}deg) scale(${escalaActual / 40})`;
}
