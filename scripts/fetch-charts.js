// node scripts/fetch-charts.js [outDir]  ->  <outDir>/charts/<SYMBOL>.json
const fs = require('fs');
const path = require('path');
const { buildChart } = require('./build-charts');
const { loadSymbols } = require('./symbols');

(async () => {
  const out = path.resolve(process.argv[2] || 'data', 'charts');
  fs.mkdirSync(out, { recursive: true });
  const symbols = loadSymbols().filter(s => s !== 'USDINR=X');
  let ok = 0;
  for (const sym of symbols) {
    try { fs.writeFileSync(path.join(out, `${sym}.json`), JSON.stringify(await buildChart(sym))); ok++; }
    catch (e) { console.warn('skip', sym, e.message); }
  }
  console.log(`charts ${ok}/${symbols.length}`);
  if (ok < Math.ceil(symbols.length * 0.7)) process.exit(1);
})();
