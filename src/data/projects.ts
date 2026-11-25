// The Archives. Featured projects get a full dossier; "lesser works" appear in
// a compact ledger below. Add a project by appending an object here.
//
// TODO(owner): ComboCraft and Quickdraw Wildlands have no public repo or
// write-up yet, so their entries only say what is known. Fill in `timeframe`,
// `role`, `overview`, `highlights`, `stack` and `links` when you can.
// TODO(owner): add screenshots by placing files in /public/images/projects and
// listing them in `images`. The dossier shows a gallery when any exist.

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  numeral: string;
  title: string;
  category: string;
  timeframe?: string;
  role?: string;
  team?: string;
  course?: string;
  award?: string;
  summary: string;
  overview: string[];
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  images?: { src: string; alt: string; width: number; height: number }[];
  emblem: string;
};

export const projects: Project[] = [
  {
    id: "toro-campus-connect",
    numeral: "I",
    title: "Toro Campus Connect",
    category: "Senior Capstone · Web + Mobile",
    timeframe: "2025 — 2026",
    role: "Full-stack developer",
    team: "7 engineers",
    course: "COMP 490 / 491",
    award: "1st Place — CSUN Senior Project Showcase 2026",
    summary:
      "A unified, mobile-first hub for the CSUN community: social features plus a degree planner that tailors itself to each student's roadmap.",
    overview: [
      "Toro Campus Connect consolidates the scattered tools students rely on into one trusted, mobile-first experience. It pairs a student social network with integrated academic features.",
      "Its degree planner reduces the stress of scheduling and course planning by adapting dynamically to each student's studies, based on the university's degree-roadmap structure.",
      "Built over a year-long capstone with a seven-person team across web, backend and mobile repositories, it took first place at the 2026 Senior Project Showcase as the department winner for oral presentation.",
    ],
    highlights: [
      "Full-stack contributor across the web client, server and Expo mobile app",
      "Degree planner that maps students to the college's roadmap structure",
      "Team milestones: an expanded Events API, AWS S3 media storage and a mobile beta",
      "Containerized services with Docker, backed by Supabase",
    ],
    stack: ["React", "React Native", "Expo", "Supabase", "Docker", "AWS S3", "REST API"],
    links: [
      { label: "Project hub", href: "https://github.com/Gloom-Eiji/Toro_CampusConnect" },
      { label: "Web client", href: "https://github.com/CSUN-Campus-Connect/campus-connect-client" },
      { label: "Server", href: "https://github.com/CSUN-Campus-Connect/campus-connect-server" },
      { label: "Mobile (Expo)", href: "https://github.com/CSUN-Campus-Connect/campus-connect-expo" },
    ],
    emblem: String.raw`
         |>>>              |>>>
         |                 |
     _  _|_  _         _  _|_  _
    |;|_|;|_|;|       |;|_|;|_|;|
    \\.    .  /       \\.    .  /
     \\:  .  /_________\\:  .  /
      ||:   |_|_|_|_|_|_||:   |
      ||:  .|  ___ ___  ||:  .|
      ||:   | | + | + | ||:   |
      ||: , | |___|___| ||: , |
      ||:   |    ___    ||:   |
   ___||____|___|   |___||____|___`,
  },
  {
    id: "combocraft",
    numeral: "II",
    title: "ComboCraft",
    category: "Martial Arts · Fitness App",
    summary: "A martial arts and fitness application.",
    overview: [
      "ComboCraft is a martial arts and fitness application. It brings together my two worlds: building software, and training Muay Thai, Brazilian jiu-jitsu and boxing.",
    ],
    highlights: [],
    stack: [],
    links: [],
    emblem: String.raw`
          ____                     ____
        /'    '\                 /'    '\
       |  .--.  |   ~  ~  ~>  |  .--.  |
       |  |  |  |             |  |  |  |
       |  '--'  |             |  '--'  |
        \______/               \______/
         |____|                 |____|
    -----------------------------------------
      JAB  ->  CROSS  ->  HOOK  ->  KNEE`,
  },
  {
    id: "hotel-ocean-vista",
    numeral: "III",
    title: "Hotel Ocean Vista",
    category: "Team Project · Full-Stack Web",
    timeframe: "Feb — May 2025",
    role: "Full-stack developer",
    summary:
      "A Flask booking site for Hotel Ocean Vista with an AWS-backed database, an interactive 3D room viewer, and an LLM chatbot concierge.",
    overview: [
      "A hotel booking platform built on Flask with an AWS database backend, designed around better user retention, clearer navigation flow and easier-to-digest information.",
      "Guests can explore an interactive 3D model of a room in virtual space before booking, and ask an LLM-powered chatbot for help with reservations and local information.",
    ],
    highlights: [
      "Interactive 3D hotel-room viewer so guests can inspect rooms before booking",
      "LLM chatbot to facilitate bookings and answer questions about the area",
      "Backend routing, database logic and UI design",
    ],
    stack: ["Python", "Flask", "SQLAlchemy", "MySQL", "AWS", "Hugging Face", "LangChain", "pytest"],
    links: [{ label: "Repository", href: "https://github.com/AvniIsrani1/flask-hotel" }],
    emblem: String.raw`
              _______________
             /_______________\
            /  ___   ___   __ \
           |  |[_]| |[_]| |[_]|
           |  |___| |___| |___|
           |   ___   ___   ___ |
           |  |[_]| |[_]| |[_]|
           |  |___| |___| |___|
           |       _____       |
           |  o-+ |  |  |      |
      ~~   |      |  |  |      |   ~~
    ~~~~~~~|______|__|__|______|~~~~~~~`,
  },
  {
    id: "quickdraw-wildlands",
    numeral: "IV",
    title: "Quickdraw Wildlands",
    category: "Game Dev · Roblox",
    summary: "A game built on Roblox.",
    overview: ["Quickdraw Wildlands is a game I built on the Roblox platform."],
    highlights: [],
    stack: ["Roblox Studio"],
    links: [],
    emblem: String.raw`
           \   |   /
         --   (_)   --        __________
           /   |   \       __/          \__
       ,                 _/                \_
      | |  ,            |   W A N T E D     |
    __| |_| |           |    - - - - -      |
      | | __|  ,        |                   |
      | ||    | |       |___________________|
   ___|_|_____|_|______________________________`,
  },
];

