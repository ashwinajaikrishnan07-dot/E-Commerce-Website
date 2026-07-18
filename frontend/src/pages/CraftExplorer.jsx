import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { contextForPath } from "../pageContext.js";

export default function CraftExplorer() {
  const [crafts, setCrafts] = useState([]);
  const [active, setActive] = useState(null); // craft being asked about
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.crafts().then(setCrafts).catch(() => setCrafts([]));
  }, []);

  function openAsk(craft) {
    setActive(craft);
    setMessages([
      {
        role: "assistant",
        content:
          lang === "ta"
            ? `${craft.name} பற்றி என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?`
            : `Ask me anything about ${craft.name}. ${craft.description}`,
      },
    ]);
  }

  async function ask(text) {
    const message = (text ?? input).trim();
    if (!message || loading || !active) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    const ctx = {
      ...contextForPath("/craft-explorer"),
      page_description: `The user is learning about the craft "${active.name}". ${active.description}`,
    };
    try {
      const res = await api.chat({
        message,
        page_context: ctx,
        language: lang,
        conversation_history: history,
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Error: " + e.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="font-display text-4xl text-maroon-700">Craft Explorer</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Explain in:</span>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full ${lang === "en" ? "bg-maroon-600 text-white" : "bg-maroon-50 text-maroon-700"}`}
          >
            English
          </button>
          <button
            onClick={() => setLang("ta")}
            className={`px-3 py-1 rounded-full ${lang === "ta" ? "bg-maroon-600 text-white" : "bg-maroon-50 text-maroon-700"}`}
          >
            தமிழ்
          </button>
        </div>
      </div>
      <p className="text-gray-500 mb-8">Learn the six signature South Indian embroidery crafts.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crafts.map((c) => (
          <div key={c.id} className="kw-card flex flex-col">
            <div className="aspect-video bg-maroon-50 overflow-hidden">
              {c.texture_image ? (
                <img src={c.texture_image} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🧶</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-maroon-800">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex-1">{c.description}</p>
              <p className="text-xs text-gold-600 mt-2">
                ₹{c.price_range_min}–₹{c.price_range_max}
              </p>
              <button onClick={() => openAsk(c)} className="kw-btn-ghost text-sm mt-3">
                🤖 Ask AI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ask AI panel */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg h-[70vh] flex flex-col overflow-hidden">
            <div className="bg-maroon-600 text-white px-4 py-3 flex justify-between items-center">
              <p className="font-semibold">Ask AI · {active.name}</p>
              <button onClick={() => setActive(null)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-maroon-50/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-maroon-600 text-white"
                        : "bg-white border border-maroon-100 text-gray-800"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <p className="text-gray-400 text-sm">typing…</p>}
            </div>
            <div className="p-3 border-t border-maroon-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder={lang === "ta" ? "தமிழில் கேளுங்கள்…" : "Ask about this craft…"}
                className="flex-1 text-sm rounded-full border border-maroon-200 px-3 py-2 outline-none focus:border-maroon-500"
              />
              <button onClick={() => ask()} className="kw-btn-primary text-sm px-4">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
