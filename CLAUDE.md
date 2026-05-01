# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Thorofare** (internal codename: Gatepost) is a horse show management platform for stock horse associations. Core users are show secretaries and ring scribes. Hosted at thorofare.app via Cloudflare Pages; database is Supabase (project ID `tpurkcxtkvwpywxnuzwe`).

No build step. All files are plain HTML/JS deployed directly.

---

## Deployment

```bat
deploy.bat   # Manual upload to Cloudflare Pages (fallback)
```

GitHub → Cloudflare Pages auto-deploy is configured (main branch = production). Commits to `main` deploy automatically. Do not use `deploy.bat` unless the pipeline is broken.

---

## Architecture

### Data Flow

```
Cognito Forms export (Excel)
  → parseCognito()          [app.html]
  → G.entries + localStorage
  → scribe.html reads localStorage
  → scratchpad → results
  → syncEntriesToSupabase() → Supabase
  → season.html reads Supabase
```

### State

All per-show state lives in a single `G` global:

```javascript
G = {
  entries, payments, backNums, cfg, assocId,
  results,        // array of posted scores
  scratchpad,     // {classKey: {rowIndex: scoreState}}
  classOrder,     // draw order per class
  scratches,      // per-class scratches
  fullScratches   // show-wide scratches
}
```

`localStorage` is the bridge between `app.html` (secretary) and `scribe.html` (ring scribe). They must run in the same browser on the same device.

### Files

| File | Purpose |
|------|---------|
| `app.html` | Secretary app — entries, classes, tabs, stalls, results, points (~14k lines, self-contained) |
| `scribe.html` | Scribe tablet app — live score entry per rider (~772 lines) |
| `gate.html` | Gate helper app — class list, scratch/add riders, close classes |
| `season.html` | Season Hub — standings & points from Supabase |
| `admin.html` | TwoTop admin — org config, billing tiers, feature flags |
| `index.html` | Landing / show selector with role routing |
| `app.js` / `db.js` | Secretary logic + Supabase client helpers |
| `schema.sql` | Full Postgres schema (reference only — run in Supabase dashboard) |
| `help/help.html` + `help/help-content.js` | Audience-segmented help system |

`app.html` is nearly entirely self-contained (styles + HTML + JS inline). `db.js` is the Supabase helper layer shared by other pages.

---

## Scoring System (scribe.html + app.html inline scribe)

Both files contain identical copies of these structures. **Always update both.**

### SCORE_TEMPLATES

Keyed by discipline name. Each entry defines:

```javascript
{
  maneuvers: ['Maneuver 1', ...],   // label array (length = maneuver count)
  penValues: [0.5, 1, 2, 5],        // penalty button values
  hasNRHA: true,                     // renders an extra score input field — dual use:
                                     //   • NRHA bonus (Reining, Trail, Pleasure)
                                     //   • "Natural Ranch Horse Appearance" tie-breaker (VRH/RHC ranch classes)
                                     //   Same UI, different semantic meaning per association.
  hasComments: true,                 // show comments field
  // Cutting-specific:
  scorePairs: [[-0.5, 0.5, '√−', '√+'], [-1, 1, '−', '+']],
  zeroLabel: '√',
  cowCount: 3,                       // number of cows
  categoriesPerCow: 6,               // categories per cow
  postCowManeuvers: 1                // scored after cow average (VRH Courage)
}
```

### getTemplateForDisc(name)

Fuzzy-matches class name string to a template key. Order matters — more specific first. Current order:

1. `novice + cow` → Novice Cow Work
2. `rookie + cow` → Novice Cow Work
3. `bdbd` → BDBD Cow Work
4. `limited + cow` or `ltd + cow` → BDBD Cow Work
5. `nrcha` block: `herd` / `steer` / `box+drive` / `boxing` / `cow` / `rein` → NRCHA templates
6. `apha` block: `ranch+rein` / `cutting` / `ranch+trail` / `box+drive` / `boxing` → APHA templates
7. `aphc` block: `ranch+rein` / `ranch+riding` / `cutting` / `ranch+trail` / `cow` → ApHC templates
8. `box + drive` → Ranch Box Drive
9. `boxing` → Ranch Boxing
10. `ranch + cutting` → Ranch Cutting
11. `cutting` → Cutting
12. `cow` → Cow Work
13. `ranch + trail` → Ranch Trail
14. `ranch + (pleasure | rail)` → Ranch Rail Pleasure
15. `ranch + rein` → Ranch Reining
16. `ranch + riding` → Ranch Riding
17. `rein` → Reining
18. `trail` → Trail
19. `pleasure` → Pleasure

### tmplOverride persistence

