/* ═══════════════════════════════════════════════════════════════════════╗
 *  COMMODITY PRICE TRACKER — Core Application Logic                     ║
 *  Author: Mr. Chartist                                                 ║
 *  Features: Live commodity prices, India import landed calculations,   ║
 *            10g pricing, multi-commodity support, auto-polling          ║
 * ═══════════════════════════════════════════════════════════════════════╝ */

// ── SVG ICON SYSTEM (replaces emojis for premium look) ──
const SVG_ICONS = {
  gold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3l3 6H2"/><path d="M13 3l-3 6h12"/><path d="M2 9l10 13L22 9"/></svg>`,
  silver: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4"/></svg>`,
  crudeoil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12h12"/><path d="M6 7h12"/><path d="M6 17h12"/><path d="M4 22h16"/></svg>`,
  brentcrude: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 6v6l4 2"/><path d="M6 12h2M16 12h2M12 6v2M12 16v2"/></svg>`,
  naturalgas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-4-4-4-6a4 4 0 0 1 8 0c0 2-2 3.33-4 6z"/><path d="M12 21a8 8 0 0 0 8-8c0-4-4-6-8-10-4 4-8 6-8 10a8 8 0 0 0 8 8z"/></svg>`,
  copper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
  aluminium: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M4 20V10l8-8 8 8v10"/><path d="M9 20v-6h6v6"/></svg>`,
  zinc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M3.3 7L12 12l8.7-5"/></svg>`,
  nickel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  lead: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M6 18h12"/><path d="M6 14h12"/><path d="M10 6h4"/></svg>`,
  platinum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275z"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8L3 8"/><path d="M21 16L3 16"/><path d="M21 4v16"/><path d="M3 4v16"/><path d="M12 4v16"/></svg>`,
};

// ── COMMODITY CONFIGURATION ──
const COMMODITIES = {
  gold: {
    name: 'Gold',
    symbol: 'XAU/USD',
    icon: SVG_ICONS.gold,
    category: 'precious',
    categoryLabel: 'Precious Metal',
    accentColor: 'hsl(45, 93%, 47%)',
    accentBg: 'hsl(45, 93%, 47%)',
    yahooSymbol: 'GC=F',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.06,
    dutyLabel: 'BCD 5% + AIDC 1% = 6%',
    showPurity: true,
    show10g: true,
    showKg: true,
    miniContracts: [
      { name: 'Gold Mini', lot: '1g', multiplier: 1 },
      { name: 'Gold Guinea', lot: '8g', multiplier: 8 },
      { name: 'Gold Petal', lot: '0.5g', multiplier: 0.5 },
    ],
  },
  silver: {
    name: 'Silver',
    symbol: 'XAG/USD',
    icon: SVG_ICONS.silver,
    category: 'precious',
    categoryLabel: 'Precious Metal',
    accentColor: 'hsl(210, 10%, 62%)',
    accentBg: 'hsl(210, 10%, 62%)',
    yahooSymbol: 'SI=F',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.06,
    dutyLabel: 'BCD 5% + AIDC 1% = 6%',
    showPurity: true,
    show10g: true,
    showKg: true,
    purityLabels: [
      { label: '999 Fine', ratio: 1.0 },
      { label: '925 Sterling', ratio: 0.925 },
      { label: '900 Coin', ratio: 0.90 },
    ],
    miniContracts: [
      { name: 'Silver (1 kg)', lot: '1kg', multiplier: 1000 },
      { name: 'Silver Mini', lot: '5kg', multiplier: 5000 },
      { name: 'Silver Micro', lot: '1kg', multiplier: 1000 },
    ],
  },
  crudeoil: {
    name: 'Crude Oil (WTI)',
    symbol: 'WTI',
    icon: SVG_ICONS.crudeoil,
    category: 'energy',
    categoryLabel: 'Energy',
    accentColor: 'hsl(20, 80%, 45%)',
    accentBg: 'hsl(20, 80%, 45%)',
    yahooSymbol: 'CL=F',
    intlUnit: 'Barrel',
    indiaUnit: 'barrel',
    conversionDivisor: 1,
    dutyRate: 0.05,
    dutyLabel: 'Effective duty ~5%',
    showPurity: false,
    show10g: false,
  },
  brentcrude: {
    name: 'Brent Crude',
    symbol: 'BRENT',
    icon: SVG_ICONS.brentcrude,
    category: 'energy',
    categoryLabel: 'Energy',
    accentColor: 'hsl(30, 85%, 42%)',
    accentBg: 'hsl(30, 85%, 42%)',
    yahooSymbol: 'BZ=F',
    intlUnit: 'Barrel',
    indiaUnit: 'barrel',
    conversionDivisor: 1,
    dutyRate: 0.05,
    dutyLabel: 'Effective duty ~5%',
    showPurity: false,
    show10g: false,
  },
  naturalgas: {
    name: 'Natural Gas',
    symbol: 'NG',
    icon: SVG_ICONS.naturalgas,
    category: 'energy',
    categoryLabel: 'Energy',
    accentColor: 'hsl(200, 70%, 50%)',
    accentBg: 'hsl(200, 70%, 50%)',
    yahooSymbol: 'NG=F',
    intlUnit: 'MMBtu',
    indiaUnit: 'MMBtu',
    conversionDivisor: 1,
    dutyRate: 0.025,
    dutyLabel: 'BCD 2.5%',
    showPurity: false,
    show10g: false,
  },
  copper: {
    name: 'Copper',
    symbol: 'HG',
    icon: SVG_ICONS.copper,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(15, 75%, 50%)',
    accentBg: 'hsl(15, 75%, 50%)',
    yahooSymbol: 'HG=F',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    conversionMode: 'lbToKg',
    dutyRate: 0.025,
    dutyLabel: 'BCD 2.5%',
    showPurity: false,
    show10g: false,
  },
  aluminium: {
    name: 'Aluminium',
    symbol: 'ALI',
    icon: SVG_ICONS.aluminium,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(200, 15%, 55%)',
    accentBg: 'hsl(200, 15%, 55%)',
    yahooSymbol: 'ALI=F',
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.075,
    dutyLabel: 'BCD 7.5%',
    showPurity: false,
    show10g: false,
  },
  zinc: {
    name: 'Zinc',
    symbol: 'ZNC',
    icon: SVG_ICONS.zinc,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(180, 25%, 50%)',
    accentBg: 'hsl(180, 25%, 50%)',
    yahooSymbol: null,
    lmeOnly: true,
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.05,
    dutyLabel: 'BCD 5%',
    showPurity: false,
    show10g: false,
  },
  nickel: {
    name: 'Nickel',
    symbol: 'NI',
    icon: SVG_ICONS.nickel,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(150, 20%, 50%)',
    accentBg: 'hsl(150, 20%, 50%)',
    yahooSymbol: null,
    lmeOnly: true,
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.0,
    dutyLabel: 'Duty Free (0%)',
    showPurity: false,
    show10g: false,
  },
  lead: {
    name: 'Lead',
    symbol: 'PB',
    icon: SVG_ICONS.lead,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(220, 15%, 45%)',
    accentBg: 'hsl(220, 15%, 45%)',
    yahooSymbol: null,
    lmeOnly: true,
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.05,
    dutyLabel: 'BCD 5%',
    showPurity: false,
    show10g: false,
  },
  platinum: {
    name: 'Platinum',
    symbol: 'XPT/USD',
    icon: SVG_ICONS.platinum,
    category: 'precious',
    categoryLabel: 'Precious Metal',
    accentColor: 'hsl(200, 8%, 65%)',
    accentBg: 'hsl(200, 8%, 65%)',
    yahooSymbol: 'PL=F',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.1539,
    dutyLabel: 'BCD 12.5% + SWS',
    showPurity: false,
    show10g: true,
  },
};

// ── STATE ──
let state = {
  usdInr: null,
  usdInrChange: null,
  usdInrChangePct: null,
  prices: {},       // { gold: { price, change, changePct }, ... }
  lastUpdate: null,
  isLoading: true,
  errors: {},
  activeCategory: 'all',
};

// ── YAHOO FINANCE PROXY (multiple CORS proxies for reliability) ──
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
];

async function fetchWithProxy(url, timeout = 8000) {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy + encodeURIComponent(url);
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(timeout) });
      if (resp.ok) {
        const text = await resp.text();
        return JSON.parse(text);
      }
    } catch (e) {
      // Try next proxy
    }
  }
  return null;
}

async function fetchYahooQuote(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const data = await fetchWithProxy(url);
    if (!data) throw new Error('All proxies failed');
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('No data in response');
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = prevClose ? price - prevClose : 0;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    return { price, change, changePct };
  } catch (e) {
    console.warn(`Yahoo fetch failed for ${symbol}:`, e.message);
    return null;
  }
}

// Fetch with fallback symbols
async function fetchWithFallbacks(primarySymbol, fallbackSymbols = []) {
  const all = [primarySymbol, ...fallbackSymbols];
  for (const sym of all) {
    const result = await fetchYahooQuote(sym);
    if (result) return result;
  }
  return null;
}

// ── ALTERNATIVE: ExchangeRate API for USD/INR ──
async function fetchUsdInr() {
  // Try exchangerate-api first (no key needed for open endpoint)
  try {
    const resp = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(6000) });
    if (resp.ok) {
      const data = await resp.json();
      if (data?.rates?.INR) {
        return { rate: data.rates.INR, source: 'ExchangeRate API' };
      }
    }
  } catch (e) {
    console.warn('ExchangeRate API failed:', e.message);
  }

  // Fallback: Yahoo Finance USD/INR
  const yahoo = await fetchYahooQuote('USDINR=X');
  if (yahoo) {
    return { rate: yahoo.price, change: yahoo.change, changePct: yahoo.changePct, source: 'Yahoo Finance' };
  }

  return null;
}

// ── METALS-API FALLBACK (for LME metals not on Yahoo) ──
// Fetches from a free metals price API for Zinc, Nickel, Lead
const LME_METAL_SYMBOLS = {
  zinc: 'ZNC',
  nickel: 'NKL',
  lead: 'LED',
};

async function fetchLMEPrices() {
  // Try fetching from metals.live API (free, no key)
  try {
    const url = 'https://metals.live/api/v1/spot';
    const data = await fetchWithProxy(url, 6000);
    if (data && Array.isArray(data)) {
      const result = {};
      for (const item of data) {
        const name = (item.name || '').toLowerCase();
        if (name.includes('zinc')) {
          result.zinc = { price: item.price, change: 0, changePct: 0, isLME: true };
        } else if (name.includes('nickel')) {
          result.nickel = { price: item.price, change: 0, changePct: 0, isLME: true };
        } else if (name.includes('lead')) {
          result.lead = { price: item.price, change: 0, changePct: 0, isLME: true };
        }
      }
      if (Object.keys(result).length > 0) return result;
    }
  } catch (e) {
    console.warn('Metals.live API failed:', e.message);
  }

  // Fallback: use approximate market prices (updated periodically)
  return {
    zinc: { price: 2780, change: 0, changePct: 0, isApprox: true },
    nickel: { price: 15400, change: 0, changePct: 0, isApprox: true },
    lead: { price: 1960, change: 0, changePct: 0, isApprox: true },
  };
}

// ── FETCH ALL COMMODITY PRICES ──
async function fetchAllPrices() {
  // Separate LME-only and Yahoo-fetchable commodities
  const commodityKeys = Object.keys(COMMODITIES);
  const yahooKeys = commodityKeys.filter(k => !COMMODITIES[k].lmeOnly);
  const lmeKeys = commodityKeys.filter(k => COMMODITIES[k].lmeOnly);

  // Fetch USD/INR, Yahoo commodities, and LME metals concurrently
  const promises = [
    fetchUsdInr(),
    ...yahooKeys.map(async (key) => {
      const config = COMMODITIES[key];
      const data = await fetchWithFallbacks(config.yahooSymbol, config.yahooFallbacks || []);
      return [key, data];
    }),
    lmeKeys.length > 0 ? fetchLMEPrices() : Promise.resolve({}),
  ];

  const results = await Promise.allSettled(promises);

  // USD/INR
  const usdInrResult = results[0];
  if (usdInrResult.status === 'fulfilled' && usdInrResult.value) {
    state.usdInr = usdInrResult.value.rate;
    state.usdInrChange = usdInrResult.value.change || null;
    state.usdInrChangePct = usdInrResult.value.changePct || null;
  }

  // Yahoo commodities
  for (let i = 1; i <= yahooKeys.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled' && result.value) {
      const [key, data] = result.value;
      if (data) {
        state.prices[key] = data;
        delete state.errors[key];
      } else if (!state.prices[key]) {
        state.errors[key] = 'No data';
      }
    }
  }

  // LME metals
  const lmeResult = results[1 + yahooKeys.length];
  if (lmeResult && lmeResult.status === 'fulfilled' && lmeResult.value) {
    const lmeData = lmeResult.value;
    for (const key of lmeKeys) {
      if (lmeData[key]) {
        state.prices[key] = lmeData[key];
        delete state.errors[key];
      } else if (!state.prices[key]) {
        state.errors[key] = 'LME unavailable';
      }
    }
  }

  state.lastUpdate = new Date();
  state.isLoading = false;
}

// ── CALCULATION ENGINE ──
function calcIndiaLanded(commodityKey) {
  const config = COMMODITIES[commodityKey];
  const priceData = state.prices[commodityKey];
  if (!priceData || !state.usdInr) return null;

  const intlPrice = priceData.price;
  const usdInr = state.usdInr;
  let pricePerIndiaUnit;

  if (config.conversionMode === 'lbToKg') {
    pricePerIndiaUnit = (intlPrice / config.conversionDivisor) * usdInr * (1 + config.dutyRate);
  } else {
    pricePerIndiaUnit = (intlPrice / config.conversionDivisor) * usdInr * (1 + config.dutyRate);
  }

  const result = { perUnit: pricePerIndiaUnit };

  // For precious metals: purity variants
  if (config.showPurity) {
    if (config.purityLabels) {
      // Custom purity labels (e.g., Silver: 999/925/900)
      result.purities = config.purityLabels.map(p => ({
        label: p.label,
        perGram: pricePerIndiaUnit * p.ratio,
        per10g: pricePerIndiaUnit * p.ratio * 10,
        perKg: pricePerIndiaUnit * p.ratio * 1000,
      }));
      result.k24 = pricePerIndiaUnit; // primary for backward compat
    } else {
      // Default Gold karat system
      result.k24 = pricePerIndiaUnit;
      result.k22 = pricePerIndiaUnit * (22 / 24);
      result.k18 = pricePerIndiaUnit * (18 / 24);
    }
  }

  // 10g price
  if (config.show10g) {
    result.per10g = pricePerIndiaUnit * 10;
    if (config.showPurity && !config.purityLabels) {
      result.per10g_22k = result.k22 * 10;
      result.per10g_18k = result.k18 * 10;
    }
  }

  // Per-kg price (for Gold & Silver — standard Indian market quote)
  if (config.showKg) {
    result.perKg = pricePerIndiaUnit * 1000;
    if (config.showPurity && !config.purityLabels) {
      result.perKg_22k = result.k22 * 1000;
    }
  }

  // MCX Mini contract prices
  if (config.miniContracts) {
    result.minis = config.miniContracts.map(mc => ({
      name: mc.name,
      lot: mc.lot,
      price: pricePerIndiaUnit * mc.multiplier,
    }));
  }

  return result;
}

// ── FORMATTING ──
function fmtINR(val, decimals = 2) {
  if (val == null || isNaN(val)) return '—';
  return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUSD(val, decimals = 2) {
  if (val == null || isNaN(val)) return '—';
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtChange(change, changePct) {
  if (change == null) return { text: '—', cls: 'neutral' };
  const sign = change >= 0 ? '+' : '';
  const cls = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  const text = `${sign}${change.toFixed(2)} · ${sign}${changePct.toFixed(2)}%`;
  return { text, cls };
}

function fmtTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

// ── CATEGORY BADGE STYLE ──
function getCategoryStyle(category, label) {
  switch (category) {
    case 'precious':
      return 'background:hsl(45 93% 47% / 0.1);color:hsl(45,80%,40%);border:1px solid hsl(45 93% 47% / 0.2)';
    case 'industrial':
      return 'background:hsl(200 50% 50% / 0.1);color:hsl(200,50%,40%);border:1px solid hsl(200 50% 50% / 0.2)';
    case 'energy':
      if (label === 'Agri Commodity') {
        return 'background:hsl(100 50% 40% / 0.1);color:hsl(100,50%,35%);border:1px solid hsl(100 50% 40% / 0.2)';
      }
      return 'background:hsl(0 60% 50% / 0.1);color:hsl(0,60%,45%);border:1px solid hsl(0 60% 50% / 0.2)';
    default:
      return 'background:var(--l3);color:var(--t3);border:1px solid var(--sep2)';
  }
}

// ── BUILD COMMODITY CARD HTML ──
function buildCommodityCard(key) {
  const config = COMMODITIES[key];
  const priceData = state.prices[key];
  const landed = calcIndiaLanded(key);
  const hasData = priceData && state.usdInr;
  const isApprox = priceData?.isApprox || false;
  const isLME = priceData?.isLME || false;
  const change = hasData ? fmtChange(priceData.change, priceData.changePct) : fmtChange(null);

  // International price display
  const intlPriceStr = hasData ? fmtUSD(priceData.price) : '—';
  const intlUnit = `/ ${config.intlUnit.toLowerCase()}`;
  const approxBadge = isApprox ? ' <span style="font-size:9px;color:var(--orange);font-family:var(--font-body);font-weight:600;vertical-align:super">~APPROX</span>' : (isLME ? ' <span style="font-size:9px;color:var(--teal);font-family:var(--font-body);font-weight:600;vertical-align:super">LME</span>' : '');

  // India landed price rows
  let landedRows = '';
  if (hasData && landed) {
    if (config.showPurity) {
      if (config.purityLabels && landed.purities) {
        for (const p of landed.purities) {
          landedRows += `
            <div class="price-row">
              <span class="price-label">${p.label} per gram</span>
              <span class="price-value ${p.ratio === 1 ? 'highlight' : ''}">${fmtINR(p.perGram)}/g</span>
            </div>`;
        }
        if (config.showKg) {
          landedRows += `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--sep2)">`;
          for (const p of landed.purities) {
            landedRows += `
              <div class="price-row ${p.ratio === 1 ? 'ten-gram-row' : ''}" style="${p.ratio !== 1 ? 'padding-left:10px' : ''}">
                <span class="price-label" style="${p.ratio === 1 ? 'font-weight:700' : ''}">Per kg · ${p.label}</span>
                <span class="price-value" style="${p.ratio === 1 ? 'font-weight:800' : ''}">${fmtINR(p.perKg, 0)}/kg</span>
              </div>`;
          }
          landedRows += `</div>`;
        }
      } else {
        landedRows += `
          <div class="price-row">
            <span class="price-label">24K per gram</span>
            <span class="price-value highlight">${fmtINR(landed.k24)}/g</span>
          </div>
          <div class="price-row">
            <span class="price-label">22K per gram</span>
            <span class="price-value">${fmtINR(landed.k22)}/g</span>
          </div>
          <div class="price-row">
            <span class="price-label">18K per gram</span>
            <span class="price-value">${fmtINR(landed.k18)}/g</span>
          </div>`;

        if (config.show10g) {
          landedRows += `
            <div class="price-row ten-gram-row">
              <span class="price-label">10g · 24K</span>
              <span class="price-value">${fmtINR(landed.per10g, 0)}</span>
            </div>
            <div class="price-row ten-gram-row" style="margin-top:4px;background:linear-gradient(135deg, hsl(210 10% 62% / 0.06), hsl(215 18% 52% / 0.06));border-color:hsl(210 10% 62% / 0.12)">
              <span class="price-label" style="color:var(--t3)">10g · 22K</span>
              <span class="price-value" style="color:var(--t2);font-size:14px">${fmtINR(landed.per10g_22k, 0)}</span>
            </div>`;
        }

        // Per-KG pricing (standard Indian market)
        if (config.showKg && landed.perKg) {
          landedRows += `
            <div class="price-row" style="margin-top:6px;padding-top:8px;border-top:1px dashed var(--sep2)">
              <span class="price-label" style="font-weight:700">Per kg · 24K</span>
              <span class="price-value" style="font-weight:800">${fmtINR(landed.perKg, 0)}/kg</span>
            </div>`;
          if (landed.perKg_22k) {
            landedRows += `
              <div class="price-row">
                <span class="price-label">Per kg · 22K</span>
                <span class="price-value">${fmtINR(landed.perKg_22k, 0)}/kg</span>
              </div>`;
          }
        }
      }
    } else {
      landedRows += `
        <div class="price-row">
          <span class="price-label">Per ${config.indiaUnit}</span>
          <span class="price-value highlight">${fmtINR(landed.perUnit)}/${config.indiaUnit}</span>
        </div>`;
    }

    // Standard Indian Contract Equivalents
    if (landed.minis && landed.minis.length > 0) {
      landedRows += `
        <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--sep2)">
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;color:var(--t4);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px">Retail Contract Equivalents</div>`;
      for (const mc of landed.minis) {
        landedRows += `
          <div class="price-row" style="padding:3px 0">
            <span class="price-label" style="font-size:11px">${mc.name} <span style="color:var(--t4);font-size:9px">(${mc.lot})</span></span>
            <span class="price-value" style="font-size:13px;color:var(--primary)">${fmtINR(mc.price, 0)}</span>
          </div>`;
      }
      landedRows += `</div>`;
    }
  } else {
    landedRows = `
      <div class="price-row">
        <span class="price-label">Loading...</span>
        <span class="price-value"><div class="skeleton skeleton-text"></div></span>
      </div>`;
  }

  return `
    <div class="commodity-card" data-commodity="${key}" data-category="${config.category}" style="--commodity-accent:${config.accentColor}">
      <div class="commodity-card-inner">
        <div class="commodity-header">
          <div style="display:flex;align-items:center">
            <div class="commodity-icon" style="background:linear-gradient(135deg, ${config.accentBg}, ${config.accentColor})">${config.icon}</div>
            <div class="commodity-info">
              <div class="commodity-name">${config.name}</div>
              <div class="commodity-symbol">${config.symbol}</div>
            </div>
          </div>
          <span class="commodity-category-badge" style="${getCategoryStyle(config.category, config.categoryLabel)}">${config.categoryLabel}</span>
        </div>

        <!-- International Price -->
        <div class="intl-price-row">
          <div>
            <div class="intl-price" id="intl-${key}">${intlPriceStr}${approxBadge}</div>
            <div class="intl-unit">${intlUnit}</div>
          </div>
          <div class="intl-change">
            <span class="change-pill ${change.cls}" id="change-${key}">${change.text}</span>
          </div>
        </div>

        <!-- India Import Landed -->
        <div class="india-landed">
          <div class="india-landed-header">
            <span class="india-landed-title">₹ / ${config.indiaUnit} · India Import Landed 
              <a href="docs.html#meth-${config.category}" class="methodology-badge" title="View Calculation Methodology">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Engine Method
              </a>
            </span>
            <span class="india-duty-badge">${config.dutyLabel}</span>
          </div>
          <div id="landed-${key}">
            ${landedRows}
          </div>
        </div>
      </div>

      <div class="data-source">
        <span>Source: ${isLME ? 'Metals.live (LME)' : isApprox ? 'LME Approx' : 'Yahoo Finance (' + (config.yahooSymbol || 'N/A') + ')'}</span>
        ${(config.yahooSymbol || config.lmeOnly) ? `<button class="chart-btn" onclick="event.stopPropagation();openChart('${key}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Chart</button>` : ''}
        <span id="tick-${key}">${state.lastUpdate ? fmtTime(state.lastUpdate) : '—'}</span>
      </div>
    </div>`;
}

// ── RENDER ALL CARDS ──
function renderAllCards() {
  const grid = document.getElementById('commodity-grid');
  const keys = Object.keys(COMMODITIES).filter(key => {
    if (state.activeCategory === 'all') return true;
    return COMMODITIES[key].category === state.activeCategory;
  });

  grid.innerHTML = keys.map(key => buildCommodityCard(key)).join('');
}

// ── UPDATE EXISTING CARDS (efficient partial update) ──
function updateCards() {
  // Last tick
  const tickEl = document.getElementById('last-tick');
  if (tickEl && state.lastUpdate) {
    tickEl.textContent = fmtTime(state.lastUpdate);
  }

  // Update each commodity card
  Object.keys(COMMODITIES).forEach(key => {
    const config = COMMODITIES[key];
    const priceData = state.prices[key];
    const landed = calcIndiaLanded(key);

    // International price
    const intlEl = document.getElementById(`intl-${key}`);
    if (intlEl && priceData) {
      const newPrice = fmtUSD(priceData.price);
      if (intlEl.textContent !== newPrice) {
        intlEl.textContent = newPrice;
        intlEl.classList.add('price-flash');
        setTimeout(() => intlEl.classList.remove('price-flash'), 1000);
      }
    }

    // Change pill
    const changeEl = document.getElementById(`change-${key}`);
    if (changeEl && priceData) {
      const c = fmtChange(priceData.change, priceData.changePct);
      changeEl.textContent = c.text;
      changeEl.className = `change-pill ${c.cls}`;
    }

    // India landed prices
    const landedEl = document.getElementById(`landed-${key}`);
    if (landedEl && landed && priceData) {
      let html = '';
      if (config.showPurity) {
        if (config.purityLabels && landed.purities) {
          for (const p of landed.purities) {
            html += `
              <div class="price-row">
                <span class="price-label">${p.label} per gram</span>
                <span class="price-value ${p.ratio === 1 ? 'highlight' : ''}">${fmtINR(p.perGram)}/g</span>
              </div>`;
          }
          if (config.showKg) {
            html += `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--sep2)">`;
            for (const p of landed.purities) {
              html += `
                <div class="price-row ${p.ratio === 1 ? 'ten-gram-row' : ''}" style="${p.ratio !== 1 ? 'padding-left:10px' : ''}">
                  <span class="price-label" style="${p.ratio === 1 ? 'font-weight:700' : ''}">Per kg · ${p.label}</span>
                  <span class="price-value" style="${p.ratio === 1 ? 'font-weight:800' : ''}">${fmtINR(p.perKg, 0)}/kg</span>
                </div>`;
            }
            html += `</div>`;
          }
        } else {
          html += `
            <div class="price-row">
              <span class="price-label">24K per gram</span>
              <span class="price-value highlight">${fmtINR(landed.k24)}/g</span>
            </div>
            <div class="price-row">
              <span class="price-label">22K per gram</span>
              <span class="price-value">${fmtINR(landed.k22)}/g</span>
            </div>
            <div class="price-row">
              <span class="price-label">18K per gram</span>
              <span class="price-value">${fmtINR(landed.k18)}/g</span>
            </div>`;
          if (config.show10g) {
            html += `
              <div class="price-row ten-gram-row">
                <span class="price-label">10g · 24K</span>
                <span class="price-value">${fmtINR(landed.per10g, 0)}</span>
              </div>
              <div class="price-row ten-gram-row" style="margin-top:4px;background:linear-gradient(135deg, hsl(210 10% 62% / 0.06), hsl(215 18% 52% / 0.06));border-color:hsl(210 10% 62% / 0.12)">
                <span class="price-label" style="color:var(--t3)">10g · 22K</span>
                <span class="price-value" style="color:var(--t2);font-size:14px">${fmtINR(landed.per10g_22k, 0)}</span>
              </div>`;
          }
          // Per-KG pricing
          if (config.showKg && landed.perKg) {
            html += `
              <div class="price-row" style="margin-top:6px;padding-top:8px;border-top:1px dashed var(--sep2)">
                <span class="price-label" style="font-weight:700">Per kg · 24K</span>
                <span class="price-value" style="font-weight:800">${fmtINR(landed.perKg, 0)}/kg</span>
              </div>`;
            if (landed.perKg_22k) {
              html += `
                <div class="price-row">
                  <span class="price-label">Per kg · 22K</span>
                  <span class="price-value">${fmtINR(landed.perKg_22k, 0)}/kg</span>
                </div>`;
            }
          }
        }
      } else {
        html += `
          <div class="price-row">
            <span class="price-label">Per ${config.indiaUnit}</span>
            <span class="price-value highlight">${fmtINR(landed.perUnit)}/${config.indiaUnit}</span>
          </div>`;
      }
      // Standard Indian Contract Equivalents
      if (landed.minis && landed.minis.length > 0) {
        html += `
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--sep2)">
            <div style="font-family:var(--font-body);font-size:9px;font-weight:700;color:var(--t4);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px">Retail Contract Equivalents</div>`;
        for (const mc of landed.minis) {
          html += `
            <div class="price-row" style="padding:3px 0">
              <span class="price-label" style="font-size:11px">${mc.name} <span style="color:var(--t4);font-size:9px">(${mc.lot})</span></span>
              <span class="price-value" style="font-size:13px;color:var(--primary)">${fmtINR(mc.price, 0)}</span>
            </div>`;
        }
        html += `</div>`;
      }
      landedEl.innerHTML = html;
    }

    // Tick time
    const tickTimeEl = document.getElementById(`tick-${key}`);
    if (tickTimeEl && state.lastUpdate) {
      tickTimeEl.textContent = fmtTime(state.lastUpdate);
    }
  });

  // Status pill
  updateStatus();
}

