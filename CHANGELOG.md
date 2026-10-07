# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added
- Volume (latest and previous session) in each card's Details, and a volume histogram under every chart.
- Weekly open interest with week-on-week change and managed-money net positioning from the CFTC Commitments of Traders report, for the 23 commodities whose CFTC contract matches the instrument priced. Always dated and labelled weekly. Refreshed by the chart workflow.

### Changed
- Moved hosting from Vercel to GitHub Pages. The site is now fully static and the project is open source for anyone to fork.
- New data pipeline: a GitHub Actions workflow runs about every 5 minutes, fetches Yahoo Finance, gold-api.com spot and FX on the runner, and force-pushes `prices.json` to an orphan `data` branch. A daily workflow publishes chart history under `charts/` on the same branch. The browser reads `raw.githubusercontent.com` (location set in `config.js`) and reads gold, silver, platinum and palladium spot directly from gold-api.com every 60 seconds. The `/api` endpoints are removed.
- Freshness wording corrected: precious metals spot is about a minute old; everything else and USD/INR can be up to about 5 minutes old, and more when GitHub delays or pauses scheduled runs.
- All URLs, the service worker, the manifest and `404.html` are now relative, so the site works at the root of a domain or at a sub-path such as `owner.github.io/repo/`.
- Screenshots moved from `docs/screenshots` to `assets/screenshots`, so `docs/` no longer clashes with `docs.html` on GitHub Pages.
- Canonical URLs, sitemap and links use `docs.html` and `about.html`.

### Security
- Content Security Policy and referrer policy added as `<meta>` tags, replacing the Vercel headers. `frame-ancestors` cannot be set with a meta tag and is no longer enforced.
- Added `SECURITY.md` and updated `.well-known/security.txt`.

### Added
- `CNAME`, `.nojekyll` and a Dependabot configuration for GitHub Actions.
- README guide: fork and run your own copy.

### Removed
- `vercel.json`.

### Changed (earlier, same release)
- Minimal cards: one headline India landed price, with the full breakdown, notes and source behind a "Details" toggle.
- Removed the duplicate bottom tab bar, the long methodology block, the keyboard legend and the long footer text. Methodology lives in the docs.
- README screenshots retaken from the new design with live data.

### Fixed
- Live data: the public CORS proxies the app depended on had stopped working (403/503/522), so most commodities fell back to stale values. Prices and chart history now come through our own `/api/quotes` and `/api/chart` endpoints, edge-cached for about 15 seconds.
- USD/INR now uses the live Yahoo Finance rate. The previous source updates only once a day.
- Gold, silver, platinum and palladium are priced from live spot (the basis for Indian bullion prices), with the daily change taken from futures. Previously the futures price was used, about 0.8% above spot for gold.
- Day change uses the previous session close, chosen by bar date.
- The service worker no longer caches `/api/` responses.

## [1.1.0]

### Added
- Mr. Chartist branding: official symbol, app-icon tile, favicon and social preview image.
- Progressive Web App support: web manifest, service worker, app icons and offline use.
- SEO and discoverability: meta tags, Open Graph and Twitter cards, `robots.txt`, `sitemap.xml`, `llms.txt`, `humans.txt` and a `404.html` page.
- Watchlist, market summary strip, deep links and share links, and keyboard shortcuts on the dashboard.
- New `about.html` page.
- Project files: `CHANGELOG.md`, `CONTRIBUTING.md`, `LICENSE`, issue templates and a pull request template.

### Changed
- `docs.html` rewritten. Duty, unit and source tables are now checked against the commodity configuration in `app.js`.
- Docs now include "Data freshness and limitations" and "Disclaimer" sections and a searchable glossary of 34 terms.
- `README.md` refreshed with the current commodity count (33), features and project structure.
- Visual redesign in an Apple-style design language.

### Fixed
- Docs no longer mention the retired Metals.live source.
- Docs now state the real refresh interval (about 60 seconds) and the real USD/INR source (ExchangeRate API with Yahoo Finance fallback).

### Security
- Security headers added in `vercel.json`.

## [1.0.0]

- First release: live import landed prices for precious metals, energy, industrial metals and agri commodities, charts, glossary and documentation hub.
