# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
