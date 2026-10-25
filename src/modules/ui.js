// Navigation, scroll reveal and the showreel player.
import { $, $$ } from "./util.js";

export function initNav() {
  const header = $("#site-header");
  const nav = $("#primary-nav");
  const toggle = $("#nav-toggle");
  const links = $$("a[data-section]", nav);

  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); }
  });

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Active-section indicator: the section crossing the upper third of the viewport.
  const sections = links.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);
  // Active = the last section whose top has crossed 35% of the viewport (robust to fast scrolling / jumps).
  let ticking = false;
  const updateActive = () => {
    ticking = false;
    const line = window.innerHeight * 0.35;
    let cur = sections[0];
    sections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= line) cur = sec;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = sections[sections.length - 1];
    links.forEach((a) => {
      const on = a.dataset.section === cur.id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateActive); } }, { passive: true });
  updateActive();

  // Sliding indicator under the active link (desktop only; hidden by CSS on the mobile menu).
  const ind = $(".nav-ind", nav);
  const moveInd = () => {
    const a = links.find((x) => x.classList.contains("active"));
    if (!a || !ind || getComputedStyle(ind).display === "none") return;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
    ind.style.opacity = "1";
  };
  new MutationObserver(moveInd).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", moveInd);
  document.fonts?.ready.then(moveInd);
  moveInd();
}

export function initReveal() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window)) { targets.forEach((t) => t.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  targets.forEach((t) => io.observe(t));
}
