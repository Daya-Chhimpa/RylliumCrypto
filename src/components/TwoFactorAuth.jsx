"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { apiRequest, endpoints, getTokenPayload } from "@/lib/api";
import { addToast } from "@/store/slices/uiSlice";

export default function TwoFactorAuth() {
  const reduxDispatch = useDispatch();
  
  const [methods, setMethods] = useState({ totp: { enabled: false }, email: { enabled: false } });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  const [activeMethod, setActiveMethod] = useState(null); // 'totp' | 'email'
  const [flow, setFlow] = useState(null); // 'enabling' | 'disabling'
  const [qrData, setQrData] = useState(null); // { qrCode, secret }
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Status
  const fetchStatus = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await apiRequest(endpoints.getTwoFaStatus(id), { method: "POST" });
      if (res) setMethods(res);
    } catch (err) {
      console.error("2FA status fetch failed", err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const payload = getTokenPayload();
    if (payload) {
      const id = payload.userId || payload.sub || payload.id;
      setUserId(id);
      if (id) fetchStatus(id);
    }
  }, [fetchStatus]);

  // 2. Handle Action (Setup/Disable Initiator)
  const handleActionClick = async (method, isEnabled) => {
    setActiveMethod(method);
    setCode("");
    
    if (!isEnabled) {
      setFlow("enabling");
      setSubmitting(true);
      try {
        const res = await apiRequest(endpoints.enableTwoFa(), {
          method: "POST", body: { userId, method }
        });
        if (method === "totp") setQrData(res);
        if (method === "email") {
           reduxDispatch(addToast({ type: "success", title: "OTP Sent", description: "Verification code sent to email." }));
        }
      } catch (err) {
        setFlow(null);
        reduxDispatch(addToast({ type: "error", title: "Error", description: err.message }));
      } finally { setSubmitting(false); }
    } else {
      setFlow("disabling");
      // For email disabling, we might need to send an OTP first to confirm
      if (method === "email") {
        setSubmitting(true);
        try {
          await apiRequest(endpoints.enableTwoFa(), { method: "POST", body: { userId, method: "email" } });
          reduxDispatch(addToast({ type: "success", title: "Confirm", description: "Verification code sent to email." }));
        } catch (err) {
          reduxDispatch(addToast({ type: "error", title: "Error", description: err.message }));
        } finally { setSubmitting(false); }
      }
    }
  };

  const handleFetchQrOnly = async () => {
    setSubmitting(true);
    try {
      const res = await apiRequest(endpoints.enableTwoFa(), {
        method: "POST", body: { userId, method: "totp" }
      });
      setQrData(res);
    } catch (err) {
      reduxDispatch(addToast({ type: "error", title: "Error", description: err.message }));
    } finally { setSubmitting(false); }
  };

  // 3. Confirm Verify/Disable (The 6-digit submit)
  const handleConfirm = async () => {
    if (!code || code.length < 6) return;
    setSubmitting(true);
    try {
      if (flow === "enabling") {
        await apiRequest(endpoints.verifyTwoFa(), { method: "POST", body: { userId, method: activeMethod, code } });
        reduxDispatch(addToast({ type: "success", title: "Enabled", description: `${activeMethod === 'totp' ? 'Authenticator App' : 'Email'} 2FA activated!` }));
      } else {
        await apiRequest(endpoints.disableTwoFaSimple(), { method: "POST", body: { userId, method: activeMethod, code } });
        reduxDispatch(addToast({ type: "success", title: "Disabled", description: "Two-Factor authentication removed." }));
      }
      setFlow(null);
      setActiveMethod(null);
      setQrData(null);
      setCode("");
      fetchStatus(userId);
    } catch (err) {
      reduxDispatch(addToast({ type: "error", title: "Failed", description: err.message }));
    } finally { setSubmitting(false); }
  };

  if (loading && !userId) return <div style={{ padding: 20, color: "var(--muted)" }}>Initializing Security Settings...</div>;

  return (
    <section className="security-card">
      <div className="card-header">
        <div className="icon-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div>
          <h2>Security Settings</h2>
          <p>Protect your account with Two-Factor Authentication</p>
        </div>
      </div>

      <div className="card-body">
        {!flow ? (
          <div className="methods-list">
            {/* Authenticator App */}
            <div className="method-item">
              <div className="method-info">
                <div className="method-name">Authenticator App (TOTP)</div>
                <div className={`status-tag ${methods.totp?.enabled ? 'active' : ''}`}>
                  {methods.totp?.enabled ? 'Protected' : 'Off'}
                </div>
              </div>
              <button 
                onClick={() => handleActionClick("totp", methods.totp?.enabled)}
                className={`action-btn ${methods.totp?.enabled ? 'btn-red' : 'btn-primary'}`}
              >
                {methods.totp?.enabled ? 'Disable' : 'Setup'}
              </button>
            </div>

            {/* Email Code */}
            <div className="method-item">
              <div className="method-info">
                <div className="method-name">Email Authentication</div>
                <div className={`status-tag ${methods.email?.enabled ? 'active' : ''}`}>
                  {methods.email?.enabled ? 'Protected' : 'Off'}
                </div>
              </div>
              <button 
                onClick={() => handleActionClick("email", methods.email?.enabled)}
                className={`action-btn ${methods.email?.enabled ? 'btn-red' : 'btn-primary'}`}
              >
                {methods.email?.enabled ? 'Disable' : 'Setup'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flow-box animate-slide-up">
            <div className="flow-header">
              <h3>{flow === "enabling" ? "Enable" : "Disable"} {activeMethod === 'totp' ? 'Authenticator' : 'Email'}</h3>
              <p>{flow === "enabling" ? "Scan the QR code or check your email for the verification code." : "Enter your 6-digit code to disable 2FA."}</p>
            </div>

            {activeMethod === "totp" && flow === "enabling" && qrData && (
              <div className="qr-section">
                <div className="qr-wrapper">
                  <img src={qrData.qrCode} alt="Security QR" />
                </div>
                <div className="secret-hint">
                  <span>Secret Key:</span>
                  <code>{qrData.secret}</code>
                </div>
              </div>
            )}

            {activeMethod === "totp" && flow === "disabling" && (
              <div style={{ marginBottom: 20 }}>
                <button 
                  className="cancel-btn" 
                  style={{ height: 'auto', padding: '10px 16px', fontSize: '12px' }}
                  onClick={handleFetchQrOnly}
                >
                  {qrData ? "Refresh QR Code" : "Show Recovery QR"}
                </button>
                {qrData && (
                  <div className="qr-section" style={{ marginTop: 15 }}>
                     <div className="qr-wrapper" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                       <img src={qrData.qrCode} alt="Recovery QR" style={{ width: 130, height: 130 }} />
                     </div>
                     <div className="secret-hint"><code>{qrData.secret}</code></div>
                  </div>
                )}
              </div>
            )}

            <div className="input-area">
              <input 
                type="text" 
                maxLength={6} 
                className="code-input"
                value={code} 
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} 
                placeholder="000000" 
              />
              <div className="btn-group">
                <button 
                  onClick={handleConfirm} 
                  disabled={submitting || code.length < 6}
                  className="confirm-btn"
                >
                  {submitting ? "Processing..." : (flow === "enabling" ? "Verify & Activate" : "Confirm Disable")}
                </button>
                <button 
                  onClick={() => { setFlow(null); setQrData(null); }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .security-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-1);
        }
        .card-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          gap: 16px;
          align-items: center;
          background: linear-gradient(180deg, var(--bg-soft) 0%, rgba(0,0,0,0) 100%);
        }
        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .card-header h2 { font-size: 19px; font-weight: 700; margin: 0; color: #fff; }
        .card-header p { font-size: 13px; color: var(--muted); margin: 4px 0 0; }

        .card-body { padding: 32px; }

        .methods-list { display: grid; gap: 12px; }
        .method-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--bg-soft);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          transition: border-color 0.2s;
        }
        .method-item:hover { border-color: rgba(139, 92, 246, 0.3); }
        .method-name { font-weight: 600; font-size: 15px; color: #fff; margin-bottom: 4px; }
        
        .status-tag { 
          display: inline-block; 
          font-size: 11px; 
          font-weight: 800; 
          padding: 2px 8px; 
          border-radius: 6px; 
          background: rgba(255,255,255,0.05);
          color: var(--muted);
          text-transform: uppercase;
        }
        .status-tag.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .action-btn {
          height: 38px;
          padding: 0 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-red { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .btn-red:hover { background: #ef4444; color: #fff; }

        .flow-box { text-align: center; max-width: 440px; margin: 0 auto; }
        .flow-header h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; color: #fff; }
        .flow-header p { font-size: 14px; color: var(--muted); margin-bottom: 24px; line-height: 1.5; }

        .qr-section { margin-bottom: 24px; }
        .qr-wrapper {
          background: #fff;
          padding: 12px;
          border-radius: 16px;
          display: inline-block;
          margin-bottom: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .qr-wrapper img { width: 160px; height: 160px; display: block; }
        .secret-hint { font-size: 12px; color: var(--muted); }
        .secret-hint code { 
          display: block; 
          margin-top: 5px; 
          font-family: monospace; 
          color: #fff; 
          background: rgba(255,255,255,0.05); 
          padding: 4px 10px; 
          border-radius: 4px;
          font-size: 13px;
        }

        .input-area { margin-top: 20px; }
        .code-input {
          width: 100%;
          height: 54px;
          background: var(--bg-soft);
          border: 2px solid var(--card-border);
          border-radius: 14px;
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 4px;
          color: #fff;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }
        .code-input:focus { outline: none; border-color: var(--primary); }

        .btn-group { display: flex; flex-direction: column; gap: 12px; }
        .confirm-btn {
          height: 50px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn {
          height: 48px;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .cancel-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
      `}</style>
    </section>
  );
}
