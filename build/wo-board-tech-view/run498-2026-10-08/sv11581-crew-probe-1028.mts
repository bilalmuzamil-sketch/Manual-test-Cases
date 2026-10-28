/** sv11581-crew-probe-1028.mts — 28 Oct 2026, sv11581. Read-only-ish probe: does the Detailed card show crew AVATARS (S3-R11a block 4)
 *  when "Line technicians" is on in Column Selection? Run 3 of sv11581-cardsize-1028 showed the lead technician's NAME there with
 *  Line technicians off. Uses the customer of that run (CUST env), pins Ana, turns Line technicians on, reads + pictures the card in
 *  Detailed and Compact, then turns it off and puts the preference back. Output EV/sv11581-crew-probe-1028.json, EV/SV11581-crew-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts';
import { EV, t, display, tab, search } from './wob.mts'; import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const o: any = {}; const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const CUST = 'ZZAUTOTEST SV11581 Card Size 73260';
try {
  const ana = (await staffRows(a, 'zz.wob.sv11581.ana'))[0]; const w = (await workOrders(a, CUST))[0]; o.wo = w?.number;
  await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [ana.staff_id], boardCardSize: 'detailed' } });
  await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await W(2000); await search(p, CUST); await W(2500);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await W(800);
  const lt = p.locator('[data-test-id="toggle_board_field_line_technicians"]'); o.ltBefore = await lt.getAttribute('aria-checked'); if (o.ltBefore !== 'true') { await lt.click(); await W(1500); } o.ltAfter = await lt.getAttribute('aria-checked'); await p.keyboard.press('Escape'); await W(1000);
  const card = p.locator(`[data-test-id="board_card_${w.id}"]`).first(); await card.scrollIntoViewIfNeeded().catch(() => {});
  o.detailed = await card.evaluate((e) => ({ text: (e as HTMLElement).innerText.replace(/\s+/g, ' ').trim(), avatarLike: [...e.querySelectorAll('*')].filter((x) => { const r = x.getBoundingClientRect(); const cs = getComputedStyle(x); return r.width >= 16 && r.width <= 40 && Math.abs(r.width - r.height) < 2 && parseFloat(cs.borderRadius) >= r.width / 2 - 1; }).map((x) => (x as HTMLElement).innerText.trim()).slice(0, 8) }));
  await card.screenshot({ path: path.join(EV, 'SV11581-crew-detailed-line-techs-on.png') });
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await W(800); if (o.ltBefore !== 'true') { await lt.click(); await W(1200); } await p.keyboard.press('Escape');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
o.restore = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(path.join(EV, 'sv11581-crew-probe-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 2000)); await done(browser);
