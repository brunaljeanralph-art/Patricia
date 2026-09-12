/* =========================================================
   PATRICIA EXPERIENCE
   PART 1
   Particle Heart -> Patricia -> Je t'aime Sauveur Patricia
   -> Existing website
   ========================================================= */

(() => {
  "use strict"

  /* -------------------------------------------------------
     Protection
     Prevents this experience from being initialized twice
     ------------------------------------------------------- */

  if (window.__patriciaExperienceStarted) {
    return
  }

  window.__patriciaExperienceStarted = true


  /* -------------------------------------------------------
     Start only after the page is ready
     ------------------------------------------------------- */

  const boot = () => {
    if (document.getElementById("px-experience")) {
      return
    }

    createExperience()
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {
      once: true
    })
  } else {
    boot()
  }


  /* =======================================================
     EXPERIENCE CREATION
     ======================================================= */

  function createExperience() {

    /* -----------------------------------------------------
       Main wrapper
       ----------------------------------------------------- */

    const experience = document.createElement("div")

    experience.id = "px-experience"

    experience.innerHTML = `
      <div class="px-top-anchor"></div>

      <div class="px-aurora px-aurora-a"></div>
      <div class="px-aurora px-aurora-b"></div>
      <div class="px-aurora px-aurora-c"></div>

      <div class="px-grid"></div>
      <div class="px-stars"></div>

      <div class="px-glow-ring px-glow-ring-a"></div>
      <div class="px-glow-ring px-glow-ring-b"></div>

      <div class="px-particle-bloom"></div>

      <div id="px-tulip-drift"></div>

      <canvas id="px-particle-canvas"></canvas>

      <div class="px-readable-text">
        <span
          class="px-readable-line px-readable-name"
          id="px-readable-name"
        ></span>

        <span
          class="px-readable-line px-readable-love"
          id="px-readable-love"
        ></span>
      </div>

      <div class="px-opening-copy">
        <span class="px-opening-line"></span>

        <p class="px-opening-small" id="px-opening-small">
          une petite trace de moi pour toi
        </p>

        <span class="px-opening-line"></span>
      </div>

      <div
        class="px-question"
        id="px-question"
      ></div>

      <button
        id="px-skip"
        type="button"
        aria-label="Passer l'introduction"
      >
        Passer
      </button>
    `

    document.body.appendChild(experience)


    /* -----------------------------------------------------
       References
       ----------------------------------------------------- */

    const canvas =
      document.getElementById("px-particle-canvas")

    const ctx =
      canvas.getContext("2d", {
        alpha: true
      })

    const readableName =
      document.getElementById("px-readable-name")

    const readableLove =
      document.getElementById("px-readable-love")

    const openingSmall =
      document.getElementById("px-opening-small")

    const skipButton =
      document.getElementById("px-skip")

    const tulipDrift =
      document.getElementById("px-tulip-drift")


    if (!canvas || !ctx) {
      experience.remove()
      return
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    const settings = {
      mobile:
        window.matchMedia("(max-width: 600px)").matches,

      particleCount: 0,

      dpr: Math.min(
        window.devicePixelRatio || 1,
        2
      ),

      particleSize:
        window.matchMedia("(max-width: 600px)").matches
          ? 1.35
          : 1.55,

      backgroundFade: 0.18
    }


    settings.particleCount =
      settings.mobile
        ? 720
        : 1250


    /* =====================================================
       STATE
       ===================================================== */

    const STATES = {
      RISING: "rising",
      HEART: "heart",
      NAME: "name",
      LOVE: "love",
      EXIT: "exit",
      FINISHED: "finished"
    }

    let state = STATES.RISING

    let width = 0
    let height = 0

    let animationFrame = null

    let lastTime = 0

    let stateStartedAt =
      performance.now()

    let transitionLocked = false

    let currentTarget = null

    let pointerX = 0
    let pointerY = 0

    let pointerActive = false


    /* =====================================================
       PARTICLES
       ===================================================== */

    const particles = []


    function random(min, max) {
      return Math.random() * (max - min) + min
    }


    function clamp(value, min, max) {
      return Math.max(
        min,
        Math.min(max, value)
      )
    }


    function easeOutCubic(value) {
      const x = clamp(value, 0, 1)

      return 1 - Math.pow(1 - x, 3)
    }


    function easeInOut(value) {
      const x = clamp(value, 0, 1)

      return x < 0.5
        ? 2 * x * x
        : 1 - Math.pow(-2 * x + 2, 2) / 2
    }


    function createParticle() {
      return {
        x: random(
          width * 0.25,
          width * 0.75
        ),

        y: random(
          height * 0.92,
          height * 1.08
        ),

        vx: random(-0.25, 0.25),

        vy: random(
          -2.7,
          -0.7
        ),

        size: random(
          settings.particleSize * 0.45,
          settings.particleSize * 1.45
        ),

        alpha: random(
          0.25,
          0.95
        ),

        life: random(
          0,
          1
        ),

        drift:
          random(-0.45, 0.45),

        swirl:
          random(0.002, 0.009),

        phase:
          random(0, Math.PI * 2),

        seed:
          Math.random(),

        targetX: 0,
        targetY: 0
      }
    }


    function createParticles() {
      particles.length = 0

      for (
        let i = 0;
        i < settings.particleCount;
        i++
      ) {
        particles.push(
          createParticle()
        )
      }
    }


    /* =====================================================
       CANVAS SIZE
       ===================================================== */

    function resizeCanvas() {

      width =
        window.innerWidth

      height =
        window.innerHeight

      canvas.width =
        Math.floor(
          width * settings.dpr
        )

      canvas.height =
        Math.floor(
          height * settings.dpr
        )

      canvas.style.width =
        `${width}px`

      canvas.style.height =
        `${height}px`

      ctx.setTransform(
        settings.dpr,
        0,
        0,
        settings.dpr,
        0,
        0
      )

      createParticles()

      if (currentTarget) {
        currentTarget =
          buildTarget(currentTarget.type)
      }
    }


    window.addEventListener(
      "resize",
      resizeCanvas,
      {
        passive: true
      }
    )


    /* =====================================================
       TARGET GENERATOR
       ===================================================== */

    function buildHeartTarget() {

      const points = []

      const scale =
        Math.min(
          width,
          height
        ) * (
          settings.mobile
            ? 0.0105
            : 0.0095
        )

      const centerX =
        width / 2

      const centerY =
        height * 0.45


      const amount =
        settings.particleCount


      for (
        let i = 0;
        i < amount;
        i++
      ) {

        const t =
          (i / amount) *
          Math.PI *
          2

        const x =
          16 *
          Math.pow(
            Math.sin(t),
            3
          )

        const y =
          -(
            13 *
              Math.cos(t) -
            5 *
              Math.cos(2 * t) -
            2 *
              Math.cos(3 * t) -
            Math.cos(4 * t)
          )

        const fill =
          Math.sqrt(
            Math.random()
          )

        points.push({
          x:
            centerX +
            x *
              scale *
              fill,

          y:
            centerY +
            y *
              scale *
              fill
        })
      }

      return {
        type: "heart",
        points
      }
    }


    /* -----------------------------------------------------
       Text target
       ----------------------------------------------------- */

    function buildTextTarget(text) {

      const offscreen =
        document.createElement("canvas")

      const offCtx =
        offscreen.getContext("2d")

      const maxWidth =
        Math.min(
          width * (
            settings.mobile
              ? 0.88
              : 0.82
          ),
          1050
        )


      let fontSize =
        settings.mobile
          ? 58
          : 92


      if (text.length > 18) {
        fontSize =
          settings.mobile
            ? 31
            : 58
      }


      if (text.length > 25) {
        fontSize =
          settings.mobile
            ? 25
            : 48
      }


      offscreen.width =
        Math.ceil(maxWidth)

      offscreen.height =
        Math.ceil(
          fontSize * 1.7
        )


      offCtx.clearRect(
        0,
        0,
        offscreen.width,
        offscreen.height
      )


      offCtx.fillStyle =
        "#ffffff"

      offCtx.textAlign =
        "center"

      offCtx.textBaseline =
        "middle"

      offCtx.font =
        `700 ${fontSize}px Arial, Helvetica, sans-serif`


      offCtx.fillText(
        text,
        offscreen.width / 2,
        offscreen.height / 2,
        maxWidth
      )


      const imageData =
        offCtx.getImageData(
          0,
          0,
          offscreen.width,
          offscreen.height
        )


      const points = []

      const step =
        settings.mobile
          ? 4
          : 4


      for (
        let y = 0;
        y < offscreen.height;
        y += step
      ) {

        for (
          let x = 0;
          x < offscreen.width;
          x += step
        ) {

          const index =
            (
              y *
                offscreen.width +
              x
            ) *
            4

          const alpha =
            imageData.data[index + 3]


          if (
            alpha > 120 &&
            Math.random() > 0.18
          ) {
            points.push({
              x:
                x -
                offscreen.width / 2,

              y:
                y -
                offscreen.height / 2
            })
          }
        }
      }


      const centerX =
        width / 2

      const centerY =
        height * 0.45


      return {
        type: "text",
        text,
        points:
          points.length
            ? points
            : [
                {
                  x: 0,
                  y: 0
                }
              ],
        centerX,
        centerY
      }
    }


    function buildTarget(type) {

      if (type === "heart") {
        return buildHeartTarget()
      }

      if (type === "name") {
        return buildTextTarget(
          "Patricia"
        )
      }

      if (type === "love") {
        return buildTextTarget(
          "Je t'aime Sauveur Patricia"
        )
      }

      return null
    }


    /* =====================================================
       ASSIGN TARGETS
       ===================================================== */

    function assignTarget(target) {

      currentTarget =
        target

      if (!target || !target.points) {
        return
      }


      const targetPoints =
        target.points


      for (
        let i = 0;
        i < particles.length;
        i++
      ) {

        const particle =
          particles[i]

        const point =
          targetPoints[
            i % targetPoints.length
          ]


        if (target.type === "heart") {

          particle.targetX =
            point.x

          particle.targetY =
            point.y

        } else {

          particle.targetX =
            target.centerX +
            point.x

          particle.targetY =
            target.centerY +
            point.y
        }
      }
    }


    /* =====================================================
       PARTICLE COLORS
       ===================================================== */

    function particleColor(
      particle
    ) {

      const glow =
        0.48 +
        particle.alpha *
          0.52

      return `rgba(255,255,255,${glow})`
    }


    /* =====================================================
       RISING PARTICLES
       ===================================================== */

    function updateRisingParticle(
      particle,
      delta
    ) {

      particle.life +=
        delta * 0.00045


      particle.phase +=
        particle.swirl *
        delta


      particle.x +=
        (
          particle.vx +
          Math.sin(
            particle.phase
          ) *
            0.18 +
          particle.drift *
            0.08
        ) *
        delta *
        0.06


      particle.y +=
        particle.vy *
        delta *
        0.06


      particle.vy +=
        Math.sin(
          particle.phase * 0.7
        ) *
        0.0012 *
        delta


      if (
        particle.y <
        height * 0.15
      ) {

        particle.y =
          height *
          random(
            0.94,
            1.08
          )

        particle.x =
          random(
            width * 0.20,
            width * 0.80
          )

        particle.vy =
          random(
            -2.7,
            -0.7
          )

        particle.life = 0
      }


      if (
        particle.x <
        -30
      ) {
        particle.x =
          width + 30
      }

      if (
        particle.x >
        width + 30
      ) {
        particle.x =
          -30
      }
    }


    /* =====================================================
       TARGET MOVEMENT
       ===================================================== */

    function updateTargetParticle(
      particle,
      delta
    ) {

      const dx =
        particle.targetX -
        particle.x

      const dy =
        particle.targetY -
        particle.y


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        )


      const force =
        clamp(
          distance / 240,
          0.035,
          0.22
        )


      particle.x +=
        dx *
        force *
        delta *
        0.06


      particle.y +=
        dy *
        force *
        delta *
        0.06


      particle.phase +=
        0.0025 *
        delta


      particle.x +=
        Math.sin(
          particle.phase +
          particle.seed * 10
        ) *
        0.07

      particle.y +=
        Math.cos(
          particle.phase +
          particle.seed * 7
        ) *
        0.07
    }


    /* =====================================================
       DRAW PARTICLE
       ===================================================== */

    function drawParticle(
      particle
    ) {

      const radius =
        particle.size


      ctx.beginPath()

      ctx.arc(
        particle.x,
        particle.y,
        radius,
        0,
        Math.PI * 2
      )

      ctx.fillStyle =
        particleColor(
          particle
        )

      ctx.fill()
    }


    /* =====================================================
       PARTICLE BURST
       ===================================================== */

    function scatterParticles(
      strength = 1
    ) {

      const centerX =
        width / 2

      const centerY =
        height * 0.45


      for (
        const particle
        of particles
      ) {

        const dx =
          particle.x -
          centerX

        const dy =
          particle.y -
          centerY


        const distance =
          Math.sqrt(
            dx * dx +
            dy * dy
          ) || 1


        const nx =
          dx / distance

        const ny =
          dy / distance


        particle.vx =
          nx *
          random(
            2.2,
            6.8
          ) *
          strength

        particle.vy =
          ny *
          random(
            2.2,
            6.8
          ) *
          strength

        particle.x +=
          nx *
          random(
            4,
            18
          )

        particle.y +=
          ny *
          random(
            4,
            18
          )
      }
    }


    /* =====================================================
       TRANSITION TO TARGET
       ===================================================== */

    function beginTarget(
      type
    ) {

      const target =
        buildTarget(type)

      if (!target) {
        return
      }


      assignTarget(
        target
      )


      stateStartedAt =
        performance.now()

      transitionLocked =
        false
    }


    /* =====================================================
       STATE CHANGES
       ===================================================== */

    function setState(
      nextState
    ) {

      if (
        state === nextState
      ) {
        return
      }


      state =
        nextState

      stateStartedAt =
        performance.now()


      if (
        state === STATES.HEART
      ) {

        openingSmall.textContent =
          "si tu vois quelque chose dans le silence..."

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )

        beginTarget(
          "heart"
        )

        return
      }


      if (
        state === STATES.NAME
      ) {

        openingSmall.textContent =
          "ce n'était que le début"

        readableName.classList.add(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )

        beginTarget(
          "name"
        )

        return
      }


      if (
        state === STATES.LOVE
      ) {

        openingSmall.textContent =
          "et maintenant... lis bien"

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.add(
          "is-active"
        )

        beginTarget(
          "love"
        )

        return
      }


      if (
        state === STATES.EXIT
      ) {

        openingSmall.textContent =
          ""

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )

        scatterParticles(
          1.25
        )

        setTimeout(
          revealExistingWebsite,
          1150
        )

        return
      }
    }


    /* =====================================================
       CLICK / TOUCH LOGIC
       ===================================================== */

    function handlePointerDown(
      event
    ) {

      pointerActive =
        true

      pointerX =
        event.clientX

      pointerY =
        event.clientY


      if (
        state === STATES.RISING
      ) {

        setState(
          STATES.HEART
        )

        return
      }


      if (
        state === STATES.HEART
      ) {

        setState(
          STATES.NAME
        )

        return
      }


      if (
        state === STATES.NAME
      ) {

        setState(
          STATES.LOVE
        )

        return
      }


      if (
        state === STATES.LOVE
      ) {

        setState(
          STATES.EXIT
        )

        return
      }
    }


    function handlePointerUp() {

      pointerActive =
        false
    }


    canvas.addEventListener(
      "pointerdown",
      handlePointerDown,
      {
        passive: true
      }
    )

    canvas.addEventListener(
      "pointerup",
      handlePointerUp,
      {
        passive: true
      }
    )

    canvas.addEventListener(
      "pointercancel",
      handlePointerUp,
      {
        passive: true
      }
    )


    canvas.addEventListener(
      "pointermove",
      event => {

        pointerX =
          event.clientX

        pointerY =
          event.clientY
      },
      {
        passive: true
      }
    )


    /* =====================================================
       SKIP
       ===================================================== */

    skipButton.addEventListener(
      "click",
      () => {

        if (
          state === STATES.EXIT ||
          state === STATES.FINISHED
        ) {
          return
        }

        setState(
          STATES.EXIT
        )
      }
    )


    /* =====================================================
       REVEAL EXISTING WEBSITE
       ===================================================== */

    function revealExistingWebsite() {

      state =
        STATES.FINISHED


      experience.classList.add(
        "px-done"
      )


      /*
       * IMPORTANT
       *
       * We do not touch the existing letter.
       * We do not touch bgMusic.
       * We do not create another audio element.
       */


      setTimeout(
        () => {

          experience.remove()

        },
        1300
      )
    }


    /* =====================================================
       INITIAL RISING MODE
       ===================================================== */

    function initializeRisingMode() {

      readableName.textContent =
        "Patricia"

      readableLove.textContent =
        "Je t'aime Sauveur Patricia"


      readableName.classList.remove(
        "is-active"
      )

      readableLove.classList.remove(
        "is-active"
      )


      openingSmall.textContent =
        "une petite trace de moi pour toi"


      createParticles()
    }


    /* =====================================================
       MAIN ANIMATION LOOP
       ===================================================== */

    function animate(
      timestamp
    ) {

      if (!lastTime) {
        lastTime =
          timestamp
      }


      const delta =
        Math.min(
          timestamp -
            lastTime,
          34
        )


      lastTime =
        timestamp


      ctx.clearRect(
        0,
        0,
        width,
        height
      )


      /* ---------------------------------------------------
         Update particles
         --------------------------------------------------- */

      for (
        const particle
        of particles
      ) {

        if (
          state === STATES.RISING
        ) {

          updateRisingParticle(
            particle,
            delta
          )

        } else {

          updateTargetParticle(
            particle,
            delta
          )
        }


        drawParticle(
          particle
        )
      }


      /* ---------------------------------------------------
         Automatic first heart formation
         --------------------------------------------------- */

      if (
        state === STATES.RISING
      ) {

        const elapsed =
          timestamp -
          stateStartedAt


        /*
         * The heart does not appear immediately.
         * Particles first rise naturally.
         */

        if (
          elapsed >
          4700
        ) {

          setState(
            STATES.HEART
          )
        }
      }


      /* ---------------------------------------------------
         Heart -> Patricia
         --------------------------------------------------- */

      if (
        state === STATES.HEART
      ) {

        const elapsed =
          timestamp -
          stateStartedAt


        if (
          elapsed >
          5200 &&
          !transitionLocked
        ) {

          transitionLocked =
            true

          setTimeout(
            () => {

              if (
                state === STATES.HEART
              ) {
                setState(
                  STATES.NAME
                )
              }

            },
            300
          )
        }
      }


      /* ---------------------------------------------------
         Patricia -> Love phrase
         --------------------------------------------------- */

      if (
        state === STATES.NAME
      ) {

        const elapsed =
          timestamp -
          stateStartedAt


        if (
          elapsed >
          4700 &&
          !transitionLocked
        ) {

          transitionLocked =
            true

          setTimeout(
            () => {

              if (
                state === STATES.NAME
              ) {
                setState(
                  STATES.LOVE
                )
              }

            },
            300
          )
        }
      }


      /* ---------------------------------------------------
         Love phrase stays until click
         --------------------------------------------------- */

      requestAnimationFrame(
        animate
      )
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    resizeCanvas()

    initializeRisingMode()

    animationFrame =
      requestAnimationFrame(
        animate
      )


    /* =====================================================
       CLEANUP
       ===================================================== */

    window.addEventListener(
      "pagehide",
      () => {

        if (
          animationFrame
        ) {
          cancelAnimationFrame(
            animationFrame
          )
        }
      },
      {
        once: true
      }
    )
  }

})()