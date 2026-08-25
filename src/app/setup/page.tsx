"use client";

import { useEffect, useState } from "react";
import { SetupStepper } from "@/components/setup/SetupStepper";
import { DatabaseStep } from "@/components/setup/DatabaseStep";
import { AccountStep } from "@/components/setup/AccountStep";
import { SiteStep } from "@/components/setup/SiteStep";
import { SITE_NAME } from "@/lib/constants";
import type { SetupStep } from "@/lib/setup";

export default function SetupPage() {
  const [step, setStep] = useState<SetupStep | null>(null);
  const [manualStep, setManualStep] = useState<SetupStep | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/setup/status")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) {
          setStep(body.step as SetupStep);
          setManualStep(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function refreshStatus() {
    setRefreshKey((key) => key + 1);
  }

  if (step === null) {
    return null;
  }

  const displayedStep = manualStep ?? step;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-2 text-sm font-medium tracking-tight text-foreground">{SITE_NAME} — Setup</div>
      {displayedStep !== "complete" && <SetupStepper current={displayedStep} />}

      {displayedStep === "database" && (
        <DatabaseStep
          onComplete={refreshStatus}
          alreadyConfigured={step !== "database"}
          onNext={() => setManualStep("account")}
        />
      )}
      {displayedStep === "account" && (
        <AccountStep onComplete={refreshStatus} onBack={() => setManualStep("database")} />
      )}
      {displayedStep === "site" && <SiteStep onBack={() => setManualStep("account")} />}
    </div>
  );
}
