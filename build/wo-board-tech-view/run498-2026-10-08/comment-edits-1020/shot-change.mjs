// shot-change.mjs (from probe-links.mjs) — which results on a test page carry an Edit link (TESTS env, comma list). Records only.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const j = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8')); const HOST = 'https://shopview.testrail.io'; const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const page = await browser.newPage({ ignoreHTTPSErrors: true }); page.setDefaultTimeout(60000);
await page.goto(`${HOST}/index.php?/auth/login/`); await page.fill('#name', j.email); await page.fill('#password', j.ui_password || j.password); await page.click('#button_primary'); await page.waitForLoadState('networkidle');
for (const t of process.env.TESTS.split(',')) {
  await page.goto(`${HOST}/index.php?/tests/view/${t}`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => [...document.querySelectorAll('div[id^="testChange-"]')].map(d => ({ id: d.id.replace('testChange-', ''), edit: !!d.querySelector('a[onclick*="editResult"]'), head: d.innerText.split('\n').slice(0, 3).join(' ').slice(0, 80) })));
  await page.locator('#testChange-' + process.env.RID).screenshot({ path: process.env.DIR + '/shown-' + t + '.png' }).catch(e => console.log(String(e).slice(0, 100)));
}
await browser.close();
