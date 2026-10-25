// Cinematic hero scene: character on a circular display platform, teal rim lighting,
// cursor-driven gaze, drag-to-rotate, slow showcase sway. Rendering pauses off-screen.
import * as THREE from "three";
import { characterConfig } from "./character.config.js";
import { createProceduralCharacter } from "./character-procedural.js";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TEAL = 0x71c7c0;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
}

function radialTexture(inner, outer = "rgba(0,0,0,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner); grad.addColorStop(1, outer);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Thin ring with technical tick marks, drawn once to a texture.
function tickRingTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  g.translate(512, 512);
  g.strokeStyle = "rgba(113,199,192,0.9)";
  for (let i = 0; i < 120; i++) {
    const major = i % 10 === 0;
    g.lineWidth = major ? 5 : 2.5;
    g.beginPath();
    g.moveTo(0, -(major ? 440 : 466));
    g.lineTo(0, -500);
    g.stroke();
    g.rotate((Math.PI * 2) / 120);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export async function startHero() {
  const canvas = document.getElementById("hero-canvas");
  const stage = document.getElementById("hero-stage");
  const hero = document.getElementById("home");
  const loading = document.getElementById("hero-loading");
  const hint = document.getElementById("hero-hint");
  if (!hasWebGL()) throw new Error("WebGL not available");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);
  let maxPixelRatio = coarse ? 1.5 : 2;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

  // ── Lighting: bright cyan studio — soft key, cyan bounce from the platform, white rims ──
  scene.add(new THREE.HemisphereLight(0xeaf6f8, 0x0d6f8f, 0.85));
  const key = new THREE.DirectionalLight(0xfff6ee, 1.95); key.position.set(2.4, 3.6, 4.8); scene.add(key);
  const rimL = new THREE.DirectionalLight(0x8fe9ee, 1.0); rimL.position.set(-3.4, 2.4, -2.8); scene.add(rimL);
  const rimR = new THREE.DirectionalLight(0xdff8fa, 0.6); rimR.position.set(3.6, 1.8, -2.4); scene.add(rimR);
  const bounce = new THREE.PointLight(0x4df0f4, 0.45, 3, 1.6); bounce.position.set(0, 0.25, 0.4); scene.add(bounce);
  const pointerLight = new THREE.PointLight(0xffffff, 0.9, 6, 1.6); pointerLight.position.set(0, 1.4, 2.4); scene.add(pointerLight);

  // ── Platform: glowing cyan disc with white rims and a light cone above it ──
  const platform = new THREE.Group();
  scene.add(platform);
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.46, 0.28, 80), new THREE.MeshStandardMaterial({ color: 0x06284d, roughness: 0.5, metalness: 0.3 }));
  base.position.y = -0.2;
  const rimLow = new THREE.Mesh(new THREE.TorusGeometry(1.43, 0.018, 8, 120), white); rimLow.rotation.x = Math.PI / 2; rimLow.position.y = -0.1;
  const rimLow2 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.012, 8, 120), new THREE.MeshBasicMaterial({ color: 0x9ff6f6 })); rimLow2.rotation.x = Math.PI / 2; rimLow2.position.y = -0.2;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.38, 80), new THREE.MeshBasicMaterial({ map: radialTexture("rgba(140,226,232,1)", "rgba(24,168,184,1)") }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = -0.058;
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.015, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -0.05;
  const glowDisk = new THREE.Mesh(new THREE.CircleGeometry(3.4, 64), new THREE.MeshBasicMaterial({ map: radialTexture("rgba(50,200,215,0.32)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glowDisk.rotation.x = -Math.PI / 2; glowDisk.position.y = -0.34;
  // Light cone: open cylinder, brightest at the platform, fading upward.
  const coneTex = (() => {
    const c = document.createElement("canvas"); c.width = 4; c.height = 256;
    const g = c.getContext("2d"); const gr = g.createLinearGradient(0, 256, 0, 0);
    gr.addColorStop(0, "rgba(110,225,235,0.22)"); gr.addColorStop(1, "rgba(120,250,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
    return new THREE.CanvasTexture(c);
  })();
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.05, 2.7, 64, 1, true), new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
  cone.position.y = 1.3;
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), new THREE.MeshBasicMaterial({ map: radialTexture("rgba(5,60,90,0.55)"), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.045;
  platform.add(base, rimLow, rimLow2, disc, ring, glowDisk, shadow);
  platform.scale.setScalar(0.72);
  cone.scale.setScalar(0.8); cone.position.y = 1.1; scene.add(cone);

  // ── Character (custom model if configured, otherwise stand-in) ─────────────
  let character;
  if (characterConfig.model) {
    try {
      const { loadCustomCharacter } = await import("./character-custom.js");
      character = await loadCustomCharacter(characterConfig);
    } catch (err) {
      console.warn("[hero] custom character failed, using stand-in:", err);
    }
  }
  character ||= createProceduralCharacter();
  scene.add(character.root);

  const clock = new THREE.Clock();
  let visible = true, running = false, raf = 0;

  // ── Input ──────────────────────────────────────────────────────────────────
  const input = { lookX: 0, lookY: 0, bodyYaw: 0, motion: reduced.matches ? 0 : 1 };
  const target = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let lastMove = -10, dragging = false, dragYaw = 0, dragVel = 0, lastDragEnd = 0, lastX = 0, activeUntil = 0;
  const wake = (ms = 1500) => { activeUntil = performance.now() + ms; if (!running && visible) start(); };

  function setTargetFromPoint(cx, cy) {
    const r = hero.getBoundingClientRect();
    target.x = clamp((cx - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
    target.y = clamp((cy - (r.top + r.height * 0.36)) / (r.height * 0.5), -1, 1);
    lastMove = performance.now() / 1000;
    pointerLight.position.x = target.x * 2.2;
    pointerLight.position.y = 1.4 - target.y * 0.8;
    wake();
  }
  const onPointerMove = (e) => setTargetFromPoint(e.clientX, e.clientY);
  const onLeave = () => { target.x = 0; target.y = 0; };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  const onDown = (e) => {
    dragging = true; lastX = e.clientX; dragVel = 0;
    canvas.classList.add("dragging");
    canvas.setPointerCapture?.(e.pointerId);
    hint?.classList.add("hide");
    wake(3000);
  };
  const onDrag = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    dragYaw += dx * 0.009; dragVel = dx;
    wake(3000);
  };
  const onUp = () => { if (!dragging) return; dragging = false; lastDragEnd = performance.now() / 1000; canvas.classList.remove("dragging"); wake(4000); };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onDrag);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("lostpointercapture", onUp);

  // ── Sizing / framing ───────────────────────────────────────────────────────
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Fit the character vertically and the platform horizontally; whichever needs more distance wins.
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const portrait = camera.aspect < 0.9;
    // Desktop: figure + platform sit in the upper ~70% so the name band below stays clear.
    // Portrait: the canvas is its own block above the copy, so centre the figure.
    const needH = portrait ? 2.9 : 2.85;   // visible world height wanted
    const needW = portrait ? 2.6 : 3.2;    // visible world width wanted
    const anchor = portrait ? 0.5 : 0.44; // where world y = 0.8 lands, as a fraction from the top
    const dist = Math.max(needH / (2 * tan), needW / (2 * tan * camera.aspect));
    const visibleH = 2 * dist * tan;
    camera.userData.dist = dist;
    camera.userData.baseY = portrait ? 1.3 : 1.25;
    camera.userData.lookY = 0.88 - (0.5 - anchor) * visibleH;
    camera.updateProjectionMatrix();
    wake(600);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  // ── Loop ───────────────────────────────────────────────────────────────────
  let frames = 0, perfT = 0, perfAdjusted = false;
  let enterStart = 0.2; // seconds on the render clock when the entrance begins

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const now = performance.now();
    const motion = reduced.matches ? 0 : 1;
    input.motion = motion;

    // Idle wander when the pointer has been still (also covers touch devices with no hover).
    const still = t - lastMove > 3.5 || lastMove < 0;
    const wx = motion && still ? Math.sin(t * 0.37) * 0.35 : 0;
    const wy = motion && still ? Math.sin(t * 0.23 + 1) * 0.12 : 0;
    const k = 1 - Math.exp(-dt * 5);
    smooth.x += ((still ? wx : target.x) - smooth.x) * k;
    smooth.y += ((still ? wy : target.y) - smooth.y) * k;
    input.lookX = smooth.x; input.lookY = smooth.y;

    // Showcase rotation: slow sway, paused while dragging, drag offset eases back afterwards.
    if (!dragging) {
      const since = t - lastDragEnd;
      if (since > 1.2) dragYaw *= Math.exp(-dt * 0.9);
      else dragYaw += dragVel * 0.0006 * (1 - since); // light inertia
    }
    const sway = motion ? Math.sin(t * 0.26) * (character.info?.bones ? 0.5 : 0.16) : 0;
    // Models without a rig cannot turn their head, so the cursor turns the whole figure a little instead.
    const follow = !character.info?.bones && motion ? smooth.x * 0.35 : 0;
    const yaw = sway + follow + dragYaw;
    input.bodyYaw = yaw;
    character.root.rotation.y = yaw;
    ring.rotation.z = motion ? t * 0.05 : 0;
    cone.material.opacity = 0.85 + (motion ? Math.sin(t * 1.1) * 0.1 : 0);
    glowDisk.material.opacity = 0.9 + (motion ? Math.sin(t * 0.8) * 0.08 : 0);

    character.update(dt, t, input);

    // Entrance: the figure rises and settles onto the platform (instant with reduced motion).
    const enter = motion ? Math.min(1, (t - enterStart) / 1.4) : 1;
    const ease = 1 - Math.pow(1 - enter, 3);
    character.root.position.y = (1 - ease) * -0.35;
    character.root.scale.setScalar(0.9 + 0.1 * ease);

    // Camera: small parallax from the cursor, steady otherwise.
    const d = camera.userData.dist;
    camera.position.set(smooth.x * 0.22, camera.userData.baseY - smooth.y * 0.05, d);
    camera.lookAt(0, camera.userData.lookY, 0);

    renderer.render(scene, camera);

    // Static pose when the user prefers reduced motion: stop looping a moment after input ends.
    if (!motion && now > activeUntil) stop();

    // Adaptive quality: if the first seconds run slow, drop the pixel ratio once.
    if (!perfAdjusted) {
      frames++; perfT += dt;
      if (perfT > 2.5) {
        if (frames / perfT < 40 && maxPixelRatio > 1) { maxPixelRatio = 1; resize(); }
        perfAdjusted = true;
      }
    }
  }
  function start() { if (running) return; running = true; clock.getDelta(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? (!document.hidden && start()) : stop(); }, { threshold: 0.02 });
  io.observe(hero);
  const onVis = () => (document.hidden ? stop() : visible && start());
  document.addEventListener("visibilitychange", onVis);
  reduced.addEventListener("change", () => wake(1500));

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault(); stop();
    document.getElementById("hero-fallback")?.removeAttribute("hidden");
  });
  canvas.addEventListener("webglcontextrestored", () => {
    document.getElementById("hero-fallback")?.setAttribute("hidden", "");
    wake(1000);
  });

  // First frame, then reveal.
  start();
  requestAnimationFrame(() => loading?.classList.add("done"));

  // Clean up when the page goes away.
  const dispose = () => {
    stop(); io.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("visibilitychange", onVis);
    character.dispose();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
    });
    renderer.dispose();
  };
  window.addEventListener("pagehide", dispose, { once: true });
  return { dispose, character };
}
