// Reads the commodity list straight from app.js so there is one source of truth.
const fs = require('fs');
const path = require('path');

function loadSymbols() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8').split('// ── STATE')[0];
  const syms = new Set(['USDINR=X']);
  for (const m of src.matchAll(/yahooSymbol:\s*'([^']+)'/g)) syms.add(m[1]);
  for (const m of src.matchAll(/yahooFallbacks:\s*\[([^\]]*)\]/g)) for (const x of m[1].matchAll(/'([^']+)'/g)) syms.add(x[1]);
  const list = [...syms].sort();
  if (list.length < 20) throw new Error(`Only found ${list.length} symbols in app.js, refusing to continue`);
  return list;
}

module.exports = { loadSymbols };
