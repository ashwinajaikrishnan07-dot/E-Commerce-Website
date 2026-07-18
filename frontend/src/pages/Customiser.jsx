import { useState } from "react";
import { api } from "../api/client.js";

const OCCASIONS = ["Casual", "Office", "Wedding", "Festival", "Party", "Kids"];
const FABRICS = ["Cotton", "Silk", "Georgette", "Chiffon", "Linen", "Crepe"];

export default function Customiser() {
  const [occasion, setOccasion] = useState("Wedding");
  const [fabric, setFabric] = useState("Silk");
  const [budget, setBudget] = useState(2000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await api.recommend({ occasion, fabric, budget });
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl text-maroon-700 mb-2">Craft Customiser</h1>
      <p className="text-gray-500 mb-8">
        Tell us your occasion, fabric and budget — our AI textile expert recommends the perfect craft.
      </p>

      <div className="bg-white rounded-2xl border border-maroon-100 p-6 grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-maroon-700 mb-2">Occasion</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full rounded-lg border border-maroon-200 px-3 py-2 text-sm bg-white"
          >
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-maroon-700 mb-2">Fabric</label>
          <select
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="w-full rounded-lg border border-maroon-200 px-3 py-2 text-sm bg-white"
          >
            {FABRICS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-maroon-700 mb-2">
            Budget: ₹{budget}
            {budget >= 5000 ? "+" : ""}
          </label>
          <input
            type="range"
            min="300"
            max="5000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-maroon-600"
          />
        </div>
      </div>

      <button onClick={submit} disabled={loading} className="kw-btn-primary mt-5 disabled:opacity-60">
        {loading ? "Consulting the craft expert…" : "Recommend a craft"}
      </button>

      {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-br from-maroon-600 to-maroon-800 text-white rounded-2xl p-6">
            <p className="text-gold-400 text-sm tracking-wide">RECOMMENDED CRAFT</p>
            <h2 className="font-display text-3xl mt-1">{result.recommended_craft}</h2>
            <p className="mt-3 text-maroon-100">{result.reason}</p>
          </div>

          {result.avoid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-semibold text-amber-800 mb-1">What to avoid</p>
              <p className="text-amber-900 text-sm">{result.avoid}</p>
            </div>
          )}

          {result.garment_examples?.length > 0 && (
            <div>
              <h3 className="font-semibold text-maroon-700 mb-3">Garment examples</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.garment_examples.map((ex, i) => (
                  <div key={i} className="kw-card">
                    <div className="aspect-video bg-maroon-50 overflow-hidden">
                      {ex.image_url ? (
                        <img src={ex.image_url} alt={ex.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🧵</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-maroon-800 text-sm">{ex.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{ex.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result._fallback && (
            <p className="text-xs text-gray-400">
              Note: showing a sample recommendation (Claude API key not configured).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
