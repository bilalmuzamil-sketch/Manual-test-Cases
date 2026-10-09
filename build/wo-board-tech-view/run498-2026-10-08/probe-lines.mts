/** UI map 3 (2026-10-09): the line window (description list, Technicians area and its remove control, Estimated Time),
 *  the Labor row's three-dots menu, the status card's Lead Technician list (how to reach a name low in the list), and
 *  the Schedule's technician rows (which staff have one, and their departments). Reads only, plus one New Line typed
 *  and cancelled. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrders } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const R: any = {};
const [w] = await workOrders(a, 'ZZAUTOTEST WO Page Lead Change'); R.wo = w?.number;
try { await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  // Lead Technician list
  await p.locator('[data-test-id="select_lead_technician"]').click(); await p.waitForTimeout(1200);
  R.lead = { inputs: await p.evaluate(`[...document.querySelectorAll('[data-test-id="select_lead_technician"] input')].map(i => i.outerHTML.slice(0, 200))`), menuItems: await p.locator('.q-menu .q-item').count(), virtual: await p.locator('.q-menu .q-virtual-scroll__content').count() };
  await p.keyboard.type('Ralph', { delay: 60 }); await p.waitForTimeout(1500); R.lead.afterTyping = (await p.locator('.q-menu .q-item').allInnerTexts()).slice(0, 5);
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  // Labor row menu
  const lab = p.locator('[data-test-id^="button_add_labor_adjustment_"]').first(); await lab.click().catch(() => {}); await p.waitForTimeout(1000); R.laborMenu = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await shot(p, 'UI3-labor-menu'); await p.keyboard.press('Escape');
  const ln = p.locator('[data-test-id^="line_number_"]').first(); await ln.click().catch(() => {}); await p.waitForTimeout(1000); R.lineNumberMenu = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await p.keyboard.press('Escape');
  // New Line window
  await p.locator('[data-test-id="button_new_line"]').click(); await p.waitForTimeout(2500); const d = p.locator('.q-dialog').last();
  await d.locator('[data-test-id="select_line_canned_line"]').click(); await p.keyboard.type('ZZAUTOTEST Oil change zq', { delay: 30 }); await p.waitForTimeout(2000); R.menuTexts = (await p.locator('.q-menu .q-item').allInnerTexts()).slice(0, 3);
  await p.keyboard.press('Escape'); await p.waitForTimeout(800); R.descAfterEscape = await d.locator('[data-test-id="select_line_canned_line"] input').inputValue().catch(() => null);
  R.techArea = await d.evaluate((e) => { const h = [...e.querySelectorAll('*')].find((x: any) => /^\s*Technicians\s*$/.test(x.innerText || '')); const box = h?.parentElement; return box ? box.outerHTML.replace(/\s+/g, ' ').slice(0, 2500) : 'no Technicians heading'; });
  R.estimate = await d.locator('[data-test-id="input_time_estimate"]').evaluate((e) => e.outerHTML.slice(0, 300)).catch(() => null); await shot(p, 'UI3-newline'); await d.locator('[data-test-id="button_close_dialog"]').click().catch(() => {});
} catch (e: any) { R.error = String(e).slice(0, 300); }
try { await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  R.lanes = await p.evaluate(`[...document.querySelectorAll('[data-staff-id]')].map(e => e.getAttribute('data-staff-id').slice(0, 8) + ' ' + ((e.querySelector('[data-test-id="schedule_lane_label"]') || e).innerText || '').replace(/\\s+/g, ' ').slice(0, 40)).slice(0, 60)`);
  for (const n of ['esther.howard', 'jenny.wilson']) { const r = (await staffRows(a, `zz.wob.${n}@staging.shopview.local`))[0]; R[n] = r ? { staff: String(r.staff_id).slice(0, 8), deps: r.departments } : null; }
  const deps = (await a.get('/api/departments')).body?.data; R.departments = (Array.isArray(deps) ? deps : deps?.collection ?? []).map((d: any) => `${d.name}${d.enable_time_clock ? ' [clock]' : ''}`).slice(0, 20);
} catch (e: any) { R.schedError = String(e).slice(0, 300); }
console.log(t(), JSON.stringify(R).slice(0, 8000)); fs.writeFileSync(path.join(EV, 'probe-lines.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
