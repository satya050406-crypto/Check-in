const STORAGE_KEYS = {
    STAFF_LOGS: 'staff_checkin_logs_new',
    ACTIVE_STAFF: 'active_staff_sessions_new'
};

export const StaffService = {
    getLogs: () => {
        const logs = localStorage.getItem(STORAGE_KEYS.STAFF_LOGS);
        return logs ? JSON.parse(logs) : [];
    },

    getActiveSessions: () => {
        const sessions = localStorage.getItem(STORAGE_KEYS.ACTIVE_STAFF);
        return sessions ? JSON.parse(sessions) : {};
    },

    checkIn: (staffId, staffName) => {
        const sessions = StaffService.getActiveSessions();
        if (sessions[staffId]) return { success: false, message: 'Already checked in' };

        const checkInTime = new Date().toISOString();
        sessions[staffId] = {
            staffId,
            staffName,
            checkInTime
        };

        localStorage.setItem(STORAGE_KEYS.ACTIVE_STAFF, JSON.stringify(sessions));

        // Add to logs
        const logs = StaffService.getLogs();
        logs.push({
            id: Date.now(),
            staffId,
            staffName,
            type: 'CHECK_IN',
            timestamp: checkInTime
        });
        localStorage.setItem(STORAGE_KEYS.STAFF_LOGS, JSON.stringify(logs));

        return { success: true, data: sessions[staffId] };
    },

    checkOut: (staffId) => {
        const sessions = StaffService.getActiveSessions();
        if (!sessions[staffId]) return { success: false, message: 'Not checked in' };

        const session = sessions[staffId];
        const checkOutTime = new Date().toISOString();

        // Calculate duration
        const duration = new Date(checkOutTime) - new Date(session.checkInTime);
        const durationHours = (duration / (1000 * 60 * 60)).toFixed(2);

        // Add to logs
        const logs = StaffService.getLogs();
        logs.push({
            id: Date.now(),
            staffId: session.staffId,
            staffName: session.staffName,
            type: 'CHECK_OUT',
            timestamp: checkOutTime,
            checkInTime: session.checkInTime,
            duration: durationHours
        });
        localStorage.setItem(STORAGE_KEYS.STAFF_LOGS, JSON.stringify(logs));

        // Remove from active sessions
        delete sessions[staffId];
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STAFF, JSON.stringify(sessions));

        return { success: true };
    },

    isStaffCheckedIn: (staffId) => {
        const sessions = StaffService.getActiveSessions();
        return !!sessions[staffId];
    }
};
