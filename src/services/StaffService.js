// Use current hostname or fallback to localhost
const API_BASE = `http://${window.location.hostname}:5577/api`;

export const StaffService = {
    getLogs: async () => {
        try {
            const res = await fetch(`${API_BASE}/logs`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch logs', e);
            return [];
        }
    },

    getActiveSessions: async () => {
        try {
            const res = await fetch(`${API_BASE}/sessions`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch sessions', e);
            return {};
        }
    },

    checkIn: async (staffId, staffName) => {
        try {
            const res = await fetch(`${API_BASE}/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staffId, staffName })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    checkOut: async (staffId) => {
        try {
            const res = await fetch(`${API_BASE}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staffId })
            });
            return await res.json();
        } catch (e) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    isStaffCheckedIn: async (staffId) => {
        const sessions = await StaffService.getActiveSessions();
        return !!sessions[staffId];
    }
};
