import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Tenant, UserRole } from '../types/user';
import { mockUsers, mockTenants } from '../services/mockData';
import { authService } from '../services/authService';

interface TenantContextType {
    currentUser: User | null;
    currentTenant: Tenant | null;
    role: UserRole | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginByRole: (role: UserRole) => void;
    logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

    // Recover session on mount
    useEffect(() => {
        const user = authService.getUser();
        if (user) {
            setCurrentUser(user);
            // In a real app, we'd fetch the tenant from the API
            const tenant = mockTenants.find((t) => t.id === user.tenantId) || null;
            setCurrentTenant(tenant);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            authService.saveAuth(response.token, response.user);

            setCurrentUser(response.user);
            const tenant = mockTenants.find((t) => t.id === response.user.tenantId) || null;
            setCurrentTenant(tenant);

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    const loginByRole = (role: UserRole) => {
        const user = Object.values(mockUsers).find((u) => u.role === role);
        if (!user) return;
        setCurrentUser(user);
        const tenant = mockTenants.find((t) => t.id === user.tenantId) || null;
        setCurrentTenant(tenant);
    };

    const logout = () => {
        authService.logout();
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