// Smaller works for the ledger: course projects, tools and experiments.
export type LesserWork = {
  id: string;
  title: string;
  kind: string;
  when?: string;
  text: string;
  stack: string[];
  links: ProjectLink[];
};

export const lesserWorks: LesserWork[] = [
  {
    id: "frs-story",
    title: "FR-S Story",
    kind: "COMP 484 · Web",
    when: "2026",
    text: "A multi-page site about my 2013 Scion FR-S: the history of the 86 / FR-S / BRZ platform, my build journey, a photo gallery and a small visual novel.",
    stack: ["HTML", "CSS"],
    links: [
      { label: "Live", href: "https://gloom-eiji.github.io/484Project1/" },
      { label: "Repo", href: "https://github.com/Gloom-Eiji/484Project1" },
    ],
  },
  {
    id: "cs-sim",
    title: "My Little CS Amateur",
    kind: "COMP 484 · Browser game",
    when: "2026",
    text: "A virtual-pet sim of CS student life. Keep EJ fed, rested and happy while coding, gaming, working out and sending job applications.",
    stack: ["JavaScript", "HTML", "CSS"],
    links: [
      { label: "Live", href: "https://gloom-eiji.github.io/484_Project2.io/" },
      { label: "Repo", href: "https://github.com/Gloom-Eiji/484_Project2.io" },
    ],
  },
  {
    id: "map-quiz",
    title: "CSUN Map Quiz",
    kind: "COMP 484 · Maps",
    when: "2026",
    text: "A timed campus-geography quiz on the Google Maps API. Double-click the map to locate places around CSUN.",
    stack: ["JavaScript", "Google Maps API"],
    links: [{ label: "Repo", href: "https://github.com/Gloom-Eiji/484_Project5.io" }],
  },
  {
    id: "typeit",
    title: "typeit.",
    kind: "COMP 484 · Web app",
    when: "2026",
    text: "A timed typing test that tracks words per minute and errors, with a top-three leaderboard.",
    stack: ["JavaScript", "HTML", "CSS"],
    links: [
      { label: "Live", href: "https://gloom-eiji.github.io/484_Project4.io/" },
      { label: "Repo", href: "https://github.com/Gloom-Eiji/484_Project4.io" },
    ],
  },
  {
    id: "pipeline-tools",
    title: "Post-Production Pipeline Tools",
    kind: "COMP 467 · Automation",
    when: "2025",
    text: "Three Python CLI tools: FFmpeg proxies, thumbnails and watermarks; database-backed QA reporting; and frame-accurate Baselight marks exported to CSV/XLS with Vimeo thumbnails.",
    stack: ["Python", "FFmpeg", "argparse", "Vimeo API"],
    links: [],
  },
  {
    id: "indie-platformer",
    title: "Indie Platformer",
    kind: "Game dev · Unity",
    text: "A 2D platformer made with a small team. I was art director, producing the 2D assets, textures and animation, and worked on level design and asset integration.",
    stack: ["Unity", "C#", "Photoshop"],
    links: [],
  },
];

/** Resolves an id from either list, for cross-links from the Armory and Codex. */
export function findWork(id: string) {
  const p = projects.find((x) => x.id === id);
  if (p) return { title: p.title, featured: true as const };
  const w = lesserWorks.find((x) => x.id === id);
  if (w) return { title: w.title, featured: false as const };
  return null;
}

// "Oaths yet sworn": ambitions listed on the previous portfolio.
export const futureScope = [
  {
    kind: "Unity",
    title: "Co-op Physics Fighting Game",
    text: "Physics-driven combat for cooperative multiplayer, built on dynamic force- and collision-based fighting mechanics.",
  },
  {
    kind: "Unreal Engine",
    title: "Co-op Horror Game",
    text: "Objective-based cooperative progression with tension-focused level design and adaptive enemy AI that counters each player's style.",
  },
  {
    kind: "Venture · 1-year roadmap",
    title: "Martial Arts Athletic Wear",
    text: "An AI image-to-product pipeline for design generation, alongside supply chain, regulation and brand development.",
  },
];
