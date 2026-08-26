"use client";

import { useEffect, useState } from "react";
import { SetupStepper } from "@/components/setup/SetupStepper";
import { LanguageStep } from "@/components/setup/LanguageStep";
import { DatabaseStep } from "@/components/setup/DatabaseStep";
import { AccountStep } from "@/components/setup/AccountStep";
import { SiteStep } from "@/components/setup/SiteStep";
import { SITE_NAME } from "@/lib/constants";
import type { SetupStep } from "@/lib/setup";
import type { WizardLang } from "@/lib/setup-translations";

export default function SetupPage() {
  const [lang, setLang] = useState<WizardLang | null>(null);
  const [step, setStep] = useState<SetupStep | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setStep(body.step as SetupStep);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function refreshStatus() {
    setRefreshKey((key) => key + 1);
  }

  if (lang === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <LanguageStep onSelect={setLang} />
      </div>
    );
  }

  if (step === null) {
    return null;
  }

  // Each step is a one-way door: once the database or account is committed
  // there's no going back to redo it, so only the Database step (nothing
  // saved yet) offers a way back — to the language picker.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-2 text-sm font-medium tracking-tight text-foreground">{SITE_NAME} — Setup</div>
      {step !== "complete" && <SetupStepper current={step} lang={lang} />}

      {step === "database" && (
        <DatabaseStep onComplete={refreshStatus} onBack={() => setLang(null)} lang={lang} />
      )}
      {step === "account" && <AccountStep onComplete={refreshStatus} lang={lang} />}
      {step === "site" && <SiteStep lang={lang} />}
    </div>
  );
}
