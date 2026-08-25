"use client";

import { useState } from "react";
import { Database, Server, CheckCircle2, Copy, Check, Download, ArrowRight } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [realCheckState, setRealCheckState] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [realCheckError, setRealCheckError] = useState<string | null>(null);

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
      // Clipboard access can be denied by the browser — nothing else to fall
      // back to here since there's no on-screen text to select manually
      // (use "Scarica .env" instead).
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
      if (body.restartRequired) {
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

  // On Vercel, generating the .env values never depends on a live connection
  // test succeeding from here — this server's network path (or the target
  // database's firewall) may differ from the one the real deploy uses once
  // DATABASE_URL is actually set. The user fills the form, grabs the values,
  // pastes them into Vercel, redeploys, and verifies on the right instead.
  async function generateManualEnv(): Promise<ManualEnv | null> {
    setCommitError(null);
    try {
      const res = await fetch("/api/setup/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const body = await res.json();
      if (!body.ok || !body.manualEnv) {
        setCommitError(body.error ?? "Configurazione non riuscita");
        return null;
      }
      return body.manualEnv as ManualEnv;
    } catch {
      setCommitError("Configurazione non riuscita");
      return null;
    }
  }

  function downloadEnvFile(env: ManualEnv) {
    const blob = new Blob([envTextFor(env)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ".env";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleCopyEnv() {
    setIsCommitting(true);
    try {
      const env = await generateManualEnv();
      if (env) await copyEnvToClipboard(env);
    } finally {
      setIsCommitting(false);
    }
  }

  async function handleDownloadEnv() {
    setIsCommitting(true);
    try {
      const env = await generateManualEnv();
      if (env) downloadEnvFile(env);
    } finally {
      setIsCommitting(false);
    }
  }

  // Checks whether the *real* deployment is now working — i.e. whether the
  // values were pasted into Vercel's dashboard and a redeploy picked them up
  // — as opposed to the form fields, which is all handleTest() can see.
  async function handleRealCheck() {
    if (realCheckState === "ok") {
      onComplete();
      return;
    }
    setRealCheckState("checking");
    setRealCheckError(null);
    try {
      const res = await fetch("/api/setup/status");
      const body = await res.json();
      if (body.step && body.step !== "database") {
        setRealCheckState("ok");
      } else {
        setRealCheckState("error");
        setRealCheckError("Non ancora raggiungibile. Hai incollato i valori su Vercel e rifatto il deploy?");
      }
    } catch {
      setRealCheckState("error");
      setRealCheckError("Non ancora raggiungibile. Hai incollato i valori su Vercel e rifatto il deploy?");
    }
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

  if (isVercel) {
    const mysqlFields = (
      <div className="space-y-4">
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
    );

    return (
      <Card className="w-full max-w-3xl p-6 sm:p-8">
        <h1 className="text-xl font-medium tracking-tight text-foreground">Database</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vercel richiede un database MySQL/MariaDB esterno raggiungibile in rete.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-foreground">1. Genera i valori</h2>
            <div className="mt-4">{mysqlFields}</div>

            {testState === "ok" && <p className="mt-4 text-sm text-emerald-400">Connessione riuscita.</p>}
            {testState === "error" && <p className="mt-4 text-sm text-red-400">{testError}</p>}
            {commitError && <p className="mt-4 text-sm text-red-400">{commitError}</p>}

            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTest}
                disabled={testState === "testing"}
                className="w-full"
              >
                {testState === "testing" ? "Verifica…" : "Test di connessione"}
              </Button>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={handleCopyEnv} disabled={isCommitting} className="sm:flex-1">
                {isCommitting ? (
                  "Generazione…"
                ) : copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copiato
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copia .env
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadEnv}
                disabled={isCommitting}
                className="sm:flex-1"
              >
                {isCommitting ? "Generazione…" : <><Download className="h-4 w-4" /> Scarica .env</>}
              </Button>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-surface-wash p-5">
            <h2 className="text-sm font-medium text-foreground">2. Verifica</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Incolla i valori in{" "}
              <span className="text-foreground">Project Settings → Environment Variables</span> sul tuo
              progetto Vercel (o importa il file scaricato), poi fai il redeploy. Quando è pronto, verifica qui.
            </p>

            <div className="mt-auto pt-4">
              {realCheckState === "error" && <p className="mb-3 text-sm text-red-400">{realCheckError}</p>}
              {realCheckState === "ok" && (
                <p className="mb-3 text-sm text-emerald-400">Connessione riuscita.</p>
              )}
              <Button
                type="button"
                onClick={handleRealCheck}
                disabled={realCheckState === "checking"}
                className="w-full"
              >
                {realCheckState === "checking" ? (
                  "Verifica…"
                ) : realCheckState === "ok" ? (
                  <>
                    Avanti <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  "Verifica connessione"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">Database</h1>
      <p className="mt-1 text-sm text-muted-foreground">Scegli dove verranno salvati i contenuti del sito.</p>

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
          {isCommitting ? "Configurazione…" : "Continua"}
        </Button>
      </div>
    </Card>
  );
}
