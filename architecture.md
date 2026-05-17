# Architecture Note

## Goal

Build a narrative customer-workflow AI study with frontend state, typed data, API endpoints, evaluation logic, code proof, and a static deployment path.

## Shape

- Frontend: React, TypeScript, Vite.
- Data model: typed customer scenarios, workflow stages, integration checks, evaluation cases, human review items, and product signals.
- Backend: no-dependency Node HTTP server with `/api/health`, `/api/evaluate`, and `/api/export-brief`.
- Static deployment: Vite build output in `dist/`, linked from `demo.html`, suitable for GitHub Pages.
- Local full-stack mode: `npm run build && npm run api`, then open `http://127.0.0.1:8787`.

## Why This Design

The app is intentionally a narrow study artifact. It avoids a fake all-purpose platform and makes the investigation visible:

1. State the research question.
2. Introduce the four-gate readiness framework.
3. Capture the customer workflow and first-value definition.
4. Run integration and schema checks.
5. Evaluate AI decisions against thresholded cases.
6. Route ambiguous outputs to human review.
7. Produce product feedback from repeated customer patterns.

## Deployment Notes

For GitHub Pages, commit the project folder after running `npm run build`. `demo.html` redirects to `dist/index.html`, and Vite uses relative asset paths through `base: "./"`.

For a richer public repo, split this folder into its own repository and use GitHub Actions to run:

```bash
npm ci
npm run build
```

Then publish `dist/` with Pages.

## Limitations

The workflows, organization names, source records, and metrics are simulated for the case study. The app does not call an LLM provider because the demo should be reproducible without secrets. The useful extension point is replacing the static evaluation cases with provider-backed calls and logged review outcomes.
