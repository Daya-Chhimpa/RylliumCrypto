"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const email = searchParams.get("email");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDone(true);
      setIsLoading(false);
      setTimeout(() => router.push("/signin"), 1500);
    }, 1000);
  }, [router, searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'linear-gradient(135deg, rgba(76, 64, 247, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
    }}>
      <div style={{
        background: '#fff',
        padding: 48,
        borderRadius: 24,
        maxWidth: 500,
        width: '100%',
        border: '1px solid rgba(76, 64, 247, 0.1)',
        boxShadow: '0 10px 40px rgba(76, 64, 247, 0.12)',
        textAlign: 'center'
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 24px rgba(76, 64, 247, 0.25)',
          padding: 8
        }}>
          <img src="/NB.png" alt="NB" style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16}} />
        </div>
        
        <h1 style={{fontSize: 32, fontWeight: 800, marginBottom: 16, color: '#1a1a1a'}}>
          Email Confirmation
        </h1>
        
        {!searchParams.get("token") && (
          <>
            <p style={{color: '#6c757d', marginBottom: 12, lineHeight: 1.6}}>
              We have sent a confirmation link to {email ? <b style={{color: '#1a1a1a'}}>{email}</b> : "your email"}. 
            </p>
            <p style={{color: '#6c757d', lineHeight: 1.6}}>
              Please open the link from your inbox to activate your account.
            </p>
            <p style={{color: '#6c757d', marginTop: 16, fontSize: 14}}>
              If you don't see the email, check your spam folder.
            </p>
          </>
        )}
        
        {isLoading && (
          <p style={{color: '#4c40f7', fontWeight: 600}}>Confirming your email...</p>
        )}
        
        {done && (
          <div>
            <p style={{
              color: '#059669',
              fontWeight: 600,
              padding: 16,
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 12,
              marginTop: 16
            }}>
              ✓ Email confirmed successfully!
            </p>
            <p style={{color: '#6c757d', marginTop: 12}}>Redirecting to sign in...</p>
          </div>
        )}
        
        {error && (
          <p style={{
            color: '#dc2626',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: 16,
            borderRadius: 12,
            marginTop: 16,
            fontWeight: 600
          }}>{error}</p>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Loading...</p>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}


