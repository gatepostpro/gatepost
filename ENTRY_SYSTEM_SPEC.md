---
# Entry System Specification — Thorofare

**Version:** 0.2
**Date:** 2026-05-02
**Status:** Draft — open questions unresolved

---

## 0. Core Architectural Principle

**Association definitions are the single source of truth.**

Classes, divisions, and disciplines are defined once at the association level in Supabase. Shows, entries, the scribe, and results all reference those definitions — they do not copy them. When an association updates a class name, adds a division, or changes a rule, every show that has not been frozen sees the update automatically.

**Freeze rule:** Once a show is marked complete/posted, its class snapshot is frozen. Historical results do not change when association definitions change.

**The full data chain:**

```
Association definitions (Supabase)
  → Show Setup: secretary selects which classes are at this show
    → Entry form: rider selects from those classes
      → Entry stores classNum (a reference, not a copy)
        → Scribe reads entries by classNum
          → Results tagged with classNum
            → Season standings aggregates by classNum
              → Display reads association definition for names/labels
```

When one link updates, the rest follow — because everything downstream holds a reference, not a local copy.

---

## 1. Overview

This spec covers the entry system for Thorofare: the show-level configuration that shapes what an entry looks like, the three pathways through which entries arrive (online form, spreadsheet import, hand entry), and the canonical Entry schema that all three pathways produce.

We are writing this before building any pathway to pin down the canonical Entry schema. All three pathways must produce the same data shape so that the rest of the platform — Checkout, scoring, results, points, season standings — can read entries without knowing or caring how they arrived.

---

## 2. Associations, Host Orgs, and Memberships

These are three distinct concepts. The spec treats them separately.

### 2.1 Host Organization

The organization running the show. For CoWN shows, the host is CoWN. The host org is always present — it is not a selection, it is the identity of the show. Set in the associations table and in G.cfg. CoWN is a sub-organization of SHTX; RMQHA is a local sub-org of AQHA. These parent/child relationships exist but do not automatically drive what is collected — they inform the suggested defaults.

### 2.2 Associations at This Show

Which associations have classes, rules, or other offerings at this show. Selected by the secretary in Show Setup (Pivot A). Examples: CoWN, CoWN Collegiate, AQHA VRH, AQHA Ranch Classes, APHA, ApHC, NRHA, NRCHA, Wyoming High School Rodeo, Other (free text).

This selection drives:
- Which class/division sections appear in Show Setup and the entry form (filtered from association definitions)
- Which columns the import mapper expects

**This selection does NOT automatically determine which membership numbers are collected.** Memberships are configured separately (see 2.3).

### 2.3 Membership Organizations

Which membership numbers to collect on entries. A configurable list per show, independent of Pivot A.

The system suggests a default list based on the associations in Pivot A — selecting AQHA VRH suggests adding AQHA and RMQHA fields. But the secretary can:
- Remove any suggested field
- Add local or sub-org fields (SHTX, RMQHA, a regional club) not suggested automatically
- Rename field labels

The result is a per-show membership field list stored in show config that drives both the entry form and the import mapper.

### 2.4 Liability Waivers

Waiver text is editable per association in admin.html. The entry form assembles the relevant waivers based on which associations are at this show. A secretary can override waiver text at the show level without changing the association-level default.

---

## 3. Show Setup — Entry Configuration

Show Setup gains a new Entry Configuration section between Show Details and Classes.

**Tab order:**
1. Show Details — name, dates, location, contact, rules/safety text
2. Entry Configuration — new
3. Classes — filtered from association definitions per Pivot A
4. Finances — fee schedule; association admin fees pre-suggested from Pivot A, all editable
5. Remaining existing tabs

### Pivot A: Which associations are at this show?

Multi-select checkboxes. Drives the Classes tab, Finances pre-load, mapper field list, and online form class sections.

### Pivot B: Entry pathway(s)

Multi-select — all three can be active simultaneously.

| Pathway | What it enables |
|---|---|
| Online entry form | Generates a shareable public URL; riders fill out the form themselves |
| Spreadsheet import | Enables the column mapper; secretary uploads Excel/CSV from any collection tool |
| Hand entry | Secretary fills entries directly in the secretary app |

All three produce the same canonical Entry object (Section 4).

Online form settings (shown only if online pathway is enabled): public/private toggle, scratch deadline, late fee cutoff date and amount, entry form preview link.

### Other show-level configuration

| Config | Notes |
|---|---|
| Fee schedule | Class fees by org/division tier; cattle surcharge; office fee; haul-in per horse; stalls; RV; shavings. Pre-suggested defaults — every amount is editable. |
| Association admin fees | Per org: description, amount, per-entry or per-class, optional discipline filter. Pre-suggested from Pivot A, editable. |
| Available clinics | Name, date, time, capacity, fee — add/remove per show |
| Available warm-up slots | Discipline, day, times, capacity per slot, fee — add/remove per show |
| Membership field list | Configurable per 2.3 |
| Waiver text | Pulled from association definitions, overridable per show |

