document.addEventListener("DOMContentLoaded", () => {
  // Small interaction only: keep the page fast and clean.
  // Links themselves open WhatsApp, Email and Instagram directly.
  document.querySelectorAll(".action").forEach((button) => {
    button.addEventListener("click", () => {
      button.style.opacity = "0.88";
      setTimeout(() => {
        button.style.opacity = "";
      }, 180);
    });
  });
});
