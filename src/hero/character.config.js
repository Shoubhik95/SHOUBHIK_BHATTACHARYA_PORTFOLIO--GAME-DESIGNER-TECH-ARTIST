// ─────────────────────────────────────────────────────────────────────────────
// CHARACTER CONFIG — the one file to edit when you bring your own character.
//
// 1. Put your model in  assets/models/   (GLB preferred, FBX also supported). Current: character.glb
// 2. Set `model` below to its path, e.g. "assets/models/character.glb".
// 3. Reload. If the file is missing or fails to load, the built-in stand-in
//    character is shown instead, so the page never breaks.
//
// See assets/models/README.md for the full workflow (FBX → GLB with Blender).
// ─────────────────────────────────────────────────────────────────────────────
export const characterConfig = {
  // null  → use the built-in procedural stand-in character.
  model: "assets/models/character.glb",

  // The model is scaled so its bounding box is this tall (scene units).
  targetHeight: 1.78,

  // Extra Y rotation in degrees if the model does not face the camera by default.
  rotationY: 13, // measured: torso/hip line sits 13° off the X axis, toes point along +Z (see README)

  // Extra nudge after auto-centring and ground alignment: [x, y, z].
  offset: [0, 0, 0],

  // Animation clip names are matched case-insensitively by substring.
  // First match wins; if nothing matches, the model's first clip is used as idle.
  animations: {
    idle: ["idle", "stand", "breath", "wait"],
  },

  // Bones driven by the cursor. Matched by regular expression against bone names.
  // Works with Mixamo (mixamorig:Head), Blender/Rigify and most game rigs.
  bones: {
    head: /head$/i,
    neck: /neck$/i,
    chest: /spine2$|chest$|spine_02$|upperchest$|spine1$/i,
  },

  // Maximum cursor influence in radians.
  look: { headYaw: 0.9, headPitch: 0.4, chestYaw: 0.28 },
};
