// Probe the TestRail case-edit Froala editor to find a reliable content-set path.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const cid = process.argv[2] || '45054';
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
  const disp = document.querySelector('#custom_preconds_display');
  const fe = disp.querySelector('.fr-element');
  const out = { feHTML: fe.innerHTML.slice(0, 200) };
  // jQuery present?
  out.jquery = typeof window.jQuery;
  out.FroalaEditorGlobal = typeof window.FroalaEditor;
  // try jQuery data
  try {
    if (window.jQuery) {
      const $fe = window.jQuery(fe);
      const d = $fe.data();
      out.jqDataKeys = Object.keys(d || {});
      const ed = d && (d['froala.editor'] || d.froalaEditor);
      out.hasFroalaData = !!ed;
      if (ed) { out.edKeys = Object.keys(ed).slice(0, 40); out.hasHtmlSet = !!(ed.html && ed.html.set); }
    }
  } catch (e) { out.jqErr = String(e).slice(0, 120); }
  // froala often stores instance on the element
  out.feDataFroala = !!(fe['data-froala.editor']);
  // hidden textarea/input backing?
  const backing = document.querySelector('#custom_preconds, textarea[name="custom_preconds"], input[name="custom_preconds"]');
  out.backingTag = backing ? backing.tagName + '#' + backing.id + '.name=' + backing.name : 'none';
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
