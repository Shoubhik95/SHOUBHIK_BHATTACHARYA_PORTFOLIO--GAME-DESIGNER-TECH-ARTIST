// Project gallery (filters + cards), the project detail popup, and the per-project
// system-architecture viewer. Each project has its own route: #project=<id>.
import { projects, categories } from "../data/projects.js";
import { $, $$, esc, asset, openLightbox } from "./util.js";
import { showreel, shotCard, hydrateShots, openPlayer } from "./showreel.js";

const grid = () => $("#project-grid");
const popup = () => $("#project-dialog");
const DEFAULT_CATEGORY = "game";
let active = DEFAULT_CATEGORY;
let lastFocus = null;

let shotsChecked = false;
const SHOWREEL = "showreel"; // fifth filter: swaps the project cards for video cards in the same grid
const inCategory = (p, key) => p.category === key;

export function initProjects() {
  renderFilters();
  renderGrid();
  setFilter(DEFAULT_CATEGORY);
  // Leaving the Projects section resets the filter, so returning always starts on Game Development.
  let wasVisible = false; // only reset after the section has really been on screen (not at initial load)
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) wasVisible = true;
    else if (wasVisible) { wasVisible = false; if (active !== DEFAULT_CATEGORY) setFilter(DEFAULT_CATEGORY); }
  }).observe($("#projects"));
  initArchitectureViewer();

  grid().addEventListener("click", (e) => {
    const shot = e.target.closest("[data-shot]");
    if (shot) { if (shot.dataset.missing === undefined) openPlayer(+shot.dataset.shot); return; }
    const card = e.target.closest("[data-project]");
    if (card) openProject(card.dataset.project, true);
  });

  const dlg = popup();
  dlg.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
    if (location.hash.startsWith("#project=")) history.replaceState(null, "", location.pathname + location.search + "#projects");
    lastFocus?.focus?.({ preventScroll: true });
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); // backdrop or X
    const ex = e.target.closest("[data-explore]");
    if (ex) { // category transition: show that category's grid, never open a project directly
      e.preventDefault();
      dlg.close();
      setFilter(ex.dataset.explore);
      $("#projects").scrollIntoView({ behavior: "smooth" });
      $(`#filter-bar button[data-filter="${ex.dataset.explore}"]`)?.focus({ preventScroll: true });
      return;
    }
    const nav = e.target.closest("[data-goto]");
    if (nav) { e.preventDefault(); openProject(nav.dataset.goto, true); }
  });

  // The navbar's SHOWREEL link opens Projects with the SHOWREEL filter selected.
  const openShowreel = () => { setFilter(SHOWREEL); $("#projects").scrollIntoView({ behavior: "smooth" }); };
  document.querySelector('a[data-section="showreel"]')?.addEventListener("click", (e) => { e.preventDefault(); openShowreel(); });
  if (location.hash === "#showreel") setTimeout(openShowreel, 0);

  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();
}

function renderFilters() {
  // Only categories that actually contain projects are offered.
  const items = Object.entries(categories)
    .map(([k, label]) => [k, label, projects.filter((p) => inCategory(p, k)).length])
    .filter(([, , n]) => n > 0);
  items.push([SHOWREEL, "Showreel", showreel.length]);
  const bar = $("#filter-bar");
  bar.innerHTML = items.map(([k, label, n]) =>
    `<button type="button" data-filter="${k}" aria-pressed="${k === active}">${esc(label)}<sup>${n}</sup></button>`).join("");
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-filter]");
    if (!b) return;
    setFilter(b.dataset.filter);
  });
}

function setFilter(key) {
  const bar = $("#filter-bar");
  active = key;
  if (key === SHOWREEL && !shotsChecked) { shotsChecked = true; hydrateShots(grid()); } // probe files only when the tab is first opened
  $$("button", bar).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.filter === active)));
  let shown = 0;
  $$(".card", grid()).forEach((c) => {
    const show = c.dataset.shot !== undefined
      ? active === SHOWREEL
      : inCategory(projects.find((x) => x.id === c.dataset.project), active);
    c.classList.toggle("hidden", !show);
    c.classList.add("in");
    if (show) shown++;
  });
  $("#filter-status").textContent = `${shown} ${active === SHOWREEL ? "video" : "project"}${shown === 1 ? "" : "s"} shown`;
}

