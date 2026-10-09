/**
 * C96984 (c) (2026-10-09): a work order whose asset has NO unit and NO year/make/model. The New Asset form will not
 * save without a Make, so the asset is made behind the screen (Rule 107: seed the state) with only its owner; a
 * second asset with a unit in the same customer is the POSITIVE CONTROL that the asset line is on and readable.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, vehicle } from './data.mts';
import { EV, t, shot, display, tab, search, toColumn } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000); const a = api(p);
const R: any = {};
try {
  const n = `ZZAUTOTEST F2 No Unit No Asset ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZCTRL-1');                       // control asset: unit ZZCTRL-1
  const r = await a.post('/api/vehicles/create', { company_id: c.company_id, customer_id: c.contact_id });
  R.bare = { status: r.status, body: JSON.stringify(r.body).slice(0, 300) };
  const bareId = r.body?.data?.vehicle_id ?? r.body?.data?.id ?? r.body?.vehicle_id;
  R.bareRead = (await a.get(`/api/customers/view/${c.company_id}`)).body?.data?.company?.vehicles?.map((v: any) => ({ id: v.id ?? v.vehicle_id, unit: v.unit, year: v.year, make: v.vehicle_make?.name ?? v.vehicle_make ?? null, model: v.vehicle_model?.name ?? v.vehicle_model ?? null, vin: v.vin }));
  const ES = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0]?.staff_id;
  R.ctrl = await workOrder(a, c, 'approved', ES);
  R.bareWo = bareId ? await workOrder(a, { ...c, vehicle_id: bareId }, 'approved', ES) : null;
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(900);
  const sws = p.locator('.q-menu [data-test-id^="toggle_board_field_"]'); R.fields = {};
  for (let i = 0; i < await sws.count(); i++) { const s = sws.nth(i); const k = (await s.getAttribute('data-test-id'))!.replace('toggle_board_field_', '');
    const on = await s.evaluate((e) => !!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy'));
    const want = ['vehicle', 'lines_count', 'total_price', 'progress'].includes(k); if (on !== want) { await s.click(); await p.waitForTimeout(700); } R.fields[k] = want; }
  await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  // FIX: both cards sit in Esther's column, which can be off-screen — bring it into view (positive control included)
  await toColumn(p, ES).catch(() => {}); await p.waitForTimeout(1500);
  const cardOf = (id: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${id}"]'); return c ? c.innerText.replace(/\\s+/g, ' ') : null; })()`);
  const htmlOf = (id: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${id}"]'); return c ? c.innerHTML.replace(/\\s+/g, ' ').slice(0, 2500) : null; })()`);
  for (let k = 0; k < 2; k++) { R[`try${k}`] = { ctrl: await cardOf(R.ctrl), bare: R.bareWo ? await cardOf(R.bareWo) : null }; await p.waitForTimeout(2000); }
  R.bareHtml = R.bareWo ? await htmlOf(R.bareWo) : null;
  const card = p.locator(`[data-test-id="board_card_${R.bareWo}"]`); if (await card.count()) await card.scrollIntoViewIfNeeded();
  await shot(p, 'C96984-c-cards');
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot(p, 'C96984-c-error'); }
console.log(t(), 'C96984c', JSON.stringify(R).slice(0, 5000));
fs.writeFileSync(path.join(EV, 'c-fix2.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
