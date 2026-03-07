# Phase 11 Plan: Fix Faculty Search Filtering

## Root Cause
The search filtering logic in `useExamPapers.ts` only matches against `subject_name` and `subject_code`. It completely ignores `faculty_name`. There are two places that need to be fixed:

1. **Fuse.js instance** (line ~292): only indexes `subject_name` + `subject_code`
2. **Manual text filter** (line ~327-335): only compares `subject_name` + `subject_code`

## Proposed Changes

### `src/hooks/useExamPapers.ts`

**Fix 1 — Fuse.js index** (line ~292): Add `faculty_name` as a key.
```ts
return new Fuse(papers, {
  keys: [
    { name: "subject_name", weight: 0.5 },
    { name: "subject_code", weight: 0.3 },
    { name: "faculty_name", weight: 0.2 },  // <-- ADD THIS
  ],
  ...
});
```

**Fix 2 — Manual text filter** (line ~327-335): Add `faculty_name` to the `includes` check.
```ts
} else if (!useFuse) {
  const subject = p.subject_name || "";
  const code = p.subject_code || "";
  const faculty = p.faculty_name || "";  // <-- ADD THIS
  if (searchLower.length === 1) {
    if (
      subject.charAt(0).toLowerCase() !== searchLower &&
      code.charAt(0).toLowerCase() !== searchLower &&
      faculty.charAt(0).toLowerCase() !== searchLower  // <-- ADD THIS
    ) {
      if (
        !subject.toLowerCase().includes(searchLower) &&
        !code.toLowerCase().includes(searchLower) &&
        !faculty.toLowerCase().includes(searchLower)  // <-- ADD THIS
      ) continue;
    }
  } else if (
    !subject.toLowerCase().includes(searchLower) &&
    !code.toLowerCase().includes(searchLower) &&
    !faculty.toLowerCase().includes(searchLower)  // <-- ADD THIS
  ) {
    continue;
  }
}
```

## Verification Plan
1. `npm run build` exits with code 0.
2. Open dev server, click a faculty name — verify the search page populates with matching results.
