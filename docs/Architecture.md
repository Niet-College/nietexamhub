# Architecture Overview

## Search Engine
The platform relies heavily on **Fuse.js** for frontend fuzzy searching. Large JSON assets (`extracted_data.json` and `ppt_asset_mapping.json`) are pulled dynamically and indexed in-browser.

## State Management
We use a lightweight combination of React Context (`ModeContext`) for global modes (Exam vs PPT) and local state for components.

## Routing
Client-side routing is handled strictly by React Router DOM.
