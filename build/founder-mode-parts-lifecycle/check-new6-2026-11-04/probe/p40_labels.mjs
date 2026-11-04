// Probe 40 (read-only): label texts and input names on the Receive screen of S10647-17584.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
const { r, page, go } = await start(process.env.OUT);
await go('/parts/orders'); await page.waitForTimeout(3000);
await page.locator('main tbody tr').filter({ hasText: 'S10647-17584' }).first().locator('button:visible', { hasText: /^Receive$/ }).first().click(); await page.waitForTimeout(6000);
console.log(JSON.stringify(await page.locator('label:visible').evaluateAll(ls => ls.map(l => l.innerText.replace(/\s+/g, ' ').slice(0, 60) + ' || inputs=' + l.querySelectorAll('input').length))));
console.log(JSON.stringify(await page.locator('input:visible').evaluateAll(xs => xs.map(x => (x.getAttribute('aria-label') || '') + '|' + (x.type || '') + '|' + (x.value || '')))));
await r.browser.close();
