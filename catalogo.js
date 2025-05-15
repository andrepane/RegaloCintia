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
      } else {
        favoritos.push(id);
      }

      saveFavoritos(favoritos);
      marcarFavoritos();
      if (soloFavoritosActivo) mostrarSoloFavoritos();
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
  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;
    card.style.display = favoritos.includes(id) ? "block" : "none";
  });
}

function mostrarTodos() {
  document.querySelectorAll(".card").forEach((card) => {
    card.style.display = "block";
  });
}

document.getElementById("toggle-favoritos").addEventListener("click", () => {
  soloFavoritosActivo = !soloFavoritosActivo;
  if (soloFavoritosActivo) {
    mostrarSoloFavoritos();
    toggleBtn.textContent = "Ver todos";
  } else {
    mostrarTodos();
    toggleBtn.textContent = "Ver solo favoritos";
  }
});
const toggleBtn = document.getElementById("toggle-favoritos");

// ==== MENÚ DE CATEGORÍAS ====
const menuCategorias = document.getElementById("menu-categorias");
const catalogo = document.getElementById("catalogo");
const volverBtn = document.getElementById("volver-menu");

document.querySelectorAll(".categoria-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;

    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.dataset.categoria === categoria ? "block" : "none";
    });

    menuCategorias.style.display = "none";
    catalogo.style.display = "block";
    toggleBtn.style.display = "block";
    volverBtn.style.display = "block";
  });
});

volverBtn.addEventListener("click", () => {
  catalogo.style.display = "none";
  toggleBtn.style.display = "none";
  volverBtn.style.display = "none";
  menuCategorias.style.display = "flex";
});

// ==== AL CARGAR ====
window.addEventListener("DOMContentLoaded", () => {
  marcarFavoritos();
  activarLikeBtns();
});
