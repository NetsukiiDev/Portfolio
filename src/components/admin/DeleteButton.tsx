"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function DeleteButton({ onConfirm, label = "item" }: { onConfirm: () => void | Promise<void>; label?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-red-400/40 hover:text-red-400"
        aria-label={`Delete ${label}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} className="max-w-sm">
        <h2 className="text-lg font-medium text-foreground">Delete {label}?</h2>
        <p className="mt-2 text-sm text-muted-foreground">This action can&apos;t be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={busy} className="bg-red-500 text-white hover:bg-red-400">
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
