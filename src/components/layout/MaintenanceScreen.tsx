import { Wrench } from "lucide-react";

/**
 * What the public sees while Impostazioni → Manutenzione is on. Deliberately
 * standalone: no navbar, no footer, nothing to click through to.
 */
export function MaintenanceScreen({ siteName, message }: { siteName: string; message: string }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-wash">
          <Wrench className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mt-6 text-2xl font-medium tracking-tight text-foreground">{siteName}</h1>
        {message && <p className="mt-3 text-muted-foreground">{message}</p>}
      </div>
    </main>
  );
}
