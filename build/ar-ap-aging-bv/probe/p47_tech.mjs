import { start } from './lib.mjs';
const OUT = new URL('./47b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 600);
const M = () => page.locator('main').last();
const mclick = async (loc) => { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
await step('find-tech', async () => { await go('/administration/staff'); await page.waitForTimeout(4000); const row = M().locator('tbody tr').filter({ hasText: /tech@shopview/ }).first();
  for (let k = 0; k < 15 && !(await row.count()); k++) { await page.mouse.move(900, 600); await page.mouse.wheel(0, 2500); await page.waitForTimeout(1200); }
  log('TECH ROW', T(await row.innerText())); await mclick(row.locator('button').last()); await page.waitForTimeout(2500); log('EDIT', (await dl()).slice(0, 250));
  const rf = page.locator('.q-dialog:visible .q-field').filter({ has: page.locator('.q-field__label', { hasText: /^Role/ }) }).first(); await mclick(rf); await page.waitForTimeout(1500); log('ROLE OPTS', JSON.stringify(await menu())); await dump('tech-role-opts'); await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
