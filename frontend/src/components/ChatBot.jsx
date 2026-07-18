import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/client.js";
import { contextForPath } from "../pageContext.js";

// Floating, page-aware bilingual (Tamil/English) chatbot shown on every page.
export default function ChatBot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  const pageCtx = contextForPath(location.pathname);

  // Reset context-aware suggestions and greeting when the page changes.
  useEffect(() => {
    setSuggestions(pageCtx.available_actions || []);
    setMessages((prev) =>
      prev.length
        ? prev
        : [
            {
              role: "assistant",
              content: `Hi! I'm your KraftWear assistant. You're on the ${pageCtx.page_name} page. Ask me anything — in Tamil or English.`,
            },
          ]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, loading]);

  async function send(text) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chat({
        message,
        page_context: pageCtx,
        conversation_history: history,
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      if (res.suggested_actions?.length) setSuggestions(res.suggested_actions);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the server. " + e.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[92vw] h-[460px] bg-white rounded-2xl shadow-2xl border border-maroon-100 flex flex-col overflow-hidden">
          <div className="bg-maroon-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">KraftWear Assistant</p>
              <p className="text-[11px] opacity-80">{pageCtx.page_name} · தமிழ் / English</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-maroon-50/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-maroon-600 text-white rounded-br-sm"
                      : "bg-white border border-maroon-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-maroon-100 rounded-2xl px-3 py-2 text-sm text-gray-400">
                  typing…
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="px-3 py-2 flex gap-2 flex-wrap border-t border-maroon-100 bg-white">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-maroon-50 text-maroon-700 hover:bg-maroon-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-maroon-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type in Tamil or English…"
              className="flex-1 text-sm rounded-full border border-maroon-200 px-3 py-2 outline-none focus:border-maroon-500"
            />
            <button onClick={() => send()} className="kw-btn-primary text-sm px-4 py-2">
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-maroon-600 text-white shadow-xl hover:bg-maroon-700 flex items-center justify-center text-2xl"
        aria-label="Open chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
