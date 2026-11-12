// Screenshot A/R Summary on staging, As of a past day, narrowed to the overpaid-recipe customer. Never signs in/out.
process.env.RUN_ENV = 'staging';
const path = require('path');
const { open } = require(path.resolve(__dirname, '../live-run-2026-11-11/tools/env.js'));
const L = require(path.resolve(__dirname, 'overpaid-staging.json'));
(async () => {
  const { browser, ctx, page: p0 } = await open('staging', { tz: 'Asia/Karachi' });
  const page = p0 || await ctx.newPage();
  for (const day of ['2026-11-11', '2026-11-12']) {
    const url = `https://app.staging.shopview.com/reports/ar-aging-summary?asOfDate=${day}&customerIds=${L.cust.id}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(4000);
    const f = path.join(__dirname, 'evidence-staging', `ar-summary-asof-${day}-customer-A.png`);
    await page.screenshot({ path: f, fullPage: true });
    const txt = (await page.innerText('body')).replace(/\s+/g, ' ');
    const i = txt.indexOf('ZZAUTOTEST OVERPAID');
    console.log(day, page.url().slice(0, 140), '|', i >= 0 ? txt.slice(i, i + 220) : 'CUSTOMER NOT ON PAGE', '| totals:', (txt.match(/Totals?[^A-Za-z]{0,120}/) || ['-'])[0].slice(0, 120));
  }
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
