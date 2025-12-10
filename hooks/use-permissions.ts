"use client";

import { useSession } from "next-auth/react";
import { WorkspaceRole } from "@prisma/client";

interface Permissions {
  // Task permissions
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;

  // Project permissions
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;

  // User permissions
  canInviteUser: boolean;
  canRemoveUser: boolean;
  canChangeRole: boolean;

  // Workspace permissions
  canEditWorkspace: boolean;
  canDeleteWorkspace: boolean;

  // Role checks
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;

  // Session state
  isLoading: boolean;
  isAuthenticated: boolean;
  role: WorkspaceRole | null;
}

export function usePermissions(): Permissions {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user?.id;
  const role = (session?.user?.role as WorkspaceRole) || null;

  const isAdmin = role === "admin";
  const isEditor = role === "editor";
  const isViewer = role === "viewer";

  return {
    // Task permissions
    canCreateTask: isAdmin || isEditor,
    canEditTask: isAdmin || isEditor,
    canDeleteTask: isAdmin || isEditor,
    canAssignTask: isAdmin || isEditor,

    // Project permissions
    canCreateProject: isAdmin || isEditor,
    canEditProject: isAdmin || isEditor,
    canDeleteProject: isAdmin,

    // User permissions
    canInviteUser: isAdmin,
    canRemoveUser: isAdmin,
    canChangeRole: isAdmin,

    // Workspace permissions
    canEditWorkspace: isAdmin,
    canDeleteWorkspace: isAdmin,

    // Role checks
    isAdmin,
    isEditor,
    isViewer,

    // Session state
    isLoading,
    isAuthenticated,
    role,
  };
}

// Helper hook for specific permission checks
export function useCanEdit(): boolean {
  const { canEditTask } = usePermissions();
  return canEditTask;
}

export function useIsAdmin(): boolean {
  const { isAdmin } = usePermissions();
  return isAdmin;
}

