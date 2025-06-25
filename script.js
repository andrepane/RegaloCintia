const text = `...lo material nunca es lo más bonito...`;
const typedText = document.getElementById("typed-text");
const cursor = document.getElementById("cursor");

let i = 0;

// Typewriter effect
function type() {
  if (i < text.length) {
    typedText.textContent += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

// Gradient animation
const textElement = document.querySelector(".text");
let position = 0;
let direction = 1;

function animateGradient() {
  position += direction * 1.0;
  if (position > 100 || position < 0) direction *= -1;
  textElement.style.backgroundPosition = `${position}% 50%`;
  requestAnimationFrame(animateGradient);
}
requestAnimationFrame(animateGradient);

window.addEventListener("load", () => {
  setTimeout(type, 2000);

  // SCRATCH CARD
  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;
  const pdfBtn = document.getElementById("pdf-vale");

  let yaRascado = false;
  let drawCount = 0;
  let confettiLanzado = false;

  function dibujarCanvas() {
    if (yaRascado) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Fondo dorado degradado con textura
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#ffe6a7");
    grad.addColorStop(1, "#bfa76f");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Líneas diagonales sutiles
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    for (let i = -height; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Texto central
    ctx.fillStyle = "#333";
    ctx.font = "bold 36px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 6;
    ctx.fillText("¡Rasca aquí!", width / 2, height / 2);
    ctx.shadowBlur = 0;

    ctx.globalCompositeOperation = "destination-out";
  }

  function esperarAlturaYdibujar() {
    if (container.offsetHeight < 100) {
      requestAnimationFrame(esperarAlturaYdibujar);
      return;
    }
    dibujarCanvas();
  }

  esperarAlturaYdibujar();

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", dibujarCanvas);
  }

  function draw(e) {
    if (!yaRascado && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
    yaRascado = true;

    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const radio = Math.max(canvas.width, canvas.height) * 0.05;

    ctx.beginPath();
    ctx.arc(x, y, radio, 0, 2 * Math.PI);
    ctx.fill();

    checkScratchProgress();
  }

  // SOLO UNA función checkScratchProgress
  function checkScratchProgress() {
    drawCount++;
    const limiteRascado = 400;
    if (drawCount >= limiteRascado) {
      canvas.classList.add("fade-out");
      canvas.style.pointerEvents = "none";
      mostrarSliderDescubre();
      mostrarBotonPdf();
      lanzarConfeti();
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) draw(e);
  });
  canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
  }, { passive: false });

  // SLIDER: Desliza para descubrir
  let sliderInicializado = false;
  function mostrarSliderDescubre() {
    const swipeContainer = document.getElementById("swipe-container");
    if (swipeContainer && !sliderInicializado) {
      swipeContainer.style.display = "block";
      inicializarSliderSwipe();
      sliderInicializado = true;
    }
  }

  function mostrarBotonPdf() {
    if (pdfBtn) {
      pdfBtn.style.display = "block";
    }
  }

  function lanzarConfeti() {
    if (confettiLanzado || typeof confetti !== "function") return;
    confettiLanzado = true;
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }

  function inicializarSliderSwipe() {
    const swipeThumb = document.getElementById("swipe-thumb");
    const swipeTrack = document.querySelector(".swipe-track");
    if (!swipeThumb || !swipeTrack) return;

    let startX = null, currentX = 0, dragging = false;
    const maxMove = swipeTrack.offsetWidth - swipeThumb.offsetWidth - 4;

    function resetSlider() {
      swipeThumb.style.transform = `translateX(0px)`;
      swipeThumb.style.background = "var(--accent)";
      dragging = false;
      startX = null;
      currentX = 0;
    }

    function completeSlider() {
      swipeThumb.style.transform = `translateX(${maxMove}px)`;
      swipeThumb.style.background = "#7ed957";
      setTimeout(() => {
        window.location.href = "catalogo.html";
      }, 250);
    }

    // Touch events
    swipeThumb.ontouchstart = (e) => {
      dragging = true;
      startX = e.touches[0].clientX;
    };
    swipeThumb.ontouchmove = (e) => {
      if (!dragging) return;
      let deltaX = e.touches[0].clientX - startX;
      if (deltaX < 0) deltaX = 0;
      if (deltaX > maxMove) deltaX = maxMove;
      currentX = deltaX;
      swipeThumb.style.transform = `translateX(${currentX}px)`;
    };
    swipeThumb.ontouchend = () => {
      if (currentX > maxMove * 0.8) {
        completeSlider();
      } else {
        resetSlider();
      }
    };

    // Mouse events
    swipeThumb.onmousedown = (e) => {
      dragging = true;
      startX = e.clientX;
      document.body.style.userSelect = "none";
    };
    window.onmousemove = (e) => {
      if (!dragging) return;
      let deltaX = e.clientX - startX;
      if (deltaX < 0) deltaX = 0;
      if (deltaX > maxMove) deltaX = maxMove;
      currentX = deltaX;
      swipeThumb.style.transform = `translateX(${currentX}px)`;
    };
    window.onmouseup = () => {
      if (!dragging) return;
      if (currentX > maxMove * 0.8) {
        completeSlider();
      } else {
        resetSlider();
      }
      document.body.style.userSelect = "";
      dragging = false;
    };
  }

  if (pdfBtn) {
    pdfBtn.addEventListener("click", async () => {
      try {
        const scratchCard = document.querySelector(".scratch-card");
        const canvasImg = await html2canvas(scratchCard, { useCORS: true });
        const imgData = canvasImg.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvasImg.width, canvasImg.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvasImg.width, canvasImg.height);
        if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
          const url = pdf.output("bloburl");
          window.open(url, "_blank");
        } else {
          pdf.save("vale.pdf");
        }
      } catch (err) {
        console.error("Error al crear el PDF", err);
      }
    });
  }
});
