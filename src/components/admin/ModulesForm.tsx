"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/context/ToastContext";
import { MODULES, type ModuleKey, type ModulesSettings } from "@/lib/modules";
import type { Settings } from "@/types";

const LABELS: Record<ModuleKey, string> = {
  projects: "Progetti",
  skills: "Competenze",
  experience: "Esperienza",
  blog: "Blog",
  aiGallery: "Galleria AI",
  contact: "Contatti",
};

export function ModulesForm({ settings }: { settings: Settings }) {
  const toast = useToast();
  const [modules, setModules] = useState<ModulesSettings>(settings.modules);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(key: ModuleKey, patch: Partial<ModulesSettings[ModuleKey]>) {
    setModules((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function onSave() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, modules } satisfies Settings),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Moduli salvati");
    } catch {
      toast.error("Salvataggio non riuscito");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Disattivare un modulo ne nasconde la pagina pubblica e la voce nel menu del sito. I contenuti restano
        salvati e continui a gestirli da qui nel pannello.
      </p>

      <div className="space-y-3">
        {MODULES.map((mod) => {
          const config = modules[mod.key];
          return (
            <Card key={mod.key} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{LABELS[mod.key]}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mod.href}
                    {mod.adminHref && (
                      <>
                        {" · "}
                        <Link href={mod.adminHref} className="underline hover:text-foreground">
                          gestisci contenuti
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <Toggle
                  checked={config.enabled}
                  onChange={(checked) => update(mod.key, { enabled: checked })}
                  label={config.enabled ? "Attivo" : "Disattivato"}
                />
              </div>

              {mod.hasHomeSection && (
                <div className="mt-4 border-t border-border pt-4">
                  <Toggle
                    checked={config.showOnHome && config.enabled}
                    onChange={(checked) => update(mod.key, { showOnHome: checked })}
                    label="Mostra la sezione in home"
                  />
                  {!config.enabled && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Il modulo è disattivato, quindi la sezione non appare comunque.
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button type="button" onClick={onSave} disabled={isSubmitting}>
        {isSubmitting ? "Salvataggio…" : "Salva moduli"}
      </Button>
    </div>
  );
}
