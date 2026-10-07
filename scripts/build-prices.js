// Builds the live price snapshot: { ts, quotes, spot, fxRates }.
// Used by scripts/fetch-prices.js (GitHub Actions) and the local dev server.
const { yahooChart, getJson } = require('./yahoo');
const { loadSymbols } = require('./symbols');

const SPOT = ['XAU', 'XAG', 'XPT', 'XPD'];
// Only the currencies the app uses (FX strip + non-USD contracts), keeps the snapshot small.
const FX_KEEP = ['INR', 'EUR', 'GBP', 'JPY', 'CNY', 'AED', 'CAD', 'AUD', 'CHF', 'SGD', 'MYR', 'BRL'];
const pickFx = r => (r ? Object.fromEntries(FX_KEEP.filter(k => typeof r[k] === 'number').map(k => [k, r[k]])) : null);

async function quote(sym) {
  try {
    const r = await yahooChart(sym, 'interval=1d&range=5d');
    const m = r.meta || {};
    if (typeof m.regularMarketPrice !== 'number') return [sym, null];
    // Previous session close. The last daily bar is today's session only when its date
    // (in the exchange timezone) equals the latest market-time date.
    const ts = r.timestamp || [];
    const closes = r.indicators?.quote?.[0]?.close || [];
    const day = t => Math.floor((t + (m.gmtoffset || 0)) / 86400);
    const vols = r.indicators?.quote?.[0]?.volume || [];
    let prev = m.chartPreviousClose ?? m.previousClose ?? null;
    let prevVolume = null;
    let price = m.regularMarketPrice;
    // Contract rolls can make the live quote and the daily bars describe different contracts.
    // If the quote disagrees with today's own bar by more than 5%, trust the bar series (it is
    // what the chart shows) so the day change is not an artefact.
    for (let i = ts.length - 1; i >= 0; i--) {
      if (typeof closes[i] !== 'number') continue;
      if (m.regularMarketTime && day(ts[i]) === day(m.regularMarketTime) && Math.abs(price / closes[i] - 1) > 0.05) price = closes[i];
      break;
    }
    for (let i = ts.length - 1; i >= 0; i--) {
      if (typeof closes[i] !== 'number') continue;
      if (m.regularMarketTime && day(ts[i]) === day(m.regularMarketTime)) continue;
      prev = closes[i];
      prevVolume = typeof vols[i] === 'number' && vols[i] > 0 ? vols[i] : null;
      break;
    }
    const v = m.regularMarketVolume;
    return [sym, { price, prev, currency: m.currency || 'USD', marketTime: m.regularMarketTime || null, volume: typeof v === 'number' && v > 0 ? v : null, prevVolume }];
  } catch (e) { return [sym, null]; }
}

async function buildPrices() {
  const symbols = loadSymbols();
  const [quoteEntries, spotEntries, fxRates] = await Promise.all([
    Promise.all(symbols.map(quote)),
    Promise.all(SPOT.map(async s => {
      try { const d = await getJson(`https://api.gold-api.com/price/${s}`); return [s, typeof d.price === 'number' ? { price: d.price, updatedAt: d.updatedAt || null } : null]; }
      catch (e) { return [s, null]; }
    })),
    getJson('https://open.er-api.com/v6/latest/USD').then(d => pickFx(d.rates)).catch(() => null),
  ]);
  const quotes = Object.fromEntries(quoteEntries.filter(([, v]) => v));
  const spot = Object.fromEntries(spotEntries.filter(([, v]) => v));
  return { symbols, snapshot: { ts: Date.now(), quotes, spot, fxRates } };
}

module.exports = { buildPrices };
