#!/usr/bin/env python3
"""
PreToolUse hook: intercepts git push commands.
Outputs a permission decision of "ask" so the user gets a confirmation
dialog before any push deploys to thorofare.app (production).
"""
import sys
import json

data = json.load(sys.stdin)
command = data.get('tool_input', {}).get('command', '')

if 'git push' in command:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": "git push auto-deploys to thorofare.app (production). Confirm this is intentional."
        }
    }))
