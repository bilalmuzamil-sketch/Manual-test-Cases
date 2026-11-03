// Probe 14 (read-only): the screens the 52 partly-checked cases use. Every window is cancelled or closed; nothing is saved.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search, dots, btn, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
const vb = () => page.locator('main button:visible').allInnerTexts();
await step('history', async () => { await go('/parts/inventory'); await search('W3030LS'); await page.waitForTimeout(1500);
  await page.locator('main tbody tr').filter({ hasText: 'W3030LS' }).first().locator('i:text-is("history")').first().click(); await page.waitForTimeout(4000); await dump('part-history', true);
  save('part-history-buttons', await vb()); save('part-history-inputs', await page.locator('main input:visible').evaluateAll(x => x.map(e => (e.getAttribute('aria-label') || '') + '|' + (e.placeholder || '') + '|' + (e.closest('label')?.innerText || '')))); });
await step('po', async () => { await go('/parts/orders'); await page.waitForTimeout(2000); await page.locator('main tbody tr.cursor-pointer, main tbody tr').filter({ hasText: /S\d+-\d+|PO/ }).first().locator('td').nth(2).click(); await page.waitForTimeout(6000);
  await dump('po-page', true); save('po-page-buttons', await vb()); });
await step('po-receive', async () => { await go('/parts/orders'); await page.waitForTimeout(2000); await page.locator('main button:visible', { hasText: /^Receive$/ }).first().click(); await page.waitForTimeout(3500);
  await dump('receive-screen'); await dump('receive-screen-main', true); save('receive-labels', await page.locator('.q-dialog:visible label:visible, .q-dialog:visible button:visible, main label:visible').allInnerTexts()); await page.keyboard.press('Escape'); });
await step('newline', async () => { await go('/workorders'); await page.locator('main td').filter({ hasText: 'S2-6761' }).first().click(); await page.waitForTimeout(4000);
  await page.locator('main button:visible', { hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2500); await dump('new-line-window'); save('new-line-buttons', await dlg().locator('button:visible').allInnerTexts());
  const t = dlg().getByLabel('Title').first(); await t.click(); await page.keyboard.type('Re', { delay: 80 }); await page.waitForTimeout(2500); await dump('canned-suggestions');
  await page.keyboard.press('Escape'); await dlg().locator('button:visible').filter({ hasText: 'close' }).first().click().catch(() => {}); await page.waitForTimeout(1000); await dump('after-close', true); });
await step('credit', async () => { await go('/parts/part-sales?status=invoiced'); await page.waitForTimeout(2500); await dump('ps-invoiced-list', true);
  await page.locator('main tbody tr').filter({ hasText: /Invoiced|Paid/ }).first().locator('td').first().click(); await page.waitForTimeout(3500);
  await page.getByRole('tab', { name: /Finance/ }).first().click(); await page.waitForTimeout(3000); await dump('ps-finance', true); save('ps-finance-buttons', await vb());
  const mv = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }); save('more-vert-count', await mv.count());
  for (let k = 0; k < await mv.count(); k++) { await mv.nth(k).click(); await page.waitForTimeout(800); const t = await page.locator('.q-menu:visible').allInnerTexts(); if (t.join(' ').includes('Issue Credit')) { await dump('invoice-menu'); break; } await page.keyboard.press('Escape'); }
  await page.locator('.q-menu:visible').getByText('Issue Credit', { exact: true }).click(); await page.waitForTimeout(2500); await dump('issue-credit-window'); save('issue-credit-labels', await dlg().locator('label:visible, button:visible, .q-checkbox:visible').allInnerTexts());
  await dlg().locator('button:visible', { hasText: /^Cancel$/ }).first().click(); });
await step('vcredit', async () => { await go('/parts/returns'); await page.getByRole('tab', { name: 'Credits' }).click(); await page.waitForTimeout(2500); await dump('credits-tab', true); save('credits-buttons', await vb()); });
await step('libdel', async () => { await go('/parts/parts-catalogue'); await search('QAPL'); await page.waitForTimeout(1500); const rows = page.locator('main tbody tr.cursor-pointer'); const n = Math.min(await rows.count(), 8); save('libdel-rows', n);
  for (let k = 0; k < n; k++) { await go('/parts/parts-catalogue'); await search('QAPL'); await page.locator('main tbody tr.cursor-pointer').nth(k).locator('td').nth(1).click(); await page.waitForTimeout(2500);
    await page.locator('main i:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(1500); const del = dlg().getByRole('button', { name: 'Delete', exact: true });
    if (await del.isEnabled().catch(() => false)) { await del.click(); await page.waitForTimeout(1500); await dump('lib-delete-confirm'); save('lib-delete-buttons', await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts()); await page.locator('.q-dialog:visible').last().locator('button:visible', { hasText: /Cancel/ }).first().click(); break; }
    await page.keyboard.press('Escape'); } });
await r.browser.close();
