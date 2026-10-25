// Loads a user-supplied GLB/glTF/FBX character, normalises scale and ground alignment,
// plays an idle clip when one exists, and drives head/neck/chest bones from the cursor.
// Same interface as the procedural character: { root, update, dispose }.
import * as THREE from "three";

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export async function loadCustomCharacter(cfg) {
  const ext = cfg.model.split("?")[0].split(".").pop().toLowerCase();
  let source; // { scene, animations }

  if (ext === "fbx") {
    const { FBXLoader } = await import("three/addons/loaders/FBXLoader.js");
    const obj = await new FBXLoader().loadAsync(cfg.model);
    source = { scene: obj, animations: obj.animations || [] };
  } else if (ext === "glb" || ext === "gltf") {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const gltf = await new GLTFLoader().loadAsync(cfg.model);
    source = { scene: gltf.scene, animations: gltf.animations || [] };
  } else {
    throw new Error(`Unsupported character format ".${ext}" (use .glb, .gltf or .fbx)`);
  }

  const model = source.scene;
  const root = new THREE.Group();
  const holder = new THREE.Group(); // normalised model lives here
  holder.add(model);
  root.add(holder);

  // ── Inspect ────────────────────────────────────────────────────────────────
  const bones = [];
  let meshCount = 0, skinned = 0;
  model.traverse((o) => {
    if (o.isBone) bones.push(o);
    if (o.isMesh) { meshCount++; if (o.isSkinnedMesh) skinned++; o.frustumCulled = false; }
  });
  const clips = source.animations;
  console.info(`[character] ${cfg.model}: ${meshCount} meshes (${skinned} skinned), ${bones.length} bones, ${clips.length} clips`,
    clips.map((c) => `${c.name} (${c.duration.toFixed(2)}s)`));

  // ── Normalise: scale to target height, centre on X/Z, feet on y = 0 ────────
  model.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  if (!isFinite(size.y) || size.y <= 0) throw new Error("Character has an empty bounding box");
  const s = cfg.targetHeight / size.y;
  holder.scale.setScalar(s);
  holder.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(holder);
  const centre = box.getCenter(new THREE.Vector3());
  holder.position.set(-centre.x + cfg.offset[0], -box.min.y + cfg.offset[1], -centre.z + cfg.offset[2]);
  holder.rotation.y = THREE.MathUtils.degToRad(cfg.rotationY);

  // FBX files often ship with unlit/black materials or missing textures; make sure they render.
  model.traverse((o) => {
    if (!o.isMesh) return;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
      if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
    });
  });

  // ── Animation ──────────────────────────────────────────────────────────────
  let mixer = null;
  if (clips.length) {
    mixer = new THREE.AnimationMixer(model);
    const wanted = cfg.animations.idle.map((n) => n.toLowerCase());
    const clip = clips.find((c) => wanted.some((w) => c.name.toLowerCase().includes(w))) || clips[0];
    mixer.clipAction(clip).play();
    console.info(`[character] playing "${clip.name}" as idle`);
  } else {
    console.info("[character] no animation clips found; using procedural breathing only");
  }

  // ── Look-at bones ──────────────────────────────────────────────────────────
  const find = (re) => bones.find((b) => re.test(b.name.replace(/^mixamorig[:_]?/i, "")));
  const head = find(cfg.bones.head), neck = find(cfg.bones.neck), chest = find(cfg.bones.chest);
  console.info("[character] look-at bones:", { head: head?.name, neck: neck?.name, chest: chest?.name });
  const look = { yaw: 0, pitch: 0 };
  const q = new THREE.Quaternion(), e = new THREE.Euler();
  const lk = cfg.look;

  // Bones the playing clip rewrites every frame can be offset additively; for the rest we start
  // from the captured rest pose each frame so the offset never accumulates.
  const animated = new Set(clips.flatMap((c) => c.tracks.map((tr) => tr.name.split(".")[0])));
  const rest = new Map([head, neck, chest].filter(Boolean).map((b) => [b, b.quaternion.clone()]));
  const add = (bone, yaw, pitch) => {
    if (!bone) return;
    if (!animated.has(bone.name)) bone.quaternion.copy(rest.get(bone));
    e.set(pitch, yaw, 0, "YXZ");
    bone.quaternion.multiply(q.setFromEuler(e));
  };

  function update(dt, t, input) {
    mixer?.update(input.motion ? dt : 0);
    if (!mixer && input.motion) { // no clips: gentle breathing on the whole figure
      holder.scale.y = s * (1 + Math.sin(t * 1.75) * 0.004);
    }
    const k = 1 - Math.exp(-dt * 6);
    look.yaw += (clamp(input.lookX * 0.85 - input.bodyYaw, -lk.headYaw, lk.headYaw) - look.yaw) * k;
    look.pitch += (clamp(-input.lookY * 0.38, -lk.headPitch, lk.headPitch) - look.pitch) * k;
    add(chest, look.yaw * (lk.chestYaw / lk.headYaw), 0);
    add(neck, look.yaw * 0.3, look.pitch * 0.4);
    add(head, look.yaw * (neck ? 0.5 : 0.8), look.pitch * (neck ? 0.6 : 1));
  }

  function dispose() {
    mixer?.stopAllAction();
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        Object.values(m).forEach((v) => v?.isTexture && v.dispose());
        m.dispose();
      });
    });
  }

  return { root, update, dispose, kind: "custom", info: { bones: bones.length, clips: clips.length } };
}
