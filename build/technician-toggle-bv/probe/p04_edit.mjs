import { start } from './lib.mjs';
const OUT = new URL('./04/', import.meta.url).pathname;
const { r, page, dump, step, go, dlg } = await start(OUT);
const log = (...a) => console.log(...a);
const toggles = async () => page.locator('.q-dialog:visible .q-toggle').evaluateAll(els => els.map(e => `${e.innerText.replace(/\s+/g, ' ').trim()}=${e.getAttribute('aria-checked')}${e.getAttribute('aria-disabled') === 'true' ? '(disabled)' : ''}`).join(', '));
const openEdit = async (name) => { await go('/administration/staff'); await page.waitForTimeout(2000);
  const row = page.locator('tr').filter({ hasText: name }).first(); await row.scrollIntoViewIfNeeded(); log('ROW:', (await row.innerText()).replace(/\s+/g, ' '));
  await row.locator('button, i').filter({ hasText: 'edit_note' }).first().click(); await page.waitForTimeout(2500); };
await step('search', async () => { await go('/administration/staff'); const s = page.locator('main').getByText('Search', { exact: true }).first(); await s.click(); await page.waitForTimeout(600); const inp = page.locator('main input:visible').first(); log('SEARCH placeholder:', await inp.getAttribute('placeholder'), '| aria', await inp.getAttribute('aria-label')); await inp.fill('Angelica'); await page.waitForTimeout(2500); log('SEARCH rows:', await page.locator('tbody tr').count()); });
await step('edit', async () => { await openEdit('angelica.harper');
  log('EDIT TITLE+FORM:', (await dlg().innerText()).replace(/\n+/g, ' | ').slice(0, 1500)); log('EDIT TOGGLES:', await toggles());
  log('EDIT BUTTONS:', JSON.stringify((await dlg().locator('button:visible').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim())));
  log('EDIT FIELD LABELS:', JSON.stringify(await dlg().locator('.q-field__label').allTextContents()));
  const tabs = await dlg().locator('.q-tab').allInnerTexts(); log('EDIT TABS:', JSON.stringify(tabs)); await dump('edit');
  const tech = dlg().locator('.q-toggle').filter({ hasText: 'Technician' }).first();
  if ((await tech.getAttribute('aria-checked')) === 'true') { await tech.click(); await page.waitForTimeout(1000); log('after Technician off:', await toggles());
    await dlg().locator('button:visible', { hasText: 'Save & Close' }).first().click().catch(async () => await dlg().locator('button:visible', { hasText: /^Save/ }).first().click()); await page.waitForTimeout(2500);
    const w = await page.locator('.q-dialog:visible').last().innerText(); log('AFTER SAVE (warning?):', w.replace(/\n+/g, ' | ').slice(0, 1500)); await dump('warning');
    log('WARNING BUTTONS:', JSON.stringify((await page.locator('.q-dialog:visible').last().locator('button:visible').allInnerTexts()).map(s => s.trim())));
    const cancel = page.locator('.q-dialog:visible').last().locator('button:visible', { hasText: /^Cancel$/ }).first(); if (await cancel.count()) { await cancel.click(); await page.waitForTimeout(1500); log('after Cancel:', (await page.locator('.q-dialog:visible').count()), 'dialogs;', await toggles()); }
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500); log('after Escape dialogs:', await page.locator('.q-dialog:visible').count(), (await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ').replace(/\n+/g, ' | ').slice(0, 400));
  const disc = page.locator('.q-dialog:visible button', { hasText: /Discard|Leave|Yes/ }).first(); if (await disc.count()) { log('discard button:', await disc.innerText()); await disc.click(); await page.waitForTimeout(1000); }
});
await step('verify-unchanged', async () => { await go('/administration/staff'); await page.waitForTimeout(2000); log('ROW AFTER:', (await page.locator('tr').filter({ hasText: 'angelica.harper' }).first().innerText()).replace(/\s+/g, ' ')); });
await step('deactivated', async () => { await page.locator('.q-tab', { hasText: /deactivated/i }).first().click(); await page.waitForTimeout(2500); log('DEACT TAB label:', await page.locator('.q-tab', { hasText: /deactivated/i }).first().innerText()); log('DEACT TH:', JSON.stringify(await page.locator('th').evaluateAll(e => e.map(x => x.innerText.replace(/\s+/g, ' ').trim())))); log('DEACT first row:', (await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ')); await dump('deactivated', true); });
await step('roles', async () => { await go('/administration/roles-and-permissions'); await page.waitForTimeout(2500); log('ROLES URL', page.url()); log('ROLES PAGE:', (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 900)); await dump('roles', true);
  const c = page.locator('main button:visible', { hasText: /Create custom role/i }).first(); if (await c.count()) { await c.click(); await page.waitForTimeout(2000); log('CREATE ROLE:', (await page.locator('.q-dialog:visible').last().innerText()).replace(/\n+/g, ' | ').slice(0, 900)); await dump('create-role'); const tsel = page.locator('.q-dialog:visible .q-field').first(); await tsel.click().catch(() => {}); await page.waitForTimeout(1200); log('TEMPLATES:', JSON.stringify((await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()))); await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); }
  const t = (await page.locator('main').innerText()); log('has View mode:', /View mode/i.test(t)); });
await r.browser?.close?.(); process.exit(0);
