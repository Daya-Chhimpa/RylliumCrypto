"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function SignUpContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration - just for UI demo
    setTimeout(() => {
      const form = new FormData(e.currentTarget);
      const email = form.get("email");
      router.push(`/auth/confirm_email${email ? `?email=${encodeURIComponent(email)}` : ""}`);
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
          <div className="auth-title">Create your account</div>
          <p className="auth-sub">Join thousands of traders. It only takes a minute.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="name-row" style={{display:'flex', gap:8}}>
              <input name="firstName" className="auth-input" type="text" placeholder="First name" required />
              <input name="lastName" className="auth-input" type="text" placeholder="Last name" required />
            </div>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <input name="password" className="auth-input" type="password" placeholder="Password" required />
            <button className="auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <div className="auth-alt">
            <span>Already have an account?</span>
            <Link href="/signin">Sign in</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <img src="/crypto.png" alt="Crypto Trading" className="auth-crypto-img" />
            <div className="auth-brand" style={{justifyContent:'center', marginTop: '16px'}}>
              <img src="/NB.png" alt="NB" style={{width: '36px', height: '36px', borderRadius: '9px'}} />
              <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
            </div>
            <h2>Welcome to the future of crypto</h2>
            <p>Secure, fast, and intuitive. Build and grow your portfolio.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="auth-wrap"><div className="auth-side"><div className="auth-title">Create your account</div><p>Loading...</p></div></div>}>
      <SignUpContent />
    </Suspense>
  );
}



