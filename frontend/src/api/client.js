const BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const opts = { method, headers: {} };
  if (body && !isForm) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  } else if (body && isForm) {
    opts.body = body; // FormData; browser sets the boundary header
  }
  const res = await fetch(`${BASE}/api${path}`, opts);
  if (!res.ok) {
    let detail = "";
    try {
      detail = JSON.stringify(await res.json());
    } catch {
      detail = res.statusText;
    }
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json();
}

export const api = {
  // Chat
  chat: (payload) => request("/chat/", { method: "POST", body: payload }),
  // Catalogue
  garments: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/garments/${qs ? `?${qs}` : ""}`);
  },
  garment: (id) => request(`/garments/${id}/`),
  // Crafts
  crafts: () => request("/crafts/"),
  // Customiser
  recommend: (payload) =>
    request("/customiser/recommend/", { method: "POST", body: payload }),
  // Studio
  garmentZones: (type) => request(`/studio/garment-zones/${type}/`),
  analyseRefImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/studio/analyse-ref-image/", {
      method: "POST",
      body: form,
      isForm: true,
    });
  },
  generatePattern: (payload) =>
    request("/studio/generate-pattern/", { method: "POST", body: payload }),
  // Wishlist
  saveConfig: (payload) =>
    request("/wishlist/save/", { method: "POST", body: payload }),
  getConfigs: (sessionId) => request(`/wishlist/${sessionId}/`),
};

// Stable per-browser session id used for the wishlist.
export function getSessionId() {
  let id = localStorage.getItem("kw_session");
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("kw_session", id);
  }
  return id;
}
