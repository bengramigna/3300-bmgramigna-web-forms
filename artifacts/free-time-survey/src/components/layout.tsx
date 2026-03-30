import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="bg-accent text-accent-foreground py-4 px-6 md:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="font-semibold text-lg tracking-tight">Free Time Survey</div>
          <div className="text-sm opacity-80 font-medium">University of Iowa</div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-6 md:p-8">
        {children}
      </main>

      <footer className="py-6 px-6 text-center text-sm text-muted-foreground mt-auto">
        <p>Survey by Ben Gramigna, BAIS:3300 - Spring 2026.</p>
      </footer>
    </div>
  );
}
