// Personal details shown on the site. Sources: 2026 résumé, CSUN academic
// record, and the previous portfolio. Edit here; the UI reads from this file.

export const profile = {
  name: "Elijah Cortez",
  roles: ["Software Engineer", "Designer", "Builder"],
  location: "Los Angeles, CA",
  email: "elijahcortez2002@gmail.com",
  github: { label: "github.com/Gloom-Eiji", href: "https://github.com/Gloom-Eiji" },
  linkedin: {
    label: "linkedin.com/in/elijah-cortez",
    href: "https://www.linkedin.com/in/elijah-cortez-101143200",
  },
  resume: "/docs/Elijah_Cortez_Resume.pdf",
  // TODO(owner): set to something like "Open to full-time SWE roles" to show
  // an availability line in the hero and contact sections. Hidden while null.
  availability: null as string | null,

  degree: {
    school: "California State University, Northridge",
    short: "CSUN",
    title: "B.S. Computer Science",
    conferred: "May 2026",
    span: "2022 — 2026",
  },
  honors: ["Dean's List · Fall 2024", "Dean's List · Fall 2025"],
  award: {
    title: "Senior Project Showcase — 1st Place",
    detail: "2026 Department Winner for Oral Presentation",
    by: "CSUN College of Engineering & Computer Science",
  },
  work: {
    org: "AMC Theatres",
    place: "Canoga Park, CA",
    role: "Crew Lead",
    span: "June 2022 — Present",
    summary:
      "Application help-desk support, device troubleshooting, account management, and training newly onboarded crew while keeping a professional standard of customer service.",
  },
} as const;

export type TimelineEntry = { when: string; what: string; note?: string };

// The "quest log". Dates come straight from the résumé and academic record.
export const timeline: TimelineEntry[] = [
  { when: "2020", what: "Begins computer science foundations", note: "Los Angeles Pierce College & LACCD transfer coursework" },
  { when: "Jun 2022", what: "Crew Lead, AMC Theatres", note: "Help desk, troubleshooting, onboarding & training" },
  { when: "Fall 2024", what: "Dean's List", note: "Operating Systems, Discrete Structures" },
  { when: "Spring 2025", what: "Hotel Ocean Vista", note: "Flask, AWS, 3D room viewer, LLM concierge" },
  { when: "Fall 2025", what: "Dean's List", note: "Networks & Security, Multimedia Systems, Senior Project I" },
  { when: "Spring 2026", what: "Senior Project Showcase — 1st Place", note: "Toro Campus Connect" },
  { when: "May 2026", what: "B.S. Computer Science conferred", note: "California State University, Northridge" },
];

// Life outside development, shown in the Codex under "When the forge cools".
export type Pursuit = {
  id: "studio" | "garage" | "arena" | "hall";
  title: string;
  label: string;
  items: string[];
  note: string;
  link?: { label: string; href: string };
};

export const pursuits: Pursuit[] = [
  {
    id: "studio",
    title: "The Studio",
    label: "Art",
    items: ["Digital art", "Pencil & paint", "Tattooing"],
    note: "More than ten years of digital art, alongside traditional pencil and paint, and tattoo work.",
  },
  {
    id: "garage",
    title: "The Garage",
    label: "Cars",
    items: ["JDM culture", "2013 Scion FR-S", "Wrenching"],
    note: "I own and work on a 2013 Scion FR-S. It's lightweight, manual and honest.",
    link: { label: "Read the FR-S story", href: "https://gloom-eiji.github.io/484Project1/" },
  },
  {
    id: "arena",
    title: "The Arena",
    label: "Games",
    items: ["RPGs", "FPS", "Dark Souls", "Apex Legends"],
    note: "Mostly RPGs and shooters. Dark Souls and Apex Legends are my favorites.",
  },
  {
    id: "hall",
    title: "The Training Hall",
    label: "Training",
    items: ["Muay Thai", "Brazilian jiu-jitsu", "Boxing", "Bodybuilding", "Hiking"],
    note: "I train striking and grappling, including traditional American boxing, and I lift and hike.",
  },
];
