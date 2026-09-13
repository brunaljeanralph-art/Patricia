document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    const intro =
        document.getElementById(
            "intro-screen"
        );

    const welcome =
        document.getElementById(
            "welcome-popup"
        );

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );

    const musicBtn =
        document.getElementById(
            "music-btn"
        );

    const bgMusic =
        document.getElementById(
            "bgMusic"
        );

    const ding =
        document.getElementById(
            "dingSound"
        );


    /* =========================================================
       HELPERS
       ========================================================= */

    function show(element) {

        if (!element) {
            return;
        }

        element.classList.remove(
            "hidden"
        );

        element.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function hide(element) {

        if (!element) {
            return;
        }

        element.classList.add(
            "hidden"
        );

        element.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    function playSound(audio, volume = .5) {

        if (!audio) {
            return;
        }

        try {

            audio.currentTime =
                0;

            audio.volume =
                volume;

            const promise =
                audio.play();

            if (
                promise &&
                typeof promise.catch ===
                "function"
            ) {

                promise.catch(
                    () => {}
                );
            }

        } catch (_) {}
    }


    /* =========================================================
       MAIN MUSIC
       ========================================================= */

    let musicEnabled =
        false;


    function updateMusicButton() {

        if (!musicBtn) {
            return;
        }

        musicBtn.textContent =
            musicEnabled
                ? "🔊 Musique activée"
                : "🎵 Activer la musique";
    }


    async function enableMainMusic() {

        if (!bgMusic) {
            return;
        }

        try {

            bgMusic.volume =
                .58;

            await bgMusic.play();

            musicEnabled =
                true;

            updateMusicButton();

        } catch (_) {

            musicEnabled =
                false;

            updateMusicButton();
        }
    }


    function disableMainMusic() {

        if (!bgMusic) {
            return;
        }

        try {

            bgMusic.pause();

        } catch (_) {}


        musicEnabled =
            false;

        updateMusicButton();
    }


    if (musicBtn) {

        musicBtn.addEventListener(
            "click",
            () => {

                if (
                    musicEnabled
                ) {

                    disableMainMusic();

                } else {

                    enableMainMusic();
                }
            }
        );
    }


    updateMusicButton();


    /* =========================================================
       INTRO
       ========================================================= */

    function startIntro() {

        if (!intro) {
            show(welcome);
            return;
        }


        show(intro);


        window.setTimeout(
            () => {

                hide(intro);

                window.setTimeout(
                    () => {

                        show(welcome);

                    },
                    350
                );

            },
            1700
        );
    }


    /* =========================================================
       CONTINUE
       ========================================================= */

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            async () => {

                playSound(
                    ding,
                    .38
                );


                hide(welcome);


                /*
                    Le clic utilisateur autorise le navigateur
                    à lancer la musique principale.
                */

                await enableMainMusic();


                /*
                    Experience.js écoute seulement son propre système.
                    On lui laisse créer son cinematic layer.
                */

                window.setTimeout(
                    () => {

                        if (
                            !document.getElementById(
                                "px-experience"
                            )
                        ) {

                            /*
                                Aucun double système.
                                experience.js s'occupe lui-même
                                de construire l'expérience.
                            */

                            document.body.dispatchEvent(
                                new Event(
                                    "patricia-experience-start"
                                )
                            );
                        }

                    },
                    250
                );
            }
        );
    }


    /* =========================================================
       SMALL BACKGROUND EFFECTS
       ========================================================= */

    const hearts =
        document.getElementById(
            "hearts-container"
        );

    const petals =
        document.getElementById(
            "petals-container"
        );

    const stars =
        document.getElementById(
            "stars"
        );


    function makeFloatingHeart() {

        if (!hearts) {
            return;
        }


        const el =
            document.createElement(
                "span"
            );


        el.textContent =
            Math.random() > .5
                ? "♡"
                : "♥";


        el.style.position =
            "absolute";

        el.style.left =
            `${Math.random() * 100}%`;

        el.style.bottom =
            "-30px";

        el.style.opacity =
            `${.15 + Math.random() * .35}`;

        el.style.fontSize =
            `${10 + Math.random() * 14}px`;

        el.style.animation =
            `heartFloat ${
                8 + Math.random() * 7
            }s linear forwards`;


        hearts.appendChild(el);


        window.setTimeout(
            () => el.remove(),
            16000
        );
    }


    function makePetal() {

        if (!petals) {
            return;
        }


        const el =
            document.createElement(
                "span"
            );


        el.textContent =
            "✦";


        el.style.position =
            "absolute";

        el.style.left =
            `${Math.random() * 100}%`;

        el.style.top =
            "-25px";

        el.style.opacity =
            `${.10 + Math.random() * .24}`;

        el.style.fontSize =
            `${7 + Math.random() * 9}px`;

        el.style.animation =
            `petalFall ${
                8 + Math.random() * 6
            }s linear forwards`;


        petals.appendChild(el);


        window.setTimeout(
            () => el.remove(),
            15000
        );
    }


    function injectBackgroundAnimations() {

        if (
            document.getElementById(
                "px-general-animations"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "px-general-animations";


        style.textContent = `
            @keyframes heartFloat {
                0% {
                    transform: translate3d(0, 0, 0) scale(.8);
                }

                50% {
                    transform: translate3d(14px, -45vh, 0) scale(1);
                }

                100% {
                    transform: translate3d(-10px, -105vh, 0) scale(.9);
                }
            }

            @keyframes petalFall {
                0% {
                    transform: translate3d(0, 0, 0) rotate(0deg);
                }

                100% {
                    transform: translate3d(80px, 110vh, 0) rotate(280deg);
                }
            }
        `;


        document.head.appendChild(
            style
        );
    }


    injectBackgroundAnimations();


    /*
        Ti kantite sèlman.
        Nou pa vle chaje telefòn nan.
    */

    if (
        hearts &&
        petals &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        let heartTimer =
            window.setInterval(
                makeFloatingHeart,
                2300
            );


        let petalTimer =
            window.setInterval(
                makePetal,
                3100
            );


        window.addEventListener(
            "beforeunload",
            () => {

                clearInterval(
                    heartTimer
                );

                clearInterval(
                    petalTimer
                );
            }
        );
    }


    /* =========================================================
       EXPERIENCE START SIGNAL
       ========================================================= */

    document.body.addEventListener(
        "patricia-experience-start",
        () => {

            /*
                experience.js est déjà chargé par index.html.
                Son DOMContentLoaded a initialisé son système.
                Cette fonction sert surtout de point de synchronisation
                sans créer une deuxième expérience.
            */

            document.body.classList.add(
                "px-ready-for-experience"
            );
        }
    );


    /* =========================================================
       START
       ========================================================= */

    startIntro();

});