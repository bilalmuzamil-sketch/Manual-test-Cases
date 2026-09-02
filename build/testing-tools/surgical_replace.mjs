// SURGICAL REPLACE — change one exact string inside TestRail case fields and nothing else.
//
// WHY THIS EXISTS. The normal writer (apply_cases.mjs) clears a field and retypes it, which rebuilds
// the whole body. That is right when the body is being rewritten and wrong when a few characters are:
// it reshapes markup somebody else authored, and it risks the stale-snapshot problem on every field
// it touches. This edits the stored HTML in place through Froala's html.set (the recorded repair
// recipe), so the result is byte-identical apart from the replacement - and it PROVES that afterwards.
//
// SAFETY, all enforced rather than trusted:
//   * refuses unless the field contains the search string EXACTLY the expected number of times
//   * refuses any case whose custom_atmstatus is 3 unless it is on an explicit authorised list
//     (Rule 71), and never touches created_by = 1 (Vladimir) on any authorisation (Rule 38)
//   * after saving, re-reads via the API and asserts
//     after === before.replaceAll(from, to)  - so a stray edit cannot pass
//   * asserts atmstatus, section_id and refs are unchanged
//   * checks the served page still renders in `markdown fr-view`
//
// USAGE: node build/testing-tools/surgical_replace.mjs <plan.json>
//   plan.json = { "from": "...", "to": "...", "fields": ["custom_preconds","custom_steps"],
//                 "cases": [44964, ...], "authorised_automated": [], "expect_per_field": 1 }
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const { from, to, fields, cases } = plan;
const AUTH_OK = new Set((plan.authorised_automated || []).map(String));
const EXPECT = plan.expect_per_field ?? 1;
const HOST = 'https://shopview.testrail.io';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json', 'utf8'));
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const api = async p => { const r = await fetch(`${HOST}/index.php?/api/v2/${p}`,
  { headers: { Authorization: AUTH, 'Content-Type': 'application/json' } }); return [r.status, await r.json()]; };
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const OUTDIR = plan.outdir || '.';
const applied = `${OUTDIR}/APPLIED.jsonl`, failed = `${OUTDIR}/FAILED.jsonl`;
const done = new Set();
for (const f of [applied, failed]) if (fs.existsSync(f))
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) { try { const j = JSON.parse(l); if (j.cid) done.add(String(j.cid)); } catch (_) {} }

const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: `http://127.0.0.1:${port}` } });
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1200 } });
page.setDefaultTimeout(60000);
await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache', Pragma: 'no-cache' });
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', C.email); await page.fill('#password', UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { log('LOGIN FAILED'); await browser.close(); process.exit(2); }

