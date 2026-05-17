# Customer Workflow AI Evidence Board

A one-screen React/TypeScript synthetic case study showing how messy marketplace onboarding records become an evaluated launch decision.

Live demo: `https://laurencebremner.github.io/customer-workflow-ai-workbench/`

## Overview

This project studies the gap between a promising AI prototype and a customer-facing pilot. The concrete scenario is a synthetic seller, Northstar Granola, trying to launch on a marketplace by Friday while its source data disagrees.

The page is designed as an evidence board: synthetic source artifacts on the left, deterministic source-to-decision checks in the centre, and the launch recommendation on the right. The goal is fast technical review, not a generic dashboard.

## What It Shows

- React/TypeScript one-screen case-study surface.
- A local Node API path for health, evaluation, and brief-export endpoints.
- GitHub Pages-compatible static build using simulated case-study data.
- Synthetic source records: `seller_profile.csv`, `product_feed.json`, and `support_thread #4412`.
- Deterministic checks for missing insurance evidence, unmapped category, contradictory support notes, SKU validity, and payout/KYC readiness.
- Visible threshold, readiness score, blocker count, result, recommendation, and code proof.
- Compact TypeScript proof with direct source links.

## Run Locally

```bash
npm install
npm run build
npm run api
```

Then open `http://127.0.0.1:8787`.

For Vite development:

```bash
npm run dev
```

Then open `http://127.0.0.1:5177`.

## Publish

This repository publishes the built static app from the `gh-pages` branch. If the URL returns 404 after the branch is pushed, enable it once in GitHub:

Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `gh-pages` -> Folder: `/root`.

Then open:

```text
https://laurencebremner.github.io/customer-workflow-ai-workbench/
```

## Data Boundary

The case uses simulated workflows, metrics, and source records. It is designed to be reproducible without secrets or third-party API keys. Northstar Granola, source records, support notes, metrics, and workflow details are fictional.

## Files

- `src/App.tsx` - main React product surface.
- `src/data.ts` - typed synthetic customer workflows.
- `src/styles.css` - responsive app styling.
- `api/server.mjs` - no-dependency local Node API and static server.
- `artifact_learnings.md` - notes from rebuilding the artifact as a study rather than a dashboard.
- `architecture.md` - architecture and deployment notes.
- `product_notes.md` - product design notes for the simplified flow.
- `walkthrough.md` - concise product walkthrough.
- `metrics.json` and `synthetic_data.json` - project metadata.
- `qa/visual-check.mjs` - Playwright visual QA script.
