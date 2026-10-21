/**
 * tech-filter-check-1020.mts — 20 Oct 2026, staging. Re-reads two things tech-filter-stg6 could not settle, because Tech View draws only
 * the groups near the screen (its group walk stopped at 94 names and its after-clear row reading saw only the top of the list):
 *   C581915 step 2/4: the Technician filter's options against EVERY Tech View group and EVERY Board View column (no filters, Unassigned
 *           closed so its ~3,450 rows do not fill the walk), each walked to the true bottom/right edge (scrollTop + height = scrollHeight).
 *   C581917 step 5: after Technician + Status = Paid and "Clear all filters", walk every group of the search result and say where
 *           WO-1 (S2-37639) and WO-2 (S2-37640) sit — the case's customer from tech-filter-stg6 (run no. 82068).
 * Raw readings only, pictures where the Expected judges.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, search, groups, allBoardCols, listAllOptions , switchLocUI, ensureLocation } from './wob.mts';

const OUT = path.join(EV, 'tech-filter-check-1020.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list';
const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: Record<string, any> = { started: new Date().toISOString() };
const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));

async function prep() {
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500); { await ensureLocation(p, a, HEAVY); } // 21 Oct 2026: L0490 — a run can land at another location await tab(p, 'All').catch(() => {});
  const am = p.locator('[data-test-id="filter_chip_assigned_to_me"]').first();
  if (await am.count() && await am.evaluate((e) => e.getAttribute('aria-pressed') === 'true').catch(() => false)) { await am.click(); await W(1500); }
}
/** every group (name, count, rows) from top to the true bottom of the Tech View scroller */
async function walkGroups() {
  const seen = new Map<string, any>(); await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await W(700); let atEnd = 0;
  for (let i = 0; i < 4000 && atEnd < 3; i++) {
    for (const g of await groups(p)) { const s = seen.get(g.name) ?? { name: g.name, count: g.count, rows: [] as string[] }; for (const r of g.rows) if (!s.rows.includes(r)) s.rows.push(r); seen.set(g.name, s); }
    const end = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); s.scrollTop += Math.floor(s.clientHeight * 0.8); return s.scrollTop + s.clientHeight >= s.scrollHeight - 2; })()`);
    await W(350); atEnd = end ? atEnd + 1 : 0;
  }
  return [...seen.values()];
}
async function closeUnassigned() {
  const h = p.locator('[data-test-id^="tech_view_group_"][data-collapsed="false"]').filter({ hasText: /^\s*Unassigned/ }).first();
  if (await h.count()) { const id = ((await h.getAttribute('data-test-id')) || '').replace('tech_view_group_', ''); await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).click().catch(() => {}); await W(1500); return 'closed'; }
  return 'already closed';
}
const techChip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();

// ── C581915: options vs every group and every column ──
try {
  await prep(); await display(p, 'Tech View'); R.unassigned = await closeUnassigned();
  const gs = await walkGroups(); const gnames = gs.map((g) => g.name);
  await techChip().click(); await W(1200); const opts = await listAllOptions(p);
  // C590127 step 5: one name ticked, then Escape — does the list close? (read and pictured, then the tick is undone)
  const it = p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /^\s*Unassigned\s*$/ }).first(); await it.click().catch(() => {}); await W(1000);
  R.C590127_s5 = { menusBeforeEscape: await p.locator('.q-menu').count() }; await p.keyboard.press('Escape'); await W(900);
  R.C590127_s5.menusAfterEscape = await p.locator('.q-menu').count(); R.C590127_s5.chip = (await techChip().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await shot(p, 'C590127-1020-s5-after-escape');
  await techChip().click(); await W(1000); await p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /^\s*Unassigned\s*$/ }).first().click().catch(() => {}); await W(900); await p.keyboard.press('Escape'); await W(700);
  const has = (list: string[], n: string) => list.some((x) => x.replace(/\s+/g, ' ').trim() === n);
  R.C581915 = { groups: gnames.length, options: opts.length, groupsNotInOptions: gnames.filter((n) => !has(opts, n)), optionsNotInGroups: opts.filter((o) => !gnames.includes(o.replace(/\s+/g, ' ').trim())),
    firstGroups: gnames.slice(0, 5), lastGroups: gnames.slice(-5), firstOptions: opts.slice(0, 5), lastOptions: opts.slice(-5) };
  await shot(p, 'C581915-1020-tech-bottom'); save();
  await display(p, 'Board View'); const cols = await allBoardCols(p); const cnames = cols.map((c: any) => c.name);
  R.C581915.columns = cnames.length; R.C581915.columnsNotInOptions = cnames.filter((n: string) => !has(opts, n)); R.C581915.optionsNotInColumns = opts.filter((o) => !cnames.includes(o.replace(/\s+/g, ' ').trim()));
  R.C581915.groupsVsColumns = { groupsNotColumns: gnames.filter((n) => !cnames.includes(n)), columnsNotGroups: cnames.filter((n: string) => !gnames.includes(n)) };
  save(); console.log('C581915', JSON.stringify(R.C581915).slice(0, 3000));
} catch (e: any) { R.C581915err = String(e?.message || e).slice(0, 400); save(); }

// ── C581917 step 5 ──
try {
  const CUST = 'ZZAUTOTEST NT3 Technician Filter Mix 82068'; const nm: Record<string, string> = { 'S2-37639': 'WO-1', 'S2-37640': 'WO-2', 'S2-37641': 'WO-3' };
  await prep(); await display(p, 'Tech View'); await search(p, CUST);
  await techChip().click(); await W(1200); await p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /Esther Howard/ }).first().click().catch(() => {}); await W(1200); await p.keyboard.press('Escape'); await W(900);
  await p.locator('[data-test-id="filter_chip_status"]').first().click(); await W(1000); await p.locator('[data-test-id="filter_option_status_paid"]').first().click().catch(() => {}); await W(1000); await p.keyboard.press('Escape'); await W(900);
  const before = (await walkGroups()).filter((g) => g.rows.length);
  await p.locator('button, .q-btn').filter({ hasText: /Clear all filters/i }).first().click(); await W(3000);
  const gs = (await walkGroups()).filter((g) => g.rows.length).map((g) => `${g.name}: ${g.rows.map((r: string) => nm[r] ?? r).join(', ')}`);
  R.C581917 = { beforeClear: before.length, search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), groupsWithRows: gs };
  for (const n of ['S2-37640', 'S2-37639']) { const loc = p.locator(`[data-test-id^="tech_view_row_"]`).filter({ hasText: n }).first();
    for (let i = 0; i < 400 && !(await loc.count()); i++) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 500`); await W(250); }
    if (await loc.count()) { await loc.scrollIntoViewIfNeeded().catch(() => {}); await W(800); await shot(p, `C581917-1020-s5-${nm[n]}`); R.C581917[nm[n]] = 'on screen'; } else R.C581917[nm[n]] = 'not found'; }
  save(); console.log('C581917', JSON.stringify(R.C581917));
} catch (e: any) { R.C581917err = String(e?.message || e).slice(0, 400); save(); }

R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); save();
await RUN.end().catch(() => {});
await done(browser);
