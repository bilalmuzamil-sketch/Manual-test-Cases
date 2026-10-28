/** sv11581-cardsize-1028.mts — 28 Oct 2026, QA branch sv11581 (SV-11581: Board View Card size, Detailed / Compact).
 *  Source: PRD 845185030 v81, S3-R11, S3-R11a (Detailed / Compact / Column Selection / crew avatars / saved per user), S6-R3, S5-E2.
 *  Tests: C847744 (what each size shows) and C847745 (saved per user, apart from Tech View density, new users get Detailed).
 *  The control is new, so it is FOUND, not assumed: toolbar buttons are dumped (test id, aria-label, title, text, tooltip on hover)
 *  and the Card size control is the one whose id/label/tooltip says "card size". Card read = innerText, avatar count, "$" and "%"
 *  present, box height, the card's padding and the gap between its blocks (computed style), plus a 2x picture of the card.
 *  Data (Rule 107, ZZAUTOTEST): technician "ZZAUTOTEST SV11581 Ana", customer "ZZAUTOTEST SV11581 Card Size <n>", WO-1 Approved,
 *  lead Ana, one canned line with Ana on it. New user "ZZAUTOTEST SV11581 New <n>" (Admin role) for the default; the view-only
 *  role (seeFinancialData off, restored after) for crew-without-total. Preferences put back at the end.
 *  Output EV/sv11581-cardsize-1028.json, pictures EV/SV11581-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, allBoardCols } from './wob.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts'; import { candidates } from './data.mts'; import { ME_NAME } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { at: new Date().toISOString() }; const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);
const save = () => fs.writeFileSync(path.join(EV, 'sv11581-cardsize-1028.json'), JSON.stringify(o, null, 1));
const RUNNO = String(Date.now() % 100000); const D = '@staging.shopview.local';
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {}; o.prefBefore = ORIGINAL;
const RI = await roleIds(a); const TECH = RI['Technician']; const ADMIN = Object.entries(RI).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const toWO = async (d: string, q: string, pg: Page = p) => { await pg.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000, pg); await tab(pg, 'All').catch(() => {}); await display(pg, d); await W(2000, pg); if (q) { await search(pg, q); await W(2000, pg); } };
const toolbar = (pg: Page = p) => pg.evaluate(() => [...document.querySelectorAll('button, [role=button]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.y < 260 && r.y > 60; })
  .map((e) => { const r = e.getBoundingClientRect(); return { tid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'), title: e.getAttribute('title'), text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim().slice(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }));
async function findCardSize(pg: Page = p) {
  const direct = pg.locator('[data-test-id*="card_size" i], [data-test-id*="cardsize" i], [aria-label*="card size" i], [title*="card size" i]').first();
  if (await direct.count()) return { how: 'attribute', loc: direct };
  const bs = await toolbar(pg); const tips: any[] = [];
  for (const b of bs) { if (!b.tid && !b.aria && !b.text) continue; const loc = b.tid ? pg.locator(`[data-test-id="${b.tid}"]`).first() : pg.locator('button').filter({ hasText: b.text }).first();
    await loc.hover().catch(() => {}); await W(700, pg); const tip = await pg.locator('.q-tooltip').allInnerTexts().catch(() => []); tips.push({ ...b, tip }); if (tip.some((x) => /card size/i.test(x))) return { how: 'tooltip', loc, tips }; }
  return { how: 'not found', loc: null, tips };
}
const menuItems = (pg: Page = p) => pg.locator('.q-menu').last().evaluate((m) => [...m.querySelectorAll('.q-item, [role=menuitem], [role=option], .q-radio, button')].map((e) => ({ text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim(), active: e.classList.contains('q-item--active') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || !!e.querySelector('[aria-checked=true], .q-radio__inner--truthy, .text-primary') })).filter((x) => x.text)).catch(() => []);
async function readCard(id: string, tag: string, pg: Page = p) {
  const sel = `[data-test-id="board_card_${id}"]`; const c = pg.locator(sel).first(); if (!(await c.count())) return { found: false };
  await c.scrollIntoViewIfNeeded().catch(() => {}); await W(500, pg);
  const r = await c.evaluate((e) => { const crew = [...e.querySelectorAll('*')].filter((x) => { const rr = x.getBoundingClientRect(); const cc = getComputedStyle(x); return rr.width >= 16 && rr.width <= 40 && Math.abs(rr.width - rr.height) < 2 && parseFloat(cc.borderRadius) >= rr.width / 2 - 1 && /^[A-Z]{1,3}$/.test((x as HTMLElement).innerText.trim()); }).map((x) => (x as HTMLElement).innerText.trim()); const cs = getComputedStyle(e); const kids = [...e.children] as HTMLElement[]; const inner = kids.length === 1 ? kids[0] : e; const ics = getComputedStyle(inner);
    const blocks = [...inner.children].filter((k) => (k as HTMLElement).getBoundingClientRect().height > 0) as HTMLElement[];
    const gaps = blocks.slice(1).map((b, i) => Math.round(b.getBoundingClientRect().top - blocks[i].getBoundingClientRect().bottom));
    return { text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim(), height: Math.round(e.getBoundingClientRect().height),
      padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft], innerPadding: [ics.paddingTop, ics.paddingRight, ics.paddingBottom, ics.paddingLeft], innerGap: ics.rowGap || ics.gap,
      blocks: blocks.map((b) => b.innerText.replace(/\s+/g, ' ').trim().slice(0, 60)), gaps,
      avatars: e.querySelectorAll('.q-avatar, img, [class*="avatar"]').length, dollar: /\$/.test((e as HTMLElement).innerText), percent: /%/.test((e as HTMLElement).innerText), divider: !!e.querySelector('hr, .q-separator, [class*="divider"]'), crew }; });
  await c.screenshot({ path: path.join(EV, `SV11581-${tag}.png`) }).catch(() => {}); return { found: true, ...r };
}
const fieldsPicker = async (pg: Page = p) => { await pg.locator('[data-test-id="button_board_fields_selection"]').click(); await W(900, pg);
  const list = await pg.evaluate(() => [...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map((e) => ({ tid: e.getAttribute('data-test-id'), on: e.getAttribute('aria-checked') === 'true' || e.classList.contains('q-toggle--truthy') || !!e.querySelector('.q-toggle__inner--truthy'), label: ((e.closest('.q-item') || e.parentElement) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim().slice(0, 40) })));
  return list; };
async function chooseSize(name: 'Compact' | 'Detailed', pg: Page = p) { const f = await findCardSize(pg); if (!f.loc) return { found: false, how: f.how };
  await f.loc.click(); await W(900, pg); const opts = await menuItems(pg); const it = pg.locator('.q-menu').last().getByText(new RegExp(`^\\s*${name}\\s*$`)).first(); const hit = await it.count(); if (hit) { await it.click(); await W(1500, pg); } await pg.keyboard.press('Escape').catch(() => {}); await W(500, pg); return { found: true, how: f.how, opts, clicked: !!hit }; }
async function readSize(pg: Page = p) { const f = await findCardSize(pg); if (!f.loc) return { found: false }; await f.loc.click(); await W(900, pg); const opts = await menuItems(pg); await pg.screenshot({ path: path.join(EV, `SV11581-size-menu-${Date.now() % 100000}.png`) }).catch(() => {}); await pg.keyboard.press('Escape'); await W(500, pg); return { found: true, opts }; }
try {
  const A = (await person(a, 'ZZAUTOTEST SV11581', 'Ana', { role: TECH, email: `zz.wob.sv11581.ana${D}`, clockable: true, workplace: HEAVY })).row; o.eligible = await ensureEligible(a, A, 'A');
  const CUST = `ZZAUTOTEST SV11581 Card Size ${RUNNO}`; const c = await customer(a, CUST, 'SV11581'); const wo = await workOrder(a, c, 'approved', A.staff_id);
  const canned = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data);
  const line = (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[0].id, status: 'authorized' })).body?.data?.line_id;
  o.lineTech = (await a.put(`/api/work-orders/lines/${line}/technicians`, { staffIds: [A.staff_id] })).status;
  o.data = { customer: CUST, wo: (await workOrders(a, CUST))[0]?.number, woId: wo }; save();
  // 28 Oct run 1: Ana's column is far right and Board View draws only nearby columns (L0430) -> pin Ana so her column sits next to Unassigned
  o.pinAna = (await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [A.staff_id] } })).status;
  // ---- C847744 step 1-2: the toolbar and the control
  await toWO('Board View', CUST); o.toolbar = await toolbar(); await p.screenshot({ path: path.join(EV, 'SV11581-bv-toolbar.png') }).catch(() => {});
  const f = await findCardSize(); o.cardSizeControl = { how: f.how, tips: (f as any).tips ?? null };
  o.fieldsStart = await fieldsPicker();
  // 28 Oct run 2: set the C847744 preconditions: Service advisor, Line count, Estimated hours ON; Created date and VIN/serial OFF
  { const want: Record<string, boolean> = { 'Service advisor': true, 'Line count': true, 'Estimated hours': true, 'Line technicians': true, 'Created date': false, 'VIN/serial': false };
    for (const x of o.fieldsStart as any[]) if (x.label in want && x.on !== want[x.label]) { await p.locator(`[data-test-id="${x.tid}"]`).click(); await W(1200); }
    o.fieldsSet = await p.evaluate(() => [...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map((e) => `${((e.closest('.q-item') || e.parentElement) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim().slice(0, 30)}=${e.getAttribute('aria-checked')}`)); }
  await p.keyboard.press('Escape'); await W(600);
  o.sizeAtStart = await readSize();
  o.s_detailed0 = await chooseSize('Detailed'); o.cols0 = (await allBoardCols(p)).map((x: any) => x.name).slice(0, 8);
  o.cardDetailed = await readCard(wo, 'card-detailed');
  // ---- step 3: Compact
  o.s_compact = await chooseSize('Compact'); o.cardCompact = await readCard(wo, 'card-compact'); o.colsCompact = (await allBoardCols(p)).map((x: any) => x.name).slice(0, 8);
  await p.screenshot({ path: path.join(EV, 'SV11581-bv-compact.png') }).catch(() => {});
  // ---- step 4: Column Selection in Compact: same fields; turn one off-field on; the card stays compact
  o.fieldsCompact = await fieldsPicker(); const off = (o.fieldsCompact as any[]).find((x) => x.label === 'Created date' && x.tid);
  if (off) { await p.locator(`[data-test-id="${off.tid}"]`).click(); await W(1500); o.turnedOn = off; } await p.keyboard.press('Escape'); await W(800);
  o.cardCompactAfterField = await readCard(wo, 'card-compact-field-on');
  { const vin = (o.fieldsCompact as any[]).find((x) => x.label === 'VIN/serial'); if (vin) { await p.locator('[data-test-id="button_board_fields_selection"]').click(); await W(800); await p.locator(`[data-test-id="${vin.tid}"]`).click(); await W(1500); await p.keyboard.press('Escape'); await W(800);
      o.cardCompactVinOn = await readCard(wo, 'card-compact-vin-on'); await p.locator('[data-test-id="button_board_fields_selection"]').click(); await W(800); await p.locator(`[data-test-id="${vin.tid}"]`).click(); await W(1200); await p.keyboard.press('Escape'); await W(600); } }
  // ---- step 5: Detailed again
  o.s_detailed1 = await chooseSize('Detailed'); o.cardDetailed1 = await readCard(wo, 'card-detailed-field-on');
  if (off) { await p.locator('[data-test-id="button_board_fields_selection"]').click(); await W(800); await p.locator(`[data-test-id="${off.tid}"]`).click(); await W(1200); await p.keyboard.press('Escape'); await W(600); o.turnedBackOff = true; }
  // ---- step 6 + C847745 parts: density is separate; persistence for this user
  await display(p, 'Tech View'); await W(2000); await p.locator('[data-test-id="button_density"]').click(); await W(800); o.densityMenu = await menuItems(); await p.keyboard.press('Escape'); await W(500);
  await display(p, 'Board View'); await W(2000); o.s_compact2 = await chooseSize('Compact'); o.prefAfterCompact = (await a.get(PREF)).body?.data?.value ?? null;
  await p.reload({ waitUntil: 'domcontentloaded' }); await W(6000); o.sizeAfterReload = await readSize(); o.cardAfterReload = await readCard(wo, 'card-after-reload');
  await display(p, 'Tech View'); await W(2000); await p.locator('[data-test-id="button_density"]').click(); await W(800); const comf = p.locator('[data-test-id="option_density_comfortable"]'); o.densityComfortable = await comf.count(); if (o.densityComfortable) await comf.click(); await W(1500); await p.keyboard.press('Escape');
  await display(p, 'Board View'); await W(2000); o.sizeAfterDensityChange = await readSize(); o.prefAfterBoth = (await a.get(PREF)).body?.data?.value ?? null;
  // ---- C847745 step 1: a new user starts on Detailed
  const me = (await candidates(a)).find((x: any) => x.name === ME_NAME);
  if (ADMIN) { const nu = (await person(a, 'ZZAUTOTEST SV11581', `New ${RUNNO}`, { role: ADMIN, email: `zz.wob.sv11581.new.${RUNNO}${D}`, clockable: false, workplace: HEAVY })).row; o.newUser = !!nu?.id;
    const v = await viewAs(browser, p, a, nu.id, me?.id ?? ''); try { await toWO('Board View', CUST, v.page); o.newUserSize = await readSize(v.page); o.newUserCard = await readCard(wo, 'card-new-user', v.page);
      o.newUserCompact = await chooseSize('Compact', v.page); } finally { await v.close?.(); await a.post('/api/exit-switch-user', {}); }
    o.mySizeAfterNewUser = await (async () => { await toWO('Board View', CUST); return readSize(); })(); }
  // ---- C847744 step 7: crew avatars without see financial data, no total
  const rolesL = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${process.env.WOB_ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
  const VIEW = rolesL.find((r: any) => /^ZZAUTOTEST WO View Only$/.test(r.label ?? r.name ?? ''))?.id; o.viewRole = !!VIEW;
  if (VIEW && me) { const r0 = (await a.get(`/api/roles/${VIEW}`)).body?.data; o.viewRoleFin = r0?.cross_toggles?.seeFinancialData ?? null;
    const vu = (await person(a, 'ZZAUTOTEST SV11581', 'NoFin', { role: VIEW, email: `zz.wob.sv11581.nofin${D}`, clockable: false, workplace: HEAVY })).row;
    const v = await viewAs(browser, p, a, vu.id, me.id); try { o.noFinPin = (await a.put(PREF, { value: { pinnedTechnicianIds: [A.staff_id] } })).status; await toWO('Board View', CUST, v.page); await chooseSize('Detailed', v.page); o.noFinCard = await readCard(wo, 'card-no-financial', v.page); } finally { await v.close?.(); await a.post('/api/exit-switch-user', {}); } }
  // ---- C847745 step 5 (LAST: a second quick-login rotates the branch session, so it goes after everything else): sign out and in again = a fresh sign-in in a new browser (open() signs in again)
  { const s2 = await open('/workorders?tab=all'); try { await toWO('Board View', CUST, s2.page); o.sizeAfterNewSignIn = await readSize(s2.page); o.cardAfterNewSignIn = await readCard(wo, 'card-after-new-sign-in', s2.page); await display(s2.page, 'Tech View'); await W(2000, s2.page); await s2.page.locator('[data-test-id="button_density"]').click(); await W(800, s2.page); o.densityAfterNewSignIn = await menuItems(s2.page); } catch (e: any) { o.newSignInError = String(e?.message || e).slice(0, 200); } finally { await s2.browser.close().catch(() => {}); } }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 500); await p.screenshot({ path: path.join(EV, 'SV11581-error.png') }).catch(() => {}); }
o.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; save(); console.log(t(), JSON.stringify(o).slice(0, 7000));
await done(browser);
