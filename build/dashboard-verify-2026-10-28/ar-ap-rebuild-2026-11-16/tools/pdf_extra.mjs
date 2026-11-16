// PDF follow-up (16 Nov), run ALONE (no other session loading staging): Export report > Download (PDF), up to 300 s each.
// 1) A/R Aging Detail, All locations, as of 30 Sep and today: second/third reproduction of the missing Due Date / Amount /
//    Open Balance columns, and the retry of the two PDFs that produced nothing in 150 s while 3 other sessions were running.
// 2) Cause: the same PDF narrowed to one customer with an ordinary name, and to the customer with the 120-letter unbroken name.
// 3) A/P Aging Detail / A/P Unpaid Invoices PDFs (refused at All locations, >2,000 rows) narrowed to one vendor: ordinary name
//    and the 120-letter vendor. Address keys: asOfDate, customerIds, vendorIds (useAgingReportFilters).
// Usage: TZ=Asia/Karachi node pdf_extra.mjs <customerOrdinary> <customerLong> <vendorOrdinary> <vendorLong>
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const [cOrd, cLong, vOrd, vLong] = process.argv.slice(2); const loc = LOC.HD; const EV = new URL('../evidence/', import.meta.url).pathname;
const DL = '/tmp/cln/arap/dl/extra/'; fs.mkdirSync(DL, { recursive: true });
const { browser, page } = await boot(loc, { viewport: { width: 1920, height: 1080 } }); const out = { start: await rule99(page, loc), runs: [] };
const today = new Intl.DateTimeFormat('en-CA', { timeZone: loc.tz }).format(new Date());
const RUNS = [['ar-aging-detail', `asOfDate=2026-09-30`, 'all-0930'], ['ar-aging-detail', `asOfDate=${today}`, 'all-today'],
  ['ar-aging-detail', `asOfDate=${today}&customerIds=${cOrd}`, 'one-ordinary-customer'], ['ar-aging-detail', `asOfDate=${today}&customerIds=${cLong}`, 'one-long-name-customer'],
  ['ap-aging-detail', `asOfDate=${today}&vendorIds=${vOrd}`, 'one-ordinary-vendor'], ['ap-aging-detail', `asOfDate=${today}&vendorIds=${vLong}`, 'one-long-name-vendor'],
  ['ap-unpaid-invoices', `asOfDate=${today}&vendorIds=${vOrd}`, 'one-ordinary-vendor'], ['ap-unpaid-invoices', `asOfDate=${today}&vendorIds=${vLong}`, 'one-long-name-vendor']];
for (const [slug, qs, tag] of RUNS) {
  const R = { slug, qs, tag }; out.runs.push(R);
  try {
    await page.goto(`${APP}/reports/${slug}?${qs}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(6000);
    R.chips = await page.evaluate(() => [...document.querySelectorAll('.q-chip')].map(c => c.innerText.replace(/\s+/g, ' ').trim()).filter(t => /As of|Customer|Vendor/.test(t)).slice(0, 4));
    R.totals = await page.evaluate(() => [...document.querySelectorAll('tr')].map(r => [...r.querySelectorAll('td,th')].map(c => c.innerText.replace(/\s+/g, ' ').trim())).filter(c => c[0] === 'Totals'));
    await page.locator('[aria-label="Export report"]').first().click(); await sleep(900);
    const dP = page.waitForEvent('download', { timeout: 300000 }).catch(() => null); const t0 = Date.now();
    await page.locator('.q-menu').last().getByText('Download (PDF)', { exact: true }).first().click();
    const d = await dP; R.seconds = Math.round((Date.now() - t0) / 1000);
    R.toasts = await page.evaluate(() => [...document.querySelectorAll('.q-notification')].map(n => n.innerText.replace(/\s+/g, ' ').trim()));
    if (d) { R.path = `${DL}${slug}__${tag}.pdf`; await d.saveAs(R.path); R.bytes = fs.statSync(R.path).size; }
    await page.screenshot({ path: `${DL}${slug}__${tag}__screen.png` });
  } catch (e) { R.error = String(e).slice(0, 200); }
  console.log(slug, tag, R.seconds, R.path || R.toasts?.join('|') || R.error); save(EV + 'pdf-extra.json', out); await page.keyboard.press('Escape'); await sleep(2000);
}
out.end = await rule99(page, loc); save(EV + 'pdf-extra.json', out); await browser.close();
// 4) Vendor Bill export, bills dated 1 Oct 2025 .. 30 Sep 2026 (Karachi day bounds): were any of the 15 bills paid after 30 Sep,
//    and absent from the 30 Sep A/P report, dated on or before 30 Sep? (check_history.py)
{ const { browser: b2, page: p2 } = await boot(loc); const r = await p2.evaluate(async () => { const u = 'https://api.staging.shopview.com/api/reporting/export/vendor_bill?report=vendor_bill&start_date=2025-09-30T19:00:00.000Z&end_date=2026-09-30T18:59:59.999Z&range=custom'; const x = await fetch(u, { credentials: 'include' }); return { s: x.status, j: await x.json().catch(() => null) }; });
  fs.writeFileSync('/tmp/cln/arap/ledgers/export_vendor_bill_to_0930.json', JSON.stringify(r.j)); console.log('vendor_bill export', r.s, typeof r.j?.data?.[0] === 'string' ? r.j.data[0].split('\n').length : null); await b2.close(); }
