// Test a DETERMINISTIC content-set: build <p>line<br>line</p> HTML (exactly the format the
// 58 keystroke-repaired cases ended up with), set it through the Froala instance, save, verify.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/inline-add-edit-parts/render-repair-2026-08-31/intended-blocks.json', 'utf8'));
const cid = process.argv[2] || '45054';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fieldHtml = f => data[cid].fields[f].blocks.map(b => '<p>' + b.map(esc).join('<br>') + '</p>').join('');

async function api(path) {
  const r = await fetch(`${API}/${path}`, { headers: { Authorization: AUTH, 'Content-Type': 'application/json' } });
  return [r.status, await r.json().catch(() => null)];
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors', '--disable-background-networking', '--disable-component-update', '--no-first-run', '--no-default-browser-check'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });

const fields = ['custom_preconds', 'custom_steps', 'custom_expected'];
for (const f of fields) {
  const html = fieldHtml(f);
  const r = await page.evaluate(({ f, html }) => {
    const disp = document.querySelector(`#${f}_display`);
    const fe = disp.querySelector('.fr-element');
    fe.focus();
    fe.innerHTML = html;
    // sync to Froala's backing input + fire the events TestRail/Froala listen for
    const backing = document.querySelector(`#${f}`);
    if (backing) backing.value = html;
    fe.dispatchEvent(new Event('input', { bubbles: true }));
    fe.dispatchEvent(new Event('blur', { bubbles: true }));
    if (backing) backing.dispatchEvent(new Event('change', { bubbles: true }));
    return { feNow: fe.innerHTML.slice(0, 80), backing: backing ? backing.value.slice(0, 80) : 'none' };
  }, { f, html });
  console.log(f, 'set ->', JSON.stringify(r));
}
await page.waitForTimeout(500);
const disabled = await page.locator('#accept').isDisabled();
console.log('accept disabled?', disabled);
await page.click('#accept', { timeout: 30000 });
await page.waitForLoadState('networkidle').catch(() => {});
for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
console.log('after save url:', page.url());

const [st, after] = await api(`get_case/${cid}`);
console.log('stored custom_preconds:', JSON.stringify(after.custom_preconds));
// read served view
await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
const view = await page.evaluate(() => {
  const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
  return ds.map(d => ({ cls: d.className.trim(), text: d.innerText.slice(0, 70) }));
});
console.log('VIEW:', JSON.stringify(view, null, 1));
await browser.close();
