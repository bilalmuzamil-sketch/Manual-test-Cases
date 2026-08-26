// UI repair of the 2026-08-26 render damage — TestRail web editor driven by Playwright.
// Approved by the QA lead 2026-08-26. Rule 75: runs detached, checkpoints every case.
//
// Per case: Rule-71 gate (re-GET custom_atmstatus; 3 => SKIP), open the edit page, clear the
// damaged field(s), PASTE the intended text (never re-type), Save, then verify by API re-GET AND
// by reading the rendered view page (container must be `markdown fr-view`, zero literal tags,
// AUTOMATION marker last, atmstatus unchanged).
//
// Playwright must go through the LOCAL MITM BRIDGE (chromium cannot TLS through the egress proxy).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/report-suite/damage-2026-08-26';
const REPAIRED = `${DIR}/REPAIRED.jsonl`;
const FAILED = `${DIR}/FAILED.jsonl`;
const RUNFLAG = '/tmp/rsrepair/RUNNING';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks.json`, 'utf8'));

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

// what the tester reads, normalised for comparison
const norm = s => (s || '')
  .replace(/ /g, ' ')
  .replace(/\r\n/g, '\n')
  .split('\n').map(l => l.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, '')).join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i)\b[^>]*>/i;

const done = new Set();
for (const f of [REPAIRED, FAILED]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && (j.ok || j.skipped)) done.add(String(j.cid)); } catch (_) {}
  }
}

const LIMIT = Number(process.env.LIMIT || 0);   // >0 = pilot run of N cases
let queue = Object.keys(data).sort((a, b) => +a - +b).filter(c => !done.has(c));
if (LIMIT > 0) queue = queue.slice(0, LIMIT);
log(`queued ${queue.length} of ${Object.keys(data).length} (already checkpointed: ${done.size})`);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'],
  proxy: { server: `http://127.0.0.1:${port}` },
});
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1400 } });
page.setDefaultTimeout(60000);

await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', C.email);
await page.fill('#password', C.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
log('login url:', page.url());
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }

async function readView(cid) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' });
  // The three case text fields are the ONLY anonymous `markdown*` containers on the page,
  // in document order: preconditions, steps, expected result. (`addCommentComment_display`
  // and `requirements_display` carry ids and are not case content — proven 2026-08-26.)
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
    const atmBefore = live.custom_atmstatus;

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
    await page.click('#accept', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    if (/cases\/edit/.test(page.url())) throw new Error('still on the edit page after Save');

    // ---- VERIFY ----
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    if (after.custom_atmstatus !== atmBefore) throw new Error(`atmstatus changed ${atmBefore} -> ${after.custom_atmstatus}`);
    const view = await readView(cid);
    const problems = [];
    const evidence = { view_containers: view._count };
    if (view._count !== 3) problems.push(`expected 3 anonymous markdown containers, found ${view._count}`);
    for (const f of fields) {
      const want = norm(rec.fields[f].text);
      const v = view[f];
      if (!v) { problems.push(`${f}: no view container found`); continue; }
      if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: container is "${v.cls}", not "markdown fr-view"`);
      const got = norm(v.text);
      if (got !== want) {
        const i = [...want].findIndex((ch, k) => ch !== got[k]);
        problems.push(`${f}: rendered text differs at char ${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 30), i + 30))} got ${JSON.stringify(got.slice(Math.max(0, i - 30), i + 30))}`);
      }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG still visible to the tester`);
      if (/&(mdash|rsquo|amp|lt|gt|nbsp|#\d+);/.test(v.text)) problems.push(`${f}: HTML entity text visible to the tester`);
      evidence[f] = { cls: v.cls, stored_len: (after[f] || '').length, rendered_len: v.text.length };
    }
    // AUTOMATION marker: present, intact and LAST
    if (fields.includes('custom_expected')) {
      const lines = norm(view.custom_expected ? view.custom_expected.text : '').split('\n').filter(l => l.trim());
      const last = lines[lines.length - 1] || '';
      if (!/^AUTOMATION: (READY|HOLD)/.test(last)) problems.push(`AUTOMATION marker is not last: ${JSON.stringify(last.slice(0, 60))}`);
      const nmark = lines.filter(l => l.startsWith('AUTOMATION:')).length;
      if (nmark !== 1) problems.push(`AUTOMATION marker count = ${nmark}`);
      if (!/This is the expected behaviour|Specification version|expectation has not been checked/.test(view.custom_expected.text)) problems.push('provenance line missing');
    }
    if (problems.length) throw new Error(problems.join(' | '));

    fs.appendFileSync(REPAIRED, JSON.stringify({
      cid, ok: true, fields, atm: after.custom_atmstatus, evidence,
      link: `${HOST}/index.php?/cases/view/${cid}`, at: new Date().toISOString(),
    }) + '\n');
    ok++; consecutiveFail = 0;
    log(`C${cid} REPAIRED (${fields.join(',')}) — ${ok}/${queue.length}`);
  } catch (e) {
    bad++; consecutiveFail++;
    fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, fields, error: String(e).slice(0, 900), at: new Date().toISOString() }) + '\n');
    log(`C${cid} FAILED: ${String(e).slice(0, 200)}`);
    if (consecutiveFail >= 3) { log('3 consecutive failures — STOPPING the batch (Rule 2.3)'); break; }
  }
}

log(`DONE repaired=${ok} failed=${bad} skipped=${skipped}`);
fs.writeFileSync(`${DIR}/BATCH-STATUS.txt`, `repaired=${ok} failed=${bad} skipped=${skipped} queued=${queue.length} finished=${new Date().toISOString()}\n`);
await browser.close();
try { fs.unlinkSync(RUNFLAG); } catch (_) {}
process.exit(0);
