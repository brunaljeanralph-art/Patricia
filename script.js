document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const intro = document.getElementById("intro-screen");
    const popup = document.getElementById("welcome-popup");
    const continueBtn = document.getElementById("continueBtn");

    const musicBtn = document.getElementById("music-btn");
    const bgMusic = document.getElementById("bgMusic");
    const dingSound = document.getElementById("dingSound");

    const rand = (min, max) => Math.random() * (max - min) + min;

    // INTRO
    setTimeout(() => {
        if (intro) {
            intro.style.opacity = "0";

            setTimeout(() => {
                intro.style.display = "none";

                if (popup) {
                    popup.classList.remove("hidden");
                }

            }, 1000);
        }
    }, 3000);

    // POPUP
    if (continueBtn) {

        continueBtn.addEventListener("click", () => {

            if (dingSound) {
                dingSound.play();
            }

            popup.style.display = "none";

        });

    }

    // MUSIC
    if (musicBtn) {

        musicBtn.addEventListener("click", () => {

            bgMusic.play();

            musicBtn.innerHTML = "🎵 Musique activée";

            musicBtn.disabled = true;

        });

    }

    function createFloatingElement(className, emoji, left, duration, size) {

        const el = document.createElement("div");

        el.className = className;

        el.textContent = emoji;

        el.style.left = left + "vw";

        el.style.bottom = "-10vh";

        el.style.fontSize = size + "px";

        el.style.animationDuration = duration + "s";

        body.appendChild(el);

        setTimeout(() => {

            el.remove();

        }, duration * 1000);

    }

    function createHeart() {

        createFloatingElement(
            "heart",
            "❤️",
            rand(0,100),
            rand(8,14),
            rand(16,24)
        );

    }

    function createPetal() {

        createFloatingElement(
            "petal",
            "🌷",
            rand(0,100),
            rand(10,16),
            rand(16,28)
        );

    }

    function createConfetti() {

        const el = document.createElement("div");

        el.className = "confetti";

        el.style.left = rand(0,100) + "vw";

        el.style.top = "-2vh";

        el.style.animationDuration = rand(6,12) + "s";

        body.appendChild(el);

        setTimeout(() => {

            el.remove();

        },12000);

    }

    for(let i=0;i<6;i++){

        setTimeout(createHeart,i*350);

        setTimeout(createPetal,i*500);

    }

    for(let i=0;i<12;i++){

        setTimeout(createConfetti,i*250);

    }

    setInterval(createHeart,1800);

    setInterval(createPetal,2400);

    setInterval(createConfetti,900);

});

const dingSound = document.getElementById("dingSound");

function playDing() {
    dingSound.currentTime = 0;
    dingSound.play().catch(err => {
        console.log(err);
    });
}
const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", () => {
    playDing();

    // lòt kòd ou yo...
});
