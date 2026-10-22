/**
 * 14 Oct 2026 — STAGING run of the six tests changed/added after PRD v48 (QA lead: "3 new test cases and 3 old test cases
 * to retest on staging"): C154648, C368133, C96965, C581889, C581890, C581891. Each follows its CURRENT TestRail steps
 * (read 14 Oct 15:3x UTC, cases-1014.json in the scratchpad) and makes its own data, tagged ZZAUTOTEST, with a fresh
 * customer per run ("used by this case only").
 * Sign-in: the NORMAL sign-in (bootOrigin, quick-login on the sign-in page) — never the run-498 harness for anything with a
 * displayed time (L0312: it shows times in UTC). Rule 125 first: tz-match-staging.mjs must exit 0.
 * Run (from build/global-search/e2e):
 *   GS_APP=https://app.staging.shopview.com WOB_API=https://api.staging.shopview.com TZ=Asia/Karachi WOB_LOC_TZ=Asia/Karachi \
 *   WOB_EV=<abs evidence dir> [ONLY=C581889,...] npx tsx ../../wo-board-tech-view/run498-2026-10-08/stg6.mts
 */
import { LOC1_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, active, tab, search, drag, toColumn, openReassign, toasts, shiftPrompt, read } from './wob.mts';
import { staffRows, HEAVY } from './staff.mts';
import { mkShift, shiftsOn, localDate } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
// 22 Oct 2026: on production (WOB_PROD_LOGIN) the normal password sign-in of the second admin test account; staging keeps its quick-login.
const { browser, page: p, APP } = (process.env.WOB_PROD_LOGIN
  ? await (await import('../../testing-tools/prod-login-boot.mjs') as any).bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 } })
  : await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/workorders', key: 'admin' })) as any;
