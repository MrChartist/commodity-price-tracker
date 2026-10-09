// node scripts/fetch-oi.js [outDir]  ->  <outDir>/oi.json
const fs = require('fs');
const path = require('path');
const { buildOi, CFTC } = require('./build-oi');

(async () => {
  const out = path.resolve(process.argv[2] || 'data');
  const oi = await buildOi();
  const got = Object.keys(oi.items).length;
  console.log(`open interest ${got}/${Object.keys(CFTC).length}, report date ${oi.reportDate}`);
  if (got < Math.ceil(Object.keys(CFTC).length * 0.6)) { console.error('Too few OI rows; not publishing.'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'oi.json'), JSON.stringify(oi));
})();
