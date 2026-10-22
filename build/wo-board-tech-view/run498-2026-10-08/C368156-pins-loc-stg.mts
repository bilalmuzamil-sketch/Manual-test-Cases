/** C368156 on STAGING, 16 Oct 2026 (batch 40). In the 16 Oct run step 5 (switch back to Heavy Duty) failed twice inside rest-batch.mts,
 *  which works in the "view as runner" page: that page's init script writes the switch-time copy of the user into the browser on EVERY
 *  load, so after going to Lethbridge the menu's "Change Location:" field still read Heavy Duty (L0400) and picking it changed nothing.
 *  Done the way a person does it in ONE signed-in browser (loc-switchback-probe.mts proved the clean switch back), this script:
 *  as the signed-in Admin, pins cleared · step 1 Heavy Duty Board View, pin Ana, Ben, Cal (pin icon in each header) · step 2 the fourth
 *  pin (Dan) disabled + its message · step 3 menu > Change Location > Staging Lethbridge - 4310 (the second location), Board View, pinned
 *  columns counted · step 4 pin Xia, Yan, Zoe · step 5 reload (settled page), read the Change Location field, menu > Staging Heavy Duty,
 *  top bar read back (if the field already showed the target: detour through another location first, then retry once on a settled page,
 *  menu photographed), Board View, pinned columns read. Saved pins put back at the end. json EV/C368156-b40.json, pictures C368156-b40-*. */
import { LOC1_NAME, LOC2_NAME } from './profile.mts';
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts';
import { EV, t, display, tab, toColumn, boardCols, switchLocUI, toasts } from './wob.mts';
import { person, roleIds, HEAVY, LETH } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C368156-b40-${n}.png`) }).catch(() => {});
const top = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
const PREF = '/api/users/me/preferences/work-orders-list'; const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const ORIGINAL = await prefGet();
const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const tech = async (f: string, l: string, tag: string, wp = HEAVY) => (await person(a, `ZZAUTOTEST ${f}`, l, { role: TECH, email: `zz.wob.${tag}${D}`, clockable: true, workplace: wp })).row;
const ANA = await tech('Ana', 'Alpha', 'ana.alpha'), BEN = await tech('Ben', 'Bravo', 'ben.bravo'), CAL = await tech('Cal', 'Charlie', 'cal.charlie'), DAN = await tech('Dan', 'Delta', 'dan.delta');
const XIA = await tech('Xia', 'Xray', 'xia.loc2', LETH), YAN = await tech('Yan', 'Yankee', 'yan.loc2', LETH), ZOE = await tech('Zoe', 'Zulu', 'zoe.loc2', LETH);
const NAME: Record<string, string> = Object.fromEntries([[ANA, 'Ana'], [BEN, 'Ben'], [CAL, 'Cal'], [DAN, 'Dan'], [XIA, 'Xia'], [YAN, 'Yan'], [ZOE, 'Zoe']].map(([r, n]: any) => [r?.staff_id, n]));
o.techs = Object.values(NAME); o.missing = [ANA, BEN, CAL, DAN, XIA, YAN, ZOE].filter((x) => !x).length;
const named = (ids: string[]) => ids.map((i) => NAME[i] ?? `other(${String(i).slice(0, 4)})`);
/** columns at the left of the board (pinned ones sit first): name and the pin button's state, read off the screen */
const leftCols = async () => { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`).catch(() => {}); await p.waitForTimeout(800);
  return p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].slice(0, 6).map(h => { const id = h.getAttribute('data-test-id').replace('board_column_header_', ''); const b = document.querySelector('[data-test-id="button_board_pin_' + id + '"]'); const n = document.querySelector('[data-test-id="board_column_name_' + id + '"]');
    return { name: n ? n.textContent.trim() : id, pinned: b ? /pin--pinned|text-primary/.test(b.className) && !/pin--unpinned/.test(b.className) : null, pinClass: b ? (b.className.match(/board-column-header__pin--\\w+/) || [''])[0] : null }; })`) as Promise<any[]>; };
const pinnedCount = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="button_board_pin_"]')].filter(b => /pin--pinned/.test(b.className)).length`) as Promise<number>;
const board = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
  for (let i = 0; i < 15 && (await p.locator('[data-test-id^="board_column_header_"]').count()) < 2; i++) await p.waitForTimeout(1000); };
