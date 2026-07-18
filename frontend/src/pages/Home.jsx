import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.garments().then((g) => setFeatured(g.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-maroon-600 to-maroon-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold-400 tracking-widest text-sm mb-3">
              SOUTH INDIAN ETHNIC WEAR
            </p>
            <h1 className="font-display text-5xl leading-tight mb-4">
              See your craft before you wear it.
            </h1>
            <p className="text-maroon-100 text-lg mb-8">
              Explore kurtis, sarees, blouses and more — then visualise your
              embroidery and neckline on our AI Mannequin Studio.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/catalogue" className="kw-btn bg-gold-500 text-maroon-900 hover:bg-gold-400 font-semibold">
                Browse Catalogue
              </Link>
              <Link to="/studio" className="kw-btn border border-white/40 text-white hover:bg-white/10">
                Try AI Studio →
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-64 h-80 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-8xl">
              🥻
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-maroon-700">Featured Garments</h2>
          <Link to="/catalogue" className="text-maroon-600 hover:underline text-sm">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((g) => (
            <Link to={`/studio?garment=${g.name}`} key={g.id} className="kw-card">
              <div className="aspect-[3/4] bg-maroon-50 overflow-hidden">
                {g.image_url ? (
                  <img src={g.image_url} alt={g.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🧵</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-maroon-800">{g.name}</h3>
                <p className="text-sm text-gray-500">{g.occasion} · {g.fabric}</p>
                <p className="mt-1 text-gold-600 font-semibold">₹{g.base_price}</p>
              </div>
            </Link>
          ))}
          {featured.length === 0 && (
            <p className="text-gray-400">Start the backend and run <code>seed_data</code> to see garments.</p>
          )}
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-white border-y border-maroon-100">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 text-center">
          {[
            ["🪡", "AI Mannequin Studio", "Visualise neckline + embroidery on a live mannequin."],
            ["🎨", "Craft Explorer", "Learn Zari, Aari, Kasuti and more with AI."],
            ["✨", "Smart Customiser", "Tell us the occasion — we recommend the craft."],
          ].map(([icon, title, desc]) => (
            <div key={title}>
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-semibold text-maroon-700 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
