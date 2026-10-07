// GET /api/quotes?s=GC=F,SI=F,USDINR=X
// Returns live quotes for many Yahoo symbols in one call, plus gold-api.com spot
// for the four precious metals and the daily FX table (used only for non-USD contracts).
// Edge-cached for 15s so every visitor shares one upstream fetch per window.
const { yahooChart, getJson, SYMBOL_RE } = require('./_yahoo');

const SPOT = ['XAU', 'XAG', 'XPT', 'XPD'];

module.exports = async (req, res) => {
  const symbols = [...new Set(String(req.query.s || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean))].sort();
  if (!symbols.length || symbols.length > 60 || !symbols.every(s => SYMBOL_RE.test(s))) {
    res.status(400).json({ error: 'Provide 1-60 valid symbols in ?s=' });
    return;
  }

  const quoteJobs = symbols.map(async sym => {
    try {
      const r = await yahooChart(sym, 'interval=1d&range=5d');
      const m = r.meta || {};
      if (typeof m.regularMarketPrice !== 'number') return [sym, null];
      // Previous session close. The last daily bar is today's session only when its date
      // (in the exchange timezone) equals the latest market-time date; otherwise the
      // last bar is already the previous session's close.
      const ts = r.timestamp || [];
      const closes = r.indicators?.quote?.[0]?.close || [];
      const off = m.gmtoffset || 0;
      const day = t => Math.floor((t + off) / 86400);
      let prev = m.chartPreviousClose ?? m.previousClose ?? null;
      for (let i = ts.length - 1; i >= 0; i--) {
        if (typeof closes[i] !== 'number') continue;
        if (m.regularMarketTime && day(ts[i]) === day(m.regularMarketTime)) continue; // today's bar
        prev = closes[i];
        break;
      }
      return [sym, { price: m.regularMarketPrice, prev, currency: m.currency || 'USD', marketTime: m.regularMarketTime || null, marketState: m.marketState || null }];
    } catch (e) { return [sym, null]; }
  });
  const spotJobs = SPOT.map(async s => {
    try { const d = await getJson(`https://api.gold-api.com/price/${s}`); return [s, typeof d.price === 'number' ? { price: d.price, updatedAt: d.updatedAt || null } : null]; }
    catch (e) { return [s, null]; }
  });
  const fxJob = getJson('https://open.er-api.com/v6/latest/USD').then(d => d.rates || null).catch(() => null);

  const [quoteEntries, spotEntries, fxRates] = await Promise.all([Promise.all(quoteJobs), Promise.all(spotJobs), fxJob]);
  const quotes = Object.fromEntries(quoteEntries.filter(([, v]) => v));
  const spot = Object.fromEntries(spotEntries.filter(([, v]) => v));

  res.setHeader('Cache-Control', Object.keys(quotes).length ? 'public, s-maxage=15, stale-while-revalidate=45' : 'no-store');
  res.status(200).json({ ts: Date.now(), quotes, spot, fxRates });
};
