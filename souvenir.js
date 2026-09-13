document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    const stage =
        document.getElementById("px-photo-stage");

    const photo =
        document.getElementById("px-memory-photo");

    const frame =
        document.getElementById("px-photo-frame");

    const caption =
        document.getElementById("px-memory-caption");

    const count =
        document.getElementById("px-flow-count");

    const progress =
        document.getElementById("px-photo-progress-bar");

    const loader =
        document.getElementById("px-photo-loader");

    const pauseHint =
        document.getElementById("px-pause-hint");

    const souvenirSection =
        document.getElementById("souvenirs");


    if (
        !stage ||
        !photo ||
        !frame ||
        !caption ||
        !count ||
        !progress ||
        !souvenirSection
    ) {
        return;
    }


    /* =========================================================
       SETTINGS
       ========================================================= */

    const TOTAL_PHOTOS = 42;

    const ENTER_TIME = 1100;
    const HOLD_TIME = 7000;
    const LEAVE_TIME = 900;

    /*
       IMPORTANT

       Non fichye yo gen yon espas:

       assets/photo 01.jpg
       assets/photo 02.jpg
       ...
       assets/photo 42.jpg
    */

    const PHOTO_PATH =
        "assets/photo ";


    /* =========================================================
       STATE
       ========================================================= */

    let currentPhoto = 1;

    let phase = "idle";

    let phaseStart = 0;

    let pauseStarted = 0;

    let isPaused = false;

    let animationFrame = null;

    let imageToken = 0;

    let started = false;

    let transitioning = false;


    /* =========================================================
       HELPERS
       ========================================================= */

    function photoNumber(number) {

        return String(number)
            .padStart(2, "0");
    }


    function photoSrc(number) {

        return (
            PHOTO_PATH +
            photoNumber(number) +
            ".jpg"
        );
    }


    function updateCounter() {

        count.textContent =
            `${photoNumber(currentPhoto)} / ${TOTAL_PHOTOS}`;

        caption.textContent =
            `Souvenir ${photoNumber(currentPhoto)}`;

        photo.alt =
            `Souvenir ${currentPhoto} sur ${TOTAL_PHOTOS}`;
    }


    function setProgress(value) {

        const safe =
            Math.max(
                0,
                Math.min(
                    100,
                    value
                )
            );

        progress.style.width =
            `${safe}%`;
    }


    function setLoading(state) {

        if (!loader) {
            return;
        }

        loader.classList.toggle(
            "is-loading",
            state
        );
    }


    /* =========================================================
       IMAGE LOADING
       ========================================================= */

    function preloadImage(number) {

        return new Promise(
            (resolve, reject) => {

                const img =
                    new Image();

                img.decoding =
                    "async";


                img.onload =
                    async () => {

                        try {

                            if (
                                typeof img.decode ===
                                "function"
                            ) {

                                await img.decode();

                            }

                        } catch (_) {}


                        resolve(img);

                    };


                img.onerror = () => {

                    reject(
                        new Error(
                            `Impossible de charger ${photoSrc(number)}`
                        )
                    );

                };


                img.src =
                    photoSrc(number);
            }
        );
    }


    function preloadNextPhoto() {

        let next =
            currentPhoto + 1;


        if (
            next >
            TOTAL_PHOTOS
        ) {
            next = 1;
        }


        const img =
            new Image();


        img.decoding =
            "async";


        img.src =
            photoSrc(next);
    }


    async function showPhoto(number) {

        const token =
            ++imageToken;


        setLoading(true);


        try {

            const loaded =
                await preloadImage(number);


            if (
                token !== imageToken
            ) {
                return false;
            }


            photo.src =
                loaded.src;


            currentPhoto =
                number;


            updateCounter();

            setLoading(false);

            preloadNextPhoto();


            return true;

        } catch (error) {

            if (
                token !== imageToken
            ) {
                return false;
            }


            console.warn(
                "Souvenir introuvable",
                error
            );


            setLoading(false);

            return false;
        }
    }


    /* =========================================================
       FALLBACK
       ========================================================= */

    async function findNextAvailablePhoto() {

        for (
            let offset = 1;
            offset <= TOTAL_PHOTOS;
            offset++
        ) {

            let candidate =
                currentPhoto + offset;


            while (
                candidate >
                TOTAL_PHOTOS
            ) {

                candidate -=
                    TOTAL_PHOTOS;
            }


            const loaded =
                await showPhoto(
                    candidate
                );


            if (loaded) {
                return candidate;
            }
        }


        return null;
    }


    /* =========================================================
       PHASE STYLES
       ========================================================= */

    function applyPhaseStyles(
        elapsed
    ) {

        if (
            phase === "enter"
        ) {

            const p =
                Math.min(
                    1,
                    Math.max(
                        0,
                        elapsed / ENTER_TIME
                    )
                );


            const eased =
                1 -
                Math.pow(
                    1 - p,
                    3
                );


            frame.style.transform =
                `translate3d(0, ${
                    110 -
                    (110 * eased)
                }%, 0) scale(${
                    .965 +
                    eased * .035
                })`;


            frame.style.opacity =
                String(eased);


            setProgress(
                eased * 15
            );


            return;
        }


        if (
            phase === "hold"
        ) {

            const p =
                Math.min(
                    1,
                    Math.max(
                        0,
                        elapsed / HOLD_TIME
                    )
                );


            const breathing =
                Math.sin(
                    p * Math.PI
                ) * .006;


            frame.style.transform =
                `translate3d(0,0,0) scale(${
                    1 + breathing
                })`;


            frame.style.opacity =
                "1";


            setProgress(
                15 +
                p * 70
            );


            return;
        }


        if (
            phase === "leave"
        ) {

            const p =
                Math.min(
                    1,
                    Math.max(
                        0,
                        elapsed / LEAVE_TIME
                    )
                );


            const eased =
                p * p;


            frame.style.transform =
                `translate3d(0,${
                    -110 * eased
                }%,0) scale(${
                    1 -
                    eased * .035
                })`;


            frame.style.opacity =
                String(
                    1 - eased
                );


            setProgress(
                85 +
                eased * 15
            );
        }
    }


    function startPhase(name) {

        phase =
            name;

        phaseStart =
            performance.now();


        frame.style.transition =
            "none";


        if (
            name === "enter"
        ) {

            frame.style.transform =
                "translate3d(0,110%,0) scale(.965)";

            frame.style.opacity =
                "0";
        }


        if (
            name === "hold"
        ) {

            frame.style.transform =
                "translate3d(0,0,0) scale(1)";

            frame.style.opacity =
                "1";
        }
    }


    /* =========================================================
       NEXT PHOTO
       ========================================================= */

    async function moveToNextPhoto() {

        if (transitioning) {
            return;
        }


        transitioning =
            true;

        phase =
            "loading";


        let next =
            currentPhoto + 1;


        if (
            next >
            TOTAL_PHOTOS
        ) {
            next = 1;
        }


        let loaded =
            await showPhoto(next);


        if (!loaded) {

            const fallback =
                await findNextAvailablePhoto();


            loaded =
                fallback !== null;
        }


        if (loaded) {

            startPhase(
                "enter"
            );

        } else {

            phase =
                "idle";
        }


        transitioning =
            false;
    }


    /* =========================================================
       START
       ========================================================= */

    async function startPhotoFlow() {

        if (started) {
            return;
        }


        started =
            true;


        currentPhoto =
            1;


        updateCounter();


        const loaded =
            await showPhoto(
                currentPhoto
            );


        if (!loaded) {

            started =
                false;

            return;
        }


        stage.classList.add(
            "is-gallery-active"
        );


        startPhase(
            "enter"
        );


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );
        }


        animationFrame =
            requestAnimationFrame(
                tick
            );
    }


    /* =========================================================
       LOOP
       ========================================================= */

    function tick(now) {

        if (
            isPaused
        ) {

            animationFrame =
                requestAnimationFrame(
                    tick
                );

            return;
        }


        if (
            phase === "loading" ||
            phase === "idle"
        ) {

            animationFrame =
                requestAnimationFrame(
                    tick
                );

            return;
        }


        const elapsed =
            now - phaseStart;


        if (
            phase === "enter"
        ) {

            applyPhaseStyles(
                elapsed
            );


            if (
                elapsed >=
                ENTER_TIME
            ) {

                startPhase(
                    "hold"
                );
            }

        } else if (
            phase === "hold"
        ) {

            applyPhaseStyles(
                elapsed
            );


            if (
                elapsed >=
                HOLD_TIME
            ) {

                startPhase(
                    "leave"
                );
            }

        } else if (
            phase === "leave"
        ) {

            applyPhaseStyles(
                elapsed
            );


            if (
                elapsed >=
                LEAVE_TIME
            ) {

                moveToNextPhoto();
            }
        }


        animationFrame =
            requestAnimationFrame(
                tick
            );
    }


    /* =========================================================
       PAUSE
       ========================================================= */

    function pauseFlow() {

        if (
            !started ||
            isPaused ||
            phase === "idle"
        ) {
            return;
        }


        isPaused =
            true;


        pauseStarted =
            performance.now();


        stage.classList.add(
            "is-paused"
        );


        if (pauseHint) {

            pauseHint.textContent =
                "Souvenir en pause ♡";
        }
    }


    /* =========================================================
       RESUME
       ========================================================= */

    function resumeFlow() {

        if (
            !started ||
            !isPaused
        ) {
            return;
        }


        const now =
            performance.now();


        const duration =
            now - pauseStarted;


        phaseStart +=
            duration;


        isPaused =
            false;


        stage.classList.remove(
            "is-paused"
        );


        if (pauseHint) {

            pauseHint.textContent =
                "Maintiens ton doigt pour garder ce souvenir un peu plus longtemps ♡";
        }
    }


    /* =========================================================
       POINTER
       ========================================================= */

    stage.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.isPrimary === false
            ) {
                return;
            }


            try {

                stage.setPointerCapture(
                    event.pointerId
                );

            } catch (_) {}


            pauseFlow();
        }
    );


    stage.addEventListener(
        "pointerup",
        (event) => {

            if (
                event.isPrimary === false
            ) {
                return;
            }


            try {

                stage.releasePointerCapture(
                    event.pointerId
                );

            } catch (_) {}


            resumeFlow();
        }
    );


    stage.addEventListener(
        "pointercancel",
        resumeFlow
    );


    stage.addEventListener(
        "pointerleave",
        () => {

            if (isPaused) {
                resumeFlow();
            }
        }
    );


    /* =========================================================
       PAGE VISIBILITY
       ========================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                pauseFlow();

            } else {

                resumeFlow();
            }
        }
    );


    /* =========================================================
       RETURN TO LETTER
       ========================================================= */

    const backToLetter =
        document.getElementById(
            "px-back-letter"
        );


    if (backToLetter) {

        backToLetter.addEventListener(
            "click",
            () => {

                if (
                    animationFrame
                ) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                    animationFrame =
                        null;
                }


                imageToken++;


                started =
                    false;

                isPaused =
                    false;

                transitioning =
                    false;

                phase =
                    "idle";


                stage.classList.remove(
                    "is-gallery-active",
                    "is-paused"
                );


                setLoading(
                    false
                );

                setProgress(
                    0
                );


                frame.style.transform =
                    "translate3d(0,110%,0) scale(.965)";


                frame.style.opacity =
                    "0";
            }
        );
    }


    /* =========================================================
       INTERSECTION OBSERVER
       ========================================================= */

    const observer =
        new IntersectionObserver(
            (entries) => {

                for (
                    const entry of entries
                ) {

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= .2
                    ) {

                        startPhotoFlow();

                        observer.disconnect();

                        break;
                    }
                }

            },
            {
                threshold: [
                    .2,
                    .35
                ]
            }
        );


    observer.observe(
        souvenirSection
    );


    /* =========================================================
       INITIAL
       ========================================================= */

    updateCounter();

    frame.style.transform =
        "translate3d(0,110%,0) scale(.965)";

    frame.style.opacity =
        "0";

    setProgress(0);

});