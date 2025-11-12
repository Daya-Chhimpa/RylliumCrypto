"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordThunk } from "@/store/slices/authSlice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    
    console.log("📤 Submitting forgot password for email:", email);
    const res = await dispatch(forgotPasswordThunk({ email }));
    console.log("📥 Forgot password response:", res);
    
    if (res.meta.requestStatus === "fulfilled") {
      // Show success message and redirect
      alert("Password reset link sent! Check your email.");
      router.push("/signin");
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
          <div className="auth-title">Reset your password</div>
          <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <button className="auth-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Send reset link"}
            </button>
          </form>
          {error && <p style={{marginTop:12,color:'#ef4444',fontWeight:600,fontSize:'14px'}}>{error}</p>}
          <div className="auth-alt">
            <Link href="/signin">Back to sign in</Link>
            <Link href="/signup">Create account</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <img src="/crypto.png" alt="Crypto Security" className="auth-crypto-img" />
            <div className="auth-brand" style={{justifyContent:'center', marginTop: '16px'}}>
              <img src="/NB.png" alt="NB" style={{width: '36px', height: '36px', borderRadius: '9px'}} />
              <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
            </div>
            <h2>Security first</h2>
            <p>We keep your account protected with best-in-class security.</p>
          </div>
        </div>
      </div>
    </>
  );
}
