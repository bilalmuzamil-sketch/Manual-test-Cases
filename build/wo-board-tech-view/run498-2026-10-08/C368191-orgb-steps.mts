/** C368191 on STAGING in Analyst 1's company, 16 Oct 2026 (batch 40). In company A no route makes the starting state (every answer in
 *  EV/C368191-b40.json: a person with logged labor cannot be deleted, "Staff is being used elsewhere."; a person who is only a line's
 *  technician deletes, and the Labor row then reads "Unassigned"). The scan of Analyst 1's company (C368191-orgb-scan.mts) found work order
 *  S1-3 whose Line 1 Labor row reads "Deleted user"; its labor entries point at two staff records that no longer exist ("'Staff' was not
 *  found.", C368191-orgb-s13.json). The case's steps on that line, as Analyst 1 (Owner/Admin-type role with Schedule create): step 1 Labor
 *  row read; steps 2-4 Schedule, next working day, drag S1-3 onto Test B2's row ([Tech-J], an active technician here) at 9 AM, Choose lines >
 *  Line 1 only, 2h, Create, the shift read; step 5 S1-3's Lines tab, Line 1's Labor row read again. Pictures C368191-orgb-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { EV, t, toasts } from './wob.mts';
const A = await analystBrowser('/workorders?tab=all'); const p = A.page, a = A.api, APP = A.APP; const o: any = { info: A.info };
const W = (ms: number) => p.waitForTimeout(ms); const shot = (n: string) => p.screenshot({ path: path.join(EV, `C368191-orgb-${n}.png`) }).catch(() => {});
const dlg = () => p.locator('.q-dialog:visible').last();
const TJ = (((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []) as any[]).find((x) => /Test B2/.test(`${x.firstName} ${x.lastName}`));
const wl = ((await a.get('/api/work-orders?tab=all&pagination[rowsPerPage]=50&search=S1-3')).body?.data?.work_orders ?? []) as any[]; const W1 = wl.find((x) => x.number === 'S1-3');
const laborRows = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const rangeText = () => p.locator('[data-test-id="text_schedule_range"]').innerText().then((x) => x.trim()).catch(() => '');
async function laneOf(staff: string) { for (let i = 0; i < 60; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await W(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; }
async function toDay(target: string | null) { await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await W(3000);
  for (let i = 0; i < 10; i++) { await p.locator('[data-test-id="button_schedule_next"]').click(); await W(3000); const r = await rangeText(); if (target ? r === target : !/Sat|Sun/.test(r)) { if (!target) { await laneOf(TJ.staffId); const txt = await p.locator(`[data-staff-id="${TJ.staffId}"]`).first().innerText().catch(() => ''); if (/Not working/i.test(txt)) continue; } return r; } } return null; }
/** shifts on Esther's row on the board between d0 and d1 (the Schedule's own board call) */
async function herShifts(d0: string, d1: string) { const out: any[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.staffId === TJ.staffId && x.startsAt && x.id) out.push({ id: x.id, startsAt: x.startsAt, endsAt: x.endsAt, wo: x.workOrder?.number ?? null }); Object.values(x).forEach(walk); };
  walk((await a.get(`/api/schedule/board?from=${encodeURIComponent(d0)}&to=${encodeURIComponent(d1)}`)).body); return out.filter((v, i, arr) => arr.findIndex((u) => u.id === v.id) === i); }
