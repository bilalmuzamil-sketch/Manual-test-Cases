/**
 * sched-r5.mts — 17 Oct 2026, ROUND 5 of the run 498 fix-ups on STAGING: C581892 alone (ONLY=C581892), "The Clear shifts question ignores
 * lines that are not approved or are declined". Steps 1-11 are stg-new5.mts's code (seen working on 17 Oct: three questions, Keep shifts,
 * the cards in Technician-B's column), copied unchanged (lines 6-141; only the output file, start tag and the step-14 read changed). Step 14
 * is now read ON SCREEN: on 17 Oct typing each work order number into "Search schedule…" only narrowed the left list, so the blocks were not
 * tied to anyone. Now the Schedule is opened, the arrow next to Today taken to the shifts' day (the server's date, compared with the day
 * label), Esther Howard's technician ROW found by scrolling the resource list (L0430), and the blocks drawn in HER row read (words, times,
 * position), opened for details and pictured (C581892-r5-schedule-esther-*.png). Output EV/sched-r5-<ONLY>.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP, API, registerShotPage } from './session.mts';
import { startState, setDisplay, capped } from './fixup-1017.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, active, tab, search, drag, toColumn, toasts, shiftPrompt, searchValue } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
// 17 Oct 2026: fix-up — `let`, so a page stuck in the Schedule read can be replaced by a fresh one (see scheduleTomorrow below)
let { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
let a = api(p);
// 17 Oct 2026: fix-up — a browser dialog (leave-page question, alert) would block every later page call for ever: dismiss and log it
const onDialog = (d: any) => { console.log(t(), 'browser dialog dismissed:', d.type(), String(d.message()).slice(0, 120)); d.dismiss().catch(() => {}); };
p.on('dialog', onDialog);
const OUT = path.join(EV, `sched-r5${(process.env.ONLY || '') ? '-' + (process.env.ONLY || '').split(',').join('-') : ''}.json`);
const R: Record<string, any> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const stamp = new Date().toISOString().slice(5, 16).replace(/[-T:]/g, '');
const shot = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
const names: Record<string, string> = { [ES.staff_id]: 'Esther', [RE.staff_id]: 'Ralph' };
R.meta = { at: new Date().toISOString(), esther: ES.departments, ralph: RE.departments };
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const byName = (re: RegExp) => canned.find((c) => re.test(String(c.canned_line_name)));
const TRANS = byName(/Transmission service/) ?? canned[0], CABIN = byName(/Cabin air filter/) ?? canned[1], BAG = byName(/Suspension air bag/) ?? canned[2];
const mkLine = async (wo: string, c: any, status = 'authorized') => { const r = await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: c.id, status });
  const id = (r.body?.data?.line_id ?? r.body?.data?.id) as string;
  if (status !== 'authorized' && id) await a.post('/api/work-orders/lines/change-status', { line_id: id, status, workOrderId: wo });
  return id; };
const lineStates = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; const ls = Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; return ls.map((l: any) => `${String(l.name ?? l.line_name ?? '').trim().slice(0, 30)}=${l.status ?? l.line_status}`); };
const setLead = (wo: string, s: string | null) => a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: s });
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const PREF0 = await prefGet();
// 17 Oct 2026: fix-up — log the saved display / collapsed groups / pins found BEFORE anything is set (each case then sets its own display)
R.startState = await startState(p, a, 'sched-r5');
const pin = (ids: string[]) => a.put('/api/users/me/preferences/work-orders-list', { value: { ...PREF0, pinnedTechnicianIds: ids } });
const promptLoc = () => p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
async function waitPrompt(ms = 4000) { for (let i = 0; i < ms / 250; i++) { if (await promptLoc().count()) return true; await p.waitForTimeout(250); } return false; }
const toastWatch = () => p.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`);
const toastSeen = () => p.evaluate('window.__tl || []') as Promise<string[]>;
const inColumn = (woId: string, staff: string) => p.locator(`[data-test-id="board_column_${staff}"] [data-test-id="board_card_${woId}"]`).count();
const tooltips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
async function cleanPage(d = 'List') {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All');
  if (d) await setDisplay(p, a, d, `cleanPage ${d}`); // 17 Oct 2026: fix-up — chosen AND read back
  await p.evaluate(`(() => { const lab = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^Asset on Site/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0); if (!lab) return; let c = lab; for (let i = 0; i < 6 && c; i++, c = c.parentElement) { const x = [...c.querySelectorAll('i')].find(i => i.textContent.trim() === 'cancel'); if (x) { x.click(); return; } } })()`);
  await p.waitForTimeout(1500);
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900);
  const cs = p.locator('.q-menu').getByText('Clear selection').first(); if (await cs.count()) await cs.click().catch(() => {});
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  const box = p.locator('[data-test-id="page_search_input"]'); if (await box.isVisible().catch(() => false)) await box.fill('');
  await p.waitForTimeout(2000);
}
const boardOpen = async (n: string) => { await cleanPage('Board View'); if (n) await search(p, n); await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await p.waitForTimeout(800); };
const dragTo = (woId: string, target: string) => drag(p, `[data-test-id="board_card_${woId}"]`, `[data-test-id="board_column_${target}"]`, 120);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  R[id] = {};
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id].error = String(e?.message || e).slice(0, 500); await shot(`${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2500));
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
}
/** 17 Oct 2026: fix-up — on 16 Oct the run hung for 60 minutes here, after the third drag of C581892 (last picture 21:36:09, killed by
 *  the queue's timeout at 22:34:46; the log was empty because nothing was printed until a case ended). Every visible schedule event was
 *  clicked one by one, each click allowed 30 s plus 3 s of waiting — if the Schedule search did not narrow the list (staging has ~260
 *  technicians) that is hundreds of events, i.e. the hour. Now: at most 6 events per work order are opened, every step prints a line,
 *  each page call is capped, and the whole read is capped at 4 minutes by the caller (capped), after which a fresh page is used. */
