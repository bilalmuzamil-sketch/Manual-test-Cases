/**
 * C368212-loc.mts — 17 Oct 2026, round 3: ONLY the positive half of C368212 still open — a work order made at Staging Lethbridge - 4310
 * is listed when the screen is AT Lethbridge, and not listed back at Staging Heavy Duty - 9919. The location is switched with the SAME
 * menu route ensure-heavy.mts uses every step today (initials > Change Location > the location: wob.mts switchLocUI), and every top-bar
 * location is read and logged. Work Orders > All tab, saved filters cleared first (the 17 Oct run was hidden by a leftover Status filter),
 * List display, Search "Loc2"; S3-37071 looked for in the rows; a picture at each location. Output EV/C368212-loc.json.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t, display, tab, search, switchLocUI } from './wob.mts';
import { startState } from './fixup-1017.mts';

const NUM = 'S3-37071', Q = 'Loc2', PREF = '/api/users/me/preferences/work-orders-list';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status, locations: [] as string[] }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C368212-loc-${n}.png`) }).catch(() => {});
const top = async (tag: string) => { const v = await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => ''); o.locations.push(`${tag}: ${v}`); console.log(t(), 'LOCATION', tag, v); return v; };
const listed = async (tag: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'List'); await W(1500);
  const r: any = { location: await top(`${tag} (Work Orders open)`), statusChip: (await p.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => '')).replace(/\s+/g, ' ').trim() };
  await search(p, Q); await W(3000); r.search = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  r.rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(x => x.getBoundingClientRect().height > 0).map(x => (x.innerText.match(/S\\d+-\\d+/) || [''])[0]).filter(Boolean).slice(0, 20)`).catch(() => []);
  r.listed = (r.rows as string[]).includes(NUM); r.emptyText = await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.match(/No (work orders|data|results)[^\\n]{0,60}/i)?.[0] || null`).catch(() => null);
  await shot(tag); return r; };
try {
  await startState(p, a, 'C368212-loc');
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000);
  o.start = await top('start');
  const pv = (await a.get(PREF)).body?.data?.value ?? {}; o.savedFiltersFound = JSON.stringify(pv.filters ?? null).slice(0, 200);
  o.clearFilters = (await a.put(PREF, { value: { ...pv, filters: {}, tab: 'all' } })).status;
  console.log(t(), 'START STATE found C368212-loc', JSON.stringify({ location: o.start, savedFilters: o.savedFiltersFound }));
  console.log(t(), 'START STATE set C368212-loc', JSON.stringify({ clearFilters: o.clearFilters, savedFiltersNow: JSON.stringify(((await a.get(PREF)).body?.data?.value ?? {}).filters ?? null) }));
  // to Lethbridge, through the menu
  o.switchToLeth = await switchLocUI(p, 'Staging Lethbridge'); if (!o.switchToLeth.includes('Lethbridge')) o.switchToLeth2 = await switchLocUI(p, 'Staging Lethbridge');
  await top('after switch to Lethbridge');
  o.atLethbridge = await listed('lethbridge');
  // back to Heavy Duty, the same way
  o.switchBack = await switchLocUI(p, 'Staging Heavy Duty'); if (!o.switchBack.includes('Heavy Duty')) o.switchBack2 = await switchLocUI(p, 'Staging Heavy Duty');
  await top('after switch back to Heavy Duty');
  o.atHeavyDuty = await listed('heavy-duty');
  o.result = { listedAtLethbridge: o.atLethbridge.listed, listedAtHeavyDuty: o.atHeavyDuty.listed, atLethbridgeReallyThere: /Lethbridge/.test(o.atLethbridge.location), backAtHeavyDuty: /Heavy Duty/.test(o.atHeavyDuty.location) };
  console.log(t(), 'C368212-loc', JSON.stringify(o.result));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally { const now = await top('end'); if (!/Heavy Duty/.test(now)) { o.endSwitch = await switchLocUI(p, 'Staging Heavy Duty').catch(() => null); await top('end after switch'); } }
fs.writeFileSync(path.join(EV, 'C368212-loc.json'), JSON.stringify({ C368212: o }, null, 1)); console.log(t(), 'C368212', JSON.stringify(o).slice(0, 3000)); await done(browser);
