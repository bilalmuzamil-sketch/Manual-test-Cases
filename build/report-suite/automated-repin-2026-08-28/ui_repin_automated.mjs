// UI re-pin of the 37 AUTOMATED Report Suite cases — TestRail web editor
// driven by Playwright. Approved by the QA lead 2026-08-28.
//
// Built on the PROVEN harness of build/report-suite/damage-2026-08-26/ui_repair_batch.mjs and
// keeps both of its hard-won fixes:
//   (a) a NAVIGATION POLL after Save instead of a fixed wait (a fixed 1500 ms raced the redirect);
//   (b) NO-CACHE headers and a fresh navigation per case, because the edit form's one-shot token
//       rotates — a cached form POSTs a stale token and the save is SILENTLY REJECTED.
//
// ONE DELIBERATE DIFFERENCE from the repair script, and the reason for it:
// the repair script cleared each field and re-pasted the whole intended body, because the body
// itself was damaged. Here the body is CORRECT and only the cited specification version changes.
// Clearing and re-pasting a body that is stored as <ol><li> would flatten it into plain numbered
// lines — a visible change to a tester and a breach of "every other character stays as it is".
// So this script makes a SURGICAL edit: it places a DOM Range over the version number itself
// inside the editor, then types the new number over that selection. Nothing else in the field is
// ever selected, deleted or re-typed, so no other character can move.
//
// Per case: re-GET custom_atmstatus and REQUIRE 3 (Automated), read the rendered page BEFORE,
// edit, Save, then verify by API re-GET AND by re-reading the rendered page.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const DIR = '/home/user/Manual-test-Cases/build/report-suite/automated-repin-2026-08-28';
const DONE = `${DIR}/UI-REPINNED.jsonl`;
const FAILED = `${DIR}/UI-FAILED.jsonl`;
const PLAN = `${DIR}/ui-plan.json`;
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));

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

// What the tester actually reads, normalised so that only REAL wording differences show up.
const base = s => (s || '')
  .replace(/ /g, ' ')
  .replace(/\r\n/g, '\n')
  .split('\n').map(l => l.trim()).join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();
// ...and with any list-marker difference removed. A UI save can turn a manually numbered line
// ("1. text") into a real HTML list item (marker rendered by the browser, dropped from innerText).
// Same words either way, so that difference is stripped before the wording comparison and is
// reported separately.
const norm = s => base(s).split('\n').map(l => l.replace(/^(\d+[.)]\s+|[•▪-]\s+)/, '')).join('\n');
const ordinals = s => base(s).split('\n').filter(l => /^\d+[.)]\s+/.test(l)).length;

const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const ENTITY = /&(mdash|rsquo|lsquo|ldquo|rdquo|amp|lt|gt|nbsp|#\d+);/;
const FIELDS = ['custom_preconds', 'custom_steps', 'custom_expected'];

const done = new Set();
for (const f of [DONE, FAILED]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && (j.ok || j.skipped)) done.add(String(j.cid)); } catch (_) {}
  }
}

const LIMIT = Number(process.env.LIMIT || 0);
let queue = plan.map(p => String(p.cid)).filter(c => !done.has(c));
if (LIMIT > 0) queue = queue.slice(0, LIMIT);
const byCid = Object.fromEntries(plan.map(p => [String(p.cid), p]));
log(`queued ${queue.length} of ${plan.length} (already checkpointed: ${done.size})`);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'],
  proxy: { server: `http://127.0.0.1:${port}` },
});
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1400 } });
page.setDefaultTimeout(60000);
await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' });
let lastPost = null;
page.on('response', r => {
  if (r.request().method() === 'POST' && /cases\/(edit|update|save)/.test(r.url())) {
    lastPost = `${r.status()} ${r.url().slice(0, 120)}`;
  }
});

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
  // in document order: preconditions, steps, expected result (proven 2026-08-26).
  return await page.evaluate(() => {
    const ds = [...document.querySelectorAll('div[class^="markdown"]')].filter(d => !d.id);
    const out = { _count: ds.length };
    ['custom_preconds', 'custom_steps', 'custom_expected'].forEach((f, i) => {
      if (ds[i]) out[f] = { cls: ds[i].className.trim(), text: ds[i].innerText, html: ds[i].innerHTML };
    });
    return out;
  });
}

