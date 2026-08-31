// Lift the AUTOMATION marker to READY and stamp Rule-54 sentence 2 on the 53 build-verified
// Invoice UI Refresh cases -- via the TestRail WEB EDITOR, not the API.
//
// WHY THE UI AND NOT THE API (proven on these very cases, 2026-08-31):
//   48 of the 53 serve their three text fields from a plain <div class="markdown"> container,
//   which ESCAPES the stored value, so the tester literally reads "<ol><li>...". The 5 cases
//   that render correctly are in <div class="markdown fr-view">. Scanning the 5 cases I had
//   repaired through the UI earlier today: 5 of 5 are fr-view. An API write leaves the field
//   escaping; a UI save sets fr-view. So the marker write and the render repair are ONE
//   operation, and it has to go through the editor.
//
// Adapted from build/report-suite/damage-2026-08-26/ui_repair_batch.mjs (71 of 72 repaired).
// Rule 27: reuse the proven recipe. Its hard-won details are kept verbatim --
//   * cache-busting headers (the edit form's one-shot token rotates; a cached page POSTs a
//     stale token and the save is silently rejected)
//   * POLL for the post-save navigation instead of a fixed wait (a fixed 1500ms mis-reported
//     ~50% of landed saves as failures)
//   * a DISABLED Save button means "content already matches" -- a no-op, not a failure
//   * Rule 71 gate re-GETs custom_atmstatus immediately before each write; 3 => SKIP for Vlad
//
// TRAP (2026-08-31): /tmp/testrail/creds.json.password holds the API KEY. The UI login needs the
// account password, which lives in /tmp/testrail/ui-creds.json (chmod 600). Posting the API key
// silently lands you back on the login form.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/invoice-ui-refresh/build-verify-2026-08-31/markers';
const DONE = `${DIR}/APPLIED.jsonl`;
const FAILED = `${DIR}/FAILED.jsonl`;
const RUNFLAG = '/tmp/invmark/RUNNING';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const U = JSON.parse(fs.readFileSync('/tmp/testrail/ui-creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks.json`, 'utf8'));
const snap = JSON.parse(fs.readFileSync(`${DIR}/PRE-markers-snapshot.json`, 'utf8'));

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

async function api(path, tries = 4) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(`${API}/${path}`, { headers: { Authorization: AUTH, 'Content-Type': 'application/json' } });
      const b = await r.json().catch(() => null);
      if (r.status === 429) { await new Promise(s => setTimeout(s, 5000)); continue; }
      return [r.status, b];
    } catch (e) { await new Promise(s => setTimeout(s, 3000 * (t + 1))); }
  }
  return [0, null];
}

const norm = s => (s || '')
  .replace(/ /g, ' ').replace(/\r\n/g, '\n')
  .split('\n').map(l => l.trim()).join('\n')
  .replace(/\n{3,}/g, '\n\n').trim();

const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const ENTITY = /&(mdash|rsquo|lsquo|amp|lt|gt|nbsp|rarr|#\d+);/;

const done = new Set();
for (const f of [DONE, FAILED]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && (j.ok || j.skipped)) done.add(String(j.cid)); } catch (_) {}
  }
}

const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const LIMIT = Number(process.env.LIMIT || 0);
let queue = Object.keys(data).sort((a, b) => +a - +b).filter(c => !done.has(c));
if (ONLY.length) queue = ONLY.filter(c => data[c]);
if (LIMIT > 0) queue = queue.slice(0, LIMIT);
log(`queued ${queue.length} of ${Object.keys(data).length} (already checkpointed: ${done.size})`);
fs.mkdirSync('/tmp/invmark', { recursive: true });
fs.writeFileSync(RUNFLAG, 'running');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'],
  proxy: { server: `http://127.0.0.1:${port}` },
});
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1400 } });
page.setDefaultTimeout(60000);
await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' });
let lastPost = null;
page.on('response', r => {
  if (r.request().method() === 'POST' && /cases\/(edit|update|save)/.test(r.url())) lastPost = `${r.status()} ${r.url().slice(0, 120)}`;
});

await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', U.email);
await page.fill('#password', U.ui_password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
log('login landed on:', page.url().replace(HOST, ''));
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED — refusing to continue'); await browser.close(); process.exit(2); }

async function readView(cid) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  return await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    const out = { _count: ds.length };
    ['custom_preconds', 'custom_steps', 'custom_expected'].forEach((f, i) => {
      if (ds[i]) out[f] = { cls: ds[i].className.trim(), text: ds[i].innerText };
    });
    return out;
  });
}

