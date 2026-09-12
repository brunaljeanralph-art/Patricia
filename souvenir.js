document.addEventListener("DOMContentLoaded", () => {

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

  if (
    !stage ||
    !photo ||
    !frame ||
    !caption ||
    !count ||
    !progress
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

  const PHOTO_PATH =
    "assets/souvenirs/photo";


  /* =========================================================
     STATE
     ========================================================= */

  let currentPhoto = 1;

  let phase = "idle";

  let phaseStart = 0;

  let pausedAt = 0;

  let pauseStarted = 0;

  let isPaused = false;

  let animationFrame = null;

  let imageToken = 0;

  let started = false;


  /* =========================================================
     HELPERS
     ========================================================= */

  function photoNumber(number) {
    return String(number).padStart(2, "0");
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
    progress.style.width =
      `${Math.max(0, Math.min(100, value))}%`;
  }


  function setLoading(state) {

    if (!loader) {
      return;
    }

    loader.classList.toggle(
      "is-visible",
      state
    );
  }


  function preloadImage(number) {

    return new Promise(
      (resolve, reject) => {

        const img =
          new Image();

        img.decoding =
          "async";

        img.onload = async () => {

          try {

            if (
              typeof img.decode === "function"
            ) {
              await img.decode();
            }

          } catch (_) {
            /* Image already loaded.
               Continue normally. */
          }

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


  async function showPhoto(number) {

    const token =
      ++imageToken;

    setLoading(true);

    try {

      const loaded =
        await preloadImage(number);

      if (token !== imageToken) {
        return;
      }

      photo.src =
        loaded.src;

      currentPhoto =
        number;

      updateCounter();

      setLoading(false);

    } catch (error) {

      if (token !== imageToken) {
        return;
      }

      console.warn(
        "Souvenir introuvable",
        error
      );

      setLoading(false);

      moveToNextPhoto();
    }
  }


  function applyPhaseStyles(progressValue) {

    if (phase === "enter") {

      const p =
        Math.min(
          1,
          Math.max(
            0,
            progressValue / ENTER_TIME
          )
        );

      const eased =
        1 -
        Math.pow(
          1 - p,
          3
        );

      frame.style.transform =
        `translate3d(0, ${110 - (110 * eased)}%, 0)`;

      frame.style.opacity =
        String(eased);

      setProgress(
        eased * 15
      );

      return;
    }


    if (phase === "hold") {

      const p =
        Math.min(
          1,
          Math.max(
            0,
            progressValue / HOLD_TIME
          )
        );

      frame.style.transform =
        "translate3d(0, 0, 0)";

      frame.style.opacity =
        "1";

      setProgress(
        15 + (p * 70)
      );

      return;
    }


    if (phase === "leave") {

      const p =
        Math.min(
          1,
          Math.max(
            0,
            progressValue / LEAVE_TIME
          )
        );

      const eased =
        p * p;

      frame.style.transform =
        `translate3d(0, ${-110 * eased}%, 0)`;

      frame.style.opacity =
        String(1 - eased);

      setProgress(
        85 + (eased * 15)
      );

      return;
    }
  }


  function startPhase(name) {

    phase =
      name;

    phaseStart =
      performance.now();

    if (name === "enter") {

      frame.style.transition =
        "none";

      frame.style.transform =
        "translate3d(0, 110%, 0)";

      frame.style.opacity =
        "0";
    }

    if (name === "hold") {

      frame.style.transition =
        "none";

      frame.style.transform =
        "translate3d(0, 0, 0)";

      frame.style.opacity =
        "1";
    }

    if (name === "leave") {

      frame.style.transition =
        "none";
    }
  }


  /* =========================================================
     PHOTO FLOW
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

    await showPhoto(
      currentPhoto
    );

    startPhase(
      "enter"
    );

    cancelAnimationFrame(
      animationFrame
    );

    animationFrame =
      requestAnimationFrame(
        tick
      );
  }


  function moveToNextPhoto() {

    currentPhoto++;

    if (
      currentPhoto >
      TOTAL_PHOTOS
    ) {
      currentPhoto = 1;
    }

    showPhoto(
      currentPhoto
    ).then(() => {

      startPhase(
        "enter"
      );

    });
  }


  function tick(now) {

    if (isPaused) {

      animationFrame =
        requestAnimationFrame(
          tick
        );

      return;
    }

    const elapsed =
      now - phaseStart;

    if (phase === "enter") {

      applyPhaseStyles(
        elapsed
      );

      if (
        elapsed >= ENTER_TIME
      ) {

        startPhase(
          "hold"
        );
      }
    }

    else if (phase === "hold") {

      applyPhaseStyles(
        elapsed
      );

      if (
        elapsed >= HOLD_TIME
      ) {

        startPhase(
          "leave"
        );
      }
    }

    else if (phase === "leave") {

      applyPhaseStyles(
        elapsed
      );

      if (
        elapsed >= LEAVE_TIME
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
     PAUSE / RESUME
     ========================================================= */

  function pauseFlow() {

    if (
      !started ||
      isPaused
    ) {
      return;
    }

    isPaused =
      true;

    pauseStarted =
      performance.now();

    pausedAt =
      performance.now();

    stage.classList.add(
      "is-paused"
    );

    if (pauseHint) {

      pauseHint.textContent =
        "Souvenir en pause ♡";

    }
  }


  function resumeFlow() {

    if (
      !started ||
      !isPaused
    ) {
      return;
    }

    const now =
      performance.now();

    const pauseDuration =
      now - pauseStarted;

    phaseStart +=
      pauseDuration;

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
     TOUCH / MOUSE
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

      } catch (_) {
        /* Capture not available */
      }

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

      } catch (_) {
        /* Capture not available */
      }

      resumeFlow();
    }
  );


  stage.addEventListener(
    "pointercancel",
    () => {

      resumeFlow();
    }
  );


  stage.addEventListener(
    "pointerleave",
    (event) => {

      if (
        event.pointerType === "mouse"
      ) {
        resumeFlow();
      }
    }
  );


  /* =========================================================
     VISIBILITY
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

        if (animationFrame) {

          cancelAnimationFrame(
            animationFrame
          );

        }

        started =
          false;

        isPaused =
          false;

        phase =
          "idle";
      }
    );
  }


  /* =========================================================
     START WHEN SOUVENIR SECTION IS REACHED
     ========================================================= */

  const souvenirSection =
    document.getElementById(
      "souvenirs"
    );

  if (!souvenirSection) {
    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.2
            ) {

              startPhotoFlow();

              observer.disconnect();
            }
          }
        );

      },
      {
        threshold: [0.2, 0.35]
      }
    );


  observer.observe(
    souvenirSection
  );


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateCounter();

  frame.style.transform =
    "translate3d(0, 110%, 0)";

  frame.style.opacity =
    "0";

  setProgress(
    0
  );

});