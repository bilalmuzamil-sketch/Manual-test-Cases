import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./18b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 900);
const WO = fs.readFileSync(new URL('./16b/wo-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('open', async () => { await go(WO); await page.waitForTimeout(3000); await okNotes(); await page.locator('main button:visible', { hasText: /^Complete$/ }).first().click(); await page.waitForTimeout(3000); });
await step('story', async () => { const d = page.locator('.q-dialog:visible').last(); await d.getByText('ZZAUTOTEST AR line').first().click().catch(() => {}); await page.waitForTimeout(1500); log('AFTER LINE CLICK:', await dl());
  const ta = d.locator('textarea:visible').first(); log('textarea', await ta.count()); if (await ta.count()) { await ta.fill('ZZAUTOTEST tech story'); await page.keyboard.press('Tab'); await page.waitForTimeout(2500); }
  log('buttons:', JSON.stringify((await d.locator('button:visible').allInnerTexts()).map(T))); await dump('story'); });
for (let i = 0; i < 5; i++) await step('next' + i, async () => { const d = page.locator('.q-dialog:visible').last(); if (!(await d.count())) { log('no dialog'); return; } const all = (await d.locator('button:visible').allInnerTexts()).map(T); log(`step ${i} buttons:`, JSON.stringify(all)); log('labels:', JSON.stringify(await d.locator('.q-field__label').allTextContents())); const b = d.locator('button:visible').filter({ hasNotText: /^(close|Cancel|chevron_right)$/ }).last(); if (!(await b.count())) { log('no next button'); return; } const lbl = T(await b.innerText()); log(`step ${i} click:`, lbl); if (/Create Invoice|Invoice/.test(lbl)) { log('INVOICE STEP DIALOG:', await dl()); log('labels:', JSON.stringify(await d.locator('.q-field__label').allTextContents())); await dump('invoice-step'); return; } await b.click(); await page.waitForTimeout(3000); log(`after ${lbl}:`, await dl()); await dump('wiz' + i); });
await r.browser?.close?.(); process.exit(0);
