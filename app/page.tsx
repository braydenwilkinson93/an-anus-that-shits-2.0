import { readContent } from "@/lib/content";
import { ContentProvider } from "@/components/ContentProvider";
import SiteHeader from "@/components/SiteHeader";
import HomeSections from "@/components/HomeSections";
import AdminBar from "@/components/AdminBar";

// Content lives in data/content.json and can change at any time via the
// admin editor, so this page must be read fresh on every request rather
// than baked into a static build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();

  return (
    <ContentProvider initialContent={content}>
      <main className="min-h-screen bg-[#0f0d0e] font-serif text-[#f4f1de] selection:bg-[#d4a373] selection:text-black">
        <SiteHeader />
        <HomeSections />
        <AdminBar />
      </main>
    </ContentProvider>
  );
}
