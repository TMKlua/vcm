export interface ClubInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: { venue: string; street: string; city: string; postalCode: string };
  contact: { person: string; phone: string; email: string };
  schedule: string;
  logo?: string;
  socials: { facebook?: string; instagram?: string; website?: string; clubeo?: string };
}

export interface Stat { value: number; suffix?: string; label: string }

export interface Team {
  slug: string;
  name: string;
  category: "baby" | "jeunes" | "loisir" | "competition" | "soft" | "sante" | "beach";
  shortDescription: string;
  description: string;
  objectives: string[];
  schedule: string;
  image: string;
  ageRange?: string;
}

export interface NewsArticle {
  slug: string; title: string; excerpt: string; content: string[];
  date: string; category: string; image: string; author?: string;
}

export interface ClubEvent { id: string; title: string; date: string; location: string; description: string; image: string }

export interface Partner { name: string; logo: string; url?: string; tier: "principal" | "officiel" | "institutionnel" }

export interface GalleryImage { src: string; alt: string; width: number; height: number; category: string }

export interface FaqItem { question: string; answer: string }

export interface TimelineEntry { year: string; title: string; description: string }

export interface NavLink { label: string; href: string; children?: NavLink[] }
