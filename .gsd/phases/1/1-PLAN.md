---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified: ["src/hooks/useExamPapers.ts"]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Papers data paths have external github URLs prepended correctly"
  artifacts:
    - "Modified useExamPapers.ts"
---

# Plan 1.1: Prepend External URLs to Paths

<objective>
Prepend GitHub external URLs to the relative asset paths in the frontend dynamically.

Purpose: We need our frontend to point directly to the GitHub repositories where the PDF assets were migrated, instead of relying on the local relative paths that exist inside `asset_mapping.json` and `ppt_asset_mapping.json`.
Output: Modified `useExamPapers.ts` hook.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/hooks/useExamPapers.ts
</context>

<tasks>

<task type="auto">
  <name>Append GitHub prefix to document paths</name>
  <files>src/hooks/useExamPapers.ts</files>
  <action>
    Modify `normalizeExtractedData` inside `src/hooks/useExamPapers.ts` to prepend the correct GitHub base URL depending on the mode.
    For `exam` mode, the base URL should be: `https://raw.githubusercontent.com/Niet-College/niet-exam-papers-data/main/`
    For `ppt` mode, the base URL should be: `https://raw.githubusercontent.com/Niet-College/niet-ppt-data/main/`
    Update `path` property of `paths` elements so that everything returned has the full URL format. Avoid changing the `filename`. Make sure to strip any leading slash from the path before appending if necessary.
  </action>
  <verify>grep -q "raw.githubusercontent.com" src/hooks/useExamPapers.ts</verify>
  <done>paths will now point to external raw Github content.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] 'raw.githubusercontent.com/' is added to `path` logic.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