Selected template per class is saved to `localStorage` under key `gp_tmploverride_<showId>` (same pattern as all other show state). Both `scrSetTmpl()` (app.html) and `setTmpl()` (scribe.html) save on change; both files load on init. Overriding a template clears that class's scratchpad scores.

### calcTotal(s, tmpl)

Returns final score. Logic:

- Returns `0` if DQ
- Returns `null` if OP
- Cutting with `tmpl.cowCount && tmpl.categoriesPerCow`: averages per-cow sums, then `70 + avg - penalties`
- Standard: `70 + sum(maneuver scores) - sum(penalties) + (s.nrha || 0)`

Round to 3 decimal places: `Math.round(result * 1000) / 1000`.

### CoWN Points Formula

`recomputeManualPlacements(org, division, discipline, totalEntries)`:

```
points = max(0, totalEntries - (place + k - 1))
```

where `k` is 0-indexed rank within tied group, averaged across all tied riders.

---

## Supabase Conventions

- Helper: `sbFetch(path)` for GET, `sbPost(path, body)` for upsert/insert, `sbDelete(path)` for delete.
- Always build the full payload **before** any DELETE to avoid data loss on network failure between DELETE and INSERT.
- `association_id` must be resolved before any write. Use `G.assocId` first, then `G.cfg.orgAbbrev`, then look up by abbreviation. Never hardcode `'CoWN'`.
- RLS is currently open ("allow all"). Do not tighten until multi-tenant is ready — coordinate with user.

---

## Feature Flags

Stored in `associations` table. Read via `G.cfg` after load. Flags:

`enable_scribe`, `enable_year_end`, `enable_membership`, `enable_entry_form`, `enable_stalls`, `enable_rv`, `enable_horse_registry`, `enable_public_results`

Not yet wired into UI — planned Phase 1 task. Do not wire without user present to test.

---

## Discipline / Scoring Reference

**Standard templates (VRH / AQHA / generic)**

| Template key | Maneuvers | Notes |
|---|---|---|
| Reining | 9 | hasNRHA, [0.5,1,2,5] |
| Trail | 9 | hasNRHA, [1,3,5] |
| Pleasure | 9 | hasNRHA, [1,3,5] |
| Ranch Reining | 8 | hasNRHA, [0.5,1,2,5]; VRH default |
| Ranch Riding | 15 | hasNRHA, [1,3,5]; VRH/APHA |
| Ranch Trail | 9 | hasNRHA, [1,3,5]; VRH default |
| Ranch Rail Pleasure | 6 | hasNRHA, [1,3,5] |
| Cow Work | 11 | [1,2,3,5]; VRH named maneuvers |
| BDBD Cow Work | 8 | [1,3,5]; routes from bdbd / limited+cow / ltd+cow |
| Novice Cow Work | 5 | hasComments, [1,3,5]; routes from novice+cow AND rookie+cow |
| Cutting | 3 cows × 6 categories | NCHA; scorePairs ±1, zeroLabel:'√' |
| Ranch Cutting | 2 cows × 4 + Courage | VRH; cowCount:2, categoriesPerCow:4, postCowManeuvers:1 |

**APHA / ApHC association-specific templates**

| Template key | Maneuvers | Notes |
|---|---|---|
| Ranch Reining (APHA) | 10 | hasNRHA, [0.5,1,2,5] |
| Ranch Reining (ApHC) | 9 | [0.5,1,2,5] |
| Ranch Riding (ApHC) | 12 | [1,3,5] |
| Ranch Trail (10) | 10 | hasNRHA, [1,3,5]; APHA and ApHC |
| Ranch Cutting (APHA) | 2 cows × 4 | No Courage; cowCount:2, categoriesPerCow:4; APHA and ApHC |
| Ranch Boxing | 7 | [1,3,5]; Approach/Position/Form/Control/DoD/Eye Appeal/Time Worked |
| Ranch Box Drive | 6 | [1,3,5]; Boxing/Drive/P&C/DoD/Eye Appeal/Courage |
| ApHC Cow Work | 8 | [1,3,5]; Scouting/Drive/Boxing/Turn/P&C/DoD/Eye Appeal/Courage |

**NRCHA templates** (maneuver scoring uses ±2 scale with `--/√-/√/√+/++` labels for cow work events; ±1.5 for reined work and steer stopping)

| Template key | Maneuvers | Notes |
|---|---|---|
| NRCHA Reined Work | 8 | [0.5,1,2,5]; ±1.5 default scorePairs |
| NRCHA Cow Work | 7 | [1,2,3,5]; scorePairs ±2, zeroLabel:'√' |
| NRCHA Boxing | 7 | [1,3,5]; scorePairs ±2, zeroLabel:'√' |
| NRCHA Box Drive | 8 | [1,3,5]; scorePairs ±2, zeroLabel:'√' |
| NRCHA Herd Work | 6 | [1,3,5]; scorePairs ±2, zeroLabel:'√' |
| NRCHA Steer Stopping | 7 | [2,5]; ±1.5 default scorePairs |

