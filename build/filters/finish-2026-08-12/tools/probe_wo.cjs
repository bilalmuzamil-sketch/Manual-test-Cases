// probe_wo.cjs — Work Orders surface walk for the runnability check.
// Harvests VISIBLE text (innerText, i.e. what is painted) AND the stored
// textContent, plus computed text-transform, so a label can be compared both
// ways.  Rule 9 check (5): read the computed style, not textContent alone.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const HARVEST = () => {
  const seen = [];
  const push = (el, kind) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const painted = (el.innerText || '').trim();
    const stored = (el.textContent || '').trim();
    if (!painted && !stored) return;
    seen.push({
      kind, painted: painted.slice(0, 120), stored: stored.slice(0, 120),
      transform: cs.textTransform, opacity: cs.opacity,
      tid: el.getAttribute('data-test-id') || null,
      aria: el.getAttribute('aria-label') || null,
      cls: (el.className || '').toString().slice(0, 80),
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)
    });
  };
  document.querySelectorAll('button, [role=button], a, .q-tab, .q-chip, [data-test-id], input, .q-item, label, th')
    .forEach(el => push(el, el.tagName.toLowerCase()));
  return seen;
};

(async () => {
  const tag = process.argv[2] || 'wo';
  const who = process.argv[3] || 'admin';
  const h = await makeHarness(who);
  const p = h.page;
  const rec = { identity: who, steps: [], read_at_utc: new Date().toISOString() };

  const snap = async (label) => {
    const els = await p.evaluate(HARVEST).catch(e => ({ err: String(e) }));
    const url = p.url();
    rec.steps.push({ label, url, count: Array.isArray(els) ? els.length : 0, els });
    return els;
  };

  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(9000);
  await snap('01-workorders-all-tab');
  await p.screenshot({ path: `${OUT}/${tag}-01.png` }).catch(() => {});

  // --- open each chip dropdown in turn, take the LAST .q-menu (Quasar leaves stale ones mounted)
  const chips = ['Status', 'Customer', 'Lead Technician', 'Service Advisor', 'Asset on Site'];
  for (const c of chips) {
    try {
      const btn = p.locator(`button:has-text("${c}"), [role=button]:has-text("${c}")`).first();
      await btn.scrollIntoViewIfNeeded({ timeout: 5000 });
      await btn.click({ timeout: 8000 });
      await p.waitForTimeout(2200);
      const menu = await p.evaluate(() => {
        const ms = [...document.querySelectorAll('.q-menu, .q-dialog__inner')];
        const m = ms[ms.length - 1];   // LAST, not first
        if (!m) return null;
        const cs = getComputedStyle(m);
        return {
          painted: (m.innerText || '').trim().slice(0, 1500),
          transform: cs.textTransform,
          items: [...m.querySelectorAll('.q-item, [role=option], label, button')].map(i => ({
            painted: (i.innerText || '').trim().slice(0, 80),
            stored: (i.textContent || '').trim().slice(0, 80),
            transform: getComputedStyle(i).textTransform,
            tid: i.getAttribute('data-test-id') || null,
            disabled: i.getAttribute('aria-disabled') === 'true' || i.classList.contains('disabled') || i.hasAttribute('disabled')
          })).slice(0, 60)
        };
      });
      rec.steps.push({ label: `chip-${c}`, menu, url: p.url() });
      await p.screenshot({ path: `${OUT}/${tag}-chip-${c.replace(/\s+/g, '')}.png` }).catch(() => {});
      await p.keyboard.press('Escape');
      await p.waitForTimeout(900);
    } catch (e) {
      rec.steps.push({ label: `chip-${c}`, error: String(e).slice(0, 200) });
    }
  }

  rec.api_calls = h.apiLog;
  rec.bridge_errors = h.bridgeErrors;
  rec.console_errors = h.consoleErrs.slice(0, 20);
  fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify(rec, null, 1));
  console.log('bridge_errors:', h.bridgeErrors.length);
  for (const s of rec.steps) {
    if (s.menu) console.log(`\n== ${s.label} ==\n` + (s.menu.painted || '(empty)').replace(/\n/g, ' | ').slice(0, 400));
    else if (s.error) console.log(`\n== ${s.label} == ERROR ${s.error.slice(0,120)}`);
  }
  await h.browser.close();
})();
