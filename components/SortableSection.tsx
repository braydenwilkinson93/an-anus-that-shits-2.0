"use client";

import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContentStore } from "@/components/ContentProvider";

export default function SortableSection({
  id,
  height,
  onHeightChange,
  children,
}: {
  id: string;
  height: number | null;
  onHeightChange: (next: number | null) => void;
  children: React.ReactNode;
}) {
  const { editMode } = useContentStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const resizing = useRef<{ startY: number; startHeight: number } | null>(null);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    minHeight: height ?? undefined,
    position: "relative",
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    const el = (e.currentTarget as HTMLElement).parentElement;
    const startHeight = el?.getBoundingClientRect().height ?? 0;
    resizing.current = { startY: e.clientY, startHeight };

    const handleMove = (moveEvent: PointerEvent) => {
      if (!resizing.current) return;
      const delta = moveEvent.clientY - resizing.current.startY;
      const next = Math.max(120, Math.round(resizing.current.startHeight + delta));
      onHeightChange(next);
    };
    const handleUp = () => {
      resizing.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  if (!editMode) {
    return <div style={height ? { minHeight: height } : undefined}>{children}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="group/section">
      <div className="pointer-events-none absolute inset-0 z-10 rounded outline outline-1 outline-dashed outline-[#d4a373]/0 group-hover/section:outline-[#d4a373]/50 transition" />
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-1/2 z-20 -translate-y-1/2 cursor-grab select-none rounded bg-[#d4a373] px-1.5 py-3 font-mono text-[10px] leading-none text-black opacity-0 shadow-lg group-hover/section:opacity-100 active:cursor-grabbing"
        title="Drag to reorder section"
      >
        ⠿
      </div>
      {height && (
        <button
          type="button"
          onClick={() => onHeightChange(null)}
          className="absolute right-3 top-3 z-20 rounded bg-[#1c1817] px-2 py-1 font-mono text-[10px] text-[#d4a373] opacity-0 shadow-lg group-hover/section:opacity-100"
          title="Reset section height to automatic"
        >
          Reset height
        </button>
      )}
      {children}
      <div
        onPointerDown={handleResizeStart}
        className="absolute bottom-0 left-0 right-0 z-20 flex h-2 cursor-ns-resize items-center justify-center opacity-0 group-hover/section:opacity-100"
        title="Drag to resize section"
      >
        <div className="h-1 w-24 rounded-full bg-[#d4a373]" />
      </div>
    </div>
  );
}
