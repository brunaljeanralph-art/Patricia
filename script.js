/* =========================================================
   PATRICIA ❤️ — PREMIUM INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


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

    const background =
        document.querySelector(".background");

    const heartsContainer =
        document.getElementById("hearts-container");

    const petalsContainer =
        document.getElementById("petals-container");

    const confettiContainer =
        document.getElementById("confetti-container");


    /* =====================================================
       INTRO → OPEN SURPRISE
       ===================================================== */

    function openSurprise(){

        if(!introScreen){
            return;
        }

        introScreen.classList.add(
            "hide-intro"
        );

        /*
         * Apre transition intro a fini,
         * nou montre popup la.
         */

        window.setTimeout(() => {

            if(welcomePopup){

                welcomePopup.classList.remove(
                    "hidden"
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
       POPUP → CONTINUE
       ===================================================== */

    function closeWelcomePopup(){

        if(!welcomePopup){
            return;
        }

        welcomePopup.classList.add(
            "hidden"
        );
    }


    if(continueBtn){

        continueBtn.addEventListener(
            "click",
            () => {

                /*
                 * Petit son
                 */

                if(ding){

                    try{

                        ding.currentTime = 0;

                        const dingPromise =
                            ding.play();

                        if(
                            dingPromise &&
                            typeof dingPromise.catch === "function"
                        ){
                            dingPromise.catch(
                                () => {}
                            );
                        }

                    }catch(error){
                        /* Audio optionnel */
                    }

                }


                /*
                 * Ferme popup la.
                 */

                closeWelcomePopup();


                /*
                 * Eseye lanse mizik la apre
                 * aksyon itilizatè a.
                 */

                startMusic();

            }
        );

    }


    /* =====================================================
       MUSIC
       ===================================================== */

    let musicPlaying = false;


    function updateMusicButton(){

        if(!musicBtn){
            return;
        }

        if(musicPlaying){

            musicBtn.textContent =
                "🔊 Musique";

            musicBtn.setAttribute(
                "aria-pressed",
                "true"
            );

        }else{

            musicBtn.textContent =
                "🔇 Musique";

            musicBtn.setAttribute(
                "aria-pressed",
                "false"
            );

        }
    }


    function startMusic(){

        if(!music){
            return;
        }

        try{

            music.volume = 0.35;

            const playPromise =
                music.play();

            if(
                playPromise &&
                typeof playPromise.then === "function"
            ){

                playPromise
                    .then(() => {

                        musicPlaying = true;

                        updateMusicButton();

                    })
                    .catch(() => {

                        musicPlaying = false;

                        updateMusicButton();

                    });

            }

        }catch(error){

            musicPlaying = false;

            updateMusicButton();

        }
    }


    function stopMusic(){

        if(!music){
            return;
        }

        try{

            music.pause();

        }catch(error){
            /* Rien */
        }

        musicPlaying = false;

        updateMusicButton();
    }


    if(music){

        music.volume = 0.35;

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

    }


    if(musicBtn){

        updateMusicButton();

        musicBtn.addEventListener(
            "click",
            () => {

                if(musicPlaying){

                    stopMusic();

                }else{

                    startMusic();

                }

            }
        );

    }


    /* =====================================================
       POPUP ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if(event.key === "Escape"){

                if(
                    welcomePopup &&
                    !welcomePopup.classList.contains(
                        "hidden"
                    )
                ){

                    closeWelcomePopup();

                }

            }

        }
    );


    /* =====================================================
       BACKGROUND HEIGHT
       ===================================================== */

    function resizeBackground(){

        if(!background){
            return;
        }

        /*
         * Background la fixed, kidonk nou pa bezwen
         * lonje imaj la dapre longè tèks la.
         *
         * Sa anpeche background.png defòme.
         */

        background.style.height =
            "100%";
    }


    resizeBackground();

    window.addEventListener(
        "resize",
        resizeBackground,
        { passive:true }
    );


    window.addEventListener(
        "load",
        resizeBackground,
        { passive:true }
    );


    /* =====================================================
       FLOATING HEARTS ❤️
       ===================================================== */

    function createHearts(){

        if(!heartsContainer){
            return;
        }

        const heartSymbols = [
            "❤️",
            "💗",
            "💜",
            "💕"
        ];

        /*
         * 12 = ase pou li bèl san li pa lou.
         */

        const amount = 12;

        const fragment =
            document.createDocumentFragment();

        for(let i = 0; i < amount; i++){

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
                (
                    10 +
                    Math.random() * 10
                ) + "s";

            heart.style.animationDelay =
                (
                    -Math.random() * 15
                ) + "s";

            heart.style.fontSize =
                (
                    14 +
                    Math.random() * 12
                ) + "px";

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

    function createFallingFlowers(){

        if(!petalsContainer){
            return;
        }

        /*
         * Plizyè siy diferan pou dekorasyon an
         * pa sanble ak yon sèl emoji ki repete.
         */

        const flowerSymbols = [
            "🌸",
            "❀",
            "✿",
            "🌷",
            "💮"
        ];

        /*
         * 14 eleman sèlman pou mobil pa soufri.
         */

        const amount = 14;

        const fragment =
            document.createDocumentFragment();

        for(let i = 0; i < amount; i++){

            const petal =
                document.createElement("div");

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
                Math.random() * 100 + "vw";

            petal.style.animationDuration =
                (
                    10 +
                    Math.random() * 12
                ) + "s";

            petal.style.animationDelay =
                (
                    -Math.random() * 18
                ) + "s";

            petal.style.fontSize =
                (
                    13 +
                    Math.random() * 12
                ) + "px";

            /*
             * Chak flè gen ti transparans diferan.
             */

            petal.style.opacity =
                (
                    0.35 +
                    Math.random() * 0.30
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
       GOLD CONFETTI ✨
       ===================================================== */

    function createConfetti(){

        if(!confettiContainer){
            return;
        }

        const amount = 12;

        const fragment =
            document.createDocumentFragment();

        for(let i = 0; i < amount; i++){

            const confetti =
                document.createElement("div");

            confetti.className =
                "confetti";

            confetti.style.left =
                Math.random() * 100 + "vw";

            confetti.style.animationDuration =
                (
                    7 +
                    Math.random() * 8
                ) + "s";

            confetti.style.animationDelay =
                (
                    -Math.random() * 10
                ) + "s";

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
       PREVENT AUDIO ERRORS
       ===================================================== */

    if(music){

        music.addEventListener(
            "error",
            () => {

                musicPlaying = false;

                updateMusicButton();

            }
        );

    }


    if(ding){

        ding.addEventListener(
            "error",
            () => {
                /* Son optionnel — pa bloke paj la */
            }
        );

    }


    /* =====================================================
       IMAGE ERROR PROTECTION
       ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );

    images.forEach(
        (image) => {

            image.addEventListener(
                "error",
                () => {

                    /*
                     * Si tulip.png pa disponib,
                     * paj la kontinye mache.
                     */

                    image.classList.add(
                        "image-unavailable"
                    );

                }
            );

        }
    );


    /* =====================================================
       MUTATION OBSERVER
       ===================================================== */

    /*
     * Nou pa itilize observer la pou tout bagay,
     * paske sa ta ka kreye anpil recalcul inutil.
     *
     * Li rete sèlman pou verifye si popup/dekorasyon
     * ajoute yon bagay ki chanje layout.
     */

    if(
        typeof MutationObserver !== "undefined" &&
        document.body
    ){

        const observer =
            new MutationObserver(
                () => {

                    resizeBackground();

                }
            );

        observer.observe(
            document.body,
            {
                childList:true,
                subtree:true
            }
        );

    }


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateMusicButton();

});