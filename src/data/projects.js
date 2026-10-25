// PROJECT DATA — add a project by appending an object to `projects`.
//
// Required: id, title, category, year, summary, thumb
// Optional case-study fields (a section only renders when its field is filled in):
//   concept       [paragraph]            Project overview & concept
//   role          string                 my contribution, one line
//   team          [{ name, role }]       other people on the project
//   featuresTitle string                 heading for `features` (differs by project type)
//   features      [string]               gameplay / core features
//   implementation [{ title, text }]     technical implementation
//   workflow      ["Step: sentence"]     development workflow, in order
//   challenges    [{ challenge, solution }]   only when genuinely documented
//   engine, tools [string]
//   gallery       [image path]           first image opens by default (defaults to [thumb])
//   diagram       { src, caption }       architecture diagram — only where it helps explain the project
//   results       [string]               outcome / status, learnings
//   future        [string]               planned improvements
//   links         [{ label, href }]
//
// Everything below comes from the original portfolio data, README, the architecture diagrams
// and the project artwork. Nothing is invented; unknown fields are simply left out.

export const categories = {
  game: "Game Development",
  art: "Technical Art & 3D",
  vr: "VR / AR",
  web: "Web & Interactive",
};

export const projects = [
  {
    id: "vr-campus-tour",
    title: "VR Campus Tour",
    category: "vr",
    year: 2026,
    summary:
      "An immersive Unreal Engine 5 walkthrough of the VIT Bhopal campus with teleport locomotion, interactive nodes and spatial audio.",
    concept: [
      "A fully immersive virtual-reality tour of the VIT Bhopal campus, developed in Unreal Engine 5 around high-fidelity architectural models and realistic lighting.",
      "It was built by a team of five. I was the game designer.",
    ],
    role: "Game Designer",
    team: [
      { name: "Shoubhik Bhattacharya", role: "Game Designer" },
      { name: "Aman Kumar Prabhat", role: "Game Programmer" },
      { name: "Nikhil Prabhat", role: "Game Artist" },
      { name: "Manan Maheshwari", role: "Game Artist" },
      { name: "Amaan Tanveer", role: "UI Designer" },
    ],
    featuresTitle: "Experience & core features",
    features: [
      "Walk through the university grounds in VR",
      "Interactive nodes placed around the campus",
      "Spatial audio",
      "Smooth teleport-based locomotion",
    ],
    implementation: [
      {
        title: "Campus modelling",
        text: "The main buildings were modelled directly inside Unreal Engine with its built-in modelling tools, mapped to real campus blueprint coordinates to keep the scale accurate.",
      },
      {
        title: "Lighting",
        text: "Lumen global illumination keeps outdoor and indoor lighting consistent.",
      },
      {
        title: "Locomotion",
        text: "Teleport navigation built with the VR Interaction Toolkit, chosen to keep movement comfortable in VR.",
      },
    ],
    workflow: [
      "Layout: Stitched the campus blueprints into a reference grid.",
      "Modelling: Modelled the main buildings inside Unreal Engine.",
      "Lighting: Configured Lumen for outdoor and indoor consistency.",
      "Locomotion: Set up teleport locomotion and interactive nodes.",
    ],
    engine: "Unreal Engine 5",
    stage: "VR demonstration",
    tools: ["Unreal Engine 5", "Lumen", "VR Interaction Toolkit"],
    thumb: "public/images/projects/vr-campus-tour/cover.webp",
    results: ["Presented as a VR demonstration build."],
    links: [],
  },
  {
    id: "king-runner",
    title: "King Runner",
    category: "game",
    year: 2026,
    summary:
      "A 3D endless runner in Unity 6 with a procedural track-chunk spawner, lane-swap controls and a stylised medieval environment.",
    concept: [
      "An endless runner inspired by Subway Surfers, built from scratch in Unity 6. The track is generated from procedural path chunks that spawn ahead of the runner and are cleaned up behind them, so the run never ends.",
      "I handled the gameplay scripting, the environment, graphics optimisation and the sound.",
    ],
    role: "Gameplay programming, environment design, graphics optimisation and sound",
    featuresTitle: "Gameplay & core features",
    features: [
      "Endless, procedurally generated path built from chunks",
      "Lane swapping with swipe-style input, plus jump and fall physics",
      "Collectables: gold coins add score and points; a Speed Apple gives a speed boost with a dynamic field-of-view change",
      "Checkpoint system",
      "Spatial 3D audio for pickups and collisions",
      "URP look: colour grading, bloom, vignette and volumetric fog",
    ],
    implementation: [
      {
        title: "Procedural chunk spawner",
        text: "A level generator spawns path chunks ahead of the player and destroys them behind, with pooling so the track is generated continuously without allocation spikes.",
      },
      {
        title: "Input",
        text: "Unity 6's New Input System drives lane movement and swipe gestures.",
      },
      {
        title: "Optimisation",
        text: "Low-poly shaders and mesh batching keep the stylised environment cheap to render.",
      },
      {
        title: "Game state",
        text: "A game-manager and main-menu layer owns the game state, with separate player controller, collision, collectable and checkpoint scripts (see the diagram below).",
      },
    ],
    workflow: [
      "Chunk spawner: Built continuous level-chunk generation with pooling.",
      "Collectables: Scripted coins, pickups and score multipliers.",
      "Input: Integrated the New Input System for swipe and lane movement.",
      "Optimisation: Tuned low-poly shaders and mesh batching.",
      "Environment: Built the medieval castle runway and its assets.",
      "Sound: Produced footstep and pickup sound effects.",
    ],
    engine: "Unity 6",
    stage: "Playable build",
    tools: ["Unity 6", "C#", "New Input System", "URP"],
    thumb: "public/images/projects/king-runner/cover.png",
    diagram: {
      src: "public/images/diagrams/architecture_survivor.png",
      caption:
        "Script and system layout of King Runner: game state, procedural spawner, player controller, collectables, audio and the URP pipeline.",
    },
    results: ["Published as a playable build on itch.io."],
    links: [
      {
        label: "Play on itch.io",
        href: "https://shoubhik-bhattacharya.itch.io/king-runner",
      },
    ],
  },
  {
    id: "endless-survivor",
    title: "The Endless Survivor",
    category: "game",
    year: 2026,
    summary:
      "A 2.5D survival game: hold out against waves of monsters in a dark forest, collect XP and choose upgrades.",
    concept: [
      "A 2.5D survival game built in Unity, set in a dark, atmospheric forest infested with monsters. Waves of enemies chase the player, who fights back, levels up and picks upgrades.",
    ],
    role: "Level design, player controller and inventory, lighting and audio, publishing",
    featuresTitle: "Gameplay & core features",
    features: [
      "Survive waves of monsters in a dark forest",
      "Responsive 2.5D movement on the X and Y axes",
      "Auto-attack combat with player stats (health, armor, speed)",
      "Enemies drop XP gems; levelling up opens a random upgrade-card choice",
      "Dynamic lighting and ambient soundscapes",
      "Hand-crafted environment assets",
    ],
    implementation: [
      {
        title: "Wave spawning and pooling",
        text: "A wave manager spawns enemies from an object pool instead of instantiating and destroying them.",
      },
      {
        title: "Enemy AI",
        text: "Enemies chase and track the player with a dedicated chase script.",
      },
      {
        title: "Progression",
        text: "A level manager handles XP gem collection and a card-based random upgrade selection.",
      },
      {
        title: "2.5D depth sorting",
        text: "A custom sprite sorter orders sprites by Y position so characters overlap correctly.",
      },
      {
        title: "Atmosphere",
        text: "Dynamic lighting overlays combined with ambient sound loops build the tension of the forest.",
      },
    ],
    workflow: [
      "Level design: Blocked out the layout and environment.",
      "Player controller: Wrote a custom C# player controller and inventory.",
      "Atmosphere: Added 2D/3D dynamic lighting and dark ambient audio.",
      "Release: Built and published the game on itch.io.",
    ],
    engine: "Unity",
    stage: "Playable build",
    tools: ["Unity", "C#", "ProBuilder"],
    thumb: "public/images/projects/endless-survivor/cover.webp",
    diagram: {
      src: "public/images/diagrams/architecture_king_runner.png",
      caption:
        "System layout of The Endless Survivor: wave spawner and pooling, enemy AI, 2.5D movement, combat, progression and sprite sorting.",
    },
    results: ["Published as a playable build on itch.io."],
    links: [
      {
        label: "Play on itch.io",
        href: "https://shoubhik-bhattacharya.itch.io/the-endless-survivor-god-of-the-forest",
      },
    ],
  },
  {
    id: "car-driving-race",
    title: "Car Driving Race",
    category: "game",
    year: 2025,
    summary:
      "A pixel-art 2.5D browser racer: steer with the arrow keys and collect coins on a busy highway (desktop only).",
    concept: [
      "A pixelated 2.5D car game that runs in the browser. You race along a highway collecting coins. It was written with HTML, CSS and vanilla JavaScript, with no framework.",
    ],
    role: "Design and development",
    featuresTitle: "Gameplay & core features",
    features: [
      "Pixelated 2.5D road environment",
      "Collect coins while steering through traffic",
      "Arrow-key controls, designed for desktop",
      "Score tracking",
    ],
    implementation: [
      {
        title: "Game loop",
        text: "An animation-frame loop drives the road simulation, managing velocity thresholds and coin-collection triggers.",
      },
      {
        title: "Controls",
        text: "Keyboard arrow listeners handle the car's horizontal steering.",
      },
      {
        title: "Scoring",
        text: "Coin spawning, score calculation and collision mechanics are hand-written.",
      },
    ],
    workflow: [
      "Environment: Designed the pixel road and environment assets.",
      "Controls: Mapped arrow-key steering.",
      "Mechanics: Implemented coin spawning, scoring and collisions.",
      "Release: Deployed to Vercel with the code on GitHub.",
    ],
    engine: "HTML5 / JavaScript",
    stage: "Playable build",
    tools: ["HTML5", "CSS3", "JavaScript"],
    thumb: "public/images/projects/car-driving-race/cover.webp",
    diagram: {
      src: "public/images/diagrams/architecture_car_race.png",
      caption:
        "How the game is organised: road simulation driven by arrow-key controls, score mechanics, the level and audio system, and the Vercel deployment.",
    },
    results: ["Live and playable online (hosted on Vercel); source on GitHub."],
    links: [
      {
        label: "Play online",
        href: "https://car-game-html-css-js.vercel.app/",
      },
      {
        label: "Repository",
        href: "https://github.com/Shoubhik95/Car-Game-HTML-CSS-JS",
      },
    ],
  },

  {
    id: "pichku",
    title: "Pichku",
    category: "art",
    year: 2026,
    summary:
      "A stylised cartoon character modelled, textured, rigged and rendered in Blender.",
    concept: [
      "Pichku is a stylised, cartoon-style character designed and built end to end in Blender, then textured in Substance Painter and presented on a display platform.",
    ],
    role: "Concept, modelling, texturing, rigging and rendering",
    featuresTitle: "Character design & features",
    features: [
      "Whimsical character with clean facial and body features that read well from a distance",
      "Stylised mesh with game-friendly topology",
      "Carefully unwrapped UVs with hand-made texturing",
      "Rigged armature for animation pipelines",
    ],
    implementation: [
      {
        title: "Modelling",
        text: "The character was sculpted in the Blender viewport as a clean stylised mesh, starting from profile blueprints and reference grids.",
      },
      {
        title: "Texturing",
        text: "Texture overlays and roughness / metallic layouts were generated in Substance Painter to define the character's stylised look.",
      },
      {
        title: "Rigging",
        text: "A skeleton armature with constraints was set up so the model can be animated.",
      },
      {
        title: "Rendering",
        text: "Final shots were rendered in Blender Cycles.",
      },
    ],
    workflow: [
      "Reference: Sketched profile blueprints and set up reference grids.",
      "Sculpt: Sculpted a clean stylised mesh in Blender.",
      "Texturing: Painted texture overlays in Substance Painter.",
      "Rig & render: Built the armature and rendered the final shots.",
    ],
    engine: "Blender (Cycles)",
    stage: "Finished model & textures",
    tools: ["Blender", "Substance Painter"],
    thumb: "public/images/projects/pichku/pichku_3.webp",
    gallery: [
      "public/images/projects/pichku/pichku_3.webp",
      "public/images/projects/pichku/pichku_0.webp",
      "public/images/projects/pichku/pichku_1.webp",
      "public/images/projects/pichku/pichku_2.webp",
      "public/images/projects/pichku/pichku_4.webp",
    ],
    results: ["Finished, textured and rigged model; showcased on ArtStation."],
    links: [
      {
        label: "ArtStation",
        href: "https://gamedev_shoubhik2.artstation.com/projects/1L1NZo",
      },
    ],
  },
  {
    id: "cute-monster",
    title: "Cute Monster",
    category: "art",
    year: 2026,
    summary:
      "A whimsical stylised monster character with multi-angle renders and hand-made textures.",
    concept: [
      'A stylised monster character sculpted in Blender, textured in Substance Painter, rigged for facial expression and body movement, and rendered in Cycles. Its renders include the "Untold Story" title art.',
    ],
    role: "Sculpting, texturing, rigging and rendering",
    featuresTitle: "Character design & features",
    features: [
      "Expressive stylised design with custom textures and material shaders",
      "Facial expression and body rig",
      "Multi-angle beauty renders",
    ],
    implementation: [
      {
        title: "Sculpting",
        text: "A base mesh was sculpted and then refined with anatomical detail.",
      },
      {
        title: "Texturing",
        text: "Hand-made textures were painted in Substance Painter.",
      },
      {
        title: "Rigging",
        text: "The rig covers facial expressions and body mechanics.",
      },
      {
        title: "Lighting and render",
        text: "A multi-point studio light setup in Cycles brings out the material textures.",
      },
    ],
    workflow: [
      "Sculpt: Sculpted the base mesh and refined the detail.",
      "Texturing: Painted textures in Substance Painter.",
      "Rigging: Rigged facial expressions and body mechanics.",
      "Render: Rendered final beauty shots in Cycles.",
    ],
    engine: "Blender (Cycles)",
    stage: "Fully textured, rigged",
    tools: ["Blender", "Substance Painter"],
    thumb: "public/images/projects/cute-monster/untold-story.webp",
    gallery: [
      "public/images/projects/cute-monster/untold-story.webp",
      "public/images/projects/cute-monster/Cute_monster.webp",
      "public/images/projects/cute-monster/Cute_monster2.webp",
      "public/images/projects/cute-monster/Cute_monster3.webp",
    ],
    results: ["Fully textured, rigged model; showcased on ArtStation."],
    future: ['Build a small playable game around the "Untold Story" theme.'],
    links: [
      {
        label: "ArtStation",
        href: "https://gamedev_shoubhik2.artstation.com/projects/vbNrNx",
      },
    ],
  },
  {
    id: "axe-man",
    title: "Axe Man",
    category: "art",
    year: 2025,
    summary:
      "A low-poly woodsman with a hammer-axe, modelled, hand-painted and rigged in Blender.",
    concept: [
      "A stylised low-poly character of a woodsman carrying a hammer-axe, designed, modelled and textured entirely in Blender.",
    ],
    role: "Concept, modelling, texturing and rigging",
    featuresTitle: "Character design & features",
    features: [
      "Low-poly stylised design, optimised for real-time use",
      "Clean UV unwrapping and a hand-painted colour map",
      "Full armature with IK/FK constraints",
    ],
    implementation: [
      {
        title: "Topology",
        text: "Low-poly meshes with clean edge loops placed to support joint movement in the rig.",
      },
      {
        title: "Texturing",
        text: "UVs were unwrapped and detailed colour maps painted by hand to add depth to the asset.",
      },
      {
        title: "Rigging",
        text: "A complete armature with IK/FK constraints prepares the model for game animation.",
      },
    ],
    workflow: [
      "Concept: Made character sheets and reference alignment.",
      "Topology: Modelled low-poly meshes with clean edge loops.",
      "Texturing: Unwrapped UVs and painted colour maps.",
      "Rigging: Built the armature with IK/FK constraints.",
    ],
    engine: "Blender",
    stage: "Complete character rig",
    tools: ["Blender"],
    thumb: "public/images/projects/axe-man/axe_man_0.webp",
    gallery: [
      "public/images/projects/axe-man/axe_man_0.webp",
      "public/images/projects/axe-man/axe_man_1.webp",
      "public/images/projects/axe-man/axe_man_2.webp",
      "public/images/projects/axe-man/axe_man_3.webp",
    ],
    results: ["Complete rigged character."],
    links: [],
  },
  {
    id: "magic-baby",
    title: "Magic Baby",
    category: "art",
    year: 2026,
    summary:
      "An expressive stylised character with procedural glowing shaders, built in Blender.",
    concept: [
      "A whimsical, stylised magical character with expressive features, sculpted, textured and rendered in Blender.",
    ],
    role: "Sculpting, retopology, shading and rendering",
    featuresTitle: "Character design & features",
    features: [
      "Expressive stylised proportions",
      "Soft-edge shading with clean topology",
      "Procedural glowing shader for the magical effect",
    ],
    implementation: [
      {
        title: "Retopology",
        text: "The sculpt was re-topologised to production-ready polygon limits.",
      },
      {
        title: "Glow shading",
        text: "A procedural emissive shader network built in Blender's node editor gives the character its glow.",
      },
      {
        title: "Rendering",
        text: "A studio camera setup and Cycles pipeline produce the final renders.",
      },
    ],
    workflow: [
      "Sculpt: Sculpted the head and body proportions.",
      "Retopology: Re-topologised the mesh to production-ready limits.",
      "Shading: Built procedural glowing shader networks in the node editor.",
      "Render: Set up studio cameras and the Cycles pipeline.",
    ],
    engine: "Blender (Cycles)",
    stage: "Rendered model",
    tools: ["Blender"],
    thumb: "public/images/projects/magic-baby/magic_baby_1.webp",
    gallery: [
      "public/images/projects/magic-baby/magic_baby_1.webp",
      "public/images/projects/magic-baby/magic_baby_2.webp",
      "public/images/projects/magic-baby/magic_baby_3.webp",
    ],
    results: ["Rendered model with a custom glowing shader."],
    links: [],
  },
  {
    id: "littlebits",
    title: "LittleBits — Club Hub",
    category: "web",
    year: 2026,
    summary:
      "A campus club portal for event registration, entry passes and seat tracking, built with Aman Kumar Prabhat.",
    concept: [
      "A digital campus hub designed to manage event overcrowding, organise club activity and make student involvement easier. Students can browse clubs, join them and register for events; coordinators can publish events and contact students.",
    ],
    role: "Co-developer",
    team: [
      { name: "Shoubhik Bhattacharya", role: "Co-developer" },
      { name: "Aman Kumar Prabhat", role: "Co-developer" },
    ],
    featuresTitle: "Core features",
    features: [
      "Club exploration, joining and activity details",
      "Event publishing and simple event registration",
      "Quick, easily accessible entry passes",
      "Live seat tracker to manage crowding",
      "Authorisation panel and coordinator contact portal",
      "Dashboard and admin portal",
    ],
    implementation: [
      {
        title: "Dashboard",
        text: "A grid-based community dashboard with a gamified HUD theme.",
      },
      {
        title: "Access and passes",
        text: "An authorisation panel, a coordinator contact portal and dynamic entry-pass generation.",
      },
      { title: "Tracking", text: "A live event seating tracker." },
      {
        title: "Stack",
        text: "Plain HTML, CSS and JavaScript with Git version control, hosted on Netlify.",
      },
    ],
    workflow: [
      "Dashboard: Designed the community dashboard grid.",
      "Access: Built the authorisation panel and coordinator contact portal.",
      "Events: Implemented the seating tracker and entry-pass generation.",
      "Deploy: Hosted on Netlify with Git version control.",
    ],
    engine: "Web",
    stage: "Live production app",
    tools: ["HTML5", "CSS3", "JavaScript", "Git", "Netlify"],
    thumb: "public/images/projects/littlebits/cover.webp",
    diagram: {
      src: "public/images/diagrams/architecture_littlebits.png",
      caption:
        "The LittleBits hub: collaborators and the UI dashboard, access portals (auth and entry points), and the usage and engagement tracker.",
    },
    results: ["Live on Netlify; source on GitHub."],
    links: [
      { label: "Live site", href: "https://littlebitsclub.netlify.app/" },
      { label: "Repository", href: "https://github.com/amanrock1/LittleBits" },
    ],
  },
  {
    id: "360-virtual-tour",
    title: "360° Virtual Campus Tour",
    category: "web",
    year: 2026,
    summary:
      "A web-based 360° tour of the VIT Bhopal campus with interactive hotspots, built on Pannellum.",
    concept: [
      "A browser-based 360° virtual tour of the VIT Bhopal campus, made so that prospective students and their parents can explore the place remotely. It is based on panoramic photography of the real buildings.",
    ],
    role: "Design and development",
    featuresTitle: "Experience & core features",
    features: [
      "High-definition equirectangular panoramas",
      "Interactive hotspots that open detailed information popups",
      "Audio descriptions and ambient sound",
      "Responsive layout for mobile and desktop",
      "AI avatar for guidance",
    ],
    implementation: [
      {
        title: "Panorama viewer",
        text: "Pannellum renders the equirectangular panoramas and handles navigation.",
      },
      {
        title: "Scene switching",
        text: "Hotspots and portals move the visitor between locations, and a location switcher loads building data.",
      },
      {
        title: "Info cards",
        text: "Clicking a hotspot opens info cards with context for that place.",
      },
    ],
    workflow: [
      "Panoramas: Stitched panorama photo sets into projections.",
      "Structure: Built a layout that works on desktop and mobile.",
      "Hotspots: Coded hotspot coordinates that load context cards.",
      "Deploy: Hosted the production build.",
    ],
    engine: "Web (Pannellum)",
    stage: "Live production app",
    tools: ["HTML5", "CSS3", "JavaScript", "Pannellum"],
    thumb: "public/images/projects/360-virtual-tour/cover.webp",
    diagram: {
      src: "public/images/diagrams/architecture_vr_campus.png",
      caption:
        "How the tour fits together: viewer, scene switcher, hotspots, info cards and audio.",
    },
    results: ["Live on the web."],
    links: [
      {
        label: "Live site",
        href: "https://360-virtual-campur-tour.vercel.app/",
      },
    ],
  },
  {
    id: "chhattisgarh-tourism",
    title: "Chhattisgarh Tourism",
    category: "web",
    year: 2025,
    summary:
      "A responsive tourism guide to destinations in Chhattisgarh, with destination search and image galleries.",
    concept: [
      "A tourism web app that helps travellers discover locations, attractions and cultural details across Chhattisgarh, bringing the guide, exploration and tourist-helper pages together in one site.",
    ],
    role: "Design and development",
    featuresTitle: "Core features",
    features: [
      "Destination search and navigation",
      "Immersive image galleries",
      "Curated travel information",
      "Responsive layout for all devices",
    ],
    implementation: [
      {
        title: "Responsive layout",
        text: "Responsive structures and colour themes built for tourism content.",
      },
      {
        title: "Search",
        text: "Interactive navigation and a destination search system.",
      },
      {
        title: "Media",
        text: "Image assets and UI transitions optimised for smooth browsing.",
      },
    ],
    workflow: [
      "Layout: Created responsive structures and colour themes.",
      "Search: Implemented destination search and navigation.",
      "Media: Optimised images and UI transitions.",
      "Deploy: Deployed to Netlify and tested across devices.",
    ],
    engine: "Web",
    stage: "Live production app",
    tools: ["HTML5", "CSS3", "JavaScript", "Netlify"],
    thumb: "public/images/projects/chhattisgarh-tourism/tourism_0.webp",
    diagram: {
      src: "public/images/diagrams/architecture_chhattisgarh_tourism.jpg",
      caption:
        "System blueprint of the tourism portal: destination gallery and map, interactive features, media assets and live deployment.",
    },
    gallery: [
      "public/images/projects/chhattisgarh-tourism/tourism_0.webp",
      "public/images/projects/chhattisgarh-tourism/tourism_1.webp",
      "public/images/projects/chhattisgarh-tourism/tourism_2.webp",
      "public/images/projects/chhattisgarh-tourism/tourism_3.webp",
    ],
    results: ["Live on Netlify; source on GitHub."],
    links: [
      {
        label: "Live site",
        href: "https://ourchhattisgarhtourist.netlify.app/",
      },
      {
        label: "Repository",
        href: "https://github.com/Shoubhik95/Our-Chhattisgarh-tourist-website",
      },
    ],
  },
];
