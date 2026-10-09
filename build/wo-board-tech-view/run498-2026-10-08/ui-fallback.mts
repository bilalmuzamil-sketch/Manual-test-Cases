/**
 * UI FALLBACK (2026-10-09): two things the API route did not do, done through the screen as a tester would, while
 * recording exactly what the screen sends (so the API recipe can be corrected):
 *  (1) enrol the test admin at Staging Lethbridge - 4310 through Settings > Staff > edit > Departments, then switch
 *      there with the location menu and read the second-location clauses of C96975, C96976, C96989;
 *  (2) make the assets of C96982 / C96984 through Customers > (customer) > Assets > New Asset (Year, Make, Model, Unit),
 *      then their work orders, and read the cards (unit, or the asset in the unit's place).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner, RUNNER_EMAIL } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search } from './wob.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000); const a = api(p);
const R: Record<string, any> = {};
const sends: string[] = []; p.on('request', (q) => { if (q.method() !== 'GET' && /\/api\/(staff|iam|vehicles|customers)/.test(q.url())) sends.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 500)}`); });
const where = () => p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) as Promise<string | null>;
const PREF = '/api/users/me/preferences/work-orders-list';
async function run(id: string, f: () => Promise<void>) { try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(p, `${id}-error`); }
  R[id] = { ...(R[id] || {}), sent: sends.splice(0).slice(0, 8) }; console.log(t(), id, JSON.stringify(R[id]).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'ui-fallback.json'), JSON.stringify(R, null, 1)); }
/** pick in a Quasar select inside the open dialog by its label: click, type, choose the first option containing `want` */
async function pick(label: RegExp, typeText: string, want: RegExp | string) {
  const f = p.locator('.q-dialog:visible .q-field').filter({ hasText: label }).first(); await f.click(); await p.waitForTimeout(800);
  if (typeText) { await p.keyboard.type(typeText, { delay: 30 }); await p.waitForTimeout(1500); }
  const opts = await p.locator('.q-menu:visible .q-item').allInnerTexts(); const o = p.locator('.q-menu:visible .q-item').filter({ hasText: want }).first();
  if (await o.count()) { await o.click(); await p.waitForTimeout(800); return `picked ${(await o.innerText().catch(() => '')).trim() || want}`; }
  await p.keyboard.press('Escape'); return `no option ${want} in [${opts.slice(0, 8).join(' | ')}]`;
}

await run('enrol', async () => {
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500);
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
  await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill(RUNNER_EMAIL); await p.waitForTimeout(3000);
  await p.locator('tr').filter({ hasText: RUNNER_EMAIL }).first().locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500);
  R.enrol = { labels: await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field__label')].map(e => e.innerText.trim()).filter(Boolean)`) };
  const dep = p.locator('.q-dialog:visible .q-field').filter({ hasText: /Department/ }).first(); await dep.click(); await p.waitForTimeout(1200);
  R.enrol.options = (await p.locator('.q-menu:visible .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 30);
  const leth = p.locator('.q-menu:visible .q-item').filter({ hasText: /Lethbridge/ }).first();
  if (await leth.count()) { R.enrol.picked = (await leth.innerText()).replace(/\s+/g, ' ').trim(); await leth.click(); await p.waitForTimeout(1000); }
  else { // options may be grouped: open the Lethbridge group / type it
    await p.keyboard.type('Lethbridge'); await p.waitForTimeout(1500); R.enrol.optionsTyped = (await p.locator('.q-menu:visible .q-item').allInnerTexts()).slice(0, 10);
    const l2 = p.locator('.q-menu:visible .q-item').first(); if (await l2.count()) { R.enrol.picked = (await l2.innerText()).trim(); await l2.click(); await p.waitForTimeout(1000); } }
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(500); await shot(p, 'ui-enrol-form');
  const save = p.locator('button:visible').filter({ hasText: 'Save & Close' }).last(); await save.click({ timeout: 10_000 }).catch((e) => { R.enrol.saveError = String(e).slice(0, 100); }); await p.waitForTimeout(3500);
  R.enrol.after = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL)?.departments;
});

