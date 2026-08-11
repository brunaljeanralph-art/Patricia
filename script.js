/* =========================================================
   PATRICIA ❤️ — PREMIUM INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const introScreen =
        document.getElementById("intro-screen");

    const openSurpriseBtn =
        document.getElementById("openSurpriseBtn");

    const welcomePopup =
        document.getElementById("welcome-popup");

    const continueBtn =
        document.getElementById("continueBtn");

    const musicBtn =
        document.getElementById("music-btn");

    const music =
        document.getElementById("bgMusic");

    const ding =
        document.getElementById("dingSound");


    /* =====================================================
       OUVRIR LA SURPRISE
       ===================================================== */

    let surpriseOpened = false;

    function openSurprise(){

        if(
            surpriseOpened ||
            !introScreen
        ){
            return;
        }

        surpriseOpened = true;

        introScreen.classList.add(
            "hide-intro"
        );

        introScreen.setAttribute(
            "aria-hidden",
            "true"
        );

        setTimeout(() => {

            if(welcomePopup){

                welcomePopup.classList.remove(
                    "hidden"
                );

                welcomePopup.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }, 650);
    }


    if(openSurpriseBtn){

        openSurpriseBtn.addEventListener(
            "click",
            openSurprise
        );

    }


    /* =====================================================
       FULL PAGE BACKGROUND HEIGHT
       ===================================================== */

    const background =
        document.querySelector(".background");

    function resizeBackground(){

        if(!background){
            return;
        }

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

        petal.className =
            "petal";

        petal.textContent =
            "🌸";

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
       AUDIO SETUP
       ===================================================== */

    if(music){

        music.loop = true;
        music.volume = 0.35;

    }

    if(ding){

        ding.volume = 0.65;

    }


    /* =====================================================
       CONTINUE BUTTON
       ===================================================== */

    if(continueBtn){

        continueBtn.addEventListener(
            "click",
            () => {

                if(ding){

                    ding.currentTime = 0;

                    ding.play().catch(
                        () => {}
                    );

                }

                if(music){

                    music.play().catch(
                        () => {}
                    );

                }

                if(welcomePopup){

                    welcomePopup.classList.add(
                        "hidden"
                    );

                    welcomePopup.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                }

                resizeBackground();

            }
        );

    }


    /* =====================================================
       MUSIC BUTTON
       ===================================================== */

    let playing = false;

    if(musicBtn){

        musicBtn.textContent =
            "🔇 Musique";

        musicBtn.addEventListener(
            "click",
            () => {

                if(!music){
                    return;
                }

                if(!playing){

                    music.play()
                        .then(() => {

                            playing = true;

                            musicBtn.textContent =
                                "🔊 Musique";

                        })
                        .catch(
                            () => {}
                        );

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


    /* =====================================================
       FINAL PAGE READY
       ===================================================== */

    setTimeout(
        resizeBackground,
        100
    );

});