// ── STATUS ──
function updateStatus() {
  const pill = document.getElementById('status-pill');
  const text = document.getElementById('status-text');
  if (!pill || !text) return;

  const hasAnyData = Object.keys(state.prices).length > 0;
  const errCount = Object.keys(state.errors).length;

  if (hasAnyData && errCount === 0) {
    pill.className = 'status-pill';
    text.textContent = 'LIVE';
  } else if (hasAnyData) {
    pill.className = 'status-pill err';
    text.textContent = `PARTIAL (${errCount} ERR)`;
  } else if (state.isLoading) {
    pill.className = 'status-pill err';
    text.textContent = 'LOADING';
  } else {
    pill.className = 'status-pill err';
    text.textContent = 'OFFLINE';
  }
}

// ── CATEGORY FILTER ──
function filterCategory(cat) {
  state.activeCategory = cat;

  // Update tab active state
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.cat === cat);
  });

  renderAllCards();
}

// Make available globally
window.filterCategory = filterCategory;

// ── THEME TOGGLE ──
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('commodity-theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme) {
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon) icon.innerHTML = theme === 'dark' ? SVG_ICONS.sun : SVG_ICONS.moon;
  if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

window.toggleTheme = toggleTheme;

// ── FORCE REFRESH ──
const refreshSvg = `<span style="display:inline-flex;width:14px;height:14px">${SVG_ICONS.refresh}</span>`;
async function forceRefresh() {
  const btn = document.getElementById('refresh-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `${refreshSvg} Loading...`;
  }
  await fetchAllPrices();
  updateCards();
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `${refreshSvg} Refresh`;
  }
}

