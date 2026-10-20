/** tech-filter-aimee-1020.mts — 20 Oct 2026, staging: picture for C581915's failure. Board View (no filters): walk the columns
 *  (allBoardCols), bring "Aimee Francis"'s column on screen (toColumn) and picture it with its header; then open the Technician filter,
 *  type "Aimee" into its "Search technician" box (found by placeholder) and picture what the list offers. Positive control first: the same
 *  box typed "Esther Howard" must offer Esther Howard. Raw readings only. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { EV, shot, display, tab, allBoardCols, toColumn } from './wob.mts';
const OUT = path.join(EV, 'tech-filter-aimee-1020.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: any = {};
try {
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
  const cols = await allBoardCols(p); const col = cols.find((c: any) => c.name === 'Aimee Francis'); R.column = col ? { id: col.id, count: col.count, cards: col.cards?.slice(0, 3) } : 'no column';
  if (col) { R.onScreen = await toColumn(p, col.id); R.header = await p.locator(`[data-test-id="board_column_${col.id}"]`).first().innerText().then((x) => x.replace(/\s+/g, ' ').slice(0, 200)).catch(() => null); await shot(p, 'C581915-1020-aimee-column'); }
  const chip = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
  for (const [typed, key] of [['Esther Howard', 'control'], ['Aimee', 'aimee']] as const) {
    if (!(await p.getByPlaceholder('Search technician').count())) { await chip.click(); await W(1500); }
    const box = p.getByPlaceholder('Search technician').last(); await box.fill(typed); await W(1500);
    R[key] = { typed, offered: (await p.locator('.q-menu').last().locator('.q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10) };
    await shot(p, `C581915-1020-filter-${key}`); await box.fill(''); await W(800);
  }
} catch (e: any) { R.err = String(e?.message || e).slice(0, 400); }
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
await RUN.end().catch(() => {});
await done(browser);
