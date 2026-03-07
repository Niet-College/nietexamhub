## Phase 7 Execution Summary

### What Was Done
1. **Types (`src/types/examPaper.ts`)**: Added `teacher_name` to `AssetMappingItem` and `unit` to `NormalizedPaper` / `DisplayPaper`.
2. **Hook (`src/hooks/useExamPapers.ts`)**: Mapped `p.teacher_name` to `faculty_name`. Extracted `Unit #` from the `subject_code` (matching `-U\d+`) if running in "ppt" mode. Passed `unit` down to display.
3. **UI (`src/components/PaperCard.tsx`)**: 
   - Hid `year` badge when it equals "Unknown".
   - Hid `branch_code` badge when it equals "BTech" or duplicates the course name.
   - Hid `branch` badge when it duplicates course or branch_code.
   - Showed a primary `unit` tag.
   - Hid `faculty_name` badge when equals "Unknown".
   - Dynamically hide "type" (i.e., 'Exam' or 'Both') badge since all files in PPT mode are inherently PPTs, but keep it available if in Exam mode.

### Verification
- TypeScript build via `npm run build` returned cleanly (exit 0).
- Redundant and confusing metadata effectively eliminated based on logic implementation.

### Status: ✅ COMPLETE