const pin = async (r: any) => { const ok = await toColumn(p, r.staff_id); const b = p.locator(`[data-test-id="button_board_pin_${r.staff_id}"]`); const s: any = { column: ok, disabled: await b.isDisabled().catch(() => null) };
  if (await b.count()) { await b.click().catch((e) => { s.err = String(e).slice(0, 80); }); await p.waitForTimeout(1500); s.after = ((await b.getAttribute('class').catch(() => '')) ?? '').match(/board-column-header__pin--\w+/)?.[0]; } s.toasts = await toasts(p); return s; };
const locField = async () => { await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1200);
  const f = await p.evaluate(`(() => { const e = document.querySelector('[data-test-id="select_location"]'); return e ? e.innerText.replace(/\\s+/g, ' ').trim() : null; })()`); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(700); return f; };
try {
  await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: [], filters: {} } });
  // start at Heavy Duty, through the menu
  o.start = await top(); if (!o.start.includes(LOC1_NAME)) o.startSwitch = await switchLocUI(p, LOC1_NAME);
  // step 1
  await board(); o.s1_top = await top(); o.s1_pins = { Ana: await pin(ANA), Ben: await pin(BEN), Cal: await pin(CAL) }; o.s1_pref = named((await prefGet()).pinnedTechnicianIds ?? []); o.s1_left = await leftCols(); await shot('s1-heavy-pinned');
  // step 2
  await toColumn(p, DAN.staff_id); const d4 = p.locator(`[data-test-id="button_board_pin_${DAN.staff_id}"]`);
  o.s2 = { disabled: await d4.isDisabled().catch(() => null), cls: ((await d4.getAttribute('class').catch(() => '')) ?? '').match(/disabled|board-column-header__pin--\w+/g) }; await d4.hover({ force: true }).catch(() => {}); await p.waitForTimeout(1500);
  o.s2.tip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText).join(' | ')`); await shot('s2-fourth-pin');
  // step 3
  o.s3_switch = await switchLocUI(p, LOC2_NAME); await board(); o.s3_top = await top(); o.s3_pinnedCols = await pinnedCount(); o.s3_left = await leftCols(); await shot('s3-loc2-board');
  // step 4
  if (o.s3_top.includes(LOC2_NAME)) { o.s4_pins = { Xia: await pin(XIA), Yan: await pin(YAN), Zoe: await pin(ZOE) }; o.s4_left = await leftCols(); o.s4_pinnedCols = await pinnedCount(); o.s4_pref = named((await prefGet()).pinnedTechnicianIds ?? []); await shot('s4-loc2-pinned'); }
  // step 5 — reload, read the field, switch back like a person
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(7000);
  o.s5_fieldBefore = await locField(); o.s5_topBefore = await top();
  o.s5_switch1 = await switchLocUI(p, LOC1_NAME); await p.waitForTimeout(2000); o.s5_top1 = await top();
  if (!o.s5_top1.includes(LOC1_NAME)) { // retry once on a settled page; photograph the menu; detour if the field already shows the target
    await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(8000); o.s5_fieldRetry = await locField();
    await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1200); await p.locator('[data-test-id="select_location"]').click().catch(() => {}); await p.waitForTimeout(1500);
    o.s5_menuRetry = (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 14); await shot('s5-location-menu-retry'); await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
    if (String(o.s5_fieldRetry ?? '').includes(LOC1_NAME)) o.s5_detour = await switchLocUI(p, 'QB Location');
    o.s5_switch2 = await switchLocUI(p, LOC1_NAME); await p.waitForTimeout(2000); o.s5_top2 = await top(); }
  await board(); o.s5_top = await top(); o.s5_left = await leftCols(); o.s5_pinnedCols = await pinnedCount(); o.s5_pref = named((await prefGet()).pinnedTechnicianIds ?? []); await shot('s5-heavy-board');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally {
  o.restore = (await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: ORIGINAL.pinnedTechnicianIds ?? [] } })).status;
  if (!(await top()).includes(LOC1_NAME)) o.endSwitch = await switchLocUI(p, LOC1_NAME);
  fs.writeFileSync(path.join(EV, 'C368156-b40.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C368156', JSON.stringify(o).slice(0, 5000)); await done(browser);
}
