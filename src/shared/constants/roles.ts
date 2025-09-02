export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];