const pg: Page = p; pg.setDefaultTimeout(30_000);
const a = api(pg);
const OUT = path.join(EV, 'stg6.json');
const R: Record<string, any> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const stamp = new Date().toISOString().slice(5, 16).replace(/[-T:]/g, '');
const shot = (n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
R.meta = { at: new Date().toISOString(), stamp, browserZone: Intl.DateTimeFormat().resolvedOptions().timeZone, build: await pg.evaluate(`document.documentElement.outerHTML.match(/v26\\.\\d+\\.\\d+-[0-9a-f]{7}/)?.[0] ?? null`) };

// ---------- location: ONLY through the screen (L0056/L0234 — a behind-the-screen switch leaves the page on the old one) ----------
const header = () => pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
async function switchLoc(name: string) {
  if ((await header()).includes(name)) return `already ${name}`;
  await pg.locator('[data-test-id="profile_menu_button"]').click(); await pg.waitForTimeout(1200);
  await pg.locator('[data-test-id="select_location"]').click(); await pg.waitForTimeout(1200);
  await pg.locator('.q-menu .q-item').filter({ hasText: name }).first().click(); await pg.waitForTimeout(6000);
  await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(1000);
  const h = await header(); if (!h.includes(name)) throw new Error(`location switch to ${name} did not take: header "${h}"`); return h;
}
R.meta.homeLocation = await switchLoc(LOC1_NAME);

// ---------- staff (Rule 107: made here when missing; Service department, a technician role, Time Clock on) ----------
const D = '@staging.shopview.local';
const deps: any[] = (() => [])(); { const r = (await a.get('/api/departments')).body?.data; deps.push(...(Array.isArray(r) ? r : r?.collection ?? [])); }
// EXACTLY "Service": the Schedule lists Service but not "Service/Parts"; a technician outside its departments has no row and their shifts read "Unassigned" (14 Oct)
const service = deps.find((d) => (d.name ?? d.label) === 'Service') ?? deps.find((d) => /service/i.test(d.name ?? d.label ?? '')) ?? deps[0];   // 22 Oct 2026: production has no Service department (first department, as in moved-stg4)
const roleRows = await staffRows(a);
const roles: Record<string, string> = {}; for (const s of roleRows) if (s.role_label && s.role_id) roles[s.role_label] = s.role_id;
const techRole = roles['Technician'] ?? Object.entries(roles).find(([l]) => /tech/i.test(l) && !/office|time clock/i.test(l))?.[1];
R.meta.roleUsed = Object.entries(roles).find(([, v]) => v === techRole)?.[0]; R.meta.department = service?.name ?? service?.label;
async function tech(first: string, last: string) {
  const email = `zz.wob.${first.toLowerCase()}.${last.toLowerCase()}.svc${D}`;  // .svc: the first four (14 Oct 16:06) went into Service/Parts and the change call cannot move them
  let row = (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email);
  if (!row) {
    const c = await a.post('/api/iam/create', { email, first_name: first, last_name: last, role_id: techRole, departments: [service.id], workplace_id: HEAVY });
    if (c.status < 300) { const r0 = (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email); if (r0) await a.post(`/api/staff/${r0.staff_id}/change`, { first_name: first, last_name: last, email, role_id: r0.role_id, workplace_id: HEAVY, job_title: r0.job_title, salary_type: r0.salary_type, salary: r0.salary, billable: true, clockable: true }); }
    if (c.status >= 300) throw new Error(`staff ${first}: ${c.status} ${JSON.stringify(c.body).slice(0, 200)}`);
    row = (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email);
  }
  if (!row.clockable) await a.post(`/api/staff/${row.staff_id}/change`, { first_name: row.first_name, last_name: row.last_name, email: row.email, role_id: row.role_id, workplace_id: row.workplace_id ?? HEAVY, job_title: row.job_title, salary_type: row.salary_type, salary: row.salary, billable: !!row.billable, clockable: true });
  row = (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email);
  return { id: row.staff_id as string, name: `${first} ${last}`, role: row.role_label, clock: row.clockable, billable: row.billable, departments: row.departments };
}
const TA = await tech('Esther', 'Howard'), TB = await tech('Ralph', 'Edwards'), TC = await tech('Dana', 'Ortiz'), TD = await tech('Jenny', 'Wilson');
R.meta.staff = [TA, TB, TC, TD];
const names: Record<string, string> = { [TA.id]: 'Esther', [TB.id]: 'Ralph', [TC.id]: 'Dana', [TD.id]: 'Jenny' };

// ---------- helpers ----------
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const cl1 = canned.find((c) => /grease/i.test(c.name ?? c.title ?? '')) ?? canned[0], cl2 = canned.find((c) => /clutch/i.test(c.name ?? c.title ?? '')) ?? canned[1];
R.meta.cannedLines = [String(cl1?.canned_line_name ?? '').trim(), String(cl2?.canned_line_name ?? '').trim()];
const mkLine = async (wo: string, c: any) => { const r = await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: c.id, status: 'authorized' }); if (r.status >= 300) throw new Error(`line ${r.status}`); return (r.body?.data?.line_id ?? r.body?.data?.id) as string; };
const twoLines = async (wo: string) => [await mkLine(wo, cl1), await mkLine(wo, cl2)];
const setLead = (wo: string, s: string | null) => a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: s });
const lineTechs = async (wo: string) => ((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => ({ line: x.lineId, techs: (x.technicians ?? []).map((tt: any) => `${tt.firstName ?? ''} ${tt.lastName ?? ''}`.trim()), followsLead: !!x.derivedFromLeadTech }));
const leadOf = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
const tooltips = () => pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const toastWatch = () => pg.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`);
const toastSeen = () => pg.evaluate('window.__tl || []') as Promise<string[]>;
const promptLoc = () => pg.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
async function waitPrompt(ms = 4000) { for (let i = 0; i < ms / 250; i++) { if (await promptLoc().count()) return true; await pg.waitForTimeout(250); } return false; }
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const PREF0 = await prefGet();
const pin = (ids: string[]) => a.put('/api/users/me/preferences/work-orders-list', { value: { ...PREF0, pinnedTechnicianIds: ids } });
/** the empty-state words on screen: every short text line mentioning "No work orders"/"No results"/"Try …", plus every visible button with "Clear" */
const emptyState = () => pg.evaluate(`(() => {
  const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const lines = [...document.querySelectorAll('main *, .q-page *')].filter(e => vis(e) && e.children.length === 0 && /No work orders|No results|Try removing|Try a different|match/i.test(e.textContent || '')).map(e => e.textContent.replace(/\\s+/g, ' ').trim());
  const buttons = [...document.querySelectorAll('button, .q-btn')].filter(e => vis(e) && /clear/i.test(e.innerText || '')).map(e => e.innerText.replace(/\\s+/g, ' ').trim());
  const cards = document.querySelectorAll('[data-test-id^="board_card_"]:not([data-test-id="board_card_number"])').length;
  const rows = [...document.querySelectorAll('tbody tr')].filter(vis).filter(r => /\\b[A-Z]+\\d*-\\d+\\b/.test(r.innerText)).length;
  return { lines: [...new Set(lines)], buttons: [...new Set(buttons)], cards, woRows: rows };
})()`) as Promise<any>;
/** Work Orders page as the preconditions want it: All tab, nothing ticked in Status, Asset on Site no choice, Assigned to me off, Search empty */
async function cleanPage(d = 'List') {
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All');
  if (d) await display(pg, d);
  const o: any = {};
  o.asset = await pg.evaluate(`(() => { const lab = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^Asset on Site/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0);
    if (!lab) return 'no chip'; let c = lab; for (let i = 0; i < 6 && c; i++, c = c.parentElement) { const x = [...c.querySelectorAll('i')].find(i => i.textContent.trim() === 'cancel'); if (x) { x.click(); return 'cleared: ' + lab.textContent.trim(); } } return 'shows no choice: ' + lab.textContent.trim(); })()`);
  await pg.waitForTimeout(2000);
  await pg.locator('[data-test-id="filter_chip_status"]').click(); await pg.waitForTimeout(900);
  const cs = pg.locator('.q-menu').getByText('Clear selection').first(); if (await cs.count()) { await cs.click().catch(() => {}); o.status = 'cleared'; } else o.status = 'nothing ticked';
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200);
  o.assignedToMe = await pg.evaluate(`(() => { const e = [...document.querySelectorAll('button, .q-btn, .q-chip, .q-toggle')].find(x => /Assigned to me/.test(x.innerText || '')); if (!e) return null; const on = e.getAttribute('aria-pressed') === 'true' || /--active|selected|bg-primary/.test(e.className) || !!e.querySelector('[aria-checked=true]'); if (on) e.click(); return on ? 'was on, turned off' : 'off'; })()`);
  const box = pg.locator('[data-test-id="page_search_input"]'); if (await box.isVisible().catch(() => false)) { await box.fill(''); }
  await pg.waitForTimeout(2500);
  return o;
}
async function statusMenu() { await pg.locator('[data-test-id="filter_chip_status"]').click(); await pg.waitForTimeout(1000); }
const statusItem = (label: string) => pg.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp('^\\s*' + label + '\\s*$') }).first();
const itemState = (label: string) => statusItem(label).evaluate((e) => ({ disabled: e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') || e.classList.contains('q-item--disabled') || !!e.querySelector('[aria-disabled=true]'), ticked: !!e.querySelector('[aria-checked=true], .q-checkbox__inner--truthy') })).catch(() => null);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 500) }; await shot(`${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 3000));
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
}
const boardOpen = async (n: string) => { await cleanPage('Board View'); if (n) await search(pg, n); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(800); };
const dragTo = (woId: string, target: string) => drag(pg, `[data-test-id="board_card_${woId}"]`, `[data-test-id="board_column_${target}"]`, 120);
const inColumn = (woId: string, staff: string) => pg.locator(`[data-test-id="board_column_${staff}"] [data-test-id="board_card_${woId}"]`).count();

