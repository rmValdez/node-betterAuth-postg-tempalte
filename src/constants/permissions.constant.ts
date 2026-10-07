import { UserRole } from '@prisma/client';

export const PERMISSIONS = {
  // User permissions
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',

  // Settings permissions
  SETTINGS_MANAGE: 'settings:manage',

  // Sandbox & Quiz
  SANDBOX_ACCESS: 'sandbox:access',
  QUIZ_MANAGE: 'quiz:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SANDBOX_ACCESS,
    PERMISSIONS.QUIZ_MANAGE,
  ],
  [UserRole.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.SANDBOX_ACCESS,
    PERMISSIONS.QUIZ_MANAGE,
  ],
  [UserRole.DEVELOPER]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SANDBOX_ACCESS,
    PERMISSIONS.QUIZ_MANAGE,
  ],
  [UserRole.USER]: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.SANDBOX_ACCESS],
};

export function getPermissionsForRole(role: UserRole | string | undefined): Permission[] {
  if (!role) return [];
  const normalized = String(role).toUpperCase() as UserRole;
  return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS[UserRole.USER] || [];
}
