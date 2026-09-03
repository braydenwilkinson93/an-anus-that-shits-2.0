import { promises as fs } from "fs";
import path from "path";

export type Book = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  status: "Completed" | "In Progress" | "Upcoming";
  fullReview: string;
};

export type HeroSectionData = {
  eyebrow: string;
  heading: string;
  body: string;
  readTime: string;
  readLinkLabel: string;
  sidebarTitle: string;
  sidebarBody: string;
};

export type CarouselSectionData = {
  eyebrow: string;
  heading: string;
  hint: string;
};

export type Section =
  | { id: string; type: "hero"; order: number; height: number | null; data: HeroSectionData }
  | { id: string; type: "bookCarousel"; order: number; height: number | null; data: CarouselSectionData };

export type SiteContent = {
  site: {
    title: string;
    tagline: string;
    subscribeLabel: string;
    subscribeUrl: string;
  };
  sections: Section[];
  books: Book[];
};

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
  // Basic shape validation so a malformed client payload can't corrupt the file.
  if (!content.site || !Array.isArray(content.sections) || !Array.isArray(content.books)) {
    throw new Error("Malformed content payload");
  }
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + "\n", "utf-8");
}
