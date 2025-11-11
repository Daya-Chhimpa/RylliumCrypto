"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchQr() {
    setMessage("");
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const demoSecret = "DEMO" + Math.random().toString(36).substring(7).toUpperCase();
      setSecret(demoSecret);
      setQr(`otpauth://totp/NBCrypto:demo@example.com?secret=${demoSecret}&issuer=NBCrypto`);
      setIsLoading(false);
    }, 800);
  }

  async function handleEnable(e) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Two-factor authentication enabled successfully!");
      setCode("");
      setTwoFAEnabled(true);
      setIsLoading(false);
    }, 1000);
  }

  async function handleDisable(e) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Two-factor authentication disabled successfully.");
      setCode("");
      setQr("");
      setSecret("");
      setTwoFAEnabled(false);
      setIsLoading(false);
    }, 1000);
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
            background: twoFAEnabled ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: '#fff',
            display: 'inline-block'
          }}>{twoFAEnabled ? "Enabled" : "Disabled"}</span>
        </p>

        <div className="settings-grid">
          <div className="settings-card">
            <h3 style={{marginBottom: 12, fontSize: 18, fontWeight: 700}}>Get QR Code</h3>
            <p style={{marginBottom: 16, color: 'var(--muted)', fontSize: 14}}>
              Scan the QR code with your authenticator app to set up 2FA.
            </p>
            <button className="rl-btn rl-btn-outline" onClick={fetchQr} disabled={isLoading}>
              {isLoading ? "Loading..." : "Generate QR"}
            </button>
            {qr && (
              <div style={{marginTop: 20, padding: 20, background: 'rgba(76, 64, 247, 0.03)', borderRadius: 12}}>
                <p style={{marginBottom: 12, fontWeight: 600}}>Scan this with your authenticator app:</p>
                <div style={{background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block'}}>
                  <img 
                    className="responsive-qr" 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr)}`} 
                    alt="2FA QR" 
                    style={{display: 'block'}}
                  />
                </div>
                <p style={{marginTop: 16, wordBreak: 'break-all', fontSize: 13, background: '#fff', padding: 12, borderRadius: 8}}>
                  <strong>Secret Key:</strong> {secret}
                </p>
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
                  disabled={isLoading} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    fontWeight: 700
                  }}>
                  {isLoading ? "Disabling..." : "Disable 2FA"}
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
                  disabled={!secret || isLoading} 
                  style={{width: '100%'}}>
                  {isLoading ? "Enabling..." : "Enable 2FA"}
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
            background: message.includes('disabled') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: message.includes('disabled') ? '#dc2626' : '#059669',
            fontWeight: 600
          }}>{message}</p>
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


