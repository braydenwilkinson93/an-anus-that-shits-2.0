"use client";

import { useContentStore } from "@/components/ContentProvider";
import EditableText from "@/components/EditableText";

export default function SiteHeader() {
  const { content, updateContent } = useContentStore();
  const { site } = content;

  return (
    <header className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-b border-[#2e2724] px-6 py-6 md:flex-row">
      <div>
        <EditableText
          as="h1"
          className="text-3xl tracking-tight"
          value={site.title}
          onChange={(v) => updateContent((d) => ({ ...d, site: { ...d.site, title: v } }))}
        />
        <EditableText
          as="p"
          className="mt-1 font-mono text-xs uppercase tracking-widest text-[#a89f91]"
          value={site.tagline}
          onChange={(v) => updateContent((d) => ({ ...d, site: { ...d.site, tagline: v } }))}
        />
      </div>
      <a
        href={site.subscribeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#d4a373] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0a96d]"
      >
        <EditableText
          value={site.subscribeLabel}
          onChange={(v) => updateContent((d) => ({ ...d, site: { ...d.site, subscribeLabel: v } }))}
        />
      </a>
    </header>
  );
}
