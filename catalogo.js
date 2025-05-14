document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked");
  });
});

// Pop-up efecto scroll: resalta el card visible
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  },
  {
    threshold: 0.6, // Ajusta cuánta parte debe estar visible
  }
);

cards.forEach((card) => observer.observe(card));