NCHA Cutting scale: `√` = 0, `√+` = +0.5, `+` = +1, `√-` = −0.5, `−` = −1. Per-cow totals averaged across 3 cows.

NRCHA cow work scale: `--` = −2, `-` = −1, `√-` = −0.5, `√` = 0, `√+` = +0.5, `+` = +1, `++` = +2.

VRH Ranch Cutting scale: ±1.5 (same steps as reining). 2-cow average, Courage scored separately outside the average.

**Penalty notes:** Each maneuver card has an optional free-text code field (e.g. `W/O`, `A`) stored as `m[mi].penNote`. Does not affect score calculation — metadata only. Cleared when penalty is cleared.

---

## localStorage Keys

All show state is keyed by `showId`. Full key inventory:

| Key | Content |
|---|---|
| `gp_entries_<showId>` | G.entries |
| `gp_payments_<showId>` | G.payments |
| `gp_backnums_<showId>` | G.backNums |
| `gp_classorder_<showId>` | G.classOrder |
| `gp_scratches_<showId>` | G.scratches |
| `gp_fullscratches_<showId>` | G.fullScratches |
| `gp_scratch_<showId>` | G.scratchpad (in-progress scores) |
| `gp_results_<showId>` | G.results (posted scores) |
| `gp_resultsfile_<showId>` | G.resultsFile |
| `gp_scorelinks_<showId>` | G.scoreLinks |
| `gp_aamoney_<showId>` | G.aaMoney |
| `gp_tmploverride_<showId>` | tmplOverride (per-class template selection) |
| `gp_closedclasses_<showId>` | array of classKeys marked closed by gate helpers (gate.html) |
| `gp_billinggroups_<showId>` | G.billingGroups — merged billing groups |
| `gp_horsealiases_<showId>` | G.horseAliases — canonical horse name map |
| `gatepost_cfg` | G.cfg (show config, scribePin + gatePin, no showId suffix) |

---

## Secretary App — UI Conventions

### Navigation / Naming

- The "Tabs & Payments" tab is now called **Checkout** everywhere — nav label, `PAGE_TITLES`, and the `&#36; Checkout` button in the header.
- **Never rename localStorage keys** — they keep the `gp_` / `gatepost_` prefix to avoid breaking existing user data even though all user-facing text says "Thorofare".

### Fee Schedule (Show Setup → Finances)

- `renderFeeSchedule()` renders each fee category as its own `.card.fee-cat-section` element — not nested inside one outer card.
- `toggleFeeSection(cat)` collapses/expands individual category cards. Toggle chevron rotates via CSS `.collapsed` class.
- CSS: `.fee-cat-section.collapsed` hides `.fee-sched-row`, `.fee-add-btn`, `.fee-cat-empty` children.

### Class Fees (Show Setup → Class Fees)

- `CFG_ORG_FILTER` / `setCfgOrgFilter()` / `renderCfgClassTable()` control which org's classes are shown.
- Org tabs (`.cls-org-tab` pills, Oswald font, `border:1px solid var(--border2)`) are **always shown** — no `orgs.length > 1` guard.
- **No "All" tab** — defaults to the first org on every tab open. The "All" option was removed; it caused confusion.
- `showStab()` resets `CFG_ORG_FILTER = ''` when switching to the Class Fees tab so the first org is always re-selected.

### Classes Page (Division Sub-tabs)

- `pgClasses()` maintains `activeDivision` state (default `'All'`).
- `getActiveDivisions()` collects distinct divisions from the current org's classes.
- `drawDivTabs()` / `drawAndWireDivTabs()` render division pills below the org pills.
- `drawClassLists()` filters by `activeDivision` when not `'All'`.

### Entries Import

- After `parseCognito()` succeeds, the app immediately calls `showPage('entries')` — the user lands on the Entries page right away.
- `syncEntriesToSupabase()` runs async in the background; result is shown via `toast()`.
- `tryRestoreMapper()` hides the upload drop zone and shows a "Re-upload file" button when a saved column mapping already exists.

---

## Results Import — Audit Flow

File upload no longer commits immediately. The flow is:

1. **`handleResultsFile(file)`** — calls `previewResultsFile(file)` then `showResultsAudit(data)`.
2. **`previewResultsFile(file)`** — async; parses the SHTX results file, calls `parseClassDivStr` + `classParseConfidence` on each unique class string. Returns `{parsedRows, uniqueClasses, filename}` without saving anything.
3. **`showResultsAudit(data)`** — renders a pre-commit audit panel. Each unique class string gets a confidence badge (`matched` / `check` / `unmatched`). User can inline-edit `org`, `division`, `discipline` before committing.
4. **`window.resAuditChange(idx, field, val)`** — handles inline edits in the audit table; updates `_pendingResultsAudit`.
5. **`window.commitResultsImport()`** — applies corrections, saves to `G.results`, calls `pgResults()`.
6. **`_pendingResultsAudit`** — module-level var holding the preview between audit and commit.

