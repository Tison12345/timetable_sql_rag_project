"use client";

import { useState } from "react";
import axios from "axios";
import api from "../../lib/apiclient";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const quickQueries = [
    "What classes do I have today?",
    "How many classes do I have today?",
    "What is my first class today?",
    "What is my last class today?",
    "Which rooms are used today?"
  ];
  const url=`${process.env.NEXT_PUBLIC_BACKENDURL}/chat/ask`
  const askBackend = async () => {
    if (!question) return;

    setLoading(true);
    setResponse(null);

    axios
      .post(url, { question },{
        withCredentials: true,
      })
      .then((res) => {
        setResponse(res.data);
        
      })
      .catch((error) => {
        
        if (error.response && error.response.status === 401) {
          axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/refresh`, {}, { withCredentials: true })
            .then(() => {
              axios.post(url, { question }, { withCredentials: true })
                .then((res) => {
                  setResponse(res.data);
                 
                })
                .catch((err) => {
                  console.error("Error after refresh:", err);
                });
            })
            
        }
      }); 

    setLoading(false);
  };

  const handleQuickQuery = (query) => {
    setQuestion(query);
    setTimeout(() => {
      askBackend();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">
        📅 AI Timetable Assistant
      </h1>

      {/* Form Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askBackend();
        }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your timetable..."
          className="w-full p-3 rounded bg-gray-800 border border-gray-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {/* Quick Queries */}
      <div className="mt-6">
        <p className="text-gray-400 mb-2">Quick Questions:</p>

        <div className="flex flex-wrap gap-2">
          {quickQueries.map((query, index) => (
            <button
              key={index}
              disabled={loading}
              onClick={() => handleQuickQuery(query)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <p className="mt-6 text-gray-400 animate-pulse">
          🤖 Generating answer...
        </p>
      )}

      {/* Response Section */}
      {response && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <p className="font-bold">Generated SQL:</p>

          <div className="mt-2 bg-black/40 p-3 rounded overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
              {response.generated_sql}
            </pre>
          </div>

          <p className="mt-6 font-bold">Answer:</p>
          <p className="mt-2 text-lg text-blue-300 whitespace-pre-line">
            {response.answer}
          </p>
        </div>
      )}
    </div>
  );
}