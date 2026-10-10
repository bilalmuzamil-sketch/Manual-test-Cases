/** Production comparison (10 Oct 2026) for C368233/C368234/C368235 — regression checks of the report filters. Is the
 *  "All …" box + pick-one behaviour already on production (old behaviour), or new on sv10043? Same three reports, same
 *  filter, same clicks: read the ticks, click the 3rd option, read, click it again, read; list the buttons in the filter.
 *  Positive control: Technician Utilization's Technician filter (Passed on sv10043 with Select all / Clear selection) is read
 *  the same way, so a difference is the report's, not the reader's. Second production test account only; read-only. */
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-10'); fs.mkdirSync(EV, { recursive: true });
const t = () => new Date().toISOString().slice(11, 19); const R = {};
const { browser, page: p, APP, version } = await bootProdLogin('/reports/sales-by-customer', { deviceScaleFactor: 2, viewport: { width: 1600, height: 1000 } });
R.version = version; p.setDefaultTimeout(20000);
const menuState = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
  return [...m.querySelectorAll('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio')].filter(e => e.innerText.trim()).map(e => { const on = !!(e.querySelector('.q-checkbox__inner--truthy, .q-radio__inner--truthy, [aria-checked=true], [aria-selected=true]') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true' || e.classList.contains('q-item--active') || /\\bcheck\\b/.test(e.innerText)); return (on ? '[x] ' : '[ ] ') + e.innerText.replace(/\\s+/g, ' ').replace(/\\bcheck\\b/, '').trim().slice(0, 50); }).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 8); })()`);
const ticked = (s) => (s ?? []).filter((x) => x.startsWith('[x]')).map((x) => x.slice(4));
for (const [id, route, label] of [['C368233', 'sales-by-customer', 'Customer'], ['C368234', 'parts-velocity', 'Vendor'], ['C368235', 'inventory-value', 'Category'], ['control-TU', 'technician-utilization', 'Technician']]) {
  const o = {}; R[id] = o;
  try { await p.goto(`${APP}/reports/${route}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
    const f = p.locator('.q-page-container, main').first().locator('button, .q-btn, .q-chip, .q-field').filter({ hasText: new RegExp('^\\s*(?:[a-z_]+\\s*)?' + label, 'i') }).filter({ visible: true }).first();
    o.filterFound = await f.count(); o.filterText = (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await f.click(); await p.waitForTimeout(1500);
    const items = p.locator('.q-menu').filter({ visible: true }).last().locator('.q-item, [role=option], [role=checkbox], .q-checkbox, .q-radio').filter({ hasText: /\S/ });
    const s0 = await menuState(); o.first = s0?.slice(0, 4); o.startTicked = ticked(s0).length; o.buttons = await p.locator('.q-menu:visible button').allInnerTexts().catch(() => []);
    const idx = 2; o.clicked = (await items.nth(idx).innerText()).replace(/\s+/g, ' ').replace(/\bcheck\b/, '').trim().slice(0, 40);
    await items.nth(idx).click(); await p.waitForTimeout(2000); const s1 = await menuState(); o.afterClick = { ticked: ticked(s1).slice(0, 4), count: ticked(s1).length, filterText: (await f.innerText().catch(() => '')).replace(/\s+/g, ' ').trim() };
    await p.screenshot({ path: path.join(EV, `${id}-after-click.png`) }).catch(() => {});
    await items.nth(idx).click(); await p.waitForTimeout(2000); const s2 = await menuState(); o.afterSecondClick = { ticked: ticked(s2).slice(0, 4), count: ticked(s2).length };
    await p.keyboard.press('Escape');
  } catch (e) { o.error = String(e?.message || e).slice(0, 200); }
  console.log(t(), id, JSON.stringify(o)); }
fs.writeFileSync(path.join(EV, 'prod-filters.json'), JSON.stringify(R, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
