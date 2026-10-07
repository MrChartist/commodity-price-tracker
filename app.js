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
  palladium: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect x="8" y="8" width="8" height="8" rx="1.5"/></svg>`,
  wheat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V8"/><path d="M12 8c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 8c3 0 5-2 5-5-3 0-5 2-5 5z"/><path d="M12 15c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 15c3 0 5-2 5-5-3 0-5 2-5 5z"/></svg>`,
  corn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 0 5 4 5 10s-2 10-5 10-5-4-5-10 2-10 5-10z"/><path d="M12 2v20"/><path d="M7.5 8h9"/><path d="M7 12h10"/><path d="M7.5 16h9"/></svg>`,
  soybean: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="17" cy="7" r="3"/></svg>`,
  soyoil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7s6.5 7.3 6.5 12a6.5 6.5 0 0 1-13 0c0-4.7 6.5-12 6.5-12z"/></svg>`,
  sugar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/><rect x="8.5" y="4" width="7" height="7" rx="1"/></svg>`,
  cotton: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 1 0-1.1-8.9 6 6 0 1 0-11.4 2A3.5 3.5 0 0 0 6.5 19h11z"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  cocoa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 7 5 12s3 10 7 10 7-5 7-10S16 2 12 2z"/><path d="M12 2v20"/></svg>`,
  tin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1 4H8z"/><path d="M6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><path d="M9 12h6"/></svg>`,
  steel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l4-3h12l4 3"/><path d="M2 7v4h20V7"/><path d="M2 11l4 9h12l4-9"/><path d="M9 11v9M15 11v9"/></svg>`,
  ironore: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 5-2.5 9h-9L5 8z"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  lithium: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="14" height="10" rx="2"/><path d="M18 10h2v4h-2"/><path d="M8 10v4M11 12h-2M14 10v4"/></svg>`,
  cobalt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
  rice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-2 3-2 6 0 9 2-3 2-6 0-9z"/><path d="M7 7c-1 3 0 6 3 8-1-3-1-6-3-8z"/><path d="M17 7c1 3 0 6-3 8 1-3 1-6 3-8z"/><path d="M5 21h14"/></svg>`,
  lumber: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="6" rx="1"/><circle cx="6" cy="12" r="1.5"/><path d="M3 9l3-4h14l-3 4"/></svg>`,
  citrus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>`,
  droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7s6.5 7.3 6.5 12a6.5 6.5 0 0 1-13 0c0-4.7 6.5-12 6.5-12z"/></svg>`,
  livestock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8c0-1 1-2 2-2s2 1 2 3M20 8c0-1-1-2-2-2s-2 1-2 3"/><path d="M5 9c-1 0-2 1-2 3M19 9c1 0 2 1 2 3"/><path d="M7 9h10v4a5 5 0 0 1-10 0z"/><path d="M10 17v3M14 17v3"/></svg>`,
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
    exchange: 'COMEX',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.15,
    dutyLabel: 'BCD 10% + AIDC 5% = 15%',
    showPurity: true,
    show10g: true,
    showKg: true,
    miniContracts: [
      { name: 'Gold Mini', lot: '100g', multiplier: 100 },
      { name: 'Gold Guinea', lot: '8g', multiplier: 8 },
      { name: 'Gold Petal', lot: '1g', multiplier: 1 },
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
    exchange: 'COMEX',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.15,
    dutyLabel: 'BCD 10% + AIDC 5% = 15%',
    showPurity: true,
    show10g: true,
    showKg: true,
    purityLabels: [
      { label: '999 Fine', ratio: 1.0 },
      { label: '925 Sterling', ratio: 0.925 },
      { label: '900 Coin', ratio: 0.90 },
    ],
    miniContracts: [
      { name: 'Silver (30 kg)', lot: '30kg', multiplier: 30000 },
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
    exchange: 'NYMEX',
    intlUnit: 'Barrel',
    indiaUnit: 'barrel',
    conversionDivisor: 1,
    dutyRate: 0.0,
    dutyLabel: 'BCD Re 1/tonne ≈ 0%',
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
    exchange: 'ICE',
    intlUnit: 'Barrel',
    indiaUnit: 'barrel',
    conversionDivisor: 1,
    dutyRate: 0.0,
    dutyLabel: 'BCD Re 1/tonne ≈ 0%',
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
    exchange: 'NYMEX',
    intlUnit: 'MMBtu',
    indiaUnit: 'MMBtu',
    conversionDivisor: 1,
    dutyRate: 0.0275,
    dutyLabel: 'BCD 2.5% + SWS = 2.75%',
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
    exchange: 'COMEX',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 0.055,
    dutyLabel: 'BCD 5% + SWS = 5.5%',
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
    exchange: 'CME',
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.0825,
    dutyLabel: 'BCD 7.5% + SWS = 8.25%',
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
    indicative: true,
    indicativePrice: 3500, // USD/tonne — LME 3M, manually updated
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.055,
    dutyLabel: 'BCD 5% + SWS = 5.5%',
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
    indicative: true,
    indicativePrice: 17900, // USD/tonne — LME 3M, manually updated
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
    indicative: true,
    indicativePrice: 1975, // USD/tonne — LME 3M, manually updated
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.055,
    dutyLabel: 'BCD 5% + SWS = 5.5%',
    showPurity: false,
    show10g: false,
  },
  tin: {
    name: 'Tin',
    symbol: 'SN',
    icon: SVG_ICONS.tin,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(210, 12%, 58%)',
    accentBg: 'hsl(210, 12%, 58%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 45000, // USD/tonne — LME 3M (volatile/elevated in 2026)
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.0,
    dutyLabel: 'BCD Free (critical mineral) = 0%',
    showPurity: false,
    show10g: false,
  },
  steel: {
    name: 'Steel (HRC)',
    symbol: 'HRC',
    icon: SVG_ICONS.steel,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(215, 14%, 48%)',
    accentBg: 'hsl(215, 14%, 48%)',
    yahooSymbol: 'HRC=F',
    exchange: 'CME',
    intlUnit: 'Short Ton',
    indiaUnit: 'tonne',
    // HRC=F quotes USD per US short ton (907.185 kg); 1 short ton = 0.907185 t
    conversionDivisor: 0.907185,
    dutyRate: 0.1975,
    dutyLabel: 'BCD 7.5% + SWS + safeguard ≈ 19.75%',
    note: 'HRC=F is US Midwest domestic hot-rolled coil — trades well above global/India ex-mill levels.',
    secondaryUnit: { label: 'kg', multiplier: 0.001 },
    showPurity: false,
    show10g: false,
  },
  ironore: {
    name: 'Iron Ore',
    symbol: 'IORE',
    icon: SVG_ICONS.ironore,
    category: 'industrial',
    categoryLabel: 'Industrial Metal',
    accentColor: 'hsl(18, 55%, 42%)',
    accentBg: 'hsl(18, 55%, 42%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 100, // USD/dry metric tonne — 62% Fe CFR China
    intlUnit: 'Dry Metric Ton',
    indiaUnit: 'tonne',
    conversionDivisor: 1,
    dutyRate: 0.0275,
    dutyLabel: 'BCD 2.5% + SWS = 2.75%',
    secondaryUnit: { label: 'kg', multiplier: 0.001 },
    showPurity: false,
    show10g: false,
  },
  lithium: {
    name: 'Lithium (Carbonate)',
    symbol: 'Li2CO3',
    icon: SVG_ICONS.lithium,
    category: 'industrial',
    categoryLabel: 'Battery Metal',
    accentColor: 'hsl(150, 45%, 45%)',
    accentBg: 'hsl(150, 45%, 45%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 20000, // USD/tonne — battery-grade Li2CO3 (rebounded in 2026)
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.0,
    dutyLabel: 'BCD Free (critical mineral) = 0%',
    showPurity: false,
    show10g: false,
  },
  cobalt: {
    name: 'Cobalt',
    symbol: 'CO',
    icon: SVG_ICONS.cobalt,
    category: 'industrial',
    categoryLabel: 'Battery Metal',
    accentColor: 'hsl(220, 55%, 55%)',
    accentBg: 'hsl(220, 55%, 55%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 55000, // USD/tonne — standard-grade (≈ $25/lb)
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.0,
    dutyLabel: 'BCD Free (critical mineral) = 0%',
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
    exchange: 'NYMEX',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.154,
    dutyLabel: 'BCD 10% + AIDC 5.4% = 15.4%',
    showPurity: false,
    show10g: true,
  },
  palladium: {
    name: 'Palladium',
    symbol: 'XPD/USD',
    icon: SVG_ICONS.palladium,
    category: 'precious',
    categoryLabel: 'Precious Metal',
    accentColor: 'hsl(220, 12%, 60%)',
    accentBg: 'hsl(220, 12%, 60%)',
    yahooSymbol: 'PA=F',
    exchange: 'NYMEX',
    intlUnit: 'Troy Oz',
    indiaUnit: 'g',
    conversionDivisor: 31.1035,
    dutyRate: 0.154,
    dutyLabel: 'HS 7110 ~15.4%',
    showPurity: false,
    show10g: true,
  },
  wheat: {
    name: 'Wheat',
    symbol: 'ZW',
    icon: SVG_ICONS.wheat,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(42, 75%, 45%)',
    accentBg: 'hsl(42, 75%, 45%)',
    yahooSymbol: 'ZW=F',
    exchange: 'CBOT',
    intlUnit: 'Bushel',
    indiaUnit: 'quintal',
    conversionDivisor: 0.272155, // 1 bushel (60 lb) = 0.272155 quintal
    dutyRate: 0.44,
    dutyLabel: 'BCD 40% + SWS = 44%',
    secondaryUnit: { label: 'kg', multiplier: 0.01 },
    showPurity: false,
    show10g: false,
  },
  corn: {
    name: 'Corn (Maize)',
    symbol: 'ZC',
    icon: SVG_ICONS.corn,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(50, 85%, 45%)',
    accentBg: 'hsl(50, 85%, 45%)',
    yahooSymbol: 'ZC=F',
    exchange: 'CBOT',
    intlUnit: 'Bushel',
    indiaUnit: 'quintal',
    conversionDivisor: 0.254012, // 1 bushel (56 lb) = 0.254012 quintal
    dutyRate: 0.50,
    dutyLabel: 'BCD 50% (TRQ 15%)',
    secondaryUnit: { label: 'kg', multiplier: 0.01 },
    showPurity: false,
    show10g: false,
  },
  soybean: {
    name: 'Soybean',
    symbol: 'ZS',
    icon: SVG_ICONS.soybean,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(80, 45%, 42%)',
    accentBg: 'hsl(80, 45%, 42%)',
    yahooSymbol: 'ZS=F',
    exchange: 'CBOT',
    intlUnit: 'Bushel',
    indiaUnit: 'quintal',
    conversionDivisor: 0.272155, // 1 bushel (60 lb) = 0.272155 quintal
    dutyRate: 0.30,
    dutyLabel: 'BCD ~30% (indicative)',
    secondaryUnit: { label: 'kg', multiplier: 0.01 },
    showPurity: false,
    show10g: false,
  },
  soybeanoil: {
    name: 'Soybean Oil',
    symbol: 'ZL',
    icon: SVG_ICONS.soyoil,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(60, 60%, 40%)',
    accentBg: 'hsl(60, 60%, 40%)',
    yahooSymbol: 'ZL=F',
    exchange: 'CBOT',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 0.165,
    dutyLabel: 'BCD 10% + AIDC 5% + SWS = 16.5%',
    secondaryUnit: { label: '10 kg', multiplier: 10 },
    showPurity: false,
    show10g: false,
  },
  sugar: {
    name: 'Sugar',
    symbol: 'SB',
    icon: SVG_ICONS.sugar,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(330, 35%, 60%)',
    accentBg: 'hsl(330, 35%, 60%)',
    yahooSymbol: 'SB=F',
    exchange: 'ICE',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 1.00,
    dutyLabel: 'BCD 100%',
    secondaryUnit: { label: 'quintal', multiplier: 100 },
    showPurity: false,
    show10g: false,
  },
  cotton: {
    name: 'Cotton',
    symbol: 'CT',
    icon: SVG_ICONS.cotton,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(200, 20%, 70%)',
    accentBg: 'hsl(200, 20%, 70%)',
    yahooSymbol: 'CT=F',
    exchange: 'ICE',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    // Cotton import duty is exempted Jun 1 – Oct 31, 2026, then reverts to 11%
    dutySchedule: [
      { until: '2026-10-31', rate: 0.0, label: 'Duty-free till Oct 31, 2026' },
      { until: null, rate: 0.11, label: 'BCD 5% + AIDC 5% + SWS = 11%' },
    ],
    dutyRate: 0.0,
    dutyLabel: 'Duty-free till Oct 31, 2026',
    secondaryUnit: { label: 'candy (356 kg)', multiplier: 356 },
    showPurity: false,
    show10g: false,
  },
  coffee: {
    name: 'Coffee',
    symbol: 'KC',
    icon: SVG_ICONS.coffee,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(25, 50%, 35%)',
    accentBg: 'hsl(25, 50%, 35%)',
    yahooSymbol: 'KC=F',
    exchange: 'ICE',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 1.00,
    dutyLabel: 'BCD 100%',
    showPurity: false,
    show10g: false,
  },
  cocoa: {
    name: 'Cocoa',
    symbol: 'CC',
    icon: SVG_ICONS.cocoa,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(18, 45%, 38%)',
    accentBg: 'hsl(18, 45%, 38%)',
    yahooSymbol: 'CC=F',
    exchange: 'ICE',
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.33,
    dutyLabel: 'BCD 30% + SWS = 33%',
    showPurity: false,
    show10g: false,
  },
  rice: {
    name: 'Rice (Rough)',
    symbol: 'ZR',
    icon: SVG_ICONS.rice,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(45, 30%, 70%)',
    accentBg: 'hsl(45, 30%, 70%)',
    yahooSymbol: 'ZR=F',
    exchange: 'CBOT',
    intlUnit: 'Cwt',
    indiaUnit: 'quintal',
    // ZR=F quotes USD per cwt (100 lb = 45.3592 kg); 1 quintal (100 kg) = 2.2046 cwt
    conversionDivisor: 0.453592,
    dutyRate: 0.70,
    dutyLabel: 'BCD 70% (non-basmati)',
    secondaryUnit: { label: 'kg', multiplier: 0.01 },
    showPurity: false,
    show10g: false,
  },
  soybeanmeal: {
    name: 'Soybean Meal',
    symbol: 'ZM',
    icon: SVG_ICONS.soybean,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(35, 40%, 45%)',
    accentBg: 'hsl(35, 40%, 45%)',
    yahooSymbol: 'ZM=F',
    exchange: 'CBOT',
    intlUnit: 'Short Ton',
    indiaUnit: 'quintal',
    // ZM=F quotes USD per US short ton (907.185 kg); 1 quintal = 0.0907185 short ton
    conversionDivisor: 9.07185,
    dutyRate: 0.165,
    dutyLabel: 'BCD 15% + SWS = 16.5%',
    secondaryUnit: { label: 'kg', multiplier: 0.01 },
    showPurity: false,
    show10g: false,
  },
  orangejuice: {
    name: 'Orange Juice',
    symbol: 'OJ',
    icon: SVG_ICONS.citrus,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(28, 90%, 52%)',
    accentBg: 'hsl(28, 90%, 52%)',
    yahooSymbol: 'OJ=F',
    exchange: 'ICE',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 0.33,
    dutyLabel: 'BCD 30% + SWS = 33%',
    showPurity: false,
    show10g: false,
  },
  lumber: {
    name: 'Lumber',
    symbol: 'LBR',
    icon: SVG_ICONS.lumber,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(28, 45%, 42%)',
    accentBg: 'hsl(28, 45%, 42%)',
    yahooSymbol: 'LBR=F',
    exchange: 'CME',
    intlUnit: '1000 bd ft',
    indiaUnit: 'cu ft',
    // LBR=F quotes USD per 1,000 board feet; 1,000 bd ft = 1000/12 = 83.333 cu ft
    conversionDivisor: 83.3333,
    dutyRate: 0.11,
    dutyLabel: 'BCD 10% + SWS = 11% (sawn wood)',
    showPurity: false,
    show10g: false,
  },
  canola: {
    name: 'Canola Oil',
    symbol: 'RS',
    icon: SVG_ICONS.droplet,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(48, 80%, 48%)',
    accentBg: 'hsl(48, 80%, 48%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 1150, // USD/tonne — crude canola/rapeseed oil (RS=F seed feed unusable via Yahoo)
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.275,
    dutyLabel: 'BCD 20% + AIDC + SWS = 27.5%',
    secondaryUnit: { label: '10 kg', multiplier: 10 },
    showPurity: false,
    show10g: false,
  },
  palm: {
    name: 'Palm Oil (CPO)',
    symbol: 'CPO',
    icon: SVG_ICONS.droplet,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(15, 70%, 48%)',
    accentBg: 'hsl(15, 70%, 48%)',
    yahooSymbol: null,
    indicative: true,
    indicativePrice: 1000, // USD/tonne — crude palm oil (Bursa FCPO not on Yahoo)
    intlUnit: 'Metric Ton',
    indiaUnit: 'kg',
    conversionDivisor: 1000,
    dutyRate: 0.165,
    dutyLabel: 'BCD 10% + AIDC 5% + SWS = 16.5%',
    secondaryUnit: { label: '10 kg', multiplier: 10 },
    showPurity: false,
    show10g: false,
  },
  leanhogs: {
    name: 'Lean Hogs (Pork)',
    symbol: 'HE',
    icon: SVG_ICONS.livestock,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(345, 50%, 60%)',
    accentBg: 'hsl(345, 50%, 60%)',
    yahooSymbol: 'HE=F',
    exchange: 'CME',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    dutyRate: 0.33,
    dutyLabel: 'BCD 30% + SWS = 33%',
    note: 'CME lean-hog futures track live-weight hogs, not retail pork cuts.',
    showPurity: false,
    show10g: false,
  },
  livecattle: {
    name: 'Live Cattle',
    symbol: 'LE',
    icon: SVG_ICONS.livestock,
    category: 'agri',
    categoryLabel: 'Agri Commodity',
    accentColor: 'hsl(0, 0%, 45%)',
    accentBg: 'hsl(0, 0%, 45%)',
    yahooSymbol: 'LE=F',
    exchange: 'CME',
    intlUnit: 'Pound',
    indiaUnit: 'kg',
    conversionDivisor: 0.453592,
    importProhibited: true,
    dutyLabel: 'Import prohibited (DGFT)',
    note: 'Beef/live cattle import is prohibited in India (DGFT) — no landed price is computed.',
    showPurity: false,
    show10g: false,
  },
};

