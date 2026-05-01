#!/usr/bin/env python3
"""
PostToolUse hook: fires after editing app.html or scribe.html.
If the changed content touches scoring logic, reminds Claude to apply
the same change to the other file. Both files contain identical copies
of SCORE_TEMPLATES, calcTotal, and getTemplateForDisc.
"""
import sys
import json

data = json.load(sys.stdin)
tool_input = data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

SCORING_KEYWORDS = [
    'SCORE_TEMPLATES', 'calcTotal', 'getTemplateForDisc',
    'maneuvers:', 'penValues', 'cowCount', 'scorePairs',
    'categoriesPerCow', 'postCowManeuvers', 'hasNRHA', 'zeroLabel',
]

if 'app.html' in file_path:
    other = 'scribe.html'
elif 'scribe.html' in file_path:
    other = 'app.html'
else:
    sys.exit(0)

new_content = tool_input.get('new_string', '') or tool_input.get('content', '')
if not any(kw in new_content for kw in SCORING_KEYWORDS):
    sys.exit(0)

print(f"SYNC REMINDER: The edit to {file_path.split('/')[-1].split(chr(92))[-1]} touches scoring logic. "
      f"Apply the same change to {other} — both files contain identical copies of "
      f"SCORE_TEMPLATES, calcTotal, and getTemplateForDisc.")