// =========================== C154648 — Imported ===========================
await run('C154648', async () => {
  const o: any = { pre: await cleanPage('List') };
  await statusMenu(); await statusItem('Imported').click(); await pg.waitForTimeout(2000); await pg.keyboard.press('Escape'); await pg.waitForTimeout(2500);
  o.step3 = { display: await active(pg), rows: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 90)).filter(x => /\\S/.test(x)).slice(0, 5)`), count: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => /\\S/.test(r.innerText)).length`) };
  await shot('C154648-step3-list-imported');
  for (const [l, hv, cl] of [['Tech View', 'step4', 'step5'], ['Board View', 'step6', 'step7']] as const) {
    const b = pg.locator(`[aria-label="${l}"]`).first(); await b.hover(); await pg.waitForTimeout(1200);
    o[hv] = { disabled: await b.evaluate((e) => { const x = e.closest('button,.q-btn') || e; return x.hasAttribute('disabled') || x.getAttribute('aria-disabled') === 'true' || x.classList.contains('disabled'); }), tooltip: await tooltips() };
    await shot(`C154648-${hv}-${l.replace(' ', '')}-hover`);
    await b.click({ force: true }).catch(() => {}); await pg.waitForTimeout(2000);
    o[cl] = { display: await active(pg), firstRowStill: await pg.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 60)).find(x => /\\S/.test(x)) ?? null`) };
  }
  await statusMenu(); await pg.locator('.q-menu').getByText('Clear selection').first().click(); await pg.waitForTimeout(1500); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200);
  for (const [l, s] of [['Tech View', 9], ['Board View', 13]] as const) {
    await pg.locator(`[aria-label="${l}"]`).first().click(); await pg.waitForTimeout(3000); o[`step${s}`] = { display: await active(pg) };
    await statusMenu(); const it = statusItem('Imported'); await it.hover(); await pg.waitForTimeout(1200);
    o[`step${s + 2}`] = { ...(await itemState('Imported')), tooltip: await tooltips() }; await shot(`C154648-step${s + 2}-${l.replace(' ', '')}-imported-hover`);
    await it.click({ force: true }).catch(() => {}); await pg.waitForTimeout(1200);
    o[`step${s + 3}`] = { afterClick: await itemState('Imported'), chip: await pg.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => null) };
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(800);
    if (o[`step${s + 3}`].afterClick?.ticked) { await statusMenu(); await pg.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await pg.keyboard.press('Escape'); }
  }
  R.C154648 = o;
});

// =========================== C581890 — search alone, no match ===========================
await run('C581890', async () => {
  const q = 'ZZAUTOTEST-NOMATCH-A02';
  const o: any = { pre: await cleanPage('List'), precondNoMatch: (await workOrders(a, q)).length };
  await display(pg, 'Board View'); await search(pg, q); o.step4 = await emptyState(); await shot('C581890-step4-board');
  await display(pg, 'Tech View'); o.step6 = await emptyState(); await shot('C581890-step6-tech');
  await display(pg, 'List'); o.step8 = await emptyState(); await shot('C581890-step8-list');
  R.C581890 = o;
});

// =========================== C581889 — filter, no match ===========================
await run('C581889', async () => {
  // {Location-A}: every status at Heavy Duty has work orders on staging (counted 14 Oct), so this case runs at "QB Location",
  // where Estimate, In progress and Declined have none — no one else's work order is changed to make the state
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  R.C581889 = { location: await switchLoc('QB Location') };
  try {
  const n = `ZZAUTOTEST NT1 Filtered Empty ${stamp}`;
  const c = await customer(a, n, 'ZZNT1'); const w = await workOrder(a, c, 'approved', null);
  const o: any = R.C581889; o.wo = (await workOrders(a, n)).map((x: any) => `${x.number} ${x.status}`);
  // {Status-A}: a status other than Imported and Approved with no work order at the location — found the way a tester would: tick it alone in List
  o.pre = await cleanPage('List'); await statusMenu();
  const opts: string[] = (await pg.locator('.q-menu').last().innerText()).split('\n').map((x) => x.trim()).filter((x) => x && !/^(check_box|check_box_outline_blank|search)$/.test(x) && !/Clear selection|Imported|^Approved$/.test(x));
  await pg.keyboard.press('Escape'); o.statusOptions = opts;
  let A: string | null = null; o.tried = {};
  const code: Record<string, string> = { Estimate: 'estimate', 'In progress': 'in_progress', Review: 'ready_for_review', Complete: 'complete', Invoiced: 'invoiced', Paid: 'paid', Declined: 'declined' };
  const here = (await a.get('/api/work-orders?pagination[rowsPerPage]=200')).body?.data?.work_orders ?? []; o.apiByStatus = here.reduce((m: any, x: any) => (m[x.status] = (m[x.status] || 0) + 1, m), {});
  for (const s of ['Paid', ...opts.filter((x) => x !== 'Paid')]) {
    if (!opts.includes(s)) continue;
    await statusMenu(); await statusItem(s).click(); await pg.waitForTimeout(2500); await pg.keyboard.press('Escape'); await pg.waitForTimeout(2500);
    const es = await emptyState(); o.tried[s] = { listRows: es.woRows, api: o.apiByStatus[code[s]] ?? 0 };
    await statusMenu(); await pg.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await pg.keyboard.press('Escape'); await pg.waitForTimeout(1500);
    if (es.woRows === 0 && !o.apiByStatus[code[s]]) { A = s; break; }
  }
  o.statusA = A; if (!A) throw new Error('no status with zero work orders at the location');
  await display(pg, 'Board View');                                                      // steps 1-2
  await statusMenu(); await statusItem(A).click(); await pg.waitForTimeout(1500);       // step 3
  await pg.mouse.click(5, 300); await pg.waitForTimeout(2500);                          // step 4
  o.step5 = await emptyState(); await shot('C581889-step5-board');
  await search(pg, n); o.step7 = await emptyState(); await shot('C581889-step7-board-search');
  await display(pg, 'Tech View'); o.step9 = await emptyState(); await shot('C581889-step9-tech');
  await display(pg, 'List'); o.step11 = await emptyState(); await shot('C581889-step11-list');
  await display(pg, 'Tech View');
  const btn = pg.locator('button, .q-btn').filter({ hasText: /Clear all filters/ }).first(); o.step13 = { buttonThere: await btn.count() };
  if (o.step13.buttonThere) { await btn.click(); await pg.waitForTimeout(3500); }
  await statusMenu(); o.step14 = { statusA: await itemState(A), chip: await pg.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => null) }; await pg.keyboard.press('Escape'); await pg.waitForTimeout(800);
  o.step14.search = await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
  await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"][data-collapsed="true"]')].forEach(g => { const id = g.getAttribute('data-test-id').replace('tech_view_group_', ''); document.querySelector('[data-test-id="button_tech_view_group_toggle_' + id + '"]')?.click(); })`); await pg.waitForTimeout(2500);
  const num = o.wo[0].split(' ')[0]; o.step14.woShows = await pg.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.includes(${JSON.stringify(num)})`); o.step14.empty = await emptyState();
  await shot('C581889-step14-tech');
  } finally { R.C581889.backHome = await switchLoc(LOC1_NAME).catch((e) => String(e).slice(0, 150)); }
});

// =========================== C368133 — prompt only for unfinished whole-work-order shifts ===========================
await run('C368133', async () => {
  const n = `ZZAUTOTEST F1 Prompt Only Unfinished ${stamp}`;
  const c = await customer(a, n, 'ZZF4PU');
  const W: string[] = []; for (let i = 0; i < 7; i++) W.push(await workOrder(a, c, 'approved', i < 6 ? TA.id : TB.id));
  const L: string[][] = []; for (const w of W) L.push(await twoLines(w));
  await mkShift(a, W[0], TA.id, 1, '08:00', 240);                 // WO-1 whole, tomorrow
  await mkShift(a, W[2], TA.id, 1, '08:00', 240, [L[2][0]]);      // WO-3 Line-1 only
  await mkShift(a, W[3], TA.id, -1, '08:00', 240);                // WO-4 whole, ended (yesterday)
  await mkShift(a, W[4], TC.id, 1, '08:00', 240);                 // WO-5 Tech-C only
  await mkShift(a, W[6], TA.id, 1, '13:00', 120);                 // Tech-A on WO-7 (whole), WO-6 has none
  const nums = Object.fromEntries((await workOrders(a, n)).map((x: any) => [x.id, x.number]));
  const o: any = { setup: Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1} ${nums[w]}`, (await shiftsOn(a, w, names)).join('; ') || 'no shifts']))) };
  await pin([TA.id, TB.id]); await boardOpen(n); await toColumn(pg, TA.id); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(600);
  await shot('C368133-board-before');
  for (let i = 0; i < 6; i++) {
    await toastWatch(); await dragTo(W[i], TB.id); const opened = await waitPrompt(3500);
    const title = opened ? await promptLoc().locator('[data-test-id="text_dialog_title"]').evaluate((e) => e.textContent?.trim()).catch(async () => (await promptLoc().innerText()).split('\n')[0]) : null;
    if (opened && i === 0) await shot('C368133-step4-question');
    if (opened) await shiftPrompt(pg, 'Keep shifts');
    await pg.waitForTimeout(1200);
    await pg.waitForTimeout(1500); o[`WO-${i + 1}`] = { prompt: opened, title, toasts: await toastSeen(), inB: (await inColumn(W[i], TB.id)) > 0 };
  }
  o.leadsAfter = await leadOf(n); await shot('C368133-after');
  o.promptCount = Object.keys(o).filter((k) => k.startsWith('WO-') && o[k].prompt).length;
  R.C368133 = o;
});

