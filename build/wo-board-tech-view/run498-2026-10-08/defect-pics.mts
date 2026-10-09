/** Ticket pictures (2026-10-09), captured at 2x (WOB_SCALE=2) for the held reports whose text makes a comparison:
 *  D10 — Board View with Fields to display OPEN (Estimated hours on) beside the card, and the same work order's Lines tab
 *        showing each line's estimate (so both sides of the comparison are in the pictures);
 *  D1  — a search that finds nothing (no Clear filters) beside a filter that finds nothing (Clear all filters). */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { t, display, tab, search } from './wob.mts';
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'defect-drafts', 'raw'); fs.mkdirSync(OUT, { recursive: true });
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const R: any = {};
const shot = (n: string) => p.screenshot({ path: path.join(OUT, `${n}.png`) });
const box = async (sel: string) => { const b = await p.locator(sel).first().boundingBox(); return b ? [b.x, b.y, b.width, b.height].map(Math.round) : null; };
try { // D10
  const [w] = await workOrders(a, 'ZZAUTOTEST F2 Card Field Values'); R.d10wo = w?.number; const q = w ? (w.companyName ?? 'ZZAUTOTEST F2 Card Field Values') : 'ZZAUTOTEST F2 Card Field Values';
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'Board View'); await search(p, w?.number ?? q); await p.waitForTimeout(3000);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1200);
  const est = p.locator('[data-test-id="toggle_board_field_time_estimate"]'); const on = await est.evaluate((e) => !!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true').catch(() => null);
  if (on === false) { await est.click(); await p.waitForTimeout(1500); } R.d10on = await est.evaluate((e) => !!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true').catch(() => null);
  R.d10boxes = { menu: await box('.q-menu'), est: await box('[data-test-id="toggle_board_field_time_estimate"]'), card: w ? await box(`[data-test-id="board_card_${w.id}"]`) : null }; await shot('D10-board-fields-open');
  await p.keyboard.press('Escape'); if (w) { await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
    R.d10lineBoxes = await p.evaluate(`[...document.querySelectorAll('[data-test-id="table_work_order_lines"] tbody tr')].filter(r => /\\d\\.\\d\\d\\s*\\/\\s*\\d\\.\\d\\d/.test(r.innerText)).map(r => { const b = r.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height), (r.innerText.match(/\\d\\.\\d\\d\\s*\\/\\s*\\d\\.\\d\\d/) || [''])[0]]; })`);
    R.d10statusCard = await box('[data-test-id="text_wo_number"]'); await shot('D10-wo-lines'); }
} catch (e: any) { R.d10error = String(e).slice(0, 300); }
try { // D1
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'List'); await search(p, 'ZZNOMATCH123'); await p.waitForTimeout(3000);
  R.d1msg = await p.evaluate(`(document.body.innerText.match(/No work orders match[^\\n]*/) || [null])[0]`); R.d1box = await p.evaluate(`(() => { const e = [...document.querySelectorAll('div, span, p')].find(x => /^No work orders match the search/.test(x.innerText || '') && x.children.length < 3); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; })()`); R.d1search = await box('[data-test-id="page_search_input"]'); await shot('D1-search-no-results');
  await p.locator('[data-test-id="page_search_clear"]').click().catch(() => {}); await p.waitForTimeout(2500); await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900);
  for (const s of ['Imported']) await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(s) }).first().click().catch(() => {}); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  R.d1filterMsg = await p.evaluate(`(document.body.innerText.match(/No work orders match[^\\n]*/) || [null])[0]`); R.d1filterBox = await p.evaluate(`(() => { const e = [...document.querySelectorAll('button')].find(x => /Clear all filters/.test(x.innerText || '')); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; })()`); await shot('D1-filter-no-results');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await p.keyboard.press('Escape');
} catch (e: any) { R.d1error = String(e).slice(0, 300); }
console.log(t(), JSON.stringify(R)); fs.writeFileSync(path.join(OUT, 'defect-pics.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
