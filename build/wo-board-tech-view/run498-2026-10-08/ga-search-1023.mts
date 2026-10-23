/** ga-search-1023.mts — 23 Oct 2026, PRODUCTION, picture for the C97027 ticket. Opens Work Orders from the top menu, types a search in the
 *  Search box, and records the Google Analytics requests the page sends afterwards: event name, its page address (dl) and title (dt).
 *  Pictures EV/gasearch-page.png (2x). Readings EV/ga-search-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { EV, t, search, display } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const o: any = { hits: [] };
await p.route(/\/g\/collect|google-analytics\.com\/.*collect/, async (route) => { const r = route.request(); const body = (r.postDataBuffer() || Buffer.from('')).toString('utf8');
  for (const l of (body ? body.split('\n') : [''])) { const q = new URLSearchParams((r.url().split('?')[1] ?? '') + '&' + l); const en = q.get('en'); if (en) o.hits.push({ en, dl: q.get('dl'), dt: q.get('dt'), at: new Date().toISOString() }); }
  await route.continue().catch(() => {}); });
const Q = 'ZZAUTOTEST Bravo GA';
await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click(); await p.waitForTimeout(6000);
const n0 = o.hits.length; await search(p, Q); await p.waitForTimeout(3000); await display(p, 'Tech View'); await p.waitForTimeout(6000);
o.afterSearch = o.hits.slice(n0).map((h: any) => ({ ...h, dl: decodeURIComponent(String(h.dl || '').replace(/\+/g, ' ')) }));
o.address = p.url(); o.searchBox = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
o.searchBox_box = await p.locator('[data-test-id="page_search_input"]').boundingBox().catch(() => null);
await p.screenshot({ path: path.join(EV, 'gasearch-page.png') });
console.log(t(), 'GASEARCH', JSON.stringify({ address: o.address, searchBox: o.searchBox, box: o.searchBox_box, after: o.afterSearch.slice(0, 6) }));
fs.writeFileSync(path.join(EV, 'ga-search-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
