/**
 * notech-stg4.mts — 15 Oct 2026, fourth pass on STAGING: C368130 "A location with no technicians shows only Unassigned in
 * Tech View and Board View".
 *
 * WHY THIS SCRIPT: in the second pass (s2-batchB.mts) "ZZAUTOTEST F2 Empty Shop" was not a location with no technicians —
 * Admin ShopView counted as a technician there (Tech View had an Admin ShopView group, Board View an Admin ShopView column).
 * That location was created by Admin ShopView (stg-setup.mts), and the creating user is enrolled at the location they create
 * (setup.json: Admin's my-workplaces lists it straight after creation), and Admin ShopView has Time Clock on. Taking it away
 * means editing the signed-in admin's OWN staff record, which ends the shared sign-in (playbook: a Time Clock change on your own
 * record answers 401 at once) — every later script would then fail.
 * So the location is made by someone who is NOT a technician: our test admin "ZZ WOB Runner" (Admin role, Time Clock OFF,
 * runner.mts). The creator is the only person enrolled there, and with Time Clock off nobody counts as a technician.
 * Everything below is done as the runner, in the runner's own window (viewAs), the way the case's steps read:
 *   (1) Administration > Locations > New Location "ZZAUTOTEST F2 No Tech Shop" (only if missing; stg-setup.mts recipe);
 *   (2) two work orders with no lead for "ZZAUTOTEST F2 No Tech Location 2" made AT that location (data set-up by the API);
 *   (3) who the product offers as a technician there (lead-technician-candidates) — expected nobody;
 *   (4) the screen switched there ON SCREEN (profile menu > select_location, L0333), Work Orders > All > Tech View, then Board View,
 *       each read in full (groups/columns, the work order numbers in each, and the words the page shows);
 *   (5) switched back to Staging Heavy Duty - 9919.
 * Work order numbers at a new location carry that location's own prefix, so numbers are matched as LETTERS-DIGITS, never S\d+-.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, seedCase } from './data.mts';
import { EV, t, shot, display, tab, allBoardCols, switchLocUI } from './wob.mts';
import { HEAVY } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const R: Record<string, any> = {};
const LOC = 'ZZAUTOTEST F2 No Tech Shop';
const CUST = 'ZZAUTOTEST F2 No Tech Location 2';
const { browser, page: p0 } = await open('/workorders?tab=all');
const a0 = api(p0);
const wpList = async () => { const d = (await a0.get('/api/workplaces')).body?.data; return (Array.isArray(d) ? d : d?.collection ?? []) as any[]; };
const HEAVY_NAME = (await wpList()).find((w) => w.id === HEAVY)?.name ?? 'Staging Heavy Duty - 9919';
const NUM = /\b[A-Z][A-Z0-9]*-\d{3,}\b/g;

if (want('C368130')) {
  const RUN = await asRunner(browser, p0, a0); const p = RUN.p; const a = RUN.a; p.setDefaultTimeout(30_000);
  const o: any = { runner: RUN.id.slice(0, 8), location: LOC };
  try {
    // (1) the location, made by the runner on screen
    let w = (await wpList()).find((x) => x.name === LOC);
    o.locationExisted = !!w;
    if (!w) {
      await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
      await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(3000);
      const d = p.locator('.q-dialog').last();
      await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(LOC);
      const fill = async (lab: string, v: string) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
      await fill('Address 1', '2 ZZAUTOTEST Way'); await fill('City', 'Las Vegas'); { const z = d.getByLabel(/ZIP/i).first(); await z.click(); await z.fill('89135'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('7025550198', { delay: 30 }); }
      const st = d.getByLabel('State/Province').first(); await st.click(); await p.waitForTimeout(800); await p.keyboard.type('Nevada', { delay: 40 }); await p.waitForTimeout(1200);
      await p.locator('.q-menu .q-item').filter({ hasText: 'Nevada' }).first().click().catch(() => {}); await p.waitForTimeout(800);
      const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); await tz.click(); await p.waitForTimeout(800); await p.keyboard.type('Karachi', { delay: 50 }); await p.waitForTimeout(1500);
      await p.locator('.q-menu .q-item').filter({ hasText: 'Asia/Karachi' }).first().click().catch(() => {}); await p.waitForTimeout(800);
      await shot(p, 'C368130-stg4-location-filled');
      o.saveClicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
      await p.waitForTimeout(4000); o.saveToasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 150))`);
      w = (await wpList()).find((x) => x.name === LOC);
    }
    if (!w) throw new Error(`location "${LOC}" was not created (${JSON.stringify(o.saveToasts ?? [])})`);
    o.locationId = w.id;
    const myWp = (await a.get('/api/staff/my-workplaces')).body?.data; o.runnerWorkplaces = (Array.isArray(myWp) ? myWp : myWp?.collection ?? []).map((x: any) => x.name);
    // (2) + (3) data at that location (server-side location of the runner's session), and who counts as a technician there
    await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: w.timezone ?? 'Asia/Karachi' });
    const wos = await seedCase(a, CUST, 'ZZF2NT', [{ lead: null }, { lead: null }]);
    o.workOrders = wos.map((x: any) => `${x.number} ${x.status} lead=${x.techAssignedFirstName ?? '-'}`);
    o.techniciansThere = (await candidates(a)).map((x) => x.name);
    await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'America/Edmonton' });
    // (4) on screen
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
    o.header = await switchLocUI(p, LOC);
    // no page.goto after the switch (as s2-batchB, where the switched screen held): only back to Work Orders if the switch left it
    if (!/\/workorders/.test(p.url())) { await p.locator('a, .q-btn, button').filter({ hasText: /^\s*Work Orders\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(5000); }
    o.headerOnWorkOrders = await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
    await tab(p, 'All'); await display(p, 'Tech View');
    // Unassigned starts collapsed: open it so its rows can be read
    if (await p.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="true"]').count()) { await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click().catch(() => {}); await p.waitForTimeout(1500); }
    o.tech = await p.evaluate(`(() => { const out = []; let cur = null; const re = ${NUM};
      for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) { const tid = tr.getAttribute('data-test-id') || '';
        if (tid.startsWith('tech_view_group_')) { const id = tid.replace('tech_view_group_', ''); const q = (s) => tr.querySelector('[data-test-id="' + s + id + '"]'); cur = { id, name: (q('tech_view_group_name_') || {}).textContent?.trim(), count: (q('tech_view_group_count_') || {}).textContent?.trim(), rows: [] }; out.push(cur); continue; }
        if (cur) for (const m of (tr.innerText.match(re) || [])) if (!cur.rows.includes(m)) cur.rows.push(m); }
      return out; })()`);
    o.techText = (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 900);
    await shot(p, 'C368130-stg4-tech');
    await display(p, 'Board View');
    const empty = await p.locator('[data-test-id="board_view_scroller"], .board-view__scroller').count();
    o.board = empty ? (await allBoardCols(p)).map((c) => ({ id: c.id, name: c.name, count: c.count, cards: c.cards, empty: c.empty })) : 'no board scroller (empty state, L0340)';
    o.boardText = (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 900);
    await shot(p, 'C368130-stg4-board');
    await (globalThis as any).__shotEach?.('C368130');
    await display(p, 'List');
  } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, 'C368130-stg4-error'); }
  // (5) back to the first location, on screen and on the server
  o.back = await switchLocUI(p, HEAVY_NAME).catch((e) => 'switch back failed ' + String(e).slice(0, 80));
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'America/Edmonton' }).catch(() => {});
  await RUN.end().catch(() => {});
  R.C368130 = o;
  console.log(t(), 'C368130', JSON.stringify(o).slice(0, 12000));
}
fs.writeFileSync(path.join(EV, 'notech-stg4.json'), JSON.stringify(R, null, 1));
await done(browser);
