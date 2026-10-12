/** C368239 step 4, read as the case says (12 Oct 2026): as Admin ShopView (own user, no account access), Work Orders > All,
 *  Assigned to me ON, NO search — read every row of every page and check Esther Howard's test work orders S10043-19173 /
 *  S10043-19168 are not listed. Positive control: the same reader, with Assigned to me OFF, does find S10043-19173. */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { EV, t, tab, display } from './wob.mts';
const first = await open('/workorders?tab=all'); const clean = await first.browser.newContext({ storageState: await first.page.context().storageState(), viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
const p = await clean.newPage(); await first.page.close().catch(() => {}); p.setDefaultTimeout(20000); const o: any = {};
const nums = async () => { const all = new Set<string>(); for (let pg = 0; pg < 30; pg++) { await p.waitForTimeout(2500); (await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean)`) as string[]).forEach((n) => all.add(n));
    const next = p.locator('.q-table__bottom button:has(i:text-is("chevron_right")), button[aria-label="Next page"]').first(); if (!(await next.count()) || await next.isDisabled().catch(() => true)) break; await next.click(); } return [...all]; };
const assigned = () => p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await tab(p, 'All'); await display(p, 'List').catch(() => {});
  o.who = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120);
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(4000); }
  o.pressed = await assigned().getAttribute('aria-pressed'); const on = await nums(); o.assignedCount = on.length; o.assignedHas19173 = on.includes('S10043-19173'); o.assignedHas19168 = on.includes('S10043-19168');
  await p.screenshot({ path: path.join(EV, 'C368239-v5-assigned.png') });
  await assigned().click(); await p.waitForTimeout(4000); o.pressedOff = await assigned().getAttribute('aria-pressed');
  const sb = p.locator('[data-test-id="page_search_input"]'); if (!(await sb.isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click().catch(() => {}); await sb.fill('19173'); await p.waitForTimeout(4000);
  o.controlOffFinds19173 = (await nums()).includes('S10043-19173'); await sb.fill(''); await p.waitForTimeout(2000);
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(3000); }   // leave it as it was
} catch (e: any) { o.error = String(e?.message || e).slice(0, 200); }
console.log(t(), 'C368239-STEP4', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'c368239-step4.json'), JSON.stringify(o, null, 1));
await Promise.race([first.browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
