/** C368179 on STAGING, 16 Oct 2026 (batch 40) — a Schedule drop placed EXACTLY on the hour line, with a positive control.
 *  Why: the 16 Oct drop was aimed from the heading TEXT (+17.6 px) and saved 12:45 for 1 PM while the same offset saved 9:00 for 9 AM
 *  (L0400), so the drop point was not a proved instrument. Read from the app's own code (Schedule chunks, v26.40.19): the Schedule is a
 *  FullCalendar resource timeline, day view, snapDuration "00:15"; a work order dropped from the sidebar becomes a FullCalendar
 *  external drop whose start is the 15-minute snap slot under the POINTER. The hour lines are FullCalendar slot cells carrying
 *  data-date (…T13:00:00…). So: find the 13:00 slot cell, read its left edge and the next hour's (px per hour), and release the pointer
 *  an eighth of an hour right of the line (the middle of 13:00–13:15). While the mouse is still held, FullCalendar's own drop
 *  highlight/mirror is read and photographed (where the app itself says the drop will land). Positive control FIRST, same method:
 *  a second work order dropped on the 9 AM line (entire work order, 2h) must save 9:00.
 *  Rule 125: location zone Asia/Karachi and browser TZ Asia/Karachi (stg6-tz.mts exit 0 before this run). The day is the next working
 *  day of Esther Howard ("tomorrow" is a Saturday, a non-working day: the window then cannot read the shop's hours); any shift already
 *  on her row that day is deleted first (the case needs her free 1–4 PM). json EV/C368179-b40.json, pictures C368179-b40-*. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, toasts } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/schedule'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status, browserZone: await p.evaluate('Intl.DateTimeFormat().resolvedOptions().timeZone') };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C368179-b40-${n}.png`) }).catch(() => {});
const W = (ms: number) => p.waitForTimeout(ms); const RUNNO = String(Date.now() % 100000);
const D = '@staging.shopview.local'; const ES = (await staffRows(a, `zz.wob.esther.howard${D}`)).find((x) => x.email === `zz.wob.esther.howard${D}`);
if (!ES) { console.log('NO ESTHER'); await done(browser, 1); }
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const lineName = (i: number) => String(canned[i % canned.length].canned_line_name ?? canned[i % canned.length].name ?? '').trim();
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
const one = async (name: string) => { const c = await customer(a, `${name} ${RUNNO}`, 'TRK-118'); const id = await workOrder(a, c, 'estimate', null); const ls: string[] = [];
  for (const i of [1, 2]) ls.push((await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: canned[i].id, status: 'authorized' })).body?.data?.line_id);
  await a.post('/api/work-orders/change-status', { id, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: ES.staff_id });
  return { id, ls, number: (await workOrders(a, `${name} ${RUNNO}`)).find((w: any) => w.id === id)?.number, q: `${name} ${RUNNO}` }; };
const dlg = () => p.locator('.q-dialog:visible').last();
/** Line 1's Estimated Time to `hours` in Edit Line (a 2h shift needs work estimated at 2h or more, high1-fix5 FIX 2) */
async function setEstimate(w: any, hours: string) { await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); await p.getByText(lineName(1), { exact: false }).first().click(); await W(2500);
  const d = dlg(); await d.locator('[data-test-id="input_time_estimate"]').fill(hours); await d.locator('.text-h6, .q-card__section').first().click({ position: { x: 5, y: 5 } }).catch(() => {});
  await d.locator('[data-test-id="button_save_close"], button:has-text("Save & Close")').first().click(); await W(3500); return toasts(p); }
