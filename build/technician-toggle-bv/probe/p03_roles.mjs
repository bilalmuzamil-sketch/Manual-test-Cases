import { start } from './lib.mjs';
const OUT = new URL('./03/', import.meta.url).pathname;
const { r, page, dump, step, go, dlg } = await start(OUT);
const log = (...a) => console.log(...a);
const toggles = async () => page.locator('.q-dialog:visible .q-toggle').evaluateAll(els => els.map(e => `${e.innerText.replace(/\s+/g, ' ').trim()}=${e.getAttribute('aria-checked')}${e.getAttribute('aria-disabled') === 'true' ? '(disabled)' : ''}`).join(', '));
const roleSel = () => dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /^Role$/ }) }).first();
const pick = async (field, text) => { await field.click(); await page.waitForTimeout(1000); const it = page.locator('.q-menu:visible .q-item').filter({ hasText: new RegExp('^\\s*' + text + '\\s*$') }).first(); await it.scrollIntoViewIfNeeded(); await it.click(); await page.waitForTimeout(1200); };
const hoverTip = async (name) => { const t = dlg().locator('.q-toggle').filter({ hasText: name }).first(); await t.hover(); await page.waitForTimeout(1300); const tip = (await page.locator('.q-tooltip:visible').allInnerTexts()).join(' | '); await page.mouse.move(5, 5); await page.waitForTimeout(400); return tip || '(none)'; };
const tc = () => dlg().locator('.q-toggle').filter({ hasText: 'Time Clock' }).first();
await step('new', async () => { await go('/administration/staff'); await page.getByRole('button', { name: 'New Staff Member' }).first().click(); await page.waitForTimeout(2500);
  const labels = await dlg().locator('.q-field__label').allTextContents(); log('FIELD LABELS:', JSON.stringify(labels));
  log('DEFAULT:', await toggles(), '| tip:', await hoverTip('Technician'));
  await roleSel().click(); await page.waitForTimeout(1500); const opts = (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()); log('ROLE OPTIONS:', JSON.stringify(opts)); await dump('role-menu'); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  for (const role of ['Technician', 'Foreman', 'Parts Technician', 'Parts Manager', 'Office User', 'Time Clock User', 'Service Advisor']) await step('role-' + role, async () => {
    await pick(roleSel(), role); log('ROLE', role, '->', await toggles(), '| tip:', await hoverTip('Technician'));
    const tcOn = await tc().getAttribute('aria-checked'); if (tcOn === 'false' && !(await tc().getAttribute('aria-disabled'))) { await tc().click(); await page.waitForTimeout(900); log('   after Time Clock on ->', await toggles(), '| tip:', await hoverTip('Technician')); await tc().click(); await page.waitForTimeout(900); log('   after Time Clock off ->', await toggles()); }
    else if (tcOn === 'true') { await tc().click(); await page.waitForTimeout(900); log('   after Time Clock off ->', await toggles(), '| tip:', await hoverTip('Technician')); await tc().click(); await page.waitForTimeout(900); log('   after Time Clock on again ->', await toggles()); }
  });
  await dump('new-end'); log('FORM:', (await dlg().innerText()).replace(/\n+/g, ' | '));
  const btns = await dlg().locator('button:visible').allInnerTexts(); log('DIALOG BUTTONS:', JSON.stringify(btns.map(s => s.replace(/\s+/g, ' ').trim())));
});
await r.browser?.close?.(); process.exit(0);
