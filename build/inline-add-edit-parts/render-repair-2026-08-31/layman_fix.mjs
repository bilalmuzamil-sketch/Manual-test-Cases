// Definitive verify-or-fix pass over the 77 render-repair targets, using a DETERMINISTIC
// content set (build <p>line<br>line</p> HTML — the exact shape the good cases hold — and set it
// through the editor + backing input, then Save). This cannot trigger Froala's list-autoformat
// (which was silently swallowing the literal "1." into real <ol> markers on some keystroke saves).
//
// Per target: re-GET atmstatus (3 && not whitelisted => SKIP). Read the served view page first;
// if already fr-view + text matches + no literal tags + AUTOMATION marker last, record OK without
// editing (idempotent). Otherwise open the edit page, set each field's HTML deterministically, Save,
// then VERIFY on the served view page. Foreign C45220 is not in the set and is never touched.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/inline-add-edit-parts/render-repair-2026-08-31';
const OKLOG = `${DIR}/REPAIRED-layman.jsonl`;
const BADLOG = `${DIR}/FAILED-layman.jsonl`;
const AUTOMATED_OK = new Set([]);  // layman pass: NO whitelist — atm=3 skipped (Rule 71)
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks.json`, 'utf8'));
const targets = JSON.parse(fs.readFileSync(`${DIR}/targets.json`, 'utf8')).map(String);
const ONLY = (process.env.ONLY || '').split(',').map(s => s.trim()).filter(Boolean);

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const norm = s => (s || '').replace(/ /g, ' ').replace(/\r\n/g, '\n')
  .split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fieldHtml = (cid, f) => data[cid].fields[f].blocks.map(b => '<p>' + b.map(esc).join('<br>') + '</p>').join('');

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

const done = new Set();
for (const f of [OKLOG, BADLOG]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && (j.ok || j.skipped)) done.add(String(j.cid)); } catch (_) {}
  }
}
let queue = targets.filter(c => !done.has(c));
if (ONLY.length) queue = queue.filter(c => ONLY.includes(c));
log(`queued ${queue.length} of ${targets.length} (checkpointed: ${done.size})`);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  proxy: { server: `http://127.0.0.1:${port}` },
  args: ['--ignore-certificate-errors', '--disable-background-networking', '--disable-component-update', '--no-first-run', '--no-default-browser-check'],
});
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
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
function checkView(cid, view) {
  const problems = [];
  const evidence = { view_containers: view._count };
  for (const f of ['custom_preconds', 'custom_steps', 'custom_expected']) {
    const v = view[f];
    if (!v) { problems.push(`${f}: no container`); continue; }
    if (!/\bfr-view\b/.test(v.cls)) problems.push(`${f}: "${v.cls}" escaping`);
    if (LITERAL.test(v.text)) problems.push(`${f}: literal tag visible`);
    if (/&(mdash|rsquo|amp|lt|gt|nbsp|rarr|#\d+);/.test(v.text)) problems.push(`${f}: entity visible`);
    const want = norm(data[cid].fields[f].text), got = norm(v.text);
    if (got !== want) {
      const i = [...want].findIndex((ch, k) => ch !== got[k]);
      problems.push(`${f}: text differs @${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 20), i + 25))} got ${JSON.stringify(got.slice(Math.max(0, i - 20), i + 25))}`);
    }
    evidence[f] = v ? { cls: v.cls } : null;
  }
  const exp = view.custom_expected ? view.custom_expected.text.trim() : '';
  if (!/AUTOMATION:/.test(exp)) problems.push('AUTOMATION marker missing');
  else if (!exp.split('\n').filter(Boolean).pop().startsWith('AUTOMATION:')) problems.push('AUTOMATION not last');
  return { problems, evidence };
}

let ok = 0, fixed = 0, bad = 0, skipped = 0;
for (const cid of queue) {
  try {
    const [st, live] = await api(`get_case/${cid}`);
    if (st !== 200) throw new Error(`pre-GET HTTP ${st}`);
    if (live.custom_atmstatus === 3 && !AUTOMATED_OK.has(cid)) {
      fs.appendFileSync(BADLOG, JSON.stringify({ cid, skipped: true, reason: 'Automated — Rules 65/71', at: new Date().toISOString() }) + '\n');
      skipped++; log(`C${cid} SKIPPED — Automated`); continue;
    }
    const atmBefore = live.custom_atmstatus, titleBefore = live.title;

    // idempotent: already correct?
    let view = await readView(cid);
    let chk = checkView(cid, view);
    let didFix = false;
    if (chk.problems.length) {
      // apply deterministic HTML set, with retry on TestRail's transient DB deadlock rejection
      let saveErr = '';
      for (let attempt = 1; attempt <= 15; attempt++) {
        await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });
        await page.locator('#custom_preconds_display .fr-element').waitFor({ state: 'visible', timeout: 30000 });
        for (const f of ['custom_preconds', 'custom_steps', 'custom_expected']) {
          const html = fieldHtml(cid, f);
          const set = await page.evaluate(({ f, html }) => {
            const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display');
            if (!inst) return 'no-instance';
            inst.html.set(html);                 // updates Froala model + DOM (no keystroke autoformat)
            try { inst.undo.saveStep(); } catch (e) {}
            const backing = document.querySelector(`#${f}`);
            if (backing) { backing.value = inst.html.get(); backing.dispatchEvent(new Event('change', { bubbles: true })); }
            return inst.html.get().slice(0, 40);
          }, { f, html });
          if (set === 'no-instance') throw new Error(`Froala instance not found for ${f}`);
        }
        await page.waitForTimeout(400);
        if (await page.locator('#accept').isDisabled()) break;   // nothing to save (already applied)
        await page.click('#accept', { timeout: 30000 });
        await page.waitForLoadState('networkidle').catch(() => {});
        for (let w = 0; w < 60 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
        if (!/cases\/edit/.test(page.url())) { saveErr = ''; break; }   // redirected to view => saved
        // still on edit page: check for the transient deadlock and retry
        saveErr = await page.evaluate(() => {
          const e = [...document.querySelectorAll('.message-error')].map(x => (x.innerText || '').trim()).filter(Boolean);
          return e.join(' | ').slice(0, 200);
        });
        log(`C${cid} save attempt ${attempt} rejected (${saveErr || 'no message'}) — retrying`);
        await page.waitForTimeout(Math.min(2000 + 1500 * attempt, 15000));
      }
      didFix = true;
      view = await readView(cid);
      chk = checkView(cid, view);
      if (saveErr) chk.problems.push(`save rejected: ${saveErr}`);
    }

    // post checks: atm + title unchanged
    const [, after] = await api(`get_case/${cid}`);
    if (after && after.custom_atmstatus !== atmBefore) chk.problems.push(`atmstatus ${atmBefore}->${after.custom_atmstatus}`);
    if (after && after.title !== titleBefore) chk.problems.push(`title changed`);

    if (chk.problems.length) {
      fs.appendFileSync(BADLOG, JSON.stringify({ cid, ok: false, didFix, problems: chk.problems, at: new Date().toISOString() }) + '\n');
      bad++; log(`C${cid} FAILED: ${chk.problems.join(' | ')}`);
    } else {
      fs.appendFileSync(OKLOG, JSON.stringify({ cid, ok: true, edited: didFix, atm: after ? after.custom_atmstatus : atmBefore, evidence: chk.evidence, at: new Date().toISOString() }) + '\n');
      if (didFix) { fixed++; log(`C${cid} FIXED (deterministic) — fr-view, numbers visible, marker last (atm=${after.custom_atmstatus})`); }
      else { ok++; log(`C${cid} already OK — fr-view, text matches`); }
    }
  } catch (e) {
    fs.appendFileSync(BADLOG, JSON.stringify({ cid, ok: false, error: String(e).slice(0, 300), at: new Date().toISOString() }) + '\n');
    bad++; log(`C${cid} ERROR ${String(e).slice(0, 160)}`);
  }
  await page.waitForTimeout(900);
}
log(`\nDONE — already-ok ${ok}, fixed ${fixed}, failed ${bad}, skipped ${skipped}`);
await browser.close();
