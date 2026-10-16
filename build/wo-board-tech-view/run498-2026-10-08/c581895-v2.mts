/**
 * 15 Oct 2026 (afternoon) — STAGING: C581895 as REWRITTEN in TestRail (test 3974851, run 498). The case now uses the technicians'
 * actual names ("Staff names and sign-in account names do not need to differ"), so no rename is made. Technician A = Esther Howard
 * (lead), Technician B = Ralph Edwards (line 2, set through the line's technicians). Reads, per step: Settings > Staff names (step 1),
 * List Lead Technician cell (3), Board card lead name (4), Board column header (5), card line-technician avatar tooltips incl. overflow
 * (6), Tech View group header (7), Tech View Assigned Techs avatar tooltips (8). Positive control for tooltips: at least one hover must
 * produce a tooltip, or the hover read is void. Setup copied from stg-new5.mts (lines 1-83).
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, active, tab, search, drag, toColumn, toasts, shiftPrompt, findRow } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const a = api(p);
const OUT = path.join(EV, 'c581895-v2.json');
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

await run('C581895', async () => {
  const o = R.C581895; const n = `ZZAUTOTEST Staff Names ${stamp}`;
  // 16 Oct 2026 (build v26.40.18): run 498's C96929 re-run showed List's Lead Technician "David Sparks" on Carol Neal's work orders while
  // Tech View and Board View showed "Carol Neal" — so on staging a staff record and its sign-in account CAN carry different names. The
  // case's precondition asks for such a technician "where the site allows it", so Technician-A is now Carol Neal's staff record when it
  // is found (else Esther Howard, as before). Technician-B stays Ralph Edwards.
  const CN = (await staffRows(a, 'Carol')).find((x: any) => x.first_name === 'Carol' && x.last_name === 'Neal' && x.staff_id);
  const TA = CN ?? ES, TB = RE; if (CN) names[CN.staff_id] = 'Carol';
  o.staffRowA = CN ? { first: CN.first_name, last: CN.last_name, email: String(CN.email ?? '').replace(/^(.).*@/, '$1…@'), user: CN.user_first_name ?? CN.user?.first_name ?? null } : 'Carol Neal not found; Esther Howard used';
  o.staff = [TA, TB].map((x: any) => ({ id: x.staff_id, name: `${x.first_name} ${x.last_name}` }));
  const c = await customer(a, n, 'ZZS5SN'); const w = await workOrder(a, c, 'approved', TA.staff_id);
  await mkLine(w, TRANS); const l2 = await mkLine(w, BAG); o.l2tech = (await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [TB.staff_id] })).status;
  o.lead = (await setLead(w, TA.staff_id)).status;
  const num = (await workOrders(a, n))[0]?.number; o.wo = num; o.lines = await lineStates(w);
  // step 1: Settings > Staff
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(6000);
  o.step1 = {}; for (const x of o.staff) { const sb = p.locator('input[placeholder*="Search" i]').first(); if (await sb.count()) { await sb.fill(x.name.split(' ')[0]); await p.waitForTimeout(3000); }
    o.step1[x.name] = await p.evaluate(`[...document.querySelectorAll('tbody tr, .q-item')].map(r => r.innerText.replace(/\\s+/g, ' ').trim()).filter(t => t.includes(${JSON.stringify(x.name)})).slice(0, 2)`);
    await shot(`C581895-v2-step1-staff-${x.name.split(' ')[0]}`); }
  // steps 2-3: List, Lead Technician column
  await cleanPage('List'); await search(p, n); await p.waitForTimeout(2000);
  o.listHeads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`);
  o.step3 = await p.evaluate(`(() => { const hs = [...document.querySelectorAll('thead th')].map(e => e.innerText.trim()); const i = hs.findIndex(h => /^Lead Technician/i.test(h)); const r = [...document.querySelectorAll('tbody tr')].find(x => x.innerText.includes(${JSON.stringify(num)})); return r ? { cell: i >= 0 ? r.cells[i]?.innerText.trim() : null, row: r.innerText.replace(/\\s+/g, ' ').slice(0, 200) } : null; })()`);
  await shot('C581895-v2-step3-list');
  // steps 4-6: Board View
  await pin([TA.staff_id]); await display(p, 'Board View'); await p.waitForTimeout(1500);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(1200);
  o.fields = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map(e => e.getAttribute('data-test-id').replace('toggle_board_field_', '') + '=' + (!!e.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true'))`);
  for (const f of (o.fields as string[]).filter((x) => /lead|line_tech/i.test(x) && x.endsWith('=false'))) { await p.locator(`[data-test-id="toggle_board_field_${f.split('=')[0]}"]`).click(); await p.waitForTimeout(800); }
  await p.keyboard.press('Escape'); await p.mouse.click(5, 500); await p.waitForTimeout(1500);
  await toColumn(p, TA.staff_id);
  const card = p.locator(`[data-test-id="board_card_${w}"]`);
  o.cardInColumn = await inColumn(w, TA.staff_id);
  o.step4 = (await card.innerText().catch(() => '')).replace(/\s+/g, ' ');
  o.step4lead = await card.locator('[data-test-id="board_card_field_lead_technician"], [data-test-id*="lead"]').first().innerText().catch(() => null);
  o.step5 = await p.locator(`[data-test-id="board_column_name_${TA.staff_id}"]`).innerText().catch(() => null);
  await card.scrollIntoViewIfNeeded().catch(() => {}); await shot('C581895-v2-step5-board');
  const avs = card.locator('[data-test-id="board_card_field_line_technicians"] .q-avatar, [data-test-id="board_card_field_line_technicians"] [class*="avatar"], [data-test-id="board_card_field_line_technicians"] [class*="overflow"]');
  o.step6count = await avs.count(); o.step6 = []; o.step6pic = 0;
  for (let i = 0; i < Math.min(o.step6count, 6); i++) { await avs.nth(i).hover().catch(() => {}); await p.waitForTimeout(1200); o.step6.push((await tooltips()).join(' | ')); if (o.step6[i] && !o.step6pic) { o.step6pic = i + 1; await shot('C581895-v2-step6-board-hover'); } } // 16 Oct 2026: picture at the first hover that shows a name
  o.step6field = await card.locator('[data-test-id="board_card_field_line_technicians"]').innerText().catch(() => null);
  // steps 7-8: Tech View
  await p.mouse.move(5, 500); await display(p, 'Tech View'); await p.waitForTimeout(2500);
  await p.locator('[data-test-id="button_tech_view_column_selection"]').click().catch(() => {}); await p.waitForTimeout(1200);
  const at = p.locator('.q-menu [role=checkbox], .q-menu .q-item').filter({ hasText: /Assigned Techs/i }).first();
  o.assignedWasOn = await at.getAttribute('aria-checked').catch(() => null); if (o.assignedWasOn === 'false') { await at.click(); await p.waitForTimeout(1500); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  // 15 Oct: the group sits lower down the page; findRow opens it if folded and scrolls the table until the row is there
  o.rowGroupKey = await findRow(p, w, TA.staff_id);
  o.step7 = await p.locator(`[data-test-id="tech_view_group_name_${o.rowGroupKey || TA.staff_id}"]`).innerText().catch(() => null);
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_name_${o.rowGroupKey || TA.staff_id}"]')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(800);
  const row = p.locator(`[data-test-id="tech_view_row_${w}"]`).first();
  o.rowInGroup = await p.locator(`[data-test-id="tech_view_group_${TA.staff_id}"] [data-test-id="tech_view_row_${w}"]`).count().catch(() => -1);
  o.techHeads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`);
  o.techRow = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('C581895-v2-step7-tech');
  const ai = (o.techHeads as string[]).findIndex((h) => /^Assigned Techs/i.test(h));
  const cell = ai >= 0 ? row.locator('td').nth(ai) : row; const tav = cell.locator('.q-avatar, [class*="avatar"], [class*="overflow"]');
  o.step8count = await tav.count(); o.step8 = [];
  for (let i = 0; i < Math.min(o.step8count, 6); i++) { await tav.nth(i).hover().catch(() => {}); await p.waitForTimeout(1200); o.step8.push((await tooltips()).join(' | ')); if (o.step8[i] && !o.step8pic) { o.step8pic = i + 1; await shot('C581895-v2-step8-tech-hover'); } } // 16 Oct 2026: picture at the first hover that SHOWS a name (the first hover on 16 Oct showed none)
  o.step8cell = await cell.innerText().catch(() => null);
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: PREF0.pinnedTechnicianIds ?? [] } });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await done(browser);
