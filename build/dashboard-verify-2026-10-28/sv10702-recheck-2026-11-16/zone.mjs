// Read Heavy Duty's server time zone live through a real signed-in browser session (Rule 99). SECRET-FREE.
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', timezone: 'Asia/Karachi' });
const r = await page.evaluate(async () => { const x = await fetch('https://api.staging.shopview.com/api/staff/my-workplaces', { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: x.status, j: await x.json().catch(() => null) }; });
const s = JSON.stringify(r.j); const i = s.indexOf('b3c8c820'); console.log(r.s, new Date().toISOString(), s.slice(Math.max(0, i - 150), i + 350));
await browser.close();