// ── STATE ──
const CATEGORIES = ['all', 'precious', 'industrial', 'energy', 'agri', 'watchlist'];
const SORTS = ['default', 'az', 'gainers', 'losers'];
const PRICE_CACHE_KEY = 'cpt_prices_v1';
const WATCH_KEY = 'cpt_watchlist_v1';
const THEME_KEY = 'commodity-theme';
const PRICE_STALE_MS = 10 * 60 * 1000; // data older than 10 min is flagged stale
const POLL_INTERVAL_MS = 60000;
const POLL_RETRY_MS = 30000;
const SITE_URL = 'https://commodity.mrchartist.com/';

let state = {
  usdInr: null,
  usdInrChange: null,
  usdInrChangePct: null,
  fxRates: null,      // { INR: 88.1, CAD: 1.36, ... } per 1 USD
  fxFresh: false,     // true once USD/INR was fetched live in this session
  prices: {},         // { gold: { price, change, changePct, ts, isApprox?, isSpotBackup? } }
  lastUpdate: null,   // Date of the data currently shown (may be from cache)
  lastSuccess: null,  // epoch ms of the last successful live fetch
  fromCache: false,   // showing persisted prices until the first live refresh lands
  isLoading: true,
  refreshing: false,
  failedCycles: 0,    // consecutive fully failed refresh cycles
  notRefreshed: [],   // keys that did not refresh in the latest cycle
  nextPollAt: null,
  errors: {},
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  watchlist: [],
};