await run('loc2', async () => {
  const before = (await a.get(PREF)).body?.data?.value ?? {};
  // the state to carry: Tech View Service Advisor off + Assigned Techs on, List Progress off, Board Customer off + VIN on, Comfortable
  await a.put(PREF, { value: { ...before, techViewColumns: { ...(before.techViewColumns ?? {}), serviceAdvisor: false, assignedTechs: true }, columns: { ...(before.columns ?? {}), progress: false }, boardFields: { ...(before.boardFields ?? {}), companyName: false, vin: true }, density: 'comfortable' } });
  R.loc2 = { saved: (await a.get(PREF)).body?.data?.value };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500);
  const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); R.loc2.menuButton = await cur.count();
  if (await cur.count()) { await cur.click(); await p.waitForTimeout(1500); R.loc2.options = await p.locator('.q-menu .q-item').allInnerTexts();
    await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: 'Lethbridge' }).first().click().catch(() => {}); await p.waitForTimeout(6000); }
  await p.keyboard.press('Escape').catch(() => {}); R.loc2.at = await where(); await shot(p, 'ui-loc2');
  if (/lethbridge/i.test(String(R.loc2.at))) {
    const sw = async (btn: string) => { await p.locator(`[data-test-id="${btn}"]`).click(); await p.waitForTimeout(1000); const r = await p.evaluate(`[...document.querySelectorAll('.q-menu [data-test-id^="toggle_"]')].filter(e => (e.querySelector('[role=switch]') || e).getAttribute('aria-checked') === 'true').map(e => e.innerText.trim())`); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return r; };
    const dens = async () => { await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(800); const r = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => /check/.test(e.innerText)).map(e => e.innerText.replace('check','').trim())`); await p.keyboard.press('Escape'); await p.waitForTimeout(400); return r; };
    await tab(p, 'All'); await display(p, 'Tech View'); R.loc2.tech = await sw('button_tech_view_column_selection'); R.loc2.techDensity = await dens();
    await display(p, 'Board View'); R.loc2.board = await sw('button_board_fields_selection'); R.loc2.boardDensity = await dens();
    await display(p, 'List'); R.loc2.list = await sw('button_column_selection'); await shot(p, 'ui-loc2-lethbridge');
  }
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }); await a.put(PREF, { value: before });
});

/** New Asset through the customer page */
async function newAsset(companyId: string, year: string, make: [string, RegExp], model: [string, RegExp], unit: string) {
  await p.goto(`${APP}/customers/${companyId}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator('.q-tab, [role=tab]').filter({ hasText: /Assets|Vehicles/ }).first().click(); await p.waitForTimeout(2500);
  await p.locator('button:visible').filter({ hasText: /New Asset|New Vehicle/ }).first().click(); await p.waitForTimeout(2500);
  const o: any = { labels: await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field__label')].map(e => e.innerText.trim()).filter(Boolean)`) };
  o.contact = await pick(/Contact/, '', /ZZAUTOTEST/); o.year = await pick(/Year/, year, year);
  o.make = await pick(/Make/, make[0], make[1]); o.model = await pick(/Model/, model[0], model[1]);
  if (unit) { const u = p.locator('.q-dialog:visible .q-field').filter({ hasText: /Unit/ }).first().locator('input'); await u.fill(unit); }
  await shot(p, `ui-new-asset-${unit || 'nounit'}`);
  await p.locator('.q-dialog:visible button').filter({ hasText: /^\s*Save/ }).last().click(); await p.waitForTimeout(3500); o.toasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' '))`);
  return o;
}
const cardOf = (id: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${id}"]'); return c ? c.innerText.replace(/\\s+/g, ' ') : null; })()`);
const vehiclesOf = async (companyId: string) => ((await a.get(`/api/customers/view/${companyId}`)).body?.data?.company?.vehicles ?? []) as any[];

for (const id of ['C96982', 'C96984']) await run(id, async () => {
  const n = `ZZAUTOTEST F2 ${id === 'C96982' ? 'Required Only' : 'Unit Fallback'} UI ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZTMP');   // the customer + contact (an asset needs a contact); its API asset is not used
  const o: any = { m2: await newAsset(c.company_id, '2022', ['Freight', /Freightliner/], ['M2', /^\s*M2/], 'TRK-118'), explorer: await newAsset(c.company_id, '1999', ['Ford', /^\s*Ford\s*$/], ['Explorer', /Explorer/], '') };
  const vs = await vehiclesOf(c.company_id); o.vehicles = vs.map((v: any) => `${v.year} ${v.vehicle_make?.name ?? v.vehicle_make ?? ''} ${v.vehicle_model?.name ?? v.vehicle_model ?? ''} unit=${v.unit ?? ''}`);
  const all = (await a.get(`/api/vehicles?pagination[rowsPerPage]=50&search=${encodeURIComponent('TRK-118')}`)).body?.data;
  const m2 = vs.find((v: any) => v.unit === 'TRK-118'), ex = vs.find((v: any) => String(v.year) === '1999');
  const ESid = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0]?.staff_id;
  if (m2) o.wo1 = await workOrder(a, { ...c, vehicle_id: m2.id ?? m2.vehicle_id }, 'approved', ESid);
  if (ex) o.wo2 = await workOrder(a, { ...c, vehicle_id: ex.id ?? ex.vehicle_id }, 'approved', ESid);
  if (id === 'C96984') o.wo3 = await workOrder(a, c, 'approved', ESid);   // [WO-d]-like: no lines (zeros) on the API asset
  await a.put(PREF, { value: { ...((await a.get(PREF)).body?.data?.value ?? {}), pinnedTechnicianIds: [ESid] } });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  // C96982: every optional field off; C96984: defaults + line count, total price, progress
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(900);
  const sws = p.locator('.q-menu [data-test-id^="toggle_board_field_"]'); for (let i = 0; i < await sws.count(); i++) { const s = sws.nth(i); const k = (await s.getAttribute('data-test-id'))!.replace('toggle_board_field_', ''); const on = (await s.locator('[role=switch]').getAttribute('aria-checked').catch(() => null)) === 'true';
    const wantOn = id === 'C96984' && ['vehicle', 'lines_count', 'total_price', 'progress'].includes(k); if (on !== wantOn) { await s.click(); await p.waitForTimeout(700); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  o.cards = { wo1: o.wo1 ? await cardOf(o.wo1) : null, wo2: o.wo2 ? await cardOf(o.wo2) : null, wo3: o.wo3 ? await cardOf(o.wo3) : null }; await shot(p, `ui-${id}-cards`);
  R[id] = o;
});
fs.writeFileSync(path.join(EV, 'ui-fallback.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
