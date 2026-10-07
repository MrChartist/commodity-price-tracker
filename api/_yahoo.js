// Shared helpers for the serverless data layer (Vercel Node runtime).
// Yahoo Finance sends no CORS headers, so the browser cannot call it directly.
// These functions call it server-side and re-serve the data from our own origin.
const UA = 'Mozilla/5.0 (compatible; CommodityPriceTracker/1.1; +https://commodity.mrchartist.com)';
const HOSTS = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
const SYMBOL_RE = /^[A-Z0-9=^.\-]{1,14}$/;

async function yahooChart(symbol, params, timeoutMs = 7000) {
  let lastErr;
  for (const host of HOSTS) {
    try {
      const url = `https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}?${params}`;
      const resp = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(timeoutMs) });
      if (!resp.ok) { lastErr = new Error(`HTTP ${resp.status}`); continue; }
      const result = (await resp.json())?.chart?.result?.[0];
      if (result) return result;
      lastErr = new Error('empty result');
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('Yahoo unavailable');
}

async function getJson(url, timeoutMs = 5000) {
  const resp = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(timeoutMs) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

module.exports = { yahooChart, getJson, SYMBOL_RE };
