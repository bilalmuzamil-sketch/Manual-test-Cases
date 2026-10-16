/** C96962 on STAGING, 16 Oct 2026 (batch 40). The 16 Oct staging run could not read step 6 (the LINE's own Audit log): it opened the
 *  labor sub-row's ⋮ (menu "Add Labor Fee / Discount", playbook 054 three-dot trap). Route used here (playbook 055): click the line's
 *  NUMBER (data-test-id line_number_<lineId>) and pick "Audit log" from the VISIBLE menu only (closed Quasar menus stay in the DOM).
 *  Whole case, on screen, as the signed-in Admin: work order with two Authorized lines, lead Esther Howard; Board View drag to Ralph
 *  Edwards (Keep shifts); work order ⋮ > Audit Log; Edit Line on line 1: remove the technician(s) shown, add Dana Ortiz (the lists stop
 *  at ~100 names, L0396, so Dana not Ralph), Save & Close; line number (1) > Audit log BEFORE and AFTER (positive control: the line log
 *  opens and lists its earlier entries; the work order log lists the lead changes); Reassign dialog back to Esther; work order page
 *  Lead Technician to Dana. Pins put back at the end. Pictures: EV/C96962-b40-*.png, json EV/C96962-b40.json. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, drag, openReassign, shiftPrompt, toColumn, pickLeadOnPage, toasts } from './wob.mts';
import { staffRows, ensureEligible } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const a = api(p); const R: any = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status, me: (await a.get('/api/auth/me')).body?.data?.email ?? null };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C96962-b40-${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local'; const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
R.people = { es: !!ES, re: !!RE, do: !!DO }; R.eligible = [...await ensureEligible(a, ES, 'Esther'), ...await ensureEligible(a, RE, 'Ralph'), ...await ensureEligible(a, DO, 'Dana')];
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const n = `ZZAUTOTEST F1 Lead History ${Date.now() % 100000}`;
const c = await customer(a, n, 'ZZF4LB'); const wo = await workOrder(a, c, 'estimate', null);
const lines: string[] = []; for (const i of [1, 2]) lines.push((await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i].id, status: 'authorized' })).body?.data?.line_id);
R.approve = (await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' })).status; R.lead0 = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id })).status;
const PREF = '/api/users/me/preferences/work-orders-list'; const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const pinsBefore: string[] = (await prefGet()).pinnedTechnicianIds ?? [];
await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id], filters: {} } });
R.wo = (await workOrders(a, n))[0]?.number; R.customer = n;
const lineRows = async () => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return (Array.isArray(d) ? d : d?.collection ?? []) as any[]; };
const woPage = async () => { await p.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 15 && !(await p.locator(`[data-test-id="line_number_${lines[0]}"]`).count()); i++) await p.waitForTimeout(1000); await p.waitForTimeout(1500); };
const visItems = () => p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 20; }).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const clickVis = (re: RegExp) => p.evaluate(`(() => { const it = [...document.querySelectorAll('.q-menu .q-item')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 20; }).filter(e => ${re}.test(e.innerText.replace(/\\s+/g, ' ').trim())).pop(); if (!it) return false; it.click(); return true; })()`) as Promise<boolean>;
const dlgRows = () => p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!d) return { title: null, rows: [] }; return { title: d.innerText.split('\\n')[0], rows: [...d.querySelectorAll('tbody tr, .q-item')].map(r => r.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean).slice(0, 40), text: d.innerText.replace(/\\s+/g, ' ').slice(0, 1500) }; })()`) as Promise<any>;
const closeDlg = async () => { await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(700); if (await p.locator('.q-dialog:visible').count()) { await p.locator('.q-dialog:visible [data-test-id="button_close_dialog"], .q-dialog:visible button:has(i:text-is("close"))').last().click().catch(() => {}); await p.waitForTimeout(700); } };
const woLog = async (label: string) => { await woPage(); await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
  const menu = await visItems(); const ok = await clickVis(/^Audit Log$/i); await p.waitForTimeout(3500); const o = { menu, opened: ok, ...(await dlgRows()) }; await shot(`${label}-wo-log`); await closeDlg(); return o; };
const lineLog = async (lid: string, label: string) => { await woPage(); const num = p.locator(`[data-test-id="line_number_${lid}"]`).first(); const o: any = { numberFound: await num.count(), numberText: (await num.innerText().catch(() => '')).trim() };
  await num.click().catch((e) => { o.clickErr = String(e).slice(0, 100); }); await p.waitForTimeout(1200); o.menu = await visItems(); await shot(`${label}-line-menu`);
  o.opened = await clickVis(/^Audit log$/i); await p.waitForTimeout(3500); Object.assign(o, await dlgRows()); await shot(`${label}-line-log`); await closeDlg(); return o; };
const leadRows = (o: any) => (o?.rows ?? []).filter((r: string) => /Lead tech changed/i.test(r));
const techRows = (o: any) => (o?.rows ?? []).filter((r: string) => /tech/i.test(r) && !/Lead tech changed/i.test(r));
try {
  R.s0 = { wo: await woLog('0-start'), line1: await lineLog(lines[0], '0-line1'), line2: await lineLog(lines[1], '0-line2') };
  // steps 1-2: Board View drag Esther -> Ralph
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n);
  // 16 Oct 2026 (batch 40, second go): the saved pins did not take on the second run (Esther and Ralph sat in alphabetical order, Ralph far
  // off screen), so the drag had no target. Pin them through each column's pin button when they are not pinned, then go back to the left.
  R.pinnedOnScreen = []; for (const x of [ES, RE]) { await toColumn(p, x.staff_id); const b = p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`); const cls = (await b.getAttribute('class').catch(() => '')) ?? '';
    if (/pin--unpinned/.test(cls)) { await b.click().catch(() => {}); await p.waitForTimeout(1500); R.pinnedOnScreen.push(x.first_name ?? x.staff_id.slice(0, 4)); } }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`).catch(() => {}); await p.waitForTimeout(1200);
  await toColumn(p, ES.staff_id); R.cardFound = await p.locator(`[data-test-id="board_card_${wo}"]`).count(); R.ralphCol = await p.locator(`[data-test-id="board_column_${RE.staff_id}"]`).count();
  await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); R.dragPrompt = await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(2000); R.dragToasts = await toasts(p); await shot('1-board-after-drag');
  R.leadAfterDrag = (await workOrders(a, n))[0]?.techAssignedFirstName;
  R.s1 = { wo: await woLog('1-drag'), line1: await lineLog(lines[0], '1-line1'), line2: await lineLog(lines[1], '1-line2') };
  // step 5: Edit Line on line 1 — remove the technician(s) shown, add Dana Ortiz, Save & Close
  await woPage(); const l1 = (await lineRows()).find((x: any) => x.line_id === lines[0]); R.line1Name = String(l1?.line_name ?? '').trim();
  R.lineTechsApiBefore = (((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []) as any[]).map((x: any) => `${x.lineId === lines[0] ? 'L1' : 'L2'}: ${(x.technicians ?? []).map((q: any) => `${q.firstName} ${q.lastName}`).join(', ') || 'none'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`);
  await p.getByText(R.line1Name, { exact: false }).first().click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog:visible').last();
  R.editLineTitle = (await dlg.innerText().catch(() => '')).split('\n')[0];
  R.rosterBefore = await dlg.evaluate((e) => [...e.querySelectorAll('[data-test-id^="button_line_roster_remove_"]')].map((b) => (b.closest('.q-chip, .q-item, div') as HTMLElement)?.innerText?.replace(/\s+/g, ' ').trim().slice(0, 40)));
  for (let i = 0; i < 4 && (await dlg.locator('[data-test-id^="button_line_roster_remove_"]').count()); i++) { await dlg.locator('[data-test-id^="button_line_roster_remove_"]').first().click().catch(() => {}); await p.waitForTimeout(700); }
  R.rosterAfterRemove = await dlg.locator('[data-test-id^="button_line_roster_remove_"]').count();
  await dlg.locator('[data-test-id="select_line_roster_add_technician"]').first().click().catch(async () => { await dlg.locator('.q-field').filter({ hasText: /Add Technician/i }).first().click(); }); await p.waitForTimeout(1200);
  let dana = p.locator('.q-menu .q-item').filter({ hasText: 'Dana Ortiz' }).first();
  for (let i = 0; i < 80 && !(await dana.count()); i++) { R.danaScroll = i + 1; const mv = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false); await p.waitForTimeout(250); if (!mv) break; }
  R.danaOffered = await dana.count(); if (R.danaOffered) await dana.click(); await p.waitForTimeout(900); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(500);
  R.rosterSet = await dlg.evaluate((e) => (e as HTMLElement).innerText.replace(/\s+/g, ' ').match(/Technicians?(.{0,120})/)?.[1] ?? null).catch(() => null); await shot('2-editline-set');
  await dlg.locator('button').filter({ hasText: /Save & Close/i }).last().click(); await p.waitForTimeout(4000); R.editLineToasts = await toasts(p); R.editDialogOpen = await p.locator('.q-dialog:visible').count();
  R.lineTechsApiAfter = (((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []) as any[]).map((x: any) => `${x.lineId === lines[0] ? 'L1' : 'L2'}: ${(x.technicians ?? []).map((q: any) => `${q.firstName} ${q.lastName}`).join(', ') || 'none'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`);
  await p.waitForTimeout(3000);
  R.s2 = { line1: await lineLog(lines[0], '2-line1'), line2: await lineLog(lines[1], '2-line2'), wo: await woLog('2-editline') };
  // step 7: Reassign dialog back to Esther
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'Board View'); await search(p, n); await toColumn(p, RE.staff_id);
  const o = await openReassign(p, wo); await o.item.click(); await p.waitForTimeout(1500);
  let opt = p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`); if (!(await opt.count())) { await p.locator('.q-dialog:visible input').first().fill('Esther').catch(() => {}); await p.waitForTimeout(2000); }
  await opt.click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); R.dialogPrompt = await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(2000);
  R.leadAfterDialog = (await workOrders(a, n))[0]?.techAssignedFirstName;
  R.s3 = { wo: await woLog('3-dialog'), line2: await lineLog(lines[1], '3-line2') };
  // step 8: work order page Lead Technician -> Dana Ortiz
  await woPage(); R.woPagePick = await pickLeadOnPage(p, 'Dana', 'Dana Ortiz'); await p.waitForTimeout(2500); await shot('4-wo-page-lead');
  R.leadAfterWoPage = (await workOrders(a, n))[0]?.techAssignedFirstName;
  R.s4 = { wo: await woLog('4-leftcard'), line1: await lineLog(lines[0], '4-line1'), line2: await lineLog(lines[1], '4-line2') };
  R.summary = { leadEntriesCount: [R.s0.wo, R.s1.wo, R.s3.wo, R.s4.wo].map((x: any) => leadRows(x).length), woLogEnd: R.s4.wo.rows, line1LogBefore: R.s1.line1.rows, line1LogAfterEdit: R.s2.line1.rows, line1TechRowsAdded: techRows(R.s2.line1).length - techRows(R.s1.line1).length, line2LogEnd: R.s4.line2.rows };
} catch (e: any) { R.error = String(e?.message || e).slice(0, 400); await shot('error'); }
finally { await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: pinsBefore } }); R.pinsRestored = true; fs.writeFileSync(path.join(EV, 'C96962-b40.json'), JSON.stringify(R, null, 1)); console.log(t(), 'C96962', JSON.stringify(R).slice(0, 6000)); await done(browser); }
