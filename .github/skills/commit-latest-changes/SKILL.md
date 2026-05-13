---
name: commit-latest-changes
description: Create a git commit for the current unstaged or staged changes using a clear, descriptive commit message. Use this when asked to commit the latest changes.
user-invocable: true
---

When the user asks to commit the latest changes with a descriptive message, follow this process:

1. Inspect the repository state.
   - Check which files changed.
   - Review staged and unstaged diffs.
   - If helpful, review a few recent commit messages to match repository conventions.

2. Determine the main purpose of the change.
   - Classify it as a fix, feature, refactor, docs update, test update, or chore.
   - Base the summary only on the actual changes.

3. Draft a descriptive commit message.
   - Use a short imperative subject line.
   - Prefer specificity over generic wording.
   - If appropriate, follow conventional commit style such as: `<type>: <concise description>`, where type is one of:
     - `feat`: A new feature
     - `fix`: A bug fix
     - `docs`: Documentation changes only
     - `style`: Formatting, missing semicolons, etc. (no logic change)
     - `refactor`: Code restructuring (not a fix or feature)
     - `test`: Adding or updating tests
     - `chore`: Build process, dependency updates, tooling
     - `perf`: Performance improvements
     - `ci`: CI/CD configuration changes

4. Prepare the commit.
   - If changes that should be included are not staged, stage them.
   - If staged and unstaged changes appear unrelated, ask whether to commit everything together or split the work.

5. Create the commit.

6. Confirm the result.
   - Report the final commit message used.
   - If there is nothing to commit, say so clearly.

Guidelines:

- Do not invent details not supported by the diff.
- Avoid vague commit messages like `update files` or `misc changes`.
- Prefer repository conventions when they are visible from recent history.
- If the change spans multiple unrelated concerns, ask for clarification before committing.
- Be careful not to stage accidental or unrelated files.

Helpful checks:

- repository status
- staged diff summary
- unstaged diff summary
- recent commit history

Example invocation:

- `Use the /commit-latest-changes skill to commit my current work.`