const rangeText = () => p.locator('[data-test-id="text_schedule_range"]').innerText().then((x) => x.trim()).catch(() => '');
async function laneOf(staff: string) { for (let i = 0; i < 60; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await W(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; }
async function toDay(target: string | null) { await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await W(3000);
  for (let i = 0; i < 10; i++) { await p.locator('[data-test-id="button_schedule_next"]').click(); await W(3000); const r = await rangeText(); if (target ? r === target : !/Sat|Sun/.test(r)) { if (!target) { await laneOf(ES.staff_id); const txt = await p.locator(`[data-staff-id="${ES.staff_id}"]`).first().innerText().catch(() => ''); if (/Not working/i.test(txt)) continue; } return r; } } return null; }
/** shifts on Esther's row on the board between d0 and d1 (the Schedule's own board call) */
async function herShifts(d0: string, d1: string) { const out: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.staffId === ES.staff_id && x.startsAt && x.id) out.push({ id: x.id, startsAt: x.startsAt, endsAt: x.endsAt, wo: x.workOrder?.number ?? null }); Object.values(x).forEach(walk); };
  walk((await a.get(`/api/schedule/board?from=${encodeURIComponent(d0)}&to=${encodeURIComponent(d1)}`)).body); return out.filter((v, i, arr) => arr.findIndex((u) => u.id === v.id) === i); }
