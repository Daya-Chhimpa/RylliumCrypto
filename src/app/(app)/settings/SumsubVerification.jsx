"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import SumsubWebSdk from "@sumsub/websdk-react";
import { apiRequest, endpoints } from "@/lib/api";

export default function SumsubVerification({ onCompleted }) {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, ready, error
  const [errorMsg, setErrorMsg] = useState("");

  const fetchToken = async () => {
    try {
      setStatus("loading");
      // Ensure this endpoint exists on your backend!
      const endpoint = endpoints?.sumsubAccessToken ? endpoints.sumsubAccessToken() : "/sumsub/access-token";
      
      const res = await apiRequest(endpoint);
      // Handle different possible response structures
      const token = res?.token || res?.access_token;
      
      if (token) {
        setAccessToken(token);
        setStatus("ready");
      } else {
        throw new Error("No access token returned from backend");
      }
    } catch (err) {
      console.error("Failed to fetch Sumsub token:", err);
      setErrorMsg(err.message || "Failed to initialize verification");
      setStatus("error");
    }
  };

  const expirationHandler = async () => {
    try {
      const endpoint = endpoints?.sumsubAccessToken ? endpoints.sumsubAccessToken() : "/sumsub/access-token";
      const res = await apiRequest(endpoint);
      return res?.token || res?.access_token;
    } catch (err) {
      console.error("Failed to refresh Sumsub token:", err);
      throw err;
    }
  };

  const config = {
    lang: "en", 
    i18n: {
      document: {
        subTitles: {
          IDENTITY: "Upload a document that proves your identity",
        },
      },
    },
    onMessage: (type, payload) => {
      console.log("Sumsub Message:", type, payload);
      // Logic for completion
      if (type === "idCheck.onApplicantStatusChanged" && payload.reviewStatus === "completed") {
        
        console.log("Verification completed, triggering refresh...");
        // Wait a moment for backend webhook
        setTimeout(() => {
          if (onCompleted) onCompleted();
        }, 3000); 
      }
    },
    onError: (error) => {
      console.error("Sumsub Error:", error);
    },
  };

  const options = {
    addViewportTag: false,
    adaptIframeHeight: true,
  };

  if (status === "loading") {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
        <p className="text-gray-600">Initializing secure verification session...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <p className="font-semibold">Unable to start verification</p>
        <p className="text-sm opacity-75 mt-1">{errorMsg}</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="mb-4">
          <svg className="mx-auto h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Verify your Identity</h4>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          To comply with regulations and ensure the security of your account, please complete a quick identity verification.
        </p>
        <button 
          onClick={fetchToken}
          className="rl-btn rl-btn-primary px-6 py-2.5 rounded-lg shadow-sm font-medium transition-all hover:shadow-md"
        >
          Start Verification
        </button>
      </div>
    );
  }

  return (
    <div className="sumsub-container bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {accessToken && (
        <SumsubWebSdk
          accessToken={accessToken}
          expirationHandler={expirationHandler}
          config={config}
          options={options}
          onMessage={(data) => console.log("onMessage", data)}
          onError={(data) => console.error("onError", data)}
        />
      )}
    </div>
  );
}
