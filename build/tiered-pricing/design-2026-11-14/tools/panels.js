// Contents of the panels the first pass could not read from a modal body: filter panels (role=dialog, no modal body), price-details popovers,
// pickers and menus, with every row, its checked state and the panel's buttons in order. node tools/panels.js (server on 8771)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'); const BASE = 'http://127.0.0.1:8771/';
const blist = JSON.parse(fs.readFileSync(path.join(ROOT, 'render', 'board-list.json')));
(async () => { const br = await chromium.launch(); const out = [];
  for (const b of blist) {
    const ctx = await br.newContext({ viewport: { width: b.w, height: b.h } }); await ctx.route(u => !u.href.startsWith(BASE), r => r.abort());
    const p = await ctx.newPage(); await p.goto(BASE + encodeURIComponent(b.file), { waitUntil: 'networkidle' }); await p.waitForTimeout(200);
    const r = await p.evaluate(() => {
      const T = e => (e.innerText || '').replace(/[ \t]+/g, ' ').replace(/\n+/g, ' | ').trim();
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
      const res = [];
      for (const d of document.querySelectorAll('[role=dialog]:not(.sv-modal), .tp-popover, .tp-dd-panel, .tp-menu, [role=listbox], [role=menu]')) {
        if (!vis(d)) continue; if (d.parentElement.closest('.tp-popover, .tp-dd-panel, .tp-menu')) continue;
        const rows = [...d.querySelectorAll('[role=menuitem],[role=option],[role=radio],[role=checkbox],[role=menuitemcheckbox],.sv-dd-row,.sv-menu__row,.sv-facts__row,dt,li')].filter(vis).map(x => ({ t: T(x), checked: x.getAttribute('aria-checked') || x.getAttribute('aria-selected') || (x.querySelector('.sv-check.is-checked,[aria-checked=true]') ? 'true' : ''), disabled: x.getAttribute('aria-disabled') === 'true' || x.classList.contains('is-disabled') }));
        const btns = [...d.querySelectorAll('button')].filter(vis).map(x => (T(x) || x.getAttribute('aria-label') || '') + (x.disabled ? ' (disabled)' : ''));
        const inputs = [...d.querySelectorAll('input')].filter(vis).map(i => (i.getAttribute('aria-label') || i.getAttribute('placeholder') || '').trim() + '=' + i.value);
        const r = d.getBoundingClientRect();
        res.push({ cls: String(d.className).slice(0, 60), role: d.getAttribute('role') || '', aria: d.getAttribute('aria-label') || '', text: T(d).slice(0, 1500), rows, btns, inputs, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] });
      }
      return res;
    });
    if (r.length) out.push({ file: b.file, nn: b.nn, title: b.title, panels: r });
    await ctx.close();
  }
  fs.writeFileSync(path.join(ROOT, 'inventory', 'panels.json'), JSON.stringify(out, null, 1)); await br.close(); console.log('boards with panels', out.length);
})();
