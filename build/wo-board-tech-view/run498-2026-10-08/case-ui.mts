/** 12 Oct 2026 — C96960, C96968, C368136 run BY THEIR OWN TEST-CASE STEPS (not the tickets), in a normally signed-in browser
 *  (qa-branch-boot, nothing injected), browser TZ = location zone = Asia/Karachi, proved first (Rule 125). Pictures at 2x.
 *  Data from case-seed.mts. ONLY=c96960,c96968,c368136. Verdicts are read off the screen; the API is used only to read back
 *  a lead after a reload and whether a clock is still running. */
import fs from 'node:fs'; import path from 'node:path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
import { display, tab, search, drag, toColumn, openReassign, toasts, pickLead, shiftPrompt, expandSmallGroups } from './wob.mts';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'case-retest-2026-10-12');
const S = JSON.parse(fs.readFileSync(path.join(EVD, 'seed.json'), 'utf8'));
const only = (process.env.ONLY || 'c96960,c96968,c368136').split(',');
const { browser, ctx, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); p.setDefaultTimeout(30000);
const shot = (n: string) => p.screenshot({ path: path.join(EVD, `${n}.png`) }).catch(() => {});
const API = 'https://sv10043api.qa.shopview.com'; const R: any = {};
const get = (u: string) => p.evaluate(async (u) => (await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } })).json(), API + u);
const leadOf = async (q: string) => { const r = await get(`/api/work-orders?search=${encodeURIComponent(q)}&pagination[rowsPerPage]=5`); const w = (r?.data?.work_orders ?? [])[0]; return w ? (w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none') : 'not found'; };
const view = async (q: string, d: string) => { await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await tab(p, 'All'); await display(p, d); await search(p, q); await p.waitForTimeout(3000); if (d === 'Tech View') await expandSmallGroups(p).catch(() => {}); };
const cardIn = (id: string, d: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="${d === 'Board View' ? 'board_card_' : 'tech_view_row_'}${id}"]'); if (!c) return null; if (c.closest('[data-test-id^="board_column_"]')) return c.closest('[data-test-id^="board_column_"]').getAttribute('data-test-id').replace('board_column_', '');
  let e = c; while (e && !(e.getAttribute && /^tech_view_group_/.test(e.getAttribute('data-test-id') || ''))) e = e.previousElementSibling || e.parentElement; return e ? e.getAttribute('data-test-id').replace(/^tech_view_group_/, '') : '?'; })()`);
const who = (id: string | null) => ({ [S.ES]: 'Esther Howard', [S.RE]: 'Ralph Edwards', [S.DO]: 'Dana Ortiz', unassigned: 'Unassigned' } as any)[id ?? ''] ?? id;
const moveTo = async (id: string, target: string, d: string) => d === 'Board View'
  ? drag(p, `[data-test-id="board_card_${id}"]`, `[data-test-id="board_column_${target}"]`, 120)
  : drag(p, `[data-test-id="tech_view_row_${id}"]`, (await p.locator(`[data-test-id="tech_view_group_empty_${target}"]`).count()) ? `[data-test-id="tech_view_group_empty_${target}"]` : `[data-test-id="tech_view_group_${target}"]`, 10);
// Rule 125 gate: the Schedule's "now" pill must equal this browser's clock
await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
R.gate = await p.evaluate(() => ({ zone: Intl.DateTimeFormat().resolvedOptions().timeZone, clock: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), pill: [...document.querySelectorAll('div,span')].filter((e) => e.children.length === 0 && /^\s*\d{1,2}:\d\d\s*(AM|PM)\s*$/.test(e.textContent || '')).map((e) => (e.textContent || '').trim())[0] ?? null }));
if (R.gate.pill !== R.gate.clock) { console.log('CASEUI', JSON.stringify({ ...R, stop: 'Schedule clock does not match the browser — not judging (Rule 125)' })); await browser.close(); process.exit(1); }
try {
  if (only.includes('c96960')) { const c = S.c96960, o: any = (R.c96960 = {});
    await view(c.customer, 'Board View'); await toColumn(p, S.ES); await shot('c96960-1-board-before'); o.before = who(await cardIn(c.id, 'Board View'));
    await moveTo(c.id, S.RE, 'Board View'); o.prompt = await shiftPrompt(p, 'Keep shifts'); o.toasts = await toasts(p); o.after = who(await cardIn(c.id, 'Board View')); await shot('c96960-2-board-after-drag');
    await p.goto(`${APP}/workorders/${c.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
    o.labor = await p.evaluate((L) => Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map((e) => [L[e.getAttribute('data-test-id')!.replace('line_labor_name_', '')] ?? '?', (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim()])), c.labels);
    await shot('c96960-3-lines-after');
    const lines = await get(`/api/work-orders/lines/${c.id}`); const arr = Array.isArray(lines?.data) ? lines.data : lines?.data?.collection ?? lines?.data?.lines ?? [];
    const l6 = arr.find((l: any) => c.labels[l.line_id] === 'Line 6 Clocked'); o.line6ClockRunning = JSON.stringify(l6 ?? {}).includes('"end_date":null') || /clocked|running/i.test(JSON.stringify(l6?.tasks ?? [])); }
  if (only.includes('c96968')) { const c = S.c96968, o: any = (R.c96968 = {});
    for (const d of ['Board View', 'Tech View']) { const k: any = (o[d] = {});
      await view(c.customer, d); if (d === 'Board View') await toColumn(p, S.ES); k.before = who(await cardIn(c.id, d)); await shot(`c96968-${d.split(' ')[0]}-1-before`);
      await ctx.setOffline(true); await p.waitForTimeout(800);
      await moveTo(c.id, S.RE, d).catch((e) => { k.dragError = String(e).slice(0, 120); }); await p.waitForTimeout(2500);
      k.cardNow = who(await cardIn(c.id, d)); k.alerts = await toasts(p); await shot(`c96968-${d.split(' ')[0]}-2-offline-after-drag`);
      await p.waitForTimeout(10000); k.alerts10s = await toasts(p); await shot(`c96968-${d.split(' ')[0]}-3-after-10s`);
      const x = p.locator('.q-notification button').first(); if (await x.count()) { await x.click().catch(() => {}); await p.waitForTimeout(800); k.alertsAfterClose = await toasts(p); }
      await ctx.setOffline(false); await p.waitForTimeout(8000); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
      k.leadAfterReload = await leadOf(c.customer); await shot(`c96968-${d.split(' ')[0]}-4-after-reload`);
      if (k.leadAfterReload !== 'Esther Howard') { await p.evaluate(async ([u, id, s]) => fetch(u, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ work_order_id: id, tech_assigned_id: s }) }), [API + '/api/work-orders/change-lead-technician', c.id, S.ES]); k.resetToEsther = true; } } }
  if (only.includes('c368136')) { const c = S.c368136, o: any = (R.c368136 = { prompts: [] as any[] });
    const back = async (d: string) => { await view(c.customer, d); if (d === 'Board View') await toColumn(p, S.RE); await moveTo(c.id, S.ES, d); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500); };
    for (const d of ['Board View', 'Tech View']) {
      await view(c.customer, d); if (d === 'Board View') await toColumn(p, S.ES); await moveTo(c.id, S.RE, d); await p.waitForTimeout(800); await shot(`c368136-${d.split(' ')[0]}-drag`);
      o.prompts.push({ how: `${d} drag`, prompt: await shiftPrompt(p, 'Keep shifts'), lead: await leadOf(c.customer) }); await back(d);
      await view(c.customer, d); if (d === 'Board View') await toColumn(p, S.ES); const { item } = await openReassign(p, c.id, d === 'Board View' ? 'board' : 'tech'); await item.click(); await p.waitForTimeout(1500);
      await p.locator(`[data-test-id="option_lead_technician_${S.RE}"]`).click(); await p.waitForTimeout(500); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await p.waitForTimeout(800); await shot(`c368136-${d.split(' ')[0]}-dialog`);
      o.prompts.push({ how: `${d} Reassign dialog`, prompt: await shiftPrompt(p, 'Keep shifts'), lead: await leadOf(c.customer) }); await back(d); }
    // the work order page's own Lead Technician box
    await p.goto(`${APP}/workorders/${c.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    const lf = p.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Lead Technician/i }) }).first(); o.leadBox = await lf.count();
    if (o.leadBox) { await lf.click(); await p.waitForTimeout(1000); await p.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click().catch(() => {}); await p.waitForTimeout(2500); o.pagePrompt = await shiftPrompt(p, 'Keep shifts'); o.pageLead = await leadOf(c.customer); await shot('c368136-page-lead'); }
    // List: any way to change the lead from a row?
    await view(c.customer, 'List'); o.listMoreActions = await p.locator('[data-test-id="button_work_order_more_actions"]').count(); await shot('c368136-list');
    // Schedule tomorrow: Esther's 8:00-12:00 shift
    await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2000);
    await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(4000); o.day = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null);
    const fromISO = new Date(Date.now() - 86400000).toISOString(), toISO = new Date(Date.now() + 3 * 86400000).toISOString();
    const b = await get(`/api/schedule/board?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`); const found: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.startsAt && x.workOrder?.id === c.id) found.push(`${new Date(x.startsAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi' })} - ${new Date(x.endsAt).toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi' })}`); Object.values(x).forEach(walk); }; walk(b);
    o.shiftsTomorrow = [...new Set(found)]; await shot('c368136-schedule-tomorrow'); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EVD, 'ui.json'), JSON.stringify(R, null, 1)); console.log('CASEUI', JSON.stringify(R));
await browser.close(); process.exit(0);
