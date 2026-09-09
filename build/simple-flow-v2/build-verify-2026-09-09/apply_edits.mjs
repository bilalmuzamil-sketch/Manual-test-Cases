// One-login driver for per-case single-string edits. Faithful copy of surgical_replace.mjs's
// Froala mechanics (html.set + contentChanged + input events + normal click + deadlock retry +
// byte-verify), but logs in ONCE and applies a list of {cid, field, from, to} edits.
// Guards: never edits created_by=1 (Vladimir, Rule 38); refuses atmstatus=3 unless in AUTH_OK (Rule 71).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const EDITS = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OUT = process.argv[2].replace(/[^/]+$/, '');
// SFV2 per-suite Automated go-ahead (QA lead 2026-09-09, SFV2-BV-AUTO). C44575/C44587 in this batch
// are Automated; C44604 is NOT edited here (held PO question). Vladimir's cases never touched (Rule 38).
const AUTH_OK = new Set(['44557','44561','44575','44583','44587','44604','44605']);
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const HOST = C.host.replace(/\/$/, '');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const repaired = OUT + 'REPAIRED-runnable.jsonl', failed = OUT + 'FAILED-runnable.jsonl';
const done = new Set();
if (fs.existsSync(repaired)) for (const l of fs.readFileSync(repaired, 'utf8').split('\n')) { try { const j = JSON.parse(l); if (j.cid) done.add(String(j.cid)); } catch (_) {} }
async function api(path) {
  const r = await fetch(`${HOST}/index.php?/api/v2/${path}`, { headers: { Authorization: AUTH } });
  return [r.status, await r.json().catch(() => ({}))];
}
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${PORT}` } });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
let ok = 0, bad = 0, skip = 0;
for (const e of EDITS) {
  const { cid, field, from, to } = e;
  if (done.has(String(cid))) { log(`C${cid} already checkpointed`); ok++; continue; }
  const [st, before] = await api(`get_case/${cid}`);
  if (st !== 200) { log(`C${cid} pre-GET ${st}`); bad++; continue; }
  if (before.created_by === 1) { log(`C${cid} SKIP - Vladimir's case (Rule 38)`); skip++; continue; }
  if (before.custom_atmstatus === 3 && !AUTH_OK.has(String(cid))) { log(`C${cid} SKIP - Automated, no go-ahead (Rule 71)`); skip++; continue; }
  const n = (before[field] || '').split(from).length - 1;
  if (n !== 1) { log(`C${cid} SKIP - '${from.slice(0,30)}' found ${n}x (want 1) in ${field}`); skip++; continue; }
  await page.goto(`${HOST}/index.php?/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.goto(`${HOST}/index.php?/cases/edit/${cid}&_cb=${Date.now()}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const res = await page.evaluate(([f, f0, t0]) => {
    const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display');
    if (!inst) return 'no editor';
    const cur = inst.html.get();
    const c = cur.split(f0).length - 1;
    if (c !== 1) return `found ${c}`;
    inst.html.set(cur.split(f0).join(t0));
    try { inst.undo.saveStep(); } catch (_) {}
    try { inst.events.trigger('contentChanged'); } catch (_) {}
    try { const el = inst.$oel[0]; for (const t of ['input', 'change', 'keyup']) el.dispatchEvent(new Event(t, { bubbles: true })); } catch (_) {}
    return 'replaced';
  }, [field, from, to]);
  if (res !== 'replaced') { log(`C${cid} nothing replaced: ${res}`); skip++; continue; }
  await page.click('#accept'); await page.waitForLoadState('networkidle');
  for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
  for (let dl = 0; dl < 3 && /cases\/edit/.test(page.url()); dl++) {
    const isDeadlock = await page.evaluate(() => /Deadlock found when trying to get lock/.test(document.body?.innerText || ''));
    if (!isDeadlock) break;
    log(`C${cid} deadlock - retry ${dl + 1}/3`); await page.waitForTimeout(3000 * (dl + 1));
    await page.click('#accept').catch(() => {}); await page.waitForLoadState('networkidle');
    for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
  }
  if (/cases\/edit/.test(page.url())) { fs.appendFileSync(failed, JSON.stringify({ cid, error: 'still on edit page' }) + '\n'); log(`C${cid} FAILED: still on edit page`); bad++; continue; }
  const [, after] = await api(`get_case/${cid}`);
  const want = before[field].split(from).join(to);
  const problems = [];
  if (after[field] !== want) problems.push(`${field} not exactly the expected replacement`);
  for (const f of ['custom_preconds', 'custom_expected', 'title']) if (f !== field && (after[f] || '') !== (before[f] || '')) problems.push(`${f} changed`);
  if (after.custom_atmstatus !== before.custom_atmstatus) problems.push('atmstatus changed');
  // served-page fr-view scan
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  const frview = await page.evaluate(() => !![...document.querySelectorAll('.markdown.fr-view')].length);
  if (!frview) problems.push('served page not fr-view');
  if (problems.length) { fs.appendFileSync(failed, JSON.stringify({ cid, problems }) + '\n'); log(`C${cid} PROBLEMS: ${problems.join('; ')}`); bad++; continue; }
  fs.appendFileSync(repaired, JSON.stringify({ cid, field, at: new Date().toISOString() }) + '\n');
  log(`C${cid} OK`); ok++;
}
log(`DONE ok=${ok} bad=${bad} skip=${skip}`);
await browser.close();
