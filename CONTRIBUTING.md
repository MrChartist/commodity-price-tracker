# Contributing

Thank you for helping to improve the India Commodity Price Tracker.

## Ways to help

- Report a wrong duty rate, unit conversion or data source. Please add a link to the official notification if you have one.
- Suggest a commodity that has a reliable free price feed.
- Fix bugs or improve the docs.

## Ground rules

- The project is plain HTML, CSS and JavaScript. There is no build step and no runtime dependency. Please keep it that way.
- `app.js` (the `COMMODITIES` configuration) is the source of truth for duty rates, units, indicative prices and sources. If you change it, update `docs.html` and `README.md` in the same pull request.
- Do not present calculated values as NSE or MCX data.
- Do not add indicator-based content (such as RSI or MACD) or anything that reads as trading advice.
- Mark anything you cannot verify as "Needs verification". Do not guess numbers.
- Write in simple, formal Indian English.

## Setup

```bash
git clone https://github.com/MrChartist/commodity-price-tracker.git
cd commodity-price-tracker
npm run dev
```

Open the local address shown in the terminal (port 3000 by default; set `PORT` to change it). The dev server only needs Node.js. There is nothing to install.

## Pull requests

1. Fork the repository and create a branch.
2. Keep each pull request focused on one change.
3. Check the dashboard, `docs.html` and `about.html` at 360 px and 1280 px width, in light and dark themes, with no console errors and no horizontal scroll.
4. Add a line to `CHANGELOG.md` for user-visible changes.
5. Fill in the pull request template.

## Licence

By contributing you agree that your work is released under the MIT licence.
