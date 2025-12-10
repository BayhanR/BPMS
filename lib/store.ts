"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkspaceRole } from "@prisma/client";

interface AppState {
  // Workspace & Project
  currentWorkspaceId: string | null;
  currentProjectId: string | null;
  userRole: WorkspaceRole | null;
  
  // Actions
  setWorkspace: (id: string | null, role?: WorkspaceRole | null) => void;
  setProject: (id: string | null) => void;
  setUserRole: (role: WorkspaceRole | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentWorkspaceId: null,
      currentProjectId: null,
      userRole: null,

      // Actions
      setWorkspace: (id, role) =>
        set({
          currentWorkspaceId: id,
          currentProjectId: null, // Reset project when workspace changes
          userRole: role ?? null,
        }),

      setProject: (id) => set({ currentProjectId: id }),

      setUserRole: (role) => set({ userRole: role }),

      reset: () =>
        set({
          currentWorkspaceId: null,
          currentProjectId: null,
          userRole: null,
        }),
    }),
    {
      name: "bpms-app-store",
      partialize: (state) => ({
        currentWorkspaceId: state.currentWorkspaceId,
        currentProjectId: state.currentProjectId,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCurrentWorkspaceId = () =>
  useAppStore((state) => state.currentWorkspaceId);
export const useCurrentProjectId = () =>
  useAppStore((state) => state.currentProjectId);
export const useUserRole = () => useAppStore((state) => state.userRole);

