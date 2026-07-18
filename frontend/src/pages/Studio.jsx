import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Mannequin3D from "../components/studio/Mannequin3D.jsx";
import {
  NECKLINES,
  EMBROIDERIES,
  GARMENTS,
  ZONE_LABELS,
  REFERENCE_VIEWS,
  DRESS_OPTIONS,
} from "../components/studio/studioData.js";
import { api, getSessionId } from "../api/client.js";

const ZONES = ["zone-neckline", "zone-border", "zone-sleeve", "zone-hem", "zone-back"];

export default function Studio() {
  const [params] = useSearchParams();
  const [garment, setGarment] = useState(params.get("garment") || "Blouse");
  const [zones, setZones] = useState(null);
  const [neckline, setNeckline] = useState(NECKLINES[2]); // Round Neck default
  const [embroidery, setEmbroidery] = useState(null);
  const [activeZone, setActiveZone] = useState("zone-neckline");
  const [patternUrl, setPatternUrl] = useState("");

  const [refDescription, setRefDescription] = useState("");
  const [measurements, setMeasurements] = useState(null);
  const [busy, setBusy] = useState("");
  const [saved, setSaved] = useState(false);
  const [garmentsData, setGarmentsData] = useState([]);
  const [craftsData, setCraftsData] = useState([]);

  // fetch zone coordinates for the selected garment
  useEffect(() => {
    api.garmentZones(garment).then(setZones).catch(() => setZones(null));
    setSaved(false);
  }, [garment]);

  useEffect(() => {
    api.garments().then(setGarmentsData).catch(() => {});
    api.crafts().then(setCraftsData).catch(() => {});
  }, []);

  // When user picks an embroidery style, render its texture on the active zone.
  async function pickEmbroidery(emb) {
    setEmbroidery(emb);
    setBusy("Rendering embroidery texture…");
    try {
      const res = await api.generatePattern({
        prompt: emb.prompt,
        garment_type: garment,
        zone: activeZone,
      });
      setPatternUrl(res.image_url);
    } catch (e) {
      setPatternUrl("");
    } finally {
      setBusy("");
    }
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy("Analysing your reference image with Claude Vision…");
    try {
      const analysis = await api.analyseRefImage(file);
      setRefDescription(analysis.description);
      setBusy("Generating pattern from your reference…");
      const gen = await api.generatePattern({
        prompt: analysis.description,
        garment_type: garment,
        zone: activeZone,
      });
      setPatternUrl(gen.image_url);
    } catch (err) {
      setBusy("");
    } finally {
      setBusy("");
    }
  }

  async function save() {
    const craft = craftsData.find(
      (c) => embroidery && c.name.toLowerCase().includes(embroidery.name.toLowerCase())
    ) || craftsData[0];
    const g = garmentsData.find((x) => x.name === garment) || garmentsData[0];
    if (!g || !craft) return;
    try {
      await api.saveConfig({
        session_id: getSessionId(),
        garment_type: g.id,
        neck_shape: neckline?.name || "",
        craft_type: craft.id,
        generated_pattern_url: patternUrl || null,
      });
      setSaved(true);
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl text-maroon-700 mb-1">AI Mannequin Studio</h1>
      <p className="text-gray-500 mb-6">
        Pick a garment, zoom into the neckline, choose an embroidery, or upload a
        reference image to see it on the mannequin.
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* 3D model */}
        <div className="bg-white rounded-2xl border border-maroon-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-maroon-700">
              Step 2 · Rotate & zoom into the neckline
            </span>
            <span className="text-xs text-gray-400">drag to rotate · scroll to zoom</span>
          </div>
          <div className="bg-maroon-50/40 rounded-xl overflow-hidden" style={{ height: 600 }}>
            <Mannequin3D
              garmentType={garment}
              neckline={neckline?.name}
              embroideryImageUrl={patternUrl}
              activeZone={activeZone}
              swatchColor={embroidery?.color}
              onMeasurements={setMeasurements}
            />
          </div>
          {busy && <p className="text-sm text-maroon-600 mt-3 animate-pulse">{busy}</p>}

          {/* Mannequin measurements */}
          {measurements && (
            <div className="mt-4 rounded-xl border border-maroon-100 bg-maroon-50/30 p-3">
              <p className="text-xs font-semibold text-maroon-700 mb-2">
                Mannequin measurements
                <span className="font-normal text-gray-400"> · approx, at {Math.round(measurements.heightCm)} cm tall</span>
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Height", cm: measurements.heightCm },
                  { label: "Width", cm: measurements.widthCm },
                  { label: "Depth", cm: measurements.depthCm },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-white border border-maroon-100 py-2">
                    <div className="text-sm font-semibold text-maroon-700">{m.cm.toFixed(1)} cm</div>
                    <div className="text-[11px] text-gray-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provided reference views */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-maroon-700 mb-2">Reference views</p>
            <div className="flex gap-3">
              {REFERENCE_VIEWS.map((v) => (
                <figure key={v.name} className="text-center">
                  <img
                    src={v.src}
                    alt={`${v.name} mannequin`}
                    className="h-24 rounded-lg border border-maroon-100 object-cover bg-white"
                  />
                  <figcaption className="text-[11px] text-gray-500 mt-1">{v.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* Control panels */}
        <div className="space-y-5">
          {/* Step 1: Garment */}
          <Panel title="Step 1 · Pick Garment Type">
            <div className="grid grid-cols-3 gap-2">
              {GARMENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGarment(g)}
                  className={`text-sm rounded-lg py-2 border transition ${
                    garment === g
                      ? "bg-maroon-600 text-white border-maroon-600"
                      : "border-maroon-200 text-maroon-700 hover:bg-maroon-50"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Panel>

          {/* Active zone selector */}
          <Panel title="Target Zone">
            <div className="flex flex-wrap gap-2">
              {ZONES.map((z) => (
                <button
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`text-xs rounded-full px-3 py-1.5 border ${
                    activeZone === z
                      ? "bg-maroon-600 text-white border-maroon-600"
                      : "border-maroon-200 text-maroon-700 hover:bg-maroon-50"
                  }`}
                >
                  {ZONE_LABELS[z]}
                </button>
              ))}
            </div>
          </Panel>

          {/* Step 2: Neckline */}
          <Panel title="Neckline Shape">
            <div className="grid grid-cols-3 gap-2">
              {NECKLINES.map((n) => (
                <button
                  key={n.name}
                  onClick={() => setNeckline(n)}
                  className={`flex flex-col items-center gap-1 rounded-lg py-2 border text-[11px] ${
                    neckline?.name === n.name
                      ? "border-maroon-600 bg-maroon-50"
                      : "border-maroon-100 hover:bg-maroon-50"
                  }`}
                >
                  <svg viewBox="120 70 160 110" className="w-12 h-8">
                    <path d={n.path} fill="#e9dcc9" stroke="#a01c3e" strokeWidth="2" />
                  </svg>
                  {n.name}
                </button>
              ))}
            </div>
          </Panel>

          {/* Step 3: Embroidery */}
          <Panel title="Step 3 · Embroidery Style">
            <div className="grid grid-cols-4 gap-2">
              {EMBROIDERIES.map((e) => (
                <button
                  key={e.name}
                  onClick={() => pickEmbroidery(e)}
                  title={e.name}
                  className={`rounded-lg overflow-hidden border text-[10px] ${
                    embroidery?.name === e.name ? "border-maroon-600 ring-2 ring-maroon-200" : "border-maroon-100"
                  }`}
                >
                  <div className="h-8 w-full" style={{ background: e.swatch }} />
                  <span className="block py-1 text-maroon-700">{e.name}</span>
                </button>
              ))}
            </div>
          </Panel>

          {/* Step 4: Ref image */}
          <Panel title="Step 4 · Upload Reference (optional)">
            <label className="kw-btn-ghost text-sm w-full cursor-pointer">
              📷 Upload embroidery photo
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
            {refDescription && (
              <p className="text-xs text-gray-500 mt-2 bg-maroon-50 rounded-lg p-2">
                <span className="font-semibold text-maroon-700">Claude Vision:</span> {refDescription}
              </p>
            )}
          </Panel>

          <button onClick={save} className="kw-btn-primary w-full">
            {saved ? "✓ Saved to Wishlist" : "💾 Save configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-maroon-100 p-4">
      <p className="text-sm font-semibold text-maroon-700 mb-3">{title}</p>
      {children}
    </div>
  );
}
