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
          <div className="auth-brand"><span className="logo">S</span><div className="Tag">Satorem</div></div>
          <div className="auth-title">Create your account</div>
          <p className="auth-sub">Join millions of traders on Satorem. It only takes a minute.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="name-row" style={{display:'flex', gap:8, marginBottom: 12}}>
              <input name="firstName" className="auth-input" type="text" placeholder="First name" required style={{flex:1}} />
              <input name="lastName" className="auth-input" type="text" placeholder="Last name" required style={{flex:1}} />
            </div>
            
            <div style={{marginBottom: 12}}>
              <label style={{fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4, marginLeft: 4, padding: 0}}>Date of Birth</label>
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
                  style={{paddingRight: '40px'}}
                />
              </div>
            </div>

            <input name="email" className="auth-input" type="email" placeholder="Email" required style={{marginBottom: 12}} />
            <input name="password" className="auth-input" type="password" placeholder="Password" required style={{marginBottom: 20}} />
            
            <button className="auth-btn" type="submit" disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          {authError && <p style={{marginTop:12, color:'#ef4444', fontSize: 13, textAlign: 'center'}}>{authError}</p>}
          <div className="auth-alt">
            <span>Already have an account?</span>
            <Link href="/signin">Sign in</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">S</span><div className="Tag">Satorem</div></div>
            <h2>Welcome to the future of crypto</h2>
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



