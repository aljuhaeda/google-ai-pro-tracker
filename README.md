# Google AI Pro Tracker — UI/UX Demo

A feature-rich Progressive Web App dashboard concept for tracking Google AI Pro subscription usage — analytics, goal tracking, feature discovery, a Chrome extension shell, and even voice/AR-VR interface experiments. Built with vanilla HTML/CSS/JS and Chart.js.

**This is a UI/UX prototype, not a working tracker.** There is no public Google AI Pro usage API, so every number in the app — usage stats, quotas, history — comes from a mock data generator (`js/api.js`) and a tiny Express server (`server/server.js`) that returns the same hardcoded numbers on every request. Nothing here reads your actual Google account or usage. Treat it as a demo of dashboard/analytics UI design and vanilla-JS app architecture, not a functional product.

## What's actually real here

- The full front-end UI: dashboard, charts (Chart.js), goals, analytics views, dark mode, responsive layout.
- A modular vanilla-JS architecture — separate classes for storage, analytics, charts, goals, notifications, etc. (see `js/`).
- A PWA manifest and installable shell (`manifest.json`, `sw.js`).
- A Chrome extension scaffold (`chrome-extension/`).

## What's simulated / not implemented

- **All usage data** — `js/api.js`'s `APIManager` class generates random/fixed mock data (`generateMockUsageData()`, `generateMockFeatureData()`, `generateMockQuotaData()`) instead of calling a real API.
- **Google sign-in** — `simulateOAuthFlow()` fakes an OAuth response; there's no real Google authentication.
- **The backend** — `server/server.js` is a 30-line Express app that serves one hardcoded JSON blob for `/api/usage`.
- Later "Phase 6/7" features (voice interface, AR/VR, cross-platform analytics) are UI/architecture sketches over the same mock data, not working integrations.

## Running it

```bash
# Front end — just open it, no build step
open index.html

# Optional mock backend
cd server
npm install
node server.js   # serves fake data on http://localhost:3000
```

## Why keep this around

It's a decent showcase of building a fairly large, modular vanilla-JS SPA (PWA + Chrome extension + charts + local storage) without a framework — useful as a UI/architecture sample, just not as a functioning product.
