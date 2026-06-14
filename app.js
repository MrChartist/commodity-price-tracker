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
    intlUnit: 'Metric Ton',
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
let state = {
  usdInr: null,
  usdInrChange: null,
  usdInrChangePct: null,
  fxRates: null,    // { INR: 88.1, CAD: 1.36, ... } per 1 USD — for non-USD quotes (e.g. canola in CAD)
  prices: {},       // { gold: { price, change, changePct }, ... }
  lastUpdate: null, // Date of the data currently shown (may be from cache)
  lastSuccess: null,// epoch ms of the last successful live fetch
  fromCache: false, // true while showing persisted prices before the first live refresh
  isLoading: true,
  errors: {},
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
};

// Escape user-supplied text before it touches innerHTML (search query echo)
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Convert a foreign-currency amount to USD using the live FX rate map
// (rates are quoted per 1 USD, e.g. fxRates.CAD = CAD per USD).
function toUsd(amount, currency) {
  const cur = (currency || 'USD').toUpperCase();
  if (cur === 'USD') return amount;
  if (cur === 'USX' || cur === 'USDX') return amount / 100;          // US cents
  if (cur === 'GBX' || cur === 'GBP_PENCE') return amount / 100;     // pence (then GBP below if needed)
  const rate = state.fxRates && state.fxRates[cur];
  return rate ? amount / rate : amount; // no rate → assume already USD-ish
}

// ── PRICE PERSISTENCE CACHE (localStorage) ──
// Mirrors the chart cache: persist the last good prices + FX so a reload paints
// instantly, and a total network outage still shows the last known values
// (clearly flagged) instead of an empty "Loading…" grid.
const PRICE_CACHE_KEY = 'cpt_prices_v1';
const PRICE_STALE_MS = 10 * 60 * 1000; // data older than 10 min is flagged stale

function savePriceCache() {
  try {
    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({
      ts: Date.now(),
      prices: state.prices,
      usdInr: state.usdInr,
      usdInrChange: state.usdInrChange,
      usdInrChangePct: state.usdInrChangePct,
      fxRates: state.fxRates,
    }));
  } catch (e) { /* quota / private mode — ignore */ }
}

function hydrateFromCache() {
  try {
    const raw = localStorage.getItem(PRICE_CACHE_KEY);
    if (!raw) return false;
    const c = JSON.parse(raw);
    if (!c || !c.prices || !Object.keys(c.prices).length) return false;
    state.prices = c.prices;
    state.usdInr = c.usdInr ?? null;
    state.usdInrChange = c.usdInrChange ?? null;
    state.usdInrChangePct = c.usdInrChangePct ?? null;
    state.fxRates = c.fxRates ?? null;
    state.lastUpdate = c.ts ? new Date(c.ts) : null;
    state.fromCache = true;
    state.isLoading = false;
    return true;
  } catch (e) { return false; }
}

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
    // Normalize every quote to USD. Yahoo flags US-cents contracts (CBOT grains,
    // ICE softs, livestock) as currency "USX"; canola (RS=F) is quoted in CAD.
    const currency = meta.currency;
    const price = toUsd(meta.regularMarketPrice, currency);
    const prevCloseRaw = meta.chartPreviousClose || meta.previousClose;
    const prevClose = prevCloseRaw ? toUsd(prevCloseRaw, currency) : null;
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
        return { rate: data.rates.INR, rates: data.rates, source: 'ExchangeRate API' };
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

// ── SPOT BACKUP: gold-api.com (free, no key, CORS-enabled — no proxy needed) ──
// Used when Yahoo fails for precious metals. Returns spot only (no change data).
const GOLD_API_SYMBOLS = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',
};

