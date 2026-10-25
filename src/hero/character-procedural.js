// Built-in stand-in character: a stylised articulated figure in graphite with a teal visor,
// a nod to the VR headset in the portfolio avatar. It is replaced by a custom model when
// `characterConfig.model` is set. Both implementations share the same interface:
//   { root, update(dt, t, input), dispose() }
// where input = { lookX, lookY (−1..1), bodyYaw, motion (0..1) }.
import * as THREE from "three";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createProceduralCharacter() {
  const root = new THREE.Group();
  root.scale.setScalar(0.92); // brings the ~1.95 unit rig to roughly 1.8 units tall

  const graphite = new THREE.MeshStandardMaterial({ color: 0x14263a, roughness: 0.7, metalness: 0.15 });
  const hoodie = new THREE.MeshStandardMaterial({ color: 0x1b9aa0, roughness: 0.75, metalness: 0.0 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc79a82, roughness: 0.55, metalness: 0.1 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x12171b, roughness: 0.5, metalness: 0.2 });
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x0d1418, roughness: 0.2, metalness: 0.7 });
  const sneaker = new THREE.MeshStandardMaterial({ color: 0xf2f6f6, roughness: 0.5 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9ff6f6, emissiveIntensity: 1.4, roughness: 0.4 });

  const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    return m;
  };
  const capsule = (r, len, mat) => new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), mat);

  // ── Hips / legs ────────────────────────────────────────────────────────────
  const hips = new THREE.Group();
  hips.position.y = 0.95;
  root.add(hips);
  const pelvis = capsule(0.165, 0.06, graphite);
  pelvis.position.y = -0.02;
  pelvis.scale.set(1.12, 1, 0.8);
  hips.add(pelvis);

  const legs = [-1, 1].map((s) => {
    const thigh = new THREE.Group();
    thigh.position.set(s * 0.1, -0.05, 0);
    const upper = capsule(0.085, 0.34, graphite); upper.position.y = -0.22;
    const knee = new THREE.Group(); knee.position.y = -0.44;
    const lower = capsule(0.07, 0.34, graphite); lower.position.y = -0.22;
    const boot = mesh(new THREE.BoxGeometry(0.13, 0.09, 0.27), sneaker, 0, -0.425, 0.04);
    knee.add(lower, boot);
    thigh.add(upper, knee);
    hips.add(thigh);
    return { thigh, knee };
  });

  // ── Torso ─────────────────────────────────────────────────────────────────
  const spine = new THREE.Group();
  spine.position.y = 0.04;
  hips.add(spine);
  const torso = capsule(0.17, 0.3, hoodie); torso.position.y = 0.27; torso.scale.set(1.18, 1, 0.78);
  spine.add(torso);
  const stripe = mesh(new THREE.BoxGeometry(0.012, 0.36, 0.01), glow, 0, 0.27, 0.139);
  spine.add(stripe);
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 10, 24), hoodie);
  hood.position.set(0, 0.56, -0.02); hood.rotation.x = Math.PI / 2.4; spine.add(hood);

  // ── Arms ──────────────────────────────────────────────────────────────────
  const arms = [-1, 1].map((s) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.24, 0.5, 0);
    shoulder.rotation.z = s * 0.1;
    const upper = capsule(0.058, 0.26, hoodie); upper.position.y = -0.17;
    const elbow = new THREE.Group(); elbow.position.y = -0.34; elbow.rotation.x = -0.28;
    const fore = capsule(0.05, 0.24, hoodie); fore.position.y = -0.16;
    const hand = mesh(new THREE.SphereGeometry(0.052, 14, 12), skin, 0, -0.34, 0);
    elbow.add(fore, hand);
    shoulder.add(upper, elbow);
    spine.add(shoulder);
    return { shoulder, elbow, s };
  });

  // ── Neck / head ───────────────────────────────────────────────────────────
  const neck = new THREE.Group();
  neck.position.y = 0.6;
  spine.add(neck);
  neck.add(mesh(new THREE.CylinderGeometry(0.05, 0.058, 0.1, 14), skin, 0, 0.03, 0));
  const head = new THREE.Group();
  head.position.y = 0.09;
  neck.add(head);
  const skull = mesh(new THREE.SphereGeometry(0.125, 28, 22), skin, 0, 0.14, 0);
  skull.scale.set(0.92, 1.08, 1);
  head.add(skull);
  const jaw = mesh(new THREE.SphereGeometry(0.1, 20, 14), skin, 0, 0.065, 0.025); jaw.scale.set(0.92, 0.8, 0.95);
  head.add(jaw);
  const hair = mesh(new THREE.SphereGeometry(0.13, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.46), trim, 0, 0.165, -0.008);
  hair.scale.set(0.95, 1.08, 1.02); hair.rotation.x = -0.18;
  head.add(hair);
  // VR headset
  const visor = mesh(new THREE.BoxGeometry(0.27, 0.105, 0.14), visorMat, 0, 0.15, 0.09);
  visor.geometry.translate(0, 0, 0);
  head.add(visor);
  head.add(mesh(new THREE.BoxGeometry(0.2, 0.012, 0.005), glow, 0, 0.15, 0.162));
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.011, 8, 32), trim);
  strap.position.set(0, 0.16, 0); strap.rotation.x = Math.PI / 2; strap.scale.set(1, 1.05, 1);
  head.add(strap);

  // Pose state
  const look = { yaw: 0, pitch: 0 };

  function update(dt, t, input) {
    const m = input.motion; // 0 under reduced motion
    const breath = Math.sin(t * 1.75) * m;
    const sway = Math.sin(t * 0.7) * m;

    // Idle: breathing, weight shift, slight arm drift
    spine.scale.set(1 + breath * 0.006, 1 + breath * 0.012, 1 + breath * 0.006);
    hips.position.y = 0.95 + breath * 0.004;
    hips.rotation.z = sway * 0.018;
    hips.rotation.y = sway * 0.03;
    spine.rotation.z = -sway * 0.02;
    legs[0].thigh.rotation.z = -sway * 0.012; legs[1].thigh.rotation.z = -sway * 0.012;
    legs[0].knee.rotation.x = Math.max(0, sway) * 0.03; legs[1].knee.rotation.x = Math.max(0, -sway) * 0.03;
    arms.forEach(({ shoulder, elbow, s }) => {
      shoulder.rotation.z = s * (0.1 + breath * 0.012);
      shoulder.rotation.x = Math.sin(t * 0.7 + (s > 0 ? 0 : Math.PI)) * 0.035 * m;
      elbow.rotation.x = -0.28 - breath * 0.015;
    });

    // Gaze: the head tracks the cursor relative to the body's current turn; the chest helps a little.
    const wantYaw = input.lookX * 0.85 - input.bodyYaw;
    const wantPitch = -input.lookY * 0.38;
    const k = 1 - Math.exp(-dt * 6);
    look.yaw += (clamp(wantYaw, -1.05, 1.05) - look.yaw) * k;
    look.pitch += (clamp(wantPitch, -0.38, 0.38) - look.pitch) * k;
    spine.rotation.y = look.yaw * 0.28;
    neck.rotation.y = look.yaw * 0.28;
    head.rotation.y = look.yaw * 0.44;
    neck.rotation.x = look.pitch * 0.4;
    head.rotation.x = look.pitch * 0.6;
    head.rotation.z = -look.yaw * 0.05;
  }

  function dispose() {
    root.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
    [graphite, hoodie, skin, trim, visorMat, glow, sneaker].forEach((m) => m.dispose());
  }

  return { root, update, dispose, kind: "procedural" };
}