async function scheduleTomorrow(nums: string[], tag: string) {
  console.log(t(), tag, 'schedule: opening Schedule');
  await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
  console.log(t(), tag, 'schedule: going to tomorrow');
  await capped(p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); const tr = today.getBoundingClientRect();
    const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); near[1].click(); })()`), 20_000, `${tag} schedule: tomorrow arrow`, undefined);
  await p.waitForTimeout(6000);
  const out: any = {};
  for (const num of nums) {
    if (!(await p.locator('[data-test-id="input_schedule_search"]').isVisible().catch(() => false))) { await p.mouse.click(1300, 84); await p.waitForTimeout(1000); }
    const s = p.locator('[data-test-id="input_schedule_search"]'); await s.fill(''); await s.fill(num); await p.waitForTimeout(4000);
    const evs = p.locator('.fc-event'); const all = await evs.count(); const n = Math.min(all, 6); const det: string[] = [];
    console.log(t(), tag, `schedule: ${num} -> ${all} event(s) on screen, opening ${n}`);
    if (all > n) det.push(`(${all} events on screen after searching ${num}; only the first ${n} opened)`);
    for (let i = 0; i < n; i++) { const e = evs.nth(i); if (!(await e.isVisible().catch(() => false))) continue; await e.click({ timeout: 8000 }).catch(() => {}); await p.waitForTimeout(2200);
      det.push(await capped(p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog, .q-menu, .q-card, [role=dialog]')].filter(x => x.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 400) : ''; })()`) as Promise<string>, 15_000, `${tag} schedule: event ${i + 1} of ${num}`, '(read timed out)'));
      await p.keyboard.press('Escape'); await p.waitForTimeout(1000); }
    await p.evaluate(`document.querySelector('.fc-event')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(600); await shot(`${tag}-schedule-${num}`);
    out[num] = det;
  }
  return out;
}


// ───────────────────────────── ROUND 5 (17 Oct 2026): step 14 read ON SCREEN, in Esther Howard's row ─────────────────────────────
// On 17 Oct step 14 typed each work order number into "Search schedule…", which only narrowed the left list (286 blocks stayed drawn).
// Now: Schedule from the top menu, the arrow next to Today to tomorrow (step 13), the day label read and compared with the shifts' date
// from the server (one more arrow if they differ, logged); the search box left empty; Esther Howard's technician ROW found in the resource
// list (".fc-datagrid-body .fc-datagrid-cell-cushion" whose text starts "Esther Howard" — never "ZZOLD Esther Howard"), scrolling the list
// until it is drawn (L0430); then every shift block drawn in her row (same vertical band, right of the list) is read — words, left/width,
// the times — each opened for its details, the timeline scrolled sideways to the first one, and pictures of the row taken.
const dayLabel = () => p.evaluate(`([...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \\d{1,2}$/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0) || {}).textContent || null`).catch(() => null) as Promise<string | null>;
const nextArrow = () => p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); if (!today) return 'no Today button'; const tr = today.getBoundingClientRect();
  const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); if (!near[1]) return 'no arrow'; near[1].click(); return 'clicked'; })()`).catch((e: any) => String(e).slice(0, 60));