let ok = 0, skip = 0, bad = 0;
for (const cid of cases) {
  if (done.has(String(cid))) { log(`C${cid} already checkpointed`); continue; }
  const [st, before] = await api(`get_case/${cid}`);
  if (st !== 200) { log(`C${cid} pre-GET ${st}`); bad++; continue; }
  if (before.created_by === 1) { log(`C${cid} SKIP - Vladimir Tomovic's case, never edited (Rule 38)`); skip++; continue; }
  if (before.custom_atmstatus === 3 && !AUTH_OK.has(String(cid))) {
    log(`C${cid} SKIP - Automated with no per-case go-ahead (Rule 71)`); skip++; continue; }
  const targets = fields.filter(f => (before[f] || '').includes(from));
  const counts = Object.fromEntries(targets.map(f => [f, (before[f].split(from).length - 1)]));
  if (!targets.length) { log(`C${cid} SKIP - the search string is not in any named field`); skip++; continue; }
  const wrong = targets.filter(f => counts[f] !== EXPECT);
  if (wrong.length) { log(`C${cid} SKIP - ${JSON.stringify(counts)} != ${EXPECT} per field`); skip++; continue; }

  await page.goto(`${HOST}/index.php?/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.goto(`${HOST}/index.php?/cases/edit/${cid}&_cb=${Date.now()}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const res = await page.evaluate(([flds, f0, t0, expect]) => {
    const out = {};
    for (const f of flds) {
      const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel && i.$oel[0] && i.$oel[0].id === f + '_display');
      if (!inst) { out[f] = 'no editor'; continue; }
      const cur = inst.html.get();
      const n = cur.split(f0).length - 1;
      if (n === 0) { out[f] = 'absent'; continue; }
      if (n !== expect) { out[f] = `found ${n}, expected ${expect}`; continue; }
      inst.html.set(cur.split(f0).join(t0));
      // 🛑 MAKE THE CHANGE REGISTER. html.set updates Froala's model and the DOM but does not by
      // itself tell TestRail's form that anything changed, so #accept can stay DISABLED - and a
      // forced click on a disabled Save is REFUSED (the page stays on the edit form and shows its
      // latent "Title is too long" template, which is not a real error). So fire Froala's own
      // contentChanged event and an input/change on the backing element, then click normally and let
      // Playwright wait for the button to be enabled. Measured 2026-09-02: without this, ten cases in
      // a row reported "save disabled - already matches" and saved nothing.
      try { inst.undo.saveStep(); } catch (e) {}
      try { inst.events.trigger('contentChanged'); } catch (e) {}
      try {
        const el = inst.$oel && inst.$oel[0];
        if (el) for (const t of ['input', 'change', 'keyup'])
          el.dispatchEvent(new Event(t, { bubbles: true }));
      } catch (e) {}
      out[f] = 'replaced';
    }
    return out;
  }, [targets, from, to, EXPECT]);
  if (!Object.values(res).some(v => v === 'replaced')) {
    log(`C${cid} nothing replaced: ${JSON.stringify(res)}`); skip++; continue; }

  // 🛑 DO NOT SKIP ON A DISABLED SAVE BUTTON. Froala's html.set updates the editor's model and the
  // DOM but does NOT mark TestRail's form dirty, so #accept stays disabled even though the content
  // has genuinely changed - and clicking it saves anyway (proven on C45254). An earlier version of
  // this script read "disabled" as "already matches", skipped the click, and then failed its own
  // verification on ten cases in a row because nothing had been saved.
  {
    // A normal click, NOT forced: Playwright waits for #accept to become enabled, which is the signal
    // that the change registered. A forced click on a disabled Save is refused by TestRail.
    await page.click('#accept'); await page.waitForLoadState('networkidle');
    for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
    for (let dl = 0; dl < 3 && /cases\/edit/.test(page.url()); dl++) {
      const isDeadlock = await page.evaluate(() => /Deadlock found when trying to get lock/.test(document.body?.innerText || ''));
      if (!isDeadlock) break;
      log(`C${cid} deadlock - retry ${dl + 1}/3`);
      await page.waitForTimeout(3000 * (dl + 1));
      await page.click('#accept').catch(() => {}); await page.waitForLoadState('networkidle');
      for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
    }
    if (/cases\/edit/.test(page.url())) {
      const diag = await page.evaluate(() => [...document.querySelectorAll('.message-error,.error,[class*="error"]')]
        .map(e => (e.innerText || '').trim()).filter(Boolean).slice(0, 3));
      fs.appendFileSync(failed, JSON.stringify({ cid, error: 'still on edit page', diag }) + '\n');
      log(`C${cid} FAILED: still on the edit page ${JSON.stringify(diag)}`); bad++; continue;
    }
  }
  // VERIFY: byte-identical apart from the replacement
  const [st2, after] = await api(`get_case/${cid}`);
  const problems = [];
  for (const f of targets) {
    const want = before[f].split(from).join(to);
    if (after[f] !== want) problems.push(`${f} is not exactly the expected replacement`);
  }
  for (const f of fields.filter(f => !targets.includes(f)))
    if ((after[f] || '') !== (before[f] || '')) problems.push(`${f} changed but should not have`);
  if (after.custom_atmstatus !== before.custom_atmstatus) problems.push('atmstatus changed');
  if (after.section_id !== before.section_id) problems.push('section changed');
  if ((after.refs || null) !== (before.refs || null)) problems.push('refs changed');
  const view = await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil: 'networkidle' })
    .then(() => page.evaluate(() => [...document.querySelectorAll('div[class^="markdown"]')]
      .filter(d => !d.id).map(d => d.className.trim())));
  if (view.some(c => !c.includes('fr-view'))) problems.push(`a field is not in fr-view: ${JSON.stringify(view)}`);
  if (problems.length) { fs.appendFileSync(failed, JSON.stringify({ cid, problems }) + '\n');
    log(`C${cid} VERIFY FAILED: ${problems.join('; ')}`); bad++; continue; }
  fs.appendFileSync(applied, JSON.stringify({ cid, fields: targets, res, at: new Date().toISOString() }) + '\n');
  ok++; log(`C${cid} OK (${targets.join(', ')})  ${ok}/${cases.length}`);
}
log(`DONE applied=${ok} skipped=${skip} failed=${bad}`);
await browser.close();
