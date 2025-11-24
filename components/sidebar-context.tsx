"use client";

import * as React from "react";

interface SidebarContextValue {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = React.useState(96);

  const value = React.useMemo(
    () => ({ sidebarWidth, setSidebarWidth }),
    [sidebarWidth]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