async function scheduleRow(nums: string[], tag: string, shiftDate: string | null) {
  const out: any = {};
  await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
  out.dayAtOpen = await dayLabel(); out.arrow = [await nextArrow()]; await p.waitForTimeout(6000); out.dayAfterArrow = await dayLabel();
  const want = shiftDate ? new Date(shiftDate + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).replace(/,/g, '').replace(/^(\w{3}) /, '$1, ') : null;
  out.wantDay = want;
  for (let k = 0; k < 2 && want && out.dayAfterArrow && out.dayAfterArrow.replace(/\s+/g, ' ') !== want; k++) { out.arrow.push(await nextArrow()); await p.waitForTimeout(5000); out.dayAfterArrow = await dayLabel(); }
  if (await p.locator('[data-test-id="input_schedule_search"]').isVisible().catch(() => false)) { await p.locator('[data-test-id="input_schedule_search"]').fill(''); await p.waitForTimeout(2500); out.searchCleared = true; }
  await shot(`${tag}-r5-schedule-day`);
  // Esther Howard's row
  // LIVE FIX 17 Oct: a people cell reads "EH / Esther Howard / Not working" (initials first), so the old ^Esther test never matched
  const findRow = () => p.evaluate(`(() => { document.querySelectorAll('[data-zz-es]').forEach(e => e.removeAttribute('data-zz-es')); const cells = [...document.querySelectorAll('.fc-datagrid-body .fc-datagrid-cell-cushion, .fc-datagrid-body .fc-datagrid-cell')].filter(e => e.getBoundingClientRect().width > 0);
    const c = cells.find(e => /(^|\\n)\\s*Esther Howard\\s*(\\n|$)/.test(e.innerText || '')); if (!c) return { found: false, firstDrawn: (cells[0] || {}).innerText?.trim().slice(0, 30) || null, lastDrawn: (cells[cells.length - 1] || {}).innerText?.trim().slice(0, 30) || null };
    const cell = c.closest('.fc-datagrid-cell') || c; cell.setAttribute('data-zz-es', '1'); const rid = (c.closest('[data-resource-id]') || {}).getAttribute ? c.closest('[data-resource-id]').getAttribute('data-resource-id') : null; return { found: true, text: c.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), resourceId: rid }; })()`).catch((e: any) => ({ found: false, error: String(e).slice(0, 60) }));
  let f: any = await findRow(); out.rowSearch = [];
  if (!f.found) { await p.evaluate(`(() => { const s = [...document.querySelectorAll('.fc-scroller')].find(e => e.scrollHeight > e.clientHeight + 10); if (s) s.scrollTop = 0; })()`).catch(() => {}); await p.waitForTimeout(800); f = await findRow(); }
  for (let i = 0; i < 120 && !f.found; i++) { const mv = await p.evaluate(`(() => { const ss = [...document.querySelectorAll('.fc-scroller')].filter(e => e.scrollHeight > e.clientHeight + 10); if (!ss.length) { const b = scrollY; window.scrollBy(0, 400); return scrollY !== b; } let moved = false; for (const s of ss) { const b = s.scrollTop; s.scrollTop += 300; moved = moved || s.scrollTop !== b; } return moved; })()`).catch(() => false);
    await p.waitForTimeout(350); f = await findRow(); if (i % 10 === 0) out.rowSearch.push({ step: i, first: f.firstDrawn, last: f.lastDrawn }); if (!mv && !f.found) break; }
  out.row = f; if (!f.found) { await shot(`${tag}-r5-schedule-no-row`); return out; }
  await p.locator('[data-zz-es="1"]').first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1200);
  const blocksInRow = () => p.evaluate(`(() => { const cell = document.querySelector('[data-zz-es="1"]'); if (!cell) return null; const cb = cell.getBoundingClientRect(); const top = cb.top, bot = cb.bottom, right = cb.right;
    const evs = [...document.querySelectorAll('.fc-event, .fc-timeline-event')].filter(e => { const b = e.getBoundingClientRect(); const y = b.top + b.height / 2; return b.width > 0 && y >= top - 1 && y <= bot + 1; });
    const rid = ${JSON.stringify(f.resourceId)}; const lane = rid ? document.querySelector('.fc-timeline-lane[data-resource-id="' + rid + '"], td.fc-timeline-lane[data-resource-id="' + rid + '"]') : null; const inLane = lane ? lane.querySelectorAll('.fc-event, .fc-timeline-event').length : null;
    const seen = new Set(); return { rowBox: { top: Math.round(top), bottom: Math.round(bot), listRight: Math.round(right) }, laneBlocks: inLane, blocks: evs.filter(e => { if (seen.has(e)) return false; seen.add(e); return !e.parentElement.closest('.fc-event'); }).map(e => { const b = e.getBoundingClientRect(); return { text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 160), x: Math.round(b.left), w: Math.round(b.width), onScreen: b.left >= right - 2 && b.right <= innerWidth + 2 }; }) }; })()`).catch((e: any) => ({ error: String(e).slice(0, 80) }));
  out.blocks = await blocksInRow();
  out.ourBlocks = (out.blocks?.blocks ?? []).filter((b: any) => nums.some((n) => b.text.includes(n)) || /S4R28/i.test(b.text));
  // the timeline scrolled sideways to the first of this row's blocks, then the row pictured
  await p.evaluate(`(() => { const cell = document.querySelector('[data-zz-es="1"]'); const cb = cell.getBoundingClientRect(); const e = [...document.querySelectorAll('.fc-event, .fc-timeline-event')].find(x => { const b = x.getBoundingClientRect(); const y = b.top + b.height / 2; return y >= cb.top - 1 && y <= cb.bottom + 1; }); if (e) e.scrollIntoView({ block: 'center', inline: 'center' }); })()`).catch(() => {}); await p.waitForTimeout(1200);
  out.blocksAfterSideways = await blocksInRow(); await shot(`${tag}-r5-schedule-esther-row`);
  { const cb = await p.locator('[data-zz-es="1"]').first().boundingBox().catch(() => null); const vs = p.viewportSize() ?? { width: 1600, height: 900 };
    if (cb) await p.screenshot({ path: path.join(EV, `${tag}-r5-schedule-esther-row-clip.png`), clip: { x: 0, y: Math.max(0, cb.y - 30), width: vs.width, height: Math.min(vs.height - Math.max(0, cb.y - 30), cb.height + 60) } }).catch(() => {}); }
  // each block of hers opened for its details (max 6)
  out.details = [];
  const n = Math.min(24, (out.blocksAfterSideways?.blocks ?? []).length);   // LIVE FIX 17 Oct: every block of her row is opened (the case's blocks can be the narrow ones with no words drawn)
  for (let i = 0; i < n; i++) { const pos = await p.evaluate(`(() => { const cell = document.querySelector('[data-zz-es="1"]'); const cb = cell.getBoundingClientRect(); const l = [...document.querySelectorAll('.fc-event, .fc-timeline-event')].filter(x => { const b = x.getBoundingClientRect(); const y = b.top + b.height / 2; return b.width > 0 && y >= cb.top - 1 && y <= cb.bottom + 1 && !x.parentElement.closest('.fc-event'); }); const e = l[${i}]; if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + Math.min(b.width / 2, 40), y: b.top + b.height / 2, text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80) }; })()`).catch(() => null) as any;
    if (!pos) break; await p.waitForTimeout(600); await p.mouse.click(pos.x, pos.y); await p.waitForTimeout(2200);
    const pop = await capped(p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog, .q-menu, [role=dialog]')].filter(x => x.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 400) : ''; })()`) as Promise<string>, 15_000, `${tag} schedule: block ${i + 1}`, '(read timed out)');
    out.details.push({ block: pos.text, details: pop }); await shot(`${tag}-r5-schedule-esther-block${i + 1}`); await p.keyboard.press('Escape'); await p.waitForTimeout(1000); }
  out.caseBlocks = out.details.filter((d: any) => nums.some((n) => String(d.details).includes(n))).map((d: any) => d.details);   // the blocks whose details name this run's work orders
  return out;
}

