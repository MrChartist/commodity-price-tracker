// Open interest and positioning from the CFTC Commitments of Traders report
// (Disaggregated, Futures Only). Weekly: positions as of Tuesday, published Friday.
// Only contracts that match the instrument we price are mapped; anything else gets no OI.
const { getJson } = require('./yahoo');

const CFTC = {
  'GC=F': '088691', 'SI=F': '084691', 'PL=F': '076651', 'PA=F': '075651',
  'HG=F': '085692', 'HRC=F': '192651',
  'CL=F': '067651', 'BZ=F': '06765T', 'NG=F': '023651',
  'ZW=F': '001602', 'ZC=F': '002602', 'ZS=F': '005602', 'ZL=F': '007601', 'ZM=F': '026603', 'ZR=F': '039601',
  'SB=F': '080732', 'CT=F': '033661', 'KC=F': '083731', 'CC=F': '073732', 'OJ=F': '040701',
  'LBR=F': '058644', 'HE=F': '054642', 'LE=F': '057642',
};

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : null; };

async function buildOi() {
  const codes = [...new Set(Object.values(CFTC))];
  const since = new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10);
  const where = encodeURIComponent(`cftc_contract_market_code in(${codes.map(c => `'${c}'`).join(',')}) AND report_date_as_yyyy_mm_dd>'${since}'`);
  const select = 'cftc_contract_market_code,report_date_as_yyyy_mm_dd,open_interest_all,m_money_positions_long_all,m_money_positions_short_all';
  const rows = await getJson(`https://publicreporting.cftc.gov/resource/72hh-3qpy.json?$select=${select}&$where=${where}&$order=report_date_as_yyyy_mm_dd%20DESC&$limit=500`, 20000);

  const byCode = {};
  for (const r of rows) (byCode[r.cftc_contract_market_code.trim()] ||= []).push(r);
  const items = {};
  let reportDate = null;
  for (const [sym, code] of Object.entries(CFTC)) {
    const list = byCode[code];
    if (!list || !list.length) continue;
    const [cur, prev] = list; // newest first
    const oi = num(cur.open_interest_all);
    if (oi == null) continue;
    const date = cur.report_date_as_yyyy_mm_dd.slice(0, 10);
    if (!reportDate || date > reportDate) reportDate = date;
    const long = num(cur.m_money_positions_long_all), short = num(cur.m_money_positions_short_all);
    items[sym] = {
      oi,
      prevOi: prev ? num(prev.open_interest_all) : null,
      mmNet: long != null && short != null ? long - short : null,
      date,
    };
  }
  return { ts: Date.now(), reportDate, source: 'CFTC Commitments of Traders (Disaggregated, Futures Only)', items };
}

module.exports = { buildOi, CFTC };
