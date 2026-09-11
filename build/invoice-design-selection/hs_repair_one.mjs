// Targeted single-case fr-view repair. Reads the CURRENT live field HTML from the API and
// re-saves each field verbatim through Froala (html.set, no keystroke autoformat), flipping any
// escaping container to fr-view WITHOUT changing content. Idempotent: if already fr-view + no
// literal tags, records OK and edits nothing. CID via env CID=53537.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const CID = (process.env.CID || '').trim();
if (!CID) { console.error('set CID'); process.exit(2); }
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email||C.user}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
async function api(path) {
  const r = await fetch(`${API}/${path}`, { headers: { Authorization: AUTH, 'Content-Type': 'application/json' } });
  return [r.status, await r.json().catch(() => null)];
}
const [st, live] = await api(`get_case/${CID}`);
if (st !== 200) { log('pre-GET failed', st); process.exit(2); }
const FIELDS = ['custom_preconds', 'custom_steps', 'custom_expected'];
const wantHtml = {}; for (const f of FIELDS) wantHtml[f] = live[f] || '';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors', '--no-first-run', '--no-default-browser-check'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }

async function readView() {
  await page.goto(`${HOST}/index.php?/cases/view/${CID}`, { waitUntil: 'networkidle' });
  return await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    const out = { _count: ds.length };
    ['custom_preconds', 'custom_steps', 'custom_expected'].forEach((f, i) => {
      if (ds[i]) out[f] = { cls: ds[i].className.trim(), text: ds[i].innerText };
    });
    return out;
  });
}
function problems(view) {
  const p = [];
  for (const f of FIELDS) {
    const v = view[f];
    if (!v) { p.push(`${f}: no container`); continue; }
    if (!/\bfr-view\b/.test(v.cls)) p.push(`${f}: "${v.cls}" escaping`);
    if (LITERAL.test(v.text)) p.push(`${f}: literal tag visible`);
    if (/&(mdash|rsquo|amp|lt|gt|nbsp|rarr|#\d+);/.test(v.text)) p.push(`${f}: entity visible`);
  }
  const exp = view.custom_expected ? view.custom_expected.text.trim() : '';
  if (!/AUTOMATION:/.test(exp)) p.push('AUTOMATION marker missing');
  else if (!exp.split('\n').filter(Boolean).pop().startsWith('AUTOMATION:')) p.push('AUTOMATION not last');
  return p;
}
const titleBefore = live.title, atmBefore = live.custom_atmstatus;
let view = await readView();
let probs = problems(view);
log('BEFORE:', JSON.stringify(view._count), FIELDS.map(f => f + '=' + (view[f]?view[f].cls:'?')).join(' '));
let didFix = false;
if (probs.length) {
  log('problems:', probs.join(' | '));
  let saveErr = '';
  for (let attempt = 1; attempt <= 12; attempt++) {
    await page.goto(`${HOST}/index.php?/cases/edit/${CID}`, { waitUntil: 'networkidle' });
    await page.locator('#custom_preconds_display .fr-element').waitFor({ state: 'visible', timeout: 30000 });
    for (const f of FIELDS) {
      const html = wantHtml[f];
      const set = await page.evaluate(({ f, html }) => {
        const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display');
        if (!inst) return 'no-instance';
        inst.html.set(html);
        try { inst.undo.saveStep(); } catch (e) {}
        const backing = document.querySelector(`#${f}`);
        if (backing) { backing.value = inst.html.get(); backing.dispatchEvent(new Event('change', { bubbles: true })); }
        return 'ok';
      }, { f, html });
      if (set === 'no-instance') throw new Error(`Froala instance not found for ${f}`);
    }
    await page.waitForTimeout(400);
    if (await page.locator('#accept').isDisabled()) { log('accept disabled — nothing to save'); break; }
    await page.click('#accept', { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    for (let w = 0; w < 60 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
    if (!/cases\/edit/.test(page.url())) { saveErr = ''; break; }
    saveErr = await page.evaluate(() => [...document.querySelectorAll('.message-error')].map(x => (x.innerText||'').trim()).filter(Boolean).join(' | ').slice(0,200));
    log(`save attempt ${attempt} rejected (${saveErr||'no msg'}) — retry`);
    await page.waitForTimeout(Math.min(2000 + 1500 * attempt, 15000));
  }
  didFix = true;
  view = await readView();
  probs = problems(view);
}
const [, after] = await api(`get_case/${CID}`);
if (after && after.title !== titleBefore) probs.push('TITLE CHANGED');
if (after && after.custom_atmstatus !== atmBefore) probs.push(`atm ${atmBefore}->${after.custom_atmstatus}`);
log('AFTER:', FIELDS.map(f => f + '=' + (view[f]?view[f].cls:'?')).join(' '));
log(probs.length ? ('RESULT FAIL: ' + probs.join(' | ')) : `RESULT OK (edited=${didFix}) — all fr-view, no literal tags, marker last, title/atm unchanged`);
await browser.close();
process.exit(probs.length ? 1 : 0);
