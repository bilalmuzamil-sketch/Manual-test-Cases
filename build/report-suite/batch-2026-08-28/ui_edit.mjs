// Approved edits applied through the TestRail WEB EDITOR — the only safe route for a case
// whose field is served by the bare `markdown` container (that container ESCAPES stored HTML,
// so an API write puts its own <p> wrapper on the tester's screen as literal text; that is
// what damaged 72 cases on 2026-08-26).
//
// Built on the proven harness (damage-2026-08-26/ui_repair_batch.mjs -> repin-2026-08-28/
// ui_repin_batch.mjs) and keeps both of its hard-won fixes:
//   (a) a NAVIGATION POLL after Save instead of a fixed wait;
//   (b) NO-CACHE headers and a fresh navigation per case — the edit form's one-shot token
//       rotates, and a cached form POSTs a stale token whose save is SILENTLY REJECTED.
//
// THE EDIT IS SURGICAL. For every {find, replace} the script places a DOM Range over exactly
// the `find` text inside the editor and types the replacement over that selection. Nothing
// else in the field is ever selected, deleted or re-typed, so no other character can move.
// A clear-and-re-paste would flatten <ol><li> bodies into plain numbered lines.
//
// Per case: re-read custom_atmstatus live and hold it against the plan's expectation
// (Rules 65/71), read the RENDERED page BEFORE, edit, Save, then verify by API re-GET AND by
// re-reading the RENDERED page. The run STOPS DEAD on the first case that comes back wrong.
//
// Usage: node ui_edit.mjs <plan.json> <done.jsonl> <failed.jsonl>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const [PLANF, DONE, FAILED] = process.argv.slice(2);
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json', 'utf8'));
const HOST = 'https://shopview.testrail.io';
const API = `${HOST}/index.php?/api/v2`;
const AUTH = 'Basic ' + Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const plan = JSON.parse(fs.readFileSync(PLANF, 'utf8'));
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

// What the tester actually reads, normalised so only REAL wording differences surface.
const base = s => (s || '').replace(/ /g, ' ').replace(/\r\n/g, '\n')
  .split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
// ...and with list markers stripped: a UI save can turn a manually numbered line ("1. text")
// into a real HTML list item, whose marker the browser renders but innerText drops. Same
// words either way, so that difference is removed before the comparison and reported apart.
const norm = s => base(s).split('\n').map(l => l.replace(/^(\d+[.)]\s+|[•▪-]\s+)/, '')).join('\n');
const ordinals = s => base(s).split('\n').filter(l => /^\d+[.)]\s+/.test(l)).length;

const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const ENTITY = /&(mdash|rsquo|lsquo|ldquo|rdquo|amp|lt|gt|nbsp|#\d+);/;
const FIELDS = ['custom_preconds', 'custom_steps', 'custom_expected'];
const EDITOR = { custom_preconds: '#custom_preconds_display', custom_steps: '#custom_steps_display', custom_expected: '#custom_expected_display' };

const done = new Set();
for (const f of [DONE, FAILED]) {
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { const j = JSON.parse(line); if (j.cid && j.ok) done.add(String(j.cid)); } catch (_) {}
  }
}
const queue = plan.filter(p => !done.has(String(p.cid)));
log(`queued ${queue.length} of ${plan.length} (already checkpointed clean: ${done.size})`);

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'],
  proxy: { server: `http://127.0.0.1:${port}` },
});
const page = await browser.newPage({ ignoreHTTPSErrors: true, viewport: { width: 1500, height: 1400 } });
page.setDefaultTimeout(60000);
await page.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache', Pragma: 'no-cache' });
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil: 'domcontentloaded' });
await page.fill('#name', C.email);
await page.fill('#password', C.password);
await page.click('#button_primary');
await page.waitForLoadState('networkidle');
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

