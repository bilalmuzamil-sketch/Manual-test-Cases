/** prod-ga-referrer-1027.mts — 27 Oct 2026, PRODUCTION (source prod-env.sh). SV-11722 re-check after Mudassir Qamar's comment 79576:
 *  "dl fixed, but dr (page referrer) still carries the search". C97027 on sv11500 (26 Oct) typed ONE search, so the referrer
 *  was the clean /workorders and could not show it. Here: (A) one search then Tech View (our 26 Oct path, control);
 *  (B) Mudassir's path — a first search, then a second search, then Tech View. Every Work Orders analytics record's dl / dr / dt
 *  is read from the page's own Google Analytics requests. Positive control: the browser address holds ?search= and dl is read.
 *  Second pass the same day: every GA request is also read (allEvents), not only work_orders_*. Result EV/prod-ga-referrer-1027.json, picture EV/P-SV-11722-referrer.png. Read-only (searches only). */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done } from './session.mts'; import { EV, display, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const o: any = { at: new Date().toISOString() };
// session.mts blocks analytics by default; let Google Analytics through (as analytics-batch.mts does)
await p.context().unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
const ev: any[] = [];
await p.route(/\/g\/collect|google-analytics\.com\/.*collect/, async (route) => { const r = route.request(); const buf = r.postDataBuffer(); const body = buf ? buf.toString('utf8') : '';
  for (const l of (body ? body.split('\n') : [''])) { const q = new URLSearchParams((r.url().split('?')[1] ?? '') + '&' + l); const en = q.get('en');
    if (en) ev.push({ en, dl: q.get('dl'), dr: q.get('dr'), dt: q.get('dt'), loc: q.get('ep.element_location'), label: q.get('ep.element_label'), params: Object.fromEntries([...q.entries()].filter(([k]) => /^(ep|epn|up|upn)\./.test(k))), t: Date.now() }); }
  await route.continue().catch(() => {}); });
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const dec = (v: string | null) => v ? decodeURIComponent(v.replace(/\+/g, ' ')) : v;
const settle = async (ms = 8000) => { await p.waitForTimeout(ms); let n = ev.length, quiet = Date.now(); const end = Date.now() + 40000;
  while (Date.now() < end) { await p.waitForTimeout(1000); if (ev.length !== n) { n = ev.length; quiet = Date.now(); } else if (Date.now() - quiet >= 10000) break; } };
async function leg(name: string, terms: string[]) {
  await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await display(p, 'Board View'); await settle(4000); const n0 = ev.length; const addr: string[] = [];
  const hit = (s: string | null) => !!s && terms.some((t) => s.includes(t));
  for (const t of terms) { await search(p, t); addr.push(p.url()); }
  await display(p, 'Tech View'); await settle();
  const recs = ev.slice(n0).filter((e) => /^work_orders_/.test(e.en)).map((e) => ({ en: e.en, loc: e.loc, label: e.label, dl: dec(e.dl), dr: dec(e.dr) }));
    // 27 Oct (SV-11832): EVERY Google Analytics request, not only the work_orders_* records — Google's own page_view carries dl/dr too
  const all = ev.slice(n0).map((e) => ({ en: e.en, dl: dec(e.dl), dr: dec(e.dr), params: e.params }));
  const anyLeak = all.filter((r) => hit(r.dl) || hit(r.dr) || Object.values(r.params || {}).some((v: any) => hit(dec(String(v)))));
  const allEvents = { names: [...new Set(all.map((r) => r.en))], total: all.length, leaking: anyLeak.length, leakingByName: Object.fromEntries([...new Set(anyLeak.map((r) => r.en))].map((n) => [n, anyLeak.filter((r) => r.en === n).slice(0, 2)])) };
  o[name] = { allEvents, terms, browserAddressAfterEachSearch: addr, records: recs.length, dlWithSearch: recs.filter((r) => hit(r.dl)).length, drWithSearch: recs.filter((r) => hit(r.dr)).length,
    distinctDl: [...new Set(recs.map((r) => r.dl))], distinctDr: [...new Set(recs.map((r) => r.dr))], sample: recs.filter((r) => r.en === 'work_orders_display_view').slice(0, 3) };
}
await leg('A_oneSearch', ['ZZAUTOTEST Bravo']);
await leg('B_twoSearches', ['ZZAUTOTEST Alpha', 'ZZAUTOTEST Bravo']);
o.positiveControl = { searchInBrowserAddress: (o.B_twoSearches.browserAddressAfterEachSearch as string[]).every((u) => /search=/.test(u)), dlRead: o.B_twoSearches.distinctDl.length > 0 };
await p.screenshot({ path: path.join(EV, 'P-SV-11722-referrer.png') }).catch(() => {});
fs.writeFileSync(path.join(EV, 'prod-ga-referrer-1027.json'), JSON.stringify(o, null, 1));
console.log(JSON.stringify(o, null, 1).slice(0, 4000));
await done(browser);
