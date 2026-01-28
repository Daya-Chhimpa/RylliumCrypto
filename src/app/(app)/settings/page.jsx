"use client";

import { useEffect, useState } from "react";
import SumsubWebSdk from "@sumsub/websdk-react";
import { apiRequest, endpoints } from "@/lib/api";

export default function SettingsPage() {
  const [kycStatus, setKycStatus] = useState(null); // APPROVED, PENDING, FAILED, NEW, etc.
  const [loading, setLoading] = useState(true);
  const [startingKyc, setStartingKyc] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiRequest(endpoints.getKycStatus());
      setKycStatus(res?.kycStatus || "NEW");
    } catch (e) {
      console.error("Failed to fetch KYC status:", e);
      setKycStatus("NEW"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStartKyc = async () => {
    try {
      setStartingKyc(true);
      setError("");
      const res = await apiRequest(endpoints.startKyc(), { method: "POST" });
      
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
      } else {
        throw new Error(res?.message || "Failed to start KYC");
      }
    } catch (e) {
      console.error("Error starting KYC:", e);
      setError(e.message || "Unable to start verification service.");
    } finally {
      setStartingKyc(false);
    }
  };

  const onSumsubMessage = (data) => {
    console.log("Sumsub message:", data);
  };

  const onSumsubError = (data) => {
    console.error("Sumsub error:", data);
    setError("An error occurred during verification.");
  };

  if (loading) {
    return (
      <div className="rl-content">
        <h1 className="rl-page-title">Settings</h1>
        <div className="card loading-card">
          <div className="spinner"></div>
          <p>Checking status...</p>
        </div>
        <style jsx>{`
          .loading-card { padding: 60px; text-align: center; }
          .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid var(--primary); border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          p { color: var(--muted); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Settings <span>& Security</span></h1>
      
      <div className="settings-layout">
        <section className="card kyc-card">
          <div className="card-header">
            <h2 className="section-title">Identity Verification</h2>
            <p className="section-desc">Verify your identity to unlock higher withdrawal limits and full trading features.</p>
          </div>
          
          {accessToken ? (
            <div className="sumsub-wrapper">
               <SumsubWebSdk
                accessToken={accessToken}
                updateAccessToken={() => {}}
                expirationHandler={() => {}}
                config={{
                  lang: "en",
                  i18n: {
                    document: {
                      subTitles: {
                        IDENTITY: "Upload a document that proves your identity",
                      },
                    },
                  },
                  uiConf: {
                    customCssStr: ":root { --black: #ffffff; --grey: #101633; --grey-darker: #a0aec0; --border-color: #1e2847; --icon-color: #3b82f6; --blue: #3b82f6; --green: #10b981; --red: #ef4444; --orange: #f59e0b; --yellow: #f59e0b; --background-color: #070b1f; --text-color: #ffffff; }",
                  },
                }}
                options={{ addViewportTag: false, adaptIframeHeight: true }}
                onMessage={onSumsubMessage}
                onError={onSumsubError}
              />
              <button className="rl-btn rl-btn-outline cancel-btn" onClick={() => { setAccessToken(""); fetchStatus(); }}>
                Cancel Verification
              </button>
            </div>
          ) : (
            <div className="status-container">
              {kycStatus === "APPROVED" && (
                <div className="status-box success">
                  <div className="icon-glow success">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3>Verified Account</h3>
                  <p>Your identity has been successfully verified. You have full access to all features.</p>
                </div>
              )}

              {kycStatus === "PENDING" && (
                <div className="status-box warning">
                  <div className="icon-glow warning">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h3>Verification Pending</h3>
                  <p>Your documents are under review. This usually takes less than 24 hours.</p>
                  <button className="rl-btn rl-btn-outline" onClick={fetchStatus} style={{marginTop: 20}}>
                    Refresh Status
                  </button>
                </div>
              )}

              {(kycStatus !== "APPROVED" && kycStatus !== "PENDING") && (
                <div className="status-box default">
                   <div className="status-content">
                    {kycStatus === "FAILED" && (
                      <div className="alert-error">
                        Verification failed. Please ensure your documents are clear and try again.
                      </div>
                    )}
                    
                    <div className="benefit-list">
                      <div className="benefit-item">
                        <div className="check">✓</div>
                        <span>Unlimited Crypto Deposits</span>
                      </div>
                      <div className="benefit-item">
                        <div className="check">✓</div>
                        <span>Higher Withdrawal Limits</span>
                      </div>
                      <div className="benefit-item">
                        <div className="check">✓</div>
                        <span>P2P Trading Access</span>
                      </div>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button 
                      className="rl-btn rl-btn-primary start-btn" 
                      onClick={handleStartKyc} 
                      disabled={startingKyc}
                    >
                      {startingKyc ? "Initializing..." : "Start Verification"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .settings-layout { max-width: 800px; }
        .kyc-card { overflow: hidden; position: relative; }
        .card-header { padding: 32px 32px 24px; border-bottom: 1px solid var(--card-border); }
        .section-title { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .section-desc { color: var(--muted); font-size: 14px; line-height: 1.5; }

        .sumsub-wrapper { padding: 0; min-height: 600px; background: #070b1f; }
        .cancel-btn { margin: 24px auto; display: block; }
        
        .status-container { padding: 40px 32px; }
        
        .status-box { text-align: center; }
        .status-box.default { text-align: left; }
        
        .icon-glow { width: 64px; height: 64px; border-radius: 20px; display: grid; place-items: center; margin: 0 auto 24px; }
        .icon-glow.success { background: rgba(16, 185, 129, 0.1); color: #10b981; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); }
        .icon-glow.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; box-shadow: 0 0 30px rgba(245, 158, 11, 0.2); }
        
        .status-box h3 { font-size: 22px; margin-bottom: 12px; color: var(--text); }
        .status-box p { color: var(--muted); max-width: 400px; margin: 0 auto; line-height: 1.6; }

        .benefit-list { display: grid; gap: 16px; margin-bottom: 32px; }
        .benefit-item { display: flex; align-items: center; gap: 12px; color: var(--muted); font-size: 15px; }
        .check { 
          width: 24px; height: 24px; border-radius: 50%; 
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%); 
          color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: bold;
          box-shadow: var(--shadow-glow);
        }

        .alert-error { 
          background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); 
          color: #ef4444; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; 
        }
        
        .error-msg { color: #ef4444; margin-bottom: 16px; }
        
        .start-btn { width: 100%; height: 50px; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; }
        
        @media (min-width: 640px) {
          .status-content { max-width: 360px; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
}
