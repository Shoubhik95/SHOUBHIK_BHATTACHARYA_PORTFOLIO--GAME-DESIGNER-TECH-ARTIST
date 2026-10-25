// Showreel cards (rendered into the Projects grid by projects.js when the SHOWREEL filter is active)
// and the modal video player. Clips come from src/data/showreel.js.
import { showreel } from "../data/showreel.js";
import { $, esc, asset } from "./util.js";

export { showreel };

const exists = new Map(); // url -> Promise<boolean>

// A file "exists" if it answers 2xx with the expected media type (a static host may fall back to index.html for missing files).
function fileExists(src, kind) {
  if (!src) return Promise.resolve(false);
  if (!exists.has(src)) {
    exists.set(src, fetch(asset(src), { method: "HEAD" })
      .then((r) => r.ok && (r.headers.get("content-type") || "").startsWith(kind))
      .catch(() => false));
  }
  return exists.get(src);
}

// Same markup/classes as the project cards, so the existing card CSS applies.
export const shotCard = (s, i) => `
  <button type="button" class="card shot-card reveal" data-shot="${i}" style="--d:${(i % 3) * 0.08}s" aria-label="Play: ${esc(s.title)}">
    <span class="card-media">
      <span class="shot-ph"><b>Add thumbnail</b><small>${esc(s.thumbnail || "public/showreel/…")}</small></span>
      <span class="shot-play" aria-hidden="true"></span>
    </span>
    <span class="card-plate">
      <small>Showreel</small>
      <b>${esc(s.title)}</b>
      ${s.description ? `<span class="card-desc">${esc(s.description)}</span>` : ""}
      <span class="card-cta">Watch →</span>
    </span>
  </button>`;

// Swap in real thumbnails; mark cards whose video file is missing as non-playable placeholders.
export function hydrateShots(root) {
  root.querySelectorAll(".shot-card").forEach((card) => {
    const s = showreel[+card.dataset.shot];
    fileExists(s.thumbnail, "image").then((ok) => {
      if (!ok) return;
      const img = new Image();
      img.alt = `${s.title} — thumbnail`; img.loading = "lazy"; img.src = asset(s.thumbnail);
      if (s.thumbPosition) img.style.objectPosition = s.thumbPosition;
      $(".shot-ph", card)?.replaceWith(img);
    });
    fileExists(s.videoSrc, "video").then((ok) => {
      if (ok) return;
      card.dataset.missing = "";
      card.setAttribute("aria-label", `${s.title} — video not added yet`);
      $(".shot-play", card).insertAdjacentHTML("afterend", `<span class="shot-tag">Add video file</span>`);
      $(".card-cta", card).textContent = "Video coming soon";
    });
  });
}

export function initPlayer() {
  const dlg = $("#reel-dialog"), video = $("#reel-video");
  $("#reel-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => {
    video.pause(); video.removeAttribute("src"); video.load();
    document.documentElement.style.overflow = "";
  });
}

export function openPlayer(i) {
  const s = showreel[i];
  if (!s) return;
  const dlg = $("#reel-dialog"), video = $("#reel-video");
  $("#reel-title").textContent = s.title;
  $("#reel-desc").textContent = s.description || "";
  video.src = asset(s.videoSrc);
  video.muted = true; // never autoplay with sound; unmute from the controls
  dlg.showModal();
  document.documentElement.style.overflow = "hidden";
  video.play().catch(() => {});
}
