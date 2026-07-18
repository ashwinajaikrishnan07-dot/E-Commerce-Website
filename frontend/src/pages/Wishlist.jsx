import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getSessionId } from "../api/client.js";

export default function Wishlist() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getConfigs(getSessionId())
      .then(setConfigs)
      .catch(() => setConfigs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl text-maroon-700 mb-2">Wishlist</h1>
      <p className="text-gray-500 mb-8">Your saved garment and craft configurations.</p>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : configs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">💾</div>
          <p className="text-gray-500 mb-4">No saved configurations yet.</p>
          <Link to="/studio" className="kw-btn-primary">Design in the AI Studio</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {configs.map((c) => (
            <div key={c.id} className="kw-card">
              <div className="aspect-[4/3] bg-maroon-50 overflow-hidden">
                {c.generated_pattern_url || c.ref_image_url ? (
                  <img
                    src={c.generated_pattern_url || c.ref_image_url}
                    alt="pattern"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🧵</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-maroon-800">
                  {c.garment_detail?.name || "Garment"}
                </h3>
                <p className="text-sm text-gray-500">
                  {c.neck_shape && `${c.neck_shape} · `}
                  {c.craft_detail?.name}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Saved {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
