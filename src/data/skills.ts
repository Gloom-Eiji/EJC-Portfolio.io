// The Armory. Skills come from the 2026 résumé and previous portfolio.
// Descriptions say where each skill was used — no invented proficiency levels.

export type SkillCategory = "weapons" | "armor" | "relics" | "alchemy" | "tools";

export const categories: { id: SkillCategory; name: string; meaning: string }[] = [
  { id: "weapons", name: "Weapons", meaning: "Languages" },
  { id: "armor", name: "Armor", meaning: "Frameworks & libraries" },
  { id: "relics", name: "Relics", meaning: "Data, cloud & infrastructure" },
  { id: "alchemy", name: "Alchemy", meaning: "AI, data mining & security" },
  { id: "tools", name: "Tools", meaning: "Design, game & workflow" },
];

export type Skill = {
  id: string;
  name: string;
  sigil: string;
  category: SkillCategory;
  lore: string;
  projects?: string[];
  courses?: string[];
};

export const skills: Skill[] = [
  // Weapons — languages
  { id: "python", name: "Python", sigil: "Py", category: "weapons",
    lore: "The everyday blade. Flask backends, FFmpeg automation, database-backed QA tooling and Baselight data parsing.",
    projects: ["hotel-ocean-vista", "pipeline-tools"], courses: ["COMP 467"] },
  { id: "javascript", name: "JavaScript", sigil: "JS", category: "weapons",
    lore: "Front-end and mobile work across React, React Native and Expo, plus browser games and tools built from scratch.",
    projects: ["toro-campus-connect", "cs-sim", "typeit", "map-quiz"], courses: ["COMP 484"] },
  { id: "c-cpp", name: "C / C++", sigil: "C++", category: "weapons",
    lore: "Systems-level work: memory, processes and data structures close to the metal.",
    courses: ["COMP 222", "COMP 282", "COMP 322"] },
  { id: "sql", name: "SQL", sigil: "SQL", category: "weapons",
    lore: "Relational modeling and querying across PostgreSQL, MS SQL Server, MySQL and Supabase.",
    projects: ["hotel-ocean-vista", "toro-campus-connect"], courses: ["COMP 440"] },
  { id: "html-css", name: "HTML / CSS", sigil: "</>", category: "weapons",
    lore: "Semantic structure and styling for every web interface, including this one.",
    projects: ["hotel-ocean-vista", "frs-story"], courses: ["COMP 484"] },
  { id: "csharp", name: "C#", sigil: "C#", category: "weapons",
    lore: "Unity scripting for gameplay systems.",
    projects: ["indie-platformer"] },

  // Armor — frameworks & libraries
  { id: "react", name: "React", sigil: "Re", category: "armor",
    lore: "Component-driven web front ends, including the Toro Campus Connect web client.",
    projects: ["toro-campus-connect"] },
  { id: "react-native", name: "React Native", sigil: "RN", category: "armor",
    lore: "Cross-platform mobile app for Toro Campus Connect.",
    projects: ["toro-campus-connect"] },
  { id: "nextjs", name: "Next.js", sigil: "N", category: "armor",
    lore: "App Router, server components and Vercel deployment. This portfolio is built with it." },
  { id: "expo", name: "Expo", sigil: "Ex", category: "armor",
    lore: "Mobile builds and device testing with Expo Go for the capstone's mobile beta.",
    projects: ["toro-campus-connect"] },
  { id: "flask", name: "Flask", sigil: "Fl", category: "armor",
    lore: "Python web framework behind the hotel booking platform's routing and backend logic.",
    projects: ["hotel-ocean-vista"] },
  { id: "rest", name: "REST APIs", sigil: "API", category: "armor",
    lore: "Designing and consuming HTTP APIs, such as the capstone's Events API.",
    projects: ["toro-campus-connect", "hotel-ocean-vista"] },
  { id: "ffmpeg", name: "FFmpeg", sigil: "ff", category: "armor",
    lore: "Batch transcoding, proxies, thumbnails and watermarking in post-production tools.",
    projects: ["pipeline-tools"], courses: ["COMP 467"] },
  { id: "argparse", name: "argparse", sigil: "--", category: "armor",
    lore: "Clean, documented command-line interfaces for Python tooling.",
    projects: ["pipeline-tools"] },
  { id: "react-flow", name: "React Flow", sigil: "RF", category: "armor",
    lore: "Node-based, interactive diagram interfaces in React." },

  // Relics — data, cloud & infrastructure
  { id: "aws", name: "AWS", sigil: "AWS", category: "relics",
    lore: "Cloud database backend for the hotel app and S3 media storage for the capstone.",
    projects: ["hotel-ocean-vista", "toro-campus-connect"] },
  { id: "postgres", name: "PostgreSQL", sigil: "Pg", category: "relics",
    lore: "Relational database, the engine underneath Supabase.",
    projects: ["toro-campus-connect"], courses: ["COMP 440"] },
  { id: "mssql", name: "MS SQL Server", sigil: "MS", category: "relics",
    lore: "Microsoft's relational database: schemas, queries and T-SQL.",
    courses: ["COMP 440"] },
  { id: "supabase", name: "Supabase", sigil: "Sb", category: "relics",
    lore: "Postgres-backed data layer for Toro Campus Connect.",
    projects: ["toro-campus-connect"] },
  { id: "docker", name: "Docker", sigil: "Dk", category: "relics",
    lore: "Containerized services so the whole team runs the same stack.",
    projects: ["toro-campus-connect"] },
  { id: "git", name: "Git / GitHub", sigil: "git", category: "relics",
    lore: "Branching and multi-repo collaboration on a seven-person team.",
    projects: ["toro-campus-connect", "hotel-ocean-vista"] },
  { id: "linux", name: "Linux", sigil: "$_", category: "relics",
    lore: "Shell, processes and system tooling, from the OS lab to Kali.",
    courses: ["COMP 322", "COMP 324"] },
  { id: "vercel", name: "Vercel", sigil: "▲", category: "relics",
    lore: "Front-end hosting and preview deployments. This site ships on it." },

  // Alchemy — AI, data & security
  { id: "llm", name: "LLM Deployment", sigil: "AI", category: "alchemy",
    lore: "Deploying language models via Hugging Face. Powered the hotel app's booking chatbot.",
    projects: ["hotel-ocean-vista"] },
  { id: "data-mining", name: "Data Mining", sigil: "DM", category: "alchemy",
    lore: "Classification, clustering and pattern discovery on real datasets.",
    courses: ["COMP 541", "MATH 340"] },
  { id: "kali", name: "Kali Linux", sigil: "Ka", category: "alchemy",
    lore: "Security tooling for exploring network defenses and vulnerabilities.",
    courses: ["COMP 324"] },
  { id: "netsec", name: "Network Security", sigil: "///", category: "alchemy",
    lore: "Network protocols, cryptography, authentication and the threats against them.",
    courses: ["COMP 324"] },

  // Tools — design, game & workflow
  { id: "figma", name: "Figma", sigil: "Fg", category: "tools",
    lore: "Wireframes, prototypes and usability-tested interface design.",
    courses: ["COMP 485"] },
  { id: "roblox", name: "Roblox Studio", sigil: "Rb", category: "tools",
    lore: "Game development on Roblox for Quickdraw Wildlands.",
    projects: ["quickdraw-wildlands"] },
  { id: "unity", name: "Unity", sigil: "U", category: "tools",
    lore: "Game engine for the 2D platformer: systems, levels and asset integration.",
    projects: ["indie-platformer"] },
  { id: "blender", name: "Blender", sigil: "Bl", category: "tools",
    lore: "3D modeling for games and interactive scenes." },
  { id: "photoshop", name: "Photoshop / GIMP", sigil: "Ps", category: "tools",
    lore: "More than ten years of digital art. Textures, assets and art direction.",
    projects: ["indie-platformer"] },
  { id: "vscode", name: "VS Code", sigil: "{}", category: "tools",
    lore: "Home base for every project in the Archives." },
  { id: "gsuite", name: "Google Workspace", sigil: "G", category: "tools",
    lore: "Docs, spreadsheets and team coordination." },
];
