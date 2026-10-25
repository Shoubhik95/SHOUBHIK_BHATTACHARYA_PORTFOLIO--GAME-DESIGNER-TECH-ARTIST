// Small shared helpers: escaping, URL-safe asset paths, and the image lightbox.

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

// Asset paths contain spaces (e.g. "game dev and design"), so encode them.
export const asset = (p) => encodeURI(p);

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lightbox = () => document.getElementById("lightbox");

export function openLightbox(src, alt = "") {
  const dlg = lightbox();
  const img = document.getElementById("lb-img");
  img.src = asset(src);
  img.alt = alt;
  if (!dlg.open) dlg.showModal();
}

export function initLightbox() {
  const dlg = lightbox();
  document.getElementById("lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.id === "lb-img") dlg.close(); });
  dlg.addEventListener("close", () => { document.getElementById("lb-img").removeAttribute("src"); });
}
