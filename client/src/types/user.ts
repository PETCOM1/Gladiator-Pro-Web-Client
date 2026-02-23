export type UserRole = 'super-admin' | 'tenant-admin' | 'site-manager';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    tenantId?: string;
    siteId?: string;
}

export interface Tenant {
    id: string;
    name: string;
    status: 'active' | 'suspended' | 'onboarding';
    subscriptionPlan: 'basic' | 'pro' | 'enterprise';
    createdAt: string;
}

export interface Site {
    id: string;
    tenantId: string;
    name: string;
    location: string;
    managerId: string;
}

export interface SystemHealth {
    status: 'operational' | 'degraded' | 'maintenance';
    uptime: string;
    activeTenants: number;
}
