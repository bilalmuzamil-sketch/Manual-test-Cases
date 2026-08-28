// Verify the 5 cases the way the PROVEN script does: only the ANONYMOUS markdown containers
// are case content. Containers carrying an id (addCommentComment_display, requirements_display)
// and anything the change-history renders are NOT the case's fields — a naive regex over the
// whole page counts those and reports false damage. Read-only.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/build-verify-session-2026-08-21/repair-2026-08-25';
const UI_C = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const API_C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const AUTH = 'Basic ' + Buffer.from(`${API_C.email}:${API_C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const intended = JSON.parse(fs.readFileSync(`${DIR}/intended.json`, 'utf8'));

const norm = s => (s || '').replace(/ /g, ' ').replace(/\r\n/g, '\n')
  .split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|hr)\b[^>]*>/i;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors'],
});
const page = await (await browser.newContext({ ignoreHTTPSErrors: true })).newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI_C.email);
await page.fill('#password', UI_C.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');

const out = {};
for (const cid of Object.keys(intended).sort()) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  const view = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    const o = { _count: ds.length };
    ['custom_preconds', 'custom_steps', 'custom_expected'].forEach((f, i) => {
      if (ds[i]) o[f] = { cls: ds[i].className.trim(), text: ds[i].innerText };
    });
    return o;
  });
  const r = await fetch(`${HOST}/index.php?/api/v2/get_case/${cid}`, { headers: { Authorization: AUTH } });
  const api = await r.json();
  const problems = [];
  if (view._count !== 3) problems.push(`anonymous containers = ${view._count}, expected 3`);
  for (const f of ['custom_preconds', 'custom_steps', 'custom_expected']) {
    const v = view[f];
    if (!v) { problems.push(`${f}: no container`); continue; }
    if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: container "${v.cls}" still escaping`);
    if (LITERAL.test(v.text)) problems.push(`${f}: literal tag visible`);
    if (/&(mdash|nbsp|lt|gt|amp);/.test(v.text)) problems.push(`${f}: entity text visible`);
    if (norm(v.text) !== norm(intended[cid][f])) problems.push(`${f}: rendered text != intended`);
    if (LITERAL.test(api[f] || '')) problems.push(`${f}: STORED value still contains a tag`);
  }
  const exp = (view.custom_expected?.text || '').trim();
  if (!/AUTOMATION:/.test(exp)) problems.push('marker missing');
  else if (!exp.split('\n').filter(Boolean).pop().startsWith('AUTOMATION:')) problems.push('marker not last');
  out[cid] = { problems, containers: [view.custom_preconds?.cls, view.custom_steps?.cls, view.custom_expected?.cls] };
  console.log(`C${cid}: ${problems.length ? 'PROBLEMS -> ' + problems.join(' | ') : 'CLEAN — fr-view, no tags, text matches intended, marker last'}`);
}
fs.writeFileSync(`${DIR}/VERIFY.json`, JSON.stringify(out, null, 1));
const clean = Object.values(out).filter(v => !v.problems.length).length;
console.log(`\n${clean} of ${Object.keys(out).length} clean`);
await browser.close();
