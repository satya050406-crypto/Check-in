import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    History,
    LogOut,
    Search,
    TrendingUp
} from 'lucide-react';
import { StaffService } from '../services/StaffService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [activeSessions, setActiveSessions] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated_new');
        if (!isAuth) {
            navigate('/admin/login');
            return;
        }

        const loadData = () => {
            setLogs(StaffService.getLogs().reverse());
            setActiveSessions(StaffService.getActiveSessions());
        };

        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated_new');
        navigate('/admin/login');
    };

    const filteredLogs = logs.filter(log =>
        log.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeStaffCount = Object.keys(activeSessions).length;

    return (
        <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', padding: '32px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Monitor staff presence and timing history</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="premium-button"
                        style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid var(--border)', background: 'none' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    <StatCard icon={<Users color="var(--primary)" />} label="Active Staff" value={activeStaffCount} sub="Currently checked in" />
                    <StatCard icon={<History color="var(--accent)" />} label="Total Records" value={logs.length} sub="Lifetime logs" />
                    <StatCard icon={<TrendingUp color="#f59e0b" />} label="Average Duration" value="8.2h" sub="System average" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card"
                        style={{ padding: '24px', overflow: 'hidden' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Activity History</h2>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                                <input
                                    type="text"
                                    className="premium-input"
                                    placeholder="Search staff..."
                                    style={{ paddingLeft: '36px', fontSize: '14px', height: '40px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '13px' }}>
                                        <th style={{ padding: '16px 8px' }}>STAFF</th>
                                        <th style={{ padding: '16px 8px' }}>TYPE</th>
                                        <th style={{ padding: '16px 8px' }}>DATE & TIME</th>
                                        <th style={{ padding: '16px 8px' }}>DURATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map(log => (
                                        <motion.tr
                                            layout
                                            key={log.id}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '14px' }}
                                        >
                                            <td style={{ padding: '16px 8px' }}>
                                                <div>
                                                    <p style={{ fontWeight: '500' }}>{log.staffName}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>ID: {log.staffId}</p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 8px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    backgroundColor: log.type === 'CHECK_IN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: log.type === 'CHECK_IN' ? 'var(--accent)' : 'var(--error)'
                                                }}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 8px' }}>
                                                <div>
                                                    <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 8px' }}>
                                                {log.duration ? `${log.duration} h` : '-'}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card"
                        style={{ padding: '24px', height: 'fit-content' }}
                    >
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Currently On-Site</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.values(activeSessions).map(session => (
                                <div key={session.staffId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--accent)' }} />
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: '600' }}>{session.staffName}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Since {new Date(session.checkInTime).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeStaffCount === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px', padding: '20px' }}>
                                    No active staff at the moment.
                                </p>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub }) => (
    <motion.div
        whileHover={{ translateY: -4 }}
        className="glass-card"
        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}
    >
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontSize: '24px', fontWeight: '800' }}>{value}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{sub}</p>
        </div>
    </motion.div>
);

export default AdminDashboard;
