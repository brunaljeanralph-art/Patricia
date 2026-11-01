(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const opening = document.getElementById("opening");
    const letter = document.getElementById("letter");
    const envelope = document.getElementById("envelope");
    const openButton = document.getElementById("openButton");
    const openCaption = document.getElementById("openCaption");
    const musicButton = document.getElementById("music-btn");
    const musicLabel = document.getElementById("music-label");
    const music = document.getElementById("bgMusic");
    const ding = document.getElementById("dingSound");
    const petalField = document.getElementById("petal-field");

    if (!opening || !letter || !envelope || !openButton || !openCaption) {
      console.error("Les éléments essentiels de l'ouverture de Patricia sont introuvables.");
      return;
    }

    let opened = false;
    let musicPlaying = false;
    let petalTimer = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function playOneShot(audio, volume) {
      if (!audio) return;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = volume;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } catch (_) {
        // Les effets sonores restent facultatifs si le navigateur les bloque.
      }
    }

    function updateMusicButton() {
      if (!musicButton || !musicLabel) return;
      musicLabel.textContent = musicPlaying ? "Mettre la musique en pause" : "Écouter notre ambiance";
      musicButton.setAttribute("aria-pressed", String(musicPlaying));
    }

    async function startMusic() {
      if (!music) return false;
      try {
        music.volume = 0.48;
        await music.play();
        musicPlaying = true;
        updateMusicButton();
        return true;
      } catch (_) {
        musicPlaying = false;
        updateMusicButton();
        return false;
      }
    }

    function stopMusic() {
      if (!music) return;
      music.pause();
      musicPlaying = false;
      updateMusicButton();
    }

    function createPetal() {
      if (!petalField || reducedMotion || !document.body.classList.contains("letter-visible")) return;
      const petal = document.createElement("span");
      const symbols = ["✧", "♡", "❀", "·"];
      petal.className = "drifting-petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${10 + Math.random() * 13}px`;
      petal.style.setProperty("--drift", `${Math.round(Math.random() * 150 - 75)}px`);
      petal.style.setProperty("--turn", `${Math.round(Math.random() * 420 - 210)}deg`);
      petal.style.animationDuration = `${10 + Math.random() * 8}s`;
      petalField.appendChild(petal);
      window.setTimeout(() => petal.remove(), 19000);
    }

    function startPetals() {
      if (reducedMotion || !petalField || petalTimer !== null) return;
      for (let i = 0; i < 8; i += 1) {
        window.setTimeout(createPetal, i * 380);
      }
      petalTimer = window.setInterval(createPetal, 1700);
    }

    function openLetter() {
      if (opened) return;
      opened = true;
      openButton.disabled = true;
      openCaption.disabled = true;
      envelope.classList.add("is-open");
      openButton.setAttribute("aria-label", "L'enveloppe est ouverte");
      playOneShot(ding, 0.42);
      // La musique est lancée après un vrai clic, conformément aux règles des navigateurs.
      startMusic();

      window.setTimeout(() => {
        opening.classList.add("is-leaving");
        window.setTimeout(() => {
          opening.classList.add("hidden");
          opening.setAttribute("aria-hidden", "true");
          letter.classList.remove("hidden");
          letter.setAttribute("aria-hidden", "false");
          musicButton?.classList.remove("hidden");
          document.body.classList.add("letter-visible");
          startPetals();
          window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        }, 700);
      }, 980);
    }

    openButton.addEventListener("click", openLetter);
    openCaption.addEventListener("click", openLetter);

    musicButton?.addEventListener("click", async () => {
      if (musicPlaying) {
        stopMusic();
      } else {
        await startMusic();
      }
    });

    // Si la lecture est interrompue par le navigateur ou le système, le bouton reste cohérent.
    music?.addEventListener("pause", () => {
      if (musicPlaying) {
        musicPlaying = false;
        updateMusicButton();
      }
    });
    music?.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicButton();
    });

    updateMusicButton();
  });
})();
