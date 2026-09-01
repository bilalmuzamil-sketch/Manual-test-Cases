// discover.mjs — FIRST QUESTION for Printer Friendly Work Orders (6617): is it on sv9315 at all?
// All 44 markers read "Not available on Build to test Yet - Last checked 8/25/2026", so nothing may
// be assumed either way.
//
// What the suite says to look for: the work order toolbar's More menu carries a text-only
// "Print Work Order" item, sitting below Timesheets and above Delete Work Order.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const { browser, page } = await boot('/workorders');
const WOS = (process.env.WOS || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a,891e1767-bc87-4c14-a7e5-f68524fbd02d').split(',');
const settle = async () => {
  await page.waitForFunction(() => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return t.length > 2000;
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);
};
const results = [];
for (const wo of WOS) {
  await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  const toolbar = await page.evaluate(() => ({
    url: location.pathname,
    chars: (document.body?.innerText || '').length,
    printWordAnywhere: /\bprint\b/i.test(document.body?.innerText || ''),
    moreLikeIds: [...new Set([...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))]
      .filter(x => /more|menu|action|print|overflow|dots/i.test(x)).slice(0, 25),
    topButtons: [...document.querySelectorAll('button, .q-btn')].map(b => ({
      label: (b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      id: b.getAttribute('data-test-id') })).filter(x => x.id || x.label).slice(0, 30),
  }));
  L(`\n=== ${wo.slice(0, 8)} ${toolbar.url} chars=${toolbar.chars}`);
  L('  "print" anywhere on the page:', toolbar.printWordAnywhere);
  L('  more/menu-ish ids            :', JSON.stringify(toolbar.moreLikeIds));
  // open every plausible More control and read the menu
  const menus = [];
  const candidates = await page.evaluate(() =>
    [...document.querySelectorAll('button, .q-btn, [role="button"]')]
      .map((b, i) => ({ i, id: b.getAttribute('data-test-id'),
                        label: (b.innerText || '').replace(/\s+/g, ' ').trim() }))
      .filter(x => /more_vert|more|⋮|overflow/i.test((x.id || '') + ' ' + x.label)).slice(0, 8));
  L('  candidate More controls      :', JSON.stringify(candidates));
  for (const c of candidates) {
    await page.evaluate(i => {
      const b = [...document.querySelectorAll('button, .q-btn, [role="button"]')][i]; b?.click(); }, c.i);
    await page.waitForTimeout(2200);
    const m = await page.evaluate(() => {
      const menu = document.querySelector('.q-menu');
      if (!menu) return null;
      return { items: [...menu.querySelectorAll('.q-item')].map(e => ({
        text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
        id: e.getAttribute('data-test-id'),
        disabled: e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true'
                  || getComputedStyle(e).pointerEvents === 'none' })) };
    });
    if (m) { menus.push({ control: c, menu: m }); L(`  menu from ${c.id || c.label}:`, JSON.stringify(m.items)); }
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: `${OUT}/evidence/discover-${wo.slice(0, 8)}.png`, fullPage: true });
  results.push({ wo, toolbar, menus });
}
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
fs.writeFileSync(`${OUT}/evidence/discovery.json`, JSON.stringify(results, null, 1));
fs.writeFileSync(`${OUT}/evidence/discovery.log`, log.join('\n') + '\n');
await browser.close();
