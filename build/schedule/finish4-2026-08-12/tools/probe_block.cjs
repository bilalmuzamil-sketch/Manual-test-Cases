// Diagnostic: what does interacting with a shift block actually do?
// Written because a plain click opened nothing - rule out OUR harness before
// reporting an absence.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { ev, pops, esc } = require('./walkbase.cjs');
const fs = require('fs');
const TARGET = '207e4f90-f3e5-4e1d-959e-d11022e4d527';
(async () => {
  const h = await makeHarness('blk'); const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(12000);
  const out = {};
  const box = await ev(page, ({ id, v }) => { const vis = eval(v);
    const e = document.querySelector(`[data-shift-id="${id}"]`); if (!e || !vis(e)) return null;
    const r = e.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), w: Math.round(r.width), h: Math.round(r.height),
             top: Math.round(r.y), left: Math.round(r.x), cls: (e.className || '').toString(),
             attrs: [...e.attributes].map(a => a.name), inner: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 200) }; }, { id: TARGET });
  out.box = box;
  out.viewport = await page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
  // what element is actually on top at that point?
  out.topmost = await ev(page, ({ x, y }) => { const e = document.elementFromPoint(x, y);
    if (!e) return null; const chain = []; let c = e;
    for (let i = 0; i < 6 && c; i++) { chain.push(c.tagName + '.' + (c.className || '').toString().slice(0, 70) + (c.getAttribute && c.getAttribute('data-test-id') ? ' #' + c.getAttribute('data-test-id') : '')); c = c.parentElement; }
    return chain; }, { x: box.x, y: box.y });
  fs.writeFileSync(`${OUT}/blk.json`, JSON.stringify(out, null, 1));

  // 1 - plain click
  await page.mouse.click(box.x, box.y); await page.waitForTimeout(2500);
  out.after_click = await pops(page);
  out.after_click_ids = await ev(page, ({ v }) => { const vis = eval(v);
    return [...document.querySelectorAll('[data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')).filter(t => /shift|detail|delete|dialog|modal/i.test(t)); });
  await page.screenshot({ path: `${OUT}/blk-click.png` });
  fs.writeFileSync(`${OUT}/blk.json`, JSON.stringify(out, null, 1));
  await esc(page, 2);

  // 2 - click the inner text node instead of the container centre
  const r2 = await ev(page, ({ id, v }) => { const vis = eval(v);
    const e = document.querySelector(`[data-shift-id="${id}"]`); if (!e) return null;
    const kids = [...e.querySelectorAll('*')].filter(vis); const k = kids[0] || e;
    const b = k.getBoundingClientRect(); k.click();
    return { tag: k.tagName, cls: (k.className || '').toString().slice(0, 80), x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) }; }, { id: TARGET });
  await page.waitForTimeout(2500);
  out.dom_click_child = r2; out.after_dom_click = await pops(page);
  fs.writeFileSync(`${OUT}/blk.json`, JSON.stringify(out, null, 1));
  await esc(page, 2);

  // 3 - dispatch a real mousedown/mouseup pair (some grids listen for those, not click)
  await ev(page, ({ id }) => { const e = document.querySelector(`[data-shift-id="${id}"]`); if (!e) return;
    const r = e.getBoundingClientRect(); const o = { bubbles: true, cancelable: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, button: 0 };
    e.dispatchEvent(new MouseEvent('mousedown', o)); e.dispatchEvent(new MouseEvent('mouseup', o)); e.dispatchEvent(new MouseEvent('click', o)); }, { id: TARGET });
  await page.waitForTimeout(2500);
  out.after_synth = await pops(page);
  await page.screenshot({ path: `${OUT}/blk-synth.png` });
  fs.writeFileSync(`${OUT}/blk.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 2600));
  await h.browser.close();
})();
