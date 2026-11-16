// A/R + A/P rebuild (16 Nov): read all six aging reports in full, exactly through the endpoints the screen calls
// (captured by probe.mjs), at one location's zone, for as-of TODAY (that zone's calendar day) and 2026-09-30,
// scope "all" (no locations param = All locations, as the screen sends it) and "own" (locations=<this location>).
// Usage: TZ=<zone> node collect.mjs HD|LE      Raw -> /tmp/cln/arap/<KEY>/<asOf>/<scope>/<slug>.json (business data, never committed)
// SECRET-FREE: own quick-login session (never shared with another script, playbook 16 Nov); nothing secret printed or saved.
import fs from 'fs';
import { boot, LOC, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const KEY = process.argv[2]; const loc = LOC[KEY]; if (!loc) throw new Error('HD|LE');
const EV = new URL('../evidence/', import.meta.url).pathname; const API = 'https://api.staging.shopview.com/api';
const { browser, page } = await boot(loc); const log = { start: await rule99(page, loc), reads: [] };
const today = new Intl.DateTimeFormat('en-CA', { timeZone: loc.tz }).format(new Date());
async function get(p) {
  for (let i = 0; i < 4; i++) {
    const r = await page.evaluate(async ([A, p]) => { try { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: r.status, j: await r.json().catch(() => null) }; } catch (e) { return { s: 0, e: String(e) }; } }, [API, p]);
    if (r.s === 200) return r; if (r.s && r.s < 500) { log.reads.push({ p, s: r.s, err: JSON.stringify(r.j).slice(0, 200) }); return r; }
    await new Promise(z => setTimeout(z, 2000 * (i + 1)));
  }
  throw new Error('failed ' + p);
}
const q = o => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
for (const asOf of [today, '2026-09-30']) for (const scope of ['all', 'own']) {
  const dir = `/tmp/cln/arap/${KEY}/${asOf}/${scope}/`; fs.mkdirSync(dir, { recursive: true });
  const base = { asOfDate: asOf, timezone: loc.tz, locations: scope === 'own' ? loc.id : undefined };
  for (const slug of ['ar-aging-summary', 'ap-aging-summary']) {   // pages of 1000 (accepted, probe)
    let rows = [], pg = 1, last; do { last = await get(`/reporting/reports/${slug}?${q({ ...base, 'pagination[page]': pg, 'pagination[rowsPerPage]': 1000 })}`); rows = rows.concat(last.j.data.collection); pg++; } while (rows.length < last.j.data.pagination.rowsNumber && last.j.data.collection.length);
    fs.writeFileSync(dir + slug + '.json', JSON.stringify({ base, totals: last.j.data.totals, rowsNumber: last.j.data.pagination.rowsNumber, collection: rows }));
    log.reads.push({ asOf, scope, slug, rows: rows.length, rowsNumber: last.j.data.pagination.rowsNumber });
  }
  for (const [slug, rowsSlug] of [['ar-aging-detail', 'ar-aging-detail'], ['ap-aging-detail', 'ap-aging-detail']]) {
    const g = await get(`/reporting/reports/${slug}?${q(base)}`); const out = { base, groups: g.j.data.groups, totals: g.j.data.totals, rows: {} };
    for (const grp of g.j.data.groups) { let rows = [], pg = 1, last; while (rows.length < grp.rowsNumber) { last = await get(`/reporting/reports/${rowsSlug}/buckets/${grp.bucket}/rows?${q({ ...base, 'pagination[page]': pg, 'pagination[rowsPerPage]': 100 })}`); if (!last.j?.data?.collection?.length) break; rows = rows.concat(last.j.data.collection); pg++; } out.rows[grp.bucket] = rows; }
    fs.writeFileSync(dir + slug + '.json', JSON.stringify(out)); log.reads.push({ asOf, scope, slug, groups: g.j.data.groups.map(x => [x.bucket, x.rowsNumber, Object.keys(out.rows).includes(x.bucket) ? out.rows[x.bucket].length : 0]) });
  }
  for (const slug of ['ar-aging-collection', 'ap-unpaid-invoices']) {   // 30 groups per page (server cap, probe)
    let groups = [], pg = 1, last; do { last = await get(`/reporting/reports/${slug}?${q({ ...base, 'pagination[page]': pg, 'pagination[rowsPerPage]': 30 })}`); groups = groups.concat(last.j.data.collection); pg++; } while (groups.length < last.j.data.pagination.rowsNumber && last.j.data.collection.length);
    fs.writeFileSync(dir + slug + '.json', JSON.stringify({ base, totals: last.j.data.totals, rowsNumber: last.j.data.pagination.rowsNumber, collection: groups }));
    log.reads.push({ asOf, scope, slug, groups: groups.length, rowsNumber: last.j.data.pagination.rowsNumber, groups_short: groups.filter(x => x.rows.length !== x.rowsNumber).length });
  }
  for (const slug of ['ar-aging-summary', 'ap-aging-summary']) { const l = await get(`/reporting/reports/${slug}/locations?${q({ asOfDate: asOf, timezone: loc.tz })}`); fs.writeFileSync(dir + slug + '-locations.json', JSON.stringify(l.j?.data)); }
  console.log(KEY, asOf, scope, 'done', new Date().toISOString());
}
log.end = await rule99(page, loc); log.today = today; save(EV + `collect-${KEY}.json`, log); await browser.close();
