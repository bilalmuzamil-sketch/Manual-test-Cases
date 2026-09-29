// Which of the terms these 110 cases tell the tester to type actually return anything on staging?
import fs from 'node:fs';
import https from 'node:https';
const C = JSON.parse(fs.readFileSync('/tmp/staging/cookies.json', 'utf8'));
const CK = ['sv_sso_session','PHPSESSID','cf_clearance'].filter(k=>C[k]).map(k=>`${k}=${C[k]}`).join('; ');
const agent = new https.Agent({ ca: fs.readFileSync('/root/.ccr/ca-bundle.crt') });
const search = q => new Promise((res, rej) => {
  const r = https.request({ host: C.api, path: '/api/search?q=' + encodeURIComponent(q), agent,
    headers: { Cookie: CK, Accept: 'application/json', 'User-Agent': 'Mozilla/5.0', Referer: `https://${C.host}/` } },
    x => { let b = ''; x.on('data', d => b += d); x.on('end', () => { try { res({ s: x.statusCode, j: JSON.parse(b) }); } catch { res({ s: x.statusCode, j: null }); } }); });
  r.on('error', rej); r.end();
});
const cs = JSON.parse(fs.readFileSync('cases-110.json', 'utf8'));
const byTerm = {};
for (const c of cs) if (c.term) (byTerm[c.term] ||= []).push(c.case_id);
const missing = [], thin = [], ok = [];
for (const [term, ids] of Object.entries(byTerm)) {
  const { s, j } = await search(term);
  const groups = s === 200 ? Object.fromEntries(((j.data || {}).groups || []).filter(g => (g.items || []).length).map(g => [g.type, g.items.length])) : null;
  const total = groups ? Object.values(groups).reduce((a, b) => a + b, 0) : 0;
  const rec = { term, cases: ids.length, ids, total, groups };
  if (s !== 200) { missing.push({ ...rec, http: s }); }
  else if (total === 0) missing.push(rec);
  else if (total < 2) thin.push(rec); else ok.push(rec);
}
console.log(`terms returning NOTHING on staging: ${missing.length} (covering ${missing.reduce((a, r) => a + r.cases, 0)} cases)`);
for (const m of missing.sort((a, b) => b.cases - a.cases)) console.log(`   ${JSON.stringify(m.term).padEnd(42)} ${m.cases} case(s)`);
console.log(`\nterms returning only ONE row (may not be enough - several cases need two to compare): ${thin.length}`);
for (const m of thin) console.log(`   ${JSON.stringify(m.term).padEnd(42)} ${m.cases} case(s)  ${JSON.stringify(m.groups)}`);
console.log(`\nterms with data: ${ok.length} (covering ${ok.reduce((a, r) => a + r.cases, 0)} cases)`);
for (const m of ok.sort((a, b) => b.cases - a.cases).slice(0, 8)) console.log(`   ${JSON.stringify(m.term).padEnd(42)} ${m.cases} case(s)  ${JSON.stringify(m.groups)}`);
fs.writeFileSync('datacheck.json', JSON.stringify({ missing, thin, ok }, null, 1));
