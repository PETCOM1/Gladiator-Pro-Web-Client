import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL + '/tactical';

export const siteService = {
    async getSites() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/sites`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch sites');
        return response.json();
    },

    async createSite(data: { name: string; location: string }) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/sites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create site');
        }
        return response.json();
    }
};
