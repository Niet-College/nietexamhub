# Deployment Guide

The app is built organically using GitHub Actions.

When code is merged to `main`, the `deploy.yml` workflow runs:
1. `npm ci`
2. `npm run build`
3. Copies `dist/` to the `gh-pages` orphaned branch.

Make sure your repository has GitHub Pages set to the `gh-pages` branch, and not `main`.
