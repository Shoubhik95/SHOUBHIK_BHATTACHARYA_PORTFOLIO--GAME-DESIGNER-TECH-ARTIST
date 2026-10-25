# Custom hero character

The hero shows a built-in stand-in figure until you provide your own model.

1. Copy your file here (keep your original FBX elsewhere; never edit the source).
2. Open `src/hero/character.config.js` and set `model: "assets/models/character.glb"`.
3. Reload. Open the browser console: `[character]` lines list meshes, bones, animation
   clips and which bones were found for cursor look-at.

## FBX → GLB (recommended)
FBX loads directly (`.fbx` path works) but is heavy. For production, convert in Blender:
File → Import → FBX, check the pose/animation, then File → Export → glTF 2.0 (.glb) with
"Animation" enabled and textures embedded. Keep textures ≤ 2048 px.

## What the page does with it
- Scales to `targetHeight`, centres, and puts the feet on the platform.
- Plays a clip whose name contains `idle`/`stand`/`breath`/`wait` (else the first clip).
- Adds head / neck / chest rotation toward the cursor if bones matching `bones` regexes exist.
- With no rig or clips it still shows, with slow rotation and a subtle breathing scale.
- If loading fails it falls back to the stand-in and logs a warning.

If the model faces away from the camera set `rotationY: 180` in the config.
