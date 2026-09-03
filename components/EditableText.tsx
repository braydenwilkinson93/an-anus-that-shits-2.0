"use client";

import { useContentStore } from "@/components/ContentProvider";

type EditableTextProps = {
  value: string;
  onChange: (next: string) => void;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
};

export default function EditableText({
  value,
  onChange,
  as = "span",
  className,
  multiline = false,
}: EditableTextProps) {
  const { editMode } = useContentStore();
  const Tag = as as React.ElementType;

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const next = e.currentTarget.textContent ?? "";
    if (next !== value) onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      className={`${className ?? ""} outline-dashed outline-1 outline-[#d4a373]/60 outline-offset-2 rounded-sm cursor-text hover:bg-[#d4a373]/10 focus:bg-[#d4a373]/10 focus:outline-[#d4a373] transition`}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {value}
    </Tag>
  );
}
