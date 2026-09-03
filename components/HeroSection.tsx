"use client";

import { useContentStore } from "@/components/ContentProvider";
import EditableText from "@/components/EditableText";
import type { HeroSectionData } from "@/lib/content";

export default function HeroSection({ sectionId }: { sectionId: string }) {
  const { content, updateContent } = useContentStore();
  const section = content.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== "hero") return null;
  const data = section.data;

  const patch = (partial: Partial<HeroSectionData>) => {
    updateContent((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId && s.type === "hero" ? { ...s, data: { ...s.data, ...partial } } : s
      ),
    }));
  };

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-6 pt-12 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <EditableText
          as="span"
          className="font-mono text-xs uppercase tracking-widest text-[#d4a373]"
          value={data.eyebrow}
          onChange={(v) => patch({ eyebrow: v })}
        />
        <EditableText
          as="h2"
          className="block text-4xl leading-tight transition hover:text-[#d4a373]"
          value={data.heading}
          onChange={(v) => patch({ heading: v })}
        />
        <EditableText
          as="p"
          className="leading-relaxed text-[#a89f91]"
          value={data.body}
          onChange={(v) => patch({ body: v })}
          multiline
        />
        <div className="flex items-center gap-2 pt-2 font-mono text-xs text-[#d4a373]">
          <EditableText value={data.readTime} onChange={(v) => patch({ readTime: v })} />
          <span>&bull;</span>
          <EditableText
            as="span"
            className="cursor-pointer underline"
            value={data.readLinkLabel}
            onChange={(v) => patch({ readLinkLabel: v })}
          />
        </div>
      </div>
      <aside className="hidden border-l border-[#2e2724] pl-6 md:block">
        <EditableText
          as="h3"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-[#d4a373]"
          value={data.sidebarTitle}
          onChange={(v) => patch({ sidebarTitle: v })}
        />
        <EditableText
          as="p"
          className="text-sm leading-relaxed text-[#eaddca]"
          value={data.sidebarBody}
          onChange={(v) => patch({ sidebarBody: v })}
          multiline
        />
      </aside>
    </section>
  );
}
