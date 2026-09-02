// UI render-repair of the Inline Add and Edit Parts cases whose fields serve in a plain
// `markdown` container (block HTML ESCAPED -> tester reads literal <ol><li>). Only a UI save
// flips the container to `markdown fr-view`. QA lead approved UI-repair-to-fr-view 2026-08-31.
//
// ADAPTED, NOT REINVENTED (Rule 27) from build/build-verify-session-2026-08-21/repair-2026-08-25/
// ui_repair_my5.mjs (itself from report-suite/damage-2026-08-26/ui_repair_batch.mjs, 71/72).
// Changes: target list from targets.json; intended-blocks.json keyed by C-ID; chromium reaches
// TestRail through the LOCAL MITM BRIDGE (egress proxy resets chromium's raw TLS); Node fetch uses
// NODE_USE_ENV_PROXY. Rule-71: atmstatus==3 is SKIPPED, EXCEPT the QA-lead-whitelisted C45005 and
// C45026 (explicit go-ahead 2026-08-31). Foreign C45220 is not in our set and is never touched.
//
// Per case: re-GET atmstatus (3 && not whitelisted => SKIP), open edit page, clear each field,
// PASTE the intended readable text (never re-type char by char), Save, then VERIFY by API re-GET
// AND by reading the served view page — every repaired field's container must be `markdown fr-view`
// with ZERO literal tags and ZERO entity text, the AUTOMATION marker intact and LAST, atmstatus and
// title unchanged.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/source-verify-2026-09-02';
const REPAIRED = `${DIR}/REPAIRED.jsonl`;
const FAILED = `${DIR}/FAILED.jsonl`;
const AUTOMATED_OK = new Set(['45005', '45026']);   // QA-lead whitelist, 2026-08-31
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email||C.user}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks.json`, 'utf8'));
const targets = JSON.parse(fs.readFileSync(`${DIR}/targets.json`, 'utf8')).map(String);
const LIMIT = Number(process.env.LIMIT || 0);   // >0 = pilot of N cases

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

async function api(path, tries = 5) {
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
const ONLY = (process.env.ONLY || '').split(',').map(s => s.trim()).filter(Boolean);
let queue = targets.filter(c => !done.has(c));
if (ONLY.length) queue = queue.filter(c => ONLY.includes(c));
if (LIMIT > 0) queue = queue.slice(0, LIMIT);
log(`queued ${queue.length} of ${targets.length} targets (already checkpointed: ${done.size})`);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors', '--disable-background-networking', '--disable-component-update', '--no-first-run', '--no-default-browser-check'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
let lastPost = null;
page.on('response', r => {
  if (r.request().method() === 'POST' && /cases\/(edit|update|save|add)/.test(r.url())) lastPost = `${r.status()} ${r.url()}`;
});

await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email);
await page.fill('#password', UI.password);
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
    if (live.custom_atmstatus === 3 && !AUTOMATED_OK.has(cid)) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, skipped: true, reason: 'AUTOMATED — held, Rules 65/71', at: new Date().toISOString() }) + '\n');
      skipped++; log(`C${cid} SKIPPED — Automated (not whitelisted)`); continue;
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
    // Blur the editor so Froala flushes its change event, then settle — fast insertText
    // can otherwise leave the form 'not dirty' and Save no-ops with a 302 back to edit.
    await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
    await page.waitForTimeout(1400);
    // Up to 3 save attempts: click Save, wait; if still on the edit URL, retype nothing but
    // re-click after a settle. The served-page verify below remains the authority.
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await page.locator('#accept').isDisabled()) {
        if (attempt === 0) log(`C${cid} save disabled — stored content already matches; verifying anyway`);
        break;
      }
      lastPost = null;
      await page.click('#accept', { timeout: 30000 });
      await page.waitForLoadState('networkidle').catch(() => {});
      for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
      if (!/cases\/edit/.test(page.url())) break;
      log(`C${cid} still on edit URL after Save attempt ${attempt + 1} (POST: ${lastPost || 'none'}) — retrying`);
      await page.waitForTimeout(1200);
    }

    // ---- VERIFY ----
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    const problems = [];
    if (after.custom_atmstatus !== atmBefore) problems.push(`atmstatus ${atmBefore} -> ${after.custom_atmstatus}`);
    if (after.title !== titleBefore) problems.push(`title changed: ${JSON.stringify(titleBefore)} -> ${JSON.stringify(after.title)}`);
    const view = await readView(cid);
    const evidence = { view_containers: view._count };
    for (const f of fields) {
      const want = norm(rec.fields[f].text);
      const v = view[f];
      if (!v) { problems.push(`${f}: no view container`); continue; }
      if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: container "${v.cls}" still escaping`);
      const got = norm(v.text);
      if (got !== want) {
        const i = [...want].findIndex((ch, k) => ch !== got[k]);
        problems.push(`${f}: rendered text differs at char ${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 30), i + 30))} got ${JSON.stringify(got.slice(Math.max(0, i - 30), i + 30))}`);
      }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG still visible`);
      if (/&(mdash|rsquo|amp|lt|gt|nbsp|#\d+);/.test(v.text)) problems.push(`${f}: entity text visible`);
      evidence[f] = { cls: v.cls, rendered_len: v.text.length };
    }
    const exp = view.custom_expected ? view.custom_expected.text.trim() : '';
    if (!/AUTOMATION:/.test(exp)) problems.push('AUTOMATION marker missing');
    else if (!exp.split('\n').filter(Boolean).pop().startsWith('AUTOMATION:')) problems.push('AUTOMATION marker not LAST');

    if (problems.length) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, problems, evidence, at: new Date().toISOString() }) + '\n');
      bad++; log(`C${cid} FAILED: ${problems.join(' | ')}`);
    } else {
      fs.appendFileSync(REPAIRED, JSON.stringify({ cid, ok: true, atm: after.custom_atmstatus, evidence, at: new Date().toISOString() }) + '\n');
      ok++; log(`C${cid} REPAIRED — fr-view, no literal tags, marker last (atm=${after.custom_atmstatus})`);
    }
  } catch (e) {
    fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, error: String(e).slice(0, 300), at: new Date().toISOString() }) + '\n');
    bad++; log(`C${cid} ERROR ${String(e).slice(0, 160)}`);
  }
  await page.waitForTimeout(400);   // gentle rate-limit
}
log(`\nDONE — repaired ${ok}, failed ${bad}, skipped ${skipped}`);
await browser.close();
