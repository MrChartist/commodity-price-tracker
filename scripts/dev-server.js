// Local dev server: `npm run dev`. Serves the static site and generates the same live data
// files the GitHub Action publishes (/data/prices.json, /data/charts/<SYMBOL>.json) on demand.
const http = require('http'), fs = require('fs'), path = require('path'), url = require('url');
const { buildPrices } = require('./build-prices');
const { buildChart } = require('./build-charts');
const { buildOi } = require('./build-oi');
const { SYMBOL_RE } = require('./yahoo');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const isFile = f => fs.existsSync(f) && fs.statSync(f).isFile();
const json = (res, code, body) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.setHeader('cache-control', 'no-store'); res.end(JSON.stringify(body)); };

let pricesCache = { at: 0, body: null };
let oiCache = { at: 0, body: null };
const chartCache = new Map();

http.createServer(async (req, res) => {
  const u = url.parse(req.url, true);
  try {
    if (u.pathname === '/data/prices.json') {
      if (Date.now() - pricesCache.at > 20000) pricesCache = { at: Date.now(), body: (await buildPrices()).snapshot };
      return json(res, 200, pricesCache.body);
    }
    if (u.pathname === '/data/oi.json') {
      if (Date.now() - oiCache.at > 3600000) oiCache = { at: Date.now(), body: await buildOi() };
      return json(res, 200, oiCache.body);
    }
    const m = u.pathname.match(/^\/data\/charts\/([^/]+)\.json$/);
    if (m) {
      const sym = decodeURIComponent(m[1]).toUpperCase();
      if (!SYMBOL_RE.test(sym)) return json(res, 400, { error: 'bad symbol' });
      const hit = chartCache.get(sym);
      if (!hit || Date.now() - hit.at > 900000) chartCache.set(sym, { at: Date.now(), body: await buildChart(sym) });
      return json(res, 200, chartCache.get(sym).body);
    }
  } catch (e) { return json(res, 502, { error: 'upstream unavailable' }); }

  // Static files, mirroring GitHub Pages: clean URLs and 404.html for unknown paths.
  const clean = u.pathname === '/' ? '/index.html' : u.pathname;
  // Only serve site files: no dot-paths (.git), no scripts/, nothing outside the repo.
  if (/\/\.|^\/(scripts|node_modules)\//.test(clean)) { res.statusCode = 404; return res.end('not found'); }
  let f = path.join(root, clean);
  if (!isFile(f) && isFile(f + '.html')) f += '.html';
  if (!f.startsWith(root + path.sep) || !isFile(f)) {
    res.statusCode = 404; res.setHeader('content-type', 'text/html');
    return res.end(fs.readFileSync(path.join(root, '404.html')));
  }
  res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream');
  res.end(fs.readFileSync(f));
}).listen(process.env.PORT || 3000, '127.0.0.1', () => console.log('Dev server: http://localhost:' + (process.env.PORT || 3000) + '  (static files + live data, like GitHub Pages + Actions)'));
