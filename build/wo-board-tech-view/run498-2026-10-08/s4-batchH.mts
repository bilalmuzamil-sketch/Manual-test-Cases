/** S4 batch H (2026-10-09): C96966 again with the shift itself read back after each Schedule edit (batch F could not
 *  prove the resize/reassign landed), and C96958 again with a line on the work order (the work order page's lead box
 *  did not appear for a work order with no lines). */
import { ME_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups, pickLeadOnPage, listAllOptions, findRow } from './wob.mts';
import { viewAs } from './viewas.mts';
import { staffRows, HEAVY, ensureEligible } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: { id: RUN.id.slice(0, 8), perms: RUN.perms, who: RUN.who, log: RUN.log } };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
const me = (await candidates(a)).find((x) => x.name === ME_NAME)!;
const nm: Record<string, string> = { [ES.staff_id]: 'Esther Howard', [RE.staff_id]: 'Ralph Edwards', [DO.staff_id]: 'Dana Ortiz' };
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id, DO.staff_id] } });
const bv = async (n: string, d = 'Board View', pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(600); };
const canned: any[] = (() => [])(); { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const lineTechs = async (wo: string, label: Record<string, string>) => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => [label[x.lineId] ?? x.lineId.slice(0, 6), `${(x.technicians ?? []).map((tt: any) => `${tt.firstName ?? ''} ${tt.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`]));
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
const taskOf = async (wo: string, line: string, staff: string) => ((await linesRaw(wo)).find((l: any) => l.line_id === line)?.tasks ?? []).find((x: any) => x.tech_assigned_id === staff)?.id;
async function asTech<T>(userId: string, f: () => Promise<T>): Promise<T> {
  let s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: userId }); } if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') });
  try { return await f(); } finally { await RUN.toRunner(); }
}
async function completeLine(wo: string, line: string) {
  await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' });
  await a.post('/api/work-orders/lines/change-story', { line_id: line, tech_story: 'Done', work_order_id: wo });
  const r = await a.post('/api/work-orders/lines/change-status', { line_id: line, status: 'complete', workOrderId: wo });
  const st = (await linesRaw(wo)).find((l: any) => l.line_id === line); return `${r.status} ${st?.status ?? st?.line_status ?? '?'}`;
}
const myTask = async () => JSON.stringify((await a.get('/api/technician-tasks/my-current-task')).body?.data ?? null).slice(0, 200);
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 12000));
  fs.writeFileSync(path.join(EV, 's4-batchH.json'), JSON.stringify(R, null, 1));
}

await run('C96966', async () => {
  const n = `ZZAUTOTEST F1 Status And Time Kept ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4ST');
  const wo = await workOrder(a, c, 'estimate', null); const l = await mkLine(wo, 1);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const tk = await taskOf(wo, l, ES.staff_id); const clock: any = {};
  await asTech(ES.id, async () => {
    clock.in1 = (await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: l, work_order_id: wo, refresh_lines: true })).status;
    await p.waitForTimeout(65_000);
    const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; clock.out1 = (await a.post('/api/technician-tasks/check-out', { task_id: cur?.technician_task?.id })).status;
    clock.in2 = (await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: l, work_order_id: wo, refresh_lines: true })).status;
    clock.running = await myTask();
  });
  await a.post('/api/work-orders/change-status', { id: wo, status: 'in_progress' });
  const num = (await workOrders(a, n))[0].number;
  const numbers = (o: any) => Object.fromEntries(Object.entries(o ?? {}).filter(([k, v]) => /hour|actual|duration|time_spent|labor_time|total_time/i.test(k) && (typeof v === 'number' || (typeof v === 'string' && /^[\d.:]+$/.test(v)))));
  R.C96966keys = { line: Object.keys((await linesRaw(wo)).find((x: any) => x.line_id === l) ?? {}).join(','), wo: Object.keys((await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order ?? {}).join(',') };
  const state = async () => { const w = (await workOrders(a, n))[0]; const ln = (await linesRaw(wo)).find((x: any) => x.line_id === l);
    const v = (await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order;
    return { status: w?.status, lead: w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none', line: numbers(ln), wo: numbers(v), tasks: (ln?.tasks ?? []).map((x: any) => numbers(x)) }; };
  /** 15 Oct 2026: the work order page as the tester reads it — the line's Actual hours ("0.02 / 2.00") and Total Hours */
  const woScreen = async (id: string, k: string) => { const pg = await p.context().newPage(); try { await pg.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(8000);
      const tx = ((await pg.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ');
      await pg.screenshot({ path: path.join(EV, `C96966-wo-page-${k}.png`) }).catch(() => {});
      // 15 Oct 2026 (wave 12): the page's status was read as the first status word anywhere ("Approved" can be a LINE's word); the
      // work order's own status card (status_card) and the status pill in it are read too, beside the record's status
      const statusCard = await pg.locator('[data-test-id="status_card"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim().slice(0, 200)).catch(() => null);
      // 15 Oct 2026 (wave 15): status_card does not exist on staging (read null); read the status pill beside the work order number in
      // the page's summary card (the number's own element, climbing until a status word appears) — this is what the tester reads
      const statusNearNumber = await pg.evaluate(`(() => { const num = ${JSON.stringify(num)}; const W = /In Progress|Approved|Estimate|On Hold|Waiting[^\\n]{0,20}|Review|Complete[d]?|Invoiced|Closed/;
        const start = document.querySelector('[data-test-id="text_wo_number"]') || [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && (e.textContent || '').trim() === num && e.getBoundingClientRect().width > 0);
        let a = start; for (let i = 0; i < 5 && a; i++, a = a.parentElement) { const tx = (a.innerText || '').replace(/\\s+/g, ' ').trim(); const m = tx.match(W); if (m) return { status: m[0], box: tx.slice(0, 120) }; } return start ? { status: null, box: (start.parentElement || start).innerText.slice(0, 120) } : null; })()`).catch((e) => String(e).slice(0, 120));
      const recordStatus = (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order?.status ?? null;
      return { actualHours: (tx.match(/\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?/g) || []).slice(0, 8), totalHours: (tx.match(/Total Hours[^0-9]{0,30}[\d.:]+/i) || [null])[0], firstStatusWordOnPage: (tx.match(/In Progress|Approved|Review|Complete/) || [null])[0], statusCard, statusNearNumber, recordStatus, leadNear: (tx.match(/Lead Technician[^A-Za-z]{0,10}[A-Za-z]+ [A-Za-z]+/) || [null])[0] }; }
    finally { await pg.close().catch(() => {}); } };
  R.C96966 = { wo: num, clock, before: await state(), screenBefore: await woScreen(wo, 'before') };
  // 15 Oct 2026 (wave 28, eighth pass): earlier runs left their own test shifts on Esther Howard's row tomorrow in the same hours
  // (other "Status And Time Kept" work orders at 8:00-12:00, "Sched Lines" ones at 12:45-14:45), stacked over ours, so the drags kept
  // grabbing THEIR blocks. Before making this run's shift, delete Esther Howard's other ZZAUTOTEST shifts tomorrow (staging test data,
  // Rule 107; DELETE /api/schedule/shifts/<id>?scope=shift as the Schedule does) and record what was removed.
  { const from = new Date(Date.now() - 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
    const found: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.id && x.startsAt && x.staffId === ES.staff_id) { found.push(x); return; } Object.values(x).forEach(walk); };
    walk((await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10); const removed: string[] = [];
    for (const x of found.filter((y) => String(y.startsAt).slice(0, 10) === tomorrow || String(y.endsAt).slice(0, 10) === tomorrow).slice(0, 30)) {
      const woId = x.workOrder?.id ?? x.workOrderId ?? null; const v = woId ? (await a.get(`/api/work-orders/view/${woId}`)).body?.data?.work_order : null; const cust = String(v?.company_name ?? v?.companyName ?? v?.company?.name ?? '');
      if (!/^ZZAUTOTEST/i.test(cust) && !/^ZZAUTOTEST/i.test(String(x.workOrder?.companyName ?? ''))) continue;
      const st = await p.evaluate(`fetch('${API}/api/schedule/shifts/${x.id}?scope=shift', { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.status).catch(() => 0)`).catch(() => 0);
      removed.push(`${String(x.id).slice(0, 8)} ${cust.slice(0, 40)} ${x.startsAt} -> ${st}`); }
    R.C96966pre = { esthersShiftsTomorrowFound: found.length, removed }; }
  const sh = await mkShift(a, wo, ES.staff_id, 1, '08:00', 240, []);
  const nm2 = { [ES.staff_id]: 'Esther Howard', [RE.staff_id]: 'Ralph Edwards', [DO.staff_id]: 'Dana Ortiz' };
  const nmOf = (id: any) => nm2[id] ?? (id ? String(id).slice(0, 8) : 'nobody');
  const board = async () => { const from = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
    let f: any = null; const walk = (x: any) => { if (!x || typeof x !== 'object' || f) return; if (Array.isArray(x)) return x.forEach(walk); if (x.id === sh && x.startsAt) { f = x; return; } Object.values(x).forEach(walk); };
    walk((await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body); return f; };
  const shiftNow = async () => { const s = await board(); return s ? `${nmOf(s.staffId)} ${s.startsAt} -> ${s.endsAt} (${s.durationMinutes} min)` : 'not found'; };
  R.C96966.shiftMade = await shiftNow(); R.C96966.shiftKeys = Object.keys((await board()) ?? {}).join(',');
  // 15 Oct 2026 (staging second pass): the three Schedule changes were made with the Schedule's own save call, not by dragging on
  // the Schedule screen as step 1 says, and the line's Actual hours / locked time were never read. Now step 1 is done ON THE
  // SCHEDULE SCREEN (tomorrow's day view, the stg-fix-new3.mts route): the shift block is dragged from 8 AM to 1 PM, its end
  // handle dragged from 5 PM back to 4 PM, then the block dragged onto Dana Ortiz's row; any dialog that opens is read and
  // confirmed. Each change is read back from the Schedule; ONLY if the screen drag did not land is the same change made with
  // the Schedule's own save (as before) and that is written in the log ("api fallback"). The work order page is read on screen
  // (line Actual hours and Total Hours) before and after, and the time-entry screens are looked at for any lock/approval.
  const s0 = await board(); const start = new Date(new Date(s0.startsAt).getTime() + 5 * 3600000);
  const writes: string[] = []; const hw = (q: any) => { if (/\/api\/schedule\/shifts/.test(q.url()) && q.method() !== 'GET') writes.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 80)} ${(q.postData() || '').slice(0, 220)}`); };
  const sp = await p.context().newPage(); sp.setDefaultTimeout(20_000); sp.on('request', hw);
  const sshot = (k: string) => sp.screenshot({ path: path.join(EV, `C96966-schedule-${k}.png`) }).catch(() => {});
  const confirmAny = async () => { await sp.waitForTimeout(1200); const d = sp.locator('.q-dialog').last(); if (!(await d.isVisible().catch(() => false))) return null; const txt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    if (/S\d*-\d+/.test(txt) && !txt.includes(num.replace(/^[A-Z]+\d*-/, ''))) { await d.locator('button').filter({ hasText: /^\s*Cancel\s*$/ }).last().click().catch(() => sp.keyboard.press('Escape')); await sp.waitForTimeout(1500); return 'REFUSED (another work order): ' + txt; }
    const btn = d.locator('button').filter({ hasText: /Save|Confirm|Move|Yes|Update|OK|Apply|Reassign|Keep/i }).last(); if (await btn.count()) { await btn.click().catch(() => {}); await sp.waitForTimeout(2500); } return txt; };
  const laneOf2 = async (staff: string) => { for (let i = 0; i < 80; i++) { if (await sp.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await sp.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await sp.waitForTimeout(300); if (!moved) break; } return (await sp.locator(`[data-staff-id="${staff}"]`).count()) > 0; };
  const openTomorrow = async () => { await sp.goto(APP + '/schedule', { waitUntil: 'domcontentloaded' }); await sp.waitForTimeout(9000);
    await sp.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await sp.waitForTimeout(2500);
    await sp.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); if (!today) return; const tr = today.getBoundingClientRect();
      const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); if (near[1]) near[1].click(); })()`);
    await sp.waitForTimeout(6000); await laneOf2(ES.staff_id); return sp.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null); };
  const hours = async (labels: string[]) => { const first = sp.getByText(new RegExp('^\\s*' + labels[0].replace(' ', '\\s*') + '\\s*$')).first(); await first.scrollIntoViewIfNeeded().catch(() => {}); await sp.waitForTimeout(500);
    const xs: Record<string, number | null> = {}; for (const l of labels) xs[l] = (await sp.getByText(new RegExp('^\\s*' + l.replace(' ', '\\s*') + '\\s*$')).first().boundingBox().catch(() => null))?.x ?? null; return xs; };
  // 15 Oct 2026 (wave 12, fourth pass): the block was looked for by "S2-35915" but the Schedule writes the number as "S-35915" (the
  // clock label reads the same), so it was never found. Now the block is matched by its digits (S<any>-35915); if it is still not
  // drawn, the Schedule's own search (magnifier > input_schedule_search, the stg-fix-new3 / stg6-sched2 route) is used on that day.
  const NUMRX = new RegExp(num.replace(/^[A-Z]+\d*-/, '[A-Z]+\\d*-') + '\\b');
  // 15 Oct 2026 (wave 15, fifth pass): the Schedule's search found the work order ("1 match", picture C96966-schedule-found) but the
  // block shows the CUSTOMER name ("ZZAUTOTEST F1 Status And Time Kept 56957") and no number, so a match on the number never found it
  // and the move timed out. tagBlock() finds the block by the customer name (else the number), climbs to the block itself (a class
  // naming event/shift/block, else the last ancestor before a much wider lane) and tags it; block() returns the tagged element.
  // 15 Oct 2026 (wave 24, sixth pass): the 30-character prefix fallback ("ZZAUTOTEST F1 Status And Time ") matched an EARLIER run's block,
  // so the on-screen move dragged another shift (PATCH for a different shift id) and the API fallback moved ours. Only this run's
  // full customer name (it ends in this run's number) or the work order number may match now.
  const tagBlock = async () => (S_tag.last = await sp.evaluate(`(() => { document.querySelectorAll('[data-zz-block]').forEach(e => e.removeAttribute('data-zz-block'));
    const n = ${JSON.stringify(n)}, rx = new RegExp(${JSON.stringify(NUMRX.source)}); const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 20 && b.height > 8 && b.x > 520; };
    let el = [...document.querySelectorAll('.fc-event')].find(e => vis(e) && ((e.innerText || '').includes(n) || rx.test(e.innerText || '')));
    if (!el) { const leaves = [...document.querySelectorAll('div, span, p, a')].filter(e => e.children.length <= 3 && vis(e));
      const leaf = leaves.find(e => (e.textContent || '').trim().startsWith(n)) || leaves.find(e => rx.test((e.textContent || '').trim().slice(0, 40)));
      if (leaf) { let a = leaf, named = null; for (let i = 0; i < 7 && a; i++, a = a.parentElement) if (/fc-event|event|shift|block/i.test(String(a.className))) { named = a; break; }
        if (named) el = named; else { el = leaf; while (el.parentElement) { const c = el.getBoundingClientRect(), pr = el.parentElement.getBoundingClientRect(); if (pr.height > 120 || pr.width > 1.5 * Math.max(c.width, 100)) break; el = el.parentElement; } } } }
    if (!el) return null; el.setAttribute('data-zz-block', '1'); const b = el.getBoundingClientRect();
    return { how: el.classList.contains('fc-event') ? 'fc-event' : 'customer name', cls: String(el.className).slice(0, 80), x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; })()`).catch((e) => String(e).slice(0, 120)));
  const S_tag: any = {};
  const block = () => sp.locator('[data-zz-block="1"]').first();
  // 15 Oct 2026 (wave 27, seventh pass): matching by the customer name still dragged OTHER shifts — the move PATCHed shift 715fdca2 and
  // the reassign dialog read "Reassign shift S2-36076 · ZZAUTOTEST Sched Lines 30846" (and was confirmed). Now each block whose text
  // carries this run's customer name is OPENED and its details' work order number read; only the block whose details name this
  // work order is tagged. The old finder is the fallback, and confirmAny() refuses any dialog that does not name this work order.
  const digits = num.replace(/^[A-Z]+\d*-/, '');
  const findOwn = async () => { const cands = sp.locator('.fc-event').filter({ hasText: n }); const k = Math.min(await cands.count().catch(() => 0), 6); S_tag.own = { candidates: k, read: [] as string[] };
    for (let i = 0; i < k; i++) { const c = cands.nth(i); await c.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {}); const bb = await c.boundingBox().catch(() => null);
      // eighth pass: c.click() opened nothing ("no details"); click the block's own top-left area with the mouse, as high1-fix5 does
      if (bb) await sp.mouse.click(bb.x + Math.min(20, bb.width / 3), bb.y + Math.min(10, bb.height / 3)); else await c.click({ timeout: 5000 }).catch(() => {}); await sp.waitForTimeout(1800);
      const wn = ((await sp.locator('[data-test-id="text_shift_detail_work_order"]').first().innerText({ timeout: 3000 }).catch(() => '')) || ((await sp.locator('.q-dialog, .q-menu, [role=dialog]').last().innerText({ timeout: 3000 }).catch(() => '')).match(/S\d*-\d+/) || [''])[0]).replace(/\s+/g, '');
      await sp.locator('[data-test-id="button_close_dialog"]').first().click({ timeout: 3000 }).catch(() => sp.keyboard.press('Escape').catch(() => {})); await sp.waitForTimeout(700); S_tag.own.read.push(wn || '(no details)');
      if (wn.endsWith(digits)) { await c.evaluate((e) => { document.querySelectorAll('[data-zz-block]').forEach((x) => x.removeAttribute('data-zz-block')); e.setAttribute('data-zz-block', '1'); }).catch(() => {}); S_tag.own.picked = i; return true; } }
    return false; };
  const blk = async () => { if (!(await findOwn())) await tagBlock(); return block(); };
  const searchSched = async () => { if (await (await blk()).count()) return false; if (!(await sp.locator('[data-test-id="input_schedule_search"]').isVisible().catch(() => false))) { await sp.locator('button').filter({ hasText: /^\s*search\s*$/ }).last().click().catch(() => sp.mouse.click(1300, 84)); await sp.waitForTimeout(1000); }
    const sb = sp.locator('[data-test-id="input_schedule_search"]'); await sb.fill(''); await sb.fill(num); await sp.waitForTimeout(4000); if (!(await (await blk()).count())) { await sb.fill(num.replace(/^[A-Z]+\d*-/, '')); await sp.waitForTimeout(4000); }
    await sp.evaluate(`document.querySelector('.fc-event')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await sp.waitForTimeout(800); return true; };
  const S: any = { day: await openTomorrow() }; S.searched = await searchSched(); S.blocksDrawn = await sp.locator('.fc-event').allInnerTexts().then((x) => x.map((y) => y.replace(/\s+/g, ' ').slice(0, 60)).slice(0, 6)).catch(() => []); await sshot('found');
  const ok = (want: RegExp) => async () => want.test(await shiftNow());
  // (a) move 8 AM -> 1 PM
  { const xs = await hours(['8 AM', '1 PM']); const e = await blk(); S_tag['at' + Object.keys(S_tag).length] = S_tag.last; S.blockFound = await e.count(); await e.scrollIntoViewIfNeeded().catch(() => {}); await sp.waitForTimeout(600); const bx = await e.boundingBox();
    if (bx && xs['8 AM'] !== null && xs['1 PM'] !== null) { const dx = xs['1 PM']! - xs['8 AM']!; const gx = bx.x + Math.min(30, bx.width / 3), gy = bx.y + bx.height / 2;
      await sp.mouse.move(gx, gy); await sp.mouse.down(); await sp.mouse.move(gx + 12, gy, { steps: 4 }); await sp.mouse.move(gx + dx, gy, { steps: 25 }); await sp.waitForTimeout(400); await sp.mouse.up(); S.moveDialog = await confirmAny(); }
    await sp.waitForTimeout(2000); S.afterMoveScreen = await shiftNow(); await sshot('after-move');
    if (!(await ok(/T08:00:00Z|13:00/)())) { const moved = await shiftNow(); S.moveApiFallback = (await a.patch(`/api/schedule/shifts/${sh}`, { startsAt: start.toISOString(), isAllDay: false, reassign: false, changeNote: false, scope: 'shift' })).status; S.moveNote = `screen drag did not land (${moved}); api fallback`; } }
  R.C96966.blockTags = S_tag; R.C96966.move = S; R.C96966.afterMove = { shift: await shiftNow(), ...(await state()) };
  // (b) resize: end 5 PM -> 4 PM
  { const S2: any = {}; await openTomorrow(); S2.searched = await searchSched(); const xs = await hours(['4 PM', '5 PM']); const e = await blk(); S_tag['at' + Object.keys(S_tag).length] = S_tag.last; await e.scrollIntoViewIfNeeded().catch(() => {}); await e.hover().catch(() => {}); await sp.waitForTimeout(600);
    const rz = e.locator('.fc-event-resizer-end, .fc-event-resizer').last(); S2.handle = await rz.count(); const rb = (await rz.boundingBox().catch(() => null)) ?? null; const eb = await e.boundingBox();
    if (eb && xs['4 PM'] !== null && xs['5 PM'] !== null) { const dx = xs['4 PM']! - xs['5 PM']!; const gx = rb ? rb.x + rb.width / 2 : eb.x + eb.width - 3, gy = rb ? rb.y + rb.height / 2 : eb.y + eb.height / 2;
      await sp.mouse.move(gx, gy); await sp.mouse.down(); await sp.mouse.move(gx - 6, gy, { steps: 3 }); await sp.mouse.move(gx + dx, gy, { steps: 20 }); await sp.waitForTimeout(400); await sp.mouse.up(); S2.dialog = await confirmAny(); }
    await sp.waitForTimeout(2000); S2.afterScreen = await shiftNow(); await sshot('after-resize');
    if (!/180 min/.test(S2.afterScreen)) { const r2 = await a.patch(`/api/schedule/shifts/${sh}`, { startsAt: start.toISOString(), durationMinutes: 180, isAllDay: false, reassign: false, changeNote: false, scope: 'shift' }); S2.apiFallback = r2.status; S2.note = 'screen resize did not land; api fallback'; }
    R.C96966.resize = S2; }
  R.C96966.afterResize = { shift: await shiftNow(), ...(await state()) };
  // (c) onto Dana Ortiz's row
  { const S3: any = {}; await openTomorrow(); S3.danaLane = await laneOf2(DO.staff_id); const e = await blk(); S_tag['at' + Object.keys(S_tag).length] = S_tag.last; await e.scrollIntoViewIfNeeded().catch(() => {}); await sp.waitForTimeout(600);
    const eb = await e.boundingBox(); const lb = await sp.locator(`[data-staff-id="${DO.staff_id}"]`).first().boundingBox().catch(() => null); S3.bothOnScreen = !!(eb && lb && lb.y > 0 && lb.y < 1000);
    // 15 Oct 2026 (wave 24, sixth pass): Dana Ortiz's row was off screen (bothOnScreen false) so the drop missed and the API fallback
    // did the reassign. Now the block is HELD while the Schedule's own scroller is moved toward her row (at most 40 steps of 300 px),
    // and it is dropped only once her row is on screen; the number of held scrolls and whether her row was on screen are recorded.
    if (eb && lb) { const gx = eb.x + Math.min(30, eb.width / 3), gy = eb.y + eb.height / 2; await sp.mouse.move(gx, gy); await sp.mouse.down(); await sp.mouse.move(gx, gy + 8, { steps: 3 });
      const onScr = (b: any) => !!(b && b.y > 140 && b.y + b.height < 950); let lb2: any = lb, tries = 0;
      while (tries < 40) { lb2 = await sp.locator(`[data-staff-id="${DO.staff_id}"]`).first().boundingBox().catch(() => null); if (onScr(lb2)) break; tries++;
        const dir = !lb2 || lb2.y < 140 ? -1 : 1;
        await sp.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || document.scrollingElement; s.scrollTop += ${dir} * 300; })()`);
        await sp.mouse.move(gx + (tries % 2 ? 2 : -2), gy + 8, { steps: 2 }); await sp.waitForTimeout(250); }
      S3.heldScrolls = tries; S3.laneOnScreenAtDrop = onScr(lb2);
      if (lb2) await sp.mouse.move(gx, lb2.y + lb2.height / 2, { steps: 25 }); await sp.waitForTimeout(400); await sp.mouse.up(); S3.dialog = await confirmAny(); }
    await sp.waitForTimeout(2000); S3.afterScreen = await shiftNow(); await sshot('after-reassign');
    if (!/^Dana Ortiz/.test(S3.afterScreen)) { const ra = await a.patch(`/api/schedule/shifts/${sh}`, { staffId: DO.staff_id, startsAt: start.toISOString(), isAllDay: false, reassign: true, changeNote: false, scope: 'shift' }); S3.apiFallback = ra.status; S3.note = 'screen drag to Dana Ortiz did not land; api fallback'; }
    R.C96966.reassign = S3; }
  R.C96966.scheduleWrites = writes; await sp.close();
  R.C96966.afterReassign = { shift: await shiftNow(), ...(await state()) };
  R.C96966.screenAfterSchedule = await woScreen(wo, 'after-schedule');
  await bv(n); await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120);
  R.C96966.prompt = await shiftPrompt(p, 'Clear shifts'); await p.waitForTimeout(1500); R.C96966.message = await toasts(p);
  R.C96966.afterLeadChange = { shift: await shiftNow(), ...(await state()) };
  R.C96966.screenAfterLeadChange = await woScreen(wo, 'after-lead-change');
  // locked time: look for any lock / approval control on the work order's Timesheets screen and on Reports > Timesheet Activities
  { const pg = await p.context().newPage(); const L: any = {};
    try { await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000);
      await pg.locator('[data-test-id="button_work_order_nav_bar_menu"]').click().catch(() => {}); await pg.waitForTimeout(800); await pg.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click().catch(() => {}); await pg.waitForTimeout(4000);
      const tx = ((await pg.evaluate(`(document.querySelector('.q-dialog, main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ');
      L.workOrderTimesheets = { lockOrApprovalWords: (tx.match(/[^.]{0,40}(lock|approv)[^.]{0,40}/gi) || []).slice(0, 5), text: tx.slice(0, 300) }; await pg.screenshot({ path: path.join(EV, 'C96966-timesheets.png') }).catch(() => {});
      await pg.goto(`${APP}/reports/punch-clock-activities`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000);
      const tx2 = ((await pg.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ');
      L.timesheetActivities = { lockOrApprovalWords: (tx2.match(/[^.]{0,40}(lock|approv)[^.]{0,40}/gi) || []).slice(0, 5), buttons: await pg.evaluate(`[...document.querySelectorAll('button')].map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /lock|approv/i.test(x))`) };
    } catch (e: any) { L.error = String(e?.message || e).slice(0, 160); } finally { await pg.close().catch(() => {}); }
    R.C96966.lockedTime = L; }
  R.C96966.clockStillRunning = await asTech(ES.id, myTask);
  R.C96966.stopClock = await asTech(ES.id, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; return cur?.technician_task?.id ? (await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id })).status : 'no clock running'; });
});

await run('C96958', async () => {
  const n = `ZZAUTOTEST F1 Lead Notifications ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4LN');
  const wo = await workOrder(a, c, 'estimate', null); await mkLine(wo, 1);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const num = (await workOrders(a, n))[0].number;
  // 15 Oct 2026 (wave 10, staging third pass): "Ralph Edwards" was not offered in the work order page's Lead Technician list, so the
  // script stopped at step 1. Make the three people eligible leads at Heavy Duty first (ensureEligible: active, enrolled in Service,
  // Time Clock on, Location Heavy Duty) and pick on the page with pickLeadOnPage (test-id field, else the field labelled Lead Technician).
  const eligible = { 'Esther Howard': await ensureEligible(a, ES, 'Esther'), 'Ralph Edwards': await ensureEligible(a, RE, 'Ralph'), 'Dana Ortiz': await ensureEligible(a, DO, 'Dana') };
  const people: Record<string, any> = { 'Esther Howard': ES, 'Ralph Edwards': RE, 'Dana Ortiz': DO };
  // 15 Oct 2026 (wave 24): the RESULT of C96958 is the technicians' empty Notifications pages, so each read after a lead change
  // photographs that person's own Notifications page (tag given) — the earlier passes had readings but no picture of the result.
  const read = async (who: string, tag = '') => {
    const v = await viewAs(browser, p, a, people[who].id, me.id, RUN.toRunner); const got: string[] = [];
    v.page.on('response', (r) => { if (/note|notif|mention/i.test(r.url()) && r.request().method() === 'GET') got.push(`${r.status()} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)}`); });
    try { await v.page.goto(`${APP}/notifications`, { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(6000);
      const tg = v.page.locator('[data-test-id="toggle_unread_only"]'); if (await tg.count() && (await tg.getAttribute('aria-checked')) === 'true') { await tg.click(); await v.page.waitForTimeout(3500); }
      const items = await v.page.evaluate(`[...document.querySelectorAll('.note-item')].map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 160))`) as string[];
      const empty = await v.page.getByText('There are no notifications').count();
      if (tag) await shot(v.page, `C96958-notifications-${tag}-${who.split(' ')[0].toLowerCase()}`);
      const bell = await v.page.evaluate(`(() => { const b = [...document.querySelectorAll('header .q-badge, .q-header .q-badge')].map(x => x.innerText.trim()); return b; })()`);
      return { count: items.length, mentionsWo: items.filter((x) => x.includes(num) || /lead tech/i.test(x)), top: items.slice(0, 2), empty: !!empty, bell, calls: [...new Set(got)].slice(0, 3) };
    } finally { await v.close(); }
  };
  R.C96958 = { wo: num, eligible, candidates: (await candidates(a)).filter((x) => Object.keys(people).includes(x.name)).map((x) => x.name), base: { 'Esther Howard': await read('Esther Howard'), 'Ralph Edwards': await read('Ralph Edwards'), 'Dana Ortiz': await read('Dana Ortiz') } };
  // 15 Oct 2026 (wave 15, fifth pass): Ralph Edwards was never drawn in the page's Lead Technician list (it scrolled 19 times and
  // still showed only the D names), while Dana Ortiz was offered at once. The case names the people only as examples, so the roles
  // are now Tech-A = Esther Howard, Tech-B = Dana Ortiz (picked on the page), Tech-C = Ralph Edwards (board drag target). If Dana is not
  // picked either, the whole list is recorded (listAllOptions) before the lead is set behind the screen.
  // step 1: the work order page, Esther -> Dana
  { const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(8000);
    await shot(pg, 'C96958-wo-page');
    R.C96958.woPagePick = await pickLeadOnPage(pg, 'Dana', 'Dana Ortiz'); await shot(pg, 'C96958-wo-page-after-pick');
    if (!R.C96958.woPagePick?.picked) { const sel = (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]') : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
      await sel.click().catch(() => {}); await pg.waitForTimeout(1500); R.C96958.woPageAllOptions = await listAllOptions(pg).catch((e) => [String(e).slice(0, 120)]); await pg.keyboard.press('Escape').catch(() => {}); }
    await pg.close(); }
  R.C96958.leadAfterWoPage = (await workOrders(a, n))[0]?.techAssignedFirstName;
  // if the page could not pick her, say so and set the lead behind the screen so the later steps still have Dana as the lead to start from
  if (R.C96958.leadAfterWoPage !== 'Dana') { R.C96958.step1NotOnScreen = `work order page did not set Dana (${JSON.stringify(R.C96958.woPagePick).slice(0, 200)}); lead set by API for steps 2+`;
    await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: DO.staff_id }); R.C96958.leadAfterApi = (await workOrders(a, n))[0]?.techAssignedFirstName; }
  await p.waitForTimeout(20_000);
  R.C96958.afterWoPage = { 'Esther Howard': await read('Esther Howard', 'after-wo-page'), 'Dana Ortiz': await read('Dana Ortiz', 'after-wo-page') };
  // board drag Dana -> Ralph
  await bv(n); await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96958.boardMessage = await toasts(p); R.C96958.leadAfterBoard = (await workOrders(a, n))[0]?.techAssignedFirstName; await shot(p, 'C96958-board-after-drag');
  await p.waitForTimeout(20_000);
  R.C96958.afterBoard = { 'Dana Ortiz': await read('Dana Ortiz', 'after-board'), 'Ralph Edwards': await read('Ralph Edwards', 'after-board') };
  // Tech View reassign Ralph -> Esther. Fifth pass: the row was never found (hover timed out) because Unassigned (~3,450 rows on
  // staging) opens expanded and pushes Ralph's group out of the drawn rows (L0360). Close Unassigned first, then bring the row on
  // screen in Ralph's group and centre it before hovering.
  await bv(n, 'Tech View');
  if (await p.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="false"]').count()) { await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click().catch(() => {}); await p.waitForTimeout(1800); R.C96958.unassignedClosed = true; }
  await expandSmallGroups(p); R.C96958.techRowGroup = await findRow(p, wo, RE.staff_id).catch((e) => `findRow: ${String(e).slice(0, 100)}`);
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_row_${wo}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await p.waitForTimeout(800);
  const o = await openReassign(p, wo, 'tech'); await o.item.click(); await p.waitForTimeout(1200);
  await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96958.techMessage = await toasts(p); R.C96958.leadAfterTech = (await workOrders(a, n))[0]?.techAssignedFirstName; await shot(p, 'C96958-tech-after-reassign');
  await p.waitForTimeout(20_000);
  R.C96958.afterTech = { 'Ralph Edwards': await read('Ralph Edwards', 'after-tech-view'), 'Esther Howard': await read('Esther Howard', 'after-tech-view') };
});

await RUN.end();
fs.writeFileSync(path.join(EV, 's4-batchH.json'), JSON.stringify(R, null, 1));
await done(browser);