const $ = id => document.getElementById(id);
const reduceMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode / quota */ } },
};

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

const isNum = v => typeof v === 'number' && Number.isFinite(v);

// ── THEME (system preference on first load; explicit choice persists) ──
function systemTheme() {
  return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButton(theme);
  if (chartInstance) chartInstance.applyOptions(chartOptions());
}
// Apply immediately (script sits at the end of <body>) to avoid a theme flash.
document.documentElement.setAttribute('data-theme', store.get(THEME_KEY) || systemTheme());

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  store.set(THEME_KEY, next);
  applyTheme(next);
}

function updateThemeButton(theme) {
  const icon = $('theme-icon');
  const btn = $('theme-toggle');
  if (icon) icon.innerHTML = theme === 'dark' ? SVG_ICONS.sun : SVG_ICONS.moon;
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

// Convert a foreign-currency amount to USD using the live FX rate map.
function toUsd(amount, currency) {
  const cur = (currency || 'USD').toUpperCase();
  if (cur === 'USD') return amount;
  if (cur === 'USX' || cur === 'USDX') return amount / 100;          // US cents
  if (cur === 'GBX' || cur === 'GBP_PENCE') return amount / 100;
  const rate = state.fxRates && state.fxRates[cur];
  return rate ? amount / rate : amount;
}

// ── PRICE PERSISTENCE CACHE ──
function savePriceCache() {
  store.set(PRICE_CACHE_KEY, JSON.stringify({
    ts: Date.now(),
    prices: state.prices,
    usdInr: state.usdInr,
    usdInrChange: state.usdInrChange,
    usdInrChangePct: state.usdInrChangePct,
    fxRates: state.fxRates,
  }));
}

function hydrateFromCache() {
  try {
    const raw = store.get(PRICE_CACHE_KEY);
    if (!raw) return false;
    const c = JSON.parse(raw);
    if (!c || !c.prices || typeof c.prices !== 'object') return false;
    const clean = {};
    for (const key of Object.keys(c.prices)) {
      const p = c.prices[key];
      if (!COMMODITIES[key] || !p || !isNum(p.price)) continue;
      clean[key] = {
        price: p.price,
        change: isNum(p.change) ? p.change : 0,
        changePct: isNum(p.changePct) ? p.changePct : 0,
        ts: isNum(p.ts) ? p.ts : (c.ts || 0),
        isApprox: !!p.isApprox,
        isSpotBackup: !!p.isSpotBackup,
        isSpot: !!p.isSpot,
      };
    }
    if (!Object.keys(clean).length || !isNum(c.usdInr)) return false;
    state.prices = clean;
    state.usdInr = c.usdInr;
    state.usdInrChange = isNum(c.usdInrChange) ? c.usdInrChange : null;
    state.usdInrChangePct = isNum(c.usdInrChangePct) ? c.usdInrChangePct : null;
    state.fxRates = c.fxRates && typeof c.fxRates === 'object' ? c.fxRates : null;
    state.lastUpdate = c.ts ? new Date(c.ts) : null;
    state.fromCache = true;
    state.isLoading = false;
    return true;
  } catch (e) { return false; }
}

// ── NETWORK ──
// Last-resort fallback only. The primary path is our own same-origin /api/quotes
// (Yahoo has no CORS headers, so the browser cannot call it directly).
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
];

// Per-cycle batch from /api/quotes: { quotes, spot, fxRates } or null if unavailable.
let batch = null;

async function fetchBatch(symbols) {
  if (!/^https?:$/.test(location.protocol)) return null;
  try {
    const resp = await fetch(`/api/quotes?s=${encodeURIComponent([...symbols].sort().join(','))}`, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data && data.quotes && Object.keys(data.quotes).length ? data : null;
  } catch (e) { return null; }
}

async function fetchWithProxy(url, timeout = 8000) {
  for (const proxy of CORS_PROXIES) {
    try {
      const resp = await fetch(proxy + encodeURIComponent(url), { signal: AbortSignal.timeout(timeout) });
      if (resp.ok) return JSON.parse(await resp.text());
    } catch (e) { /* try next proxy */ }
  }
  return null;
}

async function fetchYahooQuote(symbol) {
  if (batch) {
    const q = batch.quotes[symbol];
    if (!q || !isNum(q.price)) return null;
    const price = toUsd(q.price, q.currency);
    if (!isNum(price) || price <= 0) return null;
    const prevUsd = isNum(q.prev) && q.prev > 0 ? toUsd(q.prev, q.currency) : null;
    const hasPrev = isNum(prevUsd) && prevUsd > 0;
    const change = hasPrev ? price - prevUsd : 0;
    return { price, change, changePct: hasPrev ? (change / prevUsd) * 100 : 0 };
  }
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const data = await fetchWithProxy(url);
    if (!data) throw new Error('All proxies failed');
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error('No data in response');
    // Normalise every quote to USD (US-cents contracts are flagged "USX"; canola is CAD).
    const price = toUsd(meta.regularMarketPrice, meta.currency);
    if (!isNum(price) || price <= 0) throw new Error('Invalid price');
    const prevRaw = meta.chartPreviousClose || meta.previousClose;
    const prevClose = prevRaw ? toUsd(prevRaw, meta.currency) : null;
    const hasPrev = isNum(prevClose) && prevClose > 0;
    const change = hasPrev ? price - prevClose : 0;
    const changePct = hasPrev ? (change / prevClose) * 100 : 0;
    return { price, change, changePct };
  } catch (e) {
    console.warn(`Yahoo fetch failed for ${symbol}:`, e.message);
    return null;
  }
}

async function fetchWithFallbacks(primarySymbol, fallbackSymbols = []) {
  for (const sym of [primarySymbol, ...fallbackSymbols]) {
    const result = await fetchYahooQuote(sym);
    if (result) return result;
  }
  return null;
}

async function fetchUsdInr() {
  // Live rate first (Yahoo, via /api/quotes). open.er-api.com updates only once a day.
  const live = batch?.quotes?.['USDINR=X'];
  if (live && isNum(live.price) && live.price > 0) {
    const change = isNum(live.prev) && live.prev > 0 ? live.price - live.prev : null;
    return { rate: live.price, rates: batch.fxRates || undefined, change, changePct: change != null ? (change / live.prev) * 100 : null, source: 'Yahoo Finance (live)' };
  }
  try {
    const resp = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(6000) });
    if (resp.ok) {
      const data = await resp.json();
      if (isNum(data?.rates?.INR) && data.rates.INR > 0) {
        return { rate: data.rates.INR, rates: data.rates, source: 'ExchangeRate API' };
      }
    }
  } catch (e) {
    console.warn('ExchangeRate API failed:', e.message);
  }
  const yahoo = await fetchYahooQuote('USDINR=X');
  if (yahoo) return { rate: yahoo.price, change: yahoo.change, changePct: yahoo.changePct, source: 'Yahoo Finance' };
  return null;
}

// Spot backup: gold-api.com (CORS-enabled, no proxy). Spot only, no change data.
const GOLD_API_SYMBOLS = { gold: 'XAU', silver: 'XAG', platinum: 'XPT', palladium: 'XPD' };

