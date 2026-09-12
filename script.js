/* =========================================================
   PATRICIA â€” BASE INTERACTIONS
   This file does not control the opening experience flow.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const musicBtn = document.getElementById("music-btn");
  const bgMusic = document.getElementById("bgMusic");
  const images = document.querySelectorAll("img");

  async function safePlay(audio) {
    if (!audio) return false;
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }

  musicBtn?.addEventListener("click", async () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      const ok = await safePlay(bgMusic);
      musicBtn.textContent = ok ? "ðŸ”Š Musique activÃ©e" : "ðŸŽµ Activer la musique";
      musicBtn.setAttribute("aria-label", musicBtn.textContent);
    } else {
      bgMusic.pause();
      musicBtn.textContent = "ðŸŽµ Activer la musique";
      musicBtn.setAttribute("aria-label", musicBtn.textContent);
    }
  });

  images.forEach(img => {
    img.addEventListener("error", () => img.classList.add("px-asset-missing"), { once: true });
  });

  window.PatriciaBaseReady = true;
});