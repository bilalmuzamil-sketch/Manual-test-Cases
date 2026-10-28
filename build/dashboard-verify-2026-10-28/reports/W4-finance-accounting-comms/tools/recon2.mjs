// W4 recon 2: open a grouped report, expand the named group(s) and read the rows inside. SECRET-FREE.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w4/ev';
const WP = process.env.WP || 'b3c8c820-f815-4cf1-8938-10956c5ee71a', TZ = process.env.TZ2 || 'Asia/Karachi';
const [path, groupsJson, findsJson, tag] = process.argv.slice(2);
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(12000);
const out = { url: page.url(), appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), groups: {}, finds: {} };
for (const g of JSON.parse(groupsJson)) {
  const row = page.locator('tr').filter({ hasText: g }).first();
  for (let i = 0; i < 8 && !(await row.count()); i++) { await page.mouse.wheel(0, 3000); await page.waitForTimeout(1500); }
  await row.scrollIntoViewIfNeeded().catch(() => {});
  await row.getByText('arrow_drop_down').first().click().catch(async () => { await row.click().catch(() => {}); });
  await page.waitForTimeout(2500);
  out.groups[g] = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
}
for (const f of JSON.parse(findsJson)) {
  const r = page.locator('tr').filter({ hasText: f });
  out.finds[f] = { n: await r.count(), text: (await r.first().innerText().catch(() => '')).replace(/\s+/g, ' | ') };
  if (await r.count()) { await r.first().scrollIntoViewIfNeeded().catch(() => {}); }
}
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/recon2-${tag}.png` });
fs.writeFileSync(`${OUT}/recon2-${tag}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
