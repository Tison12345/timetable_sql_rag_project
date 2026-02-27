"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const PERSONAL_KEYWORDS = [
  "my timetable","my class","my classes","my schedule","my room",
  "i have today","do i have","my first class","my last class",
  "my exam","my assignment","my attendance","my grade","my result",
  "my course","enrolled","my subject","my batch","my faculty",
];

const isPersonalQuestion = (text) =>
  PERSONAL_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

const SUGGESTED = [
  { icon: "🏛️", text: "What departments does the college have?" },
  { icon: "📅", text: "When does the next semester start?" },
  { icon: "📚", text: "Where is the library located?" },
  { icon: "🎓", text: "How do I apply for admission?" },
];

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);
    setStarted(true);

    setMessages((prev) => [...prev, { role: "user", text: question }]);

    if (isPersonalQuestion(question)) {
      await new Promise((r) => setTimeout(r, 420));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "That's a personal question — I'll need to verify your identity first. Sign in with your college email to access your timetable, classes, and personal info.",
          action: { label: "Sign in with college email", href: "/login" },
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/ask-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer || "I couldn't find an answer to that. Try rephrasing." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error — please check the server and try again." },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body { height: 100%; overflow: hidden; }

        body {
          background: #0a0a0a;
          color: #ededed;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Subtle noise texture overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        /* Centered glow when not started */
        .hero-glow {
          position: fixed;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.8s ease;
        }

        /* Scroll area */
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s cubic-bezier(.22,1,.36,1) both; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-in { animation: fadeIn 0.4s ease both; }

        /* Typing dots */
        @keyframes blink { 0%,100%{opacity:.15} 50%{opacity:.9} }
        .dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.5);
          animation: blink 1.3s ease-in-out infinite;
          display: inline-block;
        }
        .dot:nth-child(2) { animation-delay: .2s; }
        .dot:nth-child(3) { animation-delay: .4s; }

        /* Send button */
        .send-btn {
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .send-btn:hover:not(:disabled) {
          transform: scale(1.04);
          box-shadow: 0 0 14px rgba(99,102,241,0.5);
        }
        .send-btn:active:not(:disabled) { transform: scale(0.97); }

        /* Suggest chips */
        .chip {
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          cursor: pointer;
        }
        .chip:hover {
          background: rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.2) !important;
          transform: translateY(-1px);
        }
        .chip:active { transform: scale(0.98); }

        /* Login button */
        .login-btn {
          transition: background 0.15s, box-shadow 0.15s;
        }
        .login-btn:hover {
          background: rgba(99,102,241,0.18) !important;
          box-shadow: 0 0 18px rgba(99,102,241,0.2);
        }

        /* Textarea */
        textarea {
          resize: none;
          scrollbar-width: none;
        }
        textarea::-webkit-scrollbar { display: none; }

        /* Action button */
        .action-btn {
          transition: opacity 0.15s, transform 0.15s;
        }
        .action-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero glow — fades when chat starts */}
      <div className="hero-glow" style={{ opacity: started ? 0 : 1 }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>

        {/* ── Header ── */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(10,10,10,0.8)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              boxShadow: "0 2px 12px rgba(99,102,241,0.35)",
              flexShrink: 0,
            }}>
              🎓
            </div>
            <div>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 17,
                letterSpacing: "-0.2px",
                color: "#f0f0f0",
                lineHeight: 1.1,
              }}>
                CampusAI
              </div>
              <div style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.28)",
                fontWeight: 400,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}>
                College Assistant
              </div>
            </div>
          </div>

          <button
            className="login-btn"
            onClick={() => router.push("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid rgba(99,102,241,0.35)",
              background: "rgba(99,102,241,0.08)",
              color: "#a5b4fc",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span>Student Login</span>
            <span style={{ fontSize: 12 }}>→</span>
          </button>
        </header>

        {/* ── Main content ── */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }} className="chat-scroll">

          {/* EMPTY STATE — centered hero */}
          {!started && (
            <div
              className="fade-in"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 24px 20px",
                textAlign: "center",
                gap: 32,
              }}
            >
              {/* Icon + headline */}
              <div>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  margin: "0 auto 20px",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
                }}>
                  🎓
                </div>
                <h1 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(26px, 4vw, 38px)",
                  fontWeight: 400,
                  letterSpacing: "-0.5px",
                  color: "#f0f0f0",
                  lineHeight: 1.2,
                  marginBottom: 10,
                }}>
                  How can I help you today?
                </h1>
                <p style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.35)",
                  maxWidth: 420,
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}>
                  Ask anything about the college. For personal info like your timetable,{" "}
                  <span
                    onClick={() => router.push("/login")}
                    style={{ color: "#818cf8", cursor: "pointer", textDecoration: "none" }}
                  >
                    sign in first
                  </span>.
                </p>
              </div>

              {/* Suggestion chips */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 10,
                width: "100%",
                maxWidth: 560,
              }}>
                {SUGGESTED.map((s) => (
                  <button
                    key={s.text}
                    className="chip"
                    onClick={() => sendMessage(s.text)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "13px 15px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 13,
                      lineHeight: 1.45,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {started && (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxWidth: 720,
              width: "100%",
              margin: "0 auto",
              padding: "28px 24px 8px",
              gap: 28,
            }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    background: msg.role === "user"
                      ? "rgba(255,255,255,0.07)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: msg.role === "assistant" ? "0 2px 10px rgba(99,102,241,0.25)" : "none",
                    marginTop: 2,
                  }}>
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>

                  {/* Content */}
                  <div style={{
                    maxWidth: "82%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: msg.role === "user"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                      background: msg.role === "user"
                        ? "rgba(99,102,241,0.18)"
                        : "rgba(255,255,255,0.05)",
                      border: msg.role === "user"
                        ? "1px solid rgba(99,102,241,0.25)"
                        : "1px solid rgba(255,255,255,0.07)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: msg.role === "user"
                        ? "rgba(210,210,255,0.95)"
                        : "rgba(237,237,237,0.88)",
                      letterSpacing: "0.01px",
                    }}>
                      {msg.text}
                    </div>

                    {msg.action && (
                      <button
                        className="action-btn"
                        onClick={() => router.push(msg.action.href)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: "1px solid rgba(99,102,241,0.4)",
                          background: "rgba(99,102,241,0.14)",
                          color: "#a5b4fc",
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        🔐 {msg.action.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="fade-up" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 2px 10px rgba(99,102,241,0.25)",
                    marginTop: 2,
                  }}>🤖</div>
                  <div style={{
                    padding: "15px 18px",
                    borderRadius: "4px 16px 16px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                  }}>
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* ── Input area ── */}
        <div style={{
          flexShrink: 0,
          padding: "12px 24px 20px",
          borderTop: started ? "1px solid rgba(255,255,255,0.05)" : "none",
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <div style={{
            maxWidth: 720,
            margin: "0 auto",
          }}>
            {/* Input box */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "10px 10px 10px 16px",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={() => {}} // handled via CSS :focus-within below
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about the college..."
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ededed",
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.6,
                  padding: "4px 0",
                  maxHeight: 160,
                  overflow: "auto",
                  fontWeight: 400,
                  caretColor: "#818cf8",
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  border: "none",
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.07)",
                  color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.2)",
                  fontSize: 16,
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: input.trim() && !loading ? "0 2px 10px rgba(99,102,241,0.3)" : "none",
                }}
              >
                ↑
              </button>
            </div>

            {/* Footer */}
            <p style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 11.5,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.1px",
            }}>
              For timetables & personal info —{" "}
              <span
                onClick={() => router.push("/login")}
                style={{
                  color: "rgba(129,140,248,0.6)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                sign in with your college email
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}