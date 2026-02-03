import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, LogOut, Clock, CheckCircle2, ChevronRight, Settings } from 'lucide-react';
import { StaffService } from '../services/StaffService';
import { useNavigate } from 'react-router-dom';

const StaffPortal = () => {
    const [staffId, setStaffId] = useState('');
    const [staffName, setStaffName] = useState('');
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [message, setMessage] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckAction = async (e) => {
        e.preventDefault();
        if (!staffId.trim()) return;

        if (isCheckedIn) {
            const res = await StaffService.checkOut(staffId);
            if (res.success) {
                setMessage({ type: 'success', text: `Goodbye, ${staffName}! Check-out successful.` });
                setIsCheckedIn(false);
                setStaffId('');
                setStaffName('');
            } else {
                setMessage({ type: 'error', text: res.message });
            }
        } else {
            if (!staffName.trim()) {
                setMessage({ type: 'error', text: 'Please enter your name for first-time check-in' });
                return;
            }
            const res = await StaffService.checkIn(staffId, staffName);
            if (res.success) {
                setMessage({ type: 'success', text: `Welcome, ${staffName}! Check-in successful.` });
                setIsCheckedIn(true);
            } else {
                setMessage({ type: 'error', text: res.message });
            }
        }

        setTimeout(() => setMessage(null), 5000);
    };

    const checkStatus = async (id) => {
        if (!id.trim()) {
            setIsCheckedIn(false);
            return;
        }
        const active = await StaffService.isStaffCheckedIn(id);
        setIsCheckedIn(active);
        if (active) {
            const sessions = await StaffService.getActiveSessions();
            setStaffName(sessions[id]?.staffName || '');
        }
    };

    return (
        <div className="portal-wrapper" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative', overflow: 'hidden' }}
            >
                <div className="shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Staff Portal</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>{currentTime.toLocaleTimeString()}</p>
                    </div>
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        onClick={() => navigate('/admin/login')}
                        style={{ cursor: 'pointer', color: 'var(--text-dim)' }}
                    >
                        <Settings size={20} />
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: message.type === 'success' ? 'var(--accent)' : 'var(--error)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '14px'
                            }}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <div style={{ fontWeight: 'bold' }}>!</div>}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleCheckAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-dim)' }}>Staff ID</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="text"
                                className="premium-input"
                                style={{ width: '100%', paddingLeft: '40px' }}
                                placeholder="Enter Staff ID"
                                value={staffId}
                                onChange={(e) => {
                                    setStaffId(e.target.value);
                                    checkStatus(e.target.value);
                                }}
                                required
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {!isCheckedIn && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '4px' }}>
                                    <label style={{ fontSize: '14px', color: 'var(--text-dim)' }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="premium-input"
                                        style={{ width: '100%' }}
                                        placeholder="Enter Your Name"
                                        value={staffName}
                                        onChange={(e) => setStaffName(e.target.value)}
                                        required={!isCheckedIn}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isCheckedIn && staffName && (
                        <div style={{
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--bg-input)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '20px',
                                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                {staffName[0]?.toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '15px' }}>{staffName}</p>
                                <p style={{ fontSize: '12px', color: 'var(--accent)' }}>Already Checked In</p>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="premium-button" style={{ marginTop: '10px', height: '50px' }}>
                        {isCheckedIn ? (
                            <>
                                <LogOut size={20} />
                                Check Out Now
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Check In Now
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>Date</p>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>{currentTime.toLocaleDateString()}</p>
                    </div>
                    <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>Status</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: isCheckedIn ? 'var(--accent)' : 'var(--text-dim)' }}>
                            {isCheckedIn ? 'Logged In' : 'Logged Out'}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StaffPortal;
