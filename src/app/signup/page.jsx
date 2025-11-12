"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "@/store/slices/authSlice";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const authStatus = useSelector((s) => s.auth.status);
  const authError = useSelector((s) => s.auth.error);

  async function handleSubmit(e){
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      password: form.get("password"),
    };
    
    console.log("📤 Submitting signup with payload:", payload);
    const res = await dispatch(registerThunk(payload));
    console.log("📥 Signup response:", res);
    
    if (res.meta.requestStatus === "fulfilled") {
      // Redirect to confirmation instructions page
      const email = encodeURIComponent(payload.email || "");
      router.push(`/auth/confirm_email${email ? `?email=${email}` : ""}`);
    }
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
            <button className="auth-btn" type="submit" disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Creating account..." : "Create account"}
            </button>
          </form>
          {authError && <p style={{marginTop:12,color:'#ef4444',fontWeight:600,fontSize:'14px'}}>{authError}</p>}
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
