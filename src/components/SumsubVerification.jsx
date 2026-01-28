"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SumsubWebSdk from "@sumsub/websdk-react";
import { startKycThunk, checkKycStatusThunk } from "@/store/slices/authSlice";

export default function SumsubVerification({ onCompleted, initialStatus }) {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [verificationStatus, setVerificationStatus] = useState(initialStatus || null);

  useEffect(() => {
    // If not passed initially, verify current status on mount
    if (!initialStatus) checkStatus();
  }, [initialStatus]);

  const checkStatus = async () => {
    const res = await dispatch(checkKycStatusThunk()).unwrap();
    if (res?.kycStatus) setVerificationStatus(res.kycStatus.toUpperCase());
  };

  const fetchToken = async () => {
    try {
      setStatus("loading");
      const res = await dispatch(startKycThunk()).unwrap();
      const token = res?.accessToken || res?.token;
      if (token) {
        setAccessToken(token);
        setStatus("active_sdk");
      }
    } catch (err) {
      console.error("KYC Token Error:", err);
      setStatus("error");
    }
  };

  const expirationHandler = async () => {
      const res = await dispatch(startKycThunk()).unwrap();
      return res?.accessToken || res?.token;
  };

  // Render Logic
  if (status === "active_sdk" && accessToken) {
    return (
      <div style={{ height: 400 }}>
        <SumsubWebSdk
            accessToken={accessToken}
            expirationHandler={expirationHandler}
            options={{ adaptIframeHeight: true }}
            onMessage={(type) => {
                if (type === "idCheck.onApplicantSubmitted") {
                    if (onCompleted) onCompleted();
                }
            }}
            onError={(e) => console.error("Sumsub Error:", e)}
        />
      </div>
    );
  }

  return (
    <div>
      {verificationStatus === 'APPROVED' ? <p>✅ Verified</p> : 
       verificationStatus === 'PENDING' ? <p>⏳ Pending Review</p> :
       <button onClick={fetchToken} className="rl-btn rl-btn-primary">Start Verification</button>}
    </div>
  );
}
