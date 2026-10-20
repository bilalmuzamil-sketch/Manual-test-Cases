// 20 Oct 2026: what does TestRail's sign-in page offer today (fields / buttons)? No credentials used.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: `http://127.0.0.1:${port}` }, args: ['--ignore-certificate-errors'] });
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
await page.goto('https://shopview.testrail.io/index.php?/auth/login/', { waitUntil: 'networkidle' }); await page.waitForTimeout(3000);
console.log(page.url(), JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('input, button, a')].map((e) => `${e.tagName}#${e.id}[${e.name || ''}] ${(e.innerText || e.value || '').trim().slice(0, 30)}`).slice(0, 25))));
await page.screenshot({ path: 'login-page.png' }); await browser.close();
