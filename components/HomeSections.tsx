"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useContentStore } from "@/components/ContentProvider";
import SortableSection from "@/components/SortableSection";
import HeroSection from "@/components/HeroSection";
import BookCarousel from "@/components/BookCarousel";

export default function HomeSections() {
  const { content, updateContent } = useContentStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const sections = [...content.sections].sort((a, b) => a.order - b.order);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    updateContent((d) => {
      const ordered = [...d.sections].sort((a, b) => a.order - b.order);
      const ids = ordered.map((s) => s.id);
      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      const moved = arrayMove(ordered, oldIndex, newIndex);
      const withOrder = moved.map((s, i) => ({ ...s, order: i }));
      return { ...d, sections: withOrder };
    });
  };

  const handleHeightChange = (id: string, next: number | null) => {
    updateContent((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, height: next } : s)),
    }));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSection
            key={section.id}
            id={section.id}
            height={section.height}
            onHeightChange={(h) => handleHeightChange(section.id, h)}
          >
            {section.type === "hero" && <HeroSection sectionId={section.id} />}
            {section.type === "bookCarousel" && <BookCarousel sectionId={section.id} />}
          </SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  );
}
