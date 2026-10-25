// Personal details, skills, education and links.
// Everything here was carried over from the original portfolio (js/data.js, index.html, README).
// Edit this file to update copy; the UI reads it at runtime.

export const profile = {
  name: "Shoubhik Bhattacharya",
  role: "Game Designer & Technical Artist",
  tagline:
    "Building interactive worlds through game design, real-time environments, and technical artistry.",
  email: "shoubhikbhattacharya100@gmail.com",
  resume: "public/documents/Shoubhik_Bhattacharya_Resume.pdf",
  avatar: "public/images/profile/pixel-avatar.webp",
  links: [
    {
      label: "GitHub",
      handle: "@Shoubhik95",
      href: "https://github.com/Shoubhik95",
    },
    {
      label: "LinkedIn",
      handle: "Shoubhik Bhattacharya",
      href: "https://www.linkedin.com/in/shoubhik-bhattacharya-8b4099324",
    },
    {
      label: "ArtStation",
      handle: "@gamedev_shoubhik2",
      href: "https://www.artstation.com/gamedev_shoubhik2",
    },
    {
      label: "Itch.io",
      handle: "shoubhik-bhattacharya",
      href: "https://shoubhik-bhattacharya.itch.io/",
    },
  ],
};

// Web3Forms (contact form). Same access key the original site used (js/modules/modal.js); it is a public,
// client-side key. Submissions go to the recipient configured for this key in the Web3Forms dashboard.
export const web3forms = {
  endpoint: "https://api.web3forms.com/submit",
  accessKey: "df88249e-ff86-42b9-88b0-c3dd4e281d24",
  fromName: "Shoubhik's Portfolio",
};

// Short labels for the 'Software skills' tiles (letters shown on the tile, full name on hover/label).
export const software = [
  ["UE", "Unreal Engine 5"],
  ["U", "Unity 6"],
  ["Bl", "Blender"],
  ["Sp", "Substance Painter"],
  ["C#", "C#"],
  ["C++", "C++"],
];

export const about = {
  // Paragraphs rendered in order. Source: original About section + README.
  paragraphs: [
    "I'm a B.Tech Computer Science student at VIT Bhopal, specialising in Gaming Technology. I build interactive games in Unity, immersive VR experiences in Unreal Engine, and stylised 3D characters and environments in Blender.",
    "I enjoy combining gameplay programming, technical art, environment design, and visual storytelling to create engaging interactive experiences. I also develop independent projects through Astrayuga Interactive.",
  ],
  // Status tiles on the About screen
  tiles: [
    "B.Tech CSE student",
    "Gaming Technology",
    "VIT Bhopal · 2024–2028",
    "Founder, Astrayuga",
  ],
  location: "Bhopal, Madhya Pradesh, India",
};

// Grouped, deliberately without percentages or "expert" labels.
// Six category cards (names carried over from the original portfolio, without proficiency levels).
// `icon` is a key into the SVG line-icon set in src/modules/sections.js.
export const skillGroups = [
  {
    group: "Game Development",
    icon: "gamepad",
    items: [
      "Unreal Engine 5",
      "Unity 6",
      "Blueprint Scripting",
      "VR/AR Integration",
    ],
  },
  {
    group: "Programming",
    icon: "code",
    items: ["C++", "C#", "Python", "Data Structures & OOP"],
  },
  {
    group: "Game Design",
    icon: "blocks",
    items: [
      "Gameplay Systems",
      "Game Mechanics",
      "Level Design",
      "Visual Storytelling",
    ],
  },
  {
    group: "Technical Art & 3D",
    icon: "cube",
    items: [
      "Blender 3D",
      "Skeletal Rigging & Animation",
      "Environment Art & Lighting",
      "Asset Optimization",
    ],
  },
  {
    group: "Web Development",
    icon: "globe",
    items: [
      "HTML5 & CSS3",
      "JavaScript (ES6+)",
      "Figma UI/UX",
      "Firebase & APIs",
    ],
  },
  {
    group: "Tools & Workflow",
    icon: "gear",
    items: [
      "Git / GitHub",
      "VS Code & IDEs",
      "Unity / Unreal Editor",
      "Real-Time Rendering",
    ],
  },
];

export const experience = [
  {
    period: "2024 — Present",
    title: "Founder",
    org: "Astrayuga Interactive",
    kind: "Independent studio",
    focus: ["Gameplay mechanics", "Technical art assets", "Project pipelines"],
    text: "Founded Astrayuga Interactive to conceptualise gameplay mechanics, build technical art assets and manage project pipelines.",
    link: {
      label: "Studio site",
      href: "https://astrayuga-interactive-official-deve.vercel.app/",
    },
  },
];

export const education = {
  university: {
    name: "VIT Bhopal University",
    place: "Bhopal, Madhya Pradesh, India",
    years: "2024 — 2028",
    degree: "B.Tech in Computer Science and Engineering",
    specialisation: "Gaming Technology",
    score: ["8.3", "CGPA / 10"],
    courses: [
      "Data Structures",
      "OOP",
      "Gameplay Programming",
      "Game Design",
      "3D Modelling",
    ],
  },
  school: [
    {
      level: "CBSE Class 12",
      name: "DAV Public School, Chirimiri",
      result: "First Division",
    },
    {
      level: "CGBSE Class 10",
      name: "Marias Higher Secondary School",
      result: "91.83%",
    },
  ],
};

export const certificates = [
  {
    src: "public/images/certificates/udemy-unity6-csharp.jpg",
    alt: "Certificate: Complete C# Unity 3D Game Development in Unity 6",
    title: "C# Unity 3D Game Development (Unity 6)",
  },
  {
    src: "public/images/certificates/udemy-unreal5-filmmaking.jpg",
    alt: "Certificate: Master Filmmaking in Unreal Engine 5",
    title: "Filmmaking in Unreal Engine 5",
  },
  {
    src: "public/images/certificates/udemy-unreal5-modeling.webp",
    alt: "Certificate: Unreal Engine 5 Modeling",
    title: "Unreal Engine 5 Modeling",
  },
  {
    src: "public/images/certificates/simplilearn-cpp.webp",
    alt: "Certificate: C++ Programming",
    title: "C++ Programming",
  },
  {
    src: "public/images/certificates/vityarthi-python-essentials.webp",
    alt: "Certificate: Python Essentials",
    title: "Python Essentials",
  },
  {
    src: "public/images/certificates/coursera-ar-vr.webp",
    alt: "Coursera certificate: AR/VR/MR/XR",
    title: "AR / VR / MR / XR (Coursera)",
  },
  {
    src: "public/images/certificates/vityarthi-certification.webp",
    alt: "Vityarthi certification",
    title: "Vityarthi certification",
  },
];
