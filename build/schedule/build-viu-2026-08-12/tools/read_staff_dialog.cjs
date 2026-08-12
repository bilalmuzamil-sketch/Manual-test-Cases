// read_staff_dialog.cjs — open Edit Staff Member for a NON-admin technician and
// read every label as a RAW TEXT NODE (these panels use CSS text-transform, so a
// screenshot or .innerText can not settle casing).  Nothing is saved.
//
// admin@shopview.com is NEVER the target: editing that staff record invalidates
// the session instantly and has already cost this workspace one session.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const TARGET_NAME = process.argv[2] || 'MQ Test Tech';   // a technician, not Admin
const TAG = process.argv[3] || 'staff-dialog';

// Raw-text-node harvester: walks the DOM and returns each text node's exact
// characters, plus the CSS text-transform actually in force on its parent, so
// the difference between what is stored and what is painted is visible.
const HARVEST = `(() => {
  const dlg = document.querySelector('.q-dialog__inner, [role=dialog]') || document.body;
  const out = [];
  const w = document.createTreeWalker(dlg, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.nodeValue;
    if (!t || !t.trim()) continue;
    const p = n.parentElement;
    if (!p) continue;
    const cs = getComputedStyle(p);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    out.push({ raw: t.trim(), transform: cs.textTransform, tag: p.tagName.toLowerCase(),
               cls: (p.className && p.className.baseVal !== undefined ? '' : String(p.className||'')).slice(0,90) });
  }
  // controls carry their own labels/attributes
  const ctrls = [];
  dlg.querySelectorAll('button, input, label, .q-toggle, .q-checkbox, [role=button], .q-tab, .q-item').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    ctrls.push({
      tag: el.tagName.toLowerCase(),
      raw_text: (el.textContent || '').trim().slice(0, 160),
      aria: el.getAttribute('aria-label'),
      placeholder: el.getAttribute('placeholder'),
      testid: el.getAttribute('data-test-id') || el.getAttribute('data-testid'),
      transform: cs.textTransform,
      disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true'
    });
  });
  return { nodes: out, controls: ctrls };
})()`;

(async () => {
  const h = await makeHarness(TAG);
  const page = h.page;
  const steps = [];
  await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);

  // find the row for the target technician and click its edit control.
  // NOTE: scrollIntoViewIfNeeded FIRST — a coordinate click against a row below
  // the fold lands on nothing, and this workspace has already recorded one false
  // "the service is broken" finding caused by exactly that.
  await page.evaluate((name) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    for (const r of rows) {
      const txt = r.innerText || '';
      if (txt.includes(name) && !txt.includes('admin@shopview.com')) { r.scrollIntoView({ block: 'center' }); return true; }
    }
    return false;
  }, TARGET_NAME);
  await page.waitForTimeout(1200);

  const clicked = await page.evaluate((name) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    for (const r of rows) {
      const txt = r.innerText || '';
      if (txt.includes(name) && !txt.includes('admin@shopview.com')) {
        const btn = r.querySelector('.material-icons, button, i');
        const cells = Array.from(r.querySelectorAll('td'));
        const last = cells[cells.length - 1];
        const target = (last && last.querySelector('i,button')) || btn;
        if (target) {
          const rect = target.getBoundingClientRect();
          return { ok: true, row: txt.replace(/\s+/g, ' ').slice(0, 200), x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        }
      }
    }
    return { ok: false, sample: rows.slice(0, 3).map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 120)) };
  }, TARGET_NAME);
  steps.push({ step: 'locate row', result: clicked });

  if (clicked.ok) {
    await page.mouse.click(clicked.x, clicked.y);
    await page.waitForTimeout(6000);
  }

  const harvest = await page.evaluate(HARVEST).catch(e => ({ error: String(e) }));
  await page.screenshot({ path: `${OUT}/${TAG}.png` }).catch(() => { });

  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({
    target: TARGET_NAME, steps, harvest,
    api_calls: h.apiLog.filter(a => a.s >= 400),
    bridge_errors: h.bridgeErrors,
    read_at_utc: new Date().toISOString()
  }, null, 2));

  console.log('ROW:', JSON.stringify(clicked).slice(0, 300));
  if (harvest.nodes) {
    console.log('--- RAW TEXT NODES (' + harvest.nodes.length + ') ---');
    harvest.nodes.forEach(n => console.log(JSON.stringify(n.raw) + (n.transform !== 'none' ? '   [text-transform: ' + n.transform + ']' : '')));
  } else console.log('HARVEST:', JSON.stringify(harvest).slice(0, 400));
  await h.browser.close();
})();
