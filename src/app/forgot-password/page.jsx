"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Password reset link sent to your email!");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }, 1000);
  }

  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand">
            <img src="/NB.png" alt="NB" style={{width: '40px', height: '40px', borderRadius: '10px'}} />
            <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
          </div>
          <div className="auth-title">Reset your password</div>
          <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <button className="auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          {message && <p style={{marginTop: 10, color: '#059669', fontWeight: 600, fontSize: '13px'}}>{message}</p>}
          <div className="auth-alt">
            <Link href="/signin">Back to sign in</Link>
            <Link href="/signup">Create account</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <img src="/crypto.png" alt="Crypto Security" className="auth-crypto-img" />
            <div className="auth-brand" style={{justifyContent:'center', marginTop: '24px'}}>
              <img src="/NB.png" alt="NB" style={{width: '48px', height: '48px', borderRadius: '12px'}} />
              <div className="Tag">NB Crypto</div>
            </div>
            <h2>Security first</h2>
            <p>We keep your account protected with best-in-class security measures and encryption.</p>
          </div>
        </div>
      </div>
    </>
  );
}