function renderGrid() {
  grid().innerHTML = projects.map((p, i) => `
    <button type="button" class="card reveal" data-project="${esc(p.id)}" style="--d:${(i % 3) * 0.08}s" aria-label="${esc(p.title)} — explore the full project">
      <span class="card-media"><img src="${asset(p.thumb)}" alt="${esc(p.title)} — project image" loading="lazy" decoding="async"></span>
      <span class="card-plate">
        <small>${esc(categories[p.category])} · ${p.year}</small>
        <b>${esc(p.title)}</b>
        <span class="card-desc">${esc(p.summary)}</span>
        <span class="card-tools">${(p.tools || []).slice(0, 4).map((t) => `<i>${esc(t)}</i>`).join("")}</span>
        <span class="card-cta">Explore project →</span>
      </span>
    </button>`).join("") + showreel.map(shotCard).join("");
}

function syncFromHash() {
  const m = location.hash.match(/^#project=(.+)$/);
  if (m) openProject(decodeURIComponent(m[1]), false);
  else if (popup().open) popup().close();
}

const list = (arr) => `<ul class="pd-list">${arr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
const block = (title, body, cls = "") => (body ? `<section class="pd-block ${cls}"><h3>${esc(title)}</h3>${body}</section>` : "");

function openProject(id, pushHash) {
  const idx = projects.findIndex((x) => x.id === id);
  if (idx < 0) return;
  const p = projects[idx];
  // Next within the same category; at the end of a category, offer the next non-empty category instead.
  const inCat = projects.filter((x) => x.category === p.category);
  const pos = inCat.indexOf(p);
  const nextInCat = inCat[pos + 1];
  const catKeys = Object.keys(categories);
  let nextCat = null;
  if (!nextInCat) {
    for (let step = 1; step <= catKeys.length; step++) {
      const k = catKeys[(catKeys.indexOf(p.category) + step) % catKeys.length];
      if (projects.some((x) => x.category === k)) { nextCat = k; break; }
    }
  }
  const dlg = popup();
  if (!dlg.open) lastFocus = document.activeElement;
  const gallery = p.gallery?.length ? p.gallery : [p.thumb];
  const cats = [p.category].map((k) => categories[k]);

  const cell = (k, v) => (v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : "");
  const roleBody = (p.role ? `<p>${esc(p.role)}.</p>` : "") + (p.team?.length
    ? `<ul class="pd-team">${p.team.map((m) => `<li><b>${esc(m.name)}</b><span>${esc(m.role)}</span></li>`).join("")}</ul>` : "");
  const [first, ...rest] = p.links || [];
  const linkBtn = (l, primary) => `<a class="pbtn${primary ? " pbtn-primary" : ""}" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`;
  // The architecture button only exists when this project has its own diagram.
  const archBtn = p.diagram ? `<button class="pbtn pbtn-arch" type="button" id="pd-arch" aria-haspopup="dialog">System architecture</button>` : "";
  const actions = [first && linkBtn(first, true), archBtn, ...rest.map((l) => linkBtn(l, false))].filter(Boolean).join("");

  $("#pd-inner").innerHTML = `
    <header class="pd-head">
      <div>
        <p class="pd-tags">${cats.map((c) => `<span>${esc(c)}</span>`).join("")}<span>${p.year}</span></p>
        <h2 id="pd-title">${esc(p.title)}</h2>
      </div>
      <button class="pd-x" type="button" data-close aria-label="Close project">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </header>
    <dl class="pd-meta">
      ${cell("Engine & platform", esc(p.engine))}
      ${cell("Production stage", esc(p.stage))}
      ${cell("Tools & tech", p.tools?.length ? `<span class="pd-chips">${p.tools.map((t) => `<i>${esc(t)}</i>`).join("")}</span>` : "")}
    </dl>
    <div class="pd-grid">
      <div class="pd-left">
        <div class="pd-viewer">
          <img class="pd-cover" id="pd-main" src="${asset(gallery[0])}" alt="${esc(p.title)} — image 1 of ${gallery.length}">
          ${gallery.length > 1 ? `<div class="pd-thumbs" role="group" aria-label="Project images">${gallery.map((g, i) =>
            `<button type="button" data-i="${i}" aria-label="Show image ${i + 1}" aria-current="${i === 0}"><img src="${asset(g)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        ${p.video ? `<video class="pd-video" controls playsinline preload="none" ${p.video.poster ? `poster="${asset(p.video.poster)}"` : ""} src="${asset(p.video.src)}" aria-label="${esc(p.title)} video"></video>` : ""}
        ${block("Overview", (p.concept || [p.summary]).map((t) => `<p>${esc(t)}</p>`).join(""))}
        ${block(p.featuresTitle || "Core features", p.features?.length ? list(p.features) : "")}
        ${block("Technical implementation", p.implementation?.length
          ? `<div class="pd-impl">${p.implementation.map((x) => `<div><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></div>`).join("")}</div>` : "")}
        ${block("Challenges & solutions", p.challenges?.length
          ? p.challenges.map((c) => `<div class="pd-chal"><h4>${esc(c.challenge)}</h4><p>${esc(c.solution)}</p></div>`).join("") : "")}
        ${block("Results", p.results?.length ? list(p.results) : "")}
        ${block("Future improvements", p.future?.length ? list(p.future) : "")}
      </div>
      <aside class="pd-right">
        ${actions ? `<div class="pd-actions">${actions}</div>` : ""}
        ${block("My role", roleBody, "pd-role")}
        ${block("Development workflow", p.workflow?.length ? `<ol class="pd-process">${p.workflow.map((st) => {
          const i = st.indexOf(":");
          return i > 0 ? `<li><b>${esc(st.slice(0, i))}</b><span>${esc(st.slice(i + 1).trim())}</span></li>` : `<li><span>${esc(st)}</span></li>`;
        }).join("")}</ol>` : "")}
      </aside>
    </div>
    <nav class="pd-next" aria-label="More projects">
      ${nextInCat
        ? `<a href="#project=${encodeURIComponent(nextInCat.id)}" data-goto="${esc(nextInCat.id)}">${esc(nextInCat.title)} →</a>`
        : `<a href="#projects" data-explore="${esc(nextCat)}">Explore ${esc(categories[nextCat])} →</a>`}
    </nav>`;

  const main = $("#pd-main");
  let current = gallery[0];
  main.addEventListener("click", () => openLightbox(current, main.alt));
  $$(".pd-thumbs button", dlg).forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.i;
    current = gallery[i];
    main.src = asset(current);
    main.alt = `${p.title} — image ${i + 1} of ${gallery.length}`;
    $$(".pd-thumbs button", dlg).forEach((x) => x.setAttribute("aria-current", String(x === b)));
  }));
  $("#pd-arch")?.addEventListener("click", () => openArchitecture(p));

  if (!dlg.open) { dlg.showModal(); document.documentElement.style.overflow = "hidden"; }
  dlg.scrollTop = 0;
  if (pushHash) history.pushState(null, "", `#project=${encodeURIComponent(id)}`);
}

// ── System architecture viewer: opened from a project popup, shows that project's own diagram ──
let zoom = 1;

function openArchitecture(p) {
  const dlg = $("#arch-dialog");
  $("#arch-title").textContent = `${p.title} — system architecture`;
  const img = $("#arch-img");
  img.src = asset(p.diagram.src);
  img.alt = `System architecture diagram for ${p.title}`;
  $("#arch-caption").textContent = p.diagram.caption || "";
  $("#arch-breakdown").innerHTML = (p.implementation || []).map((x) => `<li><b>${esc(x.title)}.</b> ${esc(x.text)}</li>`).join("");
  $("#arch-breakdown-wrap").hidden = !p.implementation?.length;
  fitW = 0;
  dlg.showModal();
  const fit = () => { measureFit(); setZoom(1); $("#arch-scroll").scrollTo(0, 0); };
  if (img.complete && img.naturalWidth) fit(); else img.onload = fit;
  $("#arch-back").focus();
}

// Zoom 1 = "fit": the whole diagram is visible inside the viewer. Higher zoom scales from that fitted size.
let fitW = 0;
function measureFit() {
  const box = $("#arch-scroll"), img = $("#arch-img");
  if (!img.naturalWidth) return;
  const maxW = box.clientWidth - 32, maxH = box.clientHeight - 32;
  fitW = Math.min(maxW, maxH * (img.naturalWidth / img.naturalHeight), img.naturalWidth * 2);
}
function setZoom(z) {
  zoom = Math.min(4, Math.max(1, z));
  if (!fitW) measureFit();
  $("#arch-img").style.width = `${Math.round(fitW * zoom)}px`;
  $("#arch-zoom-val").textContent = `${Math.round(zoom * 100)}%`;
  $("#arch-scroll").classList.toggle("zoomed", zoom > 1);
}

function initArchitectureViewer() {
  const dlg = $("#arch-dialog");
  $("#arch-back").addEventListener("click", () => dlg.close());
  $("#arch-in").addEventListener("click", () => setZoom(zoom + 0.5));
  $("#arch-out").addEventListener("click", () => setZoom(zoom - 0.5));
  $("#arch-fit").addEventListener("click", () => { setZoom(1); $("#arch-scroll").scrollTo(0, 0); });
  window.addEventListener("resize", () => { if (dlg.open) { measureFit(); setZoom(zoom); } });
  document.addEventListener("fullscreenchange", () => { if (dlg.open) setTimeout(() => { measureFit(); setZoom(zoom); }, 60); });
  $("#arch-full").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else $("#arch-scroll").requestFullscreen?.().catch(() => {});
  });
  $("#arch-img").addEventListener("dblclick", () => setZoom(zoom > 1 ? 1 : 2));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}
