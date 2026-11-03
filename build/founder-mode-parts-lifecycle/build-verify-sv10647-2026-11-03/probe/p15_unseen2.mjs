// Probe 15 (read-only): retry of probe 14 with whole-page reads. Every window is cancelled or closed; nothing is saved.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
const body = async n => { await page.waitForTimeout(1500); fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + await page.locator('body').innerText()); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url()); };
await step('history', async () => { await go('/parts/inventory'); await search('W3030'); await page.waitForTimeout(1500);
  await page.locator('main tbody tr').filter({ has: page.locator('td', { hasText: /^W3030$/ }) }).first().locator('i:text-is("history")').first().click(); await page.waitForTimeout(4000); await body('part-history');
  save('part-history-fields', await page.locator('input:visible').evaluateAll(x => x.map(e => (e.getAttribute('aria-label') || '') + '|' + (e.placeholder || '') + '|' + (e.closest('label')?.innerText || '')))); });
await step('po', async () => { await go('/parts/orders'); await page.waitForTimeout(2500); await page.locator('main td').filter({ hasText: /^S10647-17581$/ }).first().click(); await page.waitForTimeout(7000); await body('po-page');
  save('po-buttons', await page.locator('button:visible').allInnerTexts()); });
await step('receive', async () => { await go('/parts/orders'); await page.waitForTimeout(2500); await page.locator('main button:visible', { hasText: /^Receive$/ }).first().click(); await page.waitForTimeout(7000); await body('receive-screen');
  save('receive-buttons', await page.locator('button:visible').allInnerTexts()); });
await step('newline', async () => { await go('/workorders?tab=all'); await page.waitForTimeout(2500); await page.locator('main td').filter({ hasText: /^S2-6761$/ }).first().click(); await page.waitForTimeout(4500); await body('wo');
  await page.locator('button:visible', { hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2500); await body('new-line-window'); save('new-line-buttons', await dlg().locator('button:visible').allInnerTexts());
  await dlg().getByLabel('Title').first().click(); await page.keyboard.type('Re', { delay: 80 }); await page.waitForTimeout(2500); await body('canned-suggestions'); save('canned-menu', await page.locator('.q-menu:visible').allInnerTexts());
  await page.keyboard.press('Escape'); await dlg().locator('button:visible').filter({ hasText: 'close' }).first().click().catch(() => {}); });
await step('credit', async () => { await go('/parts/part-sales?status=invoiced'); await page.waitForTimeout(2500); await page.locator('main td').filter({ hasText: /^P2-139$/ }).first().click(); await page.waitForTimeout(4000);
  await page.locator('[role=tab]:visible', { hasText: 'Finance' }).first().click(); await page.waitForTimeout(3500); await body('ps-finance');
  const mv = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }); const n = await mv.count(); save('more-vert-count', n);
  for (let k = 0; k < n; k++) { await mv.nth(k).click(); await page.waitForTimeout(900); const t = (await page.locator('.q-menu:visible').allInnerTexts()).join(' '); save(`menu-${k}`, t); if (t.includes('Issue Credit')) break; await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
  await page.locator('.q-menu:visible').getByText('Issue Credit', { exact: true }).click(); await page.waitForTimeout(2500); await body('issue-credit-window');
  await dlg().locator('button:visible', { hasText: /^Cancel$/ }).first().click(); });
await step('createcredit', async () => { await go('/parts/returns'); await page.locator('[role=tab]:visible', { hasText: 'Credits' }).first().click(); await page.waitForTimeout(2000);
  await page.locator('main button:visible', { hasText: 'Create Credit' }).first().click(); await page.waitForTimeout(3500); await body('create-credit'); });
await r.browser.close();
