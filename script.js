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

Sa vle di pa gen okenn lòt "bgMusic" ki pral kreye. "souvenirs.js" ap itilize foto yo sèlman. Mizik la ap rete menm mizik ki te kòmanse nan eksperyans/lettre a. Lè souvenir yo ap pase, li pa restart mizik la.

Epi mwen ajoute "play" ak "pause" listeners yo pou bouton mizik la toujou montre bon eta si mizik la chanje pa yon lòt aksyon. Se evènman natif HTMLMediaElement yo pou sa.

Donk pa mete kòd 42 foto yo nan "script.js". Se "souvenirs.js" ki pral vini apre li nan "index.html"

<script src="script.js"></script>
<script src="experience.js"></script>
<script src="souvenirs.js"></script>

Sa se fason mwen ta fè l pou pa gen konfli ant lettre a, particle experience lan, mizik la, ak 42 souvenirs yo.