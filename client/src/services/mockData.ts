import type { User, Tenant, Site } from '../types/user';

// ─── Mock Credentials ──────────────────────────────────────────────────────
// For demo/development use only
//
//  GLOBAL COMMAND (Super Admin)
//  Email : admin@gladiator.pro
//  Pass  : Gladiator@2025
//
//  TENANT ADMIN (Company Owner)
//  Email : ceo@securecorp.com
//  Pass  : SecureCorp@2025
//
//  SITE MANAGER (Supervisor)
//  Email : sarah@northsector.com
//  Pass  : NorthSector@2025
// ───────────────────────────────────────────────────────────────────────────

export const mockCredentials: Record<string, { password: string; userId: string }> = {
    'admin@gladiator.pro': { password: 'Gladiator@2025', userId: '1' },
    'ceo@securecorp.com': { password: 'SecureCorp@2025', userId: '2' },
    'sarah@northsector.com': { password: 'NorthSector@2025', userId: '3' },
};

export const mockUsers: Record<string, User> = {
    '1': {
        id: '1',
        name: 'Marcus Global',
        email: 'admin@gladiator.pro',
        role: 'super-admin',
    },
    '2': {
        id: '2',
        name: 'John Tenant',
        email: 'ceo@securecorp.com',
        role: 'tenant-admin',
        tenantId: 'tenant-1',
    },
    '3': {
        id: '3',
        name: 'Sarah Supervisor',
        email: 'sarah@northsector.com',
        role: 'site-manager',
        tenantId: 'tenant-1',
        siteId: 'site-1',
    },
};

export const mockTenants: Tenant[] = [
    {
        id: 'tenant-1',
        name: 'SecureCorp Solutions',
        status: 'active',
        subscriptionPlan: 'enterprise',
        createdAt: '2025-01-01T00:00:00Z',
    },
    {
        id: 'tenant-2',
        name: 'Ironclad Security',
        status: 'active',
        subscriptionPlan: 'pro',
        createdAt: '2025-02-15T00:00:00Z',
    },
];

export const mockSites: Site[] = [
    {
        id: 'site-1',
        tenantId: 'tenant-1',
        name: 'North Sector Complex',
        location: '123 Defense Ave, High-Rise City',
        managerId: '3',
    },
];
