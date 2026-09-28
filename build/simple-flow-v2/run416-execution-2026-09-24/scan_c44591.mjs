// The served-page container scan. TestRail serves a field either in div.markdown.fr-view, which
// renders block HTML, or in plain div.markdown, which ESCAPES it so the tester literally reads
// <ol><li><p>. An API write leaves the field in the escaping container; only a UI save flips it.
// The stored-value check cannot see this, so it is not sufficient on its own (playbook J).
// Adapted from build/inline-add-edit-parts/render-repair-2026-08-31/scan.mjs (Rule 27).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json','utf8'));
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const CID = process.argv[2] || '44591';
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors','--no-first-run','--no-default-browser-check'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil:'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); await browser.close(); process.exit(2); }
console.log('logged in to TestRail');
await page.goto(`${HOST}/index.php?/cases/view/${CID}`, { waitUntil:'networkidle' });
const view = await page.evaluate(() => {
  const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
  const out = { _count: ds.length };
  ['custom_preconds','custom_steps','custom_expected'].forEach((f,i) => {
    if (ds[i]) out[f] = { cls: ds[i].className.trim(), text: ds[i].innerText }; });
  return out; });
console.log('fields found on the served page:', view._count);
let allGood = true;
for (const f of ['custom_preconds','custom_steps','custom_expected']) {
  const v = view[f];
  if (!v) { console.log(f, '-> NOT PRESENT'); allGood = false; continue; }
  const frview = /\bfr-view\b/.test(v.cls);
  const literal = LITERAL.test(v.text);
  if (!frview || literal) allGood = false;
  console.log(f, '-> container', JSON.stringify(v.cls), '| renders:', frview, '| literal tags visible:', literal);
}
console.log('\n>>> the tester sees this case rendered properly:', allGood);
const exp = view.custom_expected ? view.custom_expected.text : '';
console.log('\nwhat the tester actually reads at the end of Expected Results:');
console.log(exp.slice(-320));
await page.screenshot({ path: `/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence/c44591-served.png`, fullPage: true }).catch(()=>{});
await browser.close();
