// apply_edits.mjs — 20 Oct 2026: edit (not add) run 498 result comments through the TestRail UI: open the test page, click that result's
// own Edit link (App.Tests.editResult), set the comment in its Froala editor (addResultComment_display) with html.set, press "Edit Result".
// ONLY=<rid,rid> limits the batch. Writes applied.json {rid: {saved, error}}. The API check of each saved comment is done afterwards.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const DIR = process.env.DIR; const E = JSON.parse(fs.readFileSync(`${DIR}/edits.json`, 'utf8'));
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const j = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io'; const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1400, height: 1200 } }); page.setDefaultTimeout(60000);
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', j.email); await page.fill('#password', j.ui_password || j.password); await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); process.exit(2); }
const done = fs.existsSync(`${DIR}/applied.json`) ? JSON.parse(fs.readFileSync(`${DIR}/applied.json`, 'utf8')) : {};
for (const [rid, e] of Object.entries(E)) {
  if (ONLY.length && !ONLY.includes(rid)) continue;
  if (done[rid]?.saved) { console.log('skip', rid); continue; }
  let err = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(`${HOST}/index.php?/tests/view/${e.test}`, { waitUntil: 'networkidle' });
      const clicked = await page.evaluate((rid) => { const a = [...document.querySelectorAll('a')].find(x => (x.getAttribute('onclick') || '').includes(`editResult(1, ${rid},`)); if (!a) return false; a.click(); return true; }, rid);
      if (!clicked) { err = 'no Edit link for this result'; break; }
      await page.locator('#addResultComment_display .fr-element').waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForTimeout(800);
      const set = await page.evaluate((html) => { const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === 'addResultComment_display'); if (!inst) return 'no-instance';
        inst.html.set(html); try { inst.undo.saveStep(); } catch (x) {} const back = document.querySelector('#addResultComment'); if (back) { back.value = inst.html.get(); back.dispatchEvent(new Event('change', { bubbles: true })); } return inst.html.get().slice(0, 60); }, e.new);
      if (set === 'no-instance') { err = 'no editor'; break; }
      await page.click('#addResultSubmit');
      for (let w = 0; w < 40; w++) { await page.waitForTimeout(500); if (!(await page.locator('#addResultSubmit').isVisible().catch(() => false))) break; }
      const still = await page.locator('#addResultSubmit').isVisible().catch(() => false);
      if (still) { err = await page.evaluate(() => [...document.querySelectorAll('.message-error, .error')].map(x => x.innerText.trim()).filter(Boolean).join(' | ').slice(0, 200)) || 'dialog stayed open'; await page.waitForTimeout(2000 * attempt); continue; }
      err = ''; break;
    } catch (x) { err = String(x).slice(0, 200); }
  }
  done[rid] = { saved: !err, error: err, case: e.case, test: e.test };
  fs.writeFileSync(`${DIR}/applied.json`, JSON.stringify(done, null, 1));
  console.log(rid, 'C' + e.case, err ? 'ERROR ' + err : 'saved');
}
await browser.close();
