// The Archives. Content is drawn from the résumé, the previous portfolio, and
// the public repositories. Add a project by appending an object here.
//
// TODO(owner): projects mentioned in the planning brief but not yet documented
// anywhere — add them here once details are confirmed:
//   - ComboCraft (martial arts / fitness application)
//   - Campus navigation concepts
//   - AI / ML or cybersecurity work beyond what is listed below
// TODO(owner): add screenshots by placing files in /public/images/projects and
// listing them in `images` — the dossier shows a gallery when any exist.

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
    id: "hotel-booking",
    numeral: "II",
    title: "Hotel Booking Web App",
    category: "Team Project · Full-Stack",
    timeframe: "Feb — May 2025",
    role: "Full-stack developer",
    summary:
      "A Flask booking platform with an AWS-backed database, an interactive 3D room viewer, and an LLM chatbot concierge.",
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
           |      |  |  |      |
       ____|______|__|__|______|____`,
  },
  {
    id: "pipeline-tools",
    numeral: "III",
    title: "Post-Production Pipeline Tools",
    category: "Automation · Multimedia Systems",
    timeframe: "Aug — Dec 2025",
    course: "COMP 467",
    summary:
      "Three Python command-line tools that automate real post-production workflows: proxies and metadata, QA reporting, and frame-accurate marks.",
    overview: [
      "A suite of Python CLI tools built for Multimedia Systems, modeled on the workflows of professional post-production and VFX houses.",
      "VFX Tools Script — automated metadata handling and proxy/thumbnail generation with argparse-driven CLI parsing and batch FFmpeg processing, plus custom watermarking to speed up editorial requests.",
      "QA Automation Script — populates a database with global QA reports, mirroring enterprise QA workflows end to end and generating blocker, repeat-issue and per-user reports.",
      "Marks Automation Script — parses proprietary Baselight machine data to resolve frame positions and filesystem paths in seconds, then exports CSV/XLS with timecode and Vimeo thumbnail previews.",
    ],
    highlights: [
      "Batch media processing with FFmpeg behind a clean argparse CLI",
      "Database-backed QA reporting that mirrors enterprise workflows",
      "Frame-level path resolution from Baselight data",
      "CSV / XLS exports with timecode and Vimeo API thumbnails",
    ],
    stack: ["Python", "FFmpeg", "argparse", "Database", "Vimeo API", "CSV / XLS"],
    links: [],
    emblem: String.raw`
        .-------------------------.
        | [] [] [] [] [] [] [] [] |
        |-------------------------|
        |  ffmpeg -i reel.mov \   |
        |    -vf scale=640:-1 \   |
        |    proxy_%04d.jpg       |
        |  > 00:01:12:04  OK      |
        |  > 00:01:12:05  OK      |
        |  > marks.xls   WRITTEN  |
        |-------------------------|
        | [] [] [] [] [] [] [] [] |
        '-------------------------'`,
  },
  {
    id: "indie-platformer",
    numeral: "IV",
    title: "Indie Platformer",
    category: "Game Dev · Unity",
    role: "Art director & 2D artist",
    team: "Small team",
    summary:
      "A 2D platformer built in Unity, where I directed the art and produced the textures, assets and animation.",
    overview: [
      "A Unity-based 2D platformer built with a small team.",
      "As art director I designed the 2D assets, textures and animations, and worked on gameplay systems, level design and integrating assets into the engine.",
    ],
    highlights: [
      "Art direction and visual identity for the game",
      "2D asset, texture and animation production",
      "Gameplay systems, level design and asset integration",
    ],
    stack: ["Unity", "C#", "Art Direction", "Level Design", "Photoshop"],
    links: [],
    emblem: String.raw`
                        *         .
          .     _o_          ___
               / | \  -->   |?? |
                /_\         |___|
          ______________
         |##|##|##|##|##|      ______
                              |##|##|
          ^^^^^           ____|##|##|
         |##|##|         |##|##|##|##|
    _____|##|##|_________|##|##|##|##|___`,
  },
];

// "Oaths yet sworn" — ambitions listed on the previous portfolio.
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
