// served_page_scan.mjs — THE REQUIRED FOURTH POST-WRITE CHECK: what container TestRail actually
// serves each field in. A field stored in <div class="markdown"> ESCAPES its block HTML and the
// tester literally reads <ol><li><p>; only <div class="markdown fr-view"> renders it. The API cannot
// see the difference, so a stored-value check passing is NOT sufficient (CLAUDE.md, 2026-08-31).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const OUT = process.env.OUT || 'build/inline-add-edit-parts/build-verify-2026-09-01';
const IDS = JSON.parse(fs.readFileSync(process.env.IDFILE, 'utf8'));
const U = (() => {
  for (const f of ['/tmp/testrail/ui-creds.json', '/tmp/testrail/creds-ui.json']) {
    if (!fs.existsSync(f)) continue;
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const pw = j.ui_password || j.password;
    if (pw) return { email: j.email, ui_password: pw };
  }
  console.log('NO UI PASSWORD — STOP'); process.exit(2);
})();
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1400, height: 1200 } });
page.setDefaultTimeout(60000);
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', U.email); await page.fill('#password', U.ui_password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); await browser.close(); process.exit(2); }
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const out = {}; let escaping = 0, literal = 0;
for (const cid of IDS) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    return { count: ds.length, fields: ds.slice(0, 3).map(d => ({
      cls: d.className.trim(), frview: /\bfr-view\b/.test(d.className),
      sample: (d.innerText || '').slice(0, 90) })) };
  });
  const bad = r.fields.filter(f => !f.frview);
  const lit = r.fields.filter(f => LITERAL.test(f.sample));
  if (bad.length) escaping++;
  if (lit.length) literal++;
  out[cid] = r;
  if (bad.length || lit.length) console.log(`C${cid}: escaping=${bad.length} literalTags=${lit.length} ${JSON.stringify(r.fields.map(f => f.cls))}`);
}
fs.writeFileSync(`${OUT}/evidence/served-page-scan.json`, JSON.stringify(out, null, 1));
console.log(`\nscanned ${IDS.length} cases | ESCAPING containers: ${escaping} | literal tags visible: ${literal}`);
console.log(escaping === 0 && literal === 0 ? 'SERVED-PAGE SCAN: ALL CLEAN' : 'SERVED-PAGE SCAN: PROBLEMS ABOVE');
await browser.close();
