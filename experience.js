const afterYes = document.getElementById("px-after-yes");
const continueBtn = document.getElementById("px-continue");
const lastSecret = document.getElementById("px-last-secret");
const openLetter = document.getElementById("px-open-letter");

const dingSound = new Audio("assets/ding.mp3");
dingSound.preload = "auto";

function playDing() {
    try {
        dingSound.currentTime = 0;
        dingSound.volume = 0.65;
        dingSound.play().catch(() => {});
    } catch (e) {}
}