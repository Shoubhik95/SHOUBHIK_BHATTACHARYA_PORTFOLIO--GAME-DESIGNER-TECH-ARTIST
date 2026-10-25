import { renderSections } from "./modules/sections.js";
import { initProjects } from "./modules/projects.js";
import { initNav, initReveal } from "./modules/ui.js";
import { initPlayer } from "./modules/showreel.js";
import { initContact } from "./modules/contact.js";
import { initLightbox } from "./modules/util.js";

document.documentElement.classList.add("js");

renderSections();
initProjects();
initLightbox();
initNav();
initPlayer();
initContact();
initReveal();

// The 3D hero (Three.js) is loaded after first paint so the page is usable immediately.
const boot3d = () => import("./hero/hero.js")
  .then((m) => m.startHero())
  .catch((err) => {
    console.warn("[hero] 3D scene unavailable, showing fallback.", err);
    document.getElementById("hero-loading")?.classList.add("done");
    document.getElementById("hero-canvas")?.setAttribute("hidden", "");
    document.getElementById("hero-fallback")?.removeAttribute("hidden");
  });
if ("requestIdleCallback" in window) requestIdleCallback(boot3d, { timeout: 1200 });
else setTimeout(boot3d, 200);
