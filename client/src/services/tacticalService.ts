import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const tacticalService = {
    async getSites() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/tactical/sites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch sites');
        return response.json();
    },

    async getShifts(siteId?: string) {
        const token = getAuthToken();
        const url = siteId ? `${API_URL}/tactical/shifts?siteId=${siteId}` : `${API_URL}/tactical/shifts`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch shifts');
        return response.json();
    },

    async getRosterStats(siteId?: string) {
        const token = getAuthToken();
        const url = siteId ? `${API_URL}/tactical/shifts/stats?siteId=${siteId}` : `${API_URL}/tactical/shifts/stats`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch roster stats');
        return response.json();
    },

    async getPersonnel() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/tactical/personnel`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch personnel');
        return response.json();
    },

    async getIncidents(siteId?: string) {
        const token = getAuthToken();
        const url = siteId ? `${API_URL}/tactical/incidents?siteId=${siteId}` : `${API_URL}/tactical/incidents`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch incidents');
        return response.json();
    },

    async getCheckpoints(siteId?: string) {
        const token = getAuthToken();
        const url = siteId ? `${API_URL}/tactical/checkpoints?siteId=${siteId}` : `${API_URL}/tactical/checkpoints`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch checkpoints');
        return response.json();
    },
    
    async createPost(siteId: string, data: { name: string; description?: string }) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/tactical/sites/${siteId}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    async assignShift(data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/tactical/shifts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to assign shift');
        }
        return response.json();
    },

    async deleteShift(id: string) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/tactical/shifts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to delete shift');
        }
        return true;
    }
};
