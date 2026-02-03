import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isAdminAuthenticated_new', 'true');
            navigate('/admin');
        } else {
            setError('Invalid credentials. Try admin/admin123');
            setTimeout(() => setError(''), 3000);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
            >
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        marginBottom: '32px',
                        fontSize: '14px'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Portal
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        margin: '0 auto 16px'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Admin Login</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '8px' }}>Security required to access dashboard</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            padding: '12px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--error)',
                            borderRadius: '8px',
                            fontSize: '13px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-dim)' }}>Username</label>
                        <input
                            type="text"
                            className="premium-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-dim)' }}>Password</label>
                        <input
                            type="password"
                            className="premium-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="premium-button" style={{ marginTop: '10px' }}>
                        Authorize Access
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
