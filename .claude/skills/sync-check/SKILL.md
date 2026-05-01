---
description: Compare SCORE_TEMPLATES, calcTotal, and getTemplateForDisc between app.html and scribe.html and report any differences
allowed-tools: Grep Read
---

Compare the scoring logic between `app.html` and `scribe.html`. Both files must contain identical copies of `SCORE_TEMPLATES`, `calcTotal`, and `getTemplateForDisc`.

Steps:
1. Use Grep to locate `SCORE_TEMPLATES`, `calcTotal`, and `getTemplateForDisc` in both files (get line numbers).
2. Read those sections from each file.
3. For each template key, compare:
   - Maneuver array length
   - penValues array
   - Special flags: hasNRHA, hasComments, cowCount, categoriesPerCow, postCowManeuvers, scorePairs, zeroLabel
4. Compare the `calcTotal` function body between both files.
5. Compare the `getTemplateForDisc` function body between both files.

Report format:
- List every template key found and its maneuver count in each file
- Flag any template present in one file but missing from the other
- Flag any property that differs between files
- Flag any logic difference in calcTotal or getTemplateForDisc
- If everything matches, say so explicitly
