"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useContentStore } from "@/components/ContentProvider";
import EditableText from "@/components/EditableText";
import type { Book } from "@/lib/content";

type BookModalProps = {
  book: Book | null;
  onClose: () => void;
};

const STATUS_OPTIONS: Book["status"][] = ["Completed", "In Progress", "Upcoming"];

export default function BookModal({ book, onClose }: BookModalProps) {
  const { editMode, updateContent } = useContentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!book) return null;

  const patch = (partial: Partial<Book>) => {
    updateContent((d) => ({
      ...d,
      books: d.books.map((b) => (b.id === book.id ? { ...b, ...partial } : b)),
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bookId", String(book.id));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const result = await res.json();
      if (res.ok) {
        patch({ coverImage: result.path });
      } else {
        alert(result.error ?? "Upload failed");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[#3a302a] bg-[#141211] p-6 text-[#f4f1de] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-xs uppercase tracking-widest text-[#a89f91] hover:text-[#d4a373]"
          type="button"
          onClick={onClose}
        >
          [ Close ]
        </button>
        <div className="mt-2 flex flex-col gap-6 md:flex-row">
          <div className="relative flex h-48 w-32 flex-shrink-0 items-center justify-center overflow-hidden border border-[#3a302a] bg-[#241f1c] p-2 text-center">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={`${book.title} cover`} fill className="object-cover" />
            ) : (
              <span className="text-xs italic text-[#a89f91]">{book.title}</span>
            )}
            {editMode && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-x-0 bottom-0 bg-black/70 py-1 font-mono text-[10px] uppercase text-[#d4a373] hover:bg-black/90"
              >
                {uploading ? "Uploading…" : "Replace cover"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#d4a373]">
              <span>Vol. {book.id.toString().padStart(2, "0")}</span>
              <span aria-hidden="true">&bull;</span>
              {editMode ? (
                <select
                  value={book.status}
                  onChange={(e) => patch({ status: e.target.value as Book["status"] })}
                  className="rounded border border-[#3a302a] bg-[#1c1817] px-1 py-0.5 text-xs text-[#d4a373]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={book.status === "Completed" ? "text-emerald-400" : "text-amber-500"}>
                  {book.status}
                </span>
              )}
            </div>
            <EditableText
              as="h2"
              className="mt-1 block font-serif text-2xl"
              value={book.title}
              onChange={(v) => patch({ title: v })}
            />
            <EditableText
              as="p"
              className="mb-4 block text-sm text-[#a89f91]"
              value={book.author}
              onChange={(v) => patch({ author: v })}
            />
            <div className="mt-2 space-y-3 border-t border-[#2e2724] pt-4">
              <h3 className="text-xs uppercase tracking-widest text-[#d4a373]">Critique &amp; Essay Notes</h3>
              <EditableText
                as="p"
                className="block font-serif text-sm leading-relaxed text-[#eaddca]"
                value={book.fullReview}
                onChange={(v) => patch({ fullReview: v })}
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
