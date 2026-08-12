// read_dialog.cjs — generic: load a page, run a scripted click sequence, harvest
// every visible label as a RAW TEXT NODE with its CSS text-transform.
//
//   node read_dialog.cjs <tag> <path> '<json click plan>'
//
// click plan = [{find:"text to locate", scope:"tr|button|*", nth:0}, ...]
// Each step scrolls the match into view before a coordinate click (a click at a
// coordinate below the fold lands on nothing — a trap already recorded here).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const TAG = process.argv[2] || 'dlg';
const PATHNAME = process.argv[3] || '/administration/roles-permissions';
const PLAN = JSON.parse(process.argv[4] || '[]');
const SCOPE_SEL = process.argv[5] || '.q-dialog__inner, .q-menu, [role=dialog]';

const HARVEST = (sel) => `(() => {
  const scope = document.querySelector(${JSON.stringify(sel)}) || document.body;
  const scoped = !!document.querySelector(${JSON.stringify(sel)});
  const out = [];
  const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.nodeValue; if (!t || !t.trim()) continue;
    const p = n.parentElement; if (!p) continue;
    const cs = getComputedStyle(p);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    out.push({ raw: t.trim(), transform: cs.textTransform });
  }
  const ctrls = [];
  scope.querySelectorAll('button,input,label,.q-toggle,.q-checkbox,[role=button],.q-item,.q-tab').forEach(el => {
    const cs = getComputedStyle(el); if (cs.display === 'none') return;
    ctrls.push({ tag: el.tagName.toLowerCase(), raw_text: (el.textContent||'').trim().slice(0,140),
      aria: el.getAttribute('aria-label'), testid: el.getAttribute('data-test-id')||el.getAttribute('data-testid'),
      transform: cs.textTransform, disabled: el.disabled===true||el.getAttribute('aria-disabled')==='true' });
  });
  return { scoped, nodes: out, controls: ctrls };
})()`;

(async () => {
  const h = await makeHarness(TAG);
  const page = h.page;
  const log = [];
  await page.goto(APP + PATHNAME, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);

  for (const step of PLAN) {
    const sel = step.scope || '*';
    const r = await page.evaluate(({ find, sel, nth }) => {
      const els = Array.from(document.querySelectorAll(sel === '*' ? 'button,tr,div,span,i,td,a,label,.q-item' : sel));
      const hits = els.filter(e => (e.innerText || e.textContent || '').includes(find));
      // prefer the innermost match so we click the control, not its container
      const inner = hits.filter(e => !hits.some(o => o !== e && e.contains(o)));
      const pick = (inner.length ? inner : hits)[nth || 0];
      if (!pick) return { ok: false, find, candidates: hits.length };
      pick.scrollIntoView({ block: 'center' });
      const rc = pick.getBoundingClientRect();
      return { ok: true, find, x: rc.x + rc.width / 2, y: rc.y + rc.height / 2, text: (pick.innerText || '').replace(/\s+/g, ' ').slice(0, 120) };
    }, { find: step.find, sel, nth: step.nth });
    log.push(r);
    if (r.ok) { await page.waitForTimeout(900); await page.mouse.click(r.x, r.y); await page.waitForTimeout(step.wait || 5000); }
    else break;
  }

  const harvest = await page.evaluate(HARVEST(SCOPE_SEL)).catch(e => ({ error: String(e) }));
  await page.screenshot({ path: `${OUT}/${TAG}.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({
    path: PATHNAME, plan: PLAN, steps: log, scope_selector: SCOPE_SEL, harvest,
    api_errors: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors,
    read_at_utc: new Date().toISOString()
  }, null, 2));
  console.log('STEPS:', JSON.stringify(log).slice(0, 500));
  console.log('SCOPED:', harvest.scoped, ' nodes:', (harvest.nodes || []).length);
  (harvest.nodes || []).forEach(n => console.log('  ' + JSON.stringify(n.raw) + (n.transform !== 'none' ? '  [' + n.transform + ']' : '')));
  await h.browser.close();
})();
