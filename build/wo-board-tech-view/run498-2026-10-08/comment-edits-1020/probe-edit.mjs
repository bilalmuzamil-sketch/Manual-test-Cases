// probe-edit.mjs — 20 Oct 2026: how does the TestRail UI edit an existing test result? Signs in (UI creds in /tmp/testrail),
// opens one test page and records every edit control near result RID, then clicks it and records the dialog. Records only; saves nothing.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const TEST = process.env.TEST || '3761668', RID = process.env.RID || '529842', OUT = process.env.OUT;
const j = JSON.parse(fs.readFileSync(['/tmp/testrail/ui-creds.json', '/tmp/testrail/creds-ui.json'].find(f => fs.existsSync(f)), 'utf8'));
const HOST = 'https://shopview.testrail.io'; const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1400, height: 1200 } }); page.setDefaultTimeout(60000);
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', j.email); await page.fill('#password', j.ui_password || j.password); await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); process.exit(2); }
await page.goto(`${HOST}/index.php?/tests/view/${TEST}`, { waitUntil: 'networkidle' });
const r = await page.evaluate((rid) => {
  const all = [...document.querySelectorAll(`[id*="${rid}"], [href*="${rid}"], [onclick*="${rid}"]`)].map(e => ({ tag: e.tagName, id: e.id, cls: e.className, href: e.getAttribute('href'), onclick: e.getAttribute('onclick'), text: (e.innerText || '').slice(0, 60) }));
  const edits = [...document.querySelectorAll('a, button')].filter(e => /edit/i.test((e.innerText || '') + (e.getAttribute('onclick') || '') + (e.getAttribute('href') || '') + (e.className || ''))).slice(0, 15).map(e => ({ tag: e.tagName, text: (e.innerText || '').trim().slice(0, 40), href: e.getAttribute('href'), onclick: (e.getAttribute('onclick') || '').slice(0, 120), cls: String(e.className).slice(0, 60) }));
  return { all, edits };
}, RID);
fs.writeFileSync(`${OUT}/probe-edit.json`, JSON.stringify(r, null, 1)); console.log(JSON.stringify(r, null, 1).slice(0, 4000));
await page.evaluate((rid) => { const a = [...document.querySelectorAll('a')].find(e => (e.getAttribute('onclick') || '').includes(`editResult(1, ${rid},`)); a.click(); }, RID);
await page.waitForTimeout(3000);
const dlg = await page.evaluate(() => { const d = [...document.querySelectorAll('.ui-dialog, .dialog, [role=dialog]')].filter(e => e.getBoundingClientRect().width > 0);
  return d.map(e => ({ cls: e.className, title: (e.querySelector('.ui-dialog-title, h1, h2, .dialog-title') || {}).innerText, inputs: [...e.querySelectorAll('input, select, textarea, [contenteditable=true]')].filter(x => x.getBoundingClientRect().width > 0 || x.tagName === 'TEXTAREA').map(x => ({ tag: x.tagName, id: x.id, name: x.name, type: x.type, ce: x.getAttribute('contenteditable'), val: (x.value || x.innerHTML || '').slice(0, 300) })), buttons: [...e.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.id || '') + ':' + b.innerText.trim()) })); });
const froala = await page.evaluate(() => { const f = (window.jQuery && jQuery('.fr-box').length) ? jQuery('.fr-box').map((i, e) => e.parentElement.id || e.id).get() : []; return f; });
console.log('DIALOG', JSON.stringify({ dlg, froala }, null, 1).slice(0, 5000));
await page.screenshot({ path: `${OUT}/probe-edit-dialog.png` });
await browser.close();
