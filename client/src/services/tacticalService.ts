import { getAuthToken } from './authService';

const API_URL = 'http://146.141.180.199:5000/api';

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
    }
};
