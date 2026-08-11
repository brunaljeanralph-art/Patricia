/* =========================================================
   PATRICIA ❤️ — PREMIUM INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       FULL PAGE BACKGROUND HEIGHT
       ===================================================== */

    const background =
        document.querySelector(".background");

    function resizeBackground(){

        if(!background) return;

        const height =
            Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                window.innerHeight
            );

        background.style.height =
            height + "px";
    }

    resizeBackground();

    window.addEventListener(
        "resize",
        resizeBackground
    );

    window.addEventListener(
        "load",
        resizeBackground
    );


    /* =====================================================
       FLOATING HEARTS ❤️
       ===================================================== */

    const heartSymbols = [
        "❤️",
        "💗",
        "💜",
        "💕"
    ];

    for(let i = 0; i < 12; i++){

        const heart =
            document.createElement("div");

        heart.className = "heart";

        heart.textContent =
            heartSymbols[
                Math.floor(
                    Math.random() *
                    heartSymbols.length
                )
            ];

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.animationDuration =
            (10 + Math.random() * 10) + "s";

        heart.style.animationDelay =
            (-Math.random() * 15) + "s";

        heart.style.fontSize =
            (14 + Math.random() * 12) + "px";

        document.body.appendChild(
            heart
        );
    }


    /* =====================================================
       FALLING PETALS 🌸
       ===================================================== */

    for(let i = 0; i < 10; i++){

        const petal =
            document.createElement("div");

        petal.className = "petal";

        petal.textContent = "🌸";

        petal.style.left =
            Math.random() * 100 + "vw";

        petal.style.animationDuration =
            (9 + Math.random() * 10) + "s";

        petal.style.animationDelay =
            (-Math.random() * 15) + "s";

        petal.style.fontSize =
            (14 + Math.random() * 10) + "px";

        document.body.appendChild(
            petal
        );
    }


    /* =====================================================
       GOLD CONFETTI ✨
       ===================================================== */

    for(let i = 0; i < 12; i++){

        const confetti =
            document.createElement("div");

        confetti.className =
            "confetti";

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.animationDuration =
            (7 + Math.random() * 8) + "s";

        confetti.style.animationDelay =
            (-Math.random() * 10) + "s";

        document.body.appendChild(
            confetti
        );
    }


    /* =====================================================
       AUDIO
       ===================================================== */

    const music =
        new Audio("assets/music.mp3");

    const ding =
        new Audio("assets/ding.mp3");

    music.loop = true;

    music.volume = 0.35;

    ding.volume = 0.65;


    /* =====================================================
       CONTINUE BUTTON
       ===================================================== */

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );

    if(continueBtn){

        continueBtn.addEventListener(
            "click",
            () => {

                /*
                 * Petit son
                 */

                ding.currentTime = 0;

                ding.play().catch(
                    () => {}
                );


                /*
                 * Musique
                 */

                music.play().catch(
                    () => {}
                );

            }
        );
    }


    /* =====================================================
       MUSIC BUTTON
       ===================================================== */

    const musicBtn =
        document.querySelector(
            ".music-btn"
        );

    if(musicBtn){

        let playing = false;

        musicBtn.textContent =
            "🔇 Musique";

        musicBtn.addEventListener(
            "click",
            () => {

                if(!playing){

                    music.play()
                        .then(() => {

                            playing = true;

                            musicBtn.textContent =
                                "🔊 Musique";

                        })
                        .catch(() => {});

                }else{

                    music.pause();

                    playing = false;

                    musicBtn.textContent =
                        "🔇 Musique";
                }
            }
        );
    }


    /* =====================================================
       POPUP
       ===================================================== */

    const popup =
        document.getElementById(
            "welcome-popup"
        );

    if(continueBtn && popup){

        continueBtn.addEventListener(
            "click",
            () => {

                popup.classList.add(
                    "hidden"
                );

            }
        );
    }


    /* =====================================================
       KEEP BACKGROUND CORRECT AFTER
       DYNAMIC CONTENT CHANGES
       ===================================================== */

    const observer =
        new MutationObserver(() => {

            resizeBackground();

        });

    observer.observe(
        document.body,
        {
            childList:true,
            subtree:true
        }
    );

});