// node scripts/fetch-prices.js [outDir]  ->  <outDir>/prices.json
// Exits non-zero (so the workflow keeps the last good snapshot) if too few quotes came back.
const fs = require('fs');
const path = require('path');
const { buildPrices } = require('./build-prices');

(async () => {
  const out = path.resolve(process.argv[2] || 'data');
  const { symbols, snapshot } = await buildPrices();
  const got = Object.keys(snapshot.quotes).length;
  const missing = symbols.filter(s => !snapshot.quotes[s]);
  console.log(`quotes ${got}/${symbols.length}`, missing.length ? `missing: ${missing.join(', ')}` : '');
  if (got < Math.ceil(symbols.length * 0.7) || !snapshot.quotes['USDINR=X']) {
    console.error('Too few quotes (or no USD/INR); not publishing.');
    process.exit(1);
  }
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'prices.json'), JSON.stringify(snapshot));
  console.log('wrote', path.join(out, 'prices.json'));
})();
