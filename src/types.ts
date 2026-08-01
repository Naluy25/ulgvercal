export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  email?: string;
}

export interface DiscordMember {
  user: DiscordUser;
  roles: string[];
  joined_at: string;
  nick: string | null;
}

export type Page =
  | 'home'
  | 'creators'
  | 'leaderboards'
  | 'staff'
  | 'rules'
  | 'applications'
  | 'store'
  | 'profile';

export type DashboardSection =
  | 'overview'
  | 'applications'
  | 'police'
  | 'ambulance'
  | 'creators'
  | 'admin'
  | 'gangs'
  | 'projects'
  | 'logs'
  | 'discord';

export type ApplicationType = string;

// Discord Role IDs for dashboard access control
export const ROLE_IDS = {
  POLICE: '1200000000000000001',
  AMBULANCE: '1200000000000000002',
  GOVERNMENT: '1200000000000000003',
  GANG_ADMIN: '1200000000000000004',
  GODFATHER: '1300000000000000001',
  CREATOR: '1300000000000000002',
  ADMIN: '1300000000000000003',
  MANAGEMENT: '1300000000000000004',
} as const;

export type DashboardRole = keyof typeof ROLE_IDS;