async function fetchGoldApiSpot(commodityKey) {
  const sym = GOLD_API_SYMBOLS[commodityKey];
  if (!sym) return null;
  try {
    const resp = await fetch(`https://api.gold-api.com/price/${sym}`, { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data?.price) return { price: data.price, change: 0, changePct: 0, isSpotBackup: true };
  } catch (e) {
    console.warn(`gold-api.com failed for ${sym}:`, e.message);
  }
  return null;
}

// ── INDICATIVE PRICES (no free live feed exists) ──
// metals.live shut down; Yahoo has no usable futures for LME base metals
// (ZN=F is the 10-yr T-Note), tin, iron ore, lithium or cobalt; canola (RS=F)
// and palm oil return empty arrays via the chart API. For these, each config
// carries an `indicative: true` flag and an `indicativePrice` in USD (per the
// commodity's intl unit), updated manually. Values are clearly badged in the UI.
const INDICATIVE_AS_OF = '2026-06-12';

function getIndicativePrices(keys) {
  const result = {};
  for (const key of keys) {
    const p = COMMODITIES[key].indicativePrice;
    if (p != null) result[key] = { price: p, change: 0, changePct: 0, isApprox: true };
  }
  return result;
}

// ── FETCH ALL COMMODITY PRICES ──
async function fetchAllPrices() {
  // Separate indicative-only and live (Yahoo-fetchable) commodities
  const commodityKeys = Object.keys(COMMODITIES);
  const yahooKeys = commodityKeys.filter(k => !COMMODITIES[k].indicative);
  const indicativeKeys = commodityKeys.filter(k => COMMODITIES[k].indicative);

  // Fetch USD/INR, Yahoo commodities, and indicative prices concurrently
  const promises = [
    fetchUsdInr(),
    ...yahooKeys.map(async (key) => {
      const config = COMMODITIES[key];
      let data = await fetchWithFallbacks(config.yahooSymbol, config.yahooFallbacks || []);
      // Last resort for precious metals: gold-api.com spot (CORS-friendly, no proxy)
      if (!data) data = await fetchGoldApiSpot(key);
      return [key, data];
    }),
    indicativeKeys.length > 0 ? Promise.resolve(getIndicativePrices(indicativeKeys)) : Promise.resolve({}),
  ];

  const results = await Promise.allSettled(promises);

  // USD/INR (+ full FX rate map for non-USD quotes like canola in CAD)
  const usdInrResult = results[0];
  if (usdInrResult.status === 'fulfilled' && usdInrResult.value) {
    state.usdInr = usdInrResult.value.rate;
    state.usdInrChange = usdInrResult.value.change || null;
    state.usdInrChangePct = usdInrResult.value.changePct || null;
    if (usdInrResult.value.rates) state.fxRates = usdInrResult.value.rates;
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

  // Indicative-only commodities
  const indicativeResult = results[1 + yahooKeys.length];
  if (indicativeResult && indicativeResult.status === 'fulfilled' && indicativeResult.value) {
    const indData = indicativeResult.value;
    for (const key of indicativeKeys) {
      if (indData[key]) {
        state.prices[key] = indData[key];
        delete state.errors[key];
      } else if (!state.prices[key]) {
        state.errors[key] = 'Unavailable';
      }
    }
  }

  // Only treat this cycle as "fresh" if we actually got the forex rate and at
  // least one price. A fully failed cycle keeps the previous (cached) data and
  // its timestamp so the UI can flag it as stale rather than pretend it's live.
  const gotData = state.usdInr != null && Object.keys(state.prices).length > 0;
  if (gotData) {
    state.fromCache = false;
    state.lastSuccess = Date.now();
    state.lastUpdate = new Date();
    savePriceCache();
  }
  state.isLoading = false;
}

// ── DUTY RESOLVER (supports date-conditional duty schedules, e.g. cotton) ──
function getDuty(config) {
  if (config.dutySchedule) {
    const today = new Date().toISOString().slice(0, 10);
    for (const entry of config.dutySchedule) {
      if (!entry.until || today <= entry.until) {
        return { rate: entry.rate, label: entry.label };
      }
    }
  }
  return { rate: config.dutyRate, label: config.dutyLabel };
}

// ── CALCULATION ENGINE ──
function calcIndiaLanded(commodityKey) {
  const config = COMMODITIES[commodityKey];
  const priceData = state.prices[commodityKey];
  if (!priceData || !state.usdInr) return null;
  // No landed price for goods India prohibits importing (e.g. beef/live cattle)
  if (config.importProhibited) return null;

  const intlPrice = priceData.price;
  const usdInr = state.usdInr;
  // conversionDivisor = number of intl units per India unit
  // (oz→g: 31.1035, lb→kg: 0.453592, MT→kg: 1000, bushel→quintal: 0.2722, …)
  const pricePerIndiaUnit = (intlPrice / config.conversionDivisor) * usdInr * (1 + getDuty(config).rate);

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
function getCategoryStyle(category) {
  switch (category) {
    case 'precious':
      return 'background:hsl(45 93% 47% / 0.1);color:hsl(45,80%,40%);border:1px solid hsl(45 93% 47% / 0.2)';
    case 'industrial':
      return 'background:hsl(200 50% 50% / 0.1);color:hsl(200,50%,40%);border:1px solid hsl(200 50% 50% / 0.2)';
    case 'energy':
      return 'background:hsl(0 60% 50% / 0.1);color:hsl(0,60%,45%);border:1px solid hsl(0 60% 50% / 0.2)';
    case 'agri':
      return 'background:hsl(100 50% 40% / 0.1);color:hsl(100,50%,35%);border:1px solid hsl(100 50% 40% / 0.2)';
    default:
      return 'background:var(--l3);color:var(--t3);border:1px solid var(--sep2)';
  }
}

// ── SHARED: INDIA LANDED PRICE ROWS HTML ──
function buildLandedRowsHtml(config, landed) {
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
    if (config.secondaryUnit) {
      // e.g. grains shown per quintal also get a per-kg reference row
      html += `
        <div class="price-row">
          <span class="price-label">Per ${config.secondaryUnit.label}</span>
          <span class="price-value">${fmtINR(landed.perUnit * config.secondaryUnit.multiplier)}/${config.secondaryUnit.label}</span>
        </div>`;
    }
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
  return html;
}

// ── BUILD COMMODITY CARD HTML ──
function buildCommodityCard(key) {
  const config = COMMODITIES[key];
  const priceData = state.prices[key];
  const landed = calcIndiaLanded(key);
  const hasData = priceData && state.usdInr;
  const isApprox = priceData?.isApprox || false;
  const change = hasData ? fmtChange(priceData.change, priceData.changePct) : fmtChange(null);

  // International price display
  const intlPriceStr = hasData ? fmtUSD(priceData.price) : '—';
  const intlUnit = `/ ${config.intlUnit.toLowerCase()}`;
  const approxBadge = isApprox
    ? ' <span style="font-size:9px;color:var(--orange);font-family:var(--font-body);font-weight:600;vertical-align:super">~INDICATIVE</span>'
    : (priceData?.isSpotBackup ? ' <span style="font-size:9px;color:var(--teal);font-family:var(--font-body);font-weight:600;vertical-align:super">SPOT</span>' : '');

  // India landed price rows
  let landedRows = '';
  if (config.importProhibited) {
    landedRows = `
      <div class="price-row">
        <span class="price-label" style="color:var(--red);font-weight:700">Import prohibited in India</span>
        <span class="price-value" style="color:var(--red);font-size:12px">DGFT</span>
      </div>`;
  } else if (hasData && landed) {
    landedRows = buildLandedRowsHtml(config, landed);
  } else {
    landedRows = `
      <div class="price-row">
        <span class="price-label">Loading...</span>
        <span class="price-value"><div class="skeleton skeleton-text"></div></span>
      </div>`;
  }

  // Optional caveat note (e.g. US-benchmark premium, live-weight livestock)
  const noteHtml = config.note
    ? `<div style="font-size:9.5px;color:var(--t4);font-style:italic;line-height:1.4;margin-top:8px;padding-top:6px;border-top:1px dashed var(--sep2)">${config.note}</div>`
    : '';

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
          <span class="commodity-category-badge" style="${getCategoryStyle(config.category)}">${config.categoryLabel}</span>
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
            <span class="india-duty-badge">${getDuty(config).label}</span>
          </div>
          <div id="landed-${key}">
            ${landedRows}
          </div>
          ${noteHtml}
        </div>
      </div>

      <div class="data-source">
        <span>Source: ${isApprox ? `Indicative (as of ${INDICATIVE_AS_OF})` : priceData?.isSpotBackup ? 'gold-api.com (spot)' : 'Yahoo Finance (' + (config.yahooSymbol || 'N/A') + ')'}</span>
        ${config.yahooSymbol ? `<button class="chart-btn" onclick="event.stopPropagation();openChart('${key}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Chart</button>` : ''}
        <span id="tick-${key}">${state.lastUpdate ? fmtTime(state.lastUpdate) : '—'}</span>
      </div>
    </div>`;
}

// ── LIVE FX TICKER ──
// The engine converts every quote to ₹ via USD/INR (and a full FX map for the
// handful of non-USD contracts). Surface those rates so the conversion the user
// is looking at is transparent rather than a hidden constant.
const FX_TICKER_PAIRS = ['EUR', 'GBP', 'JPY', 'CNY', 'AED'];

function renderFxTicker() {
  const el = document.getElementById('currency-rates');
  if (!el) return;
  if (!state.usdInr) {
    el.innerHTML = '<div class="currency-item"><span class="fx-pair">USD / INR</span><span class="fx-rate">—</span></div>';
    return;
  }
  const pct = state.usdInrChangePct;
  const cls = pct == null ? '' : (pct > 0 ? 'up' : pct < 0 ? 'down' : '');
  const changeStr = pct == null ? '' :
    `<span class="fx-change ${cls}">${pct >= 0 ? '▲' : '▼'} ${Math.abs(pct).toFixed(2)}%</span>`;
  let html = `
    <div class="currency-item" style="border-color:hsl(24 90% 52% / 0.25)">
      <span class="fx-pair">USD / INR</span>
      <span class="fx-rate" style="color:var(--primary)">₹${state.usdInr.toFixed(2)}</span>
      ${changeStr}
    </div>`;
  if (state.fxRates) {
    for (const cur of FX_TICKER_PAIRS) {
      const r = state.fxRates[cur];
      if (r == null) continue;
      const val = cur === 'JPY' ? r.toFixed(2) : r.toFixed(3);
      html += `
        <div class="currency-item">
          <span class="fx-pair">USD / ${cur}</span>
          <span class="fx-rate">${val}</span>
        </div>`;
    }
  }
  el.innerHTML = html;
}

// ── VISIBLE KEYS (category filter + text search + sort) ──
function getVisibleKeys() {
  const q = (state.searchQuery || '').trim().toLowerCase();
  const keys = Object.keys(COMMODITIES).filter(key => {
    const c = COMMODITIES[key];
    if (state.activeCategory !== 'all' && c.category !== state.activeCategory) return false;
    if (q) {
      const hay = `${c.name} ${c.symbol} ${c.categoryLabel} ${key}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const pctOf = k => {
    const p = state.prices[k];
    return p && typeof p.changePct === 'number' ? p.changePct : 0;
  };
  if (state.sortBy === 'az') keys.sort((a, b) => COMMODITIES[a].name.localeCompare(COMMODITIES[b].name));
  else if (state.sortBy === 'gainers') keys.sort((a, b) => pctOf(b) - pctOf(a));
  else if (state.sortBy === 'losers') keys.sort((a, b) => pctOf(a) - pctOf(b));
  return keys;
}

// ── RENDER ALL CARDS ──
let cardsAnimatedOnce = false;
function renderAllCards() {
  const grid = document.getElementById('commodity-grid');
  if (!grid) return;
  const keys = getVisibleKeys();

  if (!keys.length) {
    grid.classList.add('ready');
    grid.innerHTML = `<div class="empty-state">No commodities match “<strong>${escapeHtml(state.searchQuery)}</strong>”. <button class="link-btn" onclick="clearSearch()">Clear search</button></div>`;
    return;
  }

  grid.innerHTML = keys.map(key => buildCommodityCard(key)).join('');

  // Play the staggered entry animation only on the first paint; later re-renders
  // (search keystrokes, category/sort changes) snap in to avoid flicker.
  if (cardsAnimatedOnce) grid.classList.add('ready');
  else cardsAnimatedOnce = true;
}

// ── SEARCH / SORT CONTROLS ──
function filterSearch(value) {
  state.searchQuery = value || '';
  renderAllCards();
}
window.filterSearch = filterSearch;

function clearSearch() {
  state.searchQuery = '';
  const input = document.getElementById('commodity-search');
  if (input) input.value = '';
  renderAllCards();
}
window.clearSearch = clearSearch;

function setSortBy(value) {
  state.sortBy = value || 'default';
  renderAllCards();
}
window.setSortBy = setSortBy;

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
      landedEl.innerHTML = buildLandedRowsHtml(config, landed);
    }

    // Tick time
    const tickTimeEl = document.getElementById(`tick-${key}`);
    if (tickTimeEl && state.lastUpdate) {
      tickTimeEl.textContent = fmtTime(state.lastUpdate);
    }
  });

  // Live FX ticker + status pill
  renderFxTicker();
  updateStatus();
}

