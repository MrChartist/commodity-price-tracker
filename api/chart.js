// GET /api/chart?s=GC=F&range=1y  -> { ohlc: [{time,open,high,low,close}, ...] }
const { yahooChart, SYMBOL_RE } = require('./_yahoo');

const RANGES = ['1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'max'];
const DAILY = ['1mo', '3mo', '6mo', '1y', '2y'];

module.exports = async (req, res) => {
  const symbol = String(req.query.s || '').toUpperCase();
  const range = String(req.query.range || '1y');
  if (!SYMBOL_RE.test(symbol) || !RANGES.includes(range)) { res.status(400).json({ error: 'Invalid symbol or range' }); return; }
  try {
    const r = await yahooChart(symbol, `range=${range}&interval=${DAILY.includes(range) ? '1d' : '1wk'}`, 9000);
    const ts = r.timestamp, q = r.indicators?.quote?.[0];
    if (!Array.isArray(ts) || !q) throw new Error('no data');
    const ohlc = [];
    for (let i = 0; i < ts.length; i++) {
      const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i];
      if ([o, h, l, c].every(v => typeof v === 'number')) ohlc.push({ time: ts[i], open: +o.toFixed(4), high: +h.toFixed(4), low: +l.toFixed(4), close: +c.toFixed(4) });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
    res.status(200).json({ symbol, range, currency: r.meta?.currency || 'USD', ohlc });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Upstream unavailable' });
  }
};
