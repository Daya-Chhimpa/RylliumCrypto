"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { preEnable2faThunk, enable2faThunk, disable2faThunk } from "@/store/slices/authSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function fetchQr() {
    setMessage("");
    const res = await dispatch(preEnable2faThunk());
    if (res.meta.requestStatus === "fulfilled") {
      const data = res.payload || {};
      setSecret(data.secret || "");
      setQr(data.uri || "");
    }
  }

  async function handleEnable(e) {
    e.preventDefault();
    setMessage("");
    const res = await dispatch(enable2faThunk({ code, secret }));
    if (res.meta.requestStatus === "fulfilled") {
      setMessage("Two-factor authentication enabled");
      setCode("");
    }
  }

  async function handleDisable(e) {
    e.preventDefault();
    setMessage("");
    const res = await dispatch(disable2faThunk({ code }));
    if (res.meta.requestStatus === "fulfilled") {
      setMessage("Two-factor authentication disabled. Account temporarily locked as a precaution.");
      setCode("");
      setQr("");
      setSecret("");
    }
  }

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Settings</h1>
      <section className="card" style={{padding:16}}>
        <h2 style={{marginBottom:8}}>Two-Factor Authentication (2FA)</h2>
        <p style={{marginBottom:12}}>Enhance your account security with an authenticator app.</p>

        <div className="settings-grid">
          <div className="settings-card">
            <h3 style={{marginBottom:8}}>Step 1: Get QR Code</h3>
            <button className="rl-btn rl-btn-outline" onClick={fetchQr} disabled={status === "loading"}>Get QR</button>
            {qr && (
              <div style={{marginTop:12}}>
                <p style={{marginBottom:8}}>Scan this with Google Authenticator/1Password/Authy:</p>
                <img className="responsive-qr" src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qr)}`} alt="2FA QR" />
                <p style={{marginTop:8, wordBreak:'break-all'}}><strong>Secret:</strong> {secret}</p>
              </div>
            )}
          </div>

          <div className="settings-card">
            <h3 style={{marginBottom:8}}>Step 2: Enable 2FA</h3>
            <form onSubmit={handleEnable}>
              <input className="auth-input" placeholder="6-digit code" value={code} onChange={(e)=>setCode(e.target.value)} required />
              <button className="rl-btn rl-btn-primary" type="submit" disabled={!secret || status === "loading"} style={{marginTop:8}}>Enable</button>
            </form>
          </div>

          <div className="settings-card">
            <h3 style={{marginBottom:8}}>Disable 2FA</h3>
            <form onSubmit={handleDisable}>
              <input className="auth-input" placeholder="6-digit code" value={code} onChange={(e)=>setCode(e.target.value)} required />
              <button className="rl-btn rl-btn-danger" type="submit" disabled={status === "loading"} style={{marginTop:8}}>Disable</button>
            </form>
          </div>
        </div>

        {status === "loading" && <p style={{marginTop:12}}>Working...</p>}
        {message && <p style={{marginTop:12, color:'green'}}>{message}</p>}
        {error && <p style={{marginTop:12, color:'red'}}>{error}</p>}
        <style jsx>{`
          .settings-grid { display: flex; gap: 24px; flex-wrap: wrap; }
          .settings-card { min-width: 280px; flex: 1 1 320px; max-width: 480px; }
          .responsive-qr { width: 180px; height: 180px; }
          @media (max-width: 640px) {
            .settings-grid { flex-direction: column; gap: 16px; }
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


