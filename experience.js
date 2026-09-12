/* =========================================================
   PATRICIA — OPENING PARTICLE EXPERIENCE
   The letter content is never rewritten by this file.
   ========================================================= */

(() => {
  const experience = document.getElementById("px-experience");
  const canvas = document.getElementById("px-particle-canvas");
  const question = document.getElementById("px-question");
  const yes = document.getElementById("px-yes");
  const no = document.getElementById("px-no");
  const readableText = document.querySelector(".px-readable-text");
  const afterYes = document.getElementById("px-after-yes");
  const continueBtn = document.getElementById("px-continue");
  const lastSecret = document.getElementById("px-last-secret");
  const openLetter = document.getElementById("px-open-letter");
  const dingSound = document.getElementById("dingSound");

  if (!experience || !canvas) return;

  window.PatriciaExperienceActive = true;

  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let raf = 0;
  let stopped = false;
  let lastFrame = performance.now();
  let ambientBurst = 0;
  let resizeTimer = 0;

  const state = {
    w: 0,
    h: 0,
    particles: [],
    ambient: [],
    phase: "gather",
    startedAt: performance.now()
  };

  const textCanvas = document.createElement("canvas");
  const tctx = textCanvas.getContext("2d", { willReadFrequently: true });

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function resize() {
    state.w = window.innerWidth;
    state.h = window.innerHeight;

    canvas.width = Math.floor(state.w * DPR);
    canvas.height = Math.floor(state.h * DPR);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function getTextSize() {
    const width = state.w;
    const mobile = width < 600;
    const base = clamp(width * (mobile ? 0.105 : 0.105), mobile ? 48 : 54, mobile ? 82 : 112);
    return base;
  }

  function targetPoints(text, fontSize) {
    const maxW = Math.min(state.w * 0.92, 1100);
    textCanvas.width = Math.ceil(maxW);
    textCanvas.height = Math.ceil(fontSize * 2.9);

    tctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    tctx.fillStyle = "white";
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    tctx.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;

    let scale = 1;
    const measured = tctx.measureText(text).width;
    if (measured > maxW) scale = maxW / measured;

    tctx.save();
    tctx.translate(textCanvas.width / 2, textCanvas.height / 2);
    tctx.scale(scale, scale);
    tctx.fillText(text, 0, 0);
    tctx.restore();

    const data = tctx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
    const points = [];
    const step = Math.max(2, Math.round(fontSize / (state.w < 600 ? 12 : 13)));

    for (let y = 0; y < textCanvas.height; y += step) {
      for (let x = 0; x < textCanvas.width; x += step) {
        const alpha = data[(y * textCanvas.width + x) * 4 + 3];
        if (alpha > 150) {
          points.push({
            x: x - textCanvas.width / 2 + state.w / 2,
            y: y - textCanvas.height / 2 + state.h / 2
          });
        }
      }
    }

    return points;
  }

  function makeTargets() {
    const size = getTextSize();
    const first = targetPoints("Je t'aime", size);
    const second = targetPoints("Sauveur Patricia", Math.max(34, size * (state.w < 600 ? 0.66 : 0.69)));
    const gap = clamp(size * 0.55, 26, 52);

    for (const p of first) p.y -= gap;
    for (const p of second) p.y += gap;

    return first.concat(second);
  }

  function randomBottomPoint() {
    return {
      x: state.w * (0.35 + Math.random() * 0.3),
      y: state.h + 25 + Math.random() * 90
    };
  }

  function seedParticles(points) {
    const targetCount = Math.min(
      reduced ? 340 : 1850,
      Math.max(reduced ? 320 : 760, points.length)
    );

    state.particles = Array.from({ length: targetCount }, (_, i) => {
      const target = points[i % points.length];
      const start = randomBottomPoint();
      return {
        x: start.x,
        y: start.y,
        tx: target.x + (Math.random() - 0.5) * 1.4,
        ty: target.y + (Math.random() - 0.5) * 1.4,
        vx: (Math.random() - 0.5) * 1.65,
        vy: -1.1 - Math.random() * 2.65,
        a: 0,
        size: 0.7 + Math.random() * 1.75,
        glow: 5 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.5 ? "239,220,255" : "206,229,255"
      };
    });

    state.ambient = Array.from({ length: reduced ? 18 : 55 }, () => ({
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      r: 0.35 + Math.random() * 1.1,
      a: 0.06 + Math.random() * 0.17,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.12 - Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function morphTo(points) {
    for (let i = 0; i < state.particles.length; i++) {
      const particle = state.particles[i];
      const target = points[i % points.length];
      particle.tx = target.x;
      particle.ty = target.y;
      particle.vx += (Math.random() - 0.5) * 0.15;
      particle.vy += (Math.random() - 0.5) * 0.15;
    }
  }

  function drawAmbient(dt) {
    for (const a of state.ambient) {
      a.phase += dt * 0.0007;
      a.x += a.vx;
      a.y += a.vy;

      if (a.y < -10) {
        a.y = state.h + 10;
        a.x = Math.random() * state.w;
      }

      const alpha = a.a * (0.72 + Math.sin(a.phase) * 0.28);
      ctx.beginPath();
      ctx.fillStyle = `rgba(224,238,255,${alpha})`;
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawParticle(p, t) {
    const twinkle = 0.86 + Math.sin(t * 0.0015 + p.phase) * 0.14;
    const alpha = Math.max(0, p.a * 0.84 * twinkle);

    if (p.a > 0.26) {
      ctx.shadowBlur = p.glow;
      ctx.shadowColor = `rgba(${p.hue},${Math.min(.22, alpha * .25)})`;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.hue},${alpha})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function draw(t) {
    if (stopped) return;

    const dt = Math.min(34, t - lastFrame || 16.7);
    lastFrame = t;
    ctx.clearRect(0, 0, state.w, state.h);
    drawAmbient(dt);

    const elapsed = t - state.startedAt;
    const gatherEnd = reduced ? 720 : 1050;
    const questionAt = reduced ? 1250 : 2850;

    for (const p of state.particles) {
      if (state.phase === "gather") {
        p.a = Math.min(1, p.a + (reduced ? 0.045 : 0.022));

        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        p.vx *= 0.988;
        p.vy *= 0.988;

        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.0026 * (dt / 16.67);
        p.vy += dy * 0.0026 * (dt / 16.67);

      } else if (state.phase === "hold" || state.phase === "question" || state.phase === "postyes") {
        p.a = Math.min(1, p.a + 0.014);

        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.012 * (dt / 16.67);
        p.vy += dy * 0.012 * (dt / 16.67);
        p.vx *= 0.87;
        p.vy *= 0.87;
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);

      } else if (state.phase === "scatter") {
        const dx = p.x - state.w / 2;
        const dy = p.y - state.h / 2;
        const distance = Math.max(80, Math.hypot(dx, dy));
        const force = 0.0009 * (1 + 260 / distance);
        p.vx += dx * force * (dt / 16.67);
        p.vy += dy * force * (dt / 16.67);
        p.vx *= 0.996;
        p.vy *= 0.996;
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);
        p.a *= 0.986;
      }

      drawParticle(p, t);
    }

    if (elapsed > gatherEnd && state.phase === "gather") {
      state.phase = "hold";
      readableText?.classList.add("px-readable-visible");
    }

    if (elapsed > questionAt && state.phase === "hold") showQuestion();

    if (state.phase === "scatter" && elapsed > (reduced ? 1650 : 2600)) finish();

    if (!reduced && state.phase === "hold" && elapsed - ambientBurst > 480) {
      ambientBurst = elapsed;
      emitMicroBurst();
    }

    raf = requestAnimationFrame(draw);
  }

  function emitMicroBurst() {
    const center = { x: state.w / 2, y: state.h / 2 };
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 105 + Math.random() * 90;
      state.ambient.push({
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
        r: 0.35 + Math.random() * 0.9,
        a: 0.13 + Math.random() * 0.11,
        vx: Math.cos(angle) * 0.08,
        vy: Math.sin(angle) * 0.08,
        phase: Math.random() * Math.PI * 2
      });
    }

    if (state.ambient.length > 95) state.ambient.splice(0, state.ambient.length - 95);
  }

  function showQuestion() {
    if (state.phase !== "hold" || stopped) return;
    state.phase = "question";
    readableText?.classList.add("px-readable-hold");
    question?.classList.add("px-question-show");
    question?.setAttribute("aria-hidden", "false");
  }

  function playDing() {
    try {
      if (!dingSound) return;
      dingSound.currentTime = 0;
      dingSound.volume = 0.58;
      const attempt = dingSound.play();
      if (attempt?.catch) attempt.catch(() => {});
    } catch {}
  }

  function chooseYes() {
    if (stopped || state.phase !== "question") return;
    playDing();

    question?.classList.remove("px-question-show");
    question?.setAttribute("aria-hidden", "true");
    readableText?.classList.remove("px-readable-hold");
    state.phase = "postyes";

    window.setTimeout(() => {
      if (stopped) return;
      afterYes?.classList.add("px-after-yes-show");
      afterYes?.setAttribute("aria-hidden", "false");
    }, reduced ? 160 : 620);
  }

  function continueToLastSecret() {
    if (stopped) return;
    playDing();
    afterYes?.classList.remove("px-after-yes-show");
    afterYes?.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      if (stopped) return;
      lastSecret?.classList.add("px-last-secret-show");
      lastSecret?.setAttribute("aria-hidden", "false");
    }, reduced ? 120 : 430);
  }

  function openTheLetter() {
    if (stopped) return;
    playDing();
    lastSecret?.classList.remove("px-last-secret-show");
    lastSecret?.setAttribute("aria-hidden", "true");
    state.phase = "scatter";
    window.setTimeout(() => finish(), reduced ? 130 : 760);
  }

  function chooseNo() {
    if (stopped) return;
    stopped = true;
    experience.classList.add("px-closing");
    experience.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      window.location.replace("about:blank");
    }, reduced ? 60 : 520);
  }

  function setTargetsAndStart() {
    resize();
    const targets = makeTargets();
    seedParticles(targets);
    state.startedAt = performance.now();
    state.phase = "gather";
    ambientBurst = 0;
    lastFrame = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  function recalculateTargets() {
    if (stopped) return;
    resize();
    morphTo(makeTargets());
  }

  function finish() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);

    experience.classList.add("px-done");
    experience.setAttribute("aria-hidden", "true");
    window.PatriciaExperienceActive = false;

    document.getElementById("intro-screen")?.classList.add("hidden");
    document.getElementById("welcome-popup")?.classList.add("hidden");
    document.body.classList.add("px-experience-finished");

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  yes?.addEventListener("click", chooseYes);
  no?.addEventListener("click", chooseNo);
  continueBtn?.addEventListener("click", continueToLastSecret);
  openLetter?.addEventListener("click", openTheLetter);

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(recalculateTargets, 90);
  });

  setTargetsAndStart();
})();

