---
description: Review all uncommitted changes, create a commit, and push to production (thorofare.app)
allowed-tools: Bash(git status) Bash(git diff *) Bash(git add *) Bash(git commit *) Bash(git push *)
---

## Current state
!`git status`

## What changed
!`git diff --stat HEAD`

Review the changes above and do the following:

1. Summarize the changes in plain language — what features or fixes are included.
2. Ask the user to confirm they want to deploy, and ask for a commit message (or suggest one based on the changes).
3. Wait for explicit confirmation before proceeding.
4. Once confirmed:
   - `git add` each changed file by name (do not use `git add -A` or `git add .`)
   - `git commit` with the agreed message
   - `git push` to deploy

Remind the user that pushing to `main` auto-deploys to **thorofare.app** immediately — there is no staging environment.