**Nothing is hardcoded. All fees and offerings are editable defaults.**

---

## 4. Canonical Entry Schema

Every entry, regardless of pathway, is stored as a single object with the fields below.

Source key: rider = person entering; secretary = show staff; system = auto-computed; import = mapped from spreadsheet.

### 4.1 Rider / Contact

| Field | Type | Source | Notes |
|---|---|---|---|
| entryNum | number | system | Auto-assigned; online entries get provisional number confirmed on secretary review |
| riderNameFirst | string | rider | |
| riderNameLast | string | rider | |
| address1 | string | rider | |
| address2 | string | rider | Optional |
| city | string | rider | |
| state | string | rider | |
| zip | string | rider | |
| phone | string | rider | |
| email | string | rider | |
| isYouth | boolean | rider | |
| dob | date | rider | Required if isYouth |

### 4.2 Agreements

Waiver text lives in the associations table, not on the entry.

| Field | Type | Source | Notes |
|---|---|---|---|
| waivers | array | rider | One record per waiver: {org, waiverKey, signature, parentSig, signedAt} |
| amateurSignature | string | rider | Required for non-Pro divisions |
| amateurParentSig | string | rider | Required if youth and amateur division |

### 4.3 Horse

| Field | Type | Source | Notes |
|---|---|---|---|
| horseName | string | rider | Registered name as on papers |
| horseGender | enum | rider | Mare / Gelding / Stallion |
| horseOwner | string | rider | Must match registration papers |
| horseDob | date | rider | Required if entering a Jr Horse class |

### 4.4 Membership Numbers

Driven by the show's configured membership field list (2.3). Stored as a flexible map so it is not limited to a hardcoded set of orgs.

```
memberships: {
  "CoWN":  "1234",
  "SHTX":  "5678",
  "AQHA":  "9999",
  "RMQHA": "0001"
}
```

| Field | Type | Source | Notes |
|---|---|---|---|
| memberships | object | rider | {orgKey: memberNumber} — keys defined by show's membership field list |
| membershipPurchase | array | rider | [{org, tier}] — triggers membership fee line on tab |
| universityAffiliation | string | rider | Required for CoWN Collegiate |

### 4.5 Classes

An array of class registrations. Each element is a **reference** to a class in the association definitions — not a copy.

| Field | Type | Source | Notes |
|---|---|---|---|
| classNum | string | system | Canonical class number from association definitions / G.cfg.classes |
| org | string | system | Resolved from class definition at display time |
| division | string | system | Resolved from class definition at display time |
| discipline | string | system | Resolved from class definition at display time |
| className | string | system | Full display name from class definition |
| baseFee | number | system | From show fee schedule at time of entry |
| cattleFee | number | system | Auto-added for cow disciplines |
| jackpotFee | number | system | Auto-added if division has jackpot configured |
| isCow | boolean | system | From class definition |

**Selection flow:** Rider picks org, then division, then classes from that division. Fees auto-populate from the show fee schedule. The classes array is flat — org, division, and discipline are resolved from the definition at display time, not stored redundantly on each element.

**Multi-org / multi-division:** A rider can enter multiple orgs and multiple divisions per org with the same horse. CoWN allows up to 2 divisions per horse/rider combination.

### 4.6 Clinics and Warm-ups

Array of slot registrations. Each is a reference to a slot configured for this show.

| Field | Type | Source | Notes |
|---|---|---|---|
| type | enum | rider | clinic or warmup |
| slotId | string | rider | References a slot in show config |
| name | string | system | Resolved from show config |
| day | string | system | Resolved from show config |
| timeSlot | string | system | Resolved from show config |
| fee | number | system | From show config at time of registration |

### 4.7 Stalling and RV

| Field | Type | Source | Notes |
|---|---|---|---|
| stallingGroupName | string | rider | One person books for a group |
| stallingArrivalDate | date | rider | |
| stall1qty | number | rider | 1-night stall quantity |
| stall1nights | number | rider | Number of nights for 1-night stalls |
| stall2qty | number | rider | Circuit stall package quantity |
| stall3qty | number | rider | 3-night individual stalls, if offered by this show |
| shavingsQty | number | rider | Bags |
| haulInQty | number | rider | Number of horses hauled in; fee charged per horse |
| rvArrivalDate | date | rider | |
| rv1qty | number | rider | RV spot quantity |
| rv1nights | number | rider | Number of nights |
| rvCircuit | number | rider | Circuit RV package, if offered |

