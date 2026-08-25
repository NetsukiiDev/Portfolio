"use client";

import { useState } from "react";
import { Database, Server, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { getSetupT, type WizardLang } from "@/lib/setup-translations";

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
  lang,
}: {
  onComplete: () => void;
  alreadyConfigured?: boolean;
  onNext?: () => void;
  lang: WizardLang;
}) {
  const t = getSetupT(lang).database;
  const [dbType, setDbType] = useState<DbType>("sqlite");
  const [mysql, setMysql] = useState<MysqlFields>(EMPTY_MYSQL);
  const [testState, setTestState] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [testError, setTestError] = useState<string | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [waitingForRestart, setWaitingForRestart] = useState(false);

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

  function describeError(body: { ok: false; error?: string; errorCode?: string; field?: keyof typeof t.fields }): string {
    if (body.errorCode === "missing_field") {
      const fieldLabel = body.field ? t.fields[body.field] : undefined;
      return fieldLabel ? t.missingField(fieldLabel) : t.genericError;
    }
    if (body.errorCode === "db_not_empty") return t.dbNotEmpty;
    return body.error ?? t.genericError;
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
        setTestError(describeError(body));
      }
    } catch {
      setTestState("error");
      setTestError(t.connectionFailed);
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
    setCommitError(t.restartTimeout);
    setWaitingForRestart(false);
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
        setCommitError(describeError(body));
        return;
      }
      if (body.restartRequired) {
        setWaitingForRestart(true);
        await pollUntilReady();
      } else {
        onComplete();
      }
    } catch {
      setCommitError(t.genericError);
    } finally {
      setIsCommitting(false);
    }
  }

  if (alreadyConfigured) {
    return (
      <Card className="w-full max-w-lg p-6 sm:p-8">
        <h1 className="text-xl font-medium tracking-tight text-foreground">{t.title}</h1>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-muted-foreground">{t.alreadyConfigured}</p>
        </div>
        <div className="mt-6">
          <Button type="button" onClick={onNext} className="w-full sm:w-auto">
            {t.next}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <h1 className="text-xl font-medium tracking-tight text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>

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
          {t.sqliteLabel}
          <span className="text-xs text-muted-foreground">{t.sqliteHint}</span>
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
          {t.mysqlLabel}
          <span className="text-xs text-muted-foreground">{t.mysqlHint}</span>
        </button>
      </div>

      {dbType === "mysql" && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder={t.host}
              value={mysql.host}
              onChange={(e) => setMysql({ ...mysql, host: e.target.value })}
            />
            <Input
              placeholder={t.port}
              value={mysql.port}
              onChange={(e) => setMysql({ ...mysql, port: e.target.value })}
            />
          </div>
          <Input
            placeholder={t.databaseName}
            value={mysql.database}
            onChange={(e) => setMysql({ ...mysql, database: e.target.value })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder={t.user}
              value={mysql.user}
              onChange={(e) => setMysql({ ...mysql, user: e.target.value })}
            />
            <Input
              type="password"
              placeholder={t.password}
              value={mysql.password}
              onChange={(e) => setMysql({ ...mysql, password: e.target.value })}
            />
          </div>
        </div>
      )}

      {testState === "ok" && <p className="mt-4 text-sm text-emerald-400">{t.connectionOk}</p>}
      {testState === "error" && <p className="mt-4 text-sm text-red-400">{testError}</p>}
      {commitError && <p className="mt-4 text-sm text-red-400">{commitError}</p>}
      {waitingForRestart && <p className="mt-4 text-sm text-muted-foreground">{t.restarting}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          onClick={handleTest}
          disabled={testState === "testing"}
          className="sm:flex-1"
        >
          {testState === "testing" ? t.testing : t.testConnection}
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={isCommitting || waitingForRestart}
          className="sm:flex-1"
        >
          {isCommitting ? t.committing : t.continueLabel}
        </Button>
      </div>
    </Card>
  );
}
