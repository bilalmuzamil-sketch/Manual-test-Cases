/**
 * C96962 follow-up (2026-10-08): the line edit's own entry lives in the LINE's Audit log (line ⋮ > Audit log, read
 * by GET /api/work-orders/lines/{lineId}/history — product code @ 7a95011 fetchWorkOrderLineAuditHistory), not in the
 * work order's history. This probe (1) drags the lead and reads both lines' audit logs (no entries expected for the
 * lines that moved, S4-R17), then (2) changes Line 1's technician in the Edit Line window, PROVES the save landed
 * (line technicians read back), and reads Line 1's audit log (one entry expected, S4-R18).
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, shiftPrompt, toasts } from './wob.mts';
import { staffRows } from './staff.mts';

const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p); const R: any = { exit: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const n = `ZZAUTOTEST F1 Lead History ${Date.now() % 100000}`;
const c = await customer(a, n, 'ZZF4LH'); const wo = await workOrder(a, c, 'estimate', null);
const l1 = await mkLine(wo, 1), l2 = await mkLine(wo, 2);
await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
const num = (await workOrders(a, n))[0].number;
const lh = async (l: string) => { const r = await a.get(`/api/work-orders/lines/${l}/history`); const h = r.body?.data?.history ?? r.body?.data?.collection ?? r.body?.data ?? [];
  return { status: r.status, n: Array.isArray(h) ? h.length : -1, entries: (Array.isArray(h) ? h : []).slice(0, 4).map((x: any) => `${x.eventName ?? x.event ?? '?'} ${x.originalLineTechName ?? ''}->${x.newLineTechName ?? ''} by ${x.userName ?? ''} ${x.historyDate ?? ''} ${x.historyTime ?? ''}`), keys: Array.isArray(h) && h[0] ? Object.keys(h[0]).slice(0, 12).join(',') : (r.status !== 200 ? JSON.stringify(r.body).slice(0, 160) : '') }; };
const techs = async () => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => [x.lineId === l1 ? 'Line 1' : 'Line 2', `${(x.technicians ?? []).map((tt: any) => `${tt.firstName} ${tt.lastName}`).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`]));
R.wo = num; R.before = { techs: await techs(), l1: await lh(l1), l2: await lh(l2) };
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, num);
await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
R.drag = { message: await toasts(p), techs: await techs(), l1: await lh(l1), l2: await lh(l2) };
// Edit Line, through the screen
const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000);
const name1 = String(canned[1].canned_line_name ?? canned[1].name ?? '').trim(); R.line1Name = name1;
await pg.getByText(name1, { exact: false }).first().click(); await pg.waitForTimeout(2500);
const dlg = pg.locator('.q-dialog').last();
R.dialog = { open: await dlg.isVisible().catch(() => false), title: await dlg.locator('.text-h6, [data-test-id="text_dialog_title"]').first().innerText().catch(() => null), labels: await dlg.evaluate((e) => [...e.querySelectorAll('.q-field__label, label')].map((x) => (x as HTMLElement).innerText.trim()).filter(Boolean)).catch(() => []) };
await shot(pg, 'C96962-editline-open');
const fld = dlg.locator('.q-field').filter({ hasText: /technician/i }).first();
if (await fld.count()) {
  await fld.click(); await pg.waitForTimeout(800); await pg.keyboard.type('Dana'); await pg.waitForTimeout(1500);
  R.options = await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => []);
  await pg.locator('.q-menu .q-item').filter({ hasText: 'Dana Ortiz' }).first().click(); await pg.waitForTimeout(800);
  await dlg.locator('.q-card__section, .text-h6').first().click().catch(() => {}); await pg.waitForTimeout(400);
  await shot(pg, 'C96962-editline-picked');
  await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await pg.waitForTimeout(3500);
  R.saveToast = await toasts(pg);
} else R.noTechField = true;
await pg.close();
R.edit = { techs: await techs(), l1: await lh(l1), l2: await lh(l2) };
const wh = (await a.get(`/api/work-orders/${wo}/history`)).body?.data?.history ?? [];
R.woHistory = wh.slice(0, 5).map((h: any) => `${h.eventName} ${h.originalLeadTechName ?? ''}->${h.newLeadTechName ?? ''} ${h.originalLineTechName ?? ''}->${h.newLineTechName ?? ''} by ${h.userName}`);
console.log(t(), JSON.stringify(R, null, 1).slice(0, 5000));
fs.writeFileSync(path.join(EV, 'C96962-editline.json'), JSON.stringify(R, null, 1));
await done(browser);
