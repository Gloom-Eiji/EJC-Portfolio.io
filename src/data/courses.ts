// Upper-division coursework from the CSUN academic record. Topic summaries
// describe what each course covers. Grades are intentionally omitted.

export type Domain = "data" | "security" | "systems" | "web" | "theory" | "engineering";

export const domains: Record<Domain, { label: string; school: string }> = {
  data: { label: "Data", school: "School of Ledgers" },
  security: { label: "Security", school: "School of Wards" },
  systems: { label: "Systems", school: "School of Iron" },
  web: { label: "Web & HCI", school: "School of Glass" },
  theory: { label: "Theory", school: "School of Runes" },
  engineering: { label: "Engineering", school: "School of the Forge" },
};

export type Course = {
  code: string;
  title: string;
  term: string;
  year: number;
  units: number;
  domain: Domain;
  topics: string;
  featured?: boolean;
  projects?: string[]; // project ids from projects.ts
};

export const terms = [
  "Fall 2023",
  "Spring 2024",
  "Fall 2024",
  "Spring 2025",
  "Fall 2025",
  "Spring 2026",
] as const;

export const courses: Course[] = [
  { code: "COMP 222", title: "Computer Organization", term: "Fall 2023", year: 2023, units: 3, domain: "systems",
    topics: "How software meets hardware: data representation, instruction sets, assembly, memory hierarchy and CPU design." },
  { code: "COMP 282", title: "Advanced Data Structures", term: "Fall 2023", year: 2023, units: 3, domain: "theory",
    topics: "Trees, heaps, hashing, graphs and their algorithms, with attention to complexity and implementation trade-offs." },
  { code: "COMP 333", title: "Concepts of Programming Languages", term: "Spring 2024", year: 2024, units: 3, domain: "theory",
    topics: "Paradigms side by side — imperative, functional, logic, object-oriented — plus syntax, semantics and type systems." },
  { code: "COMP 256", title: "Discrete Structures + Lab", term: "Fall 2024", year: 2024, units: 4, domain: "theory",
    topics: "Logic, proofs, sets, relations, combinatorics and graph theory — the mathematics underneath computing." },
  { code: "COMP 322", title: "Operating Systems + Lab", term: "Fall 2024", year: 2024, units: 4, domain: "systems", featured: true,
    topics: "Processes, threads, scheduling, synchronization, memory management and file systems, with hands-on systems programming in the lab." },
  { code: "COMP 310", title: "Automata, Languages & Computation", term: "Spring 2025", year: 2025, units: 3, domain: "theory",
    topics: "Finite automata, regular and context-free languages, Turing machines and the limits of computability." },
  { code: "COMP 380", title: "Software Engineering + Lab", term: "Spring 2025", year: 2025, units: 3, domain: "engineering", featured: true,
    topics: "Team-based software development: requirements, design, UML, testing, version control and iterative delivery." },
  { code: "MATH 340", title: "Probability & Statistics", term: "Spring 2025", year: 2025, units: 4, domain: "data",
    topics: "Probability models, random variables, distributions, estimation and hypothesis testing." },
  { code: "COMP 324", title: "Networks & Security", term: "Fall 2025", year: 2025, units: 3, domain: "security", featured: true,
    topics: "The network stack from link to application layer, plus the threats against it: cryptography, authentication, firewalls and secure protocols." },
  { code: "COMP 467", title: "Multimedia Systems", term: "Fall 2025", year: 2025, units: 3, domain: "engineering", featured: true,
    projects: ["pipeline-tools"],
    topics: "Media formats, codecs and production pipelines — automating post-production workflows with Python and FFmpeg." },
  { code: "COMP 485", title: "Human-Computer Interaction", term: "Fall 2025", year: 2025, units: 3, domain: "web",
    topics: "User-centered design: research, prototyping, usability testing and evaluating interfaces with real users." },
  { code: "COMP 490", title: "Senior Project I + Lab", term: "Fall 2025", year: 2025, units: 3, domain: "engineering", featured: true,
    projects: ["toro-campus-connect"],
    topics: "First half of a year-long team capstone: scoping, architecture, infrastructure and early feature delivery." },
  { code: "COMP 440", title: "Database Design", term: "Spring 2026", year: 2026, units: 3, domain: "data", featured: true,
    topics: "Relational modeling, ER diagrams, normalization, SQL, indexing, transactions and query processing." },
  { code: "COMP 482", title: "Algorithm Design", term: "Spring 2026", year: 2026, units: 3, domain: "theory",
    topics: "Greedy, divide-and-conquer, dynamic programming and network-flow techniques, with proofs of correctness and running time." },
  { code: "COMP 484", title: "Web Engineering I + Lab", term: "Spring 2026", year: 2026, units: 3, domain: "web", featured: true,
    topics: "Building for the web end to end: HTML, CSS, JavaScript, client–server architecture and deployment." },
  { code: "COMP 491", title: "Senior Project II + Lab", term: "Spring 2026", year: 2026, units: 3, domain: "engineering", featured: true,
    projects: ["toro-campus-connect"],
    topics: "Second half of the capstone: feature completion, mobile beta and final presentation — awarded 1st place at the 2026 showcase." },
  { code: "COMP 541", title: "Data Mining", term: "Spring 2026", year: 2026, units: 3, domain: "data", featured: true,
    topics: "Graduate-level course: classification, clustering, association rules and evaluating models on real datasets." },
];
