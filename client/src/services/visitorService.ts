import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const visitorService = {
    async getVisitors(siteId?: string) {
        const token = getAuthToken();
        const url = siteId ? `${API_URL}/visitors?siteId=${siteId}` : `${API_URL}/visitors`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch visitors');
        return response.json();
    },

    async checkIn(data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/visitors/check-in`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to check in visitor');
        return response.json();
    },

    async checkOut(id: string) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/visitors/check-out/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to check out visitor');
        return response.json();
    }
};
