---
name: document
description: Add or improve documentation for a file or function
argument-hint: "[file path]"
---

Document the code in $ARGUMENTS.

## Instructions

- Add module/file-level docstring explaining purpose
- Add docstrings to all public functions, classes, and methods
  (params, types, return value, exceptions)
- Add inline comments for non-obvious logic
- Match the project's existing doc style; fall back to language standard
- Do NOT change any logic

## Output

Edit the file in place. If $ARGUMENTS is empty, document the most recently discussed file.
