"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/dashboard");
  }
  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand"><span className="logo">R</span><div className="Tag">Ryllium</div></div>
          <div className="auth-title">Sign in</div>
          <p className="auth-sub">Welcome back! Access your account to continue trading.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input className="auth-input" type="email" placeholder="Email" required />
            <input className="auth-input" type="password" placeholder="Password" required />
            <button className="auth-btn" type="submit">Continue</button>
          </form>
          <div className="auth-alt">
            <a href="/reset">Forgot password?</a>
            <Link href="/signup">Create account</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">R</span><div className="Tag">Ryllium</div></div>
            <h2>Trade smarter with Ryllium</h2>
            <p>Bank-grade security, lightning-fast execution, and powerful analytics in one modern platform.</p>
          </div>
        </div>
      </div>
    </>
  );
}


