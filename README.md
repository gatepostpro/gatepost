# Gatepost

**Modern horse show management platform built for stock horse associations.**

Built by CoWN Stock Horse Association as a replacement for legacy show management software. Gatepost handles entries, tabs, class draws, results, points standings, and membership — all in one place, accessible from any device.

---

## What it does

- **Import entries** from Cognito Forms exports (Excel)
- **Manage tabs** — auto-calculated from class fees, stalling, RV, membership
- **Class management** — randomized draws, add/scratch riders, real-time updates
- **Score entry** — ring stewards enter scores from any device
- **Points tracking** — auto-calculated standings after each show
- **Membership management** — member registry, horse registry, license tracking
- **Multi-user** — secretary, gate, steward, treasurer all on separate devices simultaneously

---

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | Vanilla HTML/JS (no framework) |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| Hosting | GitHub Pages |
| Entry forms | Cognito Forms (import) → native form (coming) |

---

## Project structure

```
gatepost/
├── index.html       # Landing page / show selector
├── app.html         # Main show management app
├── db.js            # Supabase client + all database helpers
├── schema.sql       # Database schema (run once in Supabase SQL editor)
├── README.md
└── assets/
    └── logo.png
```

---

## Setup

### 1. Supabase
- Create a project at supabase.com
- Run `schema.sql` in the SQL Editor
- Copy your project URL and anon key into `db.js`

### 2. GitHub Pages
- Push this repo to GitHub
- Go to Settings → Pages → Source: Deploy from branch → main → / (root)
- Your app will be live at `https://gatepostpro.github.io/gatepost`

---

## Roadmap

- [x] Cognito import parser
- [x] Entry management + tabs
- [x] Class lists + stall/RV management
- [x] Supabase database schema
- [ ] Full Supabase integration
- [ ] Class draw + run screen
- [ ] Score entry (ring steward view)
- [ ] Points auto-calculation
- [ ] Native entry form (replace Cognito)
- [ ] Multi-association support
- [ ] Role-based access (secretary / gate / steward / treasurer / public)
- [ ] Results publishing to public page
- [ ] AQHA / NRHA results export

---

## Association config

Gatepost is designed to be white-labeled for any stock horse association. Fee structures, point systems, division names, and class formats are all configurable per association without code changes.

---

*Built with CoWN Stock Horse Association — Colorado, Wyoming & Nebraska*