let ok = 0, bad = 0, skipped = 0;
for (const cid of queue) {
  const p = byCid[cid];
  const tokOld = `specification version ${p.old}`;
  const tokNew = `specification version ${p.live}`;
  try {
    // ---- RULE 71 GATE, immediately before the write ----
    const [st, before] = await api(`get_case/${cid}`);
    if (st !== 200) throw new Error(`pre-GET HTTP ${st}`);
    // Rule 71 gate, INVERTED under Vlad's 2026-08-28 go-ahead (he checked C30287 and reported
    // the update "has not changed the formatting and it still looks good on that case").
    // These cases MUST still be Automated; anything else means the case moved under us -> STOP.
    if (before.custom_atmstatus !== 3) throw new Error(`custom_atmstatus is ${JSON.stringify(before.custom_atmstatus)}, expected 3 (Automated)`);
    const stored = before.custom_expected || '';
    if ((stored.match(new RegExp(tokOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1)
      throw new Error(`"${tokOld}" does not appear exactly once in the stored Expected Result`);
    if (stored.includes(tokNew)) throw new Error(`the case already mentions "${tokNew}" — ambiguous`);

    const pre = await readView(cid);
    if (pre._count !== 3) throw new Error(`expected 3 case-text containers before the write, found ${pre._count}`);
    const preText = {}; for (const f of FIELDS) preText[f] = pre[f] ? pre[f].text : '';
    if ((preText.custom_expected.match(new RegExp(tokOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1)
      throw new Error(`the RENDERED Expected Result does not show "${tokOld}" exactly once`);

    // ---- THE SURGICAL EDIT ----
    await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });
    const ed = page.locator('#custom_expected_display .fr-element');
    await ed.waitFor({ state: 'visible', timeout: 30000 });
    await ed.click();
    const sel = await page.evaluate(({ tokOld, oldv }) => {
      const root = document.querySelector('#custom_expected_display .fr-element');
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const hits = [];
      let n;
      while ((n = walker.nextNode())) {
        let i = -1;
        while ((i = n.nodeValue.indexOf(tokOld, i + 1)) !== -1) hits.push({ node: n, i });
      }
      if (hits.length !== 1) return { err: `found ${hits.length} occurrences of the token in the editor` };
      const { node, i } = hits[0];
      const start = i + tokOld.length - String(oldv).length;
      const r = document.createRange();
      r.setStart(node, start);
      r.setEnd(node, start + String(oldv).length);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      return { selected: s.toString() };
    }, { tokOld, oldv: p.old });
    if (sel.err) throw new Error(sel.err);
    if (sel.selected !== String(p.old)) throw new Error(`selection is ${JSON.stringify(sel.selected)}, not ${JSON.stringify(String(p.old))}`);
    await page.keyboard.insertText(String(p.live));   // types over the selection only

    const edText = await ed.innerText();
    if (!edText.includes(tokNew)) throw new Error('the editor does not show the new version after the edit');
    if (edText.includes(tokOld)) throw new Error('the editor still shows the old version after the edit');

    await page.waitForTimeout(400);
    lastPost = null;
    if (await page.locator('#accept').isDisabled()) throw new Error('Save is disabled — the editor did not register the edit');
    await page.click('#accept', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
    if (/cases\/edit/.test(page.url())) throw new Error(`still on the edit page after Save (save POST: ${lastPost || 'none observed'})`);

    // ---- VERIFY, on the RENDERED page ----
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    const problems = [];
    if (after.custom_atmstatus !== 3) problems.push(`custom_atmstatus is no longer 3 (Automated)`);
    if (after.custom_atmstatus !== before.custom_atmstatus) problems.push(`custom_atmstatus changed ${before.custom_atmstatus} -> ${after.custom_atmstatus}`);
    if (after.title !== before.title) problems.push('title changed');
    for (const k of ['refs', 'section_id', 'priority_id', 'type_id', 'estimate', 'milestone_id', 'template_id', 'custom_automation_type']) {
      if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) problems.push(`field ${k} changed`);
    }
    const post = await readView(cid);
    if (post._count !== 3) problems.push(`expected 3 case-text containers after the write, found ${post._count}`);
    const listEffect = [];
    for (const f of FIELDS) {
      const v = post[f];
      if (!v) { problems.push(`${f}: no container after the write`); continue; }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG visible to the tester`);
      if (ENTITY.test(v.text)) problems.push(`${f}: HTML entity visible to the tester`);
      const want = norm(f === 'custom_expected' ? preText[f].split(tokOld).join(tokNew) : preText[f]);
      const got = norm(v.text);
      if (got !== want) {
        const i = [...want].findIndex((ch, k) => ch !== got[k]);
        problems.push(`${f}: rendered wording changed at char ${i}: want ${JSON.stringify(want.slice(Math.max(0, i - 40), i + 40))} got ${JSON.stringify(got.slice(Math.max(0, i - 40), i + 40))}`);
      }
      const o1 = ordinals(preText[f]), o2 = ordinals(v.text);
      if (o1 !== o2) listEffect.push(`${f}: ${o1} manually numbered lines -> ${o2} (converted to an HTML numbered list)`);
    }
    // the pin itself
    const pt = post.custom_expected ? post.custom_expected.text : '';
    if (!pt.includes(tokNew)) problems.push(`the rendered Expected Result does not cite "${tokNew}"`);
    if (pt.includes(tokOld)) problems.push(`the rendered Expected Result still cites "${tokOld}"`);
    // AUTOMATION marker: present, exactly once, and LAST
    const lines = base(pt).split('\n').filter(l => l.trim());
    const marks = lines.filter(l => l.startsWith('AUTOMATION:'));
    if (marks.length !== 1) problems.push(`AUTOMATION marker appears ${marks.length} times`);
    if ((lines[lines.length - 1] || '') !== marks[0]) problems.push(`AUTOMATION marker is not the last line (last is ${JSON.stringify((lines[lines.length - 1] || '').slice(0, 60))})`);
    if (!/This is the expected behaviour|Specification version|expectation has not been checked/.test(pt)) problems.push('provenance line missing');
    if (problems.length) throw new Error(problems.join(' | '));

    fs.appendFileSync(DONE, JSON.stringify({
      cid, ok: true, report: p.report, pin: `${p.old}->${p.live}`, category: p.category,
      atm: after.custom_atmstatus,
      containers: FIELDS.map(f => `${f}=${post[f].cls}`).join(' '),
      containers_before: FIELDS.map(f => `${f}=${pre[f].cls}`).join(' '),
      numbered_list_side_effect: listEffect,
      verified: 'rendered page re-read: zero literal tags, zero visible entities, wording otherwise byte-identical to before, new version cited, AUTOMATION marker present once and last, custom_atmstatus and title unchanged',
      link: `${HOST}/index.php?/cases/view/${cid}`, at: new Date().toISOString(),
    }) + '\n');
    ok++;
    log(`C${cid} RE-PINNED ${p.report} v${p.old}->v${p.live}${listEffect.length ? '  [list side effect]' : ''} — ${ok}/${queue.length}`);
  } catch (e) {
    bad++;
    fs.appendFileSync(FAILED, JSON.stringify({ cid, ok: false, error: String(e).slice(0, 1500), at: new Date().toISOString() }) + '\n');
    log(`C${cid} FAILED: ${String(e).slice(0, 400)}`);
    log('*** STOPPING THE WHOLE RUN — a case came back wrong ***');
    break;
  }
}

log(`DONE repinned=${ok} failed=${bad} skipped=${skipped}`);
fs.writeFileSync(`${DIR}/UI-BATCH-STATUS.txt`, `repinned=${ok} failed=${bad} skipped=${skipped} queued=${queue.length} finished=${new Date().toISOString()}\n`);
await browser.close();
process.exit(bad ? 3 : 0);
