// Builds one chart file: { symbol, currency, updated, daily: 2y, weekly: 10y, monthly: max }, rows are [t,o,h,l,c]
const { yahooChart } = require('./yahoo');

const rows = r => {
  const ts = r.timestamp || [], q = r.indicators?.quote?.[0] || {};
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i], h = q.high?.[i], l = q.low?.[i], c = q.close?.[i];
    if ([o, h, l, c].every(v => typeof v === 'number')) out.push([ts[i], +o.toFixed(4), +h.toFixed(4), +l.toFixed(4), +c.toFixed(4)]);
  }
  return out;
};

async function buildChart(sym) {
  const [d, w, m] = await Promise.all([
    yahooChart(sym, 'range=2y&interval=1d', 12000),
    yahooChart(sym, 'range=10y&interval=1wk', 12000),
    yahooChart(sym, 'range=max&interval=1mo', 12000),
  ]);
  const daily = rows(d), weekly = rows(w), monthly = rows(m);
  if (!daily.length || !weekly.length || !monthly.length) throw new Error('empty');
  return { symbol: sym, currency: d.meta?.currency || 'USD', updated: Date.now(), daily, weekly, monthly };
}

module.exports = { buildChart };
