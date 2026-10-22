// 21 Oct 2026: served-page check of the new case C707079 (container class + any literal tag text).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim(); const HOST = 'https://shopview.testrail.io';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: `http://127.0.0.1:${port}` }, args: ['--ignore-certificate-errors'] });
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'networkidle' }); await page.fill('#name', UI.email); await page.fill('#password', UI.password); await page.click('#button_primary'); await page.waitForLoadState('networkidle');
await page.goto(`${HOST}/index.php?/cases/view/590120`, { waitUntil: 'networkidle' }); await page.waitForTimeout(3000);
const r = await page.evaluate(() => ({ literalTags: document.body.innerText.match(/<\/?(br|p|ul|li|ol)>/gi) || [], served: [...document.querySelectorAll('div[class^="markdown"]')].filter((d) => !d.id).map((d) => d.className.trim() + ' :: ' + d.innerText.slice(0, 60).replace(/\s+/g, ' ')), url: location.href, disabled: document.querySelector('#accept')?.disabled,
  empties: [...document.querySelectorAll('select, input, textarea')].filter((e) => e.id && (e.required || e.closest('.form-group, .column')?.querySelector('.required, .form-required')) && !e.value && e.type !== 'hidden').map((e) => e.id).slice(0, 20),
  msgs: [...document.querySelectorAll('.message, .message-error, .error, .fr-counter')].map((x) => x.innerText.trim()).filter(Boolean).slice(0, 10),
  selects: [...document.querySelectorAll('select')].map((e) => `${e.id}=${e.value}`).slice(0, 30), labelsReq: [...document.querySelectorAll('label')].filter((l) => /\*/.test(l.innerText)).map((l) => l.innerText.trim()).slice(0, 20) }));
console.log(JSON.stringify(r)); await page.screenshot({ path: 'view-page-590120.png', fullPage: true }); await browser.close();
