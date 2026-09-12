/* =========================================================
   PATRICIA — OPENING PARTICLE EXPERIENCE
   Isolated namespace. Does not rewrite the letter.
   ========================================================= */

(() => {

  const experience =
    document.getElementById("px-experience");

  const canvas =
    document.getElementById("px-particle-canvas");

  const question =
    document.getElementById("px-question");

  const yes =
    document.getElementById("px-yes");

  const no =
    document.getElementById("px-no");

  const noScreen =
    document.getElementById("px-no-screen");

  const readableText =
    document.querySelector(".px-readable-text");

  const afterYes =
    document.getElementById("px-after-yes");

  const continueBtn =
    document.getElementById("px-continue");

  const lastSecret =
    document.getElementById("px-last-secret");

  const openLetter =
    document.getElementById("px-open-letter");

  const dingSound =
    document.getElementById("dingSound");


  if (!experience || !canvas) return;


  /* =========================================================
     EXPERIENCE ACTIVE
     ========================================================= */

  window.PatriciaExperienceActive = true;


  const ctx =
    canvas.getContext("2d", {
      alpha: true
    });


  const reduced =
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches ?? false;


  const DPR =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  let raf = 0;
  let stopped = false;


  /* =========================================================
     STATE
     ========================================================= */

  const state = {

    w: 0,

    h: 0,

    particles: [],

    phase: "gather",

    startedAt: performance.now(),

    cycle: 0

  };


  /* =========================================================
     TEXT CANVAS
     ========================================================= */

  const textCanvas =
    document.createElement("canvas");

  const tctx =
    textCanvas.getContext(
      "2d",
      {
        willReadFrequently: true
      }
    );


  /* =========================================================
     RESIZE
     ========================================================= */

  function resize() {

    state.w =
      window.innerWidth;

    state.h =
      window.innerHeight;


    canvas.width =
      Math.floor(
        state.w * DPR
      );

    canvas.height =
      Math.floor(
        state.h * DPR
      );


    canvas.style.width =
      `${state.w}px`;

    canvas.style.height =
      `${state.h}px`;


    ctx.setTransform(
      DPR,
      0,
      0,
      DPR,
      0,
      0
    );
  }


  /* =========================================================
     CREATE TEXT POINTS
     ========================================================= */

  function targetPoints(
    text,
    fontSize
  ) {

    const maxW =
      Math.min(
        state.w * 0.86,
        980
      );


    textCanvas.width =
      Math.ceil(maxW);

    textCanvas.height =
      Math.ceil(
        fontSize * 2.9
      );


    tctx.clearRect(
      0,
      0,
      textCanvas.width,
      textCanvas.height
    );


    tctx.fillStyle =
      "white";

    tctx.textAlign =
      "center";

    tctx.textBaseline =
      "middle";


    tctx.font =
      `700 ${fontSize}px Arial, Helvetica, sans-serif`;


    tctx.fillText(
      text,
      textCanvas.width / 2,
      textCanvas.height / 2
    );


    const data =
      tctx.getImageData(
        0,
        0,
        textCanvas.width,
        textCanvas.height
      ).data;


    const points = [];


    const step =
      Math.max(
        2,
        Math.round(fontSize / 13)
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

        const alpha =
          data[
            (y * textCanvas.width + x) * 4 + 3
          ];


        if (alpha > 160) {

          points.push({

            x:
              x -
              textCanvas.width / 2 +
              state.w / 2,

            y:
              y -
              textCanvas.height / 2 +
              state.h / 2

          });

        }

      }

    }


    return points;
  }


  /* =========================================================
     CREATE PARTICLES
     ========================================================= */

  function seedParticles(points) {

    const wanted =
      reduced
        ? 300
        : Math.min(
            1400,
            Math.max(
              520,
              points.length
            )
          );


    state.particles =
      Array.from(
        {
          length: wanted
        },
        (_, i) => {

          const p =
            points[
              i % points.length
            ];


          return {

            x:
              state.w / 2 +
              (Math.random() - .5) * 30,

            y:
              state.h +
              Math.random() * 80,

            tx:
              p.x,

            ty:
              p.y,

            vx:
              (Math.random() - .5) * 1.8,

            vy:
              -1 -
              Math.random() * 2.4,

            a: 0,

            size:
              .7 +
              Math.random() * 1.65,

            drift:
              Math.random() *
              Math.PI *
              2

          };

        }
      );
  }


  /* =========================================================
     MORPH
     ========================================================= */

  function morphTo(points) {

    for (
      let i = 0;
      i < state.particles.length;
      i++
    ) {

      const p =
        state.particles[i];

      const t =
        points[
          i % points.length
        ];


      p.tx =
        t.x;

      p.ty =
        t.y;


      p.vx +=
        (Math.random() - .5) * .7;

      p.vy +=
        (Math.random() - .5) * .7;

    }
  }


  /* =========================================================
     DRAW PARTICLES
     ========================================================= */

  function draw(t) {

    if (stopped) return;


    ctx.clearRect(
      0,
      0,
      state.w,
      state.h
    );


    const elapsed =
      t -
      state.startedAt;


    for (
      const p of state.particles
    ) {


      /* -----------------------------------------
         GATHER
         ----------------------------------------- */

      if (
        state.phase === "gather"
      ) {

        p.a =
          Math.min(
            1,
            p.a + .024
          );


        p.x += p.vx;
        p.y += p.vy;


        p.vx *= .984;
        p.vy *= .984;


        const dx =
          p.tx - p.x;

        const dy =
          p.ty - p.y;


        p.vx +=
          dx * .0024;

        p.vy +=
          dy * .0024;
      }


      /* -----------------------------------------
         HOLD
         ----------------------------------------- */

      else if (
        state.phase === "hold"
      ) {

        p.a =
          Math.min(
            1,
            p.a + .018
          );


        const dx =
          p.tx - p.x;

        const dy =
          p.ty - p.y;


        p.vx +=
          dx * .012;

        p.vy +=
          dy * .012;


        p.vx *= .88;
        p.vy *= .88;


        p.x += p.vx;
        p.y += p.vy;
      }


      /* -----------------------------------------
         QUESTION / POST YES
         ----------------------------------------- */

      else if (
        state.phase === "question" ||
        state.phase === "postyes"
      ) {

        const dx =
          p.tx - p.x;

        const dy =
          p.ty - p.y;


        p.vx +=
          dx * .012;

        p.vy +=
          dy * .012;


        p.vx *= .88;
        p.vy *= .88;


        p.x += p.vx;
        p.y += p.vy;


        p.a =
          Math.min(
            1,
            p.a + .012
          );
      }


      /* -----------------------------------------
         SCATTER
         ----------------------------------------- */

      else if (
        state.phase === "scatter"
      ) {

        p.vx +=
          (p.x - state.w / 2) *
          .0008;

        p.vy +=
          (p.y - state.h / 2) *
          .0008;


        p.vx *= .995;
        p.vy *= .995;


        p.x += p.vx;
        p.y += p.vy;


        p.a *= .988;
      }


      /* -----------------------------------------
         DRAW
         ----------------------------------------- */

      ctx.beginPath();

      ctx.fillStyle =
        `rgba(
          239,
          220,
          255,
          ${Math.max(
            0,
            p.a * .78
          )}
        )`;


      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );


      ctx.fill();

    }


    /* =====================================================
       GATHER → HOLD
       ===================================================== */

    if (
      elapsed > 900 &&
      state.phase === "gather"
    ) {

      state.phase =
        "hold";

      readableText?.classList.add(
        "px-readable-visible"
      );
    }


    /* =====================================================
       HOLD → QUESTION

       IMPORTANT
       La question ne disparaît jamais toute seule.
       Elle attend un choix.
       ===================================================== */

    if (
      elapsed >
        (
          reduced
            ? 1500
            : 2900
        ) &&
      state.phase === "hold"
    ) {

      showQuestion();

    }


    /* =====================================================
       SCATTER
       ===================================================== */

    if (
      state.phase === "scatter" &&
      elapsed >
        (
          reduced
            ? 2200
            : 4200
        )
    ) {

      finish();

    }


    raf =
      requestAnimationFrame(draw);
  }


  /* =========================================================
     SHOW QUESTION
     ========================================================= */

  function showQuestion() {

    if (
      state.phase === "question" ||
      stopped
    ) {
      return;
    }


    state.phase =
      "question";


    readableText?.classList.add(
      "px-readable-hold"
    );


    question?.classList.add(
      "px-question-show"
    );


    question?.setAttribute(
      "aria-hidden",
      "false"
    );
  }


  /* =========================================================
     DING
     ========================================================= */

  function playDing() {

    try {

      if (!dingSound) return;


      dingSound.currentTime =
        0;


      dingSound.volume =
        0.65;


      const playAttempt =
        dingSound.play();


      if (
        playAttempt?.catch
      ) {

        playAttempt.catch(
          () => {}
        );

      }

    } catch (e) {}

  }


  /* =========================================================
     OUI
     ========================================================= */

  function chooseYes() {

    if (stopped) return;


    question?.classList.remove(
      "px-question-show"
    );


    question?.setAttribute(
      "aria-hidden",
      "true"
    );


    readableText?.classList.remove(
      "px-readable-hold"
    );


    /*
      IMPORTANT

      On ne passe PAS directement à scatter.

      Les particules restent présentes
      pendant que le petit message apparaît.
    */

    state.phase =
      "postyes";


    setTimeout(
      () => {

        if (stopped) return;


        afterYes?.classList.add(
          "px-after-yes-show"
        );


        afterYes?.setAttribute(
          "aria-hidden",
          "false"
        );

      },
      reduced
        ? 300
        : 900
    );
  }


  /* =========================================================
     CONTINUER
     ========================================================= */

  function continueToLastSecret() {

    if (stopped) return;


    /*
      Le DING se déclenche exactement
      quand elle appuie sur Continuer.
    */

    playDing();


    afterYes?.classList.remove(
      "px-after-yes-show"
    );


    afterYes?.setAttribute(
      "aria-hidden",
      "true"
    );


    setTimeout(
      () => {

        if (stopped) return;


        lastSecret?.classList.add(
          "px-last-secret-show"
        );


        lastSecret?.setAttribute(
          "aria-hidden",
          "false"
        );

      },
      reduced
        ? 180
        : 420
    );
  }


  /* =========================================================
     OUVRIR LA LETTRE
     ========================================================= */

  function openTheLetter() {

    if (stopped) return;


    /*
      Deuxième DING.
    */

    playDing();


    lastSecret?.classList.remove(
      "px-last-secret-show"
    );


    lastSecret?.setAttribute(
      "aria-hidden",
      "true"
    );


    /*
      Petite transition avant
      de laisser apparaître la lettre.
    */

    setTimeout(
      () => {

        finish();

      },
      reduced
        ? 120
        : 420
    );
  }


  /* =========================================================
     NON
     ========================================================= */

  function chooseNo() {

    if (stopped) return;


    /*
      NON = sortie du site.
    */

    window.location.replace(
      "about:blank"
    );
  }


  /* =========================================================
     START
     ========================================================= */

  function start() {

    resize();


    const size =
      Math.max(
        52,
        Math.min(
          108,
          state.w * .105
        )
      );


    const first =
      targetPoints(
        "Je t'aime",
        size
      );


    const second =
      targetPoints(
        "Sauveur Patricia",
        Math.max(
          40,
          size * .68
        )
      );


    /*
      Deux lignes bien séparées.
    */

    const offsetY =
      Math.min(
        52,
        size * .55
      );


    for (
      const p of second
    ) {

      p.y +=
        offsetY;

    }


    for (
      const p of first
    ) {

      p.y -=
        offsetY;

    }


    seedParticles(
      first.concat(second)
    );


    state.startedAt =
      performance.now();


    state.phase =
      "gather";


    cancelAnimationFrame(
      raf
    );


    raf =
      requestAnimationFrame(
        draw
      );
  }


  /* =========================================================
     FINISH
     ========================================================= */

  function finish() {

    if (stopped) return;


    stopped = true;


    cancelAnimationFrame(
      raf
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


    /*
      Le particle screen disparaît
      et laisse apparaître le site.
    */

    intro?.classList.add(
      "hidden"
    );


    popup?.classList.add(
      "hidden"
    );


    document.body.classList.add(
      "px-experience-finished"
    );
  }


  /* =========================================================
     BUTTON EVENTS
     ========================================================= */

  yes?.addEventListener(
    "click",
    chooseYes
  );


  no?.addEventListener(
    "click",
    chooseNo
  );


  continueBtn?.addEventListener(
    "click",
    continueToLastSecret
  );


  openLetter?.addEventListener(
    "click",
    openTheLetter
  );


  /* =========================================================
     RESIZE
     ========================================================= */

  window.addEventListener(
    "resize",
    () => {

      resize();


      const size =
        Math.max(
          52,
          Math.min(
            108,
            state.w * .105
          )
        );


      const first =
        targetPoints(
          "Je t'aime",
          size
        );


      const second =
        targetPoints(
          "Sauveur Patricia",
          Math.max(
            40,
            size * .68
          )
        );


      const offsetY =
        Math.min(
          52,
          size * .55
        );


      for (
        const p of second
      ) {

        p.y +=
          offsetY;

      }


      for (
        const p of first
      ) {

        p.y -=
          offsetY;

      }


      morphTo(
        first.concat(second)
      );

    }
  );


  /* =========================================================
     START EXPERIENCE
     ========================================================= */

  start();

})();