// =========================== C96965 — what Clear shifts removes ===========================
await run('C96965', async () => {
  const n = `ZZAUTOTEST F1 Clear Shifts Scope ${stamp}`;
  const c = await customer(a, n, 'ZZF4CS');
  const W: string[] = []; for (let i = 0; i < 3; i++) W.push(await workOrder(a, c, 'approved', TA.id));
  const L: string[][] = []; for (const w of W) L.push(await twoLines(w));
  await mkShift(a, W[0], TA.id, 1, '08:00', 240); await mkShift(a, W[0], TA.id, 1, '13:00', 120, [L[0][0]]); await mkShift(a, W[0], TC.id, 1, '08:00', 120);
  await mkShift(a, W[1], TA.id, 1, '08:00', 240); await mkShift(a, W[1], TA.id, 1, '13:00', 120, [L[1][0]]);
  await mkShift(a, W[2], TA.id, 2, '08:00', 240);
  const nums = Object.fromEntries((await workOrders(a, n)).map((x: any) => [x.id, x.number]));
  const snap = async () => Object.fromEntries(await Promise.all(W.map(async (w, i) => [`WO-${i + 1} ${nums[w]}`, await shiftsOn(a, w, names)])));
  const o: any = { before: await snap() };
  await pin([TA.id, TB.id]); await boardOpen(n);
  await dragTo(W[0], TB.id); o.step4 = { opened: await waitPrompt(3500) }; o.step4.text = o.step4.opened ? (await promptLoc().innerText()).replace(/\s+/g, ' ') : null; await shot('C96965-step4-question');
  await shiftPrompt(pg, 'Clear shifts'); await pg.waitForTimeout(1500); o.step5 = { inB: (await inColumn(W[0], TB.id)) > 0, toasts: await toasts(pg) };
  await dragTo(W[1], TB.id); o.step7 = { opened: await waitPrompt(3500) }; o.step7.title = o.step7.opened ? (await promptLoc().innerText()).split('\n')[0] : null;
  await shiftPrompt(pg, 'Keep shifts'); await pg.waitForTimeout(1500); o.step7.inB = (await inColumn(W[1], TB.id)) > 0;
  await shot('C96965-step7-board-after');
  // steps 8-12 on the Schedule screen: top menu Schedule, the arrow next to Today, read the shifts; the Schedule's own data read alongside
  await pg.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await pg.waitForTimeout(7000);
  const fwd = async () => { const ok = await pg.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); if (!today) return 'no Today';
      const tr = today.getBoundingClientRect(); const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left);
      if (near.length < 2) return 'arrows ' + near.length; near[1].click(); return 'ok'; })()`); await pg.waitForTimeout(5000); return ok; };
  const dateLabel = () => pg.evaluate(`(() => { const t = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \\d{1,2}$/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0); return t ? t.textContent.trim() : null; })()`);
  const row = async (who: string, tag: string) => { const r = await pg.evaluate(`(() => { const vis = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      const nm = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim() === ${JSON.stringify(who)} && vis(e) && e.getBoundingClientRect().left < 520)[0]; if (!nm) return null; nm.scrollIntoView({ block: 'center' }); return true; })()`);
    if (!r) return { who, found: false }; await pg.waitForTimeout(1500);
    const blocks = await pg.evaluate(`(() => { const nm = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim() === ${JSON.stringify(who)} && e.getBoundingClientRect().left < 520 && e.getBoundingClientRect().width > 0)[0]; const y = nm.getBoundingClientRect().top + nm.getBoundingClientRect().height / 2;
      const out = []; for (const e of document.querySelectorAll('*')) { const b = e.getBoundingClientRect(); if (b.left < 520 || b.width <= 0 || b.top > y + 30 || b.bottom < y - 30 || b.height > 150) continue; const t = (e.innerText || '').replace(/\\s+/g, ' ').trim(); if (/S2-\\d+/.test(t) && t.length < 200 && ![...e.children].some(c => /S2-\\d+/.test(c.innerText || ''))) out.push(t + ' @x' + Math.round(b.left) + '-' + Math.round(b.right)); } return [...new Set(out)]; })()`);
    const y = await pg.evaluate(`(() => { const nm = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim() === ${JSON.stringify(who)} && e.getBoundingClientRect().left < 520 && e.getBoundingClientRect().width > 0)[0]; return Math.max(0, nm.getBoundingClientRect().top - 120); })()`);
    await pg.screenshot({ path: path.join(EV, `C96965-${tag}-${who.replace(' ', '')}.png`), clip: { x: 0, y: Math.min(y as number, 760), width: 1600, height: 240 } }).catch(() => {});
    return { who, blocks }; };
  const onScreen = (num: string) => pg.evaluate(`[...document.querySelectorAll('*')].filter(e => e.children.length < 6 && (e.innerText || '').includes(${JSON.stringify(num)}) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().width < 900).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter((v, i, s) => s.indexOf(v) === i).slice(0, 8)`);
  // steps 8-12 are read on the Schedule screen by stg6-sched2.mts (Search schedule… + open each shift)
  o.numbers = W.map((w, i) => `WO-${i + 1} ${nums[w]}`);
  o.after = await snap(); o.leads = await leadOf(n);
  R.C96965 = o;
});

// =========================== C581891 — a shift-only technician's line follows the new lead ===========================
await run('C581891', async () => {
  const n = `ZZAUTOTEST NT3 Shift Line Follows ${stamp}`;
  const c = await customer(a, n, 'ZZNT3'); const w = await workOrder(a, c, 'approved', TA.id);
  const [l1, l2] = await twoLines(w);
  const put = await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [TC.id] });
  await mkShift(a, w, TB.id, 1, '09:00', 120, [l1]);
  const num = (await workOrders(a, n))[0]?.number;
  const o: any = R.C581891 = { wo: num, setupPut: put.status, before: await lineTechs(w), shifts: await shiftsOn(a, w, names) };
  await pin([TA.id, TD.id]); await boardOpen(n);
  const m = await openReassign(pg, w, 'board'); await m.item.click(); await pg.waitForTimeout(1500);                  // step 3
  const s = pg.locator('[data-test-id="input_reassign_lead_search"]'); if (await s.count()) { await s.fill('Jenny Wilson'); await pg.waitForTimeout(1500); }
  await pg.locator(`[data-test-id="option_lead_technician_${TD.id}"]`).click(); await pg.waitForTimeout(600);
  await pg.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click();                            // step 4
  const prompted = await waitPrompt(3500); o.step4 = { prompt: prompted, toasts: await toasts(pg) }; if (prompted) await shiftPrompt(pg, 'Keep shifts');
  await pg.waitForTimeout(2000); await toColumn(pg, TD.id); o.step4.inD = (await inColumn(w, TD.id)) > 0; o.step4.lead = (await leadOf(n))[num]; await shot('C581891-step4-board');
  await pg.locator(`[data-test-id="board_card_${w}"]`).first().click(); await pg.waitForTimeout(5000);              // step 5
  const lt = pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Lines/ }).first(); if (await lt.count()) { await lt.click(); await pg.waitForTimeout(3000); }  // step 6
  o.url = pg.url();
  o.step7 = await pg.evaluate(`(() => { const t = (document.querySelector('main, .q-page') || document.body).innerText; const out = []; const ls = t.split('\\n'); for (let i = 0; i < ls.length; i++) if (/^\\s*Labor\\s*$/.test(ls[i])) out.push(ls.slice(i, i + 3).join(' ').replace(/\\s+/g, ' ')); return out; })()`);
  await shot('C581891-step7-lines');
  const lineNames = [R.meta.cannedLines[0], R.meta.cannedLines[1]];
  for (const [k, nm] of [['step9', lineNames[0]], ['step12', lineNames[1]]] as const) {
    o[k + 'click'] = await pg.locator('main, .q-page').getByText(nm as string, { exact: false }).first().click().then(() => 'ok', (e) => String(e).slice(0, 120)); await pg.waitForTimeout(2500);
    const d = pg.locator('.q-dialog').last();
    o[k] = { dialog: (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900), roster: await d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.replace(/\s+/g, ' ').trim())).catch(() => null) };
    await shot(`C581891-${k}-edit-line`);
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200);
    if (await pg.locator('.q-dialog').count()) { await pg.locator('.q-dialog button').filter({ hasText: /^\s*(Cancel|Close|close)\s*$/i }).first().click().catch(() => {}); await pg.waitForTimeout(1000); }
  }
  o.after = await lineTechs(w); o.lines = { l1, l2 };
});

await a.put('/api/users/me/preferences/work-orders-list', { value: PREF0 });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await browser.close().catch(() => {}); process.exit(0);
