import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

const TYPES = ["Blouse", "Kurti", "Saree", "Frock", "Churidar", "Lehenga"];
const OCCASIONS = ["Casual", "Office", "Wedding", "Festival", "Party", "Kids"];
const FABRICS = ["Cotton", "Silk", "Georgette", "Chiffon", "Linen", "Crepe"];

export default function Catalogue() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    occasion: "",
    fabric: "",
    max_price: 5000,
  });

  useEffect(() => {
    setLoading(true);
    api
      .garments(filters)
      .then(setGarments)
      .catch(() => setGarments([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const reset = () =>
    setFilters({ type: "", occasion: "", fabric: "", max_price: 5000 });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl text-maroon-700 mb-2">Catalogue</h1>
      <p className="text-gray-500 mb-8">Browse our South Indian ethnic wear collection.</p>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1 space-y-6 bg-white rounded-2xl border border-maroon-100 p-5 h-fit">
          <div>
            <label className="block text-sm font-semibold text-maroon-700 mb-2">Type</label>
            <Select value={filters.type} onChange={(v) => update("type", v)} options={TYPES} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-maroon-700 mb-2">Occasion</label>
            <Select value={filters.occasion} onChange={(v) => update("occasion", v)} options={OCCASIONS} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-maroon-700 mb-2">Fabric</label>
            <Select value={filters.fabric} onChange={(v) => update("fabric", v)} options={FABRICS} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-maroon-700 mb-2">
              Max Price: ₹{filters.max_price}
            </label>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={filters.max_price}
              onChange={(e) => update("max_price", Number(e.target.value))}
              className="w-full accent-maroon-600"
            />
          </div>
          <button onClick={reset} className="kw-btn-ghost w-full text-sm">
            Reset filters
          </button>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <p className="text-gray-400">Loading garments…</p>
          ) : garments.length === 0 ? (
            <p className="text-gray-400">No garments match your filters.</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {garments.map((g) => (
                <div key={g.id} className="kw-card flex flex-col">
                  <div className="aspect-[3/4] bg-maroon-50 overflow-hidden">
                    {g.image_url ? (
                      <img src={g.image_url} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🧵</div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-maroon-800">{g.name}</h3>
                    <p className="text-sm text-gray-500">{g.occasion} · {g.fabric}</p>
                    <p className="mt-1 text-gold-600 font-semibold">₹{g.base_price}</p>
                    <p className="text-sm text-gray-500 mt-2 flex-1">{g.description}</p>
                    <Link
                      to={`/studio?garment=${g.name}`}
                      className="kw-btn-primary text-sm mt-3 w-full"
                    >
                      Visualise in Studio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-maroon-200 px-3 py-2 text-sm outline-none focus:border-maroon-500 bg-white"
    >
      <option value="">All</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
