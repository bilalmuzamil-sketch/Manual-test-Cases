/**
 * 14 Oct 2026 — STAGING: the five cases added after PRD v49 (C581892–C581896), each following its CURRENT TestRail steps,
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
const OUT = path.join(EV, 'stg-new5.json');
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

// ============ C581892 — not-approved and declined lines are ignored; a Choose lines shift ticking every approved line counts ============
await run('C581892', async () => {
  const o = R.C581892; const n = `ZZAUTOTEST S4R28 Approved Lines ${stamp}`;
  const c = await customer(a, n, 'ZZS4AL');
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
    await toastWatch(); await dragTo(W[i], RE.staff_id); const opened = await waitPrompt(3500);
    const title = opened ? (await promptLoc().innerText()).split('\n')[0].trim() : null;
    if (opened) { await shot(`C581892-WO${i + 1}-question`); await shiftPrompt(p, 'Keep shifts'); }
    await p.waitForTimeout(1500); o[`WO-${i + 1}`] = { prompt: opened, title, toasts: await toastSeen(), inB: (await inColumn(W[i], RE.staff_id)) > 0 };
  }
  await shot('C581892-board-after');
  o.schedule = await scheduleTomorrow(W.map((w) => nums[w]), 'C581892');
  o.shiftsAfter = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1}`, await shiftsOn(a, w, names)])));
});

// ============ C581893 — an Entire work order shift stops counting once a new line is approved ============
await run('C581893', async () => {
  const o = R.C581893; const n = `ZZAUTOTEST S4R28 Line Added ${stamp}`;
  const c = await customer(a, n, 'ZZS4LA');
  const W = [await workOrder(a, c, 'approved', ES.staff_id), await workOrder(a, c, 'approved', ES.staff_id)];
  for (const w of W) { await mkLine(w, TRANS); await mkLine(w, BAG); await setLead(w, ES.staff_id); }
  await mkShift(a, W[0], ES.staff_id, 1, '08:00', 240); await mkShift(a, W[1], ES.staff_id, 1, '13:00', 240);
  await mkLine(W[0], CABIN, 'authorized'); await mkLine(W[1], CABIN, 'authorization_required');   // added AFTER the shifts
  const nums = Object.fromEntries((await workOrders(a, n)).map((x: any) => [x.id, x.number]));
  o.setup = Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1} ${nums[w]}`, { lines: await lineStates(w), shifts: await shiftsOn(a, w, names) }])));
  await pin([ES.staff_id, RE.staff_id]); await boardOpen(n);
  await toastWatch(); await dragTo(W[0], RE.staff_id); const q1 = await waitPrompt(3500);
  if (q1) await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step4 = { prompt: q1, toasts: await toastSeen(), inB: (await inColumn(W[0], RE.staff_id)) > 0 }; await shot('C581893-step4');
  await toastWatch(); await dragTo(W[1], RE.staff_id); const q2 = await waitPrompt(3500);
  o.step6 = { prompt: q2, title: q2 ? (await promptLoc().innerText()).split('\n')[0].trim() : null }; if (q2) await shot('C581893-step6-question');
  if (q2) await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step7 = { toasts: await toastSeen(), inB: (await inColumn(W[1], RE.staff_id)) > 0 }; await shot('C581893-step7');
});

// ============ C581894 — card estimated hours = Total Hours (declined line left out) ============
await run('C581894', async () => {
  const o = R.C581894; const n = `ZZAUTOTEST S5R11a Card Hours ${stamp}`;
  const c = await customer(a, n, 'ZZS5CH'); const w = await workOrder(a, c, 'approved', null);
  await mkLine(w, CABIN); await mkLine(w, BAG); await mkLine(w, CABIN); await mkLine(w, TRANS, 'authorization_declined');
  o.setup = { lines: await lineStates(w), estimates: [CABIN, BAG, CABIN, TRANS].map((x) => `${String(x.canned_line_name).trim()} ${x.time_estimate} min`) };
  await cleanPage('List'); await search(p, n);
  const num = (await workOrders(a, n))[0]?.number; o.wo = num;
  await p.locator('tbody tr').filter({ hasText: num }).first().click(); await p.waitForTimeout(6000);
  o.step4 = await p.evaluate(`(() => { const t = (document.querySelector('main, .q-page') || document.body).innerText; const m = t.match(/Total Hours:?\\s*([\\d.]+\\s*hrs?)/i); return m ? m[1] : null; })()`); await shot('C581894-step4-total-hours');
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
await run('C581895', async () => {
  const o = R.C581895; const n = `ZZAUTOTEST S5R11b Staff Names ${stamp}`;
  const roles = await roleIds(a); const tech = roles['Technician'];
  const mk = async (who: string) => { const em = `zz.wob.acct.${who.toLowerCase()}.${stamp}${D}`;
    const r = await person(a, 'ZZAUTOTEST Account', who, { role: tech, email: em, clockable: true, billable: true });
    const row = r.row; const ch = await a.post(`/api/staff/${row.staff_id}/change`, { first_name: 'ZZAUTOTEST Staffname', last_name: who, email: em, role_id: row.role_id, workplace_id: row.workplace_id ?? HEAVY, job_title: row.job_title, salary_type: row.salary_type, salary: row.salary, billable: true, clockable: true });
    const back = (await staffRows(a, em))[0]; return { staff_id: back.staff_id, user_id: back.id, staffName: `${back.first_name} ${back.last_name}`, rename: ch.status }; };
  const TA = await mk('Ana'), TB = await mk('Ben'); o.staff = [TA, TB];
  o.candidates = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []).filter((x: any) => [TA.staff_id, TB.staff_id].includes(x.staffId)).map((x: any) => `${x.firstName} ${x.lastName}`);
  const c = await customer(a, n, 'ZZS5SN'); const w = await workOrder(a, c, 'approved', TA.staff_id);
  await mkLine(w, TRANS); const l2 = await mkLine(w, BAG); await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [TB.staff_id] });
  const num = (await workOrders(a, n))[0]?.number; o.wo = num;
  // steps 1-2: Settings > Staff names
  await p.goto(APP + '/settings/staff', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
  const sb = p.locator('input[placeholder*="Search" i]').first(); if (await sb.count()) { await sb.fill('ZZAUTOTEST Staffname'); await p.waitForTimeout(3000); }
  o.step2 = await p.evaluate(`[...document.querySelectorAll('tbody tr, .q-item')].map(r => r.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /ZZAUTOTEST (Staffname|Account)/.test(x)).slice(0, 6)`); o.staffUrl = p.url(); await shot('C581895-step2-staff');
  await cleanPage('List'); await search(p, n);
  o.step5 = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ')).find(x => x.includes(${JSON.stringify(num)})) || null`); await shot('C581895-step5-list');
  await pin([TA.staff_id]); await display(p, 'Board View'); await p.waitForTimeout(1500);
  // make sure Lead technician and Line technicians are shown on cards
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1200);
  o.fields = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map(e => e.getAttribute('data-test-id').replace('toggle_board_field_', '') + '=' + (!!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true'))`);
  for (const f of (o.fields as string[]).filter((x) => /lead|line_tech/i.test(x) && x.endsWith('=false'))) { await p.locator(`[data-test-id="toggle_board_field_${f.split('=')[0]}"]`).click(); await p.waitForTimeout(800); }
  await p.keyboard.press('Escape'); await p.mouse.click(5, 500); await p.waitForTimeout(1500);
  await toColumn(p, TA.staff_id);
  const card = p.locator(`[data-test-id="board_card_${w}"]`);
  o.step7 = (await card.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const avs = card.locator('[data-test-id="board_card_field_line_technicians"] .q-avatar, [data-test-id="board_card_field_line_technicians"] [class*="avatar"]');
  o.step8 = []; for (let i = 0; i < Math.min(await avs.count(), 4); i++) { await avs.nth(i).hover().catch(() => {}); await p.waitForTimeout(1000); o.step8.push((await tooltips()).join(' | ')); }
  o.step9 = await p.locator(`[data-test-id="board_column_name_${TA.staff_id}"]`).innerText().catch(() => null); await shot('C581895-step9-board');
  await display(p, 'Tech View'); await p.waitForTimeout(2000);
  o.step11 = await p.locator(`[data-test-id="tech_view_group_name_${TA.staff_id}"]`).innerText().catch(() => null); await shot('C581895-step11-tech');
});

// ============ C581896 — a link with Imported opens List, without changing the saved display ============
await run('C581896', async () => {
  const o = R.C581896; const ctx = p.context();
  await cleanPage('List'); // step 1; saved display List
  const t2 = await ctx.newPage(); await t2.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await t2.waitForTimeout(6000); // step 2
  await p.bringToFront(); await display(p, 'Board View'); o.step4 = await active(p); // steps 3-4
  const t3 = await ctx.newPage(); await t3.goto(APP + '/workorders?tab=all&status=imported', { waitUntil: 'domcontentloaded' }); await t3.waitForTimeout(7000); // step 5
  o.step6 = { display: await active(t3), chip: (await t3.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => '')).replace(/\s+/g, ' '), rows: await t3.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 60)).filter(x => /IMP|Imported/.test(x)).slice(0, 3)`) };
  for (const [k, l] of [['step7', 'Board View'], ['step8', 'Tech View']] as const) { const b = t3.locator(`[aria-label="${l}"]`).first(); await b.hover(); await t3.waitForTimeout(1200);
    o[k] = { disabled: await b.evaluate((e) => { const x = e.closest('button,.q-btn') || e; return x.hasAttribute('disabled') || x.getAttribute('aria-disabled') === 'true' || x.classList.contains('disabled'); }), tooltip: await t3.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`) }; }
  await t3.screenshot({ path: path.join(EV, 'C581896-step6-imported-link.png') }); await t3.close(); // step 9
  const t4 = await ctx.newPage(); await t4.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await t4.waitForTimeout(7000); // step 10
  o.step11 = await active(t4); await t4.screenshot({ path: path.join(EV, 'C581896-step11-saved-display.png') }); await t4.close(); // step 12
  await t2.bringToFront(); o.step13 = await active(t2); // step 13
  await t2.locator('[data-test-id="filter_chip_status"]').click(); await t2.waitForTimeout(900); await t2.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /^\s*Imported\s*$/ }).first().click(); await t2.waitForTimeout(1500); await t2.keyboard.press('Escape'); await t2.waitForTimeout(2500); // step 14
  const t5 = await ctx.newPage(); await t5.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await t5.waitForTimeout(7000); // step 15
  const greyed = async (l: string) => t5.locator(`[aria-label="${l}"]`).first().evaluate((e) => { const x = e.closest('button,.q-btn') || e; return x.hasAttribute('disabled') || x.getAttribute('aria-disabled') === 'true' || x.classList.contains('disabled'); }).catch(() => null);
  o.step16 = { display: await active(t5), chip: (await t5.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => '')).replace(/\s+/g, ' '), rows: await t5.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 60)).filter(x => /IMP|Imported/.test(x)).slice(0, 3)`), boardGreyed: await greyed('Board View'), techGreyed: await greyed('Tech View') };
  await t5.screenshot({ path: path.join(EV, 'C581896-step16-new-tab.png') });
  // put things back: clear Imported, saved display List
  await t5.locator('[data-test-id="filter_chip_status"]').click(); await t5.waitForTimeout(900); await t5.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await t5.keyboard.press('Escape'); await t5.waitForTimeout(1500);
  await display(t5, 'List'); await t5.close(); await t2.close(); await p.bringToFront();
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: PREF0.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await done(browser);
