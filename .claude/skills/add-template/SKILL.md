---
description: Add a new SCORE_TEMPLATES entry to both app.html and scribe.html simultaneously
argument-hint: <discipline name>
allowed-tools: Read Edit Grep
---

Add a new scoring template for the discipline: **$ARGUMENTS**

Before making any edits, ask the user for the following:

1. **Maneuver count** — how many scored maneuvers appear on the judge's score sheet? (Check `Example files/` if a score sheet is available.)
2. **Penalty values** — what denominations appear on the score sheet? Common patterns:
   - Reining-style: `[0.5, 1, 2, 5]`
   - Trail/pleasure-style: `[1, 3, 5]`
   - Cutting-style: `[1, 3, 5]`
3. **Special flags** (ask about each):
   - `hasNRHA: true` — does this discipline have an NRHA bonus field?
   - `hasComments: true` — does the scribe need a comments field?
   - Is this a cutting discipline with multiple cows? If so: `cowCount`, `categoriesPerCow`, `postCowManeuvers` (e.g. a Courage score outside the cow average)
   - Does it use the check/√ button system instead of numeric scores? If so: `scorePairs` and `zeroLabel`
4. **Trigger keyword** — what word in the class name should activate this template? (e.g. "cutting", "ranch trail", "reining")

Once you have all the answers, make the edits:
- Add the template entry to `SCORE_TEMPLATES` in **both** `app.html` and `scribe.html`
- Add the matching detection case to `getTemplateForDisc` in **both** files — more specific keyword matches must come before more general ones
- Confirm both files were updated before finishing