let ok = 0, bad = 0;
for (const p of queue) {
  const cid = String(p.cid), field = p.field || 'custom_expected';
  try {
    // ---- the Rule 65/71 gate, re-proved immediately before the write ----
    const [st, before] = await api(`get_case/${cid}`);
    if (st !== 200) throw new Error(`pre-GET HTTP ${st}`);
    if (before.custom_atmstatus !== p.expect_atm)
      throw new Error(`custom_atmstatus is ${before.custom_atmstatus}, the plan expects ${p.expect_atm} — STOP`);

    const pre = await readView(cid);
    if (pre._count !== 3) throw new Error(`expected 3 case-text containers before the write, found ${pre._count}`);
    const preText = {}; for (const f of FIELDS) preText[f] = pre[f] ? pre[f].text : '';
    for (const e of p.edits) {
      const n = preText[field].split(e.find).length - 1;
      if (n !== 1) throw new Error(`the rendered ${field} shows ${JSON.stringify(e.find.slice(0, 50))} ${n} times, not once`);
    }

    // ---- the surgical edits ----
    await page.goto(`${HOST}/index.php?/cases/edit/${cid}`, { waitUntil: 'networkidle' });
    const ed = page.locator(`${EDITOR[field]} .fr-element`);
    await ed.waitFor({ state: 'visible', timeout: 30000 });
    await ed.click();
    for (const e of p.edits) {
      const sel = await page.evaluate(({ root, find }) => {
        const r0 = document.querySelector(root + ' .fr-element');
        const w = document.createTreeWalker(r0, NodeFilter.SHOW_TEXT);
        const hits = []; let n;
        while ((n = w.nextNode())) {
          let i = -1;
          while ((i = n.nodeValue.indexOf(find, i + 1)) !== -1) hits.push({ node: n, i });
        }
        if (hits.length !== 1) return { err: `found ${hits.length} single-text-node occurrences in the editor` };
        const { node, i } = hits[0];
        const r = document.createRange();
        r.setStart(node, i); r.setEnd(node, i + find.length);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        return { selected: s.toString() };
      }, { root: EDITOR[field], find: e.find });
      if (sel.err) throw new Error(`${JSON.stringify(e.find.slice(0, 45))}: ${sel.err}`);
      if (sel.selected !== e.find) throw new Error(`selection is ${JSON.stringify(sel.selected.slice(0, 60))}, not the find string`);
      await page.keyboard.insertText(e.replace);
    }
    const edText = await ed.innerText();
    for (const e of p.edits) {
      if (!edText.includes(e.replace)) throw new Error(`the editor does not show ${JSON.stringify(e.replace.slice(0, 45))} after the edit`);
      // An APPEND edit keeps the find text inside its own replacement (e.g. adding a
      // sentence after "Last checked against build …"), so "the old text is gone" is only
      // a meaningful assertion when the replacement does not contain it.
      if (!e.replace.includes(e.find) && edText.includes(e.find))
        throw new Error(`the editor still shows ${JSON.stringify(e.find.slice(0, 45))} after the edit`);
    }

    await page.waitForTimeout(400);
    if (await page.locator('#accept').isDisabled()) throw new Error('Save is disabled — the editor did not register the edit');
    await page.click('#accept', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    for (let w = 0; w < 40 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500);
    if (/cases\/edit/.test(page.url())) throw new Error('still on the edit page after Save');

    // ---- verify, on the RENDERED page ----
    const [st2, after] = await api(`get_case/${cid}`);
    if (st2 !== 200) throw new Error(`post-GET HTTP ${st2}`);
    const problems = [];
    if (after.custom_atmstatus !== before.custom_atmstatus)
      problems.push(`custom_atmstatus changed ${before.custom_atmstatus} -> ${after.custom_atmstatus}`);
    for (const k of ['title', 'refs', 'section_id', 'priority_id', 'type_id', 'estimate', 'milestone_id', 'template_id', 'custom_automation_type'])
      if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) problems.push(`field ${k} changed`);
    const post = await readView(cid);
    if (post._count !== 3) problems.push(`expected 3 case-text containers after the write, found ${post._count}`);
    const listEffect = [];
    for (const f of FIELDS) {
      const v = post[f];
      if (!v) { problems.push(`${f}: no container after the write`); continue; }
      if (LITERAL.test(v.text)) problems.push(`${f}: LITERAL TAG visible to the tester`);
      if (ENTITY.test(v.text)) problems.push(`${f}: HTML entity visible to the tester`);
      let want = preText[f];
      if (f === field) for (const e of p.edits) want = want.split(e.find).join(e.replace);
      if (norm(v.text) !== norm(want)) {
        const a = norm(want), b = norm(v.text);
        const i = [...a].findIndex((ch, k) => ch !== b[k]);
        problems.push(`${f}: rendered wording differs at char ${i}: want ${JSON.stringify(a.slice(Math.max(0, i - 50), i + 50))} got ${JSON.stringify(b.slice(Math.max(0, i - 50), i + 50))}`);
      }
      const o1 = ordinals(preText[f]), o2 = ordinals(v.text);
      if (o1 !== o2) listEffect.push(`${f}: ${o1} manually numbered lines -> ${o2} (converted to an HTML numbered list)`);
    }
    const pt = post.custom_expected ? post.custom_expected.text : '';
    const lines = base(pt).split('\n').filter(l => l.trim());
    const marks = lines.filter(l => l.startsWith('AUTOMATION:'));
    if (marks.length !== 1) problems.push(`AUTOMATION marker appears ${marks.length} times`);
    else if ((lines[lines.length - 1] || '') !== marks[0]) problems.push('AUTOMATION marker is not the last line');
    if (!/This is the expected behaviour|expectation has not been checked/.test(pt)) problems.push('provenance line missing');
    if (problems.length) throw new Error(problems.join(' | '));

    fs.appendFileSync(DONE, JSON.stringify({
      cid: Number(cid), ok: true, field, why: p.why, atm: after.custom_atmstatus,
      edits: p.edits.map(e => `${e.find.slice(0, 70)} -> ${e.replace.slice(0, 70)}`),
      containers_before: FIELDS.map(f => `${f}=${pre[f].cls}`).join(' '),
      containers_after: FIELDS.map(f => `${f}=${post[f].cls}`).join(' '),
      numbered_list_side_effect: listEffect,
      verified: 'rendered page re-read: zero literal tags, zero visible entities, wording otherwise identical to before, AUTOMATION marker present once and last, provenance present, custom_atmstatus and title unchanged',
      link: `${HOST}/index.php?/cases/view/${cid}`, at: new Date().toISOString(),
    }) + '\n');
    ok++;
    log(`C${cid} WRITTEN and VERIFIED${listEffect.length ? '  [list side effect]' : ''} — ${ok}/${queue.length}`);
  } catch (e) {
    bad++;
    fs.appendFileSync(FAILED, JSON.stringify({ cid: Number(cid), ok: false, error: String(e).slice(0, 1500), at: new Date().toISOString() }) + '\n');
    log(`C${cid} FAILED: ${String(e).slice(0, 500)}`);
    log('*** STOPPING THE WHOLE RUN — a case came back wrong ***');
    break;
  }
}
log(`DONE written=${ok} failed=${bad}`);
await browser.close();
process.exit(bad ? 3 : 0);