// ── STATUS ──
function updateStatus() {
  const pill = document.getElementById('status-pill');
  const text = document.getElementById('status-text');
  if (!pill || !text) return;

  const hasAnyData = Object.keys(state.prices).length > 0;
  const errCount = Object.keys(state.errors).length;
  const age = state.lastSuccess ? Date.now() - state.lastSuccess : Infinity;

  if (state.isLoading && !hasAnyData) {
    pill.className = 'status-pill err';
    text.textContent = 'LOADING';
  } else if (!hasAnyData) {
    pill.className = 'status-pill err';
    text.textContent = 'OFFLINE';
  } else if (state.fromCache) {
    pill.className = 'status-pill err';
    text.textContent = 'CACHED';
  } else if (age > PRICE_STALE_MS) {
    pill.className = 'status-pill err';
    text.textContent = 'STALE';
  } else if (errCount > 0) {
    pill.className = 'status-pill err';
    text.textContent = `PARTIAL (${errCount} ERR)`;
  } else {
    pill.className = 'status-pill';
    text.textContent = 'LIVE';
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

// ── AUTO-POLL (visibility-aware) ──
// Yahoo rate-limits aggressive polling and each cycle fetches ~21 live symbols
// through shared CORS proxies, so we poll every 60s — and only while the tab is
// visible. Hidden tabs pause; returning to the tab refreshes immediately.
const POLL_INTERVAL_MS = 60000;
let pollTimer = null;

function startPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(async () => {
    await fetchAllPrices();
    updateCards();
  }, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}

document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    stopPolling();
  } else {
    await fetchAllPrices();
    updateCards();
    startPolling();
  }
});

