"use client";

import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Drag-to-reorder for the admin lists.
 *
 * Ordering used to be a number you typed into each item's own form, which
 * meant holding the whole list in your head to work out what to type, and
 * discovering the result only after saving. Here the list is the control.
 *
 * Dragging is bound to a handle rather than the whole row: rows carry edit
 * and delete buttons, and a row that moves when you reach for one of them is
 * a row you can't use.
 */
interface SortableItemProps<T> {
  item: T;
  children: ReactNode;
  onCommit: () => void;
}

function SortableItem<T>({ item, children, onCommit }: SortableItemProps<T>) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      className="list-none"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Trascina per riordinare"
          onPointerDown={(event) => controls.start(event)}
          className="shrink-0 cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Reorder.Item>
  );
}

export function SortableList<T>({
  items,
  onReorder,
  onCommit,
  getKey,
  children,
  className,
}: {
  items: T[];
  /** Fires continuously while dragging, so the list follows the pointer. */
  onReorder: (items: T[]) => void;
  /** Fires once the item is dropped — where the new order gets saved. */
  onCommit: () => void;
  getKey: (item: T) => string;
  children: (item: T) => ReactNode;
  className?: string;
}) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className={cn("space-y-3", className)}>
      {items.map((item) => (
        <SortableItem key={getKey(item)} item={item} onCommit={onCommit}>
          {children(item)}
        </SortableItem>
      ))}
    </Reorder.Group>
  );
}
