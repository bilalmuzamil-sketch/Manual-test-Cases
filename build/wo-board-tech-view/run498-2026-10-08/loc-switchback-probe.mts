/** 16 Oct 2026 — STAGING, C368156 step 5 probe (Rule 104). In the 16 Oct re-run, after Change Location > "Staging Lethbridge - 4310"
 *  through the menu, the top bar read Lethbridge but the Change Location list still TICKED "Staging Heavy Duty - 9919", and picking it
 *  twice left the top bar on Lethbridge. Here, exactly as a person does, twice on a settled page: (0) start at Heavy Duty (set by the
 *  server call if needed, recorded) · (1) menu > Lethbridge, read top bar (positive control: a switch DOES take) · (2) open the list,
 *  read which row is ticked · (3) pick Heavy Duty, wait, read top bar · (4) reload, repeat (2)-(3) · (5) if still stuck: pick another
 *  location then Heavy Duty (does a detour work?) · (6) end at Heavy Duty by the server call so later tests start there. Pictures each step. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP, API } from './session.mts'; import { api } from './data.mts'; import { EV, t, switchLocUI } from './wob.mts';
import { HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = {};
const top = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C368156-probe-${n}.png`) }).catch(() => {});
const ticked = async () => { await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1200); await p.locator('[data-test-id="select_location"]').click().catch(() => {}); await p.waitForTimeout(1500);
  const rows = await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].map(e => ({ t: e.innerText.replace(/\\s+/g, ' ').trim(), on: e.classList.contains('q-manual-focusable--focused') || e.getAttribute('aria-selected') === 'true' || /check/.test(e.innerText) || e.classList.contains('q-item--active') }))`) as any[];
  return rows.filter((r) => !/Change Location|Edit Profile|Logout|Light|Dark|Billing|Portal/i.test(r.t)); };
const pick = async (key: string) => { await p.locator('.q-menu .q-item').filter({ hasText: key }).filter({ hasNotText: /Change Location/i }).last().click().catch((e) => { o.pickError = String(e).slice(0, 100); }); await p.waitForTimeout(7000); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(800); };
await p.waitForTimeout(6000); o.start = await top();
if (!o.start.includes('Heavy Duty')) { o.startFix = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' })).status; await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); o.startAfterFix = await top(); }
await shot('0-start');
o.toLeth = await switchLocUI(p, 'Staging Lethbridge'); await p.waitForTimeout(3000); o.topAtLeth = await top(); await shot('1-at-lethbridge');
for (const k of [1, 2]) { if (k === 2) { await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
  o[`list${k}`] = await ticked(); await shot(`${k + 1}-list-try${k}`); await pick('Staging Heavy Duty'); o[`topAfterPick${k}`] = await top(); await shot(`${k + 1}-after-pick-try${k}`);
  if (o[`topAfterPick${k}`].includes('Heavy Duty')) break; }
if (!(o.topAfterPick1 || '').includes('Heavy Duty') && !(o.topAfterPick2 || '').includes('Heavy Duty')) { o.detour = await switchLocUI(p, 'QB Location'); o.detourBack = await switchLocUI(p, 'Staging Heavy Duty'); o.topAfterDetour = await top(); await shot('5-after-detour'); }
if (!(await top()).includes('Heavy Duty')) { o.endFix = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' })).status; await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); }
o.end = await top(); fs.writeFileSync(path.join(EV, 'loc-switchback-probe.json'), JSON.stringify(o, null, 1)); console.log(t(), 'PROBE', JSON.stringify(o).slice(0, 3000)); await done(browser);
