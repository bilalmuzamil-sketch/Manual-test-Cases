import { start } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./01/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const res = {};
await step('menu', async () => { await page.waitForTimeout(2500); log('VERSION', await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content));
  const nav = await page.locator('aside:visible, .q-drawer:visible, nav:visible').first().innerText().catch(() => ''); log('LEFT MENU:', T(nav).slice(0, 1200));
  const heads = await page.locator('.q-item-label.q-item__label--header:visible, .q-item__label--header:visible').allTextContents(); log('MENU HEADERS (textContent):', JSON.stringify(heads.map(T))); res.menu = T(nav); });
const REPS = [['A/R Aging Summary', '/reports/ar-aging-summary'], ['A/R Aging Detail', '/reports/ar-aging-detail'], ['A/R Aging Collection', '/reports/ar-aging-collection'], ['A/P Aging Summary', '/reports/ap-aging-summary'], ['A/P Aging Detail', '/reports/ap-aging-detail'], ['A/P Unpaid Invoices', '/reports/ap-unpaid-invoices']];
for (const [name, path] of REPS) await step(name, async () => {
  const link = page.locator('a:visible, .q-item:visible').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + name.replace(/\//g, '\\/') + '\\s*$') }).first();
  log('\n==', name, '| menu link count', await link.count()); if (await link.count()) { await link.click(); } else { await go(path); }
  await page.waitForTimeout(4500); const o = { url: page.url(), tabTitle: await page.title() };
  o.h = T(await page.locator('main h1, main h2, main .text-h5, main .text-h6, main [class*=title]').first().textContent().catch(() => ''));
  o.th = await page.locator('main thead th').evaluateAll(els => els.map(e => ({ text: e.textContent.replace(/\s+/g, ' ').trim(), shown: e.innerText.replace(/\s+/g, ' ').trim() })));
  o.top = T((await page.locator('main').innerText()).split(/\n/).slice(0, 14).join(' | '));
  o.buttons = [...new Set((await page.locator('main button:visible').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || '') + '/' + x.innerText.replace(/\s+/g, ' ').trim()))))].slice(0, 30);
  const dots = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_horiz"), i:text-is("more_vert")') }).first();
  if (await dots.count()) { await dots.click(); await page.waitForTimeout(1200); o.exportMenu = (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T); await page.keyboard.press('Escape'); }
  o.firstRows = (await page.locator('main tbody tr').allInnerTexts()).slice(0, 4).map(T);
  res[name] = o; log(JSON.stringify(o, null, 1).slice(0, 2500)); await dump(name.replace(/\W+/g, '-'), true);
});
fs.writeFileSync(OUT + 'summary.json', JSON.stringify(res, null, 1));
await r.browser?.close?.(); process.exit(0);
