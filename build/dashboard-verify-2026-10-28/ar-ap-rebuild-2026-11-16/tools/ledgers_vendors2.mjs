// Follow-up to ledgers.mjs: 152 vendors answer no vendor_account_id when looked up at Heavy Duty (vendor records are location-
// scoped; the 28 Oct collector also switched location per vendor). For every location: switch the session there, look the missing
// vendors up again, and read each found vendor's Unpaid list there. Usage: TZ=Asia/Karachi node ledgers_vendors2.mjs  SECRET-FREE.
import fs from 'fs';
import { boot, LOC, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const EV = new URL('../evidence/', import.meta.url).pathname; const API = 'https://api.staging.shopview.com/api'; const O = '/tmp/cln/arap/ledgers/';
const loc = LOC.HD; const { browser, page } = await boot(loc); const log = { start: await rule99(page, loc), steps: [] };
const get = p => page.evaluate(async ([A, p]) => { for (let i = 0; i < 4; i++) { try { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); if (r.status >= 500) { await new Promise(z => setTimeout(z, 1500 * (i + 1))); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } catch (e) { await new Promise(z => setTimeout(z, 1500)); } } return { s: 0 }; }, [API, p]);
const post = (p, b) => page.evaluate(async ([A, p, b]) => (await fetch(A + p, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(b) })).status, [API, p, b]);
async function pool(items, n, fn) { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } })); }
const A = JSON.parse(fs.readFileSync(O + 'accounts.json')); const missing = process.env.ALL ? Object.keys(A.vacc) : Object.entries(A.vacc).filter(([, a]) => !a).map(([v]) => v);   // ALL=1: every vendor, account resolved per location
const tzOf = { [LOC.HD.id]: 'Asia/Karachi', [LOC.LE.id]: 'America/Edmonton', [LOC.QB.id]: 'America/Vancouver', [LOC.DVI.id]: 'Pacific/Fiji' };
const wps = fs.readdirSync(O).filter(d => /^[0-9a-f-]{36}$/.test(d)); const found = {};
for (const wid of wps) {
  const st = await post('/iam/change-location', { workplace_id: wid, workplace_timezone: tzOf[wid] || 'America/Edmonton' }); let n = 0;
  await pool(missing, 8, async vid => {
    const v = await get(`/parts-catalogue/vendor/${vid}`); const acc = v.j?.data?.vendor?.vendor_account_id; if (!acc) return;
    found[vid] = acc; let rows = [], pg = 1, r; do { r = await get(`/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId=${acc}&pagination[page]=${pg}&pagination[rowsPerPage]=500`); const resp = r.j?.data?.response || r.j?.data || {}; const c = resp.collection || []; rows = rows.concat(c); pg++; if (c.length < 500) break; } while (true);
    fs.writeFileSync(`${O}${wid}/v_${vid}.json`, JSON.stringify({ vid, acc, s: r.s, rows, resolved_at: wid })); n++;
  });
  log.steps.push({ wid, change_location: st, vendors_resolved_here: n }); console.log(JSON.stringify(log.steps.at(-1)));
}
await post('/iam/change-location', { workplace_id: loc.id, workplace_timezone: loc.tz });
log.still_missing = missing.filter(v => !found[v]).map(v => A.vend[v]); log.resolved = Object.keys(found).length;
log.end = await rule99(page, loc); save(EV + (process.env.ALL ? 'ledgers-vendors-all.json' : 'ledgers-vendors2.json'), log); console.log('done', log.resolved, log.still_missing.length); await browser.close();
