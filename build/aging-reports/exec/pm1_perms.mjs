// pm1_perms.mjs — 11 Nov 2026 ~18:15: the permission tests C715425-432, C715448, C715474, C715610, C715616 (run 557). The cases say "change Tech
// ShopView's role", but on sv11315 the staff role-change route answers 404 (L0637, p75). Route used instead (proven on sv11546, L0583,
// wo-board viewas.mts): make a new staff member with the p71 role (POST /api/iam/create), enrol at Staging Heavy Duty - 9919, POST /api/switch-user,
// then a NEW browser context carrying the switched person's own `user` + `fe_permissions_wrapper` (the admin context rewrites them). Each role's
// permissions are read back (GET /api/roles/{id}) and the person's fe-permissions count recorded. ALWAYS exit-switch-user at the end (finally).
// Positive control: the Admin context reads the same cells first (links expected where the Admin has every permission).
// Data: A/R - "ZZAUTOTEST AR Customer A" (work order invoices + part sale P11315-248 at Heavy Duty; s90); A/P - "ZZY Types P92" (bill ZZY925996616 +
// vendor credit C-13685 at Heavy Duty; s92); A/R Collection phone/credit term - "Andrews' Truck & Trailer Repair LLC" (343-203-3967, Net 30).
import { start, REPORTS, A } from './lib.mjs'; import { mk } from './api.mjs'; import { mkSort } from './sortlib.mjs'; import { mkFilt } from './filt.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs';
const OUT = new URL('./pm1/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const adm = s.page; const a = mk(adm); const ONLY = process.env.ONLY?.split(',');
const HEAVY = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; const R = {};
const ROLE = { rep: 'ZZAUTOTEST P71 Reports only', invwo: 'ZZAUTOTEST P71 Inv+WO view', wops: 'ZZAUTOTEST P71 WO+PartSales view', invps: 'ZZAUTOTEST P71 Inv+PartSales view',
  vomv: 'ZZAUTOTEST P71 VOM view', vomce: 'ZZAUTOTEST P71 VOM create-edit', cust: 'ZZAUTOTEST P71 Customers view', admin1: 'Admin' };
// admin1 (C715424/C715384/C715385, added 18:55): the Admin role, enrolled ONLY at Heavy Duty - the quick-login Admin is enrolled at all three locations (p76),
// so 'a location you are not enrolled in' needs a new person. The person's enrolments are read back (staff row + the viewer's own location switcher).
const J = (r) => r.j ?? r.body; const coll = (d) => Array.isArray(d) ? d : d?.collection ?? [];
const roles = coll(J(await a.get('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles?pagination[rowsPerPage]=200'))?.data);
const rid = (n) => roles.find((r) => (r.name ?? r.label) === n)?.id;
const deps = coll(J(await a.get('/api/departments'))?.data); const svc = deps.find((d) => (d.name ?? d.label) === 'Service') ?? deps[0];
async function staff(email) { return coll(J(await a.get('/api/staff?limit=200&search=' + encodeURIComponent(email)))?.data).find((x) => String(x.email).toLowerCase() === email); }
async function person(key, roleName) { const email = `zz.ag.${key}@staging.shopview.local`; const log = []; let row = await staff(email);
  if (!row) { const c = await a.post('/api/iam/create', { email, first_name: 'ZZAUTOTEST Perm', last_name: key, role_id: rid(roleName), departments: [svc?.id].filter(Boolean) }); log.push('create ' + c.st + ' ' + JSON.stringify(J(c)).slice(0, 160)); row = await staff(email); }
  if (row) { const en = await a.post('/api/staff/enrollment/create', { staffId: row.staff_id, workplaceId: HEAVY, departmentId: svc?.id }); log.push('enrol ' + en.st); }
  return { row, log, roleId: rid(roleName), roleBody: J(await a.get('/api/roles/' + rid(roleName)))?.data ?? null }; }
async function viewAs(userId) { let sw = await a.post('/api/switch-user', { user_id: userId }); if (sw.st >= 300) { await a.post('/api/exit-switch-user', {}); sw = await a.post('/api/switch-user', { user_id: userId }); }
  if (sw.st >= 300) throw new Error('switch ' + sw.st + ' ' + JSON.stringify(J(sw)).slice(0, 160));
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }); const fe = J(await a.get('/api/auth/me/fe-permissions'))?.data ?? null; const user = J(sw)?.data ?? null;
  const ctx = await s.r.browser.newContext({ storageState: await adm.context().storageState(), viewport: { width: 1440, height: 900 }, acceptDownloads: true, ignoreHTTPSErrors: true });
  await ctx.addInitScript(([u, f]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u?.token) localStorage.setItem('token', u.token); } catch {} }, [user, fe]);
  const page = await ctx.newPage(); page.setDefaultTimeout(15000); await page.goto(A + '/customers', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500);
  return { page, ctx, perms: Array.isArray(fe) ? fe : fe?.fe_permissions ?? fe, close: async () => { await ctx.close().catch(() => {}); await a.post('/api/exit-switch-user', {}); } }; }
