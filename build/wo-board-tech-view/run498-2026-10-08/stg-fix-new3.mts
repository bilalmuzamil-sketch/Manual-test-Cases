/**
 * 15 Oct 2026 — STAGING focused re-check of three of the five v49 cases (copied set-up from stg-new5.mts):
 *  C581893 — the shifts are made THROUGH THE SCHEDULE SCREEN (Entire work order drop, payload captured) so the outcome cannot be
 *  blamed on an API-made shift; WO-3 (no line added) is the positive control that the question opens at all.
 *  C581894 — Total Hours read on the work order's own page.
 *  C581895 — account name made to differ from the staff name by the technician's own profile rename (account access).
 *  Original header: the five cases added after PRD v49 (C581892–C581896), each following its CURRENT TestRail steps,
 * own data (ZZAUTOTEST, fresh customer per run). Run with `source stg-env.sh` (normal sign-in, Asia/Karachi, Service technicians).
 * Line states (playbook): authorized = approved · authorization_required = not approved · authorization_declined = declined.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, active, tab, search, drag, toColumn, toasts, shiftPrompt } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const a = api(p);
const OUT = path.join(EV, 'stg-fix-new3.json');
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
const pin = (ids: string[]) => a.put('/api/users/me/preferences/work-orders-list', { value: { ...PREF0, pinnedTechnicianIds: ids } });
const promptLoc = () => p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
async function waitPrompt(ms = 4000) { for (let i = 0; i < ms / 250; i++) { if (await promptLoc().count()) return true; await p.waitForTimeout(250); } return false; }
const toastWatch = () => p.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`);
const toastSeen = () => p.evaluate('window.__tl || []') as Promise<string[]>;
const inColumn = (woId: string, staff: string) => p.locator(`[data-test-id="board_column_${staff}"] [data-test-id="board_card_${woId}"]`).count();
const tooltips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
async function cleanPage(d = 'List') {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All');
  if (d) await display(p, d);
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
async function scheduleTomorrow(nums: string[], tag: string) {
  await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
  await p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); const tr = today.getBoundingClientRect();
    const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); near[1].click(); })()`);
  await p.waitForTimeout(6000);
  const out: any = {};
  for (const num of nums) {
    if (!(await p.locator('[data-test-id="input_schedule_search"]').isVisible().catch(() => false))) { await p.mouse.click(1300, 84); await p.waitForTimeout(1000); }
    const s = p.locator('[data-test-id="input_schedule_search"]'); await s.fill(''); await s.fill(num); await p.waitForTimeout(4000);
    const evs = p.locator('.fc-event'); const n = await evs.count(); const det: string[] = [];
    for (let i = 0; i < n; i++) { const e = evs.nth(i); if (!(await e.isVisible().catch(() => false))) continue; await e.click().catch(() => {}); await p.waitForTimeout(2200);
      det.push(await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog, .q-menu, .q-card, [role=dialog]')].filter(x => x.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 400) : ''; })()`));
      await p.keyboard.press('Escape'); await p.waitForTimeout(1000); }
    await p.evaluate(`document.querySelector('.fc-event')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(600); await shot(`${tag}-schedule-${num}`);
    out[num] = det;
  }
  return out;
}


// ---- Schedule screen helpers: drop a work order onto a technician's row TOMORROW at a given hour (Entire work order) ----
const shiftPosts: any[] = [];
p.on('request', (q) => { if (q.method() === 'POST' && /\/api\/schedule\/shifts/.test(q.url())) { try { shiftPosts.push(JSON.parse(q.postData() || '{}')); } catch { shiftPosts.push(q.postData()); } } });
const laneOf = async (staff: string) => { for (let i = 0; i < 80; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; };
async function toTomorrow() {
  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2500);
  await p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); const tr = today.getBoundingClientRect();
    const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); near[1].click(); })()`);
  await p.waitForTimeout(6000);
  return p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null);
}
async function dropEntire(num: string, staff: string, hour: string, tag: string) { const o: any = { posted: shiftPosts.length };
  o.day = await toTomorrow();
  await p.locator('[data-test-id="input_sidebar_search"]').fill(num); await p.waitForTimeout(3500);
  const card = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: num }).first(); o.card = await card.count();
  o.lane = await laneOf(staff); const lane = p.locator(`[data-staff-id="${staff}"]`).first();
  const hdr = p.getByText(new RegExp('^\\s*' + hour.replace(' ', '\\s*') + '\\s*$')).first(); await hdr.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(1000); await lane.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(800);
  const hb = await hdr.boundingBox(); const lb = await lane.boundingBox(); const cb = await card.boundingBox();
  if (!hb || !lb || !cb) { o.error = `missing ${!hb ? 'hour header' : !lb ? 'lane' : 'card'}`; await shot(`${tag}-drop-missing`); return o; }
  await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + 40, cb.y + 20, { steps: 5 }); await p.mouse.move(hb.x + 6, lb.y + lb.height / 2, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last(); o.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
  const ent = d.getByText(/^\s*Entire work order\s*$/i).first(); if (await ent.count()) { await ent.click().catch(() => {}); await p.waitForTimeout(600); o.entireClicked = true; }
  await shot(`${tag}-schedule-drop-dialog`);
  await d.locator('button').filter({ hasText: /Create|Save/ }).last().click().catch(() => { o.noCreate = true; }); await p.waitForTimeout(3500);
  o.toasts = await toasts(p); await shot(`${tag}-schedule-created`);
  o.payload = shiftPosts.slice(o.posted); delete o.posted; return o; }

// ============ C581893 — an Entire work order shift stops counting once a new line is approved (shifts made on the Schedule screen) ============
await run('C581893', async () => {
  const o = R.C581893; const n = `ZZAUTOTEST S4R28 Line Added UI ${stamp}`;
  const c = await customer(a, n, 'ZZS4LU');
  const W = [await workOrder(a, c, 'approved', ES.staff_id), await workOrder(a, c, 'approved', ES.staff_id), await workOrder(a, c, 'approved', ES.staff_id)];
  for (const w of W) { await mkLine(w, TRANS); await mkLine(w, BAG); await setLead(w, ES.staff_id); }
  const nums = Object.fromEntries((await workOrders(a, n)).map((x: any) => [x.id, x.number]));
  o.drops = { 'WO-1': await dropEntire(nums[W[0]], ES.staff_id, '8 AM', 'C581893-WO1'), 'WO-2': await dropEntire(nums[W[1]], ES.staff_id, '1 PM', 'C581893-WO2'), 'WO-3 control': await dropEntire(nums[W[2]], ES.staff_id, '3 PM', 'C581893-WO3') };
  o.beforeLines = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1}`, await shiftsOn(a, w, names)])));
  await mkLine(W[0], CABIN, 'authorized'); await mkLine(W[1], CABIN, 'authorization_required');   // added AFTER the shifts
  o.setup = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1} ${nums[w]}`, { lines: await lineStates(w), shifts: await shiftsOn(a, w, names) }])));
  await pin([ES.staff_id, RE.staff_id]); await boardOpen(n);
  const one = async (i: number, tag: string) => { await toastWatch(); await dragTo(W[i], RE.staff_id); const q = await waitPrompt(4000);
    const title = q ? (await promptLoc().innerText()).split('\n')[0].trim() : null; if (q) { await shot(`${tag}-question`); await shiftPrompt(p, 'Keep shifts'); }
    await p.waitForTimeout(1500); const r = { prompt: q, title, toasts: await toastSeen(), inB: (await inColumn(W[i], RE.staff_id)) > 0 }; await shot(`${tag}-after`); return r; };
  o.step4 = await one(0, 'C581893-step4'); o.step6 = await one(1, 'C581893-step6'); o.control = await one(2, 'C581893-control-WO3');
  o.shiftsAfter = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1}`, await shiftsOn(a, w, names)])));
});

// ============ C581894 — Total Hours on the work order page, then the card's estimated hours ============
await run('C581894', async () => {
  const o = R.C581894; const n = `ZZAUTOTEST S5R11a Card Hours ${stamp}`;
  const c = await customer(a, n, 'ZZS5CH'); const w = await workOrder(a, c, 'approved', null);
  await mkLine(w, CABIN); await mkLine(w, BAG); await mkLine(w, CABIN); await mkLine(w, TRANS, 'authorization_declined');
  o.setup = { lines: await lineStates(w), estimates: [CABIN, BAG, CABIN, TRANS].map((x) => `${String(x.canned_line_name).trim()} ${x.time_estimate} min`) };
  await cleanPage('List'); await search(p, n);
  const num = (await workOrders(a, n))[0]?.number; o.wo = num;
  const row = p.locator('tbody tr').filter({ hasText: num }).first();
  await row.locator('td').filter({ hasText: num }).first().click().catch(() => row.click()); await p.waitForTimeout(6000);
  if (!/\/workorders\/[0-9a-f-]{36}/.test(p.url())) { o.openedBy = 'url (row click stayed on the list)'; await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); } else o.openedBy = 'row click';
  o.url = p.url();
  o.step4 = await p.evaluate(`(() => { const els = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^\\s*Total Hours:?\\s*$/i.test(e.textContent || '') && e.getBoundingClientRect().width > 0);
    return els.map(e => { let c = e; for (let i = 0; i < 4 && c; i++, c = c.parentElement) { const t = (c.innerText || '').replace(/\\s+/g, ' ').trim(); if (/\\d/.test(t)) return t.slice(0, 80); } return null; }); })()`);
  o.step4text = await p.evaluate(`(() => { const t = document.body.innerText; const m = t.match(/Total Hours[^\\n]*\\n?[^\\n]*/i); return m ? m[0].replace(/\\s+/g, ' ') : null; })()`);
  await shot('C581894-step4-total-hours');
  await boardOpen(n);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1200);
  const est = p.locator('[data-test-id="toggle_board_field_time_estimate"]');
  const on = await est.evaluate((e) => !!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true').catch(() => false);
  if (!on) { await est.click(); await p.waitForTimeout(1200); }
  await p.keyboard.press('Escape'); await p.mouse.click(5, 500); await p.waitForTimeout(1500);
  o.step10 = await p.locator(`[data-test-id="board_card_${w}"] [data-test-id="board_card_field_time_estimate"]`).innerText().catch(async () => (await p.locator(`[data-test-id="board_card_${w}"]`).innerText()).replace(/\s+/g, ' '));
  await shot('C581894-step10-card');
});

// ============ C581895 — cards and headers show the staff record name, as the List does ============
// 15 Oct 2026: on staging every technician's account name equals the staff record name (probe-boardnames.json: 155 header names,
// 264 staff, 0 differences), and renaming the STAFF record renames both. The difference the case needs is made the way it
// happens for real: the technician changes their OWN profile name (iam/change-name), done through account access as them.
await run('C581895', async () => {
  const o = R.C581895; const n = `ZZAUTOTEST S5R11b Staff Names ${stamp}`;
  const roles = await roleIds(a); const tech = roles['Technician'];
  const mk = async (who: string) => { const em = `zz.wob.acct2.${who.toLowerCase()}.${stamp}${D}`;
    const r = await person(a, 'ZZAUTOTEST Staffname', who, { role: tech, email: em, clockable: true, billable: true });
    const row = r.row ?? (await staffRows(a, em))[0];
    // account access as the technician → change THEIR profile name → read it back as them → exit
    await p.goto(`${APP}/impersonate-user/${row.id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    const asWho = await a.get('/api/iam/view-profile/').catch(() => ({ status: 0, body: null } as any));
    let ch: any = await a.post('/api/iam/change-name', { first_name: 'ZZAUTOTEST Account', last_name: who });
    if (ch.status >= 300) ch = await a.post('/api/iam/change-name', { firstName: 'ZZAUTOTEST Account', lastName: who });
    const prof = await a.get('/api/iam/view-profile/').catch(() => ({ status: 0, body: null } as any));
    await shot(`C581895-setup-${who}-profile`);
    // 15 Oct 2026: the API exit alone left the PAGE in Account Access Mode (banner still showing) — press the banner's own Exit,
    // then read the banner back; fall back to the API exit only if the button is missing.
    const exitBtn = p.locator('[data-test-id="button_exit_impersonation"]').first(); let ex: any = { status: 'button' };
    if (await exitBtn.count()) { await exitBtn.click(); await p.waitForTimeout(8000); } else ex = await a.post('/api/exit-switch-user', {});
    await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
    if (await p.locator('[data-test-id="button_exit_impersonation"]').count()) { ex = await a.post('/api/exit-switch-user', {}); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); }
    const stillIn = await p.locator('[data-test-id="button_exit_impersonation"]').count(); if (stillIn) throw new Error('still in Account Access Mode after Exit');
    const back = (await staffRows(a, em))[0]; if (!back) throw new Error(`staff ${em} not found after exit`);
    return { staff_id: back.staff_id, user_id: back.id, staffName: `${back.first_name} ${back.last_name}`, impersonatedAs: JSON.stringify(asWho.body?.data ?? asWho.body).slice(0, 160), changeName: `${ch.status} ${JSON.stringify(ch.body).slice(0, 160)}`, profileAfter: JSON.stringify(prof.body?.data ?? prof.body).slice(0, 220), exit: ex.status }; };
  const TA = await mk('Ana'), TB = await mk('Ben'); o.staff = [TA, TB];
  o.candidates = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []).filter((x: any) => [TA.staff_id, TB.staff_id].includes(x.staffId)).map((x: any) => `${x.firstName} ${x.lastName}`);
  const c = await customer(a, n, 'ZZS5SN'); const w = await workOrder(a, c, 'approved', TA.staff_id);
  await mkLine(w, TRANS); const l2 = await mkLine(w, BAG); await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [TB.staff_id] }); await setLead(w, TA.staff_id);
  const num = (await workOrders(a, n))[0]?.number; o.wo = num;
  { const b = (await a.get('/api/work-orders/board?tab=all')).body; const hs: string[] = []; const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if ([TA.staff_id, TB.staff_id].includes(x.staffId) && x.firstName) hs.push(`${x.firstName} ${x.lastName}`); for (const v of Object.values(x)) walk(v); }; walk(b); o.boardFeedNames = [...new Set(hs)]; }
  // steps 1-2: your initials > Settings > Staff
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(7000);
  const sb = p.locator('input[placeholder*="Search" i], input[type="search"]').first(); if (await sb.count()) { await sb.fill(`acct2`); await p.waitForTimeout(3500); }
  o.step2 = await p.evaluate(`[...document.querySelectorAll('tbody tr, .q-item')].map(r => r.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /ZZAUTOTEST (Staffname|Account) (Ana|Ben)/.test(x)).slice(0, 8)`); o.staffUrl = p.url(); await shot('C581895-step2-staff');
  await cleanPage('List'); await search(p, n);
  o.step5 = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ')).find(x => x.includes(${JSON.stringify(num)})) || null`); await shot('C581895-step5-list');
  await pin([TA.staff_id]); await display(p, 'Board View'); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1200);
  o.fields = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map(e => e.getAttribute('data-test-id').replace('toggle_board_field_', '') + '=' + (!!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true'))`);
  for (const f of (o.fields as string[]).filter((x) => /^(technician|line_technicians)=false$/.test(x))) { await p.locator(`[data-test-id="toggle_board_field_${f.split('=')[0]}"]`).click(); await p.waitForTimeout(800); }
  await p.keyboard.press('Escape'); await p.mouse.click(5, 500); await p.waitForTimeout(1500);
  await search(p, n); await toColumn(p, TA.staff_id);
  const card = p.locator(`[data-test-id="board_card_${w}"]`);
  o.step7 = (await card.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const avs = card.locator('[data-test-id="board_card_field_line_technicians"] .q-avatar, [data-test-id="board_card_field_line_technicians"] [class*="avatar"]');
  o.step8 = []; for (let i = 0; i < Math.min(await avs.count(), 4); i++) { await avs.nth(i).hover().catch(() => {}); await p.waitForTimeout(1200); o.step8.push((await tooltips()).join(' | ')); await shot(`C581895-step8-hover${i + 1}`); }
  o.step9 = await p.locator(`[data-test-id="board_column_name_${TA.staff_id}"]`).innerText().catch(() => null); await shot('C581895-step9-board');
  await display(p, 'Tech View'); await p.waitForTimeout(3000); await search(p, n); await p.waitForTimeout(1500);
  const g = p.locator(`[data-test-id="tech_view_group_name_${TA.staff_id}"]`); await g.scrollIntoViewIfNeeded().catch(() => {});
  o.step11 = await g.innerText().catch(() => null);
  if (!o.step11) o.step11groups = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_name_"]')].map(e => e.getAttribute('data-test-id').slice(21, 29) + '=' + e.innerText.trim()).slice(0, 8)`);
  await shot('C581895-step11-tech');
  await display(p, 'List');
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: PREF0.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await done(browser);