const delShift = (id: string) => p.evaluate(async ([api0, id0]) => { const r = await fetch(`${api0}/api/schedule/shifts/${id0}?scope=shift`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status} ${(await r.text()).slice(0, 100)}`; }, [API, id]);
/** the hour slot cells FullCalendar draws (data-date …T<HH>:00), left edges, and px per hour */
const slotCells = (hh: string) => p.evaluate(`[...document.querySelectorAll('[data-date]')].filter(e => (e.getAttribute('data-date') || '').includes('T${hh}:00:00') && e.getBoundingClientRect().width > 0).map(e => ({ tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 70), date: e.getAttribute('data-date'), left: Math.round(e.getBoundingClientRect().left * 10) / 10, top: Math.round(e.getBoundingClientRect().top), width: Math.round(e.getBoundingClientRect().width * 10) / 10 })).slice(0, 6)`) as Promise<any[]>;
const fcHints = () => p.evaluate(`[...document.querySelectorAll('.fc-highlight, .fc-event-mirror, .fc-event-dragging, [class*="drop-preview"], [class*="dropPreview"], [class*="ghost"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ cls: String(e.className).slice(0, 80), left: Math.round(e.getBoundingClientRect().left * 10) / 10, width: Math.round(e.getBoundingClientRect().width), text: (e.innerText || '').replace(/\\s+/g, ' ').slice(0, 80) })).slice(0, 6)`) as Promise<any[]>;
async function dropOn(w: any, hh: string, tag: string, choose: string | null) { const r: any = { wo: w.number };
  const posted: string[] = []; const hr = async (x: any) => { if (x.request().method() === 'POST' && /\/api\/schedule\/shifts/.test(x.url())) posted.push(`${x.status()} ${(await x.text().catch(() => '')).slice(0, 400)}`); }; p.on('response', hr);
  await p.locator('[data-test-id="input_sidebar_search"]').fill(w.number); await W(3000); const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: w.number }).first(); r.card = await card.count();
  await laneOf(ES.staff_id); const lane = p.locator(`[data-staff-id="${ES.staff_id}"]`).first(); await lane.scrollIntoViewIfNeeded().catch(() => {});
  // bring the hour into view inside the timeline's own scroller, let it settle, measure LAST
  await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-date]')].find(x => (x.getAttribute('data-date') || '').includes('T${hh}:00:00') && x.getBoundingClientRect().width > 0); if (e) e.scrollIntoView({ inline: 'center', block: 'nearest' }); })()`).catch(() => {}); await W(1500);
  await lane.scrollIntoViewIfNeeded().catch(() => {}); await W(800);
  const cells = await slotCells(hh); const nextHH = String(Number(hh) + 1).padStart(2, '0'); const cellsN = await slotCells(nextHH); r.cells = cells; r.cellsNext = cellsN.slice(0, 2);
  const laneCell = cells.find((c: any) => /lane/.test(c.cls)) ?? cells.find((c: any) => c.tag === 'td') ?? cells[0]; const nextCell = cellsN.find((c: any) => c.cls === laneCell?.cls) ?? cellsN[0];
  const lb = await lane.boundingBox(); const cb = await card.boundingBox();
  if (!laneCell || !nextCell || !lb || !cb) { r.error = `missing ${!laneCell ? 'hour cell' : !nextCell ? 'next hour cell' : !lb ? 'lane' : 'card'}`; p.off('response', hr); return r; }
  const pxH = nextCell.left - laneCell.left; const x = laneCell.left + pxH / 8; const y = lb.y + lb.height / 2; r.aim = { lineX: laneCell.left, pxPerHour: pxH, releaseX: Math.round(x * 10) / 10, minutesPastLine: Math.round((x - laneCell.left) / pxH * 600) / 10, from: `${laneCell.tag}.${laneCell.cls}` };
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + cb.width / 2 + 20, cb.y + cb.height / 2 + 10, { steps: 5 });
  await p.mouse.move(x, y, { steps: 25 }); await W(900); await p.mouse.move(x, y); await W(600);
  // the line may have moved while dragging (auto-scroll): re-measure and correct once before letting go
  const again = (await slotCells(hh)).find((c: any) => c.cls === laneCell.cls); r.lineWhileHeld = again?.left ?? null;
  if (again && Math.abs(again.left - laneCell.left) > 0.5) { const x2 = again.left + pxH / 8; await p.mouse.move(x2, y, { steps: 5 }); await W(600); r.corrected = Math.round(x2 * 10) / 10; }
  r.appHintWhileHeld = await fcHints(); await shot(`${tag}-held`);
  await p.mouse.up(); await W(3000);
  const d = dlg(); r.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  // 16 Oct 2026 (second go): "Choose lines" is a TAB of the window; click the tab itself, photograph the line list, then tick Line 1
  if (choose) { await d.locator('.q-tab, [role=tab]').filter({ hasText: /Choose lines/i }).first().click().catch(async () => { await d.getByText(/^\s*Choose lines\s*$/i).last().click().catch(() => {}); }); await W(1200); r.chooseText = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot(`${tag}-choose`); const row = d.locator('.q-item, [class*="line"], div').filter({ hasText: new RegExp(choose.slice(0, 18), 'i') }).filter({ has: p.locator('.q-checkbox') }).last(); await row.locator('.q-checkbox').first().click().catch(() => {}); await W(600); await d.locator('button').filter({ hasText: /Select lines/i }).first().click().catch(() => {}); await W(1200); }
  for (let i = 0; i < 24; i++) { const hrs = await d.evaluate((e) => { const s = e.querySelector('.drop-single-day__step--start'); const lab = s && s.parentElement ? (s.parentElement as HTMLElement).innerText : (e as HTMLElement).innerText; return (lab.match(/(\d+(?:\.\d+)?)\s*h\b/) || [])[1] ?? null; }).catch(() => null); r.hours = hrs; if (hrs === '2') break;
    const btn = d.locator(Number(hrs) > 2 ? '[data-test-id="button_drop_single_day_decrement"]' : '[data-test-id="button_drop_single_day_increment"]').first(); if (!(await btn.count()) || await btn.isDisabled()) { r.stepperStopped = `at ${hrs}h`; break; } await btn.click(); await W(250); }
  r.dialogBeforeCreate = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot(`${tag}-dialog`);
  const create = d.locator('button').filter({ hasText: /Create/ }).last(); r.createLabel = (await create.innerText().catch(() => null))?.replace(/\s+/g, ' '); await create.click().catch(() => {}); await W(3500); r.toasts = await toasts(p); r.dialogStillOpen = await d.isVisible().catch(() => false);
  p.off('response', hr); r.savePosted = posted.map((s0) => s0.replace(/"(color|note|departmentId|seriesId)":[^,]*,/g, ''));
  const m = /"startsAt":"([^"]+)","endsAt":"([^"]+)"/.exec(posted.join(' ')); if (m) { const fmt = (s0: string) => new Date(s0).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Karachi' }); r.saved = `${fmt(m[1])} – ${fmt(m[2])} (Asia/Karachi)`; }
  await shot(`${tag}-created`); return r; }
try {
  o.esther = String(ES.staff_id).slice(0, 8);
  o.control = await one('ZZAUTOTEST Sched Entire'); o.wo1 = await one('ZZAUTOTEST Schedule Choose Lines');
  o.estimateControl = await setEstimate(o.control, '2'); o.estimateWo1 = await setEstimate(o.wo1, '2');
  o.estimatesRead = {}; for (const w of [o.control, o.wo1]) { const d0 = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; o.estimatesRead[w.number] = (Array.isArray(d0) ? d0 : d0?.collection ?? []).map((l: any) => l.time_estimate); }
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await W(8000); o.day = await toDay(null); o.dayIso = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-date]')].find(x => /T09:00:00/.test(x.getAttribute('data-date') || '')); return e ? e.getAttribute('data-date') : null; })()`);
  // clear Esther's row that day (the case needs nothing scheduled 1–4 PM); every deletion answered and listed
  if (o.dayIso) { const d0 = new Date(new Date(o.dayIso).getTime() - 12 * 3600e3).toISOString(), d1 = new Date(new Date(o.dayIso).getTime() + 18 * 3600e3).toISOString();
    o.existing = await herShifts(d0, d1); o.deleted = []; for (const s0 of o.existing) o.deleted.push(`${s0.wo ?? '?'} ${s0.startsAt}: ${await delShift(s0.id)}`); o.leftAfter = (await herShifts(d0, d1)).length;
    await p.reload({ waitUntil: 'domcontentloaded' }); await W(8000); o.dayAfterReload = await toDay(o.day); }
  o.nowPill = await p.evaluate(`[...document.querySelectorAll('div,span')].filter(e => e.children.length === 0 && /^\\s*\\d{1,2}:\\d\\d\\s*(AM|PM)\\s*$/.test(e.textContent)).map(e => e.textContent.trim())[0] ?? null`); o.browserClock = await p.evaluate(`new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })`);
  await shot('0-day');
  o.drop9 = await dropOn(o.control, '09', 'control-9am', null);
  await p.reload({ waitUntil: 'domcontentloaded' }); await W(8000); o.dayBefore1pm = await toDay(o.day);
  o.drop13 = await dropOn(o.wo1, '13', 'step3-1pm', lineName(1));
  // step 6: reload, same day, open the new shift on Esther's row
  await p.reload({ waitUntil: 'domcontentloaded' }); await W(8000); o.dayStep6 = await toDay(o.day); await laneOf(ES.staff_id);
  // the shift block is a FullCalendar event (.fc-event) showing the customer name; bring it to the middle and click it
  const ev = p.locator('.fc-event').filter({ hasText: o.wo1.q.slice(0, 26) }).first(); o.blockCount = await p.locator('.fc-event').filter({ hasText: o.wo1.q.slice(0, 26) }).count();
  await ev.scrollIntoViewIfNeeded().catch(() => {}); await W(800); o.blockText = (await ev.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120); await shot('step6-row');
  if (o.blockCount) { await ev.click().catch(() => {}); await W(2500); o.details = (await p.locator('.q-dialog:visible, .q-menu:visible, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await shot('step6-details'); }
  if (o.dayIso) { const d0 = new Date(new Date(o.dayIso).getTime() - 12 * 3600e3).toISOString(), d1 = new Date(new Date(o.dayIso).getTime() + 18 * 3600e3).toISOString(); o.herShiftsEnd = await herShifts(d0, d1); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally { fs.writeFileSync(path.join(EV, 'C368179-b40.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C368179', JSON.stringify(o).slice(0, 7000)); await done(browser); }
