/* =========================================================
   PATRICIA — BASE SCRIPT
   The letter content is never modified here.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-screen");
  const popup = document.getElementById("welcome-popup");
  const continueBtn = document.getElementById("continueBtn");
  const musicBtn = document.getElementById("music-btn");
  const bgMusic = document.getElementById("bgMusic");
  const ding = document.getElementById("dingSound");
  const petals = document.getElementById("petals-container");
  const hearts = document.getElementById("hearts-container");
  const confetti = document.getElementById("confetti-container");

  const safePlay = async (audio) => {
    if (!audio) return false;

    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  if (intro && !window.PatriciaExperienceActive) {
    window.setTimeout(() => {
      intro.classList.add("hidden");

      if (popup) {
        popup.classList.remove("hidden");
      }
    }, 900);
  }

  continueBtn?.addEventListener(
    "click",
    async () => {
      popup?.classList.add("hidden");

      await safePlay(ding);
      await safePlay(bgMusic);
    }
  );

  musicBtn?.addEventListener(
    "click",
    async () => {
      if (!bgMusic) return;

      if (bgMusic.paused) {
        const ok = await safePlay(bgMusic);

        musicBtn.textContent = ok
          ? "🔊 Musique activée"
          : "🎵 Activer la musique";
      } else {
        bgMusic.pause();

        musicBtn.textContent =
          "🎵 Activer la musique";
      }
    }
  );

  const spawn = (
    container,
    char,
    className,
    ttl = 5200
  ) => {
    if (!container) return;

    const el =
      document.createElement("span");

    el.className = className;
    el.textContent = char;

    el.style.left =
      `${8 + Math.random() * 84}%`;

    el.style.animationDuration =
      `${4200 + Math.random() * 2200}ms`;

    container.appendChild(el);

    window.setTimeout(
      () => el.remove(),
      ttl
    );
  };

  if (hearts) {
    window.setInterval(
      () =>
        spawn(
          hearts,
          "❤️",
          "px-float-heart"
        ),
      1050
    );
  }

  if (petals) {
    window.setInterval(
      () =>
        spawn(
          petals,
          "✿",
          "px-float-petal"
        ),
      900
    );
  }

  if (confetti) {
    window.setInterval(
      () =>
        spawn(
          confetti,
          "•",
          "px-confetti",
          3600
        ),
      780
    );
  }

  const decor =
    document.createElement("style");

  decor.textContent = `
    .px-float-heart,
    .px-float-petal,
    .px-confetti {
      position: absolute;
      bottom: -30px;
      pointer-events: none;
      z-index: 2;
      animation-name: pxFloat;
      animation-timing-function: ease-out;
      animation-fill-mode: both;
    }

    .px-float-heart {
      font-size: 18px;
      opacity: .28;
    }

    .px-float-petal {
      font-size: 18px;
      opacity: .18;
    }

    .px-confetti {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(122,63,163,.25);
    }

    @keyframes pxFloat {
      0% {
        transform:
          translateY(0)
          scale(.7)
          rotate(0deg);
        opacity: 0;
      }

      15% {
        opacity: 1;
      }

      100% {
        transform:
          translateY(-105vh)
          translateX(${Math.random() * 80 - 40}px)
          scale(1.1)
          rotate(240deg);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(decor);

  document
    .querySelectorAll("img")
    .forEach((img) => {
      img.addEventListener(
        "error",
        () => {
          img.style.opacity = "0.35";
        },
        { once: true }
      );
    });

  window.PatriciaBaseReady = true;
});