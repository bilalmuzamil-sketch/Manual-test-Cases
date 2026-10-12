/** C154887 re-check (12 Oct 2026, after Chris's answer). Normal sign-in, 2x pictures. Read-only.
 *  (a) List + Status = Imported: are Board View / Tech View usable? (b) Board View / Tech View with no filter: is "Imported"
 *  offered in their Status filter? Positive control: the List shows imported rows, and another status (Invoiced) is selectable. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'imported-2026-10-12');
const { browser, page: p, APP } = await boot('sv10043', '/workorders?tab=all', 'admin');
const R = {}; const T = (s) => s.replace(/\s+/g, ' ').trim();
const btn = (n) => p.locator(`[aria-label="${n}"]`).first();
const btnState = async (n) => { const b = btn(n); return { disabled: await b.isDisabled(), box: await b.boundingBox() }; };
const openStatus = async () => { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(1200); };
const readMenu = () => p.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, .q-menu .q-checkbox')].map((e) => { const b = e.getBoundingClientRect(); return { text: e.innerText.trim().replace(/\s+/g, ' '), disabled: e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true' || !!e.querySelector('[aria-disabled="true"], .disabled'), box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] }; }));
const tooltip = async () => p.evaluate(() => [...document.querySelectorAll('.q-tooltip')].map((e) => e.innerText.trim()).join(' | '));
await p.waitForTimeout(5000);
await btn('List').click(); await p.waitForTimeout(3000);
R.before = { board: await btnState('Board View'), tech: await btnState('Tech View') };
// (a) List + Imported
await openStatus(); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Imported/ }).first().click(); await p.waitForTimeout(3000);
await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
R.a = { chip: T(await p.locator('[data-test-id="filter_chip_status"]').innerText()), rows: await p.evaluate(() => document.querySelectorAll('tbody tr').length),
  firstRows: await p.evaluate(() => [...document.querySelectorAll('tbody tr')].slice(0, 3).map((r) => r.innerText.replace(/\s+/g, ' ').slice(0, 140))),
  board: await btnState('Board View'), tech: await btnState('Tech View') };
await btn('Board View').hover({ force: true }); await p.waitForTimeout(1500); R.a.boardTip = await tooltip();
await p.screenshot({ path: path.join(EVD, 'a-list-imported-board-greyed.png') });
await btn('Tech View').hover({ force: true }); await p.waitForTimeout(1500); R.a.techTip = await tooltip();
await p.screenshot({ path: path.join(EVD, 'a-list-imported-tech-greyed.png') });
R.a.chipBox = await p.locator('[data-test-id="filter_chip_status"]').boundingBox();
// clear
await openStatus(); const c = p.locator('.q-menu').getByText('Clear selection'); if (await c.count()) await c.first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
R.afterClear = { board: await btnState('Board View'), tech: await btnState('Tech View') };
// (b) Board View / Tech View status menu
for (const [n, k] of [['Board View', 'board'], ['Tech View', 'tech']]) {
  await btn(n).click(); await p.waitForTimeout(4000);
  await openStatus(); R[k + 'Menu'] = await readMenu();
  const imp = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Imported/ }).first();
  if (await imp.count()) { await imp.hover({ force: true }); await p.waitForTimeout(1500); R[k + 'ImpTip'] = await tooltip(); }
  await p.screenshot({ path: path.join(EVD, `b-${k}-status-menu.png`) });
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
}
await btn('List').click(); await p.waitForTimeout(1500);
R.version = await p.evaluate(() => document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]{7}/)?.[0] ?? null);
R.at = new Date().toISOString();
fs.writeFileSync(path.join(EVD, 'imp-check.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1).slice(0, 6000));
await browser.close(); process.exit(0);
