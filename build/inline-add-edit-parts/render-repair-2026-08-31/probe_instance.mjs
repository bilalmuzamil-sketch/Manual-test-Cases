import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cid = process.argv[2] || '45057';
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

const info = await page.evaluate(() => {
  const out = {};
  out.FroalaEditor_type = typeof window.FroalaEditor;
  if (typeof window.FroalaEditor === 'function') {
    out.INSTANCES_isArray = Array.isArray(window.FroalaEditor.INSTANCES);
    out.INSTANCES_len = window.FroalaEditor.INSTANCES ? window.FroalaEditor.INSTANCES.length : null;
    if (window.FroalaEditor.INSTANCES && window.FroalaEditor.INSTANCES.length) {
      out.inst = window.FroalaEditor.INSTANCES.map(i => {
        let id = '';
        try { id = i.$oel && i.$oel[0] ? (i.$oel[0].id || i.$oel[0].name || i.$oel[0].tagName) : (i.el && i.el.id); } catch (e) {}
        return { id, hasHtmlSet: !!(i.html && i.html.set) };
      });
    }
  }
  // jQuery froala fn?
  out.jqFroalaFn = !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.froalaEditor);
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
