// A/P Aging Detail + A/P Unpaid Invoices: Download (PDF) over the 2,000-row limit — is the S3-N1 message shown?
// Polls notifications every 250 ms for 12 s after the click; two runs per report. Heavy Duty, Asia/Karachi.
import { boot, LOC, APP, sleep, rule99, save } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const loc = LOC.HD;
const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } }); const out = { start: await rule99(page, loc), runs: [] };
for (const rep of ['ap-aging-detail', 'ap-unpaid-invoices']) for (const run of [1, 2]) {
  await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(6000);
  await page.locator('[aria-label="Export report"]').first().click(); await sleep(900);
  const resp = page.waitForResponse(r => r.url().includes('/export') && r.url().includes(rep), { timeout: 30000 }).catch(() => null);
  const t0 = Date.now(); await page.locator('.q-menu').last().getByText('Download (PDF)', { exact: true }).first().click();
  const seen = []; let shot = null;
  for (let i = 0; i < 48; i++) { const n = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(x => x.innerText.replace(/\s+/g, ' ').trim()));
    for (const t of n) if (!seen.includes(t)) { seen.push(t); if (!shot) { shot = `${rep}-pdf-too-large-run${run}.png`; await page.screenshot({ path: EV + shot }); } } await sleep(250); }
  const r = await resp; out.runs.push({ rep, run, http: r ? r.status() : null, ms_to_response: r ? null : null, notifications: seen, screenshot: shot, at_utc: new Date().toISOString() });
  console.log(rep, run, r && r.status(), JSON.stringify(seen)); await sleep(3000);
}
out.end = await rule99(page, loc); save(EV + 'ap-pdf-too-large.json', out); await browser.close();
