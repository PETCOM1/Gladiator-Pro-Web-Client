import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const obEntryService = {
    async getEntries() {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/ob-entries`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch OB entries');
        return response.json();
    },

    async createEntry(data: any) {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/ob-entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create OB entry');
        return response.json();
    }
};