async function fetchGoldApiSpot(commodityKey) {
  const sym = GOLD_API_SYMBOLS[commodityKey];
  if (!sym) return null;
  try {
    const resp = await fetch(`https://api.gold-api.com/price/${sym}`, { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (isNum(data?.price) && data.price > 0) return { price: data.price, change: 0, changePct: 0, isSpotBackup: true };
  } catch (e) {
    console.warn(`gold-api.com failed for ${sym}:`, e.message);
  }
  return null;
}

// Indicative levels (no free live feed) — see `indicative: true` in COMMODITIES.
const INDICATIVE_AS_OF = '2026-06-12';

function getIndicativePrices(keys) {
  const result = {};
  for (const key of keys) {
    const p = COMMODITIES[key].indicativePrice;
    if (p != null) result[key] = { price: p, change: 0, changePct: 0, isApprox: true };
  }
  return result;
}

async function fetchAllPrices() {
  const keys = Object.keys(COMMODITIES);
  const yahooKeys = keys.filter(k => !COMMODITIES[k].indicative);
  const indicativeKeys = keys.filter(k => COMMODITIES[k].indicative);
  const now = Date.now();

  const symbols = new Set(['USDINR=X']);
  yahooKeys.forEach(k => { symbols.add(COMMODITIES[k].yahooSymbol); (COMMODITIES[k].yahooFallbacks || []).forEach(f => symbols.add(f)); });
  batch = await fetchBatch(symbols);
  if (batch?.fxRates) state.fxRates = batch.fxRates; // needed before toUsd() for non-USD contracts

  const [fxRes, ...liveRes] = await Promise.allSettled([
    fetchUsdInr(),
    ...yahooKeys.map(async key => {
      const config = COMMODITIES[key];
      let data = await fetchWithFallbacks(config.yahooSymbol, config.yahooFallbacks || []);
      if (GOLD_API_SYMBOLS[key]) {
        // India's bullion price follows SPOT, not the futures curve. Use live spot for the
        // price and the COMEX/NYMEX futures only for the daily % change.
        const bs = batch?.spot?.[GOLD_API_SYMBOLS[key]];
        const spot = bs && isNum(bs.price) ? { price: bs.price } : await fetchGoldApiSpot(key);
        if (spot && data) {
          const pct = data.changePct;
          data = { price: spot.price, change: spot.price - spot.price / (1 + pct / 100), changePct: pct, isSpot: true };
        } else if (spot) {
          data = { price: spot.price, change: 0, changePct: 0, isSpotBackup: true };
        }
      }
      return [key, data];
    }),
  ]);

  const fx = fxRes.status === 'fulfilled' ? fxRes.value : null;
  state.fxFresh = !!fx;
  if (fx) {
    state.usdInr = fx.rate;
    state.usdInrChange = isNum(fx.change) && fx.change !== 0 ? fx.change : null;
    state.usdInrChangePct = isNum(fx.changePct) && fx.changePct !== 0 ? fx.changePct : null;
    if (fx.rates) state.fxRates = fx.rates;
  }

  let freshLive = 0;
  const notRefreshed = [];
  liveRes.forEach((res, i) => {
    const key = yahooKeys[i];
    const data = res.status === 'fulfilled' && res.value ? res.value[1] : null;
    if (data) {
      state.prices[key] = { ...data, ts: now };
      delete state.errors[key];
      freshLive++;
    } else {
      notRefreshed.push(key);
      if (!state.prices[key]) state.errors[key] = 'No data';
    }
  });

  const ind = getIndicativePrices(indicativeKeys);
  for (const key of indicativeKeys) {
    if (ind[key]) { state.prices[key] = { ...ind[key], ts: now }; delete state.errors[key]; }
    else if (!state.prices[key]) state.errors[key] = 'Unavailable';
  }

  state.notRefreshed = notRefreshed;
  // A cycle only counts as fresh if something live actually came back. Cached
  // values alone must never be reported as LIVE.
  if (freshLive > 0 && isNum(state.usdInr)) {
    state.fromCache = false;
    state.failedCycles = 0;
    state.lastSuccess = now;
    state.lastUpdate = new Date(now);
    savePriceCache();
  } else {
    state.failedCycles++;
  }
  state.isLoading = false;
}

// ── DUTY + CALCULATION ENGINE ──
function getDuty(config) {
  if (config.dutySchedule) {
    const today = new Date().toISOString().slice(0, 10);
    for (const entry of config.dutySchedule) {
      if (!entry.until || today <= entry.until) return { rate: entry.rate, label: entry.label };
    }
  }
  return { rate: config.dutyRate, label: config.dutyLabel };
}

function calcIndiaLanded(commodityKey) {
  const config = COMMODITIES[commodityKey];
  const priceData = state.prices[commodityKey];
  if (!priceData || !isNum(state.usdInr) || !isNum(priceData.price)) return null;
  if (config.importProhibited) return null;

  const pricePerIndiaUnit = (priceData.price / config.conversionDivisor) * state.usdInr * (1 + getDuty(config).rate);
  if (!isNum(pricePerIndiaUnit)) return null;
  const result = { perUnit: pricePerIndiaUnit };

  if (config.showPurity) {
    if (config.purityLabels) {
      result.purities = config.purityLabels.map(p => ({
        label: p.label,
        ratio: p.ratio,
        perGram: pricePerIndiaUnit * p.ratio,
        per10g: pricePerIndiaUnit * p.ratio * 10,
        perKg: pricePerIndiaUnit * p.ratio * 1000,
      }));
      result.k24 = pricePerIndiaUnit;
    } else {
      result.k24 = pricePerIndiaUnit;
      result.k22 = pricePerIndiaUnit * (22 / 24);
      result.k18 = pricePerIndiaUnit * (18 / 24);
    }
  }
  if (config.show10g) {
    result.per10g = pricePerIndiaUnit * 10;
    if (config.showPurity && !config.purityLabels) {
      result.per10g_22k = result.k22 * 10;
      result.per10g_18k = result.k18 * 10;
    }
  }
  if (config.showKg) {
    result.perKg = pricePerIndiaUnit * 1000;
    if (config.showPurity && !config.purityLabels) result.perKg_22k = result.k22 * 1000;
  }
  if (config.miniContracts) {
    result.minis = config.miniContracts.map(mc => ({ name: mc.name, lot: mc.lot, price: pricePerIndiaUnit * mc.multiplier }));
  }
  return result;
}

// ── FORMATTING ──
function fmtINR(val, decimals = 2) {
  if (!isNum(val)) return '—';
  return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUSD(val, decimals) {
  if (!isNum(val)) return '—';
  const d = decimals != null ? decimals : (Math.abs(val) < 1 ? 4 : 2);
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtChange(change, changePct) {
  if (!isNum(change) || !isNum(changePct)) return { text: '—', cls: 'neutral' };
  const sign = change > 0 ? '+' : '';
  const cls = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  const arrow = change > 0 ? '▲ ' : change < 0 ? '▼ ' : '';
  return { text: `${arrow}${sign}${change.toFixed(2)} · ${sign}${changePct.toFixed(2)}%`, cls };
}

function fmtTime(date) {
  if (!date || isNaN(date)) return '—';
  const sameDay = new Date().toDateString() === date.toDateString();
  const t = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  return sameDay ? t : `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${t}`;
}

function fmtAge(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

// Daily change is only meaningful for live futures quotes.
const hasChange = p => !!p && !p.isApprox && !p.isSpotBackup && isNum(p.changePct);
const isPriceStale = p => !!p && !p.isApprox && isNum(p.ts) && (Date.now() - p.ts) > PRICE_STALE_MS;

function tickInfo(p) {
  if (!p || !isNum(p.ts)) return { text: state.lastUpdate ? fmtTime(state.lastUpdate) : '—', flag: false };
  if (p.isApprox) return { text: 'Indicative', flag: false };
  const t = fmtTime(new Date(p.ts));
  if (state.fromCache) return { text: `Cached · ${t}`, flag: true };
  if (isPriceStale(p)) return { text: `Stale · ${t}`, flag: true };
  return { text: t, flag: false };
}

// ── CARD HTML ──
const ICON_STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
const ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';

function row(label, value, cls = '') {
  return `<div class="price-row ${cls}"><span class="price-label">${label}</span><span class="price-value ${cls.includes('hl') ? 'highlight' : ''}">${value}</span></div>`;
}

function buildLandedRowsHtml(config, landed) {
  let html = '';
  if (config.showPurity) {
    if (config.purityLabels && landed.purities) {
      for (const p of landed.purities) {
        html += `<div class="price-row"><span class="price-label">${p.label} per gram</span><span class="price-value ${p.ratio === 1 ? 'highlight' : ''}">${fmtINR(p.perGram)}/g</span></div>`;
      }
      if (config.showKg) {
        html += '<div class="price-group">';
        for (const p of landed.purities) {
          html += `<div class="price-row ${p.ratio === 1 ? 'strong' : 'sub'}"><span class="price-label">Per kg · ${p.label}</span><span class="price-value">${fmtINR(p.perKg, 0)}/kg</span></div>`;
        }
        html += '</div>';
      }
    } else {
      html += `<div class="price-row"><span class="price-label">24K per gram</span><span class="price-value highlight">${fmtINR(landed.k24)}/g</span></div>`;
      html += `<div class="price-row"><span class="price-label">22K per gram</span><span class="price-value">${fmtINR(landed.k22)}/g</span></div>`;
      html += `<div class="price-row"><span class="price-label">18K per gram</span><span class="price-value">${fmtINR(landed.k18)}/g</span></div>`;
      if (config.show10g) {
        html += `<div class="price-row strong"><span class="price-label">10g · 24K</span><span class="price-value">${fmtINR(landed.per10g, 0)}</span></div>`;
        html += `<div class="price-row"><span class="price-label">10g · 22K</span><span class="price-value">${fmtINR(landed.per10g_22k, 0)}</span></div>`;
      }
      if (config.showKg && landed.perKg) {
        html += `<div class="price-row strong"><span class="price-label">Per kg · 24K</span><span class="price-value">${fmtINR(landed.perKg, 0)}/kg</span></div>`;
        if (landed.perKg_22k) html += `<div class="price-row"><span class="price-label">Per kg · 22K</span><span class="price-value">${fmtINR(landed.perKg_22k, 0)}/kg</span></div>`;
      }
    }
  } else {
    html += `<div class="price-row"><span class="price-label">Per ${config.indiaUnit}</span><span class="price-value highlight">${fmtINR(landed.perUnit)}/${config.indiaUnit}</span></div>`;
    if (config.secondaryUnit) {
      html += `<div class="price-row"><span class="price-label">Per ${config.secondaryUnit.label}</span><span class="price-value">${fmtINR(landed.perUnit * config.secondaryUnit.multiplier)}/${config.secondaryUnit.label}</span></div>`;
    }
    if (config.show10g && landed.per10g != null) {
      html += `<div class="price-row strong"><span class="price-label">Per 10 g</span><span class="price-value">${fmtINR(landed.per10g, 0)}</span></div>`;
    }
  }
  if (landed.minis && landed.minis.length) {
    html += '<div class="price-group"><div class="price-group-title">Retail Contract Equivalents</div>';
    for (const mc of landed.minis) {
      html += `<div class="price-row contract"><span class="price-label">${mc.name} <small>(${mc.lot})</small></span><span class="price-value">${fmtINR(mc.price, 0)}</span></div>`;
    }
    html += '</div>';
  }
  return html;
}

function landedBlock(key, config, landed, priceData) {
  if (config.importProhibited) {
    return '<div class="price-row prohibited"><span class="price-label">Import prohibited in India</span><span class="price-value">DGFT</span></div>';
  }
  if (landed && priceData) return buildLandedRowsHtml(config, landed);
  if (state.errors[key] && !priceData) {
    return '<div class="price-row unavailable"><span class="price-label">Price unavailable right now. Will retry automatically.</span></div>';
  }
  return '<div class="price-row"><span class="price-label">Loading…</span><span class="price-value"><span class="skeleton"></span></span></div>';
}

function intlPriceInner(priceData, hasData) {
  const badge = priceData?.isApprox ? '<span class="intl-badge indicative">~INDICATIVE</span>'
    : priceData?.isSpotBackup ? '<span class="intl-badge spot">SPOT</span>' : '';
  return `<span class="intl-num">${hasData ? fmtUSD(priceData.price) : '—'}</span>${badge}`;
}

function isWatched(key) { return state.watchlist.includes(key); }

function buildCommodityCard(key, index) {
  const config = COMMODITIES[key];
  const priceData = state.prices[key];
  const hasData = !!priceData && isNum(state.usdInr) && isNum(priceData.price);
  const landed = calcIndiaLanded(key);
  const change = hasData && hasChange(priceData) ? fmtChange(priceData.change, priceData.changePct) : fmtChange(null);
  const tick = tickInfo(priceData);
  const watched = isWatched(key);
  const source = priceData?.isApprox ? `Indicative (as of ${INDICATIVE_AS_OF})`
    : priceData?.isSpot ? `Spot: gold-api.com · Change: Yahoo Finance (${config.yahooSymbol})`
    : priceData?.isSpotBackup ? 'gold-api.com (spot)'
    : `Yahoo Finance (${config.yahooSymbol || 'N/A'})`;
  const noChangeTitle = hasData && !hasChange(priceData) ? ' title="Daily change is not available for this source"' : '';

  return `
    <article class="commodity-card" data-commodity="${key}" data-category="${config.category}" style="--commodity-accent:${config.accentColor};--i:${index}" aria-label="${escapeHtml(config.name)}">
      <div class="commodity-card-inner">
        <div class="commodity-header">
          <div class="commodity-icon" aria-hidden="true">${config.icon}</div>
          <div class="commodity-info">
            <h2 class="commodity-name">${escapeHtml(config.name)}</h2>
            <div class="commodity-meta">
              <span class="commodity-symbol">${escapeHtml(config.symbol)}</span>
              <span class="badge badge-${config.category}">${escapeHtml(config.categoryLabel)}</span>
            </div>
          </div>
          <button type="button" class="switch" role="switch" aria-checked="${watched}" data-action="watch" data-key="${key}" aria-label="Watchlist: ${escapeHtml(config.name)}"><span class="switch-knob">${ICON_STAR}</span></button>
        </div>
        <div class="intl-price-row">
          <div>
            <div class="intl-price" id="intl-${key}">${intlPriceInner(priceData, hasData)}</div>
            <div class="intl-unit">/ ${escapeHtml(config.intlUnit.toLowerCase())}</div>
          </div>
          <div class="intl-change">
            <span class="change-pill ${change.cls}" id="change-${key}"${noChangeTitle}><span class="sr-only">Day change: </span>${change.text}</span>
          </div>
        </div>
        <div class="india-landed">
          <div class="india-landed-header">
            <span class="india-landed-title">₹ / <span class="unit">${escapeHtml(config.indiaUnit)}</span> · India Import Landed
              <a href="docs.html#meth-${config.category}" class="methodology-badge" title="View calculation methodology">Method</a>
            </span>
            <span class="india-duty-badge">${escapeHtml(getDuty(config).label)}</span>
          </div>
          <div id="landed-${key}">${landedBlock(key, config, landed, priceData)}</div>
          ${config.note ? `<div class="card-note">${escapeHtml(config.note)}</div>` : ''}
        </div>
      </div>
      <div class="data-source">
        <span class="source-text">Source: ${escapeHtml(source)}</span>
        <div class="card-actions">
          ${config.yahooSymbol ? `<button type="button" class="chip-btn" data-action="chart" data-key="${key}" aria-label="Open ${escapeHtml(config.name)} price chart">${SVG_ICONS.chart} Chart</button>` : ''}
          <button type="button" class="chip-btn" data-action="share" data-key="${key}" aria-label="Share ${escapeHtml(config.name)} price">${ICON_SHARE} Share</button>
        </div>
        <span class="tick ${tick.flag ? 'flag' : ''}" id="tick-${key}">${tick.text}</span>
      </div>
    </article>`;
}

// ── FX STRIP ──
const FX_TICKER_PAIRS = ['EUR', 'GBP', 'JPY', 'CNY', 'AED'];

function renderFxTicker() {
  const el = $('currency-rates');
  if (!el) return;
  if (!isNum(state.usdInr)) {
    el.innerHTML = '<div class="fx-item"><span class="fx-pair">USD / INR</span><span class="fx-rate">—</span></div>';
    return;
  }
  const pct = state.usdInrChangePct;
  const cls = !isNum(pct) ? '' : (pct > 0 ? 'up' : pct < 0 ? 'down' : '');
  const changeStr = !isNum(pct) ? '' : `<span class="fx-change ${cls}">${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(2)}%</span>`;
  const stale = state.fxFresh ? '' : ' stale';
  let html = `<div class="fx-item primary${stale}"><span class="fx-pair">USD / INR</span><span class="fx-rate">₹${state.usdInr.toFixed(2)}</span>${changeStr}</div>`;
  if (state.fxRates) {
    for (const cur of FX_TICKER_PAIRS) {
      const r = state.fxRates[cur];
      if (!isNum(r)) continue;
      html += `<div class="fx-item${stale}"><span class="fx-pair">USD / ${cur}</span><span class="fx-rate">${cur === 'JPY' ? r.toFixed(2) : r.toFixed(3)}</span></div>`;
    }
  }
  el.innerHTML = html;
}

// ── WATCHLIST ──
function loadWatchlist() {
  try {
    const arr = JSON.parse(store.get(WATCH_KEY) || '[]');
    state.watchlist = Array.isArray(arr) ? arr.filter(k => COMMODITIES[k]) : [];
  } catch (e) { state.watchlist = []; }
}
function saveWatchlist() { store.set(WATCH_KEY, JSON.stringify(state.watchlist)); }

function updateWatchCount() {
  document.querySelectorAll('[data-watch-count]').forEach(el => {
    el.textContent = state.watchlist.length;
    el.classList.toggle('zero', state.watchlist.length === 0);
  });
}

function toggleWatch(key) {
  if (!COMMODITIES[key]) return;
  const name = COMMODITIES[key].name;
  const on = !isWatched(key);
  state.watchlist = on ? [...state.watchlist, key] : state.watchlist.filter(k => k !== key);
  saveWatchlist();
  updateWatchCount();
  if (!on && state.activeCategory === 'watchlist') renderAllCards();
  else {
    const sw = document.querySelector(`.switch[data-key="${key}"]`);
    if (sw) sw.setAttribute('aria-checked', String(on));
  }
  showToast(on ? `${name} added to your watchlist` : `${name} removed from your watchlist`);
}

// ── VISIBLE KEYS ──
function getVisibleKeys() {
  const q = (state.searchQuery || '').trim().toLowerCase();
  const keys = Object.keys(COMMODITIES).filter(key => {
    const c = COMMODITIES[key];
    if (state.activeCategory === 'watchlist') { if (!isWatched(key)) return false; }
    else if (state.activeCategory !== 'all' && c.category !== state.activeCategory) return false;
    if (q && !`${c.name} ${c.symbol} ${c.categoryLabel} ${key}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const pct = k => (hasChange(state.prices[k]) ? state.prices[k].changePct : null);
  const cmp = dir => (a, b) => {
    const pa = pct(a), pb = pct(b);
    if (pa == null && pb == null) return 0;
    if (pa == null) return 1;      // items without a daily change always sort last
    if (pb == null) return -1;
    return dir * (pb - pa);
  };
  if (state.sortBy === 'az') keys.sort((a, b) => COMMODITIES[a].name.localeCompare(COMMODITIES[b].name, 'en'));
  else if (state.sortBy === 'gainers') keys.sort(cmp(1));
  else if (state.sortBy === 'losers') keys.sort(cmp(-1));
  return keys;
}

function viewSignature(keys) {
  return keys.map(k => {
    const p = state.prices[k];
    return `${k}:${p ? (p.isApprox ? 'a' : p.isSpotBackup ? 's' : 'l') : state.errors[k] ? 'e' : 'n'}`;
  }).join(',') + `|${state.fromCache}|${isNum(state.usdInr)}`;
}

// ── RENDER ──
let cardsAnimatedOnce = false;
let renderedSig = '';

function renderAllCards() {
  const grid = $('commodity-grid');
  if (!grid) return;
  const keys = getVisibleKeys();
  renderedSig = viewSignature(keys);

  // Preserve keyboard focus across re-renders
  const ae = document.activeElement;
  const focusSel = ae && grid.contains(ae) && ae.dataset && ae.dataset.action ? `[data-action="${ae.dataset.action}"][data-key="${ae.dataset.key}"]` : null;

  if (!keys.length) {
    const q = escapeHtml(state.searchQuery.trim());
    let body;
    if (state.activeCategory === 'watchlist' && !q) {
      body = `<h2>Your watchlist is empty</h2><p>Turn on the switch at the top of any commodity card to keep it here for quick access. Your list is saved on this device.</p><button type="button" class="pill-btn" data-action="show-all">Browse all commodities</button>`;
    } else {
      body = `<h2>No matches</h2><p>No commodities match “<strong>${q}</strong>”${state.activeCategory !== 'all' ? ' in this view' : ''}.</p><button type="button" class="pill-btn" data-action="clear-search">Clear search</button>`;
    }
    grid.classList.remove('animate');
    grid.innerHTML = `<div class="empty-state">${body}</div>`;
    const rc = $('result-count'); if (rc) rc.textContent = 'No commodities found';
    return;
  }

  if (!cardsAnimatedOnce) {
    cardsAnimatedOnce = true;
    grid.classList.add('animate');
    setTimeout(() => grid.classList.remove('animate'), 1400);
  }
  grid.innerHTML = keys.map((k, i) => buildCommodityCard(k, i)).join('');
  const rc = $('result-count'); if (rc) rc.textContent = `${keys.length} ${keys.length === 1 ? 'commodity' : 'commodities'} shown`;
  if (focusSel) { const el = grid.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
}

function updateCards() {
  Object.keys(COMMODITIES).forEach(key => {
    const config = COMMODITIES[key];
    const p = state.prices[key];
    const intlEl = $(`intl-${key}`);
    if (!intlEl) return;
    if (p && isNum(p.price)) {
      const num = intlEl.querySelector('.intl-num');
      const newPrice = fmtUSD(p.price);
      if (num && num.textContent !== newPrice) {
        num.textContent = newPrice;
        if (!reduceMotion()) {
          intlEl.classList.remove('price-flash'); void intlEl.offsetWidth;
          intlEl.classList.add('price-flash');
        }
      }
      const changeEl = $(`change-${key}`);
      if (changeEl) {
        const c = hasChange(p) ? fmtChange(p.change, p.changePct) : fmtChange(null);
        changeEl.className = `change-pill ${c.cls}`;
        changeEl.innerHTML = `<span class="sr-only">Day change: </span>${c.text}`;
      }
      const landed = calcIndiaLanded(key);
      const landedEl = $(`landed-${key}`);
      if (landedEl && landed) landedEl.innerHTML = buildLandedRowsHtml(config, landed);
    }
  });
  updateTickLabels();
}

function updateTickLabels() {
  Object.keys(COMMODITIES).forEach(key => {
    const el = $(`tick-${key}`);
    if (!el) return;
    const t = tickInfo(state.prices[key]);
    el.textContent = t.text;
    el.classList.toggle('flag', t.flag);
  });
}

// ── MARKET SUMMARY ──
function renderSummary() {
  const el = $('market-summary');
  if (!el) return;
  let up = 0, down = 0, flat = 0, best = null, worst = null;
  for (const key of Object.keys(COMMODITIES)) {
    const p = state.prices[key];
    if (!hasChange(p) || !isNum(state.usdInr)) continue;
    if (p.changePct > 0) up++; else if (p.changePct < 0) down++; else flat++;
    if (!best || p.changePct > state.prices[best].changePct) best = key;
    if (!worst || p.changePct < state.prices[worst].changePct) worst = key;
  }
  const total = up + down + flat;
  const mover = (label, key, cls) => {
    if (!key) return `<div class="summary-cell"><span class="s-label">${label}</span><span class="s-val">—</span></div>`;
    const p = state.prices[key];
    const sign = p.changePct > 0 ? '+' : '';
    const chartable = !!COMMODITIES[key].yahooSymbol;
    const inner = `<span class="s-label">${label}</span><span class="s-val ${cls}">${sign}${p.changePct.toFixed(2)}%</span><span class="s-name">${escapeHtml(COMMODITIES[key].name)}</span>`;
    return chartable ? `<button type="button" class="summary-cell pressable" data-action="chart" data-key="${key}" aria-label="${label}: ${escapeHtml(COMMODITIES[key].name)} ${sign}${p.changePct.toFixed(2)} percent. Open chart">${inner}</button>`
      : `<div class="summary-cell">${inner}</div>`;
  };
  el.innerHTML = `
    <div class="summary-cell"><span class="s-label">Advancing</span><span class="s-val up">${total ? up : '—'}</span><span class="s-sub">${total ? `of ${total} live quotes` : 'awaiting data'}</span></div>
    <div class="summary-cell"><span class="s-label">Declining</span><span class="s-val down">${total ? down : '—'}</span><span class="s-sub">${total && flat ? `${flat} unchanged` : (total ? 'daily change' : 'awaiting data')}</span></div>
    ${mover('Top gainer', best && state.prices[best].changePct > 0 ? best : null, 'up')}
    ${mover('Top loser', worst && state.prices[worst].changePct < 0 ? worst : null, 'down')}`;
}

// ── STATUS (honest about CACHED / STALE) ──
function statusModel() {
  const hasAny = Object.keys(state.prices).length > 0;
  const age = state.lastSuccess ? Date.now() - state.lastSuccess : Infinity;
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const partial = state.notRefreshed.length + (state.fxFresh || state.fromCache ? 0 : 1);
  if (!hasAny) return state.isLoading ? { k: 'LOADING', cls: 'warn' } : { k: 'OFFLINE', cls: 'bad' };
  if (offline) return { k: 'OFFLINE', cls: 'bad' };
  if (state.fromCache) return { k: 'CACHED', cls: 'warn' };
  if (age > PRICE_STALE_MS) return { k: 'STALE', cls: 'warn' };
  if (partial > 0) return { k: `PARTIAL · ${partial}`, cls: 'warn' };
  return { k: 'LIVE', cls: '' };
}

function updateStatus() {
  const pill = $('status-pill'), text = $('status-text');
  if (!pill || !text) return;
  const m = statusModel();
  pill.className = `status-pill ${m.cls}`;
  if (text.textContent !== m.k) text.textContent = m.k;
  const tips = {
    LIVE: 'Live prices, refreshed within the last 10 minutes',
    CACHED: 'Showing prices saved in your browser; a live refresh has not succeeded yet',
    STALE: 'The last successful refresh was over 10 minutes ago',
    OFFLINE: 'No network connection or no data available',
    LOADING: 'Loading prices',
  };
  pill.title = tips[m.k] || (m.k.startsWith('PARTIAL') ? 'Some commodities could not be refreshed in the latest cycle' : '');
}

function updateStatusLine() {
  const el = $('status-line');
  if (!el) return;
  const m = statusModel();
  const hasAny = Object.keys(state.prices).length > 0;
  const next = state.nextPollAt ? Math.max(0, Math.ceil((state.nextPollAt - Date.now()) / 1000)) : null;
  const countdown = state.refreshing ? 'Refreshing now…' : (next != null && !document.hidden ? `Next refresh in ${next}s` : 'Auto-refresh paused while this tab is hidden');
  const when = state.lastUpdate ? `${fmtTime(state.lastUpdate)} (${fmtAge(Date.now() - state.lastUpdate.getTime())})` : '';
  let msg, cls = '';
  if (!hasAny) {
    msg = state.isLoading ? 'Fetching live prices…' : `Unable to fetch prices. ${countdown}`;
    cls = state.isLoading ? '' : 'bad';
  } else if (m.k === 'OFFLINE') {
    msg = `You appear to be offline. Showing saved prices from ${when}.`; cls = 'bad';
  } else if (state.fromCache) {
    msg = `Showing cached prices from ${when}. ${state.refreshing ? 'Fetching live data…' : 'Live refresh has not succeeded yet. ' + countdown}`; cls = 'warn';
  } else if (m.k === 'STALE') {
    msg = `Prices are stale. Last successful update ${when}. ${countdown}`; cls = 'warn';
  } else if (m.k.startsWith('PARTIAL')) {
    msg = `Last updated ${when} · ${state.notRefreshed.length ? state.notRefreshed.length + ' commodities could not refresh' : 'USD/INR is from cache'} · ${countdown}`; cls = 'warn';
  } else {
    msg = `Last updated ${when} · ${countdown}`;
  }
  if (el.textContent !== msg) el.textContent = msg;
  el.className = `status-line ${cls}`;
}

// ── CONTROLS: segmented, category, search, sort ──
function layoutSegmented(seg) {
  if (!seg) return;
  const act = seg.querySelector('.seg-btn.active');
  const thumb = seg.querySelector('.seg-thumb');
  if (!act || !thumb || !act.offsetWidth) { seg.classList.remove('has-thumb'); return; }
  thumb.style.width = act.offsetWidth + 'px';
  thumb.style.transform = `translateX(${act.offsetLeft}px)`;
  seg.classList.add('has-thumb');
  if (!seg.classList.contains('seg-ready')) requestAnimationFrame(() => requestAnimationFrame(() => seg.classList.add('seg-ready')));
  if (seg.scrollWidth > seg.clientWidth + 1) {
    seg.scrollTo({ left: act.offsetLeft - (seg.clientWidth - act.offsetWidth) / 2, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }
}
function layoutAllSegmented() { ['category-tabs', 'sort-seg', 'chart-timeframes'].forEach(id => layoutSegmented($(id))); }

function syncControls() {
  document.querySelectorAll('#category-tabs .seg-btn').forEach(b => {
    const on = b.dataset.cat === state.activeCategory;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('#tabbar .tab[data-cat]').forEach(t => {
    const on = t.dataset.cat === state.activeCategory;
    t.classList.toggle('active', on);
    if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
  });
  document.querySelectorAll('#sort-seg .seg-btn').forEach(b => {
    const on = b.dataset.sort === state.sortBy;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
  });
  const input = $('commodity-search');
  if (input && input.value !== state.searchQuery) input.value = state.searchQuery;
  const has = !!state.searchQuery;
  const clr = $('search-clear'); if (clr) clr.hidden = !has;
  const field = $('search-field'); if (field) field.classList.toggle('has-value', has);
  updateWatchCount();
  layoutSegmented($('category-tabs'));
  layoutSegmented($('sort-seg'));
}

function filterCategory(cat) {
  if (!CATEGORIES.includes(cat)) cat = 'all';
  state.activeCategory = cat;
  syncControls(); renderAllCards(); urlWrite('replace');
}
function setSortBy(value) {
  state.sortBy = SORTS.includes(value) ? value : 'default';
  syncControls(); renderAllCards(); urlWrite('replace');
}
let searchUrlTimer = null;
function filterSearch(value) {
  state.searchQuery = value || '';
  syncControls(); renderAllCards();
  clearTimeout(searchUrlTimer);
  searchUrlTimer = setTimeout(() => urlWrite('replace'), 300);
}
function clearSearch(focus) {
  state.searchQuery = '';
  syncControls(); renderAllCards(); urlWrite('replace');
  if (focus) { const i = $('commodity-search'); if (i) i.focus(); }
}

// ── DEEP LINKS (#cat=energy&q=oil&sort=gainers&chart=gold) ──
function parseUrl() {
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  const query = new URLSearchParams(location.search); // legacy ?cat= from docs links
  const cat = hash.get('cat') || query.get('cat');
  const sort = hash.get('sort');
  const chart = hash.get('chart');
  return {
    cat: CATEGORIES.includes(cat) ? cat : 'all',
    q: (hash.get('q') || '').slice(0, 80),
    sort: SORTS.includes(sort) ? sort : 'default',
    chart: chart && COMMODITIES[chart] && COMMODITIES[chart].yahooSymbol ? chart : null,
  };
}

function buildUrl(withChart) {
  const p = new URLSearchParams();
  if (state.activeCategory !== 'all') p.set('cat', state.activeCategory);
  if (state.searchQuery.trim()) p.set('q', state.searchQuery.trim());
  if (state.sortBy !== 'default') p.set('sort', state.sortBy);
  if (withChart && currentChartKey) p.set('chart', currentChartKey);
  const s = p.toString();
  const search = new URLSearchParams(location.search); search.delete('cat');
  const qs = search.toString();
  return location.pathname + (qs ? '?' + qs : '') + (s ? '#' + s : '');
}

let chartPushed = false;
function urlWrite(mode) {
  try {
    const url = buildUrl(isChartOpen());
    if (mode === 'push') history.pushState({ cpt: 1 }, '', url);
    else history.replaceState(history.state, '', url);
    lastAppliedSig = JSON.stringify(parseUrlFrom(url));
  } catch (e) { /* file:// or sandboxed — ignore */ }
}

let lastAppliedSig = '';
function applyUrlState() {
  const u = parseUrl();
  const sig = JSON.stringify(u);
  if (sig === lastAppliedSig) return;
  lastAppliedSig = sig;
  const changed = state.activeCategory !== u.cat || state.searchQuery !== u.q || state.sortBy !== u.sort;
  state.activeCategory = u.cat; state.searchQuery = u.q; state.sortBy = u.sort;
  if (changed) { syncControls(); renderAllCards(); }
  if (u.chart) { if (currentChartKey !== u.chart || !isChartOpen()) openChart(u.chart, { fromUrl: true }); }
  else if (isChartOpen()) closeChart({ fromPop: true });
}

// ── TOAST + SHARE ──
let toastTimer = null;
function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function buildShare(key) {
  const config = COMMODITIES[key];
  const p = state.prices[key];
  const lines = [];
  const exch = config.exchange ? ` (${config.exchange})` : '';
  if (!p || !isNum(p.price)) {
    lines.push(`${config.name}: price currently unavailable`);
  } else {
    const chg = hasChange(p) ? ` (${p.changePct > 0 ? '+' : ''}${p.changePct.toFixed(2)}%)` : '';
    lines.push(`${config.name}${exch}: ${fmtUSD(p.price)} per ${config.intlUnit.toLowerCase()}${chg}`);
    const landed = calcIndiaLanded(key);
    const duty = getDuty(config);
    if (config.importProhibited) lines.push('Import prohibited in India (DGFT).');
    else if (landed) {
      const v = config.show10g ? `${fmtINR(landed.per10g, 0)}/10g` : `${fmtINR(landed.perUnit)}/${config.indiaUnit}`;
      lines.push(`India import landed: ${v} incl. duty (${duty.label})`);
    }
    if (p.isApprox) lines.push(`Indicative level as of ${INDICATIVE_AS_OF}.`);
    else if (state.fromCache || isPriceStale(p)) lines.push(`Note: saved price from ${fmtTime(new Date(p.ts || Date.now()))}, not live.`);
  }
  lines.push('For illustrative purposes only. Not NSE/MCX data.');
  lines.push('via @MrChartist');
  const p2 = new URLSearchParams({ q: config.name });
  return { title: `${config.name} price — Commodity Price Tracker`, text: lines.join('\n'), url: `${SITE_URL}#${p2.toString()}` };
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) { return false; }
}

async function shareCommodity(key) {
  const d = buildShare(key);
  if (navigator.share) {
    try { await navigator.share({ title: d.title, text: d.text, url: d.url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const ok = await copyText(`${d.text}\n${d.url}`);
  showToast(ok ? 'Price copied to clipboard' : 'Unable to copy. Please copy manually.');
}

// ── REFRESH + POLLING ──
let inflight = null;
let pollTimer = null;

function setRefreshUi(busy) {
  const btn = $('refresh-btn');
  if (!btn) return;
  btn.disabled = busy;
  btn.setAttribute('aria-busy', String(busy));
}

function onDataChanged() {
  const sig = viewSignature(getVisibleKeys());
  if (sig !== renderedSig) renderAllCards(); else updateCards();
  renderFxTicker();
  renderSummary();
  updateStatus();
  updateStatusLine();
}

function scheduleNextPoll(delay) {
  clearTimeout(pollTimer);
  if (document.hidden) { state.nextPollAt = null; return; }
  const ms = delay != null ? delay : (state.failedCycles > 0 ? POLL_RETRY_MS : POLL_INTERVAL_MS);
  state.nextPollAt = Date.now() + ms;
  pollTimer = setTimeout(refreshPrices, ms);
}

function refreshPrices() {
  if (inflight) return inflight;
  clearTimeout(pollTimer);
  state.refreshing = true; state.nextPollAt = null;
  setRefreshUi(true); updateStatusLine();
  inflight = (async () => {
    try { await fetchAllPrices(); }
    catch (e) { console.warn('Refresh failed:', e && e.message); state.failedCycles++; state.isLoading = false; }
    finally {
      state.refreshing = false; inflight = null;
      setRefreshUi(false);
      onDataChanged();
      scheduleNextPoll();
    }
  })();
  return inflight;
}

// ── CHART SHEET ──
let chartInstance = null;
let chartSeries = null;
let chartResizeObserver = null;
let currentChartKey = null;
let currentRange = '1y';
let chartToken = 0;
let lastFocus = null;
let closeTimer = null;

const isChartOpen = () => { const m = $('chart-modal'); return !!m && !m.hidden && m.classList.contains('open'); };

function getChartSymbol(key) { return COMMODITIES[key]?.yahooSymbol || null; }

const CHART_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function readChartCache(symbol, range) {
  try {
    const parsed = JSON.parse(store.get(`cpt_chart_${symbol}_${range}`) || 'null');
    if (!parsed || !Array.isArray(parsed.data) || !parsed.data.length) return null;
    return { data: parsed.data, fresh: (Date.now() - parsed.ts) < CHART_CACHE_TTL_MS };
  } catch (e) { return null; }
}
function writeChartCache(symbol, range, data) { store.set(`cpt_chart_${symbol}_${range}`, JSON.stringify({ ts: Date.now(), data })); }

async function fetchHistoricalData(symbol, range) {
  const cached = readChartCache(symbol, range);
  if (cached && cached.fresh) return { data: cached.data, stale: false };
  const interval = ['1mo', '3mo', '6mo', '1y', '2y'].includes(range) ? '1d' : '1wk';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const sources = [
    { build: () => `/api/chart?s=${encodeURIComponent(symbol)}&range=${range}`, own: true },
    { build: () => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` },
  ];
  for (const src of sources) {
    try {
      if (src.own && !/^https?:$/.test(location.protocol)) continue;
      const resp = await fetch(src.build(), { signal: AbortSignal.timeout(12000) });
      if (!resp.ok) continue;
      const body = await resp.json();
      if (src.own) {
        const rows = (body.ohlc || []).filter(r => [r.open, r.high, r.low, r.close].every(isNum))
          .map(r => ({ time: r.time, open: +r.open.toFixed(2), high: +r.high.toFixed(2), low: +r.low.toFixed(2), close: +r.close.toFixed(2) }));
        if (rows.length) { writeChartCache(symbol, range, rows); return { data: rows, stale: false }; }
        continue;
      }
      const result = body?.chart?.result?.[0];
      const ts = result?.timestamp, q = result?.indicators?.quote?.[0];
      if (!Array.isArray(ts) || !q) continue;
      const ohlc = [];
      for (let i = 0; i < ts.length; i++) {
        if (![q.open?.[i], q.high?.[i], q.low?.[i], q.close?.[i]].every(isNum)) continue;
        ohlc.push({ time: ts[i], open: +q.open[i].toFixed(2), high: +q.high[i].toFixed(2), low: +q.low[i].toFixed(2), close: +q.close[i].toFixed(2) });
      }
      if (ohlc.length) { writeChartCache(symbol, range, ohlc); return { data: ohlc, stale: false }; }
    } catch (e) { /* try next proxy */ }
  }
  return cached ? { data: cached.data, stale: true } : { data: null, stale: false };
}

function chartColors() {
  return currentTheme() === 'dark'
    ? { bg: '#1C1C1E', text: '#98989D', grid: 'rgba(84,84,88,0.35)', border: 'rgba(84,84,88,0.65)', up: '#30D158', down: '#FF453A', cross: 'rgba(142,140,255,0.5)' }
    : { bg: '#FFFFFF', text: '#636366', grid: 'rgba(60,60,67,0.1)', border: 'rgba(60,60,67,0.2)', up: '#34C759', down: '#FF3B30', cross: 'rgba(79,70,229,0.45)' };
}
function chartOptions() {
  const c = chartColors();
  return {
    localization: { locale: 'en-IN' },
    layout: { background: { type: 'solid', color: c.bg }, textColor: c.text, fontFamily: "'Inter', -apple-system, system-ui, sans-serif", fontSize: 12 },
    grid: { vertLines: { color: c.grid }, horzLines: { color: c.grid } },
    crosshair: { mode: 0, vertLine: { color: c.cross, width: 1, style: 2 }, horzLine: { color: c.cross, width: 1, style: 2 } },
    rightPriceScale: { borderColor: c.border, scaleMargins: { top: 0.1, bottom: 0.1 } },
    timeScale: { borderColor: c.border, timeVisible: false },
  };
}

function destroyChart() {
  if (chartResizeObserver) { chartResizeObserver.disconnect(); chartResizeObserver = null; }
  if (chartInstance) { try { chartInstance.remove(); } catch (e) { /* already disposed */ } chartInstance = null; }
  chartSeries = null;
}

function setRangeButtons(range) {
  document.querySelectorAll('#chart-timeframes .seg-btn').forEach(b => {
    const on = b.dataset.range === range;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
  });
  layoutSegmented($('chart-timeframes'));
}

function lockScroll(lock) {
  document.body.classList.toggle('modal-open', lock);
  document.body.style.paddingRight = lock ? Math.max(0, window.innerWidth - document.documentElement.clientWidth) + 'px' : '';
  const app = $('app');
  if (app) { if (lock) app.setAttribute('inert', ''); else app.removeAttribute('inert'); }
}

async function openChart(key, opts = {}) {
  const config = COMMODITIES[key];
  if (!config || !config.yahooSymbol) return;
  const modal = $('chart-modal');
  const wasOpen = isChartOpen();
  clearTimeout(closeTimer);
  currentChartKey = key; currentRange = '1y';
  const exchange = config.exchange || 'Futures';
  $('chart-title').textContent = `${config.name}`;
  $('chart-sub').textContent = `${config.yahooSymbol} · ${exchange} futures · USD`;
  $('chart-source').textContent = `Data: Yahoo Finance (${exchange} futures) · For illustrative purposes only`;
  setRangeButtons('1y');

  if (!wasOpen) {
    lastFocus = opts.trigger || document.activeElement;
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('open');
    lockScroll(true);
    $('chart-close').focus({ preventScroll: true });
    layoutSegmented($('chart-timeframes'));
  }
  if (!opts.fromUrl) {
    urlWrite('push'); chartPushed = true;
  }
  await renderChart(key, '1y');
}

function parseUrlFrom(url) {
  const h = new URLSearchParams((url.split('#')[1] || ''));
  const cat = h.get('cat'), sort = h.get('sort'), chart = h.get('chart');
  return { cat: CATEGORIES.includes(cat) ? cat : 'all', q: (h.get('q') || '').slice(0, 80), sort: SORTS.includes(sort) ? sort : 'default', chart: chart && COMMODITIES[chart] && COMMODITIES[chart].yahooSymbol ? chart : null };
}

async function renderChart(key, range) {
  const token = ++chartToken;
  const container = $('chart-container');
  destroyChart();
  container.innerHTML = '<div class="chart-loading" role="status">Loading chart data…</div>';
  $('chart-data-range').textContent = '';

  if (typeof LightweightCharts === 'undefined') {
    container.innerHTML = '<div class="chart-loading">The charting library could not be loaded. Please check your connection and try again.</div>';
    return;
  }
  const symbol = getChartSymbol(key);
  if (!symbol) { container.innerHTML = '<div class="chart-loading">A chart is unavailable for indicative-priced commodities.</div>'; return; }

  const { data, stale } = await fetchHistoricalData(symbol, range);
  if (token !== chartToken || !isChartOpen()) return; // superseded or closed while loading
  if (!data || !data.length) {
    container.innerHTML = '<div class="chart-loading">Unable to load chart data. Please try another range or try again shortly.</div>';
    return;
  }
  container.innerHTML = '';
  const c = chartColors();
  chartInstance = LightweightCharts.createChart(container, {
    ...chartOptions(),
    width: container.clientWidth || 320,
    height: container.clientHeight || 320,
    handleScroll: true, handleScale: true,
  });
  chartSeries = chartInstance.addCandlestickSeries({
    upColor: c.up, downColor: c.down, borderUpColor: c.up, borderDownColor: c.down, wickUpColor: c.up, wickDownColor: c.down,
  });
  chartSeries.setData(data);
  chartInstance.timeScale().fitContent();

  const fmt = t => new Date(t * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  $('chart-data-range').textContent = `${fmt(data[0].time)} – ${fmt(data[data.length - 1].time)} · ${data.length} candles${stale ? ' · cached copy' : ''}`;

  chartResizeObserver = new ResizeObserver(() => {
    if (chartInstance && container.clientWidth > 0) chartInstance.applyOptions({ width: container.clientWidth, height: container.clientHeight });
  });
  chartResizeObserver.observe(container);
}

async function changeRange(range) {
  currentRange = range;
  setRangeButtons(range);
  if (currentChartKey) await renderChart(currentChartKey, range);
}

function closeChart(opts = {}) {
  const modal = $('chart-modal');
  if (!modal || modal.hidden) return;
  chartToken++; // cancel in-flight loads
  modal.classList.remove('open');
  lockScroll(false);
  destroyChart();
  const sheet = $('chart-sheet'); if (sheet) { sheet.style.transform = ''; sheet.classList.remove('dragging'); }
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => { if (!modal.classList.contains('open')) modal.hidden = true; }, reduceMotion() ? 0 : 320);
  if (!opts.fromPop) {
    if (chartPushed) { chartPushed = false; try { history.back(); } catch (e) { /* ignore */ } }
    else { currentChartKey = null; urlWrite('replace'); }
  } else chartPushed = false;
  currentChartKey = null;
  if (lastFocus && document.contains(lastFocus) && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  lastFocus = null;
}

// Drag-to-dismiss for the mobile bottom sheet
function initSheetDrag() {
  const grab = $('sheet-grabber'), sheet = $('chart-sheet');
  if (!grab || !sheet) return;
  let startY = null, dy = 0, t0 = 0;
  grab.addEventListener('pointerdown', e => {
    if (getComputedStyle(grab).display === 'none') return;
    startY = e.clientY; dy = 0; t0 = Date.now();
    grab.setPointerCapture(e.pointerId); sheet.classList.add('dragging');
  });
  grab.addEventListener('pointermove', e => {
    if (startY == null) return;
    dy = Math.max(0, e.clientY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
  });
  const end = () => {
    if (startY == null) return;
    const velocity = dy / Math.max(1, Date.now() - t0);
    startY = null; sheet.classList.remove('dragging');
    if (dy > 110 || velocity > 0.6) closeChart(); else sheet.style.transform = '';
  };
  grab.addEventListener('pointerup', end);
  grab.addEventListener('pointercancel', end);
}

// ── KEYBOARD ──
function focusables(root) {
  return [...root.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
}

document.addEventListener('keydown', e => {
  if (isChartOpen()) {
    if (e.key === 'Escape') { e.preventDefault(); closeChart(); return; }
    if (e.key === 'Tab') {
      const sheet = $('chart-sheet');
      const f = focusables(sheet);
      if (!f.length) { e.preventDefault(); sheet.focus(); return; }
      const first = f[0], last = f[f.length - 1];
      if (!sheet.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return;
  }
  const t = e.target;
  const editing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if (e.key === '/' && !editing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const i = $('commodity-search');
    if (i) { e.preventDefault(); i.focus(); i.select(); }
  } else if (e.key === 'Escape') {
    if (state.searchQuery) { clearSearch(false); }
    else if (t && t.id === 'commodity-search') t.blur();
  }
});

// ── EVENT WIRING ──
function bindEvents() {
  $('theme-toggle').addEventListener('click', toggleTheme);
  $('refresh-btn').addEventListener('click', () => refreshPrices());
  $('chart-close').addEventListener('click', () => closeChart());
  $('chart-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeChart(); });
  $('category-tabs').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) filterCategory(b.dataset.cat); });
  $('sort-seg').addEventListener('click', e => { const b = e.target.closest('[data-sort]'); if (b) setSortBy(b.dataset.sort); });
  $('chart-timeframes').addEventListener('click', e => { const b = e.target.closest('[data-range]'); if (b) changeRange(b.dataset.range); });
  $('tabbar').addEventListener('click', e => {
    const a = e.target.closest('a[data-cat]');
    if (!a) return;
    e.preventDefault();
    filterCategory(a.dataset.cat);
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  });
  const input = $('commodity-search');
  input.addEventListener('input', () => filterSearch(input.value));
  $('search-clear').addEventListener('click', () => clearSearch(true));
  const onAction = e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const key = b.dataset.key;
    switch (b.dataset.action) {
      case 'chart': openChart(key, { trigger: b }); break;
      case 'share': shareCommodity(key); break;
      case 'watch': toggleWatch(key); break;
      case 'clear-search': clearSearch(true); break;
      case 'show-all': filterCategory('all'); break;
    }
  };
  $('commodity-grid').addEventListener('click', onAction);
  $('market-summary').addEventListener('click', onAction);

  window.addEventListener('popstate', applyUrlState);
  window.addEventListener('hashchange', applyUrlState);
  window.addEventListener('storage', e => { if (e.key === WATCH_KEY) { loadWatchlist(); updateWatchCount(); renderAllCards(); } });
  window.addEventListener('online', () => refreshPrices());
  window.addEventListener('offline', () => { updateStatus(); updateStatusLine(); });
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layoutAllSegmented, 120); });

  // Collapse the large title into the navigation bar on scroll
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { document.body.classList.toggle('scrolled', window.scrollY > 48); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Follow system theme changes until the user picks one explicitly
  if (window.matchMedia) {
    const mq = matchMedia('(prefers-color-scheme: light)');
    const onSys = () => { if (!store.get(THEME_KEY)) applyTheme(systemTheme()); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(pollTimer); state.nextPollAt = null; }
    else {
      const age = state.lastSuccess ? Date.now() - state.lastSuccess : Infinity;
      if (age > 15000) refreshPrices(); else scheduleNextPoll();
      updateStatus(); updateStatusLine();
    }
  });

  // 1 s heartbeat for the countdown; cheaper housekeeping every 30 s
  let beat = 0;
  setInterval(() => {
    if (document.hidden) return;
    updateStatusLine();
    if (++beat % 30 === 0) { updateStatus(); updateTickLabels(); }
  }, 1000);
  initSheetDrag();
}

// ── INITIALIZE ──
function init() {
  updateThemeButton(currentTheme());
  loadWatchlist();
  const u = parseUrl();
  state.activeCategory = u.cat; state.searchQuery = u.q; state.sortBy = u.sort;
  lastAppliedSig = JSON.stringify(u);

  hydrateFromCache();
  bindEvents();
  syncControls();
  renderAllCards();
  renderFxTicker();
  renderSummary();
  updateStatus();
  updateStatusLine();
  if (u.chart) openChart(u.chart, { fromUrl: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutAllSegmented);
  requestAnimationFrame(layoutAllSegmented);
  refreshPrices();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
