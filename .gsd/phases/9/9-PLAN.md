# Phase 9 Plan: UI Redesign for Faculty Names

## Problem Statement
After extracting actual faculty names in Phase 8, the `PaperCard` currently displays this vital information as another generic `<Badge>` alongside data like Semester, Branch, and Course. The user requested to visually distinguish the `faculty_name` so it looks more like authorship ("By: Dr. X") rather than just a metadata tag.

## Proposed Changes

### `src/components/PaperCard.tsx`
1. **Remove Old Badge**: Remove the existing `faculty_name` badge logic (around line 143):
   ```tsx
   {paper.faculty_name && paper.faculty_name !== "Unknown" && (
     <Badge variant="outline" className="text-xs">
       {paper.faculty_name}
     </Badge>
   )}
   ```
2. **Inject New UI Hierarchy**: Add the `faculty_name` directly beneath the `subject_code` in the primary text section of the card (around line 107), styled distinctively with a feather icon or as muted text.
   ```tsx
   {paper.faculty_name && paper.faculty_name !== "Unknown" && (
     <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
       By: {paper.faculty_name}
     </p>
   )}
   ```

## Verification Plan

### Automated Build
1. Execute `npm run build` to ensure TypeScript/TSX compilation passes cleanly.

### Manual Verification
1. Open the UI to `/ppt/search`.
2. Observe a card that possesses a faculty name (e.g., "Semiconductor Diode And Bipolar Junction Transistor" by "Dr. Anjali Gupta").
3. Verify that the faculty name appears as standard text near the subject name/code, and completely disappears from the block of grey background badges below.
