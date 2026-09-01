// SUITE 6597 (Inline Add and Edit Parts) -- rewrite preconditions, steps and Expected Results
// through the TestRail WEB EDITOR, never the API.
//
// WHY THE UI HERE TOO, EVEN THOUGH THESE 118 CASES ALREADY RENDER CORRECTLY: a prior session
// repaired every one of them to <div class="markdown fr-view"> on 2026-08-31
// (build/inline-add-edit-parts/render-repair-2026-08-31/scan-final.json -- 118 scanned, 0 escaping).
// An API write would flip them straight back to the escaping container and the tester would read
// raw <br> tags. The editor is the only write path that preserves fr-view.
//
// WHAT IS BEING WRITTEN (see build_blocks.py for the per-transformation reasoning):
//   * the PROVISIONAL route hedge replaced with the route actually walked on sv9315
//   * the two permission preconditions given their real Settings -> Roles & Permissions click path
//   * state-only preconditions rewritten as the click that produces the state
//   * the build's own labels named (More options, Save Part, New/Edit Part Request, the close control)
//   * Rule-54 sentence 2 added ONLY on the cases this pass observed live; the marker lifted off
//     "Not available on Build to test Yet" now that the feature is demonstrably on the build
//
// PER-CASE build_sentence: unlike the Invoice pass this batch is MIXED -- 49 cases carry a build
// sentence and 67 must NOT (they are not verified yet, and inventing a build claim on them would be
// exactly the dishonesty Rule 12 exists to stop). So the sentence-2 assertion is per case, not
// per MODE.
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

