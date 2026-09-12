/* =========================================================
   PATRICIA EXPERIENCE
   FINAL PART 1

   Particle Heart
   -> Patricia
   -> Je t'aime Sauveur Patricia
   -> Existing website

   IMPORTANT
   - Does NOT create another audio
   - Does NOT modify the letter
   - Does NOT modify bgMusic
   - Works with experience.css
   ========================================================= */

(() => {
  "use strict"

  /* =======================================================
     PROTECTION
     ======================================================= */

  if (window.__patriciaExperienceStarted) {
    return
  }

  window.__patriciaExperienceStarted = true


  /* =======================================================
     BOOT
     ======================================================= */

  function boot() {
    if (document.getElementById("px-experience")) {
      return
    }

    createExperience()
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      { once: true }
    )
  } else {
    boot()
  }


  /* =======================================================
     CREATE EXPERIENCE
     ======================================================= */

  function createExperience() {

    const experience =
      document.createElement("div")

    experience.id =
      "px-experience"

    experience.setAttribute(
      "aria-label",
      "Patricia experience"
    )

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

      <canvas
        id="px-particle-canvas"
        aria-hidden="true"
      ></canvas>

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

        <p
          class="px-opening-small"
          id="px-opening-small"
        >
          une petite trace de moi pour toi
        </p>

        <span class="px-opening-line"></span>
      </div>

      <div
        class="px-question"
        id="px-question"
        aria-hidden="true"
      ></div>

      <button
        id="px-skip"
        type="button"
        aria-label="Passer l'introduction"
      >
        Passer
      </button>
    `

    document.body.appendChild(
      experience
    )


    /* =====================================================
       REFERENCES
       ===================================================== */

    const canvas =
      experience.querySelector(
        "#px-particle-canvas"
      )

    const ctx =
      canvas
        ? canvas.getContext("2d", {
            alpha: true
          })
        : null

    const readableName =
      experience.querySelector(
        "#px-readable-name"
      )

    const readableLove =
      experience.querySelector(
        "#px-readable-love"
      )

    const openingSmall =
      experience.querySelector(
        "#px-opening-small"
      )

    const skipButton =
      experience.querySelector(
        "#px-skip"
      )


    if (!canvas || !ctx) {
      experience.remove()
      return
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    const mobileQuery =
      window.matchMedia(
        "(max-width: 600px)"
      )

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      )

    const settings = {

      mobile:
        mobileQuery.matches,

      reducedMotion:
        reducedMotionQuery.matches,

      dpr:
        Math.min(
          window.devicePixelRatio || 1,
          2
        ),

      particleCount:
        mobileQuery.matches
          ? 520
          : 900,

      particleSize:
        mobileQuery.matches
          ? 1.25
          : 1.50
    }


    /* =====================================================
       STATES
       ===================================================== */

    const STATES = {
      RISING: "rising",
      HEART: "heart",
      BURST_TO_NAME: "burst-to-name",
      NAME: "name",
      BURST_TO_LOVE: "burst-to-love",
      LOVE: "love",
      EXIT: "exit",
      FINISHED: "finished"
    }


    let state =
      STATES.RISING

    let width = 0
    let height = 0

    let animationFrame = null

    let lastTime = 0

    let stateStartedAt =
      performance.now()

    let transitionLocked =
      false

    let currentTarget =
      null

    let pointerActive =
      false

    let burstStartedAt =
      0

    let burstDuration =
      720


    /* =====================================================
       PARTICLES
       ===================================================== */

    const particles = []


    function random(min, max) {
      return Math.random() *
        (max - min) +
        min
    }


    function clamp(value, min, max) {
      return Math.max(
        min,
        Math.min(max, value)
      )
    }


    function easeOutCubic(value) {

      const x =
        clamp(
          value,
          0,
          1
        )

      return 1 -
        Math.pow(
          1 - x,
          3
        )
    }


    function lerp(a, b, amount) {

      return a +
        (b - a) *
        amount
    }


    /* =====================================================
       PARTICLE CREATION
       ===================================================== */

    function createParticle() {

      return {

        x:
          random(
            width * 0.18,
            width * 0.82
          ),

        y:
          random(
            height * 0.94,
            height * 1.08
          ),

        vx:
          random(
            -0.22,
            0.22
          ),

        vy:
          random(
            -2.45,
            -0.80
          ),

        size:
          random(
            settings.particleSize * 0.42,
            settings.particleSize * 1.42
          ),

        alpha:
          random(
            0.28,
            0.95
          ),

        life:
          random(
            0,
            1
          ),

        drift:
          random(
            -0.60,
            0.60
          ),

        swirl:
          random(
            0.0015,
            0.007
          ),

        phase:
          random(
            0,
            Math.PI * 2
          ),

        seed:
          Math.random(),

        targetX: 0,
        targetY: 0,

        burstVX: 0,
        burstVY: 0,

        glow:
          random(
            0.6,
            1.4
          )
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

      settings.mobile =
        mobileQuery.matches

      settings.reducedMotion =
        reducedMotionQuery.matches

      settings.dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        )


      canvas.width =
        Math.max(
          1,
          Math.floor(
            width *
            settings.dpr
          )
        )

      canvas.height =
        Math.max(
          1,
          Math.floor(
            height *
            settings.dpr
          )
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

        const oldType =
          currentTarget.type

        currentTarget =
          buildTarget(
            oldType
          )

        assignTarget(
          currentTarget
        )
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
       HEART TARGET
       ===================================================== */

    function buildHeartTarget() {

      const points = []

      const centerX =
        width / 2

      const centerY =
        height *
        (
          settings.mobile
            ? 0.43
            : 0.45
        )


      const scale =
        Math.min(
          width,
          height
        ) *
        (
          settings.mobile
            ? 0.0101
            : 0.0094
        )


      for (
        let i = 0;
        i < settings.particleCount;
        i++
      ) {

        const t =
          Math.random() *
          Math.PI *
          2


        const rawX =
          16 *
          Math.pow(
            Math.sin(t),
            3
          )


        const rawY =
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


        const jitter =
          settings.mobile
            ? 0.70
            : 0.85


        points.push({

          x:
            centerX +
            (
              rawX *
              scale *
              fill
            ) +
            random(
              -jitter,
              jitter
            ),

          y:
            centerY +
            (
              rawY *
              scale *
              fill
            ) +
            random(
              -jitter,
              jitter
            )
        })
      }


      return {
        type: "heart",
        points
      }
    }


    /* =====================================================
       TEXT TARGET
       ===================================================== */

    function fitFontSize(
      offCtx,
      text,
      startingSize,
      maxWidth
    ) {

      let size =
        startingSize


      while (
        size > 12
      ) {

        offCtx.font =
          `700 ${size}px Arial, Helvetica, sans-serif`

        const measured =
          offCtx.measureText(
            text
          ).width

        if (
          measured <= maxWidth
        ) {
          break
        }

        size *= 0.93
      }


      return size
    }


    function buildTextTarget(text) {

      const offscreen =
        document.createElement(
          "canvas"
        )

      const offCtx =
        offscreen.getContext(
          "2d"
        )


      if (!offCtx) {
        return null
      }


      const maxWidth =
        Math.min(
          width *
          (
            settings.mobile
              ? 0.88
              : 0.82
          ),
          1100
        )


      let startingSize


      if (
        text === "Patricia"
      ) {

        startingSize =
          settings.mobile
            ? 72
            : 120

      } else {

        startingSize =
          settings.mobile
            ? 34
            : 62
      }


      const fontSize =
        fitFontSize(
          offCtx,
          text,
          startingSize,
          maxWidth
        )


      const actualWidth =
        Math.ceil(
          Math.min(
            maxWidth,
            offCtx.measureText(
              text
            ).width +
              fontSize * 0.10
          )
        )


      const actualHeight =
        Math.ceil(
          fontSize * 1.60
        )


      offscreen.width =
        Math.max(
          1,
          actualWidth
        )

      offscreen.height =
        Math.max(
          1,
          actualHeight
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
        offscreen.height / 2
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
            ) * 4


          const alpha =
            imageData.data[
              index + 3
            ]


          if (
            alpha > 120 &&
            Math.random() > 0.14
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

        centerX:
          width / 2,

        centerY:
          height *
          (
            settings.mobile
              ? 0.44
              : 0.45
          )
      }
    }


    function buildTarget(type) {

      if (
        type === "heart"
      ) {
        return buildHeartTarget()
      }


      if (
        type === "name"
      ) {
        return buildTextTarget(
          "Patricia"
        )
      }


      if (
        type === "love"
      ) {
        return buildTextTarget(
          "Je t'aime Sauveur Patricia"
        )
      }


      return null
    }


    /* =====================================================
       ASSIGN TARGET
       ===================================================== */

    function assignTarget(
      target
    ) {

      if (
        !target ||
        !target.points ||
        !target.points.length
      ) {
        return
      }


      currentTarget =
        target


      const points =
        target.points


      for (
        let i = 0;
        i < particles.length;
        i++
      ) {

        const particle =
          particles[i]

        const point =
          points[
            i %
            points.length
          ]


        if (
          target.type === "heart"
        ) {

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
       PARTICLE COLOR
       ===================================================== */

    function particleColor(
      particle
    ) {

      const alpha =
        clamp(
          (
            0.42 +
            particle.alpha *
            0.58
          ) *
          particle.glow,
          0.12,
          1
        )


      return `
        rgba(
          255,
          255,
          255,
          ${alpha}
        )
      `
    }


    /* =====================================================
       RISING MODE
       ===================================================== */

    function updateRisingParticle(
      particle,
      delta
    ) {

      if (
        settings.reducedMotion
      ) {

        particle.y -=
          delta *
          0.018

      } else {

        particle.life +=
          delta *
          0.00040


        particle.phase +=
          particle.swirl *
          delta


        const horizontalMotion =
          Math.sin(
            particle.phase
          ) *
          0.20


        const drift =
          particle.drift *
          0.08


        particle.x +=
          (
            particle.vx +
            horizontalMotion +
            drift
          ) *
          delta *
          0.06


        particle.y +=
          particle.vy *
          delta *
          0.06


        particle.vy +=
          Math.sin(
            particle.phase *
            0.7
          ) *
          0.0011 *
          delta
      }


      if (
        particle.y <
        height *
        0.10
      ) {

        respawnRisingParticle(
          particle
        )
      }


      if (
        particle.x <
        -40
      ) {
        particle.x =
          width + 40
      }


      if (
        particle.x >
        width + 40
      ) {
        particle.x =
          -40
      }
    }


    function respawnRisingParticle(
      particle
    ) {

      particle.x =
        random(
          width * 0.18,
          width * 0.82
        )

      particle.y =
        height *
        random(
          0.96,
          1.10
        )


      particle.vx =
        random(
          -0.22,
          0.22
        )


      particle.vy =
        random(
          -2.45,
          -0.80
        )


      particle.phase =
        random(
          0,
          Math.PI * 2
        )

      particle.life = 0
    }


    /* =====================================================
       TARGET MODE
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


      const attraction =
        clamp(
          distance / 300,
          0.035,
          0.24
        )


      const speed =
        settings.reducedMotion
          ? 0.07
          : 0.075


      particle.x +=
        dx *
        attraction *
        delta *
        speed


      particle.y +=
        dy *
        attraction *
        delta *
        speed


      if (
        !settings.reducedMotion
      ) {

        particle.phase +=
          0.0023 *
          delta


        particle.x +=
          Math.sin(
            particle.phase +
            particle.seed * 9
          ) *
          0.055


        particle.y +=
          Math.cos(
            particle.phase +
            particle.seed * 7
          ) *
          0.055
      }
    }


    /* =====================================================
       BURST MODE
       ===================================================== */

    function prepareBurst() {

      const centerX =
        width / 2

      const centerY =
        height *
        (
          settings.mobile
            ? 0.44
            : 0.45
        )


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


        const tangentX =
          -ny

        const tangentY =
          nx


        const radialStrength =
          random(
            2.8,
            7.0
          )


        const tangentStrength =
          random(
            -1.6,
            1.6
          )


        particle.burstVX =
          nx *
          radialStrength +
          tangentX *
          tangentStrength


        particle.burstVY =
          ny *
          radialStrength +
          tangentY *
          tangentStrength -
          random(
            0.5,
            2.0
          )
      }
    }


    function updateBurstParticle(
      particle,
      delta,
      progress
    ) {

      const damping =
        Math.pow(
          0.92,
          delta / 16.67
        )


      particle.burstVX *=
        damping

      particle.burstVY *=
        damping


      particle.burstVY +=
        0.0015 *
        delta


      const multiplier =
        0.95 +
        (
          1 -
          progress
        ) *
        0.45


      particle.x +=
        particle.burstVX *
        delta *
        0.06 *
        multiplier


      particle.y +=
        particle.burstVY *
        delta *
        0.06 *
        multiplier
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


      ctx.shadowBlur =
        settings.reducedMotion
          ? 0
          : 5


      ctx.shadowColor =
        "rgba(255,255,255,0.45)"


      ctx.fill()


      ctx.shadowBlur =
        0
    }


    /* =====================================================
       TRANSITION
       ===================================================== */

    function startBurstTo(
      nextState
    ) {

      if (
        transitionLocked
      ) {
        return
      }


      transitionLocked =
        true


      prepareBurst()


      burstStartedAt =
        performance.now()


      state =
        nextState

      stateStartedAt =
        burstStartedAt
    }


    function finishBurst(
      targetType,
      finalState
    ) {

      const target =
        buildTarget(
          targetType
        )


      if (!target) {
        return
      }


      assignTarget(
        target
      )


      state =
        finalState

      stateStartedAt =
        performance.now()

      transitionLocked =
        false
    }


    /* =====================================================
       STATE DISPLAY
       ===================================================== */

    function updateCopy() {

      if (
        state === STATES.RISING
      ) {

        openingSmall.textContent =
          "une petite trace de moi pour toi"

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )

        return
      }


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

        return
      }


      if (
        state === STATES.NAME ||
        state === STATES.BURST_TO_NAME
      ) {

        openingSmall.textContent =
          "ce n'était que le début"

        readableName.classList.add(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )

        return
      }


      if (
        state === STATES.LOVE ||
        state === STATES.BURST_TO_LOVE
      ) {

        openingSmall.textContent =
          "et maintenant... lis bien"

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.add(
          "is-active"
        )

        return
      }


      if (
        state === STATES.EXIT ||
        state === STATES.FINISHED
      ) {

        openingSmall.textContent =
          ""

        readableName.classList.remove(
          "is-active"
        )

        readableLove.classList.remove(
          "is-active"
        )
      }
    }


    /* =====================================================
       STATE CHANGE
       ===================================================== */

    function goToHeart() {

      transitionLocked =
        false

      state =
        STATES.HEART

      stateStartedAt =
        performance.now()

      currentTarget =
        buildTarget(
          "heart"
        )

      assignTarget(
        currentTarget
      )

      updateCopy()
    }


    function goToName() {

      startBurstTo(
        STATES.BURST_TO_NAME
      )

      updateCopy()
    }


    function goToLove() {

      startBurstTo(
        STATES.BURST_TO_LOVE
      )

      updateCopy()
    }


    function exitExperience() {

      if (
        transitionLocked
      ) {
        return
      }


      transitionLocked =
        true


      prepareBurst()


      state =
        STATES.EXIT

      stateStartedAt =
        performance.now()

      burstStartedAt =
        performance.now()

      updateCopy()


      setTimeout(
        revealExistingWebsite,
        900
      )
    }


    /* =====================================================
       POINTER
       ===================================================== */

    function handlePointerDown(
      event
    ) {

      if (
        state === STATES.FINISHED ||
        transitionLocked
      ) {
        return
      }


      pointerActive =
        true


      if (
        state === STATES.RISING
      ) {

        goToHeart()

        return
      }


      if (
        state === STATES.HEART
      ) {

        goToName()

        return
      }


      if (
        state === STATES.NAME
      ) {

        goToLove()

        return
      }


      if (
        state === STATES.LOVE
      ) {

        exitExperience()
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

        if (!pointerActive) {
          return
        }

        /*
         * We intentionally keep this empty.
         * It prevents unnecessary work
         * while the finger is moving.
         */
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
      event => {

        event.preventDefault()
        event.stopPropagation()

        if (
          state === STATES.FINISHED ||
          transitionLocked
        ) {
          return
        }


        exitExperience()
      }
    )


    /* =====================================================
       REVEAL EXISTING WEBSITE
       ===================================================== */

    function revealExistingWebsite() {

      if (
        state === STATES.FINISHED
      ) {
        return
      }


      state =
        STATES.FINISHED


      experience.classList.add(
        "px-done"
      )


      /*
       * We do NOT:
       * - change the letter
       * - change index.html content
       * - create another music element
       * - restart bgMusic
       * - touch script.js
       */


      setTimeout(
        () => {

          if (
            experience &&
            experience.parentNode
          ) {
            experience.remove()
          }

        },
        1200
      )
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initialize() {

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


      experience.classList.remove(
        "px-done"
      )


      createParticles()


      if (
        settings.reducedMotion
      ) {

        state =
          STATES.HEART

        currentTarget =
          buildTarget(
            "heart"
          )

        assignTarget(
          currentTarget
        )

        updateCopy()
      }
    }


    /* =====================================================
       ANIMATION
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
         PARTICLE UPDATE
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


        } else if (
          state === STATES.HEART ||
          state === STATES.NAME ||
          state === STATES.LOVE
        ) {

          updateTargetParticle(
            particle,
            delta
          )


        } else if (
          state === STATES.BURST_TO_NAME ||
          state === STATES.BURST_TO_LOVE ||
          state === STATES.EXIT
        ) {

          const progress =
            clamp(
              (
                timestamp -
                burstStartedAt
              ) /
              burstDuration,
              0,
              1
            )


          updateBurstParticle(
            particle,
            delta,
            progress
          )
        }


        drawParticle(
          particle
        )
      }


      /* ---------------------------------------------------
         AUTOMATIC RISING -> HEART ONLY
         --------------------------------------------------- */

      if (
        state === STATES.RISING
      ) {

        const elapsed =
          timestamp -
          stateStartedAt


        const waitTime =
          settings.reducedMotion
            ? 0
            : 4700


        if (
          elapsed >=
          waitTime
        ) {

          goToHeart()
        }
      }


      /* ---------------------------------------------------
         BURST -> NAME
         --------------------------------------------------- */

      if (
        state ===
        STATES.BURST_TO_NAME
      ) {

        const elapsed =
          timestamp -
          burstStartedAt


        if (
          elapsed >=
          burstDuration
        ) {

          finishBurst(
            "name",
            STATES.NAME
          )

          updateCopy()
        }
      }


      /* ---------------------------------------------------
         BURST -> LOVE
         --------------------------------------------------- */

      if (
        state ===
        STATES.BURST_TO_LOVE
      ) {

        const elapsed =
          timestamp -
          burstStartedAt


        if (
          elapsed >=
          burstDuration
        ) {

          finishBurst(
            "love",
            STATES.LOVE
          )

          updateCopy()
        }
      }


      /* ---------------------------------------------------
         EXIT
         --------------------------------------------------- */

      if (
        state === STATES.EXIT
      ) {

        /*
         * The website reveal is already scheduled.
         * Nothing else is changed here.
         */
      }


      animationFrame =
        window.requestAnimationFrame(
          animate
        )
    }


    /* =====================================================
       START
       ===================================================== */

    resizeCanvas()

    initialize()

    animationFrame =
      window.requestAnimationFrame(
        animate
      )


    /* =====================================================
       CLEANUP
       ===================================================== */

    window.addEventListener(
      "pagehide",
      () => {

        if (
          animationFrame !== null
        ) {

          window.cancelAnimationFrame(
            animationFrame
          )

          animationFrame =
            null
        }

      },
      {
        once: true
      }
    )
  }

})()