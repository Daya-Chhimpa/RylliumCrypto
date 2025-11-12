"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { preEnable2faThunk, enable2faThunk, disable2faThunk, twoFAStatusThunk } from "@/store/slices/authSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const authStatus = useSelector((s) => s.auth.status);
  const authError = useSelector((s) => s.auth.error);
  
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check 2FA status on page load
  useEffect(() => {
    const checkStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const res = await dispatch(twoFAStatusThunk());
        if (res.meta.requestStatus === "fulfilled") {
          const enabled = res.payload?.is2FaEnabled === 1 || res.payload?.is2FaEnabled === true;
          setTwoFAEnabled(enabled);
        }
      } catch (error) {
        console.error("Error checking 2FA status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    checkStatus();
  }, [dispatch]);

  async function fetchQr() {
    setMessage("");
    setErrorMsg("");
    try {
      const res = await dispatch(preEnable2faThunk());
      if (res.meta.requestStatus === "fulfilled") {
        const data = res.payload;
        // API returns qrCodeUrl and secret
        setQr(data?.qrCodeUrl || "");
        setSecret(data?.secret || "");
        setMessage("QR code generated successfully! Scan it with your authenticator app.");
      } else {
        setErrorMsg(res.payload || "Failed to generate QR code");
      }
    } catch (error) {
      setErrorMsg("Failed to generate QR code. Please try again.");
    }
  }

  async function handleEnable(e) {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    
    if (!code || code.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code");
      return;
    }

    try {
      const res = await dispatch(enable2faThunk({ twoFactorCode: code }));
      if (res.meta.requestStatus === "fulfilled") {
        setMessage("Two-factor authentication enabled successfully!");
        setCode("");
        setTwoFAEnabled(true);
        // Clear QR after successful enable
        setTimeout(() => {
          setQr("");
          setSecret("");
        }, 2000);
      } else {
        setErrorMsg(res.payload || "Failed to enable 2FA. Please check your code.");
      }
    } catch (error) {
      setErrorMsg("Failed to enable 2FA. Please try again.");
    }
  }

  async function handleDisable(e) {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    
    if (!code || code.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit code");
      return;
    }

    try {
      const res = await dispatch(disable2faThunk({ twoFactorCode: code }));
      if (res.meta.requestStatus === "fulfilled") {
        setMessage("Two-factor authentication disabled successfully.");
        setCode("");
        setQr("");
        setSecret("");
        setTwoFAEnabled(false);
      } else {
        setErrorMsg(res.payload || "Failed to disable 2FA. Please check your code.");
      }
    } catch (error) {
      setErrorMsg("Failed to disable 2FA. Please try again.");
    }
  }

  return (
    <div className="rl-content">
      <div style={{
        background: 'linear-gradient(135deg, rgba(76, 64, 247, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
        borderRadius: '24px',
        padding: '40px 32px',
        marginBottom: '32px',
        border: '1px solid rgba(76, 64, 247, 0.1)'
      }}>
        <h1 className="rl-page-title" style={{marginBottom: '12px'}}>Settings</h1>
        <p style={{color: 'var(--muted)', fontSize: '16px'}}>Manage your security and account preferences</p>
      </div>
      <section className="card" style={{padding: 28, border: '1px solid rgba(76, 64, 247, 0.1)'}}>
        <h2 style={{marginBottom: 12, fontSize: 24, fontWeight: 700}}>Two-Factor Authentication (2FA)</h2>
        <p style={{marginBottom: 16, color: 'var(--muted)', lineHeight: 1.6}}>
          Enhance your account security with an authenticator app like Google Authenticator or Authy.
        </p>
        <p style={{marginBottom: 24}}>
          <strong>Status:</strong> <span style={{
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            background: isCheckingStatus 
              ? 'linear-gradient(135deg, #6366f1 0%, #4c40f7 100%)' 
              : twoFAEnabled 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: '#fff',
            display: 'inline-block'
          }}>
            {isCheckingStatus ? "Checking..." : twoFAEnabled ? "Enabled" : "Disabled"}
          </span>
        </p>

        <div className="settings-grid">
          <div className="settings-card">
            <h3 style={{marginBottom: 12, fontSize: 18, fontWeight: 700}}>Get QR Code</h3>
            <p style={{marginBottom: 16, color: 'var(--muted)', fontSize: 14}}>
              Scan the QR code with your authenticator app to set up 2FA.
            </p>
            <button className="rl-btn rl-btn-outline" onClick={fetchQr} disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Generating..." : "Generate QR"}
            </button>
            {qr && (
              <div style={{marginTop: 20, padding: 20, background: 'rgba(76, 64, 247, 0.03)', borderRadius: 12}}>
                <p style={{marginBottom: 12, fontWeight: 600}}>Scan this with your authenticator app:</p>
                <div style={{background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block'}}>
                  <img 
                    className="responsive-qr" 
                    src={qr}
                    alt="2FA QR" 
                    style={{display: 'block', width: 200, height: 200}}
                  />
                </div>
                {secret && (
                  <p style={{marginTop: 16, wordBreak: 'break-all', fontSize: 13, background: '#fff', padding: 12, borderRadius: 8}}>
                    <strong>Secret Key:</strong> {secret}
                  </p>
                )}
              </div>
            )}
          </div>

          {twoFAEnabled ? (
            <div className="settings-card">
              <h3 style={{marginBottom: 12, fontSize: 18, fontWeight: 700}}>Disable 2FA</h3>
              <p style={{marginBottom: 16, color: 'var(--muted)', fontSize: 14}}>
                Enter your 6-digit code from your authenticator app to disable 2FA.
              </p>
              <form onSubmit={handleDisable}>
                <input 
                  className="auth-input" 
                  placeholder="Enter 6-digit code" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  required 
                  maxLength={6}
                  pattern="[0-9]{6}"
                  style={{marginBottom: 12}}
                />
                <button 
                  className="rl-btn" 
                  type="submit" 
                  disabled={authStatus === "loading"} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    fontWeight: 700
                  }}>
                  {authStatus === "loading" ? "Disabling..." : "Disable 2FA"}
                </button>
              </form>
            </div>
          ) : (
            <div className="settings-card">
              <h3 style={{marginBottom: 12, fontSize: 18, fontWeight: 700}}>Enable 2FA</h3>
              <p style={{marginBottom: 16, color: 'var(--muted)', fontSize: 14}}>
                Generate a QR code first, then enter the 6-digit code from your authenticator app.
              </p>
              <form onSubmit={handleEnable}>
                <input 
                  className="auth-input" 
                  placeholder="Enter 6-digit code" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  required 
                  maxLength={6}
                  pattern="[0-9]{6}"
                  style={{marginBottom: 12}}
                />
                <button 
                  className="rl-btn rl-btn-primary" 
                  type="submit" 
                  disabled={!secret || authStatus === "loading"} 
                  style={{width: '100%'}}>
                  {authStatus === "loading" ? "Enabling..." : "Enable 2FA"}
                </button>
              </form>
            </div>
          )}
        </div>

        {message && (
          <p style={{
            marginTop: 20, 
            padding: 16, 
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            fontWeight: 600,
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>{message}</p>
        )}
        
        {errorMsg && (
          <p style={{
            marginTop: 20, 
            padding: 16, 
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            fontWeight: 600,
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>{errorMsg}</p>
        )}
        
        <style jsx>{`
          .settings-grid { display: flex; gap: 32px; flex-wrap: wrap; margin-top: 24px; }
          .settings-card { 
            min-width: 300px; 
            flex: 1 1 380px; 
            max-width: 520px; 
            background: rgba(76, 64, 247, 0.02);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid rgba(76, 64, 247, 0.1);
          }
          .responsive-qr { width: 200px; height: 200px; }
          @media (max-width: 640px) {
            .settings-grid { flex-direction: column; gap: 20px; }
            .settings-card { width: 100%; min-width: 0; max-width: 100%; }
            .responsive-qr { width: 100%; height: auto; max-width: 240px; }
            :global(.auth-input) { width: 100%; }
            :global(.rl-btn) { width: 100%; }
          }
        `}</style>
      </section>
    </div>
  );
}


