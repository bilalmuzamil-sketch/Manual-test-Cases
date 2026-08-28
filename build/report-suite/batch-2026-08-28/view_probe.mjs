// Read-only: log into the TestRail UI and report what a TESTER actually sees for a case —
// the container class, the innerText line-by-line, and a screenshot. Nothing is written.
// Usage: node view_probe.mjs <cid> [<cid> ...]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cids = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'],
  proxy: { server: `http://127.0.0.1:${port}` },
});
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1600 } });
page.setDefaultTimeout(60000);
await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache', Pragma: 'no-cache' });
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', C.email);
await page.fill('#password', C.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); await browser.close(); process.exit(2); }

for (const cid of cids) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    return ['custom_preconds', 'custom_steps', 'custom_expected'].map((f, i) =>
      ds[i] ? { f, cls: ds[i].className.trim(), text: ds[i].innerText } : { f, cls: null, text: '' });
  });
  console.log(`\n================ C${cid} ================`);
  for (const x of r) {
    console.log(`--- ${x.f}  [${x.cls}] ---`);
    x.text.split('\n').forEach((l, i) => console.log(String(i).padStart(3) + ' | ' + l));
  }
  await page.screenshot({ path: `/tmp/job828/view-${cid}.png`, fullPage: true });
}
await browser.close();
