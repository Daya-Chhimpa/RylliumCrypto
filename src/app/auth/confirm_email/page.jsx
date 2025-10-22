"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confirmEmailThunk } from "@/store/slices/authSlice";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const [done, setDone] = useState(false);
  const email = searchParams.get("email");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    (async () => {
      const res = await dispatch(confirmEmailThunk({ token }));
      if (res.meta.requestStatus === "fulfilled") {
        setDone(true);
        setTimeout(() => router.push("/signin"), 1200);
      }
    })();
  }, [dispatch, router, searchParams]);

  return (
    <div style={{padding:24}}>
      <h1>Email confirmation</h1>
      {!searchParams.get("token") && (
        <>
          <p>
            We have sent a confirmation link to {email ? <b>{email}</b> : "your email"}. Please open the link from your inbox to activate your account.
          </p>
          <p>If you don’t see the email, check your spam folder.</p>
        </>
      )}
      {status === "loading" && <p>Confirming...</p>}
      {done && <p>Confirmed! Redirecting to sign in...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}


