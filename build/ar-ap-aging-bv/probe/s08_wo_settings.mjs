import { start } from './libs.mjs';
const OUT = new URL('./s08/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
await step('settings', async () => { await go('/administration/settings'); await page.waitForTimeout(5000); log('URL', page.url());
  log('TABS/HEADINGS', JSON.stringify((await page.locator('main .q-tab, main h1, main h2, main h3, main .text-h6, main .text-subtitle1').allInnerTexts()).map(T).filter(Boolean).slice(0, 40)));
  const wo = page.locator('main .q-tab, main button, main a').filter({ hasText: /^\s*\S*\s*Work orders?\s*$/i }).first(); if (await wo.count()) { await wo.click(); await page.waitForTimeout(3000); log('clicked Work order tab'); }
  const toggles = await page.evaluate(() => [...document.querySelectorAll('main .q-toggle, main .q-checkbox')].map(e => { let p = e; let lab = ''; for (let k = 0; k < 6 && p && !lab; k++) { p = p.parentElement; const t = (p?.innerText || '').trim(); if (t.length > 3) lab = t.replace(/\s+/g, ' ').slice(0, 160); } return { on: e.getAttribute('aria-checked'), lab }; }));
  log('TOGGLES', toggles.length); for (const t of toggles) log(' ', t.on, '|', t.lab);
  await dump('settings', true); });
await r.browser?.close?.(); process.exit(0);