/* =========================================================
   EXACT DECORATIVE GLIDE
   Fixed order, slow and translucent
   ========================================================= */

(() => {

  const wrap =
    document.getElementById(
      "px-glide-decor"
    );


  if (!wrap) return;


  const symbols = [

    "❤️",
    "🤭",
    "🤭",
    "💜",
    "💕",
    "💗",
    "🤭",
    "💕",
    "💜",
    "💜",
    "💜",
    "💕",
    "💮",
    "🌸",
    "❀",
    "🌸",
    "🌷",
    "🌷",
    "💮",
    "💮",
    "✿",
    "💮",
    "🌸",
    "🌷",
    "🌸",
    "💮"

  ];


  const topPositions = [

    6,
    11,
    15,
    19,
    24,
    29,
    33,
    38,
    42,
    46,
    50,
    54,
    58,
    62,
    66,
    70,
    74,
    77,
    80,
    83,
    86,
    89,
    91,
    14,
    55,
    68

  ];


  const frag =
    document.createDocumentFragment();


  symbols.forEach(
    (symbol, i) => {

      const el =
        document.createElement(
          "span"
        );


      el.className =
        "px-glide-symbol";


      el.textContent =
        symbol;


      el.style.setProperty(
        "--px-y",
        `${topPositions[i]}vh`
      );


      el.style.setProperty(
        "--px-size",
        `${18 + (i % 5) * 2}px`
      );


      el.style.setProperty(
        "--px-opacity",
        `${0.17 + (i % 4) * .035}`
      );


      el.style.setProperty(
        "--px-duration",
        `${22 + (i % 6) * 2.3}s`
      );


      el.style.setProperty(
        "--px-delay",
        `${-(i * 1.35)}s`
      );


      el.style.setProperty(
        "--px-rise",
        `${-2 - (i % 4)}vh`
      );


      el.style.setProperty(
        "--px-end",
        `${-4 - (i % 5)}vh`
      );


      el.style.setProperty(
        "--px-r0",
        `${-5 + (i % 5) * 2}deg`
      );


      el.style.setProperty(
        "--px-r1",
        `${2 - (i % 4) * 2}deg`
      );


      el.style.setProperty(
        "--px-r2",
        `${-4 + (i % 5) * 2}deg`
      );


      frag.appendChild(
        el
      );

    }
  );


  wrap.appendChild(
    frag
  );

})();