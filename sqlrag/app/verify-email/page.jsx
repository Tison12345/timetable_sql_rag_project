"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [msg, setMsg] = useState("Verifying your email...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setStatus("error");
      setMsg("Invalid or missing verification token.");
      return;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/verify-token?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMsg("Email verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      })
      .catch((err) => {
        console.error("Email verification failed:", err.response ? err.response.data : err.message);
        setStatus("error");
        setMsg(err.response?.data || "Verification failed. The token may be expired.");
      });
  }, [router]);

  return (
    <div className="root">
      <div className="bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid" />
      </div>

      <main className={`card ${status === "error" ? "card-error" : status === "success" ? "card-success" : ""}`}>
        <h1 className={`title ${status === "error" ? "title-error" : status === "success" ? "title-success" : ""}`}>
          {status === "loading" ? "Verifying..." : status === "success" ? "Success!" : "Verification Failed"}
        </h1>
        <p className="sub">{msg}</p>

        <div className="state-container">
          {status === "loading" && <div className="large-spinner" />}
          {status === "success" && (
            <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          )}
          {status === "error" && (
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          )}
        </div>

        {status === "error" && (
          <div className="action-container">
            <Link href="/login" className="btn-secondary">
              Go to Login
            </Link>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        .root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #08090c;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        .bg { position: absolute; inset: 0; pointer-events: none; }
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.16;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .b1 { width:500px; height:500px; background: radial-gradient(#c8a96e,#7a5c2e); top:-120px; left:-100px; }
        .b2 { width:380px; height:380px; background: radial-gradient(#4a6fa5,#1a2a4a); bottom:-80px; right:-80px; animation-delay:-6s; }
        .grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes drift { to { transform: translate(25px,18px) scale(1.07); } }

        .card {
          position: relative; z-index: 10;
          width: 100%; max-width: 400px;
          padding: 48px 44px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,.5);
          animation: rise .55s cubic-bezier(.16,1,.3,1) both;
          text-align: center;
          transition: border-color .3s, box-shadow .3s;
        }
        .card-error {
          border-color: rgba(220, 60, 60, 0.35);
          box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(220,60,60,.15), 0 0 40px rgba(200,40,40,.08);
        }
        .card-success {
          border-color: rgba(46, 204, 113, 0.35);
          box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(46, 204, 113,.15), 0 0 40px rgba(46, 204, 113,.08);
        }

        @keyframes rise { from { opacity:0; transform:translateY(24px); } }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size:36px; font-weight:300;
          color:#f0ece4; line-height:1.1;
          transition: color .3s;
        }
        .title-error { color: #e05555; }
        .title-success { color: #2ecc71; }

        .sub { margin-top:12px; font-size:14px; color:rgba(255,255,255,.5); font-weight:300; line-height: 1.5; }

        .state-container {
          margin: 40px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
        }

        .large-spinner {
          width: 48px; height: 48px;
          border: 3px solid rgba(255,255,255,.1);
          border-top-color: #c8a96e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform:rotate(360deg); } }

        .success-icon {
          width: 64px; height: 64px;
          color: #2ecc71;
          animation: scaleIn .5s cubic-bezier(.16,1,.3,1) both;
        }
        
        .error-icon {
          width: 64px; height: 64px;
          color: #e05555;
          animation: scaleIn .5s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .action-container {
          margin-top: 10px;
        }

        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center;
          width: 100%; height: 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: .04em;
          text-decoration: none;
          transition: background .2s, border-color .2s, transform .15s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}