/* =========================================================
   SLOW DECORATIVE GLIDE — understated, always running
   ========================================================= */

(() => {
  const wrap = document.getElementById("px-glide-decor");
  if (!wrap) return;

  const symbols = ["❤️","🤭","💜","💕","💗","🤭","💕","💜","💮","🌸","❀","🌸","🌷","🌷","💮","✿","🌸","🌷"];
  const topPositions = [7, 12, 16, 21, 27, 31, 36, 41, 47, 54, 59, 64, 70, 76, 81, 86, 90, 17];
  const frag = document.createDocumentFragment();

  symbols.forEach((symbol, i) => {
    const el = document.createElement("span");
    el.className = "px-glide-symbol";
    el.textContent = symbol;
    el.style.setProperty("--px-y", `${topPositions[i]}vh`);
    el.style.setProperty("--px-size", `${15 + (i % 5) * 2}px`);
    el.style.setProperty("--px-opacity", `${0.15 + (i % 4) * 0.032}`);
    el.style.setProperty("--px-duration", `${24 + (i % 6) * 2.4}s`);
    el.style.setProperty("--px-delay", `${-(i * 1.45)}s`);
    el.style.setProperty("--px-rise", `${-2 - (i % 4)}vh`);
    el.style.setProperty("--px-end", `${-4 - (i % 5)}vh`);
    el.style.setProperty("--px-r0", `${-5 + (i % 5) * 2}deg`);
    el.style.setProperty("--px-r1", `${2 - (i % 4) * 2}deg`);
    el.style.setProperty("--px-r2", `${-4 + (i % 5) * 2}deg`);
    frag.appendChild(el);
  });

  wrap.appendChild(frag);
})();
