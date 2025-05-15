const text = `...lo material nunca es lo más bonito...`;
const typedText = document.getElementById("typed-text");
const cursor = document.getElementById("cursor");

let i = 0;

function type() {
  if (i < text.length) {
    typedText.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

window.addEventListener("load", () => {
  setTimeout(type, 2000);

  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  let yaRascado = false; // 👈 evita repintado si el usuario ya ha rascado

  function dibujarCanvas() {
    if (yaRascado) return; // 👈 NO repintar si ya ha empezado a rascar

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    // Pintar capa gris
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, width, height);

    // Texto "¡Rasca aquí!"
    ctx.fillStyle = "#fff";
    ctx.font = "30px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("¡Rasca aquí!", width / 2, height / 2);

    ctx.globalCompositeOperation = "destination-out";
  }

  function esperarAlturaYdibujar() {
    if (container.offsetHeight < 100) {
      requestAnimationFrame(esperarAlturaYdibujar);
      return;
    }
    dibujarCanvas();
  }

  esperarAlturaYdibujar(); // 👈 Pintado inicial

  // 👇 Redibuja si el viewport cambia (ej. barra Safari)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", dibujarCanvas);
  }

  function draw(e) {
    yaRascado = true; // 👈 Marcamos que el usuario ha empezado a rascar

    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();

    checkScratchProgress();
  }

  let drawCount = 0;

  function checkScratchProgress() {
    drawCount++;
    const limiteRascado = 800; // número de círculos estimado para completar

    if (drawCount >= limiteRascado) {
      canvas.classList.add("fade-out");
      canvas.style.pointerEvents = "none";
    }
  }

  // Eventos
  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) draw(e);
  });

  canvas.addEventListener("touchstart", (e) => e.preventDefault(), {
    passive: false,
  });

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      draw(e);
    },
    { passive: false }
  );
});