### 4.8 Extras and Flags

| Field | Type | Source | Notes |
|---|---|---|---|
| isLateFee | boolean | rider/system | Set by rider acknowledgment or auto-applied after cutoff date |
| source | enum | system | online / import / hand — audit only, no downstream effect |
| backNum | string | secretary | Assigned at check-in |
| orgFees | array | secretary | Manual fee adjustments added by secretary |
| customFees | object | import | Extra spreadsheet columns: {columnName: numericQty} |
| notes | string | secretary | Internal only — not visible to rider |

### 4.9 Computed / Show State

Not stored on the entry object. Managed in G and Supabase, referenced by entryNum.

| State | Location |
|---|---|
| Per-class scratches | G.scratches |
| Full-show scratches | G.fullScratches |
| In-progress scores | G.scratchpad |
| Posted results | G.results |
| Billing group membership | G.billingGroups |
| Horse aliases | G.horseAliases |

---

## 5. Three Entry Pathways

All three produce a canonical Entry object (Section 4). The platform does not know or care which pathway was used.

### 5.1 Online Entry Form (entry-form.html)

Public URL: thorofare.app/entry?show=showId

Multi-step wizard. Steps are shown or skipped based on show config.

| Step | Content |
|---|---|
| Welcome | Show name, dates, location, fee summary, rules/safety text from show config. Agreement checkboxes. |
| Rider Info | Contact fields, youth flag, DOB if youth. |
| Agreements | Waivers assembled per show's associations. Typed signature per waiver. Parent/guardian sig if youth. |
| Horse | Registered name, gender, owner, DOB if Jr Horse class. |
| Associations | Which orgs to show with — from this show's Pivot A list. |
| Classes | One section per selected org. Rider picks division, then sees that division's classes, then selects. Fees shown per class. Member number fields and membership purchase per show's configured membership list. |
| Clinics and Warm-ups | Slot picker per offering. Skipped if none configured. |
| Stalling and RV | Skipped if none configured. |
| Summary | Itemized fee list. Late fee applied automatically if past cutoff. Submit. |

On submit: entry written to Supabase with source 'online'. Appears immediately in secretary app. Secretary app shows a pending entries badge count.

### 5.2 Spreadsheet Import (mapper)

Secretary uploads Excel or CSV from any collection tool.

1. Upload file — mapper reads headers and auto-detects column positions
2. Field list filtered to this show's configured fields (Pivot A associations plus membership list)
3. Secretary reviews and corrects column assignments
4. Class columns mapped to classNum values from G.cfg.classes — not free-text strings
5. Extra columns captured as customFees
6. Commit — entries written in canonical format, identical to online form output

The mapper is always available, not just on first import. Re-importing updates existing entries rather than creating duplicates. Match key and conflict strategy: see Open Questions (Section 7).

### 5.3 Hand Entry

Secretary-facing panel in the secretary app. Same logical sections as online form, compact layout, no waiver text. Secretary can save partial entries and complete later. Produces canonical Entry with source 'hand'. Used for walk-up, phone-in, and corrections to any entry regardless of original pathway.

---

## 6. How Updates Propagate

Entries store classNum references, not copies of class data. Changes flow automatically:

| What changes | What updates automatically |
|---|---|
| Association renames a division | Entry display, scribe class list, results view, season standings |
| Association adds a new class | Available in show setup class selection for new shows; existing shows unaffected until secretary adds it |
| Show fee schedule changes | Affects new entries only; existing posted entries keep their fee snapshot |
| Secretary edits a class on a show | Updates entry form and mapper for that show only; association definition unchanged |
| Show marked complete | Class list and fee schedule frozen; future association changes do not alter historical results |

---

## 7. Decisions and Future Features

Questions have been answered. Items are marked **Phase 1** (must be built now) or **Future** (designed for but not built yet — architecture must not block them).

---

### 7.1 Payment

**Decision:** Payment collection is configurable per show. Options the secretary can enable:
- Pay at show (default — no online payment collected)
- Online payment via linked processor (Stripe or similar; Cloudflare Pages supports this via Workers or third-party embed)
- Both — rider can pay online or choose to pay at show

**Phase 1:** Pay-at-show only. The summary page shows the amount due and instructions.
**Future:** Online payment integration. The show config gets a payment section where the secretary links their Stripe account or similar. The entry form shows a payment step at the end when enabled.

**Architectural note:** The canonical Entry schema must include a `paymentStatus` field (`unpaid` / `paid-online` / `paid-at-show`) from day one, even if Phase 1 only ever sets it to `unpaid`. This prevents a schema migration later.

---

### 7.2 Clinic and Warm-up Capacity