const delShift = (id: string) => p.evaluate(async ([api0, id0]) => { const r = await fetch(`${api0}/api/schedule/shifts/${id0}?scope=shift`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status} ${(await r.text()).slice(0, 100)}`; }, [API, id]);
/** the hour slot cells FullCalendar draws (data-date …T<HH>:00), left edges, and px per hour */
const slotCells = (hh: string) => p.evaluate(`[...document.querySelectorAll('[data-date]')].filter(e => (e.getAttribute('data-date') || '').includes('T${hh}:00:00') && e.getBoundingClientRect().width > 0).map(e => ({ tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 70), date: e.getAttribute('data-date'), left: Math.round(e.getBoundingClientRect().left * 10) / 10, top: Math.round(e.getBoundingClientRect().top), width: Math.round(e.getBoundingClientRect().width * 10) / 10 })).slice(0, 6)`) as Promise<any[]>;
const fcHints = () => p.evaluate(`[...document.querySelectorAll('.fc-highlight, .fc-event-mirror, .fc-event-dragging, [class*="drop-preview"], [class*="dropPreview"], [class*="ghost"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ cls: String(e.className).slice(0, 80), left: Math.round(e.getBoundingClientRect().left * 10) / 10, width: Math.round(e.getBoundingClientRect().width), text: (e.innerText || '').replace(/\\s+/g, ' ').slice(0, 80) })).slice(0, 6)`) as Promise<any[]>;
async function dropOn(w: any, hh: string, tag: string, choose: string | null) { const r: any = { wo: w.number };
  const posted: string[] = []; const hr = async (x: any) => { if (x.request().method() === 'POST' && /\/api\/schedule\/shifts/.test(x.url())) posted.push(`${x.status()} ${(await x.text().catch(() => '')).slice(0, 400)}`); }; p.on('response', hr);
  await p.locator('[data-test-id="input_sidebar_search"]').fill(w.number); await W(3000); const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: w.number }).first(); r.card = await card.count();
  await laneOf(TJ.staffId); const lane = p.locator(`[data-staff-id="${TJ.staffId}"]`).first(); await lane.scrollIntoViewIfNeeded().catch(() => {});
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
  o.tech = TJ ? `${TJ.firstName} ${TJ.lastName}` : null; o.wo = W1 ? `${W1.number} ${W1.status}` : null; if (!TJ || !W1) throw new Error('Test B2 or S1-3 not found');
  const d0 = (await a.get(`/api/work-orders/lines/${W1.id}`)).body?.data; const ls: any[] = Array.isArray(d0) ? d0 : d0?.collection ?? []; const L1 = ls[0]; o.line1 = `${String(L1.line_name).trim()} est ${L1.time_estimate} min`;
  // step 1
  await p.goto(`${APP}/workorders/${W1.id}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); o.step1 = await laborRows(); await shot('step1-lines');
  // steps 2-4
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await W(8000); o.top = await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ')).catch(() => null);
  o.day = await toDay(null); await shot('step2-day');
  const posted: string[] = []; const hr = async (x: any) => { if (x.request().method() === 'POST' && /\/api\/schedule\/shifts/.test(x.url())) posted.push(`${x.status()} ${(await x.text().catch(() => '')).slice(0, 300)}`); }; p.on('response', hr);
  await p.locator('[data-test-id="input_sidebar_search"]').fill('S1-3').catch(() => {}); await W(3000); let card = p.locator('[data-test-id="sidebar_work_order_card"]').first(); o.card = await card.count(); if (!o.card) { card = p.getByText(/^\s*S1-3\s*$/).first(); o.cardByText = await card.count(); }
  o.lane = await laneOf(TJ.staffId); const lane = p.locator(`[data-staff-id="${TJ.staffId}"]`).first(); await lane.scrollIntoViewIfNeeded().catch(() => {});
  await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-date]')].find(x => (x.getAttribute('data-date') || '').includes('T09:00:00') && x.getBoundingClientRect().width > 0); if (e) e.scrollIntoView({ inline: 'center', block: 'nearest' }); })()`).catch(() => {}); await W(1500); await lane.scrollIntoViewIfNeeded().catch(() => {}); await W(800);
  const cells = await slotCells('09'), nxt = await slotCells('10'); const c9 = cells.find((c: any) => /lane/.test(c.cls)) ?? cells[0]; const c10 = nxt.find((c: any) => c.cls === c9?.cls) ?? nxt[0]; const lb = await lane.boundingBox(), cb = await card.boundingBox();
  if (!c9 || !c10 || !lb || !cb) throw new Error(`missing ${!c9 ? 'hour cell' : !lb ? 'Test B2 row' : 'card'}`);
  const x = c9.left + (c10.left - c9.left) / 8, y = lb.y + lb.height / 2;
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + cb.width / 2 + 20, cb.y + cb.height / 2 + 10, { steps: 5 }); await p.mouse.move(x, y, { steps: 25 }); await W(900); await p.mouse.up(); await W(3000);
  const d = dlg(); o.step2 = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('step2-dialog');
  await d.locator('.q-tab, [role=tab]').filter({ hasText: /Choose lines/i }).first().click().catch(() => {}); await W(1200); o.chooseText = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
  const nm = String(L1.line_name).trim(); const row = d.locator('.q-item, [class*="line"], div').filter({ hasText: nm }).filter({ has: p.locator('.q-checkbox') }).last(); await row.locator('.q-checkbox').first().click().catch(() => {}); await W(600);
  await d.locator('button').filter({ hasText: /Select lines/i }).first().click().catch(() => {}); await W(1200);
  for (let i = 0; i < 24; i++) { const hrs = await d.evaluate((e) => { const s = e.querySelector('.drop-single-day__step--start'); const lab = s && s.parentElement ? (s.parentElement as HTMLElement).innerText : (e as HTMLElement).innerText; return (lab.match(/(\d+(?:\.\d+)?)\s*h\b/) || [])[1] ?? null; }).catch(() => null); o.hours = hrs; if (hrs === '2') break;
    const btn = d.locator(Number(hrs) > 2 ? '[data-test-id="button_drop_single_day_decrement"]' : '[data-test-id="button_drop_single_day_increment"]').first(); if (!(await btn.count()) || await btn.isDisabled()) break; await btn.click(); await W(250); }
  await shot('step3-dialog'); const create = d.locator('button').filter({ hasText: /Create/ }).last(); o.createLabel = (await create.innerText().catch(() => null))?.replace(/\s+/g, ' '); await create.click().catch(() => {}); await W(3500); o.toasts = await toasts(p); p.off('response', hr); o.posted = posted.map((s) => s.replace(/"(color|note|departmentId|seriesId)":[^,]*,/g, ''));
  // step 4: the shift on Test B2's row, opened
  await p.reload({ waitUntil: 'domcontentloaded' }); await W(8000); await toDay(o.day); await laneOf(TJ.staffId);
  const ev = p.locator('.fc-event').filter({ hasText: /Customer 1/ }).first(); o.blocks = await p.locator('.fc-event').filter({ hasText: /Customer 1/ }).count(); await ev.scrollIntoViewIfNeeded().catch(() => {}); await W(800); await shot('step4-row');
  if (o.blocks) { await ev.click().catch(() => {}); await W(2500); o.step4 = (await p.locator('.q-dialog:visible, .q-menu:visible, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await shot('step4-details'); await p.keyboard.press('Escape'); }
  // step 5
  await p.goto(`${APP}/workorders/${W1.id}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); await p.reload({ waitUntil: 'domcontentloaded' }); await W(7000); o.step5 = await laborRows(); await shot('step5-lines');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally { fs.writeFileSync(path.join(EV, 'C368191-orgb.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C368191-ORGB', JSON.stringify(o).slice(0, 5000)); await A.browser.close(); process.exit(0); }