const DIR = process.env.DIR || '/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-01/write-2026-09-01';
// MODE=ready  -> lift the marker to AUTOMATION: READY and require Rule-54 sentence 2 (the 53
//                build-verified cases).
// MODE=carry  -> RENDERING FIX ONLY: the existing marker is carried verbatim and NO build
//                sentence is added, because the case is NOT build-verified (the 56 unreadable
//                cases, QA lead authorised 2026-08-31). Verification asserts exactly that:
//                the marker must still equal what the pre-write snapshot held, and a build
//                sentence appearing would be a FAILURE, not a bonus.
const MODE = 'percase';
// the Rule-54 sentence-2 text is per-run: it names the build AND the date this pass checked it
const BUILD_SENTENCE = process.env.BUILD_SENTENCE || 'Last checked against build v26.35.6-598cc8a on 9/1/2026.';
const TAG = '';
const DONE = `${DIR}/APPLIED${TAG}.jsonl`;
const FAILED = `${DIR}/FAILED${TAG}.jsonl`;
const RUNFLAG = process.env.RUNFLAG || '/tmp/inlwrite/RUNNING';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
// The UI password has lived under two names/shapes across sessions and /tmp is ephemeral, so
// accept either rather than dying on a missing file:
//   /tmp/testrail/ui-creds.json  {ui_password}   (the 2026-08-31 pass)
//   /tmp/testrail/creds-ui.json  {password}      (the file that actually persists)
// NOTE creds.json's `password` is the API KEY, never the UI password - posting it silently lands
// you back on the login form, which is why the login is self-asserted below.
const U = (() => {
  for (const f of ['/tmp/testrail/ui-creds.json', '/tmp/testrail/creds-ui.json']) {
    if (!fs.existsSync(f)) continue;
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const pw = j.ui_password || j.password;
    if (pw) return { email: j.email, ui_password: pw, from: f };
  }
  console.log('NO UI PASSWORD FOUND (looked in /tmp/testrail/ui-creds.json and creds-ui.json) - STOP');
  process.exit(2);
})();
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const data = JSON.parse(fs.readFileSync(`${DIR}/intended-blocks${TAG}.json`, 'utf8'));
const snap = JSON.parse(fs.readFileSync(process.env.SNAPFILE || `${DIR}/PRE-snapshot.json`, 'utf8'));

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
fs.mkdirSync('/tmp/inlwrite', { recursive: true });
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
    // RULE 71: an Automated case is skipped unless the QA lead has given a go-ahead for THAT case.
    // The allow-list is an explicit, per-case file -- never a blanket flag -- so the gate still
    // stops every Automated case nobody authorised. Rule 65 duty is unchanged: each case written
    // here is reported to Vladimir Tomovic.
    const AUTHORISED = fs.existsSync(`${DIR}/automated-authorised.json`)
      ? new Set(JSON.parse(fs.readFileSync(`${DIR}/automated-authorised.json`, 'utf8')).map(String)) : new Set();
    if (live.custom_atmstatus === 3 && !AUTHORISED.has(String(cid))) {
      fs.appendFileSync(FAILED, JSON.stringify({ cid, skipped: true, reason: 'AUTOMATED (custom_atmstatus=3) — held for Vlad, Rules 65/71', at: new Date().toISOString() }) + '\n');
      skipped++; log(`C${cid} SKIPPED — Automated, not on the authorised list`); continue;
    }
    if (live.custom_atmstatus === 3) log(`C${cid} is AUTOMATED — writing under the QA lead's 2026-08-31 per-case go-ahead; Rule 65 report required`);

    // 🛑 THE STALE-SNAPSHOT GATE, added 2026-09-01 AFTER IT BIT. A payload is built from a snapshot;
    // between that snapshot and this write, a PERSON can edit the case in the TestRail UI. This
    // script's own verification compares the result to MY INTENDED TEXT, which is exactly the check
    // that cannot notice a reverted correction — so it reported 118 clean writes while two of them
    // (C44993, C44994) had silently put back a five-status wording a human had narrowed to three.
    // Found afterwards by build/handoff-2026-09-01/audit_clobbered.py against get_history_for_case.
    // ⇒ Compare the LIVE field to the snapshot NOW, and refuse rather than overwrite. Set
    // ALLOW_STALE=1 only when the divergence has been read and the overwrite is deliberate.
    if (!process.env.ALLOW_STALE) {
      const nrm = x => (x || '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      const before = (snap[cid] && snap[cid].before) || {};
      const drifted = fields.filter(f => f in before && nrm(before[f]) !== nrm(live[f]));
      if (drifted.length) {
        const detail = drifted.map(f =>
          `${f}: snapshot ${JSON.stringify(nrm(before[f]).slice(0, 140))} vs live ${JSON.stringify(nrm(live[f]).slice(0, 140))}`).join(' || ');
        fs.appendFileSync(FAILED, JSON.stringify({ cid, skipped: true,
          reason: 'STALE SNAPSHOT — the case changed after the payload was built; refusing to overwrite',
          drifted, detail, at: new Date().toISOString() }) + '\n');
        skipped++;
        log(`C${cid} SKIPPED — changed since the snapshot (${drifted.join(', ')}). Re-build the payload, or set ALLOW_STALE=1 if the overwrite is intended.`);
        continue;
      }
    }
    const atmBefore = live.custom_atmstatus, secBefore = live.section_id, refsBefore = live.refs || null;

    // 🛑 THE EDIT FORM'S ONE-SHOT TOKEN. It rotates after every successful save, so a CACHED edit
    // page POSTs a stale token and TestRail silently rejects the save -- the browser just stays on
    // the edit page (save POST 302, no navigation). Cache-Control/Pragma headers alone were not
    // enough: measured 5 failures in 11 writes. A unique query param per attempt makes the URL
    // itself uncacheable, which is the only thing that reliably forces a fresh token.
    // The failures ALTERNATE with successes, which rules out HTTP caching (a cache-busting query
    // param changed nothing) and points at the editor's own client-side token state: a successful
    // save consumes the token, and the next edit page opened in the same tab can come up holding
    // the consumed one. So load a neutral page first, then the edit form -- the form is then
    // always minted fresh by the server rather than restored from the previous case's state.
    await page.goto(`${HOST}/index.php?/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.goto(`${HOST}/index.php?/cases/edit/${cid}&_cb=${Date.now()}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
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
      if (/cases\/edit/.test(page.url())) {
        // A DEADLOCK IS RETRYABLE AND IT IS THE COMMON CASE HERE. TestRail answers
        // "Deadlock found when trying to get lock; try restarting transaction" under concurrent
        // writes; the "Title is too long" that appears alongside it is a LATENT DOM TEMPLATE, not a
        // live error (established 2026-08-31 on the Invoice suite). So look for the deadlock text
        // and simply save again, up to three times, before treating the case as failed.
        for (let dl = 0; dl < 3; dl++) {
          const isDeadlock = await page.evaluate(() =>
            /Deadlock found when trying to get lock/.test(document.body?.innerText || '')
            || [...document.querySelectorAll('.message-error, .error, [class*="error"]')]
                 .some(e => /Deadlock found/.test(e.innerText || '')));
          if (!isDeadlock) break;
          log(`C${cid} deadlock on save — retrying (${dl + 1}/3)`);
          await page.waitForTimeout(3000 * (dl + 1));
          await page.click('#accept', { timeout: 30000 }).catch(() => {});
          await page.waitForLoadState('networkidle');
          for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
          if (!/cases\/edit/.test(page.url())) break;
        }
      }
      if (/cases\/edit/.test(page.url())) {
        // Two identical failures on one case is not the token race - capture what the page is
        // actually saying before calling it a retryable flake (skill 03 s8.0-a).
        const diag = await page.evaluate(() => ({
          errors: [...document.querySelectorAll('.message-error, .error, [class*="error"]')]
            .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 5),
          title: document.title,
        })).catch(() => null);
        throw new Error(`still on the edit page after Save (save POST: ${lastPost || 'none observed'}) diag=${JSON.stringify(diag)}`);
      }
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
    // A per-case marker_override lets one batch carry both READY cases and HOLD cases (e.g. the
    // customer-portal cases, which are staging-only) while the verification stays EXACT per case:
    // whatever the override says is what must be on the page, character for character.
    const wantMarker = rec.marker_override;
    if (last !== wantMarker) problems.push(`marker is not ${JSON.stringify(wantMarker)} and last: ${JSON.stringify(last.slice(0, 70))}`);
    const nmark = lines.filter(l => l.startsWith('AUTOMATION:')).length;
    if (nmark !== 1) problems.push(`AUTOMATION marker count = ${nmark}`);
    if (/Not available on Build/.test(view.custom_expected.text)) problems.push('the deferred marker text is still present');
    // Rule 54: sentence 1 carried byte-for-byte, sentence 2 present, NEVER merged
    const wantS1 = norm(snap[cid].provenance[0].replace(/&amp;/g, '&').replace(/&mdash;/g, '—'));
    const s1 = lines.filter(l => l.startsWith('This is the expected behaviour'));
    const s2 = lines.filter(l => l.startsWith('Last checked against build'));
    if (s1.length !== 1) problems.push(`provenance sentence 1 count = ${s1.length}`);
    else if (norm(s1[0]) !== wantS1) problems.push(`provenance sentence 1 was altered`);
    // PER CASE: a build sentence is required exactly where this pass observed the case live, and
    // FORBIDDEN everywhere else. A sentence appearing on a PENDING case is a failure, not a bonus.
    if (rec.build_sentence) {
      if (s2.length !== 1) problems.push(`build sentence count = ${s2.length} (this case IS build-verified)`);
      else if (s2[0] !== rec.build_sentence) problems.push(`build sentence wrong: ${JSON.stringify(s2[0])}, wanted ${JSON.stringify(rec.build_sentence)}`);
    } else if (s2.length !== 0) {
      problems.push(`a build sentence appeared on a case that is NOT build-verified: ${JSON.stringify(s2)}`);
    }
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
