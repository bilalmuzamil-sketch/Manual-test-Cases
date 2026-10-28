// W4 recon: open my reports on the screen (fresh quick-login Admin session, own cookie) and record what
// the screen shows for the rows the API checks flagged. SECRET-FREE. Output /tmp/cln/w4/ev/recon-*.png + recon.json
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w4/ev';
const WP = process.env.WP || 'b3c8c820-f815-4cf1-8938-10956c5ee71a', TZ = process.env.TZ2 || 'Asia/Karachi';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const res = { wp: WP, at: new Date().toISOString(), pages: {} };
const visit = async (key, path, finds, wait = 12000) => {
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(wait);
  res.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  const r = { url: page.url(), head: (await page.locator('main').innerText().catch(() => '')).slice(0, 1500), finds: {} };
  for (const f of finds) {
    const row = page.locator('tr').filter({ hasText: f });
    r.finds[f] = { n: await row.count(), text: (await row.first().innerText().catch(() => '')).replace(/\s+/g, ' | ') };
  }
  await page.screenshot({ path: `${OUT}/recon-${key}.png`, fullPage: false });
  res.pages[key] = r;
};
const steps = JSON.parse(process.argv[2] || '[]');
for (const [k, p, f, w] of steps) await visit(k, p, f, w);
fs.writeFileSync(`${OUT}/recon-${process.env.TAG || 'x'}.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 6000));
await browser.close();
