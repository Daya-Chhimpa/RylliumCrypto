"use client";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest, endpoints } from '@/lib/api';
import { addToast } from "@/store/slices/uiSlice";

export default function TwoFactorAuth() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    // Determine userId from user object (handle potential variations)
    const userId = user?.id || user?._id || user?.userId;

    const [status, setStatus] = useState('disabled');
    const [qrData, setQrData] = useState(null); // { qrCode, secret }
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchStatus();
        }
    }, [userId]);

    const fetchStatus = async () => {
        try {
            const data = await apiRequest(endpoints.getTwoFaStatus(userId));
            // Assuming data contains { status: 'enabled' | 'disabled' }
            if (data && data.status) {
                setStatus(data.status);
            }
        } catch (e) {
            console.error("Failed to fetch 2FA status", e);
        }
    };

    const handleGetQr = async () => {
        setLoading(true);
        try {
            const data = await apiRequest(endpoints.enableTwoFa(), { method: 'POST', body: { userId } });
            setQrData(data); 
        } catch (e) {
            dispatch(addToast({ type: 'error', title: 'Error', description: e.message }));
        } finally {
            setLoading(false);
        }
    };

    const handleEnable = async () => {
        if (!code) return;
        setLoading(true);
        try {
            // twofa/verify to enable
            await apiRequest(endpoints.verifyTwoFa(), { method: 'POST', body: { userId, code } });
            dispatch(addToast({ type: 'success', title: 'Success', description: '2FA Enabled successfully' }));
            setStatus('enabled');
            setQrData(null);
            setCode('');
        } catch (e) {
            dispatch(addToast({ type: 'error', title: 'Error', description: e.message }));
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        if (!code) return;
        setLoading(true);
        try {
            // users/disableTwoFaSimple to disable
            await apiRequest(endpoints.disableTwoFaSimple(), { method: 'POST', body: { userId, code } });
            dispatch(addToast({ type: 'success', title: 'Success', description: '2FA Disabled successfully' }));
            setStatus('disabled');
            setCode('');
        } catch (e) {
             dispatch(addToast({ type: 'error', title: 'Error', description: e.message }));
        } finally {
             setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <section className="verification-card twofa-section">
            <div className="verification-header">
                <div className="icon-badge">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </div>
                <div>
                    <h2>Two-Factor Authentication (2FA)</h2>
                    <p>Enhance your account security with an authenticator app.</p>
                </div>
            </div>
            
            <div className="verification-body">
                <div className="status-row">
                    <strong>Status: </strong> 
                    <span className={status === 'enabled' ? 'status-enabled' : 'status-disabled'}>
                        {status === 'enabled' ? 'Enabled' : 'Disabled'}
                    </span>
                </div>

                <div className="action-area">
                    {status !== 'enabled' ? (
                        <div className="two-col-grid">
                             <div className="col">
                                <h3>Get QR Code</h3>
                                <button className="btn-secondary" onClick={handleGetQr} disabled={loading}>
                                    {loading ? 'Loading...' : 'Get QR'}
                                </button>
                                {qrData && (
                                    <div className="qr-box">
                                        {/* Handle both base64 or url */}
                                        <img src={qrData.qrCode} alt="QR Code" />
                                        <div className="secret-key">
                                            <span>Secret:</span> {qrData.secret}
                                        </div>
                                    </div>
                                )}
                             </div>
                             
                             <div className="col">
                                <h3>Enable 2FA</h3>
                                <div className="input-group">
                                    <input 
                                        className="input-field"
                                        type="text" 
                                        placeholder="6-digit code"
                                        value={code} 
                                        onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    />
                                </div>
                                <button className="btn-primary" onClick={handleEnable} disabled={loading || code.length !== 6}>
                                    {loading ? 'Enabling...' : 'Enable'}
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div className="col" style={{maxWidth: 400}}>
                            <h3>Disable 2FA</h3>
                            <p className="description">To disable 2FA, enter the 6-digit code from your authenticator app.</p>
                             <div className="input-group">
                                <input 
                                    className="input-field"
                                    type="text" 
                                    placeholder="6-digit code"
                                    value={code} 
                                    onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                />
                            </div>
                            <button className="btn-danger" onClick={handleDisable} disabled={loading || code.length !== 6}>
                                {loading ? 'Disabling...' : 'Disable'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .verification-card {
                    background: var(--card-bg, #1e1e24);
                    border: 1px solid var(--card-border, #333);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-1, 0 4px 6px rgba(0,0,0,0.1));
                    margin-bottom: 24px;
                }
                .verification-header {
                    padding: 32px;
                    border-bottom: 1px solid var(--card-border, #333);
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                    background: linear-gradient(180deg, var(--bg-soft, #2a2a35) 0%, rgba(255,255,255,0) 100%);
                }
                .icon-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(255, 149, 0, 0.1);
                    color: var(--primary, #f59e0b);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .verification-header h2 {
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--text, #fff);
                    margin: 0 0 8px 0;
                }
                .verification-header p {
                    font-size: 14px;
                    color: var(--muted, #888);
                    margin: 0;
                    line-height: 1.5;
                }
                .verification-body {
                    padding: 32px;
                }
                .status-row {
                    margin-bottom: 24px;
                    font-size: 16px;
                    color: var(--text, #fff);
                }
                .status-enabled { color: #22c55e; font-weight: 600; }
                .status-disabled { color: #ef4444; font-weight: 600; }
                
                .two-col-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                }
                @media (max-width: 768px) {
                    .two-col-grid { grid-template-columns: 1fr; }
                }

                h3 { font-size: 16px; margin-bottom: 12px; color: var(--text, #fff); }
                .description { font-size: 14px; color: var(--muted, #888); margin-bottom: 16px; }

                .input-group { margin-bottom: 16px; }
                .input-field {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 8px;
                    border: 1px solid var(--card-border, #444);
                    background: var(--bg-input, #111);
                    color: #fff;
                    font-size: 14px;
                }
                .input-field:focus { outline: none; border-color: var(--primary, #f59e0b); }

                .btn-secondary {
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: 1px solid var(--card-border, #444);
                    background: transparent;
                    color: var(--text, #fff);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover { background: rgba(255,255,255,0.05); }

                .btn-primary {
                    width: 100%;
                    padding: 12px;
                    border-radius: 20px; /* Rounded based on user image */
                    background: #000; /* As per image (black button) or primary */
                    color: #fff;
                    border: 1px solid #333;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

                .btn-danger {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    background: #ef4444;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                }
                .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

                .qr-box {
                    margin-top: 16px;
                    padding: 16px;
                    background: #fff;
                    border-radius: 8px;
                    display: inline-block;
                }
                .qr-box img { width: 150px; height: 150px; display: block; }
                .secret-key { 
                    margin-top: 8px; 
                    font-size: 12px; 
                    color: #000; 
                    word-break: break-all;
                    max-width: 150px;
                }
            `}</style>
        </section>
    );
}
