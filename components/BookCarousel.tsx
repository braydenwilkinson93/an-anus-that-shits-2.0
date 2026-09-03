"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useContentStore } from "@/components/ContentProvider";
import EditableText from "@/components/EditableText";
import BookModal from "@/components/BookModal";
import type { Book, CarouselSectionData } from "@/lib/content";

function BookCard({ book, onOpen }: { book: Book; onOpen: () => void }) {
  const { editMode, updateContent } = useContentStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `book-${book.id}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const removeBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Remove "${book.title}" from the shelf?`)) return;
    updateContent((d) => ({ ...d, books: d.books.filter((b) => b.id !== book.id) }));
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative w-40 flex-shrink-0">
      {editMode && (
        <>
          <div
            {...attributes}
            {...listeners}
            className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 cursor-grab select-none rounded bg-[#d4a373] px-2 py-0.5 font-mono text-[9px] text-black opacity-0 group-hover:opacity-100 active:cursor-grabbing"
          >
            drag
          </div>
          <button
            type="button"
            onClick={removeBook}
            className="absolute -right-2 -top-2 z-10 h-5 w-5 rounded-full bg-red-500 text-[10px] leading-5 text-white opacity-0 group-hover:opacity-100"
            title="Remove book"
          >
            ×
          </button>
        </>
      )}
      <button
        className="w-40 cursor-pointer text-left transition duration-300 hover:-translate-y-1"
        type="button"
        onClick={onOpen}
      >
        <div className="relative flex h-60 w-40 flex-col justify-between overflow-hidden border border-[#3a302a] bg-[#1c1817] shadow-lg group-hover:border-[#d4a373]">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center font-serif text-sm text-[#a89f91]">
              {book.title}
            </div>
          )}
          <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#d4a373]">
            Vol. {book.id.toString().padStart(2, "0")}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-center font-sans text-[11px] text-[#a89f91]">
          {book.author}
        </p>
      </button>
    </div>
  );
}

export default function BookCarousel({ sectionId }: { sectionId: string }) {
  const { content, updateContent, editMode } = useContentStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const section = content.sections.find((s) => s.id === sectionId);
  if (!section || section.type !== "bookCarousel") return null;
  const data = section.data;
  const selectedBook = content.books.find((b) => b.id === selectedId) ?? null;

  const patch = (partial: Partial<CarouselSectionData>) => {
    updateContent((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId && s.type === "bookCarousel" ? { ...s, data: { ...s.data, ...partial } } : s
      ),
    }));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    updateContent((d) => {
      const ids = d.books.map((b) => `book-${b.id}`);
      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      return { ...d, books: arrayMove(d.books, oldIndex, newIndex) };
    });
  };

  const addBook = () => {
    updateContent((d) => {
      const nextId = d.books.length ? Math.max(...d.books.map((b) => b.id)) + 1 : 1;
      return {
        ...d,
        books: [
          ...d.books,
          {
            id: nextId,
            title: "New Title",
            author: "Author Name",
            coverImage: "",
            status: "Upcoming",
            fullReview: "Add a review for this volume.",
          },
        ],
      };
    });
  };

  return (
    <section className="my-10 w-full border-y border-[#2e2724] bg-[#0a0909] py-8">
      <div className="mx-auto mb-4 flex max-w-6xl items-end justify-between px-4">
        <div>
          <EditableText
            as="span"
            className="font-mono text-xs uppercase tracking-widest text-[#d4a373]"
            value={data.eyebrow}
            onChange={(v) => patch({ eyebrow: v })}
          />
          <EditableText
            as="h2"
            className="mt-1 block font-serif text-xl text-[#f4f1de]"
            value={data.heading}
            onChange={(v) => patch({ heading: v })}
          />
        </div>
        <EditableText
          as="span"
          className="hidden font-mono text-xs text-[#a89f91] md:inline"
          value={data.hint}
          onChange={(v) => patch({ hint: v })}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={content.books.map((b) => `book-${b.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-4">
            {content.books.map((book) => (
              <BookCard key={book.id} book={book} onOpen={() => setSelectedId(book.id)} />
            ))}
            {editMode && (
              <button
                type="button"
                onClick={addBook}
                className="flex h-60 w-40 flex-shrink-0 items-center justify-center border border-dashed border-[#3a302a] font-mono text-xs text-[#a89f91] hover:border-[#d4a373] hover:text-[#d4a373]"
              >
                + Add Volume
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <BookModal book={selectedBook} onClose={() => setSelectedId(null)} />
    </section>
  );
}
