import * as React from "react";
import { cn } from "../utils/cn";

export interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function AppLayout({ sidebar, children, header }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Speckit
          </div>
          <div>{header}</div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-[var(--color-border)] bg-white p-4">
          {sidebar}
        </aside>
        <main className={cn("min-w-0")}>{children}</main>
      </div>
    </div>
  );
}
