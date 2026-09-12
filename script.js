document.addEventListener("DOMContentLoaded", () => {
  const musicButton =
    document.getElementById("music-btn");

  const music =
    document.getElementById("bgMusic");

  const ding =
    document.getElementById("dingSound");

  const popup =
    document.getElementById("welcome-popup");

  const continueBtn =
    document.getElementById("continueBtn");


  /* =========================================================
     WELCOME POPUP
     Wait until experience.js removes #px-experience
     ========================================================= */

  let popupShown = false;

  function showWelcomePopup() {
    if (!popup || popupShown) return;

    popupShown = true;

    popup.classList.remove("hidden");
    popup.setAttribute("aria-hidden", "false");
  }


  const experienceObserver =
    new MutationObserver((mutations, observer) => {

      for (const mutation of mutations) {

        if (mutation.type !== "childList") {
          continue;
        }

        for (const removedNode of mutation.removedNodes) {

          if (
            removedNode.nodeType === 1 &&
            removedNode.id === "px-experience"
          ) {
            observer.disconnect();

            setTimeout(() => {
              showWelcomePopup();
            }, 250);

            return;
          }
        }
      }
    });


  experienceObserver.observe(document.body, {
    childList: true,
    subtree: true
  });


  /* =========================================================
     CONTINUE BUTTON
     ========================================================= */

  if (continueBtn) {

    continueBtn.addEventListener(
      "click",
      async () => {

        if (ding) {
          try {
            ding.currentTime = 0;
            await ding.play();
          } catch (error) {}
        }


        if (popup) {
          popup.classList.add("hidden");
          popup.setAttribute(
            "aria-hidden",
            "true"
          );
        }


        if (music) {
          try {
            await music.play();
          } catch (error) {
            if (musicButton) {
              musicButton.textContent =
                "🎵 Activer la musique";
            }
          }
        }

      }
    );
  }


  /* =========================================================
     MUSIC BUTTON
     ========================================================= */

  if (musicButton && music) {

    musicButton.addEventListener(
      "click",
      async () => {

        try {

          if (music.paused) {

            await music.play();

          } else {

            music.pause();

          }

        } catch (error) {

          musicButton.textContent =
            "🎵 Activer la musique";

        }

      }
    );


    music.addEventListener(
      "play",
      () => {

        musicButton.textContent =
          "🔊 Musique activée";

      }
    );


    music.addEventListener(
      "pause",
      () => {

        musicButton.textContent =
          "🔇 Musique en pause";

      }
    );

  }


  /* =========================================================
     IMAGE FALLBACK
     ========================================================= */

  document
    .querySelectorAll("img")
    .forEach((img) => {

      img.addEventListener(
        "error",
        () => {

          img.style.visibility =
            "hidden";

        },
        { once: true }
      );

    });

});