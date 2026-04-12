"use client";

import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("Welcome back");
  const [googleReady, setGoogleReady] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isError, setIsError] = useState(false);

  const googleurl = `${process.env.NEXT_PUBLIC_BACKENDURL}/auth/google/token`;
  const url = `${process.env.NEXT_PUBLIC_BACKENDURL}/auth/login`;
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;

    script.onload = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      setGoogleReady(true);
    };

    document.body.appendChild(script);
  }, []);

  function handleCredentialResponse(response) {
    const token = response.credential;
    axios
      .post(googleurl, { token }, { withCredentials: true })
      .then(() => router.push("/chat"))
      .catch((err) => console.log(err.response.data));
  }


  const handleVerifyEmail = () => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/verify-Email`, { email }, { withCredentials: true })
      .then(() => {
        console.log("Verification email resent successfully");
        setMsg("Verification email resent! Check your inbox.");
      })
      .catch((err) => {
        console.log(err.response.data);
        setMsg("Failed to resend verification email. Try again later.");
      });
  }

  const handleGoogleLogin = () => {
    if (!googleReady || !window.google?.accounts?.id) return;
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const container = document.getElementById("g_id_hidden");
        if (container) {
          container.innerHTML = "";
          window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            type: "standard",
          });
          const btn = container.querySelector("div[role=button]");
          if (btn) btn.click();
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    axios
      .post(url, { email, password }, { withCredentials: true })
      .then((response) => {
        setMsg(response.data);
        router.push("/chat");
      })
      .catch((error) => {
        if (error.response?.data?.toLowerCase() === "email not verified") {
          setVerifying(true);                          
          setIsError(false);
          setMsg("Email Not verified");
        } else {
          console.log(error.response?.data);
          setMsg(error.response?.data || "Login failed");
          setVerifying(false);
          setIsError(true);
        }
      });
  };

  return (
    <div className="root">
      <div className="bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid" />
      </div>

      <main className={`card ${verifying || isError ? "card-error" : ""}`}>
        <h1 className={`title ${verifying || isError ? "title-error" : ""}`}>{msg}</h1>
        <p className="sub">
          {verifying
            ? "Check your inbox and verify your email to continue"
            : isError 
            ? "Please check your credentials and try again"
            : "Sign in to continue"}
        </p>

        <div
          id="g_id_hidden"
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        />

        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text">or</span>
          <span className="divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {setEmail(e.target.value); setIsError(false); setVerifying(false); setMsg("Welcome back");}}
              className={verifying || isError ? "input-error" : ""}
              required
            />
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password" className="forgot">Forgot?</Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {setPassword(e.target.value); setIsError(false); setVerifying(false); setMsg("Welcome back");}}
              className={verifying || isError ? "input-error" : ""}
              required
            />
          </div>

          {/* ✅ Fixed: proper JSX ternary for the button */}
          <button
  type={verifying ? "button" : "submit"}
  disabled={loading}
  className={verifying || isError ? "btn-error" : ""}
  onClick={verifying ? handleVerifyEmail : undefined}
>
  {loading ? (
    <span className="spinner" />
  ) : verifying ? (
    "Verify Email"
  ) : (
    "Sign In"
  )}
</button>
        </form>

        <p className="footer">
          No account? <Link href="/register">Create one</Link>
        </p>
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
          transition: border-color .3s, box-shadow .3s;
        }
        /* Red card glow when unverified */
        .card-error {
          border-color: rgba(220, 60, 60, 0.35);
          box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(220,60,60,.15), 0 0 40px rgba(200,40,40,.08);
        }
        @keyframes rise { from { opacity:0; transform:translateY(24px); } }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size:36px; font-weight:300;
          color:#f0ece4; line-height:1.1;
          transition: color .3s;
        }
        /* Red title */
        .title-error { color: #e05555; }

        .sub { margin-top:7px; font-size:13.5px; color:rgba(255,255,255,.35); font-weight:300; }

        .google-btn {
          margin-top: 24px;
          width: 100%; height: 48px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 10px;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          letter-spacing: .02em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background .2s, border-color .2s, transform .15s;
        }
        .google-btn:hover {
          background: rgba(255,255,255,.11);
          border-color: rgba(255,255,255,.22);
          transform: translateY(-1px);
        }
        .google-icon { flex-shrink: 0; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0 4px;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,.09); }
        .divider-text {
          font-size: 11px; font-weight: 500;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(255,255,255,.25);
        }

        form { margin-top:6px; display:flex; flex-direction:column; gap:18px; }
        .field { display:flex; flex-direction:column; gap:7px; }
        .label-row { display:flex; justify-content:space-between; align-items:center; }

        label {
          font-size:11.5px; font-weight:500;
          letter-spacing:.09em; text-transform:uppercase;
          color:rgba(255,255,255,.4);
        }
        .forgot { font-size:11.5px; color:#c8a96e; text-decoration:none; opacity:.75; transition:opacity .2s; }
        .forgot:hover { opacity:1; }

        input {
          padding:13px 15px;
          background:rgba(255,255,255,.055);
          border:1px solid rgba(255,255,255,.1);
          border-radius:10px;
          color:#f0ece4;
          font-family:'DM Sans',sans-serif; font-size:14px;
          outline:none;
          transition:border-color .2s, background .2s;
        }
        input::placeholder { color:rgba(255,255,255,.2); }
        input:focus { border-color:rgba(200,169,110,.5); background:rgba(255,255,255,.08); }

        /* Red input border when unverified */
        input.input-error { border-color: rgba(220,60,60,.45); }
        input.input-error:focus { border-color: rgba(220,60,60,.75); background:rgba(255,255,255,.08); }

        button[type="submit"] {
          margin-top:6px; width:100%; height:48px;
          background:linear-gradient(135deg,#c8a96e,#a07840);
          border:none; border-radius:10px;
          color:#1a1206;
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; letter-spacing:.04em;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition: opacity .2s, transform .15s, background .3s;
        }
        button[type="submit"]:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
        button[type="submit"]:disabled { opacity:.65; cursor:not-allowed; }

        /* Red submit button when unverified */
        button[type="submit"].btn-error {
          background: linear-gradient(135deg, #c0392b, #922b21);
          color: #fff;
        }
        button[type="submit"].btn-error:hover:not(:disabled) {
          opacity: .88;
        }

        .spinner {
          width:17px; height:17px;
          border:2px solid rgba(26,18,6,.3);
          border-top-color:#1a1206;
          border-radius:50%;
          animation:spin .7s linear infinite;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .footer { margin-top:26px; text-align:center; font-size:13px; color:rgba(255,255,255,.3); }
        .footer a { color:#c8a96e; text-decoration:none; font-weight:500; }
        .footer a:hover { opacity:.8; }
      `}</style>
    </div>
  );
}