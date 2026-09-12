/* =========================================================
   PATRICIA ❤️ — PREMIUM INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const musicBtn =
        document.getElementById("music-btn");

    const music =
        document.getElementById("bgMusic");

    const ding =
        document.getElementById("dingSound");

    const heartsContainer =
        document.getElementById("hearts-container");

    const petalsContainer =
        document.getElementById("petals-container");

    const confettiContainer =
        document.getElementById("confetti-container");


    /* =====================================================
       MUSIC
       ===================================================== */

    let musicPlaying = false;


    function updateMusicButton() {

        if (!musicBtn) {
            return;
        }


        if (musicPlaying) {

            musicBtn.textContent =
                "🔊 Musique";

            musicBtn.setAttribute(
                "aria-pressed",
                "true"
            );

        } else {

            musicBtn.textContent =
                "🔇 Musique";

            musicBtn.setAttribute(
                "aria-pressed",
                "false"
            );
        }
    }


    function startMusic() {

        if (!music) {
            return;
        }


        try {

            music.volume = .35;

            const playPromise =
                music.play();


            if (
                playPromise &&
                typeof playPromise.then ===
                    "function"
            ) {

                playPromise
                    .then(() => {

                        musicPlaying =
                            true;

                        updateMusicButton();

                    })
                    .catch(() => {

                        musicPlaying =
                            false;

                        updateMusicButton();

                    });
            }

        } catch (error) {

            musicPlaying = false;

            updateMusicButton();
        }
    }


    function stopMusic() {

        if (!music) {
            return;
        }


        try {

            music.pause();

        } catch (error) {

            /* Rien */
        }


        musicPlaying = false;

        updateMusicButton();
    }


    if (music) {

        music.volume = .35;


        music.addEventListener(
            "play",
            () => {

                musicPlaying = true;

                updateMusicButton();

            }
        );


        music.addEventListener(
            "pause",
            () => {

                musicPlaying = false;

                updateMusicButton();

            }
        );


        music.addEventListener(
            "error",
            () => {

                musicPlaying = false;

                updateMusicButton();

            }
        );
    }


    if (musicBtn) {

        updateMusicButton();


        musicBtn.addEventListener(
            "click",
            () => {

                if (musicPlaying) {

                    stopMusic();

                } else {

                    startMusic();
                }
            }
        );
    }


    /* =====================================================
       DING
       ===================================================== */

    window.playDing = function () {

        if (!ding) {
            return;
        }


        try {

            ding.currentTime = 0;

            const dingPromise =
                ding.play();


            if (
                dingPromise &&
                typeof dingPromise.catch ===
                    "function"
            ) {

                dingPromise.catch(
                    () => {}
                );
            }

        } catch (error) {

            /* Audio optionnel */
        }
    };


    /* =====================================================
       FLOATING HEARTS ❤️
       ===================================================== */

    function createHearts() {

        if (!heartsContainer) {
            return;
        }


        const heartSymbols = [
            "❤️",
            "💗",
            "💜",
            "💕",
            "🤗",
            "🤭"
        ];


        const amount = 12;

        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const heart =
                document.createElement(
                    "div"
                );


            heart.className =
                "heart";


            heart.textContent =
                heartSymbols[
                    Math.floor(
                        Math.random() *
                        heartSymbols.length
                    )
                ];


            heart.style.left =
                Math.random() *
                100 +
                "vw";


            heart.style.animationDuration =
                (
                    10 +
                    Math.random() * 10
                ) +
                "s";


            heart.style.animationDelay =
                (
                    -Math.random() * 15
                ) +
                "s";


            heart.style.fontSize =
                (
                    14 +
                    Math.random() * 12
                ) +
                "px";


            fragment.appendChild(
                heart
            );
        }


        heartsContainer.appendChild(
            fragment
        );
    }


    createHearts();


    /* =====================================================
       FALLING FLOWERS / PETALS 🌸
       ===================================================== */

    function createFallingFlowers() {

        if (!petalsContainer) {
            return;
        }


        const flowerSymbols = [
            "🌸",
            "❀",
            "✿",
            "🌷",
            "💮"
        ];


        const amount = 14;

        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const petal =
                document.createElement(
                    "div"
                );


            petal.className =
                "petal";


            petal.textContent =
                flowerSymbols[
                    Math.floor(
                        Math.random() *
                        flowerSymbols.length
                    )
                ];


            petal.style.left =
                Math.random() *
                100 +
                "vw";


            petal.style.animationDuration =
                (
                    10 +
                    Math.random() * 12
                ) +
                "s";


            petal.style.animationDelay =
                (
                    -Math.random() * 18
                ) +
                "s";


            petal.style.fontSize =
                (
                    13 +
                    Math.random() * 12
                ) +
                "px";


            petal.style.opacity =
                (
                    .35 +
                    Math.random() * .30
                ).toFixed(2);


            fragment.appendChild(
                petal
            );
        }


        petalsContainer.appendChild(
            fragment
        );
    }


    createFallingFlowers();


    /* =====================================================
       CONFETTI ✨
       ===================================================== */

    function createConfetti() {

        if (!confettiContainer) {
            return;
        }


        const amount = 12;

        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const confetti =
                document.createElement(
                    "div"
                );


            confetti.className =
                "confetti";


            confetti.style.left =
                Math.random() *
                100 +
                "vw";


            confetti.style.animationDuration =
                (
                    7 +
                    Math.random() * 8
                ) +
                "s";


            confetti.style.animationDelay =
                (
                    -Math.random() * 10
                ) +
                "s";


            fragment.appendChild(
                confetti
            );
        }


        confettiContainer.appendChild(
            fragment
        );
    }


    createConfetti();


    /* =====================================================
       IMAGE ERROR PROTECTION
       ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-unavailable"
                    );

                }
            );

        }
    );

});