"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { it } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

// The admin is in Italian, so the calendar is too.
const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = "Select date", disabled, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? parseISO(value) : null;
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function openPicker() {
    if (disabled) return;
    setViewMonth(selectedDate ?? new Date());
    setOpen((v) => !v);
  }

  const gridStart = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-surface-wash px-4 text-left text-sm text-foreground outline-none transition-colors focus:border-accent disabled:opacity-40"
      >
        <span className={cn(!selectedDate && "text-muted-foreground")}>
          {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: it }) : placeholder}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-72 rounded-2xl border border-border bg-background-elevated p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMonth((m) => subMonths(m, 1))}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-wash hover:text-foreground"
                aria-label="Mese precedente"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-foreground">{format(viewMonth, "MMMM yyyy", { locale: it })}</span>
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-wash hover:text-foreground"
                aria-label="Mese successivo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const inMonth = isSameMonth(day, viewMonth);
                const selected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => {
                      onChange(format(day, "yyyy-MM-dd"));
                      setOpen(false);
                    }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors",
                      !inMonth && "text-muted-foreground/40 hover:bg-surface-wash",
                      inMonth && !selected && "text-foreground hover:bg-surface-wash-strong",
                      selected && "bg-accent text-white",
                      isToday(day) && !selected && "border border-accent/50",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Svuota
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  onChange(format(now, "yyyy-MM-dd"));
                  setViewMonth(now);
                  setOpen(false);
                }}
                className="text-xs font-medium text-accent transition-colors hover:text-foreground"
              >
                Oggi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
