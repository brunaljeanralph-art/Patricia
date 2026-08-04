// script.js
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function createFloatingElement(className, text, left, duration, size) {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = text;
    el.style.left = `${left}vw`;
    el.style.bottom = "-10vh";
    el.style.fontSize = `${size}px`;
    el.style.animationDuration = `${duration}s`;
    body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  function createHeart() {
    createFloatingElement("heart", "❤️", rand(0, 100), rand(8, 14), rand(16, 24));
  }

  function createPetal() {
    createFloatingElement("petal", "🌷", rand(0, 100), rand(10, 16), rand(16, 28));
  }

  function createConfetti() {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = `${rand(0, 100)}vw`;
    el.style.top = "-2vh";
    el.style.animationDuration = `${rand(6, 12)}s`;
    el.style.transform = `translateX(${rand(-20, 20)}px)`;
    body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 12000);
  }

  for (let i = 0; i < 6; i++) {
    setTimeout(createHeart, i * 350);
    setTimeout(createPetal, i * 500);
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(createConfetti, i * 250);
  }

  setInterval(createHeart, 1800);
  setInterval(createPetal, 2400);
  setInterval(createConfetti, 900);
});
