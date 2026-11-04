// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProjectCategory = "AI & Computer Vision" | "Full-Stack / Mobile" | "Systems";

export interface Project {
  title: string;
  /** 2 sentences: the problem solved + the architecture. */
  description: string;
  category: ProjectCategory;
  tech: string[];
  /** Path inside /public (e.g. "/projects/my-app.png") or a remote URL. GIFs work too. */
  image: string;
  imageAlt: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface TimelineItem {
  title: string;
  org: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

// ---------------------------------------------------------------------------
// Identity & links
// ---------------------------------------------------------------------------

export const profile = {
  name: "Lai Eu Wen", 
  monogram: "LAI", 
  role: "Software Engineer",
  location: "Petaling Jaya, MY", 
  email: "laieuwen05@gmail.com", 
  /** Used for the live GitHub section. Can be overridden by the GITHUB_USERNAME env var. */
  githubUsername: "LAIEUWEN", 
  siteUrl: "https://your-domain.vercel.app", 
  resumeUrl: "/RESUME1.pdf", // Replace /public/resume.pdf with your real resume
  /** Optional avatar in /public. Set to null to show the monogram instead. */
  avatar: null as string | null, // e.g. "/avatar.jpg"
  status: "Available for opportunities",
  socials: {
    github: "https://github.com/LAIEUWEN", 
    linkedin: "https://www.linkedin.com/in/lai-eu-wen-87020a2a9/", 
    whatsapp: "https://wa.me/60128222681?text=Hi%20Lai%20Eu%20Wen%2C%20it%27s%20a%20pleasure%20to%20meet%20you!",
  },
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const hero = {
  /** Words wrapped in *asterisks* are highlighted in crimson. */
  headline: "Software Engineer who loves building *applications & AI*.",
  subheadline:
    "I design and ship end-to-end software — from computer vision pipelines and backend services to interfaces people actually enjoy using.",
};

// ---------------------------------------------------------------------------
// About ("Me" bento grid)
// ---------------------------------------------------------------------------

export const about = {
  bio: [
    "I'm a software engineer who likes the challanges of a problem, creating applications real world users use and understanding and building AI systems.",
    "One of my favourite quotes is from a show called avatar the last airbender, 'You’re going to fail a lot before things work out, You have to try every time.",
    "Lately I've been focused on applied machine learning, computer vision, and full-stack products that put those models in people's hands.",
  ],
  quickFacts: [
    { label: "Based in", value: "Petaling Jaya, MY" }, 
    { label: "Focus", value: "AI · Full-Stack · Systems" },
    { label: "Currently", value: "Student" }, 
  ],
  skills: [
    { label: "Languages", items: ["TypeScript", "Python", "C++", "SQL"] },
    { label: "Frameworks", items: ["Next.js", "React", "React Native", "Node.js"] },
    { label: "AI / Data", items: ["PyTorch", "OpenCV", "scikit-learn", "Pandas"] },
    { label: "Tools", items: ["Docker", "PostgreSQL", "AWS", "Vercel", "Git"] },
  ] satisfies SkillGroup[],
  beyondTheCode: {
    intro: "When I'm away from coding, you'll usually find me:",
    hobbies: [
      { label: "Cooking " },
      { label: "Playing video games" },
      { label: "Watching movies or tv shows" },
      { label: "Eating" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "AI & Computer Vision",
  "Full-Stack / Mobile",
  "Systems",
];

export const projects: Project[] = [];

// Saved projects (uncomment and customize when ready):
/*
export const initialProjects: Project[] = [
  {
    title: "VisionSort",
    description:
      "Cut manual inspection time on a recycling line by 70% with real-time object detection. A YOLO model served via FastAPI streams detections over WebSockets to a React dashboard.",
    category: "AI & Computer Vision",
    tech: ["Python", "PyTorch", "YOLOv8", "FastAPI", "React"],
    image: "/projects/placeholder-1.svg",
    imageAlt: "VisionSort dashboard showing live bounding boxes on a conveyor belt",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/",
  },
  {
    title: "Pantry Pal",
    description:
      "A mobile app that turns a photo of your fridge into a week of recipes, reducing food waste. Built with React Native, a Next.js API layer, and a vision-language model for ingredient recognition.",
    category: "Full-Stack / Mobile",
    tech: ["React Native", "Next.js", "PostgreSQL", "OpenAI"],
    image: "/projects/placeholder-2.svg",
    imageAlt: "Pantry Pal app screens showing detected ingredients and recipe cards",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/",
  },
  {
    title: "Lattice KV",
    description:
      "A distributed key-value store that survives node failures without losing writes. Implements Raft consensus in Go with a gRPC interface and a chaos-testing harness.",
    category: "Systems",
    tech: ["Go", "gRPC", "Raft", "Docker"],
    image: "/projects/placeholder-3.svg",
    imageAlt: "Terminal output of Lattice KV cluster electing a new leader",
    repoUrl: "https://github.com/",
  },
  {
    title: "SignSpeak",
    description:
      "Translates sign-language fingerspelling into text in the browser to make video calls more accessible. Uses MediaPipe hand landmarks and a lightweight classifier running fully on-device with TensorFlow.js.",
    category: "AI & Computer Vision",
    tech: ["TensorFlow.js", "MediaPipe", "TypeScript"],
    image: "/projects/placeholder-4.svg",
    imageAlt: "SignSpeak web app recognising a hand gesture via webcam",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/",
  },
  {
    title: "Ledgerly",
    description:
      "Helps small shops track inventory and sales without spreadsheets. A Next.js App Router app with server actions, Prisma, and Stripe for payments.",
    category: "Full-Stack / Mobile",
    tech: ["Next.js", "Prisma", "Stripe", "Tailwind"],
    image: "/projects/placeholder-5.svg",
    imageAlt: "Ledgerly inventory dashboard with sales charts",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/",
  },
  {
    title: "tinyshell",
    description:
      "A POSIX-ish Unix shell written to deeply understand processes and signals. Supports pipes, redirection, job control, and a hand-rolled parser in C.",
    category: "Systems",
    tech: ["C", "Linux", "Make"],
    image: "/projects/placeholder-6.svg",
    imageAlt: "tinyshell running piped commands in a terminal",
    repoUrl: "https://github.com/",
  },
];
*/

// ---------------------------------------------------------------------------
// Resume timeline
// ---------------------------------------------------------------------------

export const resume = {
  experience: [
    {
      title: "Software Engineering Intern",
      org: "Vision Mission Cleaning", 
      period: "Jun 2025 — Sep 2025",
      location: "Kuala Lumpur, MY", 
      bullets: [
        "Shipped a contract management system.",
        "Improved and designed their website using WordPress.",
      ],
    },
    {
      title: "T-Shirt Designer",
      org: "Covenant Fightwear", 
      period: "Jan 2026 - August 2026",
      bullets: [
        "Designed their Rash Guards and pants",
      ],
    },
  ] satisfies TimelineItem[],
  education: [
    {
      title: "Diploma in Information Technology",
      org: "Sunway College", 
      period: "2024 — 2025",
      bullets: ["3.6 CGPA"],
    },
    {
      title: "B.Sc. Computer Science",
      org: "Sunway University", 
      period: "2025 — ongoing",
      bullets: ["CGPA 3.61 "],
    },
  ] satisfies TimelineItem[],
};

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const faq: FaqItem[] = [
  {
    question: "What kind of engineering problems excite you the most?",
    answer:
      "Problems are design efficiency, where optimization can be improved is a highlight as i get to see the system run beautifully.",
  },
  {
    question: "What is your preferred tech stack for building from scratch?",
    answer:
      "TypeScript + Next.js on Vercel for the product surface, Python (FastAPI + PyTorch) for anything ML, and PostgreSQL as the core. Tailwind for styling.",
  },
  {
    question: "Are you currently open to full-time roles, internships, or freelance work?",
    answer:
      "Yes! I'm actively looking for internship roles in software engineering and applied ML. The fastest way to reach me is the contact form below.",
  },
  {
    question: "How do you approach learning a new technology or framework?",
    answer:
      "I read the official docs or any articles and papers i can find, then build something small but real with it.",
  },
  {
    question: "What is your favourite food?",
    answer:
      "Why this is the most exciting question on the FAQ, the answer is anything potatoes. I love potatoes.",
  },
];

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contact = {
  headline: "Let's build something together.",
  blurb:
    "Got a role, a project, or just a wild idea? My inbox is open. I usually reply within a day or two.",
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Resume", href: "#resume" },
  { label: "FAQ", href: "#faq" },
];
