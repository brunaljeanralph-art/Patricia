(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {

        if (window.__patriciaExperienceStarted) {
            return;
        }

        window.__patriciaExperienceStarted = true;


        const music =
            document.getElementById("experienceMusic");

        const ding =
            document.getElementById("dingSound");


        /* =====================================================
           MESSAGES
           ===================================================== */

        const messages = [
            "Certaines histoires ne disparaissent pas... elles changent simplement de forme.",
            "Et parfois, il suffit d'une personne pour donner une couleur différente à tous nos souvenirs.",
            "Tu as peut-être oublié certains détails...",
            "Moi, il y en a quelques-uns que je n'ai jamais vraiment réussi à oublier.",
            "Un regard.",
            "Un sourire.",
            "Une main dans la mienne, même pour quelques instants.",
            "Et puis cette étrange façon que tu as de rester quelque part dans mes pensées.",
            "Je ne sais pas exactement où cette histoire nous mènera.",
            "Mais je sais pourquoi certains souvenirs méritent d'être conservés.",
            "Parce qu'ils ont été vrais.",
            "Parce qu'ils nous appartenaient.",
            "Et parce qu'une partie de toi a laissé une trace en moi.",
            "Alors avant de continuer...",
            "garde juste cette petite chose avec toi.",
            "Il y a encore une dernière porte à ouvrir, Mi Amor. ❤️"
        ];


        /* =====================================================
           DOM
           ===================================================== */

        const layer =
            document.createElement("section");

        layer.id =
            "px-experience";

        layer.setAttribute(
            "aria-label",
            "Une dernière expérience"
        );


        layer.innerHTML = `
            <div class="px-aurora px-aurora-a"></div>
            <div class="px-aurora px-aurora-b"></div>
            <div class="px-aurora px-aurora-c"></div>

            <div class="px-grid"></div>
            <div class="px-stars"></div>

            <div class="px-glow-ring px-glow-ring-a"></div>
            <div class="px-glow-ring px-glow-ring-b"></div>

            <div class="px-particle-bloom"></div>

            <canvas
                id="px-experience-canvas"
                aria-hidden="true">
            </canvas>

            <div
                class="px-readable-text"
                aria-live="polite">
            </div>

            <div class="px-opening-copy">
                <span class="px-opening-line"></span>

                <p class="px-opening-small">
                    Un souvenir à la fois
                </p>

                <span class="px-opening-line"></span>
            </div>

            <button
                id="px-skip"
                type="button"
                aria-label="Passer cette expérience">

                Passer

            </button>
        `;


        document.body.appendChild(layer);


        const canvas =
            document.getElementById(
                "px-experience-canvas"
            );

        const textContainer =
            layer.querySelector(
                ".px-readable-text"
            );

        const skip =
            document.getElementById(
                "px-skip"
            );


        if (!canvas || !textContainer) {
            layer.remove();
            return;
        }


        /* =====================================================
           PARTICLES
           ===================================================== */

        const ctx =
            canvas.getContext("2d", {
                alpha: true
            });


        if (!ctx) {
            layer.remove();
            return;
        }


        const particleColors = [
            "rgba(117,225,255,",
            "rgba(66,196,255,",
            "rgba(215,249,255,",
            "rgba(157,128,255,"
        ];


        let particles = [];

        let width = 0;
        let height = 0;

        let dpr = 1;

        let animationId = null;

        let lastTime = 0;

        let active = true;

        let currentMessage = -1;

        let clickLocked = false;


        function getParticleCount() {

            const area =
                window.innerWidth *
                window.innerHeight;

            if (window.innerWidth < 430) {
                return Math.min(
                    115,
                    Math.max(70, Math.floor(area / 4700))
                );
            }

            if (window.innerWidth < 760) {
                return Math.min(
                    155,
                    Math.max(90, Math.floor(area / 4100))
                );
            }

            return Math.min(
                210,
                Math.max(120, Math.floor(area / 3900))
            );
        }


        function resizeCanvas() {

            width =
                window.innerWidth;

            height =
                window.innerHeight;

            dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    1.5
                );

            canvas.width =
                Math.floor(width * dpr);

            canvas.height =
                Math.floor(height * dpr);

            canvas.style.width =
                `${width}px`;

            canvas.style.height =
                `${height}px`;

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

            createParticles();
        }


        function random(min, max) {
            return Math.random() * (max - min) + min;
        }


        function createParticles() {

            const total =
                getParticleCount();

            particles =
                Array.from(
                    {
                        length: total
                    },
                    () => createParticle(true)
                );
        }


        function createParticle(initial = false) {

            const spread =
                width * 0.22;

            const x =
                width / 2 +
                random(-spread, spread);

            const y =
                initial
                    ? random(height * 0.55, height + 40)
                    : height + random(8, 36);


            return {
                x,
                y,

                vx:
                    random(-0.22, 0.22),

                vy:
                    random(-0.64, -0.18),

                size:
                    random(0.7, 2.0),

                life:
                    random(0.3, 1),

                fade:
                    random(0.0025, 0.007),

                sway:
                    random(0.7, 1.8),

                phase:
                    random(0, Math.PI * 2),

                color:
                    particleColors[
                        Math.floor(
                            Math.random() *
                            particleColors.length
                        )
                    ]
            };
        }


        function drawParticle(
            particle,
            time
        ) {

            const alpha =
                Math.max(
                    0,
                    particle.life
                );

            const glow =
                particle.size *
                4.5;


            ctx.beginPath();

            ctx.fillStyle =
                `${particle.color}${Math.min(
                    .85,
                    alpha * .78
                )})`;

            ctx.shadowBlur =
                glow;

            ctx.shadowColor =
                `${particle.color}${Math.min(
                    .34,
                    alpha * .28
                )})`;

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;
        }


        function updateParticle(
            particle,
            dt,
            time
        ) {

            particle.phase +=
                dt * 0.001 *
                particle.sway;

            particle.x +=
                particle.vx *
                dt;

            particle.x +=
                Math.sin(particle.phase + time * 0.00035) *
                0.06 *
                dt;

            particle.y +=
                particle.vy *
                dt;

            particle.life -=
                particle.fade *
                dt;


            if (
                particle.life <= 0 ||
                particle.y < -30
            ) {

                Object.assign(
                    particle,
                    createParticle(false)
                );
            }
        }


        function draw(now) {

            if (!active) {
                return;
            }


            const dt =
                Math.min(
                    34,
                    lastTime
                        ? now - lastTime
                        : 16
                );


            lastTime =
                now;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            for (
                const particle of particles
            ) {

                updateParticle(
                    particle,
                    dt,
                    now
                );

                drawParticle(
                    particle,
                    now
                );
            }


            animationId =
                requestAnimationFrame(
                    draw
                );
        }


        /* =====================================================
           MESSAGE SYSTEM
           ===================================================== */

        function renderMessage(index) {

            const safeIndex =
                Math.max(
                    0,
                    Math.min(
                        messages.length - 1,
                        index
                    )
                );


            currentMessage =
                safeIndex;


            textContainer.classList.add(
                "px-fade-out"
            );


            window.setTimeout(
                () => {

                    if (!active) {
                        return;
                    }


                    textContainer.innerHTML = "";


                    const line =
                        document.createElement("span");


                    line.className =
                        "px-readable-line";


                    line.textContent =
                        messages[
                            safeIndex
                        ];


                    textContainer.appendChild(
                        line
                    );


                    requestAnimationFrame(
                        () => {

                            line.classList.add(
                                "is-active"
                            );

                            textContainer.classList.remove(
                                "px-fade-out"
                            );
                        }
                    );

                },
                250
            );
        }


        function playDing() {

            if (!ding) {
                return;
            }

            try {
                ding.currentTime = 0;
                ding.volume = 0.45;
                ding.play().catch(() => {});
            } catch (_) {}
        }


        function startExperienceMusic() {

            if (!music) {
                return;
            }

            try {
                music.volume = 0.72;

                const promise =
                    music.play();

                if (
                    promise &&
                    typeof promise.catch === "function"
                ) {
                    promise.catch(() => {});
                }

            } catch (_) {}
        }


        function stopExperienceMusic() {

            if (!music) {
                return;
            }

            try {
                music.pause();
                music.currentTime = 0;
            } catch (_) {}
        }


        function showNextMessage() {

            if (
                !active ||
                clickLocked
            ) {
                return;
            }


            clickLocked = true;


            if (
                currentMessage <
                messages.length - 1
            ) {

                renderMessage(
                    currentMessage + 1
                );

                playDing();


                window.setTimeout(
                    () => {

                        clickLocked = false;

                    },
                    520
                );

                return;
            }


            finishExperience();
        }


        /* =====================================================
           FINISH
           ===================================================== */

        function finishExperience() {

            if (!active) {
                return;
            }


            active = false;

            layer.classList.add(
                "px-done"
            );

            stopExperienceMusic();


            if (animationId) {

                cancelAnimationFrame(
                    animationId
                );

                animationId = null;
            }


            window.setTimeout(
                () => {

                    layer.remove();


                    document.body.classList.remove(
                        "px-experience-active"
                    );


                    const target =
                        document.getElementById(
                            "souvenirs"
                        );


                    /*
                        N ap fòse scroll otomatik.
                        Gate souvenirs la rete kòm pòt
                        natirèl pou itilizatè a.
                    */

                    if (target) {
                        target.setAttribute(
                            "data-experience-finished",
                            "true"
                        );
                    }

                },
                1250
            );
        }


        /* =====================================================
           CLICK / TOUCH
           ===================================================== */

        layer.addEventListener(
            "pointerup",
            (event) => {

                if (
                    event.target === skip
                ) {
                    return;
                }

                showNextMessage();
            }
        );


        skip.addEventListener(
            "click",
            () => {
                finishExperience();
            }
        );


        /* =====================================================
           RESIZE
           ===================================================== */

        window.addEventListener(
            "resize",
            resizeCanvas,
            {
                passive: true
            }
        );


        /* =====================================================
           VISIBILITY
           ===================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {
                    lastTime = 0;
                }

            }
        );


        /* =====================================================
           START
           ===================================================== */

        resizeCanvas();

        document.body.classList.add(
            "px-experience-active"
        );

        startExperienceMusic();

        renderMessage(0);

        animationId =
            requestAnimationFrame(
                draw
            );

    });

})();