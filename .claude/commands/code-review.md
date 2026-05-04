# Unbiased Code Review Task

Review recently changed code purely on universal best practices.

## Important

Ignore CLAUDE.md and any other project-specific markdown files or
conventions. Do NOT evaluate code against project rules. Evaluate
only on universal standards.

## Steps

1. Run `git diff` to see all recently changed code across all files
2. Review the changes for:
   - Correctness and logic errors
   - Missing error handling in async functions
   - Security vulnerabilities
   - Edge cases that aren't handled
   - Performance concerns
   - Readability and maintainability
3. Summarize findings grouped by file and severity
