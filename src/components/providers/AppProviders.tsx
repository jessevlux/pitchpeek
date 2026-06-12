"use client";

import type { ReactNode } from "react";
import { MatchProvider } from "@/context/MatchContext";
import { BottomTabBar } from "@/components/navigation/BottomTabBar";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MatchProvider>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <BottomTabBar />
    </MatchProvider>
  );
}
