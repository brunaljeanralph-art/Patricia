(() => {
  "use strict";

  const experience = document.getElementById("px-experience");
  const canvas = document.getElementById("px-particle-canvas");
  const question = document.getElementById("px-question");
  const yesButton = document.getElementById("px-yes");
  const noButton = document.getElementById("px-no");
  const afterYes = document.getElementById("px-after-yes");
  const lastSecret = document.getElementById("px-last-secret");
  const noScreen = document.getElementById("px-no-screen");

  if (!experience || !canvas) return;

  window.PatriciaExperienceActive = true;

  document.body.classList.add("px-experience-active");

  const ctx = canvas.getContext("2d", {
    alpha: true
  });

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const state = {
    phase: "gather",
    started: performance.now(),
    questionShown: false,
    choiceMade: false,
    finished: false,
    scatterStarted: 0
  };

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let particles = [];
  let targets = [];
  let currentTargetText = "Je t'aime";

  const colors = [
    "rgba(255,255,255,0.98)",
    "rgba(202,235,255,0.95)",
    "rgba(122,218,255,0.92)",
    "rgba(184,143,255,0.9)",
    "rgba(244,204,255,0.9)"
  ];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildTargets();
  }

  function createTextTargets(text) {
    const offscreen = document.createElement("canvas");
    const octx = offscreen.getContext("2d");

    const fontSize = Math.min(
      width * (text === "Sauveur Patricia" ? 0.13 : 0.16),
      text === "Sauveur Patricia" ? 112 : 132
    );

    offscreen.width = Math.ceil(width);
    offscreen.height = Math.ceil(height);

    octx.clearRect(0, 0, offscreen.width, offscreen.height);

    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.font =
      `600 ${Math.max(44, fontSize)}px ` +
      `"Times New Roman", Georgia, serif`;

    octx.fillStyle = "#ffffff";

    const y = height * 0.46;

    octx.fillText(text, width / 2, y);

    const image = octx.getImageData(
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const points = [];

    const gap = reducedMotion ? 4 : 3;

    for (let yPos = 0; yPos < offscreen.height; yPos += gap) {
      for (let xPos = 0; xPos < offscreen.width; xPos += gap) {
        const index =
          (yPos * offscreen.width + xPos) * 4;

        if (image.data[index + 3] > 100) {
          points.push({
            x: xPos,
            y: yPos
          });
        }
      }
    }

    return points;
  }

  function buildTargets() {
    targets = createTextTargets(currentTargetText);

    const desiredCount = Math.min(
      reducedMotion ? 900 : 1900,
      Math.max(500, targets.length)
    );

    if (particles.length !== desiredCount) {
      particles = [];

      for (let i = 0; i < desiredCount; i++) {
        const target =
          targets[i % Math.max(1, targets.length)];

        const fromBottom =
          Math.random() < 0.75;

        particles.push({
          x: Math.random() * width,
          y: fromBottom
            ? height + Math.random() * height * 0.35
            : Math.random() * height,

          vx: (Math.random() - 0.5) * 0.5,
          vy: -(0.4 + Math.random() * 1.4),

          tx: target ? target.x : width / 2,
          ty: target ? target.y : height / 2,

          size:
            0.7 +
            Math.random() *
              (reducedMotion ? 1.1 : 1.8),

          alpha:
            0.35 +
            Math.random() * 0.65,

          color:
            colors[
              Math.floor(Math.random() * colors.length)
            ],

          phase:
            Math.random() * Math.PI * 2,

          seed:
            Math.random() * 1000
        });
      }
    } else {
      particles.forEach((particle, i) => {
        const target =
          targets[i % Math.max(1, targets.length)];

        if (target) {
          particle.tx = target.x;
          particle.ty = target.y;
        }
      });
    }
  }

  function scatterParticles(now) {
    if (!state.scatterStarted) {
      state.scatterStarted = now;
    }

    const elapsed =
      now - state.scatterStarted;

    particles.forEach((particle) => {
      particle.vx +=
        (Math.random() - 0.5) *
        (reducedMotion ? 0.02 : 0.09);

      particle.vy +=
        (Math.random() - 0.5) *
        (reducedMotion ? 0.02 : 0.09);

      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.985;
      particle.vy *= 0.985;
    });

    if (elapsed > 900) {
      finish();
    }
  }

  function updateParticles(now) {
    const elapsed =
      now - state.started;

    if (state.phase === "scatter") {
      scatterParticles(now);
      return;
    }

    particles.forEach((particle, index) => {
      const dx = particle.tx - particle.x;
      const dy = particle.ty - particle.y;

      const distance =
        Math.sqrt(dx * dx + dy * dy) || 1;

      let strength = 0.012;

      if (elapsed > 700) {
        strength = 0.018;
      }

      if (elapsed > 1600) {
        strength = 0.026;
      }

      particle.vx +=
        (dx / distance) *
        strength;

      particle.vy +=
        (dy / distance) *
        strength;

      if (!reducedMotion) {
        particle.vx +=
          Math.sin(
            now * 0.0007 +
            particle.phase +
            index * 0.001
          ) * 0.002;

        particle.vy +=
          Math.cos(
            now * 0.0005 +
            particle.seed
          ) * 0.002;
      }

      particle.vx *= 0.88;
      particle.vy *= 0.88;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (distance < 18) {
        particle.x +=
          (Math.random() - 0.5) *
          (reducedMotion ? 0.2 : 0.8);

        particle.y +=
          (Math.random() - 0.5) *
          (reducedMotion ? 0.2 : 0.8);
      }
    });
  }

  function drawBackground(now) {
    ctx.clearRect(0, 0, width, height);

    const gradient =
      ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        0,
        width / 2,
        height * 0.42,
        Math.max(width, height) * 0.8
      );

    gradient.addColorStop(
      0,
      "rgba(65,45,100,0.20)"
    );

    gradient.addColorStop(
      0.45,
      "rgba(17,19,48,0.12)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (reducedMotion) return;

    const glowX =
      width / 2 +
      Math.sin(now * 0.00025) *
        width *
        0.12;

    const glowY =
      height * 0.42 +
      Math.cos(now * 0.0002) *
        height *
        0.08;

    const glow =
      ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.max(width, height) * 0.3
      );

    glow.addColorStop(
      0,
      "rgba(116,193,255,0.06)"
    );

    glow.addColorStop(
      0.45,
      "rgba(158,102,255,0.035)"
    );

    glow.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawParticles(now) {
    particles.forEach((particle) => {
      let alpha = particle.alpha;

      if (state.phase === "scatter") {
        const scatterAge =
          now - state.scatterStarted;

        alpha *= Math.max(
          0,
          1 - scatterAge / 1000
        );
      }

      if (alpha <= 0) return;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

      if (!reducedMotion && particle.size > 1.3) {
        ctx.globalAlpha = alpha * 0.12;

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size * 3.8,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
  }

  function draw(now) {
    drawBackground(now);
    updateParticles(now);
    drawParticles(now);

    requestAnimationFrame(draw);
  }

  function showQuestion() {
    if (
      state.questionShown ||
      state.choiceMade ||
      state.finished
    ) {
      return;
    }

    state.questionShown = true;

    if (!question) return;

    question.classList.add("is-visible");
    question.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function hideElement(element) {
    if (!element) return;

    element.classList.remove("is-visible");
    element.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  function showElement(element) {
    if (!element) return;

    element.classList.add("is-visible");
    element.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function playDing() {
    const ding =
      document.getElementById("dingSound");

    if (!ding) return;

    try {
      ding.currentTime = 0;

      const promise = ding.play();

      if (
        promise &&
        typeof promise.catch === "function"
      ) {
        promise.catch(() => {});
      }
    } catch (_) {}
  }

  function startMusic() {
    const music =
      document.getElementById("bgMusic");

    if (!music) return;

    try {
      music.volume = 0.45;

      const promise = music.play();

      if (
        promise &&
        typeof promise.catch === "function"
      ) {
        promise.catch(() => {});
      }
    } catch (_) {}
  }

  function chooseYes() {
    if (state.choiceMade) return;

    state.choiceMade = true;

    hideElement(question);

    playDing();
    startMusic();

    setTimeout(() => {
      showElement(afterYes);
    }, reducedMotion ? 100 : 350);
  }

  function continueToLastSecret() {
    hideElement(afterYes);

    setTimeout(() => {
      showElement(lastSecret);
    }, reducedMotion ? 80 : 280);
  }

  function openTheLetter() {
    hideElement(lastSecret);

    state.phase = "scatter";
    state.scatterStarted = performance.now();

    const readableText =
      document.querySelector(
        ".px-readable-text"
      );

    if (readableText) {
      readableText.classList.add("px-fade-out");
    }
  }

  function chooseNo() {
    if (state.choiceMade) return;

    state.choiceMade = true;

    hideElement(question);

    if (noScreen) {
      showElement(noScreen);
    }

    setTimeout(() => {
      window.location.replace(
        "about:blank"
      );
    }, reducedMotion ? 250 : 800);
  }

  function finish() {
    if (state.finished) return;

    state.finished = true;

    experience.classList.add(
      "px-experience-finished"
    );

    experience.setAttribute(
      "aria-hidden",
      "true"
    );

    setTimeout(() => {
      experience.classList.add("hidden");

      const main =
        document.querySelector("main");

      if (main) {
        main.classList.add(
          "px-site-revealed"
        );
      }

      document.body.classList.remove(
        "px-experience-active"
      );
    }, reducedMotion ? 0 : 180);
  }

  function handleResize() {
    resizeCanvas();

    if (
      state.phase === "gather" ||
      state.phase === "hold"
    ) {
      buildTargets();
    }
  }

  function prepareExperience() {
    experience.classList.remove(
      "hidden"
    );

    experience.setAttribute(
      "aria-hidden",
      "false"
    );

    hideElement(question);
    hideElement(afterYes);
    hideElement(lastSecret);
    hideElement(noScreen);

    resizeCanvas();
  }

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

  const continueButton =
    document.getElementById(
      "px-after-yes-continue"
    );

  if (continueButton) {
    continueButton.addEventListener(
      "click",
      continueToLastSecret
    );
  }

  const secretButton =
    document.getElementById(
      "px-last-secret-open"
    );

  if (secretButton) {
    secretButton.addEventListener(
      "click",
      openTheLetter
    );
  }

  window.addEventListener(
    "resize",
    handleResize,
    { passive: true }
  );

  prepareExperience();

  requestAnimationFrame(draw);

  const holdDelay =
    reducedMotion
      ? 1450
      : 3400;

  setTimeout(() => {
    if (
      !state.choiceMade &&
      !state.finished
    ) {
      state.phase = "hold";
      showQuestion();
    }
  }, holdDelay);

  window.addEventListener(
    "pageshow",
    () => {
      if (!state.finished) {
        prepareExperience();
      }
    }
  );
})();