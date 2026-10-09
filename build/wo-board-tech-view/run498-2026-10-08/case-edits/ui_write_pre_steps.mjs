// Write ONLY custom_preconds and custom_steps of one case through TestRail's own editor (so they render as fr-view),
// leaving custom_expected untouched (Standing Rule 114). Copied from build/custom-roles/fix-C26577-2026-09-10/hs_write.mjs
// (sign-in, Froala html.set, deadlock retry), narrowed to two fields. After the save it proves: expected byte-identical,
// automation fields and title unchanged, served page fr-view for both fields. Usage: node ui_write_pre_steps.mjs <cid>
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const DIR = new URL('.', import.meta.url).pathname;
const cid = process.argv[2]; const want = JSON.parse(fs.readFileSync(`${DIR}/C${cid}-new-fields.json`, 'utf8'))[cid];
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8')); const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io'; const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email || C.user}:${C.password || C.key}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const get = async () => { const r = await fetch(`${API}/get_case/${cid}`, { headers: { Authorization: AUTH } }); return r.json(); };
const before = await get();
if (before.created_by === 1) { log('REFUSED: Vladimir Tomovic\'s case (Rule 38)'); process.exit(3); }
if (before.custom_atmstatus === 3) { log('REFUSED: Automated case (Rule 71)'); process.exit(3); }
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: `http://127.0.0.1:${port}` }, args: ['--ignore-certificate-errors', '--no-first-run'] });
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password); await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }
let saveErr = '';
for (let attempt = 1; attempt <= 10; attempt++) {
  await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });
  await page.locator('#custom_preconds_display .fr-element').waitFor({ state: 'visible', timeout: 30000 });
  for (const f of ['custom_preconds', 'custom_steps']) {
    const r = await page.evaluate(({ f, html }) => {
      const inst = window.FroalaEditor.INSTANCES.find((i) => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display'); if (!inst) return 'no-instance';
      inst.html.set(html); try { inst.undo.saveStep(); } catch (e) { /* */ }
      const b = document.querySelector(`#${f}`); if (b) { b.value = inst.html.get(); b.dispatchEvent(new Event('change', { bubbles: true })); }
      return 'ok';
    }, { f, html: want[f] });
    if (r !== 'ok') throw new Error(`Froala instance not found for ${f}`);
  }
  await page.waitForTimeout(400); await page.click('#accept', { timeout: 30000 }); await page.waitForLoadState('networkidle').catch(() => {});
  for (let w = 0; w < 60 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
  if (!/cases\/edit/.test(page.url())) { saveErr = ''; break; }
  saveErr = await page.evaluate(() => [...document.querySelectorAll('.message-error')].map((x) => x.innerText.trim()).join(' | ').slice(0, 200));
  log(`save attempt ${attempt} rejected (${saveErr || 'no message'}) — retrying`); await page.waitForTimeout(2000 + 1500 * attempt);
}
await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
const view = await page.evaluate(() => [...document.querySelectorAll('div[class^="markdown"]')].filter((d) => !d.id).map((d) => ({ cls: d.className.trim(), text: d.innerText.slice(0, 120) })));
const after = await get();
const R = { cid, saveErr, expectedUnchanged: after.custom_expected === before.custom_expected, titleUnchanged: after.title === before.title,
  atmUnchanged: after.custom_atmstatus === before.custom_atmstatus && after.custom_automation_type === before.custom_automation_type,
  precondsChanged: after.custom_preconds !== before.custom_preconds, stepsChanged: after.custom_steps !== before.custom_steps, served: view.slice(0, 3).map((v) => v.cls),
  literalTags: view.slice(0, 3).some((v) => /<\s*\/?\s*(p|br|ul|ol|li|strong)\b/i.test(v.text)) };
fs.writeFileSync(`${DIR}/C${cid}-write-result.json`, JSON.stringify({ ...R, at: new Date().toISOString() }, null, 1));
fs.writeFileSync(`${DIR}/C${cid}-after-2026-10-09.json`, JSON.stringify({ custom_preconds: after.custom_preconds, custom_steps: after.custom_steps }, null, 1));
log(JSON.stringify(R)); await browser.close();
