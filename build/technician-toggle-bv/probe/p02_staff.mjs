import { start } from './lib.mjs';
const OUT = new URL('./02/', import.meta.url).pathname;
const { r, page, dump, step, go, btn, dlg } = await start(OUT);
const log = (...a) => console.log(...a);
const toggles = async () => page.locator('.q-dialog:visible .q-toggle').evaluateAll(els => els.map(e => ({ label: e.innerText.replace(/\s+/g, ' ').trim(), on: e.getAttribute('aria-checked'), disabled: e.getAttribute('aria-disabled') || (e.classList.contains('disabled') ? 'class' : null) })));
await step('home', async () => { await go('/'); const top = await page.locator('header').first().innerText(); log('HEADER:', top.replace(/\s+/g, ' ')); await dump('home', true); });
await step('profile', async () => { await page.locator('[data-test-id=profile_menu_button]').click(); await page.waitForTimeout(1200); log('PROFILE MENU:', (await page.locator('.q-menu:visible').allInnerTexts()).join(' | ').replace(/\s+/g, ' ')); await dump('profile'); await page.keyboard.press('Escape'); });
await step('settings-link', async () => { const links = await page.locator('a:visible, .q-item:visible').evaluateAll(els => els.map(e => (e.innerText || '').trim() + ' -> ' + (e.getAttribute('href') || '')).filter(s => /setting|admin|staff/i.test(s))); log('SETTINGS-ish LINKS:', JSON.stringify(links)); });
await step('list', async () => { await go('/administration/staff'); await page.waitForTimeout(2500); await dump('list', true);
  const th = await page.locator('th').evaluateAll(els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim())); log('TH:', JSON.stringify(th));
  const tabs = await page.locator('.q-tab').evaluateAll(els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim())); log('TABS:', JSON.stringify(tabs));
  const left = await page.locator('aside, .q-drawer').first().innerText().catch(() => ''); log('LEFT MENU:', left.replace(/\s+/g, ' | ').slice(0, 600)); });
await step('new', async () => { await page.getByRole('button', { name: 'New Staff Member' }).first().click(); await page.waitForTimeout(2500); log('NEW TOGGLES default:', JSON.stringify(await toggles()));
  await dlg().getByText('Role', { exact: true }).first().click(); await page.waitForTimeout(1500);
  const opts = (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()); log('ROLE OPTIONS:', JSON.stringify(opts)); await dump('roles');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  for (const role of ['Technician', 'Foreman', 'Parts Technician', 'Parts Manager', 'Office User', 'Time Clock User', 'Service Advisor']) {
    await step('role-' + role, async () => { await dlg().getByText('Role', { exact: true }).first().click(); await page.waitForTimeout(1000);
      await page.locator('.q-menu:visible .q-item').filter({ hasText: new RegExp('^\\s*' + role + '\\s*$') }).first().click(); await page.waitForTimeout(1200);
      log('ROLE', role, JSON.stringify(await toggles()));
      const tech = dlg().locator('.q-toggle').filter({ hasText: 'Technician' }).first(); await tech.hover(); await page.waitForTimeout(1200);
      const tip = (await page.locator('.q-tooltip:visible').allInnerTexts()).join(' | '); log('  hover Technician tooltip:', tip || '(none)'); });
  }
  await dump('new-after-roles');
  const all = await dlg().innerText(); log('NEW FORM:', all.replace(/\n+/g, ' | ')); });
await r.browser?.close?.(); process.exit(0);
