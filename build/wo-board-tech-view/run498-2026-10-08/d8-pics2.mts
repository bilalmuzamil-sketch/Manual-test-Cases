/**
 * D2 + D8 pictures (2026-10-09; run with WOB_SCALE=2 WOB_EV=defect-drafts/raw). Both re-verified on today's build while
 * they are photographed. D2: Board View with Assigned to me on, change location through the initials menu, read the
 * toolbar. D8: a fresh work order with one line; add a technician in Edit Line (Save & Close); then the line's menu >
 * Audit log and the work order's three-dots > Audit Log. Run as Admin ShopView itself.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab } from './wob.mts';
import { HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const R: any = {}; const ONLYS = (process.env.ONLY || '').split(',').filter(Boolean);
async function run(id: string, f: () => Promise<void>) { if (ONLYS.length && !ONLYS.includes(id)) return; try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(p, `${id}-error`); } console.log(t(), id, JSON.stringify(R[id] ?? null).slice(0, 2500)); fs.writeFileSync(path.join(EV, 'd8-pics2.json'), JSON.stringify(R, null, 1)); }
const assigned = () => p.locator('button:has-text("Assigned to me")').first();
const where = () => p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`);

await run('D2', async () => { const o: any = {};
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'Board View');
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(3000); }
  o.before = { at: await where(), pressed: await assigned().getAttribute('aria-pressed'), url: p.url().replace(APP, '') }; await shot(p, 'D2-before');
  await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200); await shot(p, 'D2-menu');
  const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); if (await cur.count()) { await cur.click(); await p.waitForTimeout(1500); }
  o.options = (await p.locator('.q-menu .q-item, .q-menu .q-checkbox').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 10);
  // FIX: Admin ShopView can switch only to the locations he is enrolled at (here 'ZZAUTOTEST Empty Shop'): pick any OTHER location the list offers
  const other = p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasNotText: /Heavy Duty|Edit Profile|Timesheets|Portal|Billing|What.s New|Settings|Logout|Light|Dark/ }).first(); o.picked = (await other.innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/^check\s*/, ''); await other.click(); await p.waitForTimeout(7000); await p.keyboard.press('Escape').catch(() => {});
  o.after = { at: await where(), pressed: await assigned().getAttribute('aria-pressed').catch(() => null), url: p.url().replace(APP, '') }; await shot(p, 'D2-after');
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }); R.D2 = o; });

await run('D8', async () => { const o: any = {};
  let c: any = null, w: any = null; for (let i = 0; i < 3 && !w; i++) { c = await customer(a, `ZZAUTOTEST D8 Line History ${Date.now() % 100000}`, `ZZD8-${i}`); o.cust = { company: !!c.company_id, contact: !!c.contact_id, vehicle: !!c.vehicle_id }; w = await workOrder(a, c, 'estimate', null).catch((e) => { o[`create${i}`] = String(e).slice(0, 200); return null; }); }
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = Array.isArray(canned) ? canned : canned?.collection ?? [];
  const lr = await a.post(`/api/work-orders/${w}/lines/create-from-canned-line`, { canned_line_id: cl[1].id, status: 'authorized' }); const line = lr.body?.data?.line_id;   // an authorized line also approves the work order
  /* RE-VERIFY (2026-10-09): the 8 Oct report was made on a line that ALREADY had a technician (it followed the lead, Ralph
     Edwards); today's first recapture used a line with none, and there the entry WAS written. Rebuild the original state:
     lead Ralph Edwards, so the line carries Ralph, then add Dana Ortiz in Edit Line. */
  const ralph = (await (await import('./data.mts')).candidates(a)).find((x) => x.name === 'Ralph Edwards');
  o.leadSet = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: ralph?.id ?? null })).status; o.ralphFound = !!ralph;
  const lt0 = (await a.get(`/api/work-orders/lines/${w}`)).body?.data; const l0 = (Array.isArray(lt0) ? lt0 : lt0?.collection ?? [])[0]; o.lineTechsBefore = JSON.stringify(l0?.technicians ?? l0?.labor ?? l0?.roster ?? null).slice(0, 200);
  const v = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order; o.wo = v?.number; o.url = `${APP}/workorders/${w}`;
  const hist = async () => { const r = (await a.get(`/api/work-orders/lines/${line}/history`)).body?.data; return (Array.isArray(r) ? r : r?.collection ?? []).length; };
  o.lineHistoryBefore = await hist();
  await p.goto(`${APP}/workorders/${w}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const lineName = (await a.get(`/api/work-orders/lines/${w}`)).body?.data; const ln = (Array.isArray(lineName) ? lineName : lineName?.collection ?? [])[0]; o.lineName = ln?.line_name ?? ln?.name;
  await p.getByText(o.lineName, { exact: false }).first().click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog').last();
  const fld = dlg.locator('[data-test-id="select_line_roster_add_technician"]').or(dlg.locator('.q-field').filter({ hasText: /Add Technician/i })).first(); await fld.click(); await p.waitForTimeout(800); await p.keyboard.type('Dana', { delay: 40 }); await p.waitForTimeout(1500);
  const opt = p.locator('.q-menu .q-item').filter({ hasText: 'Dana Ortiz' }).first(); o.option = await opt.count(); if (o.option) await opt.click(); await p.waitForTimeout(800);
  await dlg.locator('.text-h6').first().click().catch(() => {}); await shot(p, 'D8b-edit-line-picked');
  await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4000);
  const lines2 = (await a.get(`/api/work-orders/lines/${w}`)).body?.data; const l2 = (Array.isArray(lines2) ? lines2 : lines2?.collection ?? [])[0]; o.techsAfter = (l2?.technicians ?? l2?.roster ?? []).map((x: any) => x.name ?? `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim());
  o.lineHistoryAfter = await hist(); await shot(p, 'D8b-line-after-save');
  // the line's menu > Audit log
  await p.locator(`[data-test-id="line_number_${line}"]`).click().catch(() => {}); await p.waitForTimeout(1200); o.lineMenu = (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
  const al = p.locator('.q-menu .q-item').filter({ hasText: /Audit log/i }).first(); o.lineAudit = await al.count();
  if (o.lineAudit) { await al.click(); await p.waitForTimeout(3000); o.lineAuditText = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await shot(p, 'D8b-line-audit-log'); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
  else await p.keyboard.press('Escape');
  await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click().catch(() => {}); await p.waitForTimeout(1000); const wal = p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first();
  if (await wal.count()) { await wal.click(); await p.waitForTimeout(3000); o.woAuditText = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 800); await shot(p, 'D8-wo-audit-log'); }
  R.D8 = o; });
await done(browser);
