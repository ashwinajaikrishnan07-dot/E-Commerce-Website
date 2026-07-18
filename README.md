# KraftWear — South Indian Ethnic Wear + AI Craft Studio

A catalogue + visualisation platform for South Indian ethnic wear (kurtis,
sarees, blouses, frocks, churidars, lehengas). The differentiator is an **AI
Mannequin Studio** where customers visualise embroidery and necklines on a
garment before ordering. Phase 1 is catalogue + visualisation only.

## Tech Stack

| Layer     | Tech                                                                 |
|-----------|----------------------------------------------------------------------|
| Frontend  | React + Vite + Tailwind CSS + Fabric.js + react-zoom-pan-pinch       |
| Backend   | Django + Django REST Framework + PostgreSQL (SQLite fallback in dev) |
| AI        | Claude (`claude-sonnet-4-6`) chatbot/recommendations, fal.ai/SD renders |
| Storage   | Cloudinary                                                           |
| Queue     | Celery + Redis                                                       |
| Deploy    | Vercel (frontend), Railway (backend)                                 |

> The app runs fully **without any API keys** — AI calls degrade gracefully to
> sample responses and placeholder images so you can develop offline.

## Project Structure

```
backend/    Django project (kraftwear) + api app
frontend/   React + Vite app
```

## Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows  (source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
copy .env.example .env           # then fill in keys (optional)
python manage.py migrate
python manage.py seed_data       # loads garments + crafts
python manage.py runserver 8000
```

Runs at `http://localhost:8000`. Uses SQLite unless `DATABASE_URL` (Postgres) is set.

### Environment variables (backend/.env)

| Key                 | Purpose                                        |
|---------------------|------------------------------------------------|
| `SECRET_KEY`        | Django secret                                  |
| `DATABASE_URL`      | Postgres URL (blank = SQLite)                  |
| `ANTHROPIC_API_KEY` | Claude chatbot, recommendations, vision        |
| `CLAUDE_MODEL`      | Defaults to `claude-sonnet-4-6`                |
| `FAL_API_KEY`       | fal.ai / Stable Diffusion pattern generation   |
| `CLOUDINARY_URL`    | Image hosting                                  |
| `REDIS_URL`         | Celery broker/result backend                   |
| `FRONTEND_ORIGIN`   | Allowed CORS origin(s), comma-separated        |

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` and proxies `/api` to `http://localhost:8000`.
Set `VITE_API_BASE` to point at a deployed backend in production.

## Pages

- `/` Home — landing page with featured garments
- `/catalogue` — browse + filter by type, occasion, price, fabric
- `/studio` — **AI Mannequin Studio** (the star feature)
- `/craft-explorer` — six craft cards with per-craft "Ask AI"
- `/customiser` — occasion + fabric + budget → AI craft recommendation
- `/wishlist` — saved configurations
- `/orders` — Phase 2 placeholder

A floating, page-aware bilingual (Tamil/English) chatbot appears on every page.

## API Endpoints

| Method | Endpoint                                | Purpose                       |
|--------|-----------------------------------------|-------------------------------|
| POST   | `/api/chat/`                            | Navigation chatbot            |
| GET    | `/api/garments/`                        | List garments (filterable)    |
| GET    | `/api/garments/<id>/`                   | Garment detail                |
| GET    | `/api/crafts/`                          | List craft types              |
| POST   | `/api/customiser/recommend/`            | Craft AI recommendation       |
| POST   | `/api/studio/analyse-ref-image/`        | Claude Vision analysis        |
| POST   | `/api/studio/generate-pattern/`         | fal.ai pattern generation     |
| GET    | `/api/studio/garment-zones/<type>/`     | Garment zone coordinates      |
| POST   | `/api/wishlist/save/`                   | Save configuration            |
| GET    | `/api/wishlist/<session_id>/`           | Get saved configurations      |

## AI Mannequin Studio flow

1. **Pick garment** — mannequin silhouette updates per garment.
2. **Zoom into neckline** — scroll/pinch (react-zoom-pan-pinch); pick from 6 neck shapes; the SVG path swaps live.
3. **Pick embroidery** — 8 styles; Fabric.js renders a texture on the active zone.
4. **Upload reference (optional)** — Claude Vision describes it → fal.ai renders it → overlaid on the mannequin.

## Deployment

- **Frontend → Vercel**: `frontend/` with `vercel.json` SPA rewrites. Set `VITE_API_BASE`.
- **Backend → Railway**: `railway.json` + `Procfile`. Add a Postgres and Redis plugin; set env vars.
