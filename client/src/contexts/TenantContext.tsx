import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Tenant, UserRole } from '../types/user';
import { mockUsers, mockTenants, mockCredentials } from '../services/mockData';

interface TenantContextType {
    currentUser: User | null;
    currentTenant: Tenant | null;
    role: UserRole | null;
    login: (email: string, password: string) => { success: boolean; error?: string };
    loginByRole: (role: UserRole) => void;
    logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

    const login = (email: string, password: string) => {
        const cred = mockCredentials[email.toLowerCase()];
        if (!cred) return { success: false, error: 'No account found for that email.' };
        if (cred.password !== password) return { success: false, error: 'Incorrect password.' };

        const user = mockUsers[cred.userId];
        setCurrentUser(user);
        const tenant = mockTenants.find((t) => t.id === user.tenantId) || null;
        setCurrentTenant(tenant);
        return { success: true };
    };

    const loginByRole = (role: UserRole) => {
        const user = Object.values(mockUsers).find((u) => u.role === role);
        if (!user) return;
        setCurrentUser(user);
        const tenant = mockTenants.find((t) => t.id === user.tenantId) || null;
        setCurrentTenant(tenant);
    };

    const logout = () => {
        setCurrentUser(null);
        setCurrentTenant(null);
    };

    return (
        <TenantContext.Provider value={{
            currentUser,
            currentTenant,
            role: currentUser?.role ?? null,
            login,
            loginByRole,
            logout,
        }}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const ctx = useContext(TenantContext);
    if (!ctx) throw new Error('useTenant must be used within a TenantProvider');
    return ctx;
}
