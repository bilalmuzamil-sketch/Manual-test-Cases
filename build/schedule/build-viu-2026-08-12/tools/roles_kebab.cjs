// roles_kebab.cjs — open the row menu for a NAMED role on the roles list and
// harvest every menu item, so "Reset to template is / is not offered here" is a
// measurement rather than an inference.  Nothing is clicked inside the menu.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const ROLE = process.argv[2] || 'Technician';
const TAG = process.argv[3] || 'kebab';

(async () => {
  const h = await makeHarness(TAG);
  const page = h.page;
  await page.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(9000);

  const loc = await page.evaluate((role) => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const r = rows.find(x => {
      const cells = Array.from(x.querySelectorAll('td'));
      return cells.length && (cells[1] || {}).innerText && cells[1].innerText.trim() === role;
    }) || rows.find(x => (x.innerText || '').includes(role));
    if (!r) return { ok: false, rows: rows.map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 60)).slice(0, 15) };
    r.scrollIntoView({ block: 'center' });
    const icons = Array.from(r.querySelectorAll('i')).filter(i => (i.textContent || '').trim() === 'more_vert');
    if (!icons.length) return { ok: false, why: 'no more_vert in row', row: (r.innerText || '').replace(/\s+/g, ' ').slice(0, 160) };
    const rc = icons[0].getBoundingClientRect();
    return { ok: true, row: (r.innerText || '').replace(/\s+/g, ' ').slice(0, 160), x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 };
  }, ROLE);

  let items = null;
  if (loc.ok) {
    await page.waitForTimeout(800);
    await page.mouse.click(loc.x, loc.y);
    await page.waitForTimeout(4000);
    items = await page.evaluate(() => {
      // take the LAST .q-menu in the DOM — Quasar leaves earlier detached menus behind,
      // and reading the first one is how a stale menu gets reported as the live one.
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => getComputedStyle(m).display !== 'none');
      const m = menus[menus.length - 1];
      if (!m) return { ok: false, menus: menus.length };
      const out = [];
      const w = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) { const t = n.nodeValue; if (t && t.trim()) out.push({ raw: t.trim(), transform: getComputedStyle(n.parentElement).textTransform }); }
      return { ok: true, count: menus.length, items: out };
    });
  }
  await page.screenshot({ path: `${OUT}/${TAG}.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify({ role: ROLE, loc, items, read_at_utc: new Date().toISOString() }, null, 2));
  console.log('ROLE:', ROLE, '| row:', loc.row || loc.why || 'NOT FOUND');
  console.log('MENU:', JSON.stringify(items));
  await h.browser.close();
})();
