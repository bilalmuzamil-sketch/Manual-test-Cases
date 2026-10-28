/** sv11581-nofin-probe-1028.mts — 28 Oct 2026, sv11581. C847744 step 7 done fairly: the no-financial user ("ZZAUTOTEST SV11581 NoFin",
 *  role "ZZAUTOTEST WO View Only", seeFinancialData read back false) gets Line technicians ON in their OWN Column Selection (prefs are
 *  per user; the full run left it at the default, off) and Ana pinned; then the card is read in Detailed: crew avatars expected, total not.
 *  Output EV/sv11581-nofin-probe-1028.json, EV/SV11581-nofin-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, workOrders, candidates } from './data.mts';
import { EV, t, display, tab, search } from './wob.mts'; import { staffRows } from './staff.mts'; import { viewAs } from './viewas.mts'; import { ME_NAME } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = {}; const PREF = '/api/users/me/preferences/work-orders-list'; const CUST = process.env.CUST || 'ZZAUTOTEST SV11581 Card Size 50289';
try {
  const ana = (await staffRows(a, 'zz.wob.sv11581.ana'))[0]; const vu = (await staffRows(a, 'zz.wob.sv11581.nofin'))[0]; const w = (await workOrders(a, CUST))[0]; o.wo = w?.number;
  const me = (await candidates(a)).find((x: any) => x.name === ME_NAME);
  o.role = (await a.get(`/api/roles/${vu.role_id}`)).body?.data; o.roleFin = o.role?.cross_toggles?.seeFinancialData ?? null; o.roleName = o.role?.name; delete o.role;
  const v = await viewAs(browser, p, a, vu.id, me.id);
  try { const before = (await a.get(PREF)).body?.data?.value ?? {}; o.prefBefore = before;
    o.prefPut = (await a.put(PREF, { value: { ...before, pinnedTechnicianIds: [ana.staff_id], boardCardSize: 'detailed', boardFields: { ...(before.boardFields ?? {}), line_technicians: true } } })).status; o.prefAfter = (await a.get(PREF)).body?.data?.value;
    const pg = v.page; await pg.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All').catch(() => {}); await display(pg, 'Board View'); await pg.waitForTimeout(2000); await search(pg, CUST); await pg.waitForTimeout(2500);
    await pg.locator('[data-test-id="button_board_fields_selection"]').click(); await pg.waitForTimeout(800);
    o.pickerFields = await pg.evaluate(() => [...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map((e) => `${((e.closest('.q-item') || e.parentElement) as HTMLElement)?.innerText.replace(/\s+/g, ' ').trim().slice(0, 25)}=${e.getAttribute('aria-checked')}`));
    const lt = pg.locator('[data-test-id="toggle_board_field_line_technicians"]'); if ((await lt.count()) && (await lt.getAttribute('aria-checked')) !== 'true') { await lt.click(); await pg.waitForTimeout(1500); o.turnedOnInUi = true; }
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200);
    const card = pg.locator(`[data-test-id="board_card_${w.id}"]`).first(); await card.scrollIntoViewIfNeeded().catch(() => {});
    o.card = await card.evaluate((e) => ({ text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim(), crew: [...e.querySelectorAll('*')].filter((x) => { const r = x.getBoundingClientRect(); const cs = getComputedStyle(x); return r.width >= 16 && r.width <= 40 && Math.abs(r.width - r.height) < 2 && parseFloat(cs.borderRadius) >= r.width / 2 - 1 && /^[A-Z]{1,3}$/.test((x as HTMLElement).innerText.trim()); }).map((x) => (x as HTMLElement).innerText.trim()), dollar: /\$/.test((e as HTMLElement).innerText) }));
    await card.screenshot({ path: path.join(EV, 'SV11581-nofin-card.png') });
  } finally { await v.close?.(); await a.post('/api/exit-switch-user', {}); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'sv11581-nofin-probe-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 2500)); await done(browser);
