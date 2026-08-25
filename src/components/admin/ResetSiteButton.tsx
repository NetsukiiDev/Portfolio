"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

const CONFIRM_WORD = "REIMPOSTA";

export function ResetSiteButton() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset/site", { method: "POST" });
      if (!res.ok) {
        toast.error("Qualcosa è andato storto");
        setBusy(false);
        return;
      }
      router.push("/setup");
      router.refresh();
    } catch {
      toast.error("Qualcosa è andato storto");
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-red-500 text-white hover:bg-red-400"
      >
        Reimposta sito
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setConfirmText("");
        }}
        className="max-w-sm"
      >
        <h2 className="text-lg font-medium text-foreground">Reimposta l&apos;intero sito?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Elimina in modo permanente il database — tutti i contenuti, l&apos;account amministratore e le
          impostazioni — e riporta il sito alla configurazione iniziale. Verrai disconnesso e reindirizzato al
          setup. Questa azione non può essere annullata.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Digita <span className="font-medium text-foreground">{CONFIRM_WORD}</span> per confermare.
        </p>
        <Input
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder={CONFIRM_WORD}
          className="mt-2"
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setConfirmText("");
            }}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={busy || confirmText !== CONFIRM_WORD}
            className="bg-red-500 text-white hover:bg-red-400 disabled:opacity-40"
          >
            {busy ? "Reimposto…" : "Reimposta sito"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
