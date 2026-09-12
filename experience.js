/* =========================================================
   PATRICIA — OPENING PARTICLE EXPERIENCE
   Isolated namespace.
   Flow:
   Je t'aime → Sauveur Patricia → Question
   OUI → After Yes → Last Secret → Letter
   ========================================================= */

(() => {
  "use strict";

  const experience =
    document.getElementById("px-experience");

  const canvas =
    document.getElementById("px-particle-canvas");

  const question =
    document.getElementById("px-question");

  const yesButton =
    document.getElementById("px-yes");

  const noButton =
    document.getElementById("px-no");

  const afterYes =
    document.getElementById("px-after-yes");

  const continueButton =
    document.getElementById("px-continue");

  const lastSecret =
    document.getElementById("px-last-secret");

  const openLetterButton =
    document.getElementById("px-open-letter");

  const noScreen =
    document.getElementById("px-no-screen");

  const readableText =
    document.querySelector(".px-readable-text");

  const readableLove =
    document.querySelector(".px-readable-love");

  const readableName =
    document.querySelector(".px-readable-name");

  if (!experience || !canvas) return;

  window.PatriciaExperienceActive = true;

  document.body.classList.add(
    "px-experience-active"
  );

  const ctx = canvas.getContext("2d", {
    alpha: true
  });

  const reducedMotion =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  let width = 0;
  let height = 0;

  let dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  let particles = [];
  let targetPoints = [];

  let animationFrame = 0;

  let currentText = "Je t'aime";

  let phase = "gather";

  let phaseStarted =
    performance.now();

  let experienceFinished = false;
  let choiceMade = false;

  let textCanvas =
    document.createElement("canvas");

  let textCtx =
    textCanvas.getContext(
      "2d",
      { willReadFrequently: true }
    );

  const colors = [
    "rgba(255,255,255,0.98)",
    "rgba(202,235,255,0.95)",
    "rgba(122,218,255,0.92)",
    "rgba(184,143,255,0.92)",
    "rgba(244,204,255,0.92)"
  ];


  /* =========================================================
     BASIC UI
     ========================================================= */

  function hideElement(element) {
    if (!element) return;

    element.classList.remove(
      "is-visible"
    );

    element.setAttribute(
      "aria-hidden",
      "true"
    );
  }


  function showElement(element) {
    if (!element) return;

    element.classList.add(
      "is-visible"
    );

    element.setAttribute(
      "aria-hidden",
      "false"
    );
  }


  function setPhase(nextPhase) {
    phase = nextPhase;
    phaseStarted =
      performance.now();
  }


  /* =========================================================
     CANVAS RESIZE
     ========================================================= */

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    canvas.width =
      Math.round(width * dpr);

    canvas.height =
      Math.round(height * dpr);

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

    rebuildCurrentTargets();
  }


  /* =========================================================
     TEXT → PARTICLE TARGETS
     ========================================================= */

  function getFontSize(text) {
    if (text === "Je t'aime") {
      return Math.max(
        52,
        Math.min(
          108,
          width * 0.105
        )
      );
    }

    return Math.max(
      35,
      Math.min(
        70,
        width * 0.058
      )
    );
  }


  function createTextTargets(text) {
    const fontSize =
      getFontSize(text);

    const maxWidth =
      Math.min(
        width * 0.88,
        980
      );

    textCanvas.width =
      Math.ceil(maxWidth);

    textCanvas.height =
      Math.ceil(fontSize * 2.8);

    textCtx.clearRect(
      0,
      0,
      textCanvas.width,
      textCanvas.height
    );

    textCtx.textAlign =
      "center";

    textCtx.textBaseline =
      "middle";

    textCtx.font =
      `700 ${fontSize}px Arial, Helvetica, sans-serif`;

    textCtx.fillStyle =
      "#ffffff";

    textCtx.fillText(
      text,
      textCanvas.width / 2,
      textCanvas.height / 2
    );

    const image =
      textCtx.getImageData(
        0,
        0,
        textCanvas.width,
        textCanvas.height
      );

    const points = [];

    const step =
      Math.max(
        3,
        Math.round(fontSize / 9)
      );

    for (
      let y = 0;
      y < textCanvas.height;
      y += step
    ) {
      for (
        let x = 0;
        x < textCanvas.width;
        x += step
      ) {
        const index =
          (
            y *
              textCanvas.width +
            x
          ) *
          4;

        const alpha =
          image.data[index + 3];

        if (alpha > 150) {
          points.push({
            x:
              x -
              textCanvas.width / 2 +
              width / 2,

            y:
              y -
              textCanvas.height / 2 +
              height * 0.46
          });
        }
      }
    }

    return points;
  }


  /* =========================================================
     PARTICLE CREATION
     ========================================================= */

  function createParticle(target) {
    return {
      x:
        width / 2 +
        (Math.random() - 0.5) *
          Math.min(width * 0.35, 260),

      y:
        height +
        Math.random() *
          height *
          0.35,

      vx:
        (Math.random() - 0.5) *
        1.5,

      vy:
        -(
          0.7 +
          Math.random() * 2
        ),

      tx: target.x,
      ty: target.y,

      size:
        0.7 +
        Math.random() *
          (reducedMotion
            ? 1.1
            : 1.8),

      alpha:
        0.25 +
        Math.random() *
          0.75,

      color:
        colors[
          Math.floor(
            Math.random() *
              colors.length
          )
        ],

      phase:
        Math.random() *
        Math.PI *
        2,

      seed:
        Math.random() *
        1000
    };
  }


  function seedParticles(points) {
    targetPoints =
      points || [];

    if (!targetPoints.length) {
      particles = [];
      return;
    }

    const wanted =
      Math.min(
        reducedMotion
          ? 650
          : 1500,

        Math.max(
          500,
          targetPoints.length
        )
      );

    particles =
      Array.from(
        { length: wanted },
        (_, index) => {
          const target =
            targetPoints[
              index %
                targetPoints.length
            ];

          return createParticle(
            target
          );
        }
      );
  }


  function morphParticles(points) {
    if (!points.length) return;

    targetPoints = points;

    for (
      let i = 0;
      i < particles.length;
      i++
    ) {
      const particle =
        particles[i];

      const target =
        points[
          i % points.length
        ];

      particle.tx =
        target.x;

      particle.ty =
        target.y;

      particle.vx +=
        (Math.random() - 0.5) *
        0.5;

      particle.vy +=
        (Math.random() - 0.5) *
        0.5;
    }
  }


  /* =========================================================
     TARGET BUILDING
     ========================================================= */

  function rebuildCurrentTargets() {
    if (!width || !height) return;

    const points =
      createTextTargets(
        currentText
      );

    morphParticles(points);
  }


  function setText(text) {
    currentText = text;

    const points =
      createTextTargets(text);

    morphParticles(points);
  }


  /* =========================================================
     PARTICLE UPDATE
     ========================================================= */

  function updateParticles(now) {
    for (
      let i = 0;
      i < particles.length;
      i++
    ) {
      const particle =
        particles[i];

      if (phase === "gather") {
        particle.alpha =
          Math.min(
            1,
            particle.alpha +
              0.018
          );

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.vx *=
          0.985;

        particle.vy *=
          0.985;

        const dx =
          particle.tx -
          particle.x;

        const dy =
          particle.ty -
          particle.y;

        particle.vx +=
          dx *
          0.0022;

        particle.vy +=
          dy *
          0.0022;
      }


      else if (
        phase === "morph"
      ) {
        particle.alpha =
          Math.min(
            1,
            particle.alpha +
              0.015
          );

        const dx =
          particle.tx -
          particle.x;

        const dy =
          particle.ty -
          particle.y;

        particle.vx +=
          dx *
          0.008;

        particle.vy +=
          dy *
          0.008;

        particle.vx *=
          0.90;

        particle.vy *=
          0.90;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;
      }


      else if (
        phase === "hold"
      ) {
        const dx =
          particle.tx -
          particle.x;

        const dy =
          particle.ty -
          particle.y;

        particle.vx +=
          dx *
          0.010;

        particle.vy +=
          dy *
          0.010;

        particle.vx *=
          0.87;

        particle.vy *=
          0.87;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        if (!reducedMotion) {
          particle.x +=
            Math.sin(
              now * 0.0008 +
                particle.phase
            ) *
            0.08;

          particle.y +=
            Math.cos(
              now * 0.0006 +
                particle.seed
            ) *
            0.08;
        }
      }


      else if (
        phase === "scatter"
      ) {
        const centerX =
          width / 2;

        const centerY =
          height * 0.46;

        const dx =
          particle.x -
          centerX;

        const dy =
          particle.y -
          centerY;

        particle.vx +=
          dx *
          0.0009;

        particle.vy +=
          dy *
          0.0009;

        particle.vx *=
          0.994;

        particle.vy *=
          0.994;

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;

        particle.alpha *=
          0.988;
      }
    }
  }


  /* =========================================================
     DRAW
     ========================================================= */

  function drawBackground(now) {
    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    const gradient =
      ctx.createRadialGradient(
        width / 2,
        height * 0.43,
        0,
        width / 2,
        height * 0.43,
        Math.max(
          width,
          height
        ) *
          0.82
      );

    gradient.addColorStop(
      0,
      "rgba(80,52,115,0.20)"
    );

    gradient.addColorStop(
      0.48,
      "rgba(17,19,48,0.12)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    if (reducedMotion) return;

    const glowX =
      width / 2 +
      Math.sin(
        now * 0.00025
      ) *
        width *
        0.12;

    const glowY =
      height * 0.42 +
      Math.cos(
        now * 0.0002
      ) *
        height *
        0.08;

    const glow =
      ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.max(
          width,
          height
        ) *
          0.3
      );

    glow.addColorStop(
      0,
      "rgba(116,193,255,0.055)"
    );

    glow.addColorStop(
      0.45,
      "rgba(158,102,255,0.035)"
    );

    glow.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
      glow;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );
  }


  function drawParticles() {
    for (
      const particle of particles
    ) {
      if (
        particle.alpha <=
        0.01
      ) {
        continue;
      }

      ctx.globalAlpha =
        particle.alpha;

      ctx.fillStyle =
        particle.color;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

      if (
        !reducedMotion &&
        particle.size > 1.3
      ) {
        ctx.globalAlpha =
          particle.alpha *
          0.10;

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size * 3.5,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }


  /* =========================================================
     READABLE TEXT
     ========================================================= */

  function hideReadableText() {
    if (!readableText) return;

    readableText.classList.add(
      "px-fade-out"
    );
  }


  function showLoveText() {
    if (!readableText) return;

    readableText.classList.remove(
      "px-fade-out"
    );

    if (readableLove) {
      readableLove.classList.add(
        "is-active"
      );
    }

    if (readableName) {
      readableName.classList.remove(
        "is-active"
      );
    }
  }


  function showNameText() {
    if (!readableText) return;

    readableText.classList.remove(
      "px-fade-out"
    );

    if (readableLove) {
      readableLove.classList.remove(
        "is-active"
      );
    }

    if (readableName) {
      readableName.classList.add(
        "is-active"
      );
    }
  }


  /* =========================================================
     QUESTION
     ========================================================= */

  function showQuestion() {
    if (
      choiceMade ||
      experienceFinished
    ) {
      return;
    }

    showElement(question);
  }


  /* =========================================================
     SOUND
     ========================================================= */

  function playDing() {
    const ding =
      document.getElementById(
        "dingSound"
      );

    if (!ding) return;

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
    } catch (_) {}
  }


  function startMusic() {
    const music =
      document.getElementById(
        "bgMusic"
      );

    if (!music) return;

    try {
      music.volume = 0.45;

      const promise =
        music.play();

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
     YES FLOW
     ========================================================= */

  function chooseYes() {
    if (
      choiceMade ||
      experienceFinished
    ) {
      return;
    }

    choiceMade = true;

    hideElement(question);

    playDing();
    startMusic();

    setTimeout(
      () => {
        showElement(
          afterYes
        );
      },
      reducedMotion
        ? 80
        : 350
    );
  }


  function continueToLastSecret() {
    hideElement(afterYes);

    setTimeout(
      () => {
        showElement(
          lastSecret
        );
      },
      reducedMotion
        ? 60
        : 300
    );
  }


  function openLetter() {
    hideElement(
      lastSecret
    );

    hideReadableText();

    setPhase(
      "scatter"
    );

    setTimeout(
      () => {
        finish();
      },
      reducedMotion
        ? 120
        : 850
    );
  }


  /* =========================================================
     NO FLOW
     ========================================================= */

  function chooseNo() {
    if (
      choiceMade ||
      experienceFinished
    ) {
      return;
    }

    choiceMade = true;

    hideElement(
      question
    );

    showElement(
      noScreen
    );

    setTimeout(
      () => {
        hideElement(
          noScreen
        );

        finish();
      },
      reducedMotion
        ? 900
        : 1800
    );
  }


  /* =========================================================
     FINISH
     ========================================================= */

  function finish() {
    if (experienceFinished)
      return;

    experienceFinished = true;

    hideElement(
      question
    );

    hideElement(
      afterYes
    );

    hideElement(
      lastSecret
    );

    hideElement(
      noScreen
    );

    experience.classList.add(
      "px-done"
    );

    experience.setAttribute(
      "aria-hidden",
      "true"
    );

    window.PatriciaExperienceActive =
      false;

    const intro =
      document.getElementById(
        "intro-screen"
      );

    const popup =
      document.getElementById(
        "welcome-popup"
      );

    intro?.classList.add(
      "hidden"
    );

    popup?.classList.add(
      "hidden"
    );

    document.body.classList.remove(
      "px-experience-active"
    );

    document.body.classList.add(
      "px-experience-finished"
    );
  }


  /* =========================================================
     MAIN ANIMATION LOOP
     ========================================================= */

  function animate(now) {
    if (experienceFinished)
      return;

    drawBackground(now);

    updateParticles(now);

    drawParticles();

    const elapsed =
      now - phaseStarted;


    /*
     * PHASE 1
     * Je t'aime
     */

    if (
      phase === "gather" &&
      elapsed >
        (reducedMotion
          ? 1000
          : 2200)
    ) {
      showLoveText();

      setPhase(
        "hold"
      );
    }


    /*
     * PHASE 2
     * Morph toward Sauveur Patricia
     */

    if (
      phase === "hold" &&
      elapsed >
        (reducedMotion
          ? 900
          : 1800)
    ) {
      setText(
        "Sauveur Patricia"
      );

      showNameText();

      setPhase(
        "morph"
      );
    }


    /*
     * PHASE 3
     * Hold the name
     */

    if (
      phase === "morph" &&
      elapsed >
        (reducedMotion
          ? 900
          : 1900)
    ) {
      setPhase(
        "hold-name"
      );
    }


    /*
     * PHASE 4
     * Keep the name visible,
     * then reveal the question.
     */

    if (
      phase === "hold-name" &&
      elapsed >
        (reducedMotion
          ? 700
          : 1500)
    ) {
      showQuestion();

      setPhase(
        "question"
      );
    }


    /*
     * Once the question is visible,
     * NOTHING automatically ends the experience.
     *
     * Patricia must choose.
     */

    if (
      phase === "scatter"
    ) {
      if (
        elapsed >
          (reducedMotion
            ? 700
            : 1000)
      ) {
        finish();
        return;
      }
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }


  /* =========================================================
     RESIZE
     ========================================================= */

  function handleResize() {
    resizeCanvas();
  }


  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  if (yesButton) {
    yesButton.addEventListener(
      "click",
      chooseYes
    );
  }

  if (noButton) {
    noButton.addEventListener(
      "click",
      chooseNo
    );
  }

  if (continueButton) {
    continueButton.addEventListener(
      "click",
      continueToLastSecret
    );
  }

  if (openLetterButton) {
    openLetterButton.addEventListener(
      "click",
      openLetter
    );
  }

  window.addEventListener(
    "resize",
    handleResize,
    { passive: true }
  );


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  hideElement(
    question
  );

  hideElement(
    afterYes
  );

  hideElement(
    lastSecret
  );

  hideElement(
    noScreen
  );

  resizeCanvas();

  const firstTargets =
    createTextTargets(
      "Je t'aime"
    );

  seedParticles(
    firstTargets
  );

  showLoveText();

  phase = "gather";

  phaseStarted =
    performance.now();

  cancelAnimationFrame(
    animationFrame
  );

  animationFrame =
    requestAnimationFrame(
      animate
    );

})();