// ── INITIALIZE ──
async function init() {
  // Load theme preference
  const savedTheme = localStorage.getItem('commodity-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  // Parse URL for categories (deep linking from docs)
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && ['precious', 'industrial', 'energy', 'agri', 'all'].includes(cat)) {
    state.activeCategory = cat;
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.cat === cat);
    });
  }

  // Paint last-known prices from cache immediately (instant load, no "Loading…"
  // flash, and a working view even if the network is down), then refresh live.
  hydrateFromCache();
  renderAllCards();
  renderFxTicker();

  await fetchAllPrices();
  renderAllCards();
  updateCards();

  // Don't spin the poll loop in a background tab; the visibility handler starts
  // it (and refreshes) the moment the user actually looks at the page.
  if (!document.hidden) startPolling();
}

// Start!
document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════════════
//  TRADINGVIEW LIGHTWEIGHT CHARTS — COMEX HISTORICAL
// ═══════════════════════════════════════════════════════════════════════

let chartInstance = null;
let chartSeries = null;
let chartResizeObserver = null;
let currentChartKey = null;
let currentRange = '1y';

function getChartSymbol(key) {
  // LME-only metals (zinc/nickel/lead) have no valid Yahoo futures symbol —
  // ZN=F is the 10-yr T-Note, NOT zinc — so no chart fallback for them.
  return COMMODITIES[key]?.yahooSymbol || null;
}

