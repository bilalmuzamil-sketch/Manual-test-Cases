// Is the already-sorted name column reversed by one click on its label? (A/R/A/P PRD S2-R3; TU S2-R13; SBC S10).
// Clicks the header LABEL text, reads aria-sort and whether the first rows reversed. Names are compared in memory only.
import { boot, LOC, APP, sleep, rule99, save } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const loc = LOC.HD;
const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } }); const out = { start: await rule99(page, loc), runs: [] };
const rows = () => page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.split('\n')[0].trim()).filter(t => t && !/^(Totals?|Summary)/.test(t)).slice(0, 6));
for (const [rep, label] of [['ar-aging-summary', 'Customer'], ['ap-aging-summary', 'Vendor'], ['technician-utilization', 'Technician'], ['sales-by-customer', 'Customer']]) {
  await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(7000);
  const th = page.locator('thead th', { hasText: label }).first(); const aria0 = await th.getAttribute('aria-sort'); const r0 = await rows();
  await th.getByText(label, { exact: true }).first().click(); await sleep(4000); const aria1 = await th.getAttribute('aria-sort'); const r1 = await rows();
  await page.screenshot({ path: EV + `resort-${rep}-after-one-click.png` });
  await th.getByText(label, { exact: true }).first().click(); await sleep(4000); const aria2 = await th.getAttribute('aria-sort'); const r2 = await rows();
  const rec = { rep, label, aria: [aria0, aria1, aria2], rows_changed_after_click1: JSON.stringify(r0) !== JSON.stringify(r1), first_row_same_after_click1: r0[0] === r1[0], rows_compared: r0.length };
  out.runs.push(rec); console.log(JSON.stringify(rec));
}
out.end = await rule99(page, loc); save(EV + 'resort-check.json', out); await browser.close();
