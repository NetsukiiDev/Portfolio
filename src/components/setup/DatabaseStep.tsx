"use client";

import { useState } from "react";
import { Database, Server, CheckCircle2, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface ManualEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

type DbType = "sqlite" | "mysql";

interface MysqlFields {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
}

const EMPTY_MYSQL: MysqlFields = { host: "localhost", port: "3306", database: "", user: "", password: "" };

export function DatabaseStep({
  onComplete,
  alreadyConfigured = false,
  onNext,
  isVercel = false,
}: {
  onComplete: () => void;
  alreadyConfigured?: boolean;
  onNext?: () => void;
  isVercel?: boolean;
}) {
  const [dbType, setDbType] = useState<DbType>(isVercel ? "mysql" : "sqlite");
  const [mysql, setMysql] = useState<MysqlFields>(EMPTY_MYSQL);
  const [testState, setTestState] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [testError, setTestError] = useState<string | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [waitingForRestart, setWaitingForRestart] = useState(false);
  const [manualEnv, setManualEnv] = useState<ManualEnv | null>(null);
  const [copied, setCopied] = useState(false);

  function buildPayload() {
    if (dbType === "sqlite") return { type: "sqlite" as const };
    return {
      type: "mysql" as const,
      host: mysql.host,
      port: Number(mysql.port),
      database: mysql.database,
      user: mysql.user,
      password: mysql.password,
    };
  }

  async function handleTest() {
    setTestState("testing");
    setTestError(null);
    try {
      const res = await fetch("/api/setup/database/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const body = await res.json();
      if (body.ok) {
        setTestState("ok");
      } else {
        setTestState("error");
        setTestError(body.error ?? "Connessione non riuscita");
      }
    } catch {
      setTestState("error");
      setTestError("Connessione non riuscita");
    }
  }

  async function pollUntilReady() {
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        const res = await fetch("/api/setup/status");
        const body = await res.json();
        if (body.step && body.step !== "database") {
          onComplete();
          return;
        }
      } catch {
        // server is restarting — keep polling
      }
    }
    setCommitError("Il server non ha completato il riavvio. Riavvialo manualmente e ricarica la pagina.");
    setWaitingForRestart(false);
  }

  function envTextFor(env: ManualEnv) {
    return `DATABASE_URL="${env.DATABASE_URL}"\nJWT_SECRET="${env.JWT_SECRET}"`;
  }

  async function copyEnvToClipboard(env: ManualEnv) {
    try {
      await navigator.clipboard.writeText(envTextFor(env));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied by the browser — the panel still shows
      // the values so the user can select and copy them manually.
    }
  }

  async function handleContinue() {
    setIsCommitting(true);
    setCommitError(null);
    try {
      const res = await fetch("/api/setup/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const body = await res.json();
      if (!body.ok) {
        setCommitError(body.error ?? "Configurazione non riuscita");
        return;
      }
      if (body.manualEnv) {
        const env = body.manualEnv as ManualEnv;
        setManualEnv(env);
        await copyEnvToClipboard(env);
      } else if (body.restartRequired) {
        setWaitingForRestart(true);
        await pollUntilReady();
      } else {
        onComplete();
      }
    } catch {
      setCommitError("Configurazione non riuscita");
    } finally {
      setIsCommitting(false);
    }
  }

  async function handleCopy() {
    if (!manualEnv) return;
    await copyEnvToClipboard(manualEnv);
  }

  if (alreadyConfigured) {
    return (
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <h1 className="text-xl font-medium tracking-tight text-foreground">Database</h1>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-muted-foreground">Il database è già configurato.</p>
        </div>
        <div className="mt-6">
          <Button type="button" onClick={onNext} className="w-full sm:w-auto">
            Avanti
          </Button>
        </div>
      </Card>
    );
  }

  if (manualEnv) {
    return (
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <h1 className="text-xl font-medium tracking-tight text-foreground">Database</h1>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-muted-foreground">
            {copied ? "Connessione verificata, dati copiati negli appunti." : "Connessione verificata."}
          </p>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Vercel non può salvare questi valori da solo. Incollali in{" "}
          <span className="text-foreground">Project Settings → Environment Variables</span> sul tuo progetto
          Vercel, poi fai il redeploy.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface-wash p-4 text-xs text-foreground">
          {envTextFor(manualEnv)}
        </pre>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" onClick={handleCopy} className="sm:flex-1">
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copiato
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copia
              </>
            )}
          </Button>
          <Button type="button" onClick={onComplete} className="sm:flex-1">
            Ricontrolla dopo il redeploy
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">Database</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isVercel
          ? "Vercel richiede un database MySQL/MariaDB esterno raggiungibile in rete."
          : "Scegli dove verranno salvati i contenuti del sito."}
      </p>

      {!isVercel && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setDbType("sqlite");
              setTestState("idle");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition-colors",
              dbType === "sqlite" ? "border-accent bg-surface-wash text-foreground" : "border-border text-muted-foreground hover:bg-surface-wash",
            )}
          >
            <Database className="h-5 w-5" />
            SQLite
            <span className="text-xs text-muted-foreground">Consigliato, nessun setup</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDbType("mysql");
              setTestState("idle");
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition-colors",
              dbType === "mysql" ? "border-accent bg-surface-wash text-foreground" : "border-border text-muted-foreground hover:bg-surface-wash",
            )}
          >
            <Server className="h-5 w-5" />
            MySQL / MariaDB
            <span className="text-xs text-muted-foreground">Server esterno</span>
          </button>
        </div>
      )}

      {dbType === "mysql" && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder="Host"
              value={mysql.host}
              onChange={(e) => setMysql({ ...mysql, host: e.target.value })}
            />
            <Input
              placeholder="Porta"
              value={mysql.port}
              onChange={(e) => setMysql({ ...mysql, port: e.target.value })}
            />
          </div>
          <Input
            placeholder="Nome database"
            value={mysql.database}
            onChange={(e) => setMysql({ ...mysql, database: e.target.value })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder="Utente"
              value={mysql.user}
              onChange={(e) => setMysql({ ...mysql, user: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={mysql.password}
              onChange={(e) => setMysql({ ...mysql, password: e.target.value })}
            />
          </div>
        </div>
      )}

      {testState === "ok" && <p className="mt-4 text-sm text-emerald-400">Connessione riuscita.</p>}
      {testState === "error" && <p className="mt-4 text-sm text-red-400">{testError}</p>}
      {commitError && <p className="mt-4 text-sm text-red-400">{commitError}</p>}
      {waitingForRestart && (
        <p className="mt-4 text-sm text-muted-foreground">Il server si sta riavviando per applicare la nuova configurazione…</p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          onClick={handleTest}
          disabled={testState === "testing"}
          className="sm:flex-1"
        >
          {testState === "testing" ? "Verifica…" : "Verifica connessione"}
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={isCommitting || waitingForRestart}
          className="sm:flex-1"
        >
          {isCommitting ? "Configurazione…" : isVercel ? "Copia dati .env" : "Continua"}
        </Button>
      </div>
    </Card>
  );
}
