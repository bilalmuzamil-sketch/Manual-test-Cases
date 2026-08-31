import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/inline-add-edit-parts/render-repair-2026-08-31/intended-blocks.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cid = process.argv[2] || '45057';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fieldHtml = f => data[cid].fields[f].blocks.map(b => '<p>' + b.map(esc).join('<br>') + '</p>').join('');

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
await page.locator('#custom_preconds_display .fr-element').waitFor({ state: 'visible', timeout: 30000 });

for (const f of ['custom_preconds', 'custom_steps', 'custom_expected']) {
  const html = fieldHtml(f);
  await page.evaluate(({ f, html }) => {
    const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display');
    inst.html.set(html); try { inst.undo.saveStep(); } catch (e) {}
    const backing = document.querySelector(`#${f}`); if (backing) backing.value = inst.html.get();
  }, { f, html });
}
await page.waitForTimeout(400);
await page.click('#accept', { timeout: 30000 }).catch(e => console.log('click err', String(e).slice(0, 80)));
await page.waitForTimeout(3000);
console.log('url after save:', page.url());
const diag = await page.evaluate(() => {
  const texts = [];
  document.querySelectorAll('.message, .message-error, .error, [class*="error"], .form-error, .validation').forEach(e => {
    const t = (e.innerText || '').trim(); if (t) texts.push(e.className + ': ' + t.slice(0, 200));
  });
  // any visible required-field markers
  const title = document.querySelector('#title, input[name="title"]');
  return { messages: texts.slice(0, 10), titleVal: title ? title.value : 'n/a', bodyStart: document.body.innerText.slice(0, 400) };
});
console.log(JSON.stringify(diag, null, 1));
await browser.close();