// ============ C581892 — not-approved and declined lines are ignored; a Choose lines shift ticking every approved line counts ============
await run('C581892', async () => {
  const o = R.C581892; const n = `ZZAUTOTEST S4R28 Approved Lines ${stamp}`;
  const c = await customer(a, n, 'ZZS4AL');
  // LIVE FIX 17 Oct (set-up, Rule 107): Esther Howard's row tomorrow held 15+ stacked blocks left by earlier runs (older S4R28 sets, other
  // cases' prompt shifts), so this run's three blocks could not be told apart on screen. Her shifts on that day are cleared first through the
  // Schedule's own delete (DELETE /api/schedule/shifts/{id}?scope=shift, as high1-fix5), listed and logged; the cases that need theirs
  // re-create them when missing.
  { const TZr = process.env.WOB_LOC_TZ || 'Asia/Karachi'; const ymd = (off: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZr, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() + off * 86400000));
    const d = ymd(1); const from = new Date(Date.now() - 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
    const body = (await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body; const found: any[] = []; const seen = new Set<string>();
    const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.id && x.startsAt && (x.staffId ?? x.staff_id) === ES.staff_id && !seen.has(x.id) && new Intl.DateTimeFormat('en-CA', { timeZone: TZr }).format(new Date(x.startsAt)) === d) { seen.add(x.id); found.push({ id: x.id, startsAt: x.startsAt, wo: x.workOrder?.number ?? null }); } Object.values(x).forEach(walk); };
    walk(body); o.clearedDay = d; o.cleared = [];
    for (const x of found) o.cleared.push(`${x.wo ?? '-'} ${x.startsAt} ` + await p.evaluate(async ([api0, id0]) => { const r = await fetch(`${api0}/api/schedule/shifts/${id0}?scope=shift`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status}`; }, [API, x.id]));
    console.log(t(), 'START STATE found C581892 (Esther Howard, tomorrow)', JSON.stringify({ day: d, shiftsCleared: o.cleared })); }
  const W = [await workOrder(a, c, 'approved', ES.staff_id), await workOrder(a, c, 'approved', ES.staff_id), await workOrder(a, c, 'approved', ES.staff_id)];
  const L1 = await mkLine(W[0], TRANS), L2 = await mkLine(W[0], CABIN, 'authorization_required');
  const L3 = await mkLine(W[1], TRANS), L4 = await mkLine(W[1], CABIN, 'authorization_declined');
  const L5 = await mkLine(W[2], TRANS), L6 = await mkLine(W[2], BAG);
  for (const w of W) await setLead(w, ES.staff_id);
  await mkShift(a, W[0], ES.staff_id, 1, '08:00', 120, [L1]);
  await mkShift(a, W[1], ES.staff_id, 1, '10:00', 120, [L3]);
  await mkShift(a, W[2], ES.staff_id, 1, '13:00', 120, [L5, L6]);
  const nums = Object.fromEntries((await workOrders(a, n)).map((x: any) => [x.id, x.number]));
  o.setup = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1} ${nums[w]}`, { lines: await lineStates(w), shifts: await shiftsOn(a, w, names) }])));
  await pin([ES.staff_id, RE.staff_id]); await boardOpen(n);
  for (let i = 0; i < 3; i++) {
    console.log(t(), `C581892 drag ${i + 1} of 3`); // 17 Oct 2026: fix-up — progress line
    // FIX-UP 2c (17 Oct 2026): after the first drag the second card was not found (30 s) and the case stopped. Board View draws only the
    // columns near the screen (L0417), and the search can be lost after the prompt: before EVERY drag the case's search is re-applied if it
    // changed, the board scrolled to its start and Esther Howard's column brought on screen, and the card looked for (up to 5 tries, search
    // typed again between them). The columns in view and the search are logged; a card that never shows is recorded, and the next drag runs.
    const prep: any = { search: await searchValue(p) }; if (prep.search !== n) { await search(p, n); await p.waitForTimeout(1500); prep.searchTypedAgain = true; }
    for (let k = 0; k < 5 && !(await p.locator(`[data-test-id="board_card_${W[i]}"]`).count()); k++) { await toColumn(p, ES.staff_id).catch(() => false); await p.waitForTimeout(1500); if (!(await p.locator(`[data-test-id="board_card_${W[i]}"]`).count())) { await search(p, n); await p.waitForTimeout(2500); } prep.tries = k + 1; }
    prep.cardFound = (await p.locator(`[data-test-id="board_card_${W[i]}"]`).count()) > 0; await p.locator(`[data-test-id="board_card_${W[i]}"]`).first().scrollIntoViewIfNeeded().catch(() => {});
    prep.columnsInView = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(h => { const r = h.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; }).map(h => (h.innerText.split('\\n')[0] || '').trim().slice(0, 30))`).catch(() => []);
    console.log(t(), `C581892 before drag ${i + 1}`, JSON.stringify(prep));
    if (!prep.cardFound) { o[`WO-${i + 1}`] = { prep, error: 'card not on the board after 5 tries: not dragged' }; continue; }
    await toastWatch(); await dragTo(W[i], RE.staff_id); const opened = await waitPrompt(3500);
    const title = opened ? (await promptLoc().innerText()).split('\n')[0].trim() : null;
    if (opened) { await shot(`C581892-WO${i + 1}-question`); await shiftPrompt(p, 'Keep shifts'); }
    await p.waitForTimeout(1500); o[`WO-${i + 1}`] = { prep, prompt: opened, title, toasts: await toastSeen(), inB: (await inColumn(W[i], RE.staff_id)) > 0 };
  }
  await shot('C581892-r5-board-after');
  // 17 Oct 2026: fix-up — the Schedule read is capped at 4 minutes; if it does not finish, the stuck page is left and a fresh page of the
  // same sign-in carries on (so C581896 still runs); the timeout is recorded in the result
  console.log(t(), 'C581892 drags done', JSON.stringify({ 1: o['WO-1']?.inB, 2: o['WO-2']?.inB, 3: o['WO-3']?.inB }));
  // ROUND 5: steps 12-14 on screen, in Esther Howard's row (scheduleRow); the shifts' date comes from the server's own reading
  const shiftDate = ((Object.values(o.setup ?? {}) as any[]).flatMap((x: any) => x.shifts ?? []).map((s: string) => (s.match(/\d{4}-\d{2}-\d{2}/) || [])[0]).find(Boolean)) ?? null;
  o.shiftDate = shiftDate;
  o.schedule = await capped(scheduleRow(W.map((w) => nums[w]), 'C581892', shiftDate), 300_000, 'C581892 schedule read', { timedOut: '5 min' } as any);
  console.log(t(), 'C581892 step 14 (Esther Howard row)', JSON.stringify({ caseBlocks: o.schedule?.caseBlocks, day: [o.schedule?.dayAtOpen, o.schedule?.dayAfterArrow, o.schedule?.wantDay], row: o.schedule?.row, blocks: o.schedule?.blocksAfterSideways?.blocks ?? o.schedule?.blocks, ours: o.schedule?.ourBlocks, details: o.schedule?.details }));
  if (o.schedule?.timedOut) { const old = p; p = await old.context().newPage(); p.setDefaultTimeout(30_000); p.on('dialog', onDialog); a = api(p); registerShotPage(p);
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4000); old.close({ runBeforeUnload: false }).catch(() => {}); console.log(t(), 'C581892 schedule read timed out: carrying on in a fresh page'); }
  o.shiftsAfter = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1}`, await shiftsOn(a, w, names)])));
});


await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: PREF0.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await done(browser);
