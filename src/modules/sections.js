// Renders the content sections from src/data/profile.js and src/data/projects.js.
import { profile, about, software, skillGroups, experience, education, certificates } from "../data/profile.js";
import { $, esc, asset, openLightbox } from "./util.js";

export function renderSections() {
  renderAbout();
  renderSkills();
  renderExperience();
  renderEducation();
  renderContact();
}

function renderAbout() {
  $("#about-text").innerHTML = about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#about-tiles").innerHTML = about.tiles.map((t) => `<li>${esc(t)}</li>`).join("");
  $("#soft-grid").innerHTML = software
    .map(([abbr, name]) => `<li><i aria-hidden="true">${esc(abbr)}</i><span>${esc(name)}</span></li>`).join("");
  $("#about-links").innerHTML = profile.links.map((l) => `<li><a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a></li>`).join("");
  $("#about-contact").textContent = about.location; // location only; the email lives in the Contact section
}

// Monochrome 24px line icons (stroke follows currentColor) for the skill cards.
const ICONS = {
  gamepad: '<path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/><path d="M7 7h10a4 4 0 014 4v3a3 3 0 01-5.2 2L14 14h-4l-1.8 2A3 3 0 013 14v-3a4 4 0 014-4z"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  blocks: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M17 13v8M13 17h8"/>',
  cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12v10M12 12L3 7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
};
const icon = (k) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ""}</svg>`;

function renderSkills() {
  $("#skills-grid").innerHTML = skillGroups.map((g, i) => `
    <article class="skill-card reveal" style="--d:${(i % 3) * 0.08}s">
      <header><span class="skill-icon" aria-hidden="true">${icon(g.icon)}</span><h3>${esc(g.group)}</h3></header>
      <ul>${g.items.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
    </article>`).join("");
}

// Experience: a timeline row per entry — dates on the left, a node on the rail, the role card on the right.
function renderExperience() {
  $("#timeline").innerHTML = experience.map((x, i) => `
    <article class="xp reveal" style="--d:${i * 0.08}s">
      <div class="xp-when"><b>${esc(x.period)}</b><span>${esc(x.kind)}</span></div>
      <div class="xp-rail" aria-hidden="true"><i></i></div>
      <div class="xp-card">
        <p class="xp-role">${esc(x.title)}</p>
        <h3 class="xp-org">${esc(x.org)}</h3>
        <p class="xp-text">${esc(x.text)}</p>
        ${x.focus?.length ? `<ul class="xp-focus">${x.focus.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        ${x.link ? `<a class="inline" href="${esc(x.link.href)}" target="_blank" rel="noopener noreferrer">${esc(x.link.label)} ↗</a>` : ""}
      </div>
    </article>`).join("");
}

function renderEducation() {
  const u = education.university;
  $("#edu-grid").innerHTML = `
    <article class="edu-main panel reveal">
      <p class="eyebrow">${esc(u.years)}</p>
      <h3>${esc(u.name)}</h3>
      <p class="edu-meta">${esc(u.place)}</p>
      <p class="edu-degree">${esc(u.degree)}<span>${esc(u.specialisation)}</span></p>
      <div class="edu-score"><b>${esc(u.score[0])}</b><span>${esc(u.score[1])}</span></div>
      <ul class="tag-row">${u.courses.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </article>
    <div class="edu-school panel reveal" style="--d:.1s">
      ${education.school.map((s) => `
        <div><h4>${esc(s.level)}</h4><p>${esc(s.name)}</p><p class="res">${esc(s.result)}</p></div>`).join("")}
    </div>`;

  $("#cert-row").innerHTML = certificates.map((c, i) => `
    <li class="reveal" style="--d:${(i % 4) * 0.07}s"><button type="button" data-i="${i}" aria-label="View certificate: ${esc(c.title)}">
      <span class="cert-img"><img src="${asset(c.src)}" alt="${esc(c.alt)}" loading="lazy"></span>
      <span class="cert-cap"><b>${esc(c.title)}</b><i aria-hidden="true">View ↗</i></span>
    </button></li>`).join("");
  $("#cert-row").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) { const c = certificates[+b.dataset.i]; openLightbox(c.src, c.alt); }
  });
}

function renderContact() {
  // Hero RESUME button: the single place the resume URL is configured is profile.resume in src/data/profile.js.
  $("#resume-btn").href = asset(profile.resume);
  $("#cf-resume").href = asset(profile.resume); // same file as the hero RESUME button
  $("#link-list").innerHTML = profile.links.map((l) => `
    <li><a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(l.label)}, ${esc(l.handle)}">${esc(l.label)} ↗</a></li>`).join("");
}
