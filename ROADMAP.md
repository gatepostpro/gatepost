# Thorofare — Product Roadmap

> Internal document for TwoTop development planning.  
> Last updated: 2026-04-29

---

## Current State (Live)

| Area | Status |
|------|--------|
| Show secretary app (app.html) | ✅ Production |
| Scribe tablet app (scribe.html) | ✅ Production |
| Season Hub standings (season.html) | ✅ Production |
| Help viewer (help/help.html) | ✅ Production |
| TwoTop admin panel (admin.html) | ✅ Production |
| Hosting: Cloudflare Pages | ✅ Live at thorofare.app |
| Auth gate: Cloudflare Access | ✅ Password-protected during dev |
| Database: Supabase | ✅ Live (tpurkcxtkvwpywxnuzwe) |
| Custom domain: thorofare.app | ✅ DNS via Cloudflare |
| Custom domain: two-top.com | ✅ Parked (no content yet) |

---

## Phase 1 — Stabilization (Next 2–4 weeks)

These are loose ends from the current build that need to be closed before onboarding any customer.

- [ ] **Connect GitHub → Cloudflare Pages auto-deploy**  
  Currently on manual upload. Go to Pages → Settings → connect repo so every push deploys automatically.

- [ ] **Delete old thorofare Worker** from Cloudflare Workers & Pages (stale from initial setup confusion).

- [ ] **Wire feature flags into app.html**  
  `associations.enable_scribe`, `enable_year_end`, etc. are stored but not yet read. App should hide tabs/buttons the org hasn't licensed. Do with user present to test.

- [ ] **Tighten RLS policies in Supabase**  
  Current policies are open "allow all." Before a second customer is added, scope SELECT/INSERT/UPDATE to `association_id = auth.jwt() -> 'association_id'` (or equivalent service-key approach).

- [ ] **Season Hub: verify All-Around with org filter**  
  Confirm the All-Around computation only pulls riders from the selected sanctioning body, not the full results table.

- [ ] **Review membership.html**  
  File exists but content has not been reviewed or connected to Supabase. Decide: keep, gut, or remove before first customer demo.

- [ ] **First real data load + UAT**  
  Load a full season's worth of results for CoWN and run through all Season Hub views: per-org standings, drops, All-Around, export.

---

## Phase 2 — Secretary & Scribe Polish (1–2 months)

Quality-of-life improvements for paying secretaries.

- [ ] **Secretary login (Supabase Auth)**  
  Secretaries get individual email/password accounts. Each account is linked to an `association_id`. Replaces the single Cloudflare Access password.

- [ ] **Scribe login**  
  Scribes get accounts scoped to a single show. Can only see/enter classes assigned to them. Auto-expire after show date.

- [ ] **Role-based UI**  
  App.html detects whether the logged-in user is owner / secretary / scribe and hides unauthorized sections. Replaces manual feature-flag wiring.

- [ ] **Offline / poor-signal mode for scribe**  
  Cache current class in localStorage. Sync when connection restores. Critical for outdoor arenas.

- [ ] **Drag-to-reorder placing**  
  Scribes currently type place numbers. A drag-and-drop ribbon for top-6 placements would be faster in a live show environment.

- [ ] **Show templates**  
  Secretary can save a show structure (class list, judges, divisions) and reuse it for future shows instead of rebuilding each time.

- [ ] **Print/PDF output**  
  Generate a printable results sheet per class or per show from the secretary view.

---

## Phase 3 — Member & Rider Portal (2–4 months)

Self-service accounts for participants; moves the product from a tool into a platform.

- [ ] **Rider account creation**  
  Public sign-up page. Rider registers with name (must match results name), email, and optional AQHA/APHA membership number.

- [ ] **My Results dashboard**  
  Logged-in rider sees their own standings across all associations using Thorofare, without needing to know what org their secretary uses.

- [ ] **Horse registry**  
  Link horses to riders. Track show history by horse, not just by name string. `enable_horse_registry` feature flag already exists.

- [ ] **Membership module**  
  Associations can require annual membership dues. Rider pays through Thorofare; secretary sees verified member list. `enable_membership` flag exists.

- [ ] **Public results page**  
  Season Hub with a public URL — no login required. Read-only view of standings for spectators and non-members. `enable_public_results` flag exists.

- [ ] **Name disambiguation**  
  When rider names in results don't exactly match the account name (typos, maiden/married names), provide a merge/alias tool for the secretary.

---

## Phase 4 — Entry & Payments (3–6 months)

Pre-entry workflow so secretaries stop managing entries via email or paper.

- [ ] **Online entry form**  
  Riders enter classes and pay before the show. `enable_entry_form` flag exists. Needs Stripe integration or similar.

- [ ] **Stall & RV reservations**  
  Tack-on at entry time. `enable_stalls` and `enable_rv` flags already exist — build the UI.

- [ ] **Entry confirmation emails**  
  Auto-send confirmation with class list, stall assignment, and payment receipt.

- [ ] **Secretary entry management**  
  Dashboard to view/edit pre-entries, add gate entries, move riders between classes before go-time.

- [ ] **Entry → Scribe pre-load**  
  Auto-populate the scribe app with entries for each class so scribes don't type names from a printed list.

---

## Phase 5 — Business & Growth (6–12 months)

The product is validated; scale it.

- [ ] **Subscription billing**  
  Stripe Billing. Tiers: Basic / Pro / Full-Service. Auto-suspend on expiry. Connect to `plan_tier`, `plan_expires`, `billing_email` columns already in DB.

- [ ] **Customer onboarding flow**  
  Self-service signup at two-top.com → create account → pick plan → spin up association → pay. Eliminates manual provisioning by TwoTop.

- [ ] **two-top.com marketing site**  
  Parked domain needs a landing page: product overview, pricing, contact/demo request form.

- [ ] **White-label option**  
  Large associations get their own subdomain (`cown.thorofare.app`) and logo. Premium plan only.

- [ ] **Multi-secretary orgs**  
  Large shows with multiple rings need multiple secretaries working concurrently. Requires conflict handling on class data.

- [ ] **API access (partner tier)**  
  Read-only API key so associations can embed standings in their own websites or pull data into their own tools.

- [ ] **Mobile app**  
  Native iOS/Android for scribes. The web app works on tablets but a native app removes browser chrome and handles offline better.

---

## Backlog / Ideas (No Timeline)

- SMS/push notifications when results for a class are posted
- Judge score breakdowns (not just net points)
- Multi-judge averaging for reined cow horse classes
- Year-end awards calculation and certificate export
- Historical show archive (past seasons, read-only)
- QR code check-in for riders at gate
- Integration with AQHA/APHA member lookup APIs

---

## Version History

| Version | Date | Milestone |
|---------|------|-----------|
| 0.1 | 2025 | Initial show secretary + scribe prototype |
| 0.2 | 2026-Q1 | Season Hub + drop-show logic |
| 0.3 | 2026-04 | Admin panel, feature flags, help system, Cloudflare deploy |
| 1.0 | TBD | Secretary auth + first paying customer |
