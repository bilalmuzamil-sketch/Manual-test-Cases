/** What does un-ticking the only location in a staff member's Location field do? Screens at each step; nothing saved. */
import { open, done, APP } from './session.mts';
import { t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders');
await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill('ayesha.khan'); await p.waitForTimeout(3000);
await p.locator('tr').filter({ hasText: 'ayesha.khan' }).first().locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500);
const field = p.locator('.q-dialog .q-field').filter({ hasText: /^Location/ }).first();
await field.click(); await p.waitForTimeout(1200); await shot(p, 'probe-staffloc-1-open');
console.log(t(), 'options', JSON.stringify(await p.locator('.q-menu .q-item, [role=option]').allInnerTexts()));
await p.locator('.q-menu .q-item, [role=option]').filter({ hasText: 'Lethbridge' }).first().click(); await p.waitForTimeout(1200); await shot(p, 'probe-staffloc-2-after-click');
console.log(t(), 'dialogs', await p.locator('.q-dialog').count(), '| field now', JSON.stringify(await field.innerText().catch(() => 'gone')), '| menus', await p.locator('.q-menu').count());
console.log(t(), 'buttons', JSON.stringify(await p.evaluate(`[...document.querySelectorAll('.q-dialog button')].map(b => b.innerText.trim()).filter(Boolean)`)));
await p.locator('.q-dialog').getByText('Edit Staff Member', { exact: true }).click().catch((e) => console.log('title click', String(e.message).slice(0, 80))); await p.waitForTimeout(800); await shot(p, 'probe-staffloc-3-after-title');
console.log(t(), 'after title: dialogs', await p.locator('.q-dialog').count(), 'buttons', JSON.stringify(await p.evaluate(`[...document.querySelectorAll('.q-dialog button')].map(b => b.innerText.trim()).filter(Boolean)`)));
await done(browser);
