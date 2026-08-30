"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ToolLogo } from "@/components/tools/ToolLogo";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import type { ToolGroup, ToolIcon } from "@/lib/tools/catalogue";
import type { Tool } from "@/types";
import type { ToolsSettings } from "@/types/settings";

const DISPLAY_OPTIONS = [
  { value: "auto", label: "Automatico" },
  { value: "grid", label: "Sempre fissi" },
  { value: "marquee", label: "Sempre a scorrimento" },
];

/** A picked tool, paired with its catalogue icon when it has one. */
interface Picked extends Tool {
  icon: ToolIcon | null;
}

function labelOf(tool: Picked): string {
  return tool.icon?.title ?? tool.name ?? "—";
}

export function ToolsManager({
  tools: initial,
  catalogue,
  settings,
}: {
  tools: Tool[];
  catalogue: ToolGroup[];
  settings: ToolsSettings;
}) {
  const router = useRouter();
  const toast = useToast();

  const iconBySlug = useMemo(
    () => new Map(catalogue.flatMap((group) => group.icons).map((icon) => [icon.slug, icon])),
    [catalogue],
  );

  const [picked, setPicked] = useState<Picked[]>(() =>
    initial.map((tool) => ({ ...tool, icon: tool.slug ? (iconBySlug.get(tool.slug) ?? null) : null })),
  );
  const [display, setDisplay] = useState(settings.display);
  const [query, setQuery] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState({ name: "", image: "", url: "" });
  const [isSaving, setIsSaving] = useState(false);

  const pickedSlugs = new Set(picked.map((tool) => tool.slug).filter(Boolean));

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return catalogue;
    return catalogue
      .map((group) => ({
        ...group,
        icons: group.icons.filter((icon) => icon.title.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.icons.length > 0);
  }, [catalogue, query]);

  function toggle(icon: ToolIcon) {
    setPicked((prev) => {
      const existing = prev.find((tool) => tool.slug === icon.slug);
      if (existing) return prev.filter((tool) => tool.slug !== icon.slug);
      return [
        ...prev,
        { id: crypto.randomUUID(), slug: icon.slug, name: null, image: null, url: null, order: prev.length, icon },
      ];
    });
  }

  function move(index: number, by: number) {
    setPicked((prev) => {
      const next = [...prev];
      const target = index + by;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addCustom() {
    if (!custom.name.trim()) {
      toast.error("Manca il nome");
      return;
    }
    setPicked((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        slug: null,
        name: custom.name.trim(),
        image: custom.image || null,
        url: custom.url || null,
        order: prev.length,
        icon: null,
      },
    ]);
    setCustom({ name: "", image: "", url: "" });
    setCustomOpen(false);
  }

  async function save() {
    setIsSaving(true);
    try {
      const [tools, settingsRes] = await Promise.all([
        fetch("/api/tools", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // The catalogue icon is looked up for display; only the pick itself is stored.
            tools: picked.map((tool) => ({
              id: tool.id,
              slug: tool.slug,
              name: tool.name,
              image: tool.image,
              url: tool.url,
              order: tool.order,
            })),
          }),
        }),
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Only this slice — the API merges it into what's stored.
          body: JSON.stringify({ tools: { display } }),
        }),
      ]);
      if (!tools.ok || !settingsRes.ok) throw new Error("Request failed");
      toast.success("Strumenti salvati");
      router.refresh();
    } catch {
      toast.error("Salvataggio non riuscito");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Come vengono mostrati</label>
          <Select
            value={display}
            onChange={(value) => setDisplay(value as ToolsSettings["display"])}
            options={DISPLAY_OPTIONS}
            className="max-w-xs"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {display === "auto"
              ? `Fermi finché sono pochi, a scorrimento oltre gli otto. Ne hai selezionati ${picked.length}.`
              : display === "grid"
                ? "Sempre fermi, disposti su più righe."
                : "Sempre a scorrimento continuo, anche se sono pochi."}
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">
            Selezionati <span className="text-muted-foreground">({picked.length})</span>
          </h2>
          <Button type="button" variant="secondary" size="sm" onClick={() => setCustomOpen(true)}>
            <Plus className="h-4 w-4" /> Aggiungi manualmente
          </Button>
        </div>

        {picked.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Nessuno selezionato. Spunta qui sotto quelli che usi.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {picked.map((tool, index) => (
              <li
                key={tool.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-wash px-3 py-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {tool.icon ? (
                    <ToolLogo icon={tool.icon} className="h-5 w-5" />
                  ) : (
                    <span className="relative h-5 w-5 overflow-hidden">
                      <ImageWithFallback src={tool.image ?? ""} alt="" fill className="object-contain" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{labelOf(tool)}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Sposta su"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === picked.length - 1}
                    aria-label="Sposta giù"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPicked((prev) => prev.filter((t) => t.id !== tool.id))}
                    aria-label="Rimuovi"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11"
            placeholder="Cerca fra gli strumenti disponibili…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {results.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nessuna corrispondenza. Se il logo non c&apos;è, aggiungilo con{" "}
            <span className="text-foreground">Aggiungi manualmente</span>.
          </p>
        ) : (
          <div className="mt-6 space-y-8">
            {results.map((group) => (
              <div key={group.id}>
                <h3 className="mb-3 text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {group.icons.map((icon) => {
                    const isPicked = pickedSlugs.has(icon.slug);
                    return (
                      <button
                        key={icon.slug}
                        type="button"
                        onClick={() => toggle(icon)}
                        aria-pressed={isPicked}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                          isPicked
                            ? "border-accent bg-accent-soft text-foreground"
                            : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                        )}
                      >
                        <ToolLogo icon={icon} className="h-5 w-5 shrink-0" />
                        <span className="truncate text-sm">{icon.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="button" onClick={save} disabled={isSaving}>
        {isSaving ? "Salvataggio…" : "Salva strumenti"}
      </Button>

      <Modal open={customOpen} onClose={() => setCustomOpen(false)}>
        <h2 className="text-lg font-medium text-foreground">Aggiungi manualmente</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Per quello che il catalogo non copre. Alcuni marchi noti — Java, AWS, VS Code, Adobe, Slack — non
          sono nel set di icone perché i titolari ne hanno chiesto la rimozione.
        </p>
        <div className="mt-6 space-y-4">
          <ImageUploadField
            value={custom.image}
            onChange={(url) => setCustom((prev) => ({ ...prev, image: url }))}
            folder="tools"
            label="Logo"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Nome</label>
            <Input
              placeholder="Java"
              value={custom.name}
              onChange={(e) => setCustom((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Sito ufficiale <span className="text-muted-foreground">(opzionale)</span>
            </label>
            <Input
              placeholder="https://…"
              value={custom.url}
              onChange={(e) => setCustom((prev) => ({ ...prev, url: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCustomOpen(false)}>
              Annulla
            </Button>
            <Button type="button" onClick={addCustom}>
              Aggiungi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