const settle = async (p) => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
const go = async (p, k) => { await p.goto(A + (REPORTS[k] || k), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500); await settle(p); };
const shot = async (p, o, n) => { const f = OUT + o.id + '-' + n + '.png'; await p.mouse.move(5, 890); await p.screenshot({ path: f }); (o.shots ||= []).push(f); return f; };
const cellInfo = (p, re) => p.evaluate((src) => { const re = new RegExp(src); return [...document.querySelectorAll('main tbody td')].filter((td) => re.test(td.innerText.trim())).slice(0, 12).map((td) => {
  const t = td.querySelector('a, [role=link]') || td.querySelector('span, div') || td; const c = getComputedStyle(t); const tr = td.closest('tr');
  return { text: td.innerText.trim(), link: !!td.querySelector('a, [role=link]'), tag: t.tagName, color: c.color, cursor: c.cursor, row: tr ? tr.innerText.replace(/\s+/g, ' ').slice(0, 140) : '' }; }); }, re.source);
async function clickCell(p, o, re, tag) { const td = p.locator('main tbody td').filter({ hasText: re }).first(); const u0 = p.url(); const pages0 = p.context().pages().length;
  await td.click().catch((e) => { o[tag + 'ClickErr'] = String(e).slice(0, 120); }); await p.waitForTimeout(4000); await settle(p);
  o[tag] = { from: u0, url: p.url(), newTabs: p.context().pages().length - pages0, dialogs: await p.locator('.q-dialog').count(), notes: (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ')) };
  await shot(p, o, tag); }
async function ard(p, cust) { await go(p, 'ard'); await mkFilt(p).pick('Customer', cust); await settle(p); const S = mkSort(p); for (const b of [/^91 or more/, /^61-90/, /^31-60/, /^1-30/, /^Current/]) await S.expand(b).catch(() => {}); await settle(p); }
async function apd(p, v) { await go(p, 'apd'); await mkFilt(p).pick('Vendor', v); await settle(p); const S = mkSort(p); for (const b of [/^91 or more/, /^61-90/, /^31-60/, /^1-30/, /^Current/]) await S.expand(b).catch(() => {}); await settle(p); }
async function apu(p, v) { await go(p, 'apu'); await mkFilt(p).pick('Vendor', v); await settle(p); await mkSort(p).expand(new RegExp('^' + v + ' \\(')).catch(() => {}); await settle(p); }
const switcher = async (p) => { const av = p.locator('header button, header .q-avatar').filter({ hasText: /^[A-Z]{2}$/ }).last(); await av.click().catch(() => {}); await p.waitForTimeout(1200); const t = (await p.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const ch = p.locator('.q-menu').last().getByText(/Change Location/).first(); let list = ''; if (await ch.count()) { await ch.click().catch(() => {}); await p.waitForTimeout(1200); list = (await p.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' '); } await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); return { menu: t, list }; };
const locCells = (p) => p.evaluate(() => { const ths = [...document.querySelectorAll('main thead th')].map((t) => t.innerText.trim()); const i = ths.findIndex((t) => /^Location/.test(t)); const set = {}; for (const tr of document.querySelectorAll('main tbody tr')) { const td = tr.querySelectorAll('td')[i]; const v = td && td.innerText.trim(); if (v && /Staging|ZZAUTOTEST/.test(v)) set[v] = (set[v] || 0) + 1; } return { col: i, counts: set }; });
const locMenu = async (p) => { await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1200); const m = p.locator('.q-menu:visible').last(); return { text: (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean), ticked: await m.locator('.q-checkbox[aria-checked=true], [role=checkbox][aria-checked=true]').count(), boxes: await m.locator('.q-checkbox, [role=checkbox]').count() }; };
const CA = 'ZZAUTOTEST AR Customer A', VA = 'ZZY Types P92', CP = "Andrews' Truck & Trailer Repair LLC";
const WOINV = /^S[0-9]*-?\d+$/, PSALE = /^P\d+-\d+$/, BILL = /^ZZY925996616$/, VCR = /^C-13685$/;
const CHECKS = {
  C715425: ['invwo', async (p, o) => { await ard(p, CA); o.wo = await cellInfo(p, WOINV); o.ps = await cellInfo(p, PSALE); await shot(p, o, '1-ids'); await clickCell(p, o, WOINV, '2-click-wo'); }],
  C715426: ['wops', async (p, o) => { await ard(p, CA); o.wo = await cellInfo(p, WOINV); o.ps = await cellInfo(p, PSALE); await shot(p, o, '1-ids'); await clickCell(p, o, WOINV, '2-click-wo'); }],
  C715427: ['invps', async (p, o) => { await ard(p, CA); o.wo = await cellInfo(p, WOINV); o.ps = await cellInfo(p, PSALE); await shot(p, o, '1-ids'); await clickCell(p, o, PSALE, '2-click-ps'); }],
  C715428: ['vomv', async (p, o) => { await apu(p, VA); o.bill = await cellInfo(p, BILL); await shot(p, o, '1-bill'); await clickCell(p, o, BILL, '2-click-bill'); }],
  C715429: ['vomce', async (p, o) => { await apu(p, VA); o.bill = await cellInfo(p, BILL); await shot(p, o, '1-bill'); await clickCell(p, o, BILL, '2-click-bill'); }],
  C715430: ['rep', async (p, o) => { await apd(p, VA); o.bill = await cellInfo(p, BILL); o.vcr = await cellInfo(p, VCR); await shot(p, o, '1-nums'); await clickCell(p, o, BILL, '2-click-bill'); }],
  C715431: ['cust', async (p, o) => { await go(p, 'ars'); o.name = await cellInfo(p, new RegExp('^' + CA + '$')); await shot(p, o, '1-name'); await clickCell(p, o, new RegExp('^' + CA + '$'), '2-click'); o.chips = (await mkFilt(p).chips().catch(() => [])); }],
  C715610: ['rep', async (p, o) => { await go(p, 'ars'); o.name = await cellInfo(p, new RegExp('^' + CA + '$')); await shot(p, o, '1-name'); await clickCell(p, o, new RegExp('^' + CA + '$'), '2-click'); }],
  C715432: ['rep', async (p, o) => { await go(p, 'aps'); o.name = await cellInfo(p, new RegExp('^' + VA + '$')); await shot(p, o, '1-name'); await clickCell(p, o, new RegExp('^' + VA + '$'), '2-click'); o.chips = (await mkFilt(p).chips().catch(() => [])); }],
  C715448: ['rep', async (p, o) => { await go(p, 'arc'); await mkFilt(p).pick('Customer', CP); await settle(p); o.group = (await p.locator('main tbody tr').first().innerText()).replace(/\s+/g, ' '); await shot(p, o, '1-group');
    const E = mkExp(p, OUT); const pdf = await E.exportAs('PDF', o.id + '-pdf'); o.pdf = { file: pdf.file, notes: pdf.notes }; if (pdf.file) o.pdfText = E.readPdf(pdf.file).split('\n').filter((l) => /Andrews|Phone|Credit/i.test(l)).slice(0, 6);
    await p.waitForTimeout(5000); const csv = await E.exportAs('CSV', o.id + '-csv'); o.csv = { file: csv.file, notes: csv.notes }; if (csv.file) o.csvTop = E.readCsv(csv.file).slice(0, 6); }],
  C715424: ['admin1', async (p, o) => { await ard(p, 'ZZAUTOTEST AR V1R-87 Location C'); o.switcher = await switcher(p); o.inv = await cellInfo(p, /^S-17887$/); o.row = (await p.locator('main tbody tr').filter({ hasText: 'S-17887' }).first().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot(p, o, '1-row'); await clickCell(p, o, /^S-17887$/, '2-click'); }],
  C715384: ['admin1', async (p, o) => { await go(p, 'arc'); o.locs = await locCells(p); await shot(p, o, '1-rows'); o.menu = await locMenu(p); await shot(p, o, '2-menu'); await p.keyboard.press('Escape'); }],
  C715385: ['admin1', async (p, o) => { await go(p, 'apu'); const S = mkSort(p); for (const g of (await p.locator('main tbody tr').allInnerTexts()).slice(0, 12)) { const n = g.replace(/keyboard_arrow_\w+/, '').trim().split(' (')[0]; if (n) await S.expand(new RegExp('^' + n.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&') + ' \\(')).catch(() => {}); } await settle(p);
    o.locs = await locCells(p); await shot(p, o, '1-rows'); o.menu = await locMenu(p); await shot(p, o, '2-menu'); await p.keyboard.press('Escape'); }],
  C715474: ['rep', async (p, o) => { await go(p, 'ars'); o.menu = (await p.locator('aside, .q-drawer').first().innerText().catch(() => '')).split('\n').map((t) => t.trim()).filter(Boolean); await shot(p, o, '1-menu');
    for (const k of ['ars', 'ard', 'arc', 'aps', 'apd', 'apu']) { await go(p, k); o[k] = { url: p.url(), title: (await p.locator('main').innerText()).split('\n')[0], money: (await p.locator('main').innerText()).match(/\$-?[\d,]+\.\d\d/g)?.slice(0, 4) ?? [], totals: (await p.locator('main').innerText()).match(/Totals[^\n]*/)?.[0]?.slice(0, 120) }; await shot(p, o, '2-' + k); } }],
  C715616: ['rep', async (p, o) => { const E = mkExp(p, OUT); await go(p, 'ars'); const pdf = await E.exportAs('PDF', o.id + '-ars'); o.pdf = { file: pdf.file, name: pdf.name, bytes: pdf.bytes, notes: pdf.notes }; await shot(p, o, '1-pdf');
    await go(p, 'apd'); o.apd = { url: p.url(), title: (await p.locator('main').innerText()).split('\n')[0] }; await shot(p, o, '2-apd'); const csv = await E.exportAs('CSV', o.id + '-apd'); o.csv = { file: csv.file, name: csv.name, bytes: csv.bytes, notes: csv.notes }; await shot(p, o, '3-csv'); }],
};
// positive control: the Admin's own view of the same cells (every permission)
try { await ard(adm, CA); R.control = { wo: await cellInfo(adm, WOINV), ps: await cellInfo(adm, PSALE) }; await adm.screenshot({ path: OUT + 'control-ard.png' }); await apd(adm, VA); R.control.bill = await cellInfo(adm, BILL); R.control.vcr = await cellInfo(adm, VCR); await adm.screenshot({ path: OUT + 'control-apd.png' }); } catch (e) { R.controlErr = String(e).slice(0, 200); }
const byRole = {}; for (const [id, [rk, fn]] of Object.entries(CHECKS)) { if (ONLY && !ONLY.includes(id)) continue; (byRole[rk] ||= []).push([id, fn]); }
for (const [rk, list] of Object.entries(byRole)) { const P = await person(rk, ROLE[rk]); R['role_' + rk] = { role: ROLE[rk], roleId: P.roleId, row: P.row && Object.fromEntries(Object.entries(P.row).filter(([k]) => /work|loca|enrol|role/i.test(k))), staff: P.row && { id: P.row.id, staff_id: P.row.staff_id, role: P.row.role_name ?? P.row.role }, log: P.log, roleBody: P.roleBody };
  if (!P.row) { for (const [id] of list) R[id] = { id, err: 'person not made ' + P.log.join('; ') }; continue; }
  let V = null; try { V = await viewAs(P.row.id); R['role_' + rk].perms = V.perms;
    for (const [id, fn] of list) { const o = { id, role: ROLE[rk] }; try { await fn(V.page, o); } catch (e) { o.err = String(e).slice(0, 300); await shot(V.page, o, 'error').catch(() => {}); } R[id] = o; console.log(id, o.err || 'ok', JSON.stringify(o).slice(0, 400)); }
  } catch (e) { R['role_' + rk].err = String(e).slice(0, 300); console.log('role', rk, R['role_' + rk].err); } finally { if (V) await V.close(); else await a.post('/api/exit-switch-user', {}); } }
const me = J(await a.get('/api/auth/me/fe-permissions'))?.data; R.adminBack = Array.isArray(me) ? me.length : (me?.fe_permissions ?? []).length;
fs.writeFileSync(OUT + 'out.json', JSON.stringify(R, null, 1)); console.log('pm1 done adminBack', R.adminBack); await s.close(); process.exit(0);
