document.addEventListener("DOMContentLoaded", () => {
  const musicButton =
    document.getElementById("music-btn");

  const music =
    document.getElementById("bgMusic");


  /* =========================================================
     MUSIC
     ========================================================= */

  if (musicButton && music) {
    musicButton.addEventListener(
      "click",
      async () => {
        try {
          if (music.paused) {
            await music.play();

            musicButton.textContent =
              "🔊 Musique activée";
          } else {
            music.pause();

            musicButton.textContent =
              "🔇 Musique en pause";
          }
        } catch (error) {
          musicButton.textContent =
            "🎵 Activer la musique";
        }
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