window.forceRefresh = forceRefresh;

// ── INITIALIZE ──
async function init() {
  // Load theme preference
  const savedTheme = localStorage.getItem('commodity-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  // Parse URL for categories (Deep Linking from Docs)
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && ['precious', 'industrial', 'energy', 'all'].includes(cat)) {
    filterCategory(cat);
  } else {
    // Initial render with loading state
    renderAllCards();
  }

  // Fetch data
  await fetchAllPrices();
  renderAllCards();
  updateCards();

  // Auto-poll every 5 seconds
  setInterval(async () => {
    await fetchAllPrices();
    updateCards();
  }, 5000);
}

// Start!
document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════════════
//  TRADINGVIEW LIGHTWEIGHT CHARTS — COMEX HISTORICAL
// ═══════════════════════════════════════════════════════════════════════

let chartInstance = null;
let chartSeries = null;
let currentChartKey = null;
let currentRange = '1y';

function getChartSymbol(key) {
  const config = COMMODITIES[key];
  if (config?.yahooSymbol) return config.yahooSymbol;
  // LME-only metals fallback — use closest Yahoo equivalent
  const lmeFallback = { zinc: 'ZN=F', nickel: 'NI=F', lead: 'PB=F' };
  return lmeFallback[key] || null;
}

async function fetchHistoricalData(symbol, range) {
  const interval = ['1mo', '3mo', '6mo'].includes(range) ? '1d' : (['1y', '2y'].includes(range) ? '1d' : '1wk');
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;

  const proxies = [
    u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];

  for (const proxy of proxies) {
    try {
      const resp = await fetch(proxy(url));
      const data = await resp.json();
      const result = data?.chart?.result?.[0];
      if (!result) continue;

      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];
      const ohlcData = [];

      for (let i = 0; i < timestamps.length; i++) {
        if (quote.open[i] == null || quote.close[i] == null) continue;
        ohlcData.push({
          time: timestamps[i],
          open: +quote.open[i].toFixed(2),
          high: +quote.high[i].toFixed(2),
          low: +quote.low[i].toFixed(2),
          close: +quote.close[i].toFixed(2),
        });
      }

      return ohlcData;
    } catch (e) { /* try next proxy */ }
  }
  return null;
}

function getChartThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? {
    bg: '#0a0f1c',
    text: '#8a9ab5',
    grid: 'rgba(40,48,64,0.3)',
    border: 'rgba(40,48,64,0.5)',
    upColor: '#30b86a',
    downColor: '#d94848',
    wickUp: '#30b86a',
    wickDown: '#d94848',
    crosshairColor: 'rgba(232,128,64,0.4)',
  } : {
    bg: '#ffffff',
    text: '#6b6158',
    grid: 'rgba(226,223,219,0.5)',
    border: 'rgba(226,223,219,0.8)',
    upColor: '#25a05a',
    downColor: '#d93636',
    wickUp: '#25a05a',
    wickDown: '#d93636',
    crosshairColor: 'rgba(240,112,32,0.4)',
  };
}

async function openChart(key) {
  currentChartKey = key;
  currentRange = '1y';
  const config = COMMODITIES[key];

  // Update modal title
  document.getElementById('chart-title').textContent = `${config.name} — COMEX Historical`;
  document.getElementById('chart-sub').textContent = `${config.yahooSymbol || key.toUpperCase()} · COMEX Futures`;

  // Reset timeframe buttons
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tf-btn[data-range="1y"]').classList.add('active');

  // Show modal
  document.getElementById('chart-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  await renderChart(key, '1y');
}
window.openChart = openChart;

async function renderChart(key, range) {
  const container = document.getElementById('chart-container');
  container.innerHTML = '<div class="chart-loading">Loading chart data...</div>';

  // Destroy previous chart
  if (chartInstance) {
    chartInstance.remove();
    chartInstance = null;
  }

  const symbol = getChartSymbol(key);
  if (!symbol) {
    container.innerHTML = '<div class="chart-loading">Chart not available for LME-only metals</div>';
    return;
  }

  const data = await fetchHistoricalData(symbol, range);
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="chart-loading">Unable to load chart data</div>';
    return;
  }

  container.innerHTML = '';
  const colors = getChartThemeColors();

  chartInstance = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: container.clientHeight,
    layout: {
      background: { type: 'solid', color: colors.bg },
      textColor: colors.text,
      fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
      fontSize: 12,
    },
    grid: {
      vertLines: { color: colors.grid },
      horzLines: { color: colors.grid },
    },
    crosshair: {
      mode: 0,
      vertLine: { color: colors.crosshairColor, width: 1, style: 2 },
      horzLine: { color: colors.crosshairColor, width: 1, style: 2 },
    },
    rightPriceScale: {
      borderColor: colors.border,
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    timeScale: {
      borderColor: colors.border,
      timeVisible: false,
    },
    handleScroll: true,
    handleScale: true,
  });

  chartSeries = chartInstance.addCandlestickSeries({
    upColor: colors.upColor,
    downColor: colors.downColor,
    borderDownColor: colors.downColor,
    borderUpColor: colors.upColor,
    wickDownColor: colors.wickDown,
    wickUpColor: colors.wickUp,
  });

  chartSeries.setData(data);
  chartInstance.timeScale().fitContent();

  // Data range label
  const first = new Date(data[0].time * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  const last = new Date(data[data.length-1].time * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  const rangeLabel = document.getElementById('chart-data-range');
  if (rangeLabel) rangeLabel.textContent = `${first} — ${last} · ${data.length} candles`;

  // Resize handler
  const resizeObserver = new ResizeObserver(entries => {
    if (chartInstance) {
      chartInstance.applyOptions({ width: container.clientWidth, height: container.clientHeight });
    }
  });
  resizeObserver.observe(container);
}

async function changeRange(range) {
  currentRange = range;
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.tf-btn[data-range="${range}"]`).classList.add('active');
  if (currentChartKey) await renderChart(currentChartKey, range);
}
window.changeRange = changeRange;

function closeChart() {
  document.getElementById('chart-modal').style.display = 'none';
  document.body.style.overflow = '';
  if (chartInstance) {
    chartInstance.remove();
    chartInstance = null;
  }
}
window.closeChart = closeChart;

// ESC key to close chart
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeChart();
});
