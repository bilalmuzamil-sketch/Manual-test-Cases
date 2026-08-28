// UI repair of the 5 cases MY 2026-08-25 writes damaged. QA lead approved 2026-08-25.
//
// ADAPTED, NOT REINVENTED (Rule 27) from the proven
// build/report-suite/damage-2026-08-26/ui_repair_batch.mjs, which repaired 71 of 72 cases.
// Changes: my 5 case ids and my intended-blocks.json; UI login uses the ACCOUNT password
// (/tmp/testrail/creds-ui.json) while the API calls keep using the API key
// (/tmp/testrail/creds.json) — in this container those are two different secrets.
//
// Per case: Rule-71 gate (re-GET custom_atmstatus; 3 => SKIP), open the edit page, clear each
// field, PASTE the intended plain text (never re-type), Save, then verify by API re-GET AND by
// reading the rendered view page — the container must have become `markdown fr-view`, with zero
// literal tags and zero entity text visible, and the AUTOMATION marker intact and LAST.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/build-verify-session-2026-08-21/repair-2026-08-25';
const REPAIRED = `${DIR}/REPAIRED.jsonl`;
const FAILED = `${DIR}/FAILED.jsonl`;
const API_C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI_C = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${API_C.email}:${API_C.password}`).toString('base64');
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

const norm = s => (s || '')
  .replace(/ /g, ' ')
  .replace(/\r\n/g, '\n')
  .split('\n').map(l => l.replace(/[ \t]+$/g, '').replace(/^[ \t]+/g, '')).join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;

const done = new Set();
for (const f of [REPAIRED, FAILED]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && (j.ok || j.skipped)) done.add(String(j.cid)); } catch (_) {}
  }
}
const queue = Object.keys(data).sort((a, b) => +a - +b).filter(c => !done.has(c));
log(`queued ${queue.length} of ${Object.keys(data).length} (checkpointed already: ${done.size})`);

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
let lastPost = null;
page.on('response', r => {
  if (r.request().method() === 'POST' && /cases\/(edit|update|save)/.test(r.url())) {
    lastPost = `${r.status()} ${r.url()}`;
  }
});

await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI_C.email);
await page.fill('#password', UI_C.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
log('login url:', page.url());
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }

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

let ok = 0, bad = 0, skipped = 0;
for (const cid of queue) {
  const rec = data[cid];
  const fields = Object.keys(rec.fields);
  try {
    const [st, live] = await api(`get_case/${cid}`);
    if (st !== 200) throw new Error(`pre-GET HTTP ${st}`);
    if (live.custom_atmstatus === 3) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, skipped: true, reason: 'AUTOMATED — held, Rules 65/71', at: new Date().toISOString() }) + '\n');
      skipped++; log(`C${cid} SKIPPED — Automated`); continue;
    }
    const atmBefore = live.custom_atmstatus;
    const titleBefore = live.title;

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
      log(`C${cid} save disabled — stored content already matches; verifying anyway`);
    } else {
      await page.click('#accept', { timeout: 30000 });
      await page.waitForLoadState('networkidle');
      for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
      if (/cases\/edit/.test(page.url())) throw new Error(`still on the edit page after Save (POST: ${lastPost || 'none observed'})`);
    }

    // ---- VERIFY ----
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    const problems = [];
    if (after.custom_atmstatus !== atmBefore) problems.push(`atmstatus ${atmBefore} -> ${after.custom_atmstatus}`);
    if (after.title !== titleBefore) problems.push(`title changed: ${JSON.stringify(titleBefore)} -> ${JSON.stringify(after.title)}`);
    const view = await readView(cid);
    const evidence = { view_containers: view._count };
    if (view._count !== 3) problems.push(`expected 3 anonymous markdown containers, found ${view._count}`);
    for (const f of fields) {
      const want = norm(rec.fields[f].text);
      const v = view[f];
      if (!v) { problems.push(`${f}: no view container`); continue; }
      if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: container "${v.cls}" is still escaping`);
      const got = norm(v.text);
      if (got !== want) {
        const i = [...want].findIndex((ch, k) => ch !== got[k]);
        problems.push(`${f}: rendered text differs at char ${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 30), i + 30))} got ${JSON.stringify(got.slice(Math.max(0, i - 30), i + 30))}`);
      }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG still visible to the tester`);
      if (/&(mdash|rsquo|amp|lt|gt|nbsp|#\d+);/.test(v.text)) problems.push(`${f}: entity text visible to the tester`);
      evidence[f] = { cls: v.cls, rendered_len: v.text.length };
    }
    const exp = view.custom_expected ? view.custom_expected.text.trim() : '';
    if (!/AUTOMATION:/.test(exp)) problems.push('AUTOMATION marker missing');
    else if (!exp.split('\n').filter(Boolean).pop().startsWith('AUTOMATION:')) problems.push('AUTOMATION marker is not LAST');

    if (problems.length) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, problems, evidence, at: new Date().toISOString() }) + '\n');
      bad++; log(`C${cid} FAILED: ${problems.join(' | ')}`);
    } else {
      fs.appendFileSync(REPAIRED, JSON.stringify({ cid, ok: true, evidence, at: new Date().toISOString() }) + '\n');
      ok++; log(`C${cid} REPAIRED — fr-view, no literal tags, marker last`);
    }
  } catch (e) {
    fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, error: String(e).slice(0, 300), at: new Date().toISOString() }) + '\n');
    bad++; log(`C${cid} ERROR ${String(e).slice(0, 160)}`);
  }
}
log(`\nDONE — repaired ${ok}, failed ${bad}, skipped ${skipped}`);
await browser.close();
