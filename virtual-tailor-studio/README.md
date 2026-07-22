# Virtual Tailor Studio

A production-grade 3D garment visualization platform for Indian traditional wear. Customers interact with a realistic 3D mannequin to customize clothing components, swap fabrics, change colors, apply embroidery, and place orders — all in real-time.

## Tech Stack

### Frontend
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Three.js** via React Three Fiber + Drei + Postprocessing
- **TailwindCSS** + glassmorphism design system
- **Zustand** for state management (viewport, design, UI)
- **TanStack Query** for server state
- **GSAP** for premium animations
- **Lucide** icons

### Backend
- **NestJS** with modular architecture
- **PostgreSQL** + **Prisma ORM**
- **Swagger/OpenAPI** documentation
- JWT authentication (prepared)

## Quick Start

### Frontend
```bash
cd virtual-tailor-studio
npm install
npm run dev
```

### Backend
```bash
cd virtual-tailor-studio/api
npm install
cp .env.example .env  # Configure DATABASE_URL
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

## Architecture

```
virtual-tailor-studio/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   │   ├── page.tsx      # Main 3D configurator
│   │   └── admin/        # Admin CMS panel
│   ├── components/
│   │   ├── ui/           # Reusable UI primitives (shadcn pattern)
│   │   ├── viewport/     # 3D canvas, controls, lighting
│   │   ├── customization/# Design panel, pickers, selectors
│   │   └── layout/       # Header, sidebar, notifications
│   ├── engine/           # 3D engine utilities (raycaster, materials)
│   ├── store/            # Zustand stores (viewport, design, UI)
│   ├── hooks/            # React Query hooks + utilities
│   ├── lib/              # Utilities, API client
│   ├── types/            # TypeScript type definitions
│   └── providers/        # React context providers
├── api/                  # NestJS backend
│   ├── src/
│   │   ├── prisma/       # Database service
│   │   ├── designs/      # Design projects CRUD
│   │   ├── components/   # Clothing components API
│   │   └── assets/       # Media/asset management
│   └── prisma/
│       └── schema.prisma # Database schema
└── public/
    ├── models/           # GLB mannequin models
    ├── textures/         # Fabric textures
    ├── embroidery/       # Embroidery patterns
    └── hdri/             # Environment maps
```

## Features

- **3D Mannequin** — Interactive orbit/pan/zoom with selectable body regions
- **Body Region Selection** — Click chest, collar, sleeves, waist, skirt, etc.
- **Modular Customization** — Independent component, texture, color, embroidery per region
- **Undo/Redo** — Full history stack with keyboard shortcuts
- **Admin CMS** — Upload/manage GLB models, textures, embroidery, colors
- **Real-time Preview** — PBR materials, HDRI environment, post-processing
- **Save/Share/Export** — Projects, share links, screenshot export
- **Keyboard Shortcuts** — Ctrl+Z undo, Ctrl+S save, R reset camera, G grid

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+S | Save |
| Escape | Clear selection |
| R | Reset camera |
| G | Toggle grid |
| P | Toggle panel |

## Database

The Prisma schema includes tables for: Users, DesignProjects, DesignComponents, ClothingComponents, BodyParts, Categories, Materials, FabricTextures, ColorSwatches, EmbroideryPatterns, Orders, ShareLinks, Favorites, Media, and AdminLogs.

## Deployment

- **Frontend** → Vercel (automatic via Next.js)
- **Backend** → Railway / Render / AWS
- **Database** → PostgreSQL (Railway, Supabase, or AWS RDS)

## License

Proprietary — All rights reserved.
