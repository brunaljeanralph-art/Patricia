document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       ELEMENTS
       ========================================================= */

    const intro =
        document.getElementById(
            "particle-intro"
        );

    const canvas =
        document.getElementById(
            "particleCanvas"
        );

    const hint =
        document.getElementById(
            "particleHint"
        );


    const menu =
        document.getElementById(
            "experience-menu"
        );


    const openLetterChoice =
        document.getElementById(
            "openLetterChoice"
        );


    const openMemoryChoice =
        document.getElementById(
            "openMemoryChoice"
        );


    const returnToMenu =
        document.getElementById(
            "returnToExperienceMenu"
        );


    const experienceMusic =
        document.getElementById(
            "experienceMusic"
        );


    const bgMusic =
        document.getElementById(
            "bgMusic"
        );


    const ding =
        document.getElementById(
            "dingSound"
        );


    const letter =
        document.querySelector(
            "main.card"
        );


    const memoryBook =
        document.getElementById(
            "memory-book"
        );


    const memoryPhoto =
        document.getElementById(
            "memoryPhoto"
        );


    const memoryNumber =
        document.getElementById(
            "memoryNumber"
        );


    const souvenirPanel =
        document.getElementById(
            "souvenirPanel"
        );


    /* =========================================================
       SMALL HELPERS
       ========================================================= */

    function playDing() {

        if (!ding) {
            return;
        }


        try {

            ding.currentTime = 0;

            const promise =
                ding.play();


            if (
                promise &&
                typeof promise.catch ===
                    "function"
            ) {

                promise.catch(
                    () => {}
                );
            }

        } catch (error) {

            /* Son optionnel */
        }
    }


    function startMainMusic() {

        if (!bgMusic) {
            return;
        }


        try {

            bgMusic.volume = .35;

            const promise =
                bgMusic.play();


            if (
                promise &&
                typeof promise.catch ===
                    "function"
            ) {

                promise.catch(
                    () => {}
                );
            }

        } catch (error) {

            /* Audio optionnel */
        }
    }


    function startExperienceMusic() {

        if (!experienceMusic) {
            return;
        }


        try {

            experienceMusic.volume = .28;

            const promise =
                experienceMusic.play();


            if (
                promise &&
                typeof promise.catch ===
                    "function"
            ) {

                promise.catch(
                    () => {}
                );
            }

        } catch (error) {

            /* Audio optionnel */
        }
    }


    function fadeOutExperienceMusic() {

        if (!experienceMusic) {
            return;
        }


        const startVolume =
            experienceMusic.volume;


        const steps = 18;

        let step = 0;


        const fadeTimer =
            window.setInterval(() => {

                step++;


                experienceMusic.volume =
                    Math.max(
                        0,
                        startVolume *
                        (
                            1 -
                            step / steps
                        )
                    );


                if (
                    step >= steps
                ) {

                    window.clearInterval(
                        fadeTimer
                    );


                    try {

                        experienceMusic.pause();

                        experienceMusic.currentTime =
                            0;

                        experienceMusic.volume =
                            .28;

                    } catch (error) {

                        /* Rien */
                    }
                }

            }, 60);
    }


    /* =========================================================
       PARTICLE EXPERIENCE
       ========================================================= */

    if (intro && canvas) {

        const ctx =
            canvas.getContext("2d");


        let width = 0;

        let height = 0;

        let dpr = 1;


        let particles = [];

        let targetParticles = [];


        let particleState =
            "smoke";


        let particleText =
            "";


        let clickLocked =
            false;


        const smallScreen =
            window.innerWidth <= 480;


        const PARTICLE_COUNT =
            smallScreen
                ? 520
                : 760;


        function random(
            min,
            max
        ) {

            return (
                Math.random() *
                (max - min) +
                min
            );
        }


        function createParticle() {

            return {

                x:
                    random(
                        0,
                        width
                    ),

                y:
                    random(
                        height * .82,
                        height + 40
                    ),

                vx:
                    random(
                        -.45,
                        .45
                    ),

                vy:
                    random(
                        -1.65,
                        -.35
                    ),

                size:
                    random(
                        .7,
                        2.15
                    ),

                alpha:
                    random(
                        .28,
                        .82
                    ),

                drift:
                    random(
                        .0015,
                        .006
                    ),

                phase:
                    random(
                        0,
                        Math.PI * 2
                    ),

                tx: 0,

                ty: 0,

                color:
                    Math.random() > .5
                        ? "255,220,238"
                        : "255,255,255"
            };
        }


        function createParticles() {

            particles = [];


            for (
                let i = 0;
                i < PARTICLE_COUNT;
                i++
            ) {

                particles.push(
                    createParticle()
                );
            }
        }


        /* =====================================================
           HEART
           ===================================================== */

        function heartPoint(
            t,
            scale
        ) {

            const x =
                16 *
                Math.pow(
                    Math.sin(t),
                    3
                );


            const y =
                13 *
                    Math.cos(t)

                -

                5 *
                    Math.cos(
                        2 * t
                    )

                -

                2 *
                    Math.cos(
                        3 * t
                    )

                -

                Math.cos(
                    4 * t
                );


            return {

                x:
                    width / 2 +
                    x * scale,

                y:
                    height / 2 -
                    y * scale
            };
        }


        function createHeartTargets() {

            targetParticles = [];


            const scale =
                Math.min(
                    width,
                    height
                ) / 45;


            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                const t =
                    (
                        i /
                        particles.length
                    ) *
                    Math.PI *
                    2;


                const point =
                    heartPoint(
                        t,
                        scale
                    );


                const thickness =
                    random(
                        .78,
                        1.08
                    );


                targetParticles.push({

                    x:
                        width / 2 +
                        (
                            point.x -
                            width / 2
                        ) *
                        thickness,

                    y:
                        height / 2 +
                        (
                            point.y -
                            height / 2
                        ) *
                        thickness
                });
            }


            particles.forEach(
                (
                    particle,
                    index
                ) => {

                    particle.tx =
                        targetParticles[
                            index
                        ].x;

                    particle.ty =
                        targetParticles[
                            index
                        ].y;

                }
            );
        }


        /* =====================================================
           TEXT
           ===================================================== */

        function createTextTargets(
            text
        ) {

            targetParticles = [];


            const offscreen =
                document.createElement(
                    "canvas"
                );


            const offCtx =
                offscreen.getContext(
                    "2d"
                );


            const sampleWidth =
                Math.min(
                    width,
                    900
                );


            const sampleScale =
                sampleWidth /
                width;


            const sampleHeight =
                Math.max(
                    1,
                    Math.round(
                        height *
                        sampleScale
                    )
                );


            offscreen.width =
                sampleWidth;


            offscreen.height =
                sampleHeight;


            let fontSize;


            if (
                text ===
                "Je t'aime Sauveur Patricia"
            ) {

                /*
                 * TEXT REDUIT
                 * pou fraz final la
                 */

                fontSize =
                    Math.min(
                        sampleWidth * .105,
                        sampleHeight * .145,
                        92
                    );

            } else {

                fontSize =
                    Math.min(
                        sampleWidth * .17,
                        sampleHeight * .18,
                        125
                    );
            }


            offCtx.font =
                `600 ${fontSize}px Georgia`;


            offCtx.textAlign =
                "center";


            offCtx.textBaseline =
                "middle";


            offCtx.fillStyle =
                "#ffffff";


            offCtx.fillText(
                text,
                sampleWidth / 2,
                sampleHeight / 2
            );


            const image =
                offCtx.getImageData(
                    0,
                    0,
                    sampleWidth,
                    sampleHeight
                );


            const points = [];


            const step =
                Math.max(
                    3,
                    Math.floor(
                        sampleWidth / 210
                    )
                );


            for (
                let y = 0;
                y < sampleHeight;
                y += step
            ) {

                for (
                    let x = 0;
                    x < sampleWidth;
                    x += step
                ) {

                    const index =
                        (
                            y *
                            sampleWidth +
                            x
                        ) * 4;


                    if (
                        image.data[
                            index + 3
                        ] > 80
                    ) {

                        points.push({

                            x:
                                x /
                                sampleScale,

                            y:
                                y /
                                sampleScale
                        });
                    }
                }
            }


            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                if (
                    points.length
                ) {

                    const point =
                        points[
                            i %
                            points.length
                        ];


                    particles[i].tx =
                        point.x +
                        random(
                            -1.2,
                            1.2
                        );


                    particles[i].ty =
                        point.y +
                        random(
                            -1.2,
                            1.2
                        );
                }
            }
        }


        /* =====================================================
           SCATTER
           ===================================================== */

        function scatterParticles() {

            particles.forEach(
                particle => {

                    const angle =
                        Math.random() *
                        Math.PI *
                        2;


                    const force =
                        random(
                            3,
                            8
                        );


                    particle.vx +=
                        Math.cos(angle) *
                        force;


                    particle.vy +=
                        Math.sin(angle) *
                        force;

                }
            );
        }


        /* =====================================================
           RESIZE
           ===================================================== */

        function resizeCanvas() {

            dpr =
                Math.min(
                    window.devicePixelRatio ||
                    1,
                    2
                );


            width =
                window.innerWidth;


            height =
                window.innerHeight;


            canvas.width =
                width * dpr;


            canvas.height =
                height * dpr;


            canvas.style.width =
                width + "px";


            canvas.style.height =
                height + "px";


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            if (
                particleState ===
                "heart"
            ) {

                createHeartTargets();
            }


            if (
                particleState ===
                    "text" &&
                particleText
            ) {

                createTextTargets(
                    particleText
                );
            }
        }


        /* =====================================================
           UPDATE
           ===================================================== */

        function updateParticles(
            time
        ) {

            particles.forEach(
                particle => {

                    if (
                        particleState ===
                        "smoke"
                    ) {

                        particle.x +=
                            particle.vx +
                            Math.sin(
                                time *
                                particle.drift +
                                particle.phase
                            ) *
                            .45;


                        particle.y +=
                            particle.vy;


                        particle.vx *=
                            .998;


                        particle.vy *=
                            .999;


                        if (
                            particle.y <
                            -30
                        ) {

                            particle.x =
                                random(
                                    0,
                                    width
                                );


                            particle.y =
                                height +
                                random(
                                    0,
                                    50
                                );


                            particle.vx =
                                random(
                                    -.45,
                                    .45
                                );


                            particle.vy =
                                random(
                                    -1.65,
                                    -.35
                                );
                        }


                        if (
                            particle.x <
                            -30
                        ) {

                            particle.x =
                                width + 20;
                        }


                        if (
                            particle.x >
                            width + 30
                        ) {

                            particle.x =
                                -20;
                        }

                    }


                    else if (
                        particleState ===
                            "heart" ||
                        particleState ===
                            "text"
                    ) {

                        const dx =
                            particle.tx -
                            particle.x;


                        const dy =
                            particle.ty -
                            particle.y;


                        particle.vx +=
                            dx *
                            .0105;


                        particle.vy +=
                            dy *
                            .0105;


                        particle.vx *=
                            .89;


                        particle.vy *=
                            .89;


                        particle.x +=
                            particle.vx;


                        particle.y +=
                            particle.vy;

                    }


                    else if (
                        particleState ===
                        "scatter"
                    ) {

                        particle.vx *=
                            .965;


                        particle.vy *=
                            .965;


                        particle.x +=
                            particle.vx;


                        particle.y +=
                            particle.vy;
                    }

                }
            );
        }


        /* =====================================================
           DRAW
           ===================================================== */

        function drawParticles() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                particle => {

                    ctx.beginPath();


                    ctx.fillStyle =
                        `rgba(${particle.color},${particle.alpha})`;


                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.size,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();

                }
            );
        }


        /* =====================================================
           ANIMATION LOOP
           ===================================================== */

        function animate(
            time
        ) {

            updateParticles(
                time
            );


            drawParticles();


            window.requestAnimationFrame(
                animate
            );
        }


        /* =====================================================
           STATES
           ===================================================== */

        function setHeart() {

            particleState =
                "heart";


            createHeartTargets();


            if (hint) {

                hint.classList.add(
                    "show"
                );
            }
        }


        function setText(
            text
        ) {

            particleState =
                "text";


            particleText =
                text;


            createTextTargets(
                text
            );


            if (hint) {

                hint.classList.add(
                    "show"
                );
            }
        }


        /* =====================================================
           FINISH EXPERIENCE
           ===================================================== */

        function revealMenu() {

            particleState =
                "scatter";


            scatterParticles();


            if (hint) {

                hint.classList.remove(
                    "show"
                );
            }


            fadeOutExperienceMusic();


            window.setTimeout(
                () => {

                    intro.classList.add(
                        "hidden"
                    );


                    if (menu) {

                        menu.classList.add(
                            "show"
                        );

                        document.body.classList.add(
                            "experience-choice-open"
                        );
                    }

                },
                1200
            );
        }


        /* =====================================================
           PARTICLE CLICK FLOW
           ===================================================== */

        intro.addEventListener(
            "click",
            () => {

                if (
                    clickLocked
                ) {

                    return;
                }


                clickLocked =
                    true;


                /* ---------------------------------------------
                   SMOKE → HEART
                   --------------------------------------------- */

                if (
                    particleState ===
                    "smoke"
                ) {

                    startExperienceMusic();

                    setHeart();


                    window.setTimeout(
                        () => {

                            clickLocked =
                                false;

                        },
                        1200
                    );


                    return;
                }


                /* ---------------------------------------------
                   HEART → PATRICIA
                   --------------------------------------------- */

                if (
                    particleState ===
                    "heart"
                ) {

                    scatterParticles();


                    particleState =
                        "scatter";


                    window.setTimeout(
                        () => {

                            setText(
                                "Patricia"
                            );

                        },
                        520
                    );


                    window.setTimeout(
                        () => {

                            clickLocked =
                                false;

                        },
                        1400
                    );


                    return;
                }


                /* ---------------------------------------------
                   PATRICIA → FINAL TEXT
                   --------------------------------------------- */

                if (
                    particleState ===
                        "text" &&
                    particleText ===
                        "Patricia"
                ) {

                    scatterParticles();


                    particleState =
                        "scatter";


                    window.setTimeout(
                        () => {

                            setText(
                                "Je t'aime Sauveur Patricia"
                            );

                        },
                        520
                    );


                    window.setTimeout(
                        () => {

                            clickLocked =
                                false;

                        },
                        1500
                    );


                    return;
                }


                /* ---------------------------------------------
                   FINAL TEXT → MENU
                   --------------------------------------------- */

                if (
                    particleState ===
                        "text" &&
                    particleText ===
                        "Je t'aime Sauveur Patricia"
                ) {

                    revealMenu();


                    window.setTimeout(
                        () => {

                            clickLocked =
                                false;

                        },
                        1500
                    );
                }

            }
        );


        createParticles();

        resizeCanvas();


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        window.requestAnimationFrame(
            animate
        );
    }


    /* =========================================================
       MEMORY BOOK
       ========================================================= */

    const photos = [];


    for (
        let i = 1;
        i <= 42;
        i++
    ) {

        const number =
            String(i).padStart(
                2,
                "0"
            );


        photos.push(
            `assets/photos/photo${number}.jpg`
        );
    }


    let currentPhoto =
        0;


    let photoTimer =
        null;


    let photoStart =
        0;


    let remainingTime =
        7000;


    let photoPaused =
        false;


    let bookStarted =
        false;


    function showBook() {

        if (!memoryBook) {
            return;
        }


        memoryBook.classList.add(
            "show"
        );
    }


    function loadPhoto(
        index
    ) {

        if (
            !memoryPhoto ||
            !memoryNumber
        ) {

            return;
        }


        if (
            index >=
            photos.length
        ) {

            index = 0;

            currentPhoto =
                0;
        }


        currentPhoto =
            index;


        clearTimeout(
            photoTimer
        );


        memoryPhoto.classList.remove(
            "memory-enter",
            "memory-leave"
        );


        memoryPhoto.style.display =
            "block";


        memoryPhoto.src =
            photos[index];


        memoryNumber.textContent =
            String(
                index + 1
            );


        requestAnimationFrame(
            () => {

                memoryPhoto.classList.add(
                    "memory-enter"
                );


                photoStart =
                    performance.now();


                remainingTime =
                    7000;


                photoPaused =
                    false;


                photoTimer =
                    setTimeout(
                        nextPhoto,
                        remainingTime
                    );

            }
        );
    }


    function nextPhoto() {

        if (
            photoPaused ||
            !memoryPhoto
        ) {

            return;
        }


        memoryPhoto.classList.remove(
            "memory-enter"
        );


        memoryPhoto.classList.add(
            "memory-leave"
        );


        window.setTimeout(
            () => {

                currentPhoto++;


                if (
                    currentPhoto >=
                    photos.length
                ) {

                    currentPhoto =
                        0;
                }


                loadPhoto(
                    currentPhoto
                );

            },
            1050
        );
    }


    function pausePhoto() {

        if (
            photoPaused
        ) {

            return;
        }


        photoPaused =
            true;


        clearTimeout(
            photoTimer
        );


        const elapsed =
            performance.now() -
            photoStart;


        remainingTime =
            Math.max(
                500,
                remainingTime -
                elapsed
            );
    }


    function resumePhoto() {

        if (
            !photoPaused
        ) {

            return;
        }


        photoPaused =
            false;


        photoStart =
            performance.now();


        photoTimer =
            setTimeout(
                nextPhoto,
                remainingTime
            );
    }


    function startMemoryExperience() {

        if (
            !memoryBook
        ) {

            return;
        }


        showBook();


        if (
            !bookStarted
        ) {

            bookStarted =
                true;


            loadPhoto(
                0
            );
        }
    }


    if (
        souvenirPanel
    ) {

        souvenirPanel.addEventListener(
            "pointerdown",
            pausePhoto,
            {
                passive: true
            }
        );


        souvenirPanel.addEventListener(
            "pointerup",
            resumePhoto,
            {
                passive: true
            }
        );


        souvenirPanel.addEventListener(
            "pointercancel",
            resumePhoto,
            {
                passive: true
            }
        );
    }


    if (
        memoryPhoto
    ) {

        memoryPhoto.addEventListener(
            "error",
            () => {

                memoryPhoto.style.display =
                    "none";

            }
        );
    }


    /* =========================================================
       SHOW / HIDE MENU
       ========================================================= */

    function closeChoiceMenu() {

        if (menu) {

            menu.classList.remove(
                "show"
            );
        }


        document.body.classList.remove(
            "experience-choice-open"
        );
    }


    function showReturnArrow() {

        if (
            returnToMenu
        ) {

            returnToMenu.classList.add(
                "show"
            );
        }
    }


    function hideReturnArrow() {

        if (
            returnToMenu
        ) {

            returnToMenu.classList.remove(
                "show"
            );
        }
    }


    function showMenu() {

        if (menu) {

            menu.classList.add(
                "show"
            );
        }


        document.body.classList.add(
            "experience-choice-open"
        );


        hideReturnArrow();
    }


    /* =========================================================
       OPEN LETTER
       ========================================================= */

    if (
        openLetterChoice
    ) {

        openLetterChoice.addEventListener(
            "click",
            () => {

                playDing();

                closeChoiceMenu();

                showReturnArrow();

                startMainMusic();


                if (
                    letter
                ) {

                    window.setTimeout(
                        () => {

                            letter.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            });

                        },
                        80
                    );
                }

            }
        );
    }


    /* =========================================================
       OPEN SOUVENIRS
       ========================================================= */

    if (
        openMemoryChoice
    ) {

        openMemoryChoice.addEventListener(
            "click",
            () => {

                playDing();

                closeChoiceMenu();

                showReturnArrow();

                startMainMusic();

                startMemoryExperience();


                if (
                    memoryBook
                ) {

                    window.setTimeout(
                        () => {

                            memoryBook.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            });

                        },
                        100
                    );
                }

            }
        );
    }


    /* =========================================================
       RETURN ARROW
       ========================================================= */

    if (
        returnToMenu
    ) {

        returnToMenu.addEventListener(
            "click",
            () => {

                playDing();

                showMenu();

            }
        );
    }

});