"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "@/store/slices/authSlice";
import { addToast } from "@/store/slices/uiSlice";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const authStatus = useSelector((s) => s.auth.status);
  const authError = useSelector((s) => s.auth.error);
  async function handleSubmit(e){
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dobValue = form.get("dob");
    
    // 18+ Validation
    if (!dobValue) {
      dispatch(addToast({ type: "error", title: "Required", description: "Please enter your date of birth." }));
      return;
    }

    const birthDate = new Date(dobValue);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      dispatch(addToast({ type: "error", title: "Age Restriction", description: "You must be at least 18 years old to register." }));
      return;
    }

    const payload = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      password: form.get("password"),
      dob: dobValue,
    };
    const res = await dispatch(registerThunk(payload));
    if (res.meta.requestStatus === "fulfilled") {
      const email = encodeURIComponent(payload.email || "");
      router.push(`/auth/confirm_email${email ? `?email=${email}` : ""}`);
    }
  }
  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
        input[type="date"]::-webkit-inner-spin-button,
        input[type="date"]::-webkit-clear-button {
          display: none;
        }
        input[type="date"] {
          color-scheme: dark;
          background-color: #1a1a2e !important;
          position: relative;
        }
        /* Custom calendar icon */
        .date-input-container::after {
          content: '📅';
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          opacity: 0.6;
          font-size: 14px;
        }
      `}</style>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-side-content">
            <div className="auth-brand" style={{ marginBottom: 16 }}><span className="logo">S</span><div className="Tag">Satorem</div></div>
            <div className="auth-title" style={{ fontSize:30, fontWeight:800, marginBottom:6 }}>Create your account</div>
            <p className="auth-sub" style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Join millions of traders. takes a minute.</p>
            <form className="auth-form" onSubmit={handleSubmit} style={{ gap: 10 }}>
              <div className="name-row" style={{display:'flex', gap:8, marginBottom: 8}}>
                <input name="firstName" className="auth-input" type="text" placeholder="First name" required style={{flex:1, height: 40}} />
                <input name="lastName" className="auth-input" type="text" placeholder="Last name" required style={{flex:1, height: 40}} />
              </div>
              
              <div style={{marginBottom: 8}}>
                <label style={{fontSize: 11, color: '#9ca3af', display: 'block', marginBottom: 2, marginLeft: 4}}>Date of Birth</label>
                <div className="date-input-container" style={{position: 'relative'}}>
                  <input 
                    name="dob" 
                    className="auth-input" 
                    type="date" 
                    required 
                    max={new Date().toISOString().split("T")[0]}
                    onClick={(e) => {
                      try {
                        if (typeof e.target.showPicker === 'function') {
                          e.target.showPicker();
                        }
                      } catch (err) {}
                    }}
                    style={{paddingRight: '40px', height: 40}}
                  />
                </div>
              </div>

              <input name="email" className="auth-input" type="email" placeholder="Email" required style={{marginBottom: 8, height: 40}} />
              <input name="password" className="auth-input" type="password" placeholder="Password" required style={{marginBottom: 16, height: 40}} />
              
              <button className="auth-btn" type="submit" disabled={authStatus === "loading"} style={{ height: 42 }}>
                {authStatus === "loading" ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            {authError && <p style={{marginTop:12, color:'#ef4444', fontSize: 12, textAlign: 'center'}}>{authError}</p>}
            <div className="auth-alt" style={{ marginTop: 20, fontSize: 13 }}>
              <span style={{ color: '#9ca3af' }}>Already have an account?</span>
              <Link href="/signin" style={{ color: '#8b5cf6', fontWeight: 600 }}>Sign in</Link>
            </div>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">S</span><div className="Tag">Satorem</div></div>
            <h2 style={{ fontSize:48, fontWeight:800, color:"#fff", marginBottom:16 }}>Welcome to the future of crypto</h2>
            <p>Secure, fast, and intuitive. Build and grow your portfolio with confidence.</p>
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



