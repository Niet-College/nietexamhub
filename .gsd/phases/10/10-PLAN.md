# Phase 10: Clickable Faculty Name Search

## Problem Statement
The user wants the faculty name displayed in `PaperCard.tsx` to be explicitly clickable, colored "sky blue", and upon clicking to trigger a search for all PPTs by that teacher.

## Proposed Changes

### 1. Update `src/components/PaperCard.tsx`
- Make the `By {paper.faculty_name}` text an interactive element (e.g. `span` or `button` styled like a link).
- Add Tailwind classes for "sky blue" styling: `text-sky-500 hover:text-sky-600 hover:underline cursor-pointer transition-colors`.
- Introduce a navigation action when clicked:
  ```tsx
  import { useNavigate, useLocation } from "react-router-dom";
  
  // inside component:
  const navigate = useNavigate();
  const location = useLocation();

  const handleFacultyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    // Always route to the current mode's search (or specifically /ppt/search if it's a PPT)
    const basePath = location.pathname.includes('/exam') ? '/exam/search' : '/ppt/search';
    
    // We navigate with state so Papers.tsx can pick it up
    navigate(`${basePath}?search=${encodeURIComponent(paper.faculty_name)}`, {
      state: { initialSearch: paper.faculty_name }
    });
  }
  ```

### 2. Update `src/pages/Papers.tsx`
- Currently, `Papers.tsx` only reads `searchParams` on initial mount (`useEffect` with `[]` dependency).
- We need to modify this so it responds to URL query string changes, or simply provide it a `key` in React Router, BUT the simplest way is to make `Papers.tsx` sync its local `searchInput` whenever the route's `search` query parameter changes.
- Modify the `useEffect` to depend on `searchParams` or `location.search`:
  ```tsx
  useEffect(() => {
    const search = searchParams.get("search");
    if (search && search !== filters.searchQuery) {
      setSearchInput(search);
      setFilters(prev => ({ ...prev, searchQuery: search }));
    }
  }, [location.search, searchParams]); // add dependency
  ```

## Verification Plan
1. Local automated tests (`npm run build`).
2. Manual browser verification: Click on a faculty name in the web interface and successfully see the search bar populate and filter to their items.
