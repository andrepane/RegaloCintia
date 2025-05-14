const galeria = document.getElementById("galeria");
const imgs = galeria.querySelectorAll("img");

function actualizarImagenCentral() {
  const galeriaRect = galeria.getBoundingClientRect();
  const centroGaleria = galeriaRect.left + galeriaRect.width / 2;

  imgs.forEach((img) => {
    const imgRect = img.getBoundingClientRect();
    const centroImg = imgRect.left + imgRect.width / 2;
    const distancia = Math.abs(centroGaleria - centroImg);

    if (distancia < imgRect.width / 2) {
      img.classList.add("activa");
    } else {
      img.classList.remove("activa");
    }
  });
}

// Ejecutar al hacer scroll y al cargar
galeria.addEventListener("scroll", actualizarImagenCentral);
window.addEventListener("load", actualizarImagenCentral);

document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
  });
});
