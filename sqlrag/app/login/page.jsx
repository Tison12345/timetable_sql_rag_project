"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("Welcome back");

  const url="http://localhost:8080/auth/login";
  let router=useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    axios.post(url,{
        email:email,
        password:password
    },{
      withCredentials:true
    }).then((response)=>{
        setMsg(response.data);
        console.log(response.data);
        router.push("/");
        
        router.push("/");
    }).catch((error)=>{
      console.log(error.data);
        setMsg(error.data);
    });
  };

  return (
    <div className="root">
      <div className="bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid" />
      </div>

      <main className="card">
        

        <h1 className="title">{msg}</h1>
        <p className="sub">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password" className="forgot">Forgot?</Link>
            </div>
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="footer">No account? <Link href="/register">Create one</Link></p>
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
        }
        @keyframes rise { from { opacity:0; transform:translateY(24px); } }

        .brand { display:flex; align-items:center; gap:9px; margin-bottom:36px; }
        .mark { font-size:18px; color:#c8a96e; }
        .name {
          font-family: 'Cormorant Garamond', serif;
          font-size:14px; font-weight:500;
          letter-spacing:.28em; text-transform:uppercase;
          color: rgba(255,255,255,.6);
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size:36px; font-weight:300;
          color:#f0ece4; line-height:1.1;
        }
        .sub { margin-top:7px; font-size:13.5px; color:rgba(255,255,255,.35); font-weight:300; }

        form { margin-top:30px; display:flex; flex-direction:column; gap:18px; }

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

        button {
          margin-top:6px; width:100%; height:48px;
          background:linear-gradient(135deg,#c8a96e,#a07840);
          border:none; border-radius:10px;
          color:#1a1206;
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; letter-spacing:.04em;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:opacity .2s, transform .15s;
        }
        button:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
        button:disabled { opacity:.65; cursor:not-allowed; }

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