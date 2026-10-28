import fs from 'fs';
import { open2, APP } from './ctx2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/w3/seed.json')); const RID = process.argv[2];
const { browser, page } = await open2('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 1);
await page.goto(`${APP}/workorders/${S.wo3}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
await page.locator(`[data-test-id="part_number_${RID}"]`).hover(); await page.waitForTimeout(500);
await page.locator(`[data-test-id="button_edit_part_${RID}"]`).click({ force: true }); await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/cln/w3/shots/ui-08-edit.png' });
const ids = await page.evaluate(() => [...document.querySelectorAll('.q-dialog [data-test-id]')].map(e => e.getAttribute('data-test-id') + ':' + e.tagName + ':' + (e.innerText || e.value || '').slice(0, 40).replace(/\n/g, ' ')));
console.log(ids.join('\n'));
console.log('DIALOG', (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 1200));
// also the context menu
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
await page.locator(`[data-test-id^="button_requested_part_context_menu_${RID}"]`).click({ force: true }).catch(e => console.log('ctx err', e.message.split('\n')[0])); await page.waitForTimeout(1500);
console.log('CTXMENU', (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n+/g, ' | '));
await browser.close();
