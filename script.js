document.addEventListener("DOMContentLoaded", () => {

function createHeart() {

const heart = document.createElement("img");

heart.src = "assets/heart.png";

heart.className = "heart";

heart.style.left = Math.random() * 100 + "vw";

heart.style.animationDuration = (8 + Math.random() * 5) + "s";

heart.style.width = (18 + Math.random() * 18) + "px";

document.body.appendChild(heart);

setTimeout(() => {
heart.remove();
}, 13000);

}

setInterval(createHeart, 1200);

function createPetal() {

const petal = document.createElement("img");

petal.src = "assets/petal.png";

petal.className = "petal";

petal.style.left = Math.random() * 100 + "vw";

petal.style.animationDuration = (10 + Math.random() * 6) + "s";

petal.style.width = (18 + Math.random() * 16) + "px";

document.body.appendChild(petal);

setTimeout(() => {
petal.remove();
}, 16000);

}

setInterval(createPetal, 900);function createConfetti() {

const confetti = document.createElement("div");

confetti.className = "confetti";

confetti.style.left = Math.random() * 100 + "vw";

confetti.style.animationDuration = (6 + Math.random() * 5) + "s";

confetti.style.opacity = Math.random();

document.body.appendChild(confetti);

setTimeout(() => {
confetti.remove();
}, 12000);

}

setInterval(createConfetti, 700);

const card = document.querySelector(".card");

card.style.opacity = "0";
card.style.transform = "translateY(40px)";

setTimeout(() => {
card.style.transition = "all 1.2s ease";
card.style.opacity = "1";
card.style.transform = "translateY(0)";
}, 300);

const button = document.querySelector(".btn");

button.addEventListener("mouseenter", () => {

button.style.transform = "scale(1.05)";

});

button.addEventListener("mouseleave", () => {

button.style.transform = "scale(1)";

});window.addEventListener("load", () => {

const title = document.querySelector("h1");

title.animate(
[
{ opacity: 0, transform: "translateY(-20px)" },
{ opacity: 1, transform: "translateY(0)" }
],
{
duration: 1500,
easing: "ease-out"
}
);

const letter = document.querySelector(".letter");

letter.animate(
[
{ opacity: 0, transform: "translateY(30px)" },
{ opacity: 1, transform: "translateY(0)" }
],
{
duration: 1800,
easing: "ease-out"
}
);

});

});