// ── CHART DATA CACHE (localStorage) ──
// Yahoo's chart endpoint is flaky through CORS proxies and rate-limits hard.
// Cache each symbol+range series so charts open instantly and survive a failed
// refetch by falling back to the last good (stale) copy.
const CHART_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function readChartCache(symbol, range) {
  try {
    const raw = localStorage.getItem(`cpt_chart_${symbol}_${range}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data) || !parsed.data.length) return null;
    return { data: parsed.data, fresh: (Date.now() - parsed.ts) < CHART_CACHE_TTL_MS };
  } catch (e) { return null; }
}

function writeChartCache(symbol, range, data) {
  try {
    localStorage.setItem(`cpt_chart_${symbol}_${range}`, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) { /* quota / private mode — ignore */ }
}

async function fetchHistoricalData(symbol, range) {
  // Serve a fresh cached series immediately if we have one
  const cached = readChartCache(symbol, range);
  if (cached && cached.fresh) return cached.data;

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

      if (ohlcData.length) {
        writeChartCache(symbol, range, ohlcData);
        return ohlcData;
      }
    } catch (e) { /* try next proxy */ }
  }
  // All proxies failed — fall back to stale cache if we have any
  return cached ? cached.data : null;
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
  const exchange = config.exchange || 'Futures';
  document.getElementById('chart-title').textContent = `${config.name} — ${exchange} Historical`;
  document.getElementById('chart-sub').textContent = `${config.yahooSymbol || key.toUpperCase()} · ${exchange} Futures`;

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

  // Destroy previous chart + its resize observer (otherwise observers stack up
  // on the reused container every time the range changes — a slow leak).
  if (chartResizeObserver) {
    chartResizeObserver.disconnect();
    chartResizeObserver = null;
  }
  if (chartInstance) {
    chartInstance.remove();
    chartInstance = null;
  }

  const symbol = getChartSymbol(key);
  if (!symbol) {
    container.innerHTML = '<div class="chart-loading">Live chart is unavailable for indicative-priced commodities</div>';
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

  // Resize handler (tracked at module scope so it can be disconnected on the
  // next render / close instead of leaking a new observer each time).
  chartResizeObserver = new ResizeObserver(() => {
    if (chartInstance) {
      chartInstance.applyOptions({ width: container.clientWidth, height: container.clientHeight });
    }
  });
  chartResizeObserver.observe(container);
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
  if (chartResizeObserver) {
    chartResizeObserver.disconnect();
    chartResizeObserver = null;
  }
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