**Decision:** Clinic and warm-up slots are capacity-limited. When a slot is full:
- The online entry form marks the slot as full and prevents selection
- A waitlist option is offered — rider can join the waitlist for that slot
- When a spot opens (cancellation), the next person on the waitlist is notified by email

**Phase 1:** Capacity enforcement (hard-block when full). No waitlist.
**Future:** Waitlist — stored as a separate array on the slot config. Notification email on opening.

**Architectural note:** Slot config needs `capacity` and `registered` count from day one. The waitlist array can be added later without a schema change.

---

### 7.3 Multiple Horses and Riders Per Submission

**Decision:** The entry form supports adding multiple horse/rider combinations in a single submission. This is a major architectural point.

**Implications:**
- A **Submission** is a container that can produce one or more **Entries**. Each Entry is one horse/rider combination.
- The submission has one billing contact (the person filling out the form and paying). Entries within the submission may have different riders (e.g. parent submitting for two children, or trainer submitting for multiple horses).
- Each Entry within a submission gets its own: horse info, rider info (if different from billing contact), association memberships, class selections, office fee, back number.
- Stalling can be shared across entries in a submission (one stalling block covers multiple horses) or split per horse.
- This connects directly to the billing groups system already built — entries from the same submission start as a billing group.

**Submission object (wrapper around entries):**
```
{
  submissionId,
  billingContact: { name, address, phone, email },
  paymentStatus,
  submittedAt,
  source,
  entries: [ Entry, Entry, ... ]   // each is a full canonical Entry
}
```

**Phase 1:** One horse/rider per submission (current behavior). The submission wrapper exists in the data model but always contains exactly one entry.
**Future:** The entry form gets an "Add another horse/rider" button after the class selection step. Each additional horse/rider goes through the horse → classes flow again. One summary and one payment covers all.

**Architectural note:** Build the Submission wrapper into the schema now even if Phase 1 only puts one Entry in it. The secretary app already handles multi-entry billing groups — the Submission concept formalizes that for the online form.

---

### 7.4 Horse and Member Registry

**Decision:** Build a running database of horses and members as they are entered across shows. Use it to speed up re-entry (autocomplete horse name → auto-fill owner, gender, DOB) and secretary hand entry.

**Horse registry:** Each unique horse (by registered name + owner, fuzzy-matched) gets a record storing: registered name, gender, owner, DOB, registration numbers per org, show history.

**Member registry:** Each unique rider gets a record storing: name, contact info, membership numbers per org, show history. This is the foundation of a membership management system that can be monetized separately.

**Phase 1:** No registry. Free-text entry everywhere.
**Future:** Registry tables in Supabase. Entry form and hand entry get autocomplete on horse name and rider name. When a match is found, fields pre-fill. Rider can confirm or override. New entries add to the registry automatically.

**Architectural note:** The `enable_horse_registry` feature flag already exists in the associations table. Do not wire it until the registry tables are built.

---

### 7.5 Import Merge Strategy

**Decision:** When re-importing a spreadsheet:

1. **Match key:** Try entry number first (if the file has one). Fall back to rider last name + horse name.
2. **No changes:** Skip silently. Do not re-write unchanged entries.
3. **Changes detected:** Flag those entries in a pre-commit audit panel. Show old vs. new values side by side. Secretary can accept, reject, or manually override each changed field.
4. **New entries (no match found):** Add as new entries. Show in audit panel as "new."
5. **Entries in app but not in file:** Do not auto-delete. Flag them in the audit panel as "not in file — scratch or remove manually."

**Phase 1:** Implement this merge strategy in the mapper. The audit panel already exists; extend it with the old/new comparison view.

---

### 7.6 Back Number Assignment

**Decision:** Back number assignment is configurable per show. Secretary sets the mode in Show Setup:

| Mode | Behavior |
|---|---|
| Manual | Secretary assigns back numbers individually at check-in (current behavior) |
| Auto-sequential | System assigns numbers automatically as entries are confirmed, starting from a configured number |
| Carry from previous show | Secretary selects a prior show; riders who appeared in that show keep their back number |
| From member number | Back number is set to the rider's member number for a specified org (e.g. CoWN member #) |

**Phase 1:** Manual assignment only (current behavior). Mode selector in Show Setup is built but only Manual is wired.
**Future:** Implement the other three modes. Auto-sequential needs a starting number input and a "re-number" button for when entries change. Carry-from-show needs a show selector. From-member-number needs an org selector.

---

### 7.7 Association Definition Ownership

**Decision:** TwoTop admin only can edit canonical class/division definitions directly. Show secretaries can submit a change suggestion with supporting proof (e.g. a link to the updated rulebook, a screenshot, a note). The suggestion must be aligned with the affected association — TwoTop reviews and applies or rejects it. No self-service editing by secretaries.
