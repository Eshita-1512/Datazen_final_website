import { ZENCONNECT_REGISTRATION_URL } from "@/config/registration";

export interface TimelineEventData {
  id: number;
  slug: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  isFlagship?: boolean;
  align: "left" | "right";
  image: string;
  fallbackGradient: string;
  location: string;
  registrationUrl?: string;
}

export const timelineEvents: TimelineEventData[] = [
  {
    id: 1,
    slug: "zenconnect-25",
    date: "3rd September 2025",
    title: "ZenConnect '25",
    description:
      "A sneak peek into the exciting realm of AI & Data with us. Meet the council, explore fun activities, get a roadmap on your data journey, and network at a university level.",
    tags: ["Networking", "Roadmap Session", "Fun Activities"],
    align: "left",
    image: "/images/zenconnect.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0505,#6b1010,#c0392b)",
    location: "Somaiya Vidyavihar University, Mumbai",
    registrationUrl: ZENCONNECT_REGISTRATION_URL,
  },
  {
    id: 2,
    slug: "data-trek",
    date: "13th to 19th October 2025",
    title: "Data Trek",
    description:
      "A week-long virtual trek exploring the latest trends in data science and AI, featuring guest speakers from industry leaders and hands-on workshops.",
    tags: ["7 Days", "Guest Speakers", "Workshops"],
    align: "right",
    image: "/images/datatrek.jpg",
    fallbackGradient: "linear-gradient(135deg,#050a1a,#102060,#1a5fbf)",
    location: "Online / Virtual",
  },
  {
    id: 3,
    slug: "case-study-competition",
    date: "31st January 2026",
    title: "Case Study Competition",
    description:
      "A competition where students analyze and visualize data using Tableau, showcasing their skills in data storytelling, analytical thinking, and impactful insights.",
    tags: ["Tableau", "Data Storytelling", "₹50,000 Prize"],
    align: "left",
    image: "/images/casestudy.jpg",
    fallbackGradient: "linear-gradient(135deg,#050e05,#1a4010,#3a8c1a)",
    location: "Somaiya Vidyavihar University, Mumbai",
  },
  {
    id: 4,
    slug: "datathon-2026",
    date: "7th & 8th February 2026",
    title: "Datathon 2026",
    description:
      "Our flagship 48-hour Data Science & AI/ML hackathon with a prize pool of over ₹2 Lakhs+ and a footfall of over 1,000+ students from top universities.",
    tags: ["48 Hours", "Prize Pool ₹2L+", "1000+ Students", "AI / ML"],
    isFlagship: true,
    align: "right",
    image: "/images/datathon.jpg",
    fallbackGradient: "linear-gradient(135deg,#1a0500,#7a1500,#c0392b)",
    location: "Somaiya Vidyavihar University, Mumbai",
  },
];

export function getEventBySlug(slug: string): TimelineEventData | undefined {
  return timelineEvents.find((event) => event.slug === slug);
}
