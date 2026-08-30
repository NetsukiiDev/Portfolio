"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import type { TunnelSettings, TunnelStatus } from "@/lib/tunnel/types";

const MODE_OPTIONS = [
  { value: "token", label: "Tunnel del mio account (token)" },
  { value: "quick", label: "Tunnel rapido (indirizzo temporaneo)" },
];

const STATE_LABEL: Record<TunnelStatus["state"], string> = {
  stopped: "Fermo",
  starting: "Connessione…",
  connected: "Attivo",
  error: "Errore",
};

const STATE_STYLE: Record<TunnelStatus["state"], string> = {
  stopped: "",
  starting: "border-amber-500/40 text-amber-300",
  connected: "border-emerald-500/40 text-emerald-300",
  error: "border-rose-500/40 text-rose-300",
};

export function TunnelPanel({ tunnel: initial }: { tunnel: TunnelSettings }) {
  const toast = useToast();
  const [tunnel, setTunnel] = useState<TunnelSettings>(initial);
  const [status, setStatus] = useState<TunnelStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const logRef = useRef<HTMLPreElement>(null);

  // Polled rather than pushed: cloudflared takes a few seconds to register a
  // connection, and the panel should show that happening without a reload.
  useEffect(() => {
    let alive = true;

    async function poll() {
      try {
        const res = await fetch("/api/admin/tunnel");
        if (alive && res.ok) setStatus((await res.json()) as TunnelStatus);
      } catch {
        // A failed poll says nothing useful; the next one will tell.
      }
    }

    void poll();
    const timer = setInterval(poll, 3000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [status?.logs.length]);

  function set<K extends keyof TunnelSettings>(key: K, value: TunnelSettings[K]) {
    setTunnel((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Only this slice — the API merges it into what's stored.
        body: JSON.stringify({ tunnel }),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Tunnel salvato");
      return true;
    } catch {
      toast.error("Salvataggio non riuscito");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function act(action: "start" | "stop" | "restart") {
    setIsActing(true);
    try {
      // Always saves first: starting a tunnel with a token still sitting
      // unsaved in the form would use the previous one and look like a bug.
      if (action !== "stop" && !(await save())) return;

      const res = await fetch("/api/admin/tunnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus((await res.json()) as TunnelStatus);
    } catch {
      toast.error("Comando non riuscito");
    } finally {
      setIsActing(false);
    }
  }

  const running = status?.state === "connected" || status?.state === "starting";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Pubblica il sito senza aprire porte sul router: <code className="text-foreground">cloudflared</code> apre
        lui la connessione verso Cloudflare, e il traffico torna indietro da lì.
      </p>

      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge className={cn(STATE_STYLE[status?.state ?? "stopped"])}>
              {STATE_LABEL[status?.state ?? "stopped"]}
            </Badge>
            {status?.url && (
              <a
                href={status.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {status.url}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            {running ? (
              <>
                <Button type="button" variant="secondary" size="sm" onClick={() => act("restart")} disabled={isActing}>
                  Riavvia
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => act("stop")} disabled={isActing}>
                  Ferma
                </Button>
              </>
            ) : (
              <Button type="button" size="sm" onClick={() => act("start")} disabled={isActing}>
                {isActing ? "Avvio…" : "Avvia"}
              </Button>
            )}
          </div>
        </div>

        {status?.error && <p className="text-sm text-rose-300">{status.error}</p>}

        {status && !status.binaryFound && (
          <p className="text-xs text-muted-foreground">
            <code className="text-foreground">cloudflared</code> non risulta installato. Su Windows:{" "}
            <code className="text-foreground">winget install Cloudflare.cloudflared</code>. Su Debian/Ubuntu il
            pacchetto <code className="text-foreground">cloudflared</code> di Cloudflare. Se è installato altrove,
            indica il percorso qui sotto.
          </p>
        )}
      </Card>

      <Card className="space-y-5 p-5">
        <div>
          <Toggle
            checked={tunnel.enabled}
            onChange={(checked) => set("enabled", checked)}
            label="Avvia il tunnel insieme al sito"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Senza questo il tunnel resta acceso solo finché non riavvii il server.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Tipo di tunnel</label>
          <Select
            value={tunnel.mode}
            onChange={(value) => set("mode", value as TunnelSettings["mode"])}
            options={MODE_OPTIONS}
            className="max-w-sm"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {tunnel.mode === "token"
              ? "Crea il tunnel su Cloudflare Zero Trust, collega il tuo dominio e incolla qui il token del connettore."
              : "Cloudflare assegna un indirizzo *.trycloudflare.com casuale, che dura quanto il processo. Nessun account richiesto — per far vedere il sito a qualcuno, non per tenerlo online."}
          </p>
        </div>

        {tunnel.mode === "token" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Token del connettore</label>
              <Input
                type="password"
                placeholder="eyJhIjoi…"
                value={tunnel.token}
                onChange={(e) => set("token", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Hostname pubblico</label>
              <Input
                placeholder="portfolio.example.com"
                value={tunnel.hostname}
                onChange={(e) => set("hostname", e.target.value)}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Quello che hai instradato al tunnel su Cloudflare. Serve solo per il link qui sopra: deve
                combaciare con il dominio in <span className="text-foreground">Generale</span>.
              </p>
            </div>
          </>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Percorso di cloudflared <span className="text-muted-foreground">(opzionale)</span>
          </label>
          <Input
            placeholder="cloudflared"
            value={tunnel.binaryPath}
            onChange={(e) => set("binaryPath", e.target.value)}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Da compilare solo se non è nel PATH.
          </p>
        </div>

        <Button type="button" onClick={save} disabled={isSaving}>
          {isSaving ? "Salvataggio…" : "Salva tunnel"}
        </Button>
      </Card>

      {status && status.logs.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-medium text-foreground">Log di cloudflared</h3>
          <pre
            ref={logRef}
            className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-surface-wash px-4 py-3 text-xs leading-relaxed text-muted-foreground"
          >
            {status.logs.join("\n")}
          </pre>
        </Card>
      )}
    </div>
  );
}
