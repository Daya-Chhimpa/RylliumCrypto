"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  function handleSubmit(e){
    e.preventDefault();
    router.push("/dashboard");
  }
  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand"><span className="logo">R</span><div className="Tag">Ryllium</div></div>
          <div className="auth-title">Create your account</div>
          <p className="auth-sub">Join millions of traders on Ryllium. It only takes a minute.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input className="auth-input" type="text" placeholder="Full name" required />
            <input className="auth-input" type="email" placeholder="Email" required />
            <input className="auth-input" type="password" placeholder="Password" required />
            <button className="auth-btn" type="submit">Create account</button>
          </form>
          <div className="auth-alt">
            <span>Already have an account?</span>
            <Link href="/signin">Sign in</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">R</span><div className="Tag">Ryllium</div></div>
            <h2>Welcome to the future of crypto</h2>
            <p>Secure, fast, and intuitive. Build and grow your portfolio with confidence.</p>
          </div>
        </div>
      </div>
    </>
  );
}


