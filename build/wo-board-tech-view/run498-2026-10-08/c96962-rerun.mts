/** C96962 re-run with its CORRECTED steps (QA lead 9 Oct 2026): lead technician changes are read in the WORK ORDER's log
 *  (⋮ at the top right > Audit Log, "Work Order Log"); the Edit Line change is read in that line's own log (line number >
 *  Audit log). Everything is read off the screen. Expected (unchanged case text): each lead change adds exactly one entry
 *  (previous lead, new lead, your user, time); no separate entries for the two lines that moved with the lead; changing a
 *  line's technician in Edit Line still adds its own line entry. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, drag, openReassign, shiftPrompt } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const a = api(p); const R: any = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local'; const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const n = `ZZAUTOTEST F1 Lead History ${Date.now() % 100000}`;
const c = await customer(a, n, 'ZZF4LR'); const wo = await workOrder(a, c, 'estimate', null);
const lines: string[] = []; for (const i of [1, 2]) lines.push((await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i].id, status: 'authorized' })).body?.data?.line_id);
await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
// FIX (9 Oct 18:25): the board holds ~200 technicians — pin Esther and Ralph (put back in finally), as s4-batchE did
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const pinsBefore: string[] = (await prefGet()).pinnedTechnicianIds ?? [];
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
R.wo = (await workOrders(a, n))[0]?.number; R.url = `${APP}/workorders/${wo}/lines`; R.customer = n;
const woPage = async () => { await p.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); };
const rowsOf = () => p.evaluate(`[...document.querySelectorAll('.q-dialog tbody tr')].map(r => [...r.cells].map(c => c.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean).join(' | ')).filter(Boolean)`) as Promise<string[]>;
const woLog = async (label: string) => { await woPage(); await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(900);
  await p.locator('.q-menu .q-item').filter({ hasText: /^\s*Audit Log\s*$/ }).first().click(); await p.waitForTimeout(3000);
  const o = { title: (await p.locator('.q-dialog').last().innerText()).split('\n')[0], rows: await rowsOf() }; await shot(p, `C96962r-${label}-wo-log`); await p.keyboard.press('Escape'); await p.waitForTimeout(600); return o; };
const lineLog = async (lid: string, label: string) => { await woPage(); await p.locator(`[data-test-id="line_number_${lid}"]`).click(); await p.waitForTimeout(900);
  await p.locator('.q-menu .q-item').filter({ hasText: /Audit log/i }).first().click(); await p.waitForTimeout(3000);
  const o = { title: (await p.locator('.q-dialog').last().innerText()).split('\n')[0], rows: await rowsOf() }; await shot(p, `C96962r-${label}-line-log`); await p.keyboard.press('Escape'); await p.waitForTimeout(600); return o; };
const leadRows = (o: any) => o.rows.filter((r: string) => /Lead tech changed/i.test(r));
try {
  R.start = { wo: await woLog('0-start'), line1: await lineLog(lines[0], '0-line1'), line2: await lineLog(lines[1], '0-line2') };
  // step 3: drag Esther -> Ralph on Board View
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); R.dragPrompt = await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(2000);
  R.afterDrag = { wo: await woLog('1-drag'), line1: await lineLog(lines[0], '1-line1'), line2: await lineLog(lines[1], '1-line2') };
  // step 7: Edit Line on line 1 — set Technicians to Dana Ortiz (remove the one shown, add Dana)
  await woPage(); const ln = (await (async () => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; const ls = Array.isArray(d) ? d : d?.collection ?? []; return ls.find((x: any) => x.line_id === lines[0]); })());
  await p.getByText(String(ln?.line_name ?? '').trim(), { exact: false }).first().click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog').last();
  R.editLineTechBefore = await dlg.evaluate((e) => (e as HTMLElement).innerText.match(/Technicians\n([\s\S]*?)Add Technician/)?.[1]?.replace(/\s+/g, ' ').trim() ?? null);
  const tag = dlg.getByText('Ralph Edwards', { exact: true }).first();
  if (await tag.count()) { const x = tag.locator('xpath=ancestor::*[.//i or .//button][1]').locator('i, button').last(); await x.click().catch(() => {}); await p.waitForTimeout(600); }
  await dlg.locator('[data-test-id="select_line_roster_add_technician"]').or(dlg.locator('.q-field').filter({ hasText: /Add Technician/i })).first().click(); await p.waitForTimeout(800); await p.keyboard.type('Dana', { delay: 40 }); await p.waitForTimeout(1500);
  await p.locator('.q-menu .q-item').filter({ hasText: 'Dana Ortiz' }).first().click(); await p.waitForTimeout(800); await dlg.locator('.text-h6').first().click().catch(() => {});
  R.editLineTechSet = await dlg.evaluate((e) => (e as HTMLElement).innerText.match(/Technicians\n([\s\S]*?)Add Technician/)?.[1]?.replace(/\s+/g, ' ').trim() ?? null); await shot(p, 'C96962r-2-editline');
  await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4000);
  R.afterEditLine = { line1: await lineLog(lines[0], '2-line1'), wo: await woLog('2-editline') };
  // step 9: Reassign dialog Ralph -> Esther, then the left card Esther -> Ralph
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  const o = await openReassign(p, wo); await o.item.click(); await p.waitForTimeout(1200); await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); R.dialogPrompt = await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(2000);
  R.afterDialog = { wo: await woLog('3-dialog'), line2: await lineLog(lines[1], '3-line2') };
  await woPage(); await p.locator('[data-test-id="select_lead_technician"]').click(); await p.waitForTimeout(1000); await p.keyboard.type('Ralph'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click(); await p.waitForTimeout(3000);
  R.afterLeftCard = { wo: await woLog('4-leftcard'), line2: await lineLog(lines[1], '4-line2') };
  R.summary = { leadEntries: [R.start.wo, R.afterDrag.wo, R.afterDialog.wo, R.afterLeftCard.wo].map((x: any) => leadRows(x).length),
    line2RowsEnd: R.afterLeftCard.line2.rows, line1RowsAfterEdit: R.afterEditLine.line1.rows };
} catch (e: any) { R.error = String(e?.message || e).slice(0, 400); await shot(p, 'C96962r-error'); }
finally { await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: pinsBefore } }); R.pinsRestored = JSON.stringify((await prefGet()).pinnedTechnicianIds ?? []) === JSON.stringify(pinsBefore); fs.writeFileSync(path.join(EV, 'c96962-rerun.json'), JSON.stringify(R, null, 1)); console.log(t(), JSON.stringify(R, null, 1)); await done(browser); }
