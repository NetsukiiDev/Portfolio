"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { useToast } from "@/context/ToastContext";
import type { Tool } from "@/types";
import type { ToolsSettings } from "@/types/settings";

const DISPLAY_OPTIONS = [
  { value: "auto", label: "Automatico" },
  { value: "grid", label: "Sempre fissi" },
  { value: "marquee", label: "Sempre a scorrimento" },
];

const EMPTY: Omit<Tool, "id"> = { name: "", image: "", url: null, order: 0, visible: true };

export function ToolsManager({ tools: initial, settings }: { tools: Tool[]; settings: ToolsSettings }) {
  const router = useRouter();
  const toast = useToast();
  const [tools, setTools] = useState(initial);
  const [display, setDisplay] = useState(settings.display);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [draft, setDraft] = useState<Omit<Tool, "id">>(EMPTY);
  const [modalOpen, setModalOpen] = useState(false);

  const shown = tools.filter((tool) => tool.visible).length;

  function openNew() {
    setEditing(null);
    setDraft({ ...EMPTY, order: tools.length });
    setModalOpen(true);
  }

  function openEdit(tool: Tool) {
    setEditing(tool);
    setDraft({ name: tool.name, image: tool.image, url: tool.url, order: tool.order, visible: tool.visible });
    setModalOpen(true);
  }

  async function saveDisplay(next: ToolsSettings["display"]) {
    setDisplay(next);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Only this slice — the API merges it into what's stored.
        body: JSON.stringify({ tools: { display: next } }),
      });
      if (!res.ok) throw new Error("Request failed");
      router.refresh();
    } catch {
      toast.error("Salvataggio non riuscito");
    }
  }

  async function submit() {
    if (!draft.name.trim()) {
      toast.error("Manca il nome");
      return;
    }
    try {
      const res = await fetch(editing ? `/api/tools/${editing.id}` : "/api/tools", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Request failed");
      const saved = (await res.json()) as Tool;

      setTools((prev) => (editing ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved]));
      toast.success(editing ? "Strumento aggiornato" : "Strumento aggiunto");
      setModalOpen(false);
      router.refresh();
    } catch {
      toast.error("Qualcosa è andato storto");
    }
  }

  async function toggleVisible(tool: Tool, visible: boolean) {
    setTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, visible } : t)));
    try {
      await fetch(`/api/tools/${tool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible }),
      });
      router.refresh();
    } catch {
      toast.error("Qualcosa è andato storto");
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tools/${id}`, { method: "DELETE" });
    setTools((prev) => prev.filter((tool) => tool.id !== id));
    toast.success("Strumento eliminato");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Come vengono mostrati</label>
          <Select
            value={display}
            onChange={(value) => saveDisplay(value as ToolsSettings["display"])}
            options={DISPLAY_OPTIONS}
            className="max-w-xs"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {display === "auto"
              ? "Fermi finché sono pochi; oltre gli otto visibili scorrono da soli. Al momento ne hai " +
                shown +
                " visibili."
              : display === "grid"
                ? "Sempre fermi, disposti su più righe."
                : "Sempre a scorrimento continuo, anche se sono pochi."}
          </p>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tools.length === 0
            ? "Nessuno strumento."
            : `${tools.length} in elenco, ${shown} mostrati sul sito.`}
        </p>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Nuovo strumento
        </Button>
      </div>

      <div className="space-y-3">
        {[...tools]
          .sort((a, b) => a.order - b.order)
          .map((tool) => (
            <Card key={tool.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-white/[0.03]">
                  <ImageWithFallback src={tool.image} alt="" fill className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{tool.name}</p>
                  {tool.url && <p className="truncate text-xs text-muted-foreground">{tool.url}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Toggle
                  checked={tool.visible}
                  onChange={(checked) => toggleVisible(tool, checked)}
                  label={tool.visible ? "Mostrato" : "Nascosto"}
                />
                <button
                  type="button"
                  onClick={() => openEdit(tool)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <DeleteButton onConfirm={() => handleDelete(tool.id)} label="lo strumento" />
              </div>
            </Card>
          ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-medium text-foreground">
          {editing ? "Modifica strumento" : "Nuovo strumento"}
        </h2>
        <div className="mt-6 space-y-4">
          <ImageUploadField
            value={draft.image}
            onChange={(url) => setDraft((prev) => ({ ...prev, image: url }))}
            folder="tools"
            label="Logo"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Nome</label>
            <Input
              placeholder="TypeScript"
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Sito ufficiale <span className="text-muted-foreground">(opzionale)</span>
            </label>
            <Input
              placeholder="https://…"
              value={draft.url ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value || null }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Ordine</label>
            <Input
              type="number"
              value={draft.order}
              onChange={(e) => setDraft((prev) => ({ ...prev, order: Number(e.target.value) }))}
            />
          </div>
          <Toggle
            checked={draft.visible}
            onChange={(checked) => setDraft((prev) => ({ ...prev, visible: checked }))}
            label="Mostra sul sito"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Annulla
            </Button>
            <Button type="button" onClick={submit}>
              Salva
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
