---
description: Verify all SCORE_TEMPLATES maneuver counts match official score sheets in both app.html and scribe.html
allowed-tools: Grep Read
---

Audit every entry in `SCORE_TEMPLATES` across both `app.html` and `scribe.html` against the known-correct values from official score sheets.

**Known-correct maneuver counts:**

| Template key | Maneuvers | Notes |
|---|---|---|
| Reining | 9 | AQHA, [0.5,1,2,5], hasNRHA |
| Trail | 9 | AQHA, [1,3,5], hasNRHA |
| Pleasure | 9 | AQHA, [1,3,5], hasNRHA |
| Ranch Reining | 8 | VRH/APHA, [0.5,1,2,5], hasNRHA |
| Ranch Riding | 15 | VRH/RHC, [1,3,5], hasNRHA |
| Ranch Trail | 9 | [1,3,5], hasNRHA |
| Ranch Rail Pleasure | 6 | [1,3,5], hasNRHA |
| Cow Work | 11 | [1,2,3,5] |
| BDBD Cow Work | 8 | [1,3,5] |
| Novice Cow Work | 5 | [1,3,5], hasComments; also handles Rookie Cow Work |
| Cutting | cowCount:3, categoriesPerCow:6 → 18 total array entries | NCHA, check/√ system |
| Ranch Cutting | cowCount:2, categoriesPerCow:4, postCowManeuvers:1 → 9 total | VRH, ±1.5 scale |

Steps:
1. Use Grep to find `SCORE_TEMPLATES` in both files and get the surrounding line range.
2. Read those sections.
3. For each template, count the `maneuvers` array length (or for cutting templates, verify `cowCount`, `categoriesPerCow`, and `postCowManeuvers`).
4. Compare against the table above.
5. Check that the same set of template keys exists in both files.

Report using ✅ (matches), ❌ (wrong count or value), ⚠️ (present in one file but not the other), ❓ (template not in the reference table — flag for manual verification).
