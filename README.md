<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1a2e,100:6366f1&height=180&section=header&text=Commodity%20Price%20Tracker&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Live%20India%20Import%20Landed%20Price%20Engine&descSize=16&descAlignY=55&descColor=8b5cf6" width="100%" />

<p align="center">
  <img src="docs/screenshots/01_hero_dashboard.png" alt="India Commodity Price Tracker — Live Dashboard" width="100%">
</p>

> **Live Dashboard** that computes real-time India Import Landed Prices for Gold, Silver, Platinum, Palladium, Crude Oil, Natural Gas, Copper, Aluminium, Zinc, Nickel, Lead + Agri commodities (Wheat, Corn, Soybean, Soybean Oil, Sugar, Cotton, Coffee, Cocoa) -- purely from international benchmarks + live forex + customs duty math.
>
> Built by [**Mr. Chartist**](https://github.com/MrChartist) | Part of the [Mr. Chartist Ecosystem](https://mrchartist.com)

<p align="center">
  <a href="https://commodity.mrchartist.com/"><img src="https://img.shields.io/badge/Live_Dashboard-commodity.mrchartist.com-6366f1?style=for-the-badge" alt="Live Dashboard"></a>
  <a href="https://twitter.com/mr_chartist"><img src="https://img.shields.io/badge/Follow-@mr__chartist-0d1117?style=for-the-badge&logo=x&logoColor=white" alt="Twitter"></a>
  <a href="https://buymeacoffee.com/mrchartist"><img src="https://img.shields.io/badge/Sponsor-Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"></a>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Backend-Zero_Server-8b5cf6?style=for-the-badge" alt="No Backend">
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **19 Commodities** | Gold, Silver, Platinum, Palladium, Crude Oil (WTI + Brent), Natural Gas, Copper, Aluminium, Zinc, Nickel, Lead + Agri: Wheat, Corn, Soybean, Soybean Oil, Sugar, Cotton, Coffee, Cocoa |
| **Live Auto-Refresh** | Pulls fresh data every ~30 seconds from COMEX, NYMEX, CBOT, ICE & Yahoo Finance |
| **India Import Landed ₹** | Applies BCD + AIDC + SWS customs duties (verified June 2026 rates, incl. the May 2026 bullion duty hike to 15%) with live USD/INR forex conversion |
| **Date-Aware Duty Engine** | Handles time-bound duty notifications automatically (e.g. cotton duty-free Jun–Oct 2026, reverts to 11% after) |
| **Purity Variants** | 24K / 22K / 18K Gold, 999 / 925 / 900 Silver — auto-calculated |
| **Retail Contract Equivalents** | MCX-style lot values: Gold Mini (100g), Gold Guinea (8g), Gold Petal (1g), Silver (30kg/5kg/1kg) |
| **Indian Market Units** | Grains in ₹/quintal, softs in ₹/kg, gold in ₹/10g — with CBOT cents-per-bushel auto-normalization |
| **Interactive Futures Charts** | TradingView Lightweight Charts with 1M to Max timeframe toggles |
| **Category Filtering** | One-click filter: Precious Metals · Industrial Metals · Energy · Agri |
| **Documentation Hub** | Full methodology engine docs, duty rate matrices & 20-term financial glossary |
| **Dark / Light Mode** | Premium glassmorphic UI with OLED-optimized dark theme |
| **Zero Backend** | 100% client-side — no server, no database, no login required |
| **SEO Optimized** | JSON-LD structured data, Open Graph meta, AI discoverability tags |

---

## 📸 Section-by-Section Walkthrough

### 1. Live Dashboard — Precious Metals & Energy

The default landing view showing **real-time COMEX/NYMEX prices** with:

- **Price Cards** — International spot price + percentage change badge
- **India Landed Breakdown** — Per-gram prices across 24K/22K/18K Gold, 999/925/900 Silver
- **10g & Per-kg Aggregates** — Direct comparison with Indian retail benchmarks
- **Retail Contract Equivalents** — Gold Mini, Guinea, Petal lot values
- **Duty Badges** — Visual BCD + AIDC breakdowns on each card

![Live Dashboard](docs/screenshots/01_hero_dashboard.png)

---

### 2. Energy & Industrial Metals

Scrolling reveals the full commodity spectrum:

- **Brent Crude & Natural Gas** — NYMEX/ICE futures with effective duty overlay
- **Base Metals** — Copper, Aluminium, Zinc, Nickel, Lead in ₹/kg
- **Agri Commodities** — Wheat, Corn, Soybean (₹/quintal), Soybean Oil, Sugar, Cotton, Coffee, Cocoa (₹/kg)
- **Source Attribution** — Each card shows its data origin (Yahoo Finance / gold-api.com / LME Indicative)

![Energy & Industrial](docs/screenshots/02_energy_industrial.png)

---

### 3. Interactive COMEX Charts

Click any **"Chart"** button to launch a full-screen historical chart:

- **TradingView Lightweight Charts** — Professional candlestick rendering
- **7 Timeframes** — 1M, 3M, 6M, 1Y, 5Y, 10Y, Max
- **COMEX Futures Data** — Real historical data from Yahoo Finance

![Chart Modal](docs/screenshots/03_chart_modal.png)

---

### 4. Methodology Engine

The expandable methodology panel explains the entire pricing pipeline:

- **Core Formula** — `India Landed ₹ = (Intl. Price ÷ Unit) × USD/INR × (1 + Duty%)`
- **Metal-Specific Breakdowns** — Gold/Silver, Base Metals, Energy, Platinum
- **Compliance Notice** — No NSE/MCX data disclaimer

![Methodology](docs/screenshots/04_methodology.png)

---

### 5. Documentation Hub

A dedicated `/docs.html` page with comprehensive technical documentation:

- **4-Step Visual Pipeline** — Step-by-step pricing engine walkthrough
- **Duty Rate Matrix** — Complete BCD/AIDC table for all metals
- **Purity Formulas** — 24K→22K→18K conversion table with examples
- **Data Source Cards** — Yahoo Finance, Metals.live, CORS Proxies, Lightweight Charts

![Documentation Hub](docs/screenshots/05_docs_hub.png)

---

### 6. Financial Glossary

A 20-term glossary covering essential commodity trading terminology:

- **Landed Price, BCD, AIDC, SWS** — Import cost concepts
- **COMEX, NYMEX, LME, CBOT, ICE** — Exchange definitions
- **Troy Ounce, Karat, Fineness, Bushel, Quintal** — Measurement units
- **CAD, Windfall Tax, MMBtu** — Macro concepts

![Financial Glossary](docs/screenshots/06_glossary.png)

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| **HTML5** | Single-file dashboard with semantic structure |
| **CSS3** | Custom properties, OLED dark mode, glassmorphism, ambient orbs |
| **Vanilla JavaScript** | Core pricing engine — `app.js` (zero dependencies) |
| **Lightweight Charts** | TradingView's open-source charting library v4.1.3 |
| **Yahoo Finance** | Precious metals, energy, copper/aluminium, agri futures, forex (USDINR=X) |
| **gold-api.com** | Free no-key CORS-friendly spot backup for Gold, Silver, Platinum, Palladium |
| **LME Indicative** | Manually updated Zinc/Nickel/Lead levels (metals.live shut down; no free LME feed exists) |
| **CORS Proxies** | allorigins.win + corsproxy.io for client-side API access |

## 📂 Project Structure

```
Commodity Price Tracker/
├── index.html             # Main dashboard (category tabs, cards, chart modal)
├── docs.html              # Documentation Hub (methodology, glossary)
├── app.js                 # Core pricing engine (45KB, zero dependencies)
├── style.css              # Premium dark/light theme (30KB)
├── vercel.json            # Vercel deployment config
├── package.json           # npm scripts (dev server)
├── .gitignore             # Node.js gitignore
├── docs/
│   └── screenshots/       # README screenshots
│       ├── 01_hero_dashboard.png
│       ├── 02_energy_industrial.png
│       ├── 03_chart_modal.png
│       ├── 04_methodology.png
│       ├── 05_docs_hub.png
│       └── 06_glossary.png
└── README.md              # This file
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MrChartist/commodity-price-tracker.git
cd commodity-price-tracker

# Serve locally (no build step needed!)
npx serve .
# → Open http://localhost:3000
```

That's it. No `npm install`, no build tools, no environment variables. The entire app runs client-side.

## 📊 Data Flow

```
Yahoo Finance CDN ──→ CORS Proxy ──→ app.js (browser)
  · GC=F SI=F PL=F PA=F (Precious)     │
  · CL=F BZ=F NG=F (Energy)            ├── Parse JSON (+ USX cents → USD)
  · HG=F ALI=F (Cu, Al)                ├── Convert Units (oz→g, lb→kg,
  · ZW=F ZC=F ZS=F ZL=F (CBOT grains)  │     MT→kg, bushel→quintal)
  · SB=F CT=F KC=F CC=F (ICE softs)    ├── Apply USD/INR Forex
  · USDINR=X (Forex)                   ├── Layer Import Duties (date-aware)
                                       └── Render Cards + Charts
gold-api.com (no proxy needed) ──→ app.js
  · XAU XAG XPT XPD spot (backup when Yahoo fails)

LME Indicative (in-code, manually updated) ──→ app.js
  · Zinc, Nickel, Lead (no free live LME feed exists)
```

## 🔐 Compliance Notice

> **SEBI Research Analyst Notice:** This application does **NOT** display live data sourced from the National Stock Exchange (NSE) or Multi Commodity Exchange (MCX).
>
> All Indian commodity quotes — including "Retail Contract Equivalents" — are strict **mathematical approximations** derived from international COMEX/NYMEX/CBOT/ICE/LME benchmarks converted to INR via live forex rates with published customs duty overlays.
>
> *Prices are for illustrative and educational purposes only and do not constitute financial advice.*

## ☁️ Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel (zero-config)
npx vercel --prod
```
The repo includes a `vercel.json` with SPA rewrite rules.

### Any Static Host
Since there's no backend, you can deploy to **Netlify, Cloudflare Pages, GitHub Pages**, or any static file host. Just drop the files.

## 💖 Support This Project

If this tool helps you track commodity prices or understand import duty mechanics, consider supporting my work:

<p align="center">
  <a href="https://buymeacoffee.com/mrchartist"><img src="https://img.shields.io/badge/☕_Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"></a>
</p>

Your support keeps these open-source financial tools free for the entire Indian trading community. 🙏

## 🔗 Links

- **Live Dashboard:** [commodity.mrchartist.com](https://commodity.mrchartist.com/)
- **FII/DII Data Terminal:** [fii-diidata.mrchartist.com](https://fii-diidata.mrchartist.com/)
- **X (Twitter):** [@mr_chartist](https://twitter.com/mr_chartist)
- **Support:** [Buy Me A Coffee](https://buymeacoffee.com/mrchartist)

---

<p align="center">
  <b>Made with care by <a href="https://github.com/MrChartist">Mr. Chartist</a></b><br>
  <i>Decoding commodity prices for the Indian retail trader.</i><br><br>
  <a href="https://mrchartist.com"><img src="https://img.shields.io/badge/mrchartist.com-6366f1?style=flat-square&logo=safari&logoColor=white" alt="Website"/></a>
  <a href="https://github.com/MrChartist"><img src="https://img.shields.io/badge/More_Projects-0d1117?style=flat-square&logo=github&logoColor=white" alt="GitHub"/></a>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1a2e,100:6366f1&height=100&section=footer" width="100%" />
