"use client";

import { Reorder, useDragControls } from "framer-motion";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Drag-to-reorder for the admin lists.
 *
 * Ordering used to be a number you typed into each item's own form, which
 * meant holding the whole list in your head to work out what to type, and
 * discovering the result only after saving. Here the list is the control.
 *
 * The handle is handed to the row to place inside itself rather than drawn
 * beside it, so the card stays one object. Dragging is bound to that handle
 * and not the whole row: rows carry edit and delete buttons, and a row that
 * moves when you reach for one of them is a row you can't use.
 */
function SortableItem<T>({
  item,
  children,
  onCommit,
}: {
  item: T;
  children: (handle: ReactNode) => ReactNode;
  onCommit: () => void;
}) {
  const controls = useDragControls();

  const handle = (
    <button
      type="button"
      aria-label="Trascina per riordinare"
      onPointerDown={(event) => controls.start(event)}
      className="-ml-1 shrink-0 cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:text-foreground active:cursor-grabbing"
    >
      <Menu className="h-4 w-4" />
    </button>
  );

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommit}
      className="list-none"
    >
      {children(handle)}
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
  /** Gets the drag handle to render somewhere inside the row. */
  children: (item: T, handle: ReactNode) => ReactNode;
  className?: string;
}) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className={cn("space-y-3", className)}>
      {items.map((item) => (
        <SortableItem key={getKey(item)} item={item} onCommit={onCommit}>
          {(handle) => children(item, handle)}
        </SortableItem>
      ))}
    </Reorder.Group>
  );
}
