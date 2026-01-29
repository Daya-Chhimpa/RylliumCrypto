"use client";

import SumsubVerification from "@/components/SumsubVerification";

export default function SettingsPage() {
  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Settings</h1>
      <section className="card" style={{padding:24}}>
        <h2 style={{marginBottom:16}}>Identity Verification</h2>
        <p style={{marginBottom:24, color:'var(--muted)'}}>
          Complete your KYC verification to access full trading features and higher limits.
        </p>
        
        <SumsubVerification 
          onCompleted={() => console.log("Verification completed!")} 
        />
      </section>
    </div>
  );
}