**`classParseConfidence(rawStr, parsed)`** — rates parse result as `'matched'` (clean hit), `'check'` (ambiguous), or `'unmatched'` (no hit). Added after `parseClassDivStr`.

---

## Points Systems

`calcAqhaPoints(rows, entries)` — **AQHA points:**

- 1–2 entries: no points (`tier = 0`).
- **3–4 entries: 0.5 pts to 1st only** — special-cased before the tier formula. (Previous bug: `floor(3/5) = 0` → no points.)
- 5+ entries: `tier = Math.min(9, Math.floor(entries / 5))`. Cap at 9 prevents over-awarding in very large classes. (Previous bug: no cap → could exceed 9.)

`APHC_PTS_TABLE` — ApHC points lookup table, 6-tier hardcoded structure.

Points system identifiers: `'entries'`, `'entries+1'`, `'aqha'`, `'fixed10'`, `'aphc'`, `'none'`.

---

## Pending Work — Do Not Implement Without User Present

### NRCHA Scoring (blocked on score sheets)

NRCHA uses a 7-step **RUN CONTENT** scale: `--` / `-` / `√-` / `√` / `√+` / `+` / `++` = −2/−1/−½/0/+½/+1/+2. This is more granular than the existing NCHA cutting `scorePairs` system (which has 4 steps). Templates needed:

- **NRCHA Cow Work** — 7 maneuvers: Boxing, Rating, Form & Quality of Turns, Circling, Position & Control, Degree of Difficulty, Eye Appeal. Penalties [1,2,3,5].
- **NRCHA Boxing** — 7 maneuvers: Approach, Position, Form & Correctness, Control, Degree of Difficulty, Eye Appeal, Time Worked. Penalties [1,3,5].
- **NRCHA Reining** — pending score sheet from user.
- **NRCHA Herd Work** — pending score sheet from user.

Implementing these requires extending the `scorePairs` UI to support 7 buttons instead of 5. New UI work — do not add data only.

### Horse / Rider Tab Combining (not yet implemented)

Two riders often share one horse (trainer + owner, parent + child). The owner or parent pays the combined tab. Requirements:

- Fuzzy horse name matching (same approach as rider fuzzy-match already in place).
- Ability to group billing under one payee across different riders on the same horse.
- Ability to split entries back out by rider if needed.
- Do not implement without user — needs UX design session first.

### Points System Verification

Verify all org points formulas against `Example files/Horse ASSOCIATIONS Divisions and classes.xlsx`. Orgs that need checking: **ASHA, NVRHA, NRHA** specifically. Do not change formulas until the spreadsheet is reviewed together.

### Results Parser Improvements

`parseClassDivStr()` has known weaknesses for certain SHTX string formats. The audit panel (added this session) catches them at import time, but the underlying parser should be improved. Work through common failure patterns from audit logs before changing the parser.

---

## Todo List

- [x] **Horse/rider tab combining** — implemented: billing groups (merge/split), horse alias canonical names, same-horse detection badge, Supabase sync via `billing_groups` + `horse_aliases` tables
- [ ] **Points system verification** — audit ASHA, NVRHA, NRHA formulas against the Excel reference file (`Example files/Horse ASSOCIATIONS Divisions and classes.xlsx`)
- [ ] **Results parser improvements** — strengthen `parseClassDivStr()` for edge-case SHTX strings; use audit panel failure patterns as test cases
- [ ] **Feature flags → UI** — wire `enable_*` flags from `associations` table into the secretary app UI — do not implement without user present to test
- [ ] **NRCHA scoring UI** — extend `scorePairs` system to support 7 buttons (±2 scale) for NRCHA cow work events; blocked on remaining score sheets from user
- [ ] **Multi-tenant RLS** — tighten Supabase row-level security once multi-tenant architecture is ready; coordinate with user before any change

---

## End-of-Session Checklist (scoring changes)

After any session that touches `SCORE_TEMPLATES`, `calcTotal`, or `getTemplateForDisc`:
1. Run `/score-audit` to verify maneuver counts match `Example files/` score sheets in both files.
2. Run `/sync-check` to confirm app.html and scribe.html are in sync.

---

## Theme

Deep Forest dark theme:

```css
--bg: #090f0b;
--card: #0e1a10;
--accent: #c8922a;
```

Do not introduce other color schemes unless building a new theme toggle.
