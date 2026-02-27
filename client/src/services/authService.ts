import type { User } from '../types/user';

const API_URL = 'http://localhost:5000/api'; // Standard tactical port

export interface LoginResponse {
    token: string;
    user: User;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    saveAuth(token: string, user: User) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    async validateInvitation(token: string) {
        const response = await fetch(`${API_URL}/invitations/validate/${token}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Invalid or expired invitation token');
        }
        return response.json();
    },

    async acceptInvitation(data: { token: string; name: string; password: string }) {
        const response = await fetch(`${API_URL}/invitations/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to accept invitation');
        }

        return response.json();
    },

    async sendInvitation(email: string, role: string, tenantId?: string) {
        const token = this.getToken();
        const response = await fetch(`${API_URL}/invitations/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email, role, tenantId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send invitation');
        }

        return response.json();
    }
};
