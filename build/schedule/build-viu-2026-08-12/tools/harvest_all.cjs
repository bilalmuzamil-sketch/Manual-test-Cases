// harvest_all.cjs — sweep the Schedule surfaces and collect every visible build
// string as a RAW TEXT NODE, plus every data-test-id / aria-label, so a label
// diff can be run against the 176 cases without re-driving the app per case.
//
// Raw text nodes, never innerText: these panels use CSS text-transform, so the
// painted string and the stored string differ and a screenshot settles nothing.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const GRAB = `(() => {
  const out = { text: [], testids: [], arias: [], placeholders: [] };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const t = (n.nodeValue || '').trim(); if (!t) continue;
    const p = n.parentElement; if (!p) continue;
    const cs = getComputedStyle(p);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    out.text.push(cs.textTransform === 'none' ? t : t + '\\u0000' + cs.textTransform);
  }
  document.querySelectorAll('[data-test-id]').forEach(e => out.testids.push(e.getAttribute('data-test-id')));
  document.querySelectorAll('[aria-label]').forEach(e => out.arias.push(e.getAttribute('aria-label')));
  document.querySelectorAll('[placeholder]').forEach(e => out.placeholders.push(e.getAttribute('placeholder')));
  return out;
})()`;

// each entry: [tag, path, [click plan]]  — clicks are by visible text, innermost match
const SURFACES = [
  ['schedule-day', '/schedule', []],
  ['schedule-week', '/schedule', [{ t: 'Week' }]],
  ['schedule-month', '/schedule', [{ t: 'Month' }]],
  ['filters', '/schedule', [{ t: 'Filters' }]],
  ['viewopts', '/schedule', [{ t: 'View options' }]],
  ['conflicts', '/schedule', [{ t: 'conflicts' }]],
  ['staff-list', '/administration/staff', []],
  ['roles-list', '/administration/roles-permissions', []],
  ['locations', '/administration/locations', []],
];

(async () => {
  const h = await makeHarness('harvest');
  const page = h.page;
  const all = { text: new Set(), testids: new Set(), arias: new Set(), placeholders: new Set() };
  const perSurface = {};
  for (const [tag, pathname, plan] of SURFACES) {
    try {
      await page.goto(APP + pathname, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(11000);
      for (const step of plan) {
        const r = await page.evaluate((t) => {
          const els = Array.from(document.querySelectorAll('button,[role=button],.q-btn,i,span,div,td,a,label,.q-item'));
          const hits = els.filter(e => (e.innerText || e.textContent || '').trim().includes(t));
          const inner = hits.filter(e => !hits.some(o => o !== e && e.contains(o)));
          const p = (inner.length ? inner : hits)[0];
          if (!p) return { ok: false };
          p.scrollIntoView({ block: 'center' });
          const rc = p.getBoundingClientRect();
          return { ok: true, x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 };
        }, step.t);
        if (r.ok) { await page.waitForTimeout(700); await page.mouse.click(r.x, r.y); await page.waitForTimeout(4500); }
      }
      const g = await page.evaluate(GRAB);
      perSurface[tag] = { text: g.text.length, testids: g.testids.length };
      g.text.forEach(x => all.text.add(x));
      g.testids.forEach(x => all.testids.add(x));
      g.arias.forEach(x => all.arias.add(x));
      g.placeholders.forEach(x => all.placeholders.add(x));
      await page.screenshot({ path: `${OUT}/harvest-${tag}.png` }).catch(() => { });
      console.log(tag, '->', g.text.length, 'text nodes');
    } catch (e) { perSurface[tag] = { error: String(e).slice(0, 160) }; console.log(tag, 'ERR', String(e).slice(0, 120)); }
  }
  const dump = {
    build_note: 'raw text nodes; a \\u0000 suffix records the CSS text-transform painted over the stored string',
    surfaces: perSurface,
    text: [...all.text].sort(),
    testids: [...all.testids].map(t => t).sort(),
    arias: [...all.arias].sort(),
    placeholders: [...all.placeholders].sort(),
    read_at_utc: new Date().toISOString()
  };
  fs.writeFileSync(`${OUT}/harvest.json`, JSON.stringify(dump, null, 1));
  console.log('TOTAL distinct strings:', all.text.size, '| test-ids:', all.testids.size, '| arias:', all.arias.size);
  await h.browser.close();
})();
