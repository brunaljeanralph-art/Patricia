document.addEventListener("DOMContentLoaded", () => {
  const grid =
    document.getElementById("px-photo-grid");

  if (!grid) return;

  for (let i = 1; i <= 44; i++) {
    const number =
      String(i).padStart(2, "0");

    const tile =
      document.createElement("figure");

    tile.className =
      "px-photo-tile px-photo-missing";

    tile.innerHTML = `
      <img
        src="assets/souvenirs/photo${number}.jpg"
        alt="Souvenir ${i}"
        loading="lazy"
        decoding="async"
      >

      <figcaption class="px-photo-number">
        Souvenir ${i}
      </figcaption>
    `;

    const img =
      tile.querySelector("img");

    img.addEventListener(
      "load",
      () => {
        tile.classList.remove(
          "px-photo-missing"
        );
      },
      { once: true }
    );

    img.addEventListener(
      "error",
      () => {
        tile.remove();
      },
      { once: true }
    );

    grid.appendChild(tile);
  }
});