let ok = 0, bad = 0, skipped = 0, consecutiveFail = 0;
for (const cid of queue) {
  if (!fs.existsSync(RUNFLAG)) { log('run flag gone — stopping'); break; }
  const rec = data[cid];
  const fields = Object.keys(rec.fields);
  try {
    // ---- RULE 71 GATE, immediately before the write ----
    const [st, live] = await api(`get_case/${cid}`);
    if (st !== 200) throw new Error(`pre-GET HTTP ${st}`);
    if (live.custom_atmstatus === 3) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, skipped: true, reason: 'AUTOMATED (custom_atmstatus=3) — held for Vlad, Rules 65/71', at: new Date().toISOString() }) + '\n');
      skipped++; log(`C${cid} SKIPPED — Automated`); continue;
    }
    const atmBefore = live.custom_atmstatus, secBefore = live.section_id, refsBefore = live.refs || null;

    await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });
    for (const f of fields) {
      const ed = page.locator(`#${f}_display .fr-element`);
      await ed.waitFor({ state: 'visible', timeout: 30000 });
      await ed.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      const blocks = rec.fields[f].blocks;
      for (let i = 0; i < blocks.length; i++) {
        if (i) await page.keyboard.press('Enter');
        for (let j = 0; j < blocks[i].length; j++) {
          if (j) await page.keyboard.press('Shift+Enter');
          await page.keyboard.insertText(blocks[i][j]);   // PASTE, never re-type
        }
      }
    }
    await page.waitForTimeout(700);
    lastPost = null;
    if (await page.locator('#accept').isDisabled()) {
      log(`C${cid} save button disabled — content already matches; verifying`);
    } else {
      await page.click('#accept', { timeout: 30000 });
      await page.waitForLoadState('networkidle');
      for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
      if (/cases\/edit/.test(page.url())) throw new Error(`still on the edit page after Save (save POST: ${lastPost || 'none observed'})`);
    }

    // ---------------- VERIFY ----------------
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    if (after.custom_atmstatus !== atmBefore) throw new Error(`atmstatus changed ${atmBefore} -> ${after.custom_atmstatus}`);
    if (after.section_id !== secBefore) throw new Error(`section_id changed ${secBefore} -> ${after.section_id}`);
    if ((after.refs || null) !== refsBefore) throw new Error(`refs changed ${refsBefore} -> ${after.refs}`);

    const view = await readView(cid);
    const problems = [];
    const evidence = { view_containers: view._count };
    if (view._count !== 3) problems.push(`expected 3 anonymous markdown containers, found ${view._count}`);
    for (const f of fields) {
      const want = norm(rec.fields[f].text);
      const v = view[f];
      if (!v) { problems.push(`${f}: no view container found`); continue; }
      if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: container is "${v.cls}", not "markdown fr-view" — the tester would read tags`);
      const got = norm(v.text);
      if (got !== want) {
        const i = [...want].findIndex((ch, k) => ch !== got[k]);
        problems.push(`${f}: rendered text differs at char ${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 30), i + 30))} got ${JSON.stringify(got.slice(Math.max(0, i - 30), i + 30))}`);
      }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG still visible to the tester`);
      if (ENTITY.test(v.text)) problems.push(`${f}: HTML entity text visible to the tester`);
      evidence[f] = { cls: v.cls, stored_len: (after[f] || '').length, rendered_len: v.text.length };
    }
    // ---- the marker and the two provenance sentences ----
    const lines = norm(view.custom_expected ? view.custom_expected.text : '').split('\n').filter(l => l.trim());
    const last = lines[lines.length - 1] || '';
    if (last !== 'AUTOMATION: READY') problems.push(`marker is not "AUTOMATION: READY" and last: ${JSON.stringify(last.slice(0, 70))}`);
    const nmark = lines.filter(l => l.startsWith('AUTOMATION:')).length;
    if (nmark !== 1) problems.push(`AUTOMATION marker count = ${nmark}`);
    if (/Not available on Build/.test(view.custom_expected.text)) problems.push('the deferred marker text is still present');
    // Rule 54: sentence 1 carried byte-for-byte, sentence 2 present, NEVER merged
    const wantS1 = norm(snap[cid].provenance[0].replace(/&amp;/g, '&').replace(/&mdash;/g, '—'));
    const s1 = lines.filter(l => l.startsWith('This is the expected behaviour'));
    const s2 = lines.filter(l => l.startsWith('Last checked against build'));
    if (s1.length !== 1) problems.push(`provenance sentence 1 count = ${s1.length}`);
    else if (norm(s1[0]) !== wantS1) problems.push(`provenance sentence 1 was altered`);
    if (s2.length !== 1) problems.push(`build sentence count = ${s2.length}`);
    else if (s2[0] !== 'Last checked against build v26.35.5-8c3cc21 on 8/31/2026.') problems.push(`build sentence wrong: ${JSON.stringify(s2[0])}`);
    if (/as per the build tested on/i.test(view.custom_expected.text)) problems.push('BARRED phrasing "as per the build tested on" present');
    if (problems.length) throw new Error(problems.join(' | '));

    fs.appendFileSync(DONE, JSON.stringify({
      cid, ok: true, fields, atm: after.custom_atmstatus, escaping_before: rec.escaping,
      evidence, http: st2, link: `${HOST}/index.php?/cases/view/${cid}`, at: new Date().toISOString(),
    }) + '\n');
    ok++; consecutiveFail = 0;
    log(`C${cid} DONE (${fields.length} field${fields.length > 1 ? 's' : ''}) — ${ok}/${queue.length}`);
  } catch (e) {
    bad++; consecutiveFail++;
    fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, fields, error: String(e).slice(0, 900), at: new Date().toISOString() }) + '\n');
    log(`C${cid} FAILED: ${String(e).slice(0, 240)}`);
    if (consecutiveFail >= 3) { log('3 consecutive failures — STOPPING the batch'); break; }
  }
}

log(`DONE applied=${ok} failed=${bad} skipped=${skipped}`);
fs.writeFileSync(`${DIR}/BATCH-STATUS.txt`, `applied=${ok} failed=${bad} skipped=${skipped} queued=${queue.length} finished=${new Date().toISOString()}\n`);
await browser.close();
try { fs.unlinkSync(RUNFLAG); } catch (_) {}
process.exit(0);
