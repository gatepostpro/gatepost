#!/usr/bin/env python3
"""
PostToolUse hook: scans newly written/edited code for two known footguns:

1. Hardcoded 'CoWN' in JS query/comparison context (not a fallback default).
   Should use G.assocId or G.cfg.orgAbbrev instead.

2. sbFetch(...DELETE...) pattern — build payload before deleting to avoid
   data loss if the subsequent insert fails. Use sbDelete() instead.
"""
import sys
import json

data = json.load(sys.stdin)
tool_input = data.get('tool_input', {})

new_content = tool_input.get('new_string', '') or tool_input.get('content', '')
if not new_content:
    sys.exit(0)

warnings = []

for line in new_content.splitlines():
    stripped = line.strip()
    if not stripped or stripped.startswith('//') or stripped.startswith('*'):
        continue

    # Hardcoded 'CoWN' — flag unless it's clearly a fallback default
    if "'CoWN'" in stripped:
        safe_patterns = ["|| 'CoWN'", "|| \"CoWN\"", 'orgAbbrev', 'default', 'abbrev']
        if not any(p in stripped for p in safe_patterns):
            warnings.append(f"  Hardcoded 'CoWN' (use G.assocId or G.cfg.orgAbbrev): {stripped[:120]}")

    # sbFetch with DELETE
    if 'sbFetch' in stripped and 'DELETE' in stripped:
        warnings.append(f"  sbFetch DELETE pattern (use sbDelete() and build payload first): {stripped[:120]}")

if warnings:
    file_path = tool_input.get('file_path', 'file')
    name = file_path.replace('\\', '/').split('/')[-1]
    print(f"CODE WARNING in {name}:")
    for w in warnings:
        print(w)
