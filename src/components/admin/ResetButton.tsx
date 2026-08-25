"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ResetButton({
  label,
  description,
  onConfirm,
}: {
  label: string;
  description: string;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        className="border-red-400/30 text-red-400 hover:bg-red-500/10"
      >
        {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} className="max-w-sm">
        <h2 className="text-lg font-medium text-foreground">{label}?</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={busy}
            className="bg-red-500 text-white hover:bg-red-400"
          >
            {busy ? "Reimposto…" : "Reimposta"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
