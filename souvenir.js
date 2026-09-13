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

  /*
     IMPORTANT

     Foto yo chita dirèkteman nan assets/

     assets/photo01.jpg
     assets/photo02.jpg
     ...
     assets/photo42.jpg
  */

  const PHOTO_PATH =
    "assets/photo";


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

    progress.style.width =
      `${Math.max(
        0,
        Math.min(
          100,
          value
        )
      )}%`;

  }


  function setLoading(state) {

    if (!loader) {
      return;
    }

    /*
      CSS utilise .is-loading
    */

    loader.classList.toggle(
      "is-loading",
      state
    );

  }


  /* =========================================================
     PRELOAD IMAGE
     ========================================================= */

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

            /*
              L'image est déjà chargée.
              On continue normalement.
            */

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


  /* =========================================================
     PRELOAD NEXT PHOTO
     ========================================================= */

  function preloadNextPhoto() {

    let nextPhoto =
      currentPhoto + 1;


    if (
      nextPhoto >
      TOTAL_PHOTOS
    ) {

      nextPhoto = 1;

    }


    /*
      Prépare silencieusement
      la prochaine image.
    */

    const img =
      new Image();

    img.src =
      photoSrc(nextPhoto);

  }


  /* =========================================================
     SHOW PHOTO
     ========================================================= */

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
     FIND NEXT AVAILABLE PHOTO
     ========================================================= */

  async function findNextAvailablePhoto() {

    for (
      let attempt = 1;
      attempt <= TOTAL_PHOTOS;
      attempt++
    ) {

      let candidate =
        currentPhoto + attempt;


      if (
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


      if (
        loaded
      ) {

        return candidate;

      }

    }


    return null;

  }


  /* =========================================================
     PHASE ANIMATION
     ========================================================= */

  function applyPhaseStyles(progressValue) {

    if (
      phase === "enter"
    ) {

      const p =
        Math.min(
          1,
          Math.max(
            0,
            progressValue /
            ENTER_TIME
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
          0.965 +
          eased * 0.035
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
            progressValue /
            HOLD_TIME
          )
        );


      frame.style.transform =
        `translate3d(0, 0, 0) scale(${
          1 +
          Math.sin(
            p * Math.PI
          ) * 0.006
        })`;


      frame.style.opacity =
        "1";


      setProgress(
        15 +
        (p * 70)
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
            progressValue /
            LEAVE_TIME
          )
        );


      const eased =
        p * p;


      frame.style.transform =
        `translate3d(0, ${
          -110 * eased
        }%, 0) scale(${
          1 -
          eased * 0.035
        })`;


      frame.style.opacity =
        String(
          1 - eased
        );


      setProgress(
        85 +
        (eased * 15)
      );


      return;

    }

  }


  function startPhase(name) {

    phase =
      name;

    phaseStart =
      performance.now();


    if (
      name === "enter"
    ) {

      frame.style.transition =
        "none";

      frame.style.transform =
        "translate3d(0, 110%, 0) scale(.965)";

      frame.style.opacity =
        "0";

    }


    if (
      name === "hold"
    ) {

      frame.style.transition =
        "none";

      frame.style.transform =
        "translate3d(0, 0, 0) scale(1)";

      frame.style.opacity =
        "1";

    }


    if (
      name === "leave"
    ) {

      frame.style.transition =
        "none";

    }

  }


  /* =========================================================
     NEXT PHOTO
     ========================================================= */

  async function moveToNextPhoto() {

    if (
      transitioning
    ) {

      return;

    }


    transitioning =
      true;


    phase =
      "loading";


    let nextPhoto =
      currentPhoto + 1;


    if (
      nextPhoto >
      TOTAL_PHOTOS
    ) {

      nextPhoto =
        1;

    }


    let loaded =
      await showPhoto(
        nextPhoto
      );


    /*
      Si la prochaine photo n'existe pas,
      cherche automatiquement une autre
      photo disponible.
    */

    if (
      !loaded
    ) {

      const fallback =
        await findNextAvailablePhoto();


      if (
        fallback !== null
      ) {

        nextPhoto =
          fallback;

        loaded =
          true;

      }

    }


    if (
      loaded
    ) {

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
     START PHOTO FLOW
     ========================================================= */

  async function startPhotoFlow() {

    if (
      started
    ) {

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


    if (
      !loaded
    ) {

      started =
        false;

      return;

    }


    /*
      Active la galerie dès que la section
      Souvenirs entre réellement dans l'écran.
    */

    stage.classList.add(
      "is-gallery-active"
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


  /* =========================================================
     ANIMATION LOOP
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
      phase === "loading"
    ) {

      animationFrame =
        requestAnimationFrame(
          tick
        );

      return;

    }


    const elapsed =
      now -
      phaseStart;


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

    }


    else if (
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

    }


    else if (
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


    if (
      pauseHint
    ) {

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


    const pauseDuration =
      now -
      pauseStarted;


    phaseStart +=
      pauseDuration;


    isPaused =
      false;


    stage.classList.remove(
      "is-paused"
    );


    if (
      pauseHint
    ) {

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
    () => {

      resumeFlow();

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


  if (
    backToLetter
  ) {

    backToLetter.addEventListener(
      "click",
      () => {

        if (
          animationFrame
        ) {

          cancelAnimationFrame(
            animationFrame
          );

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
          "is-gallery-active"
        );


        setLoading(
          false
        );

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


  if (
    !souvenirSection
  ) {

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
        threshold: [
          0.2,
          0.35
        ]
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
    "translate3d(0, 110%, 0) scale(.965)";


  frame.style.opacity =
    "0";


  setProgress(
    0
  );

});