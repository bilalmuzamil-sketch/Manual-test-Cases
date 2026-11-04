import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import fs from 'fs';
const OUT = new URL('./02/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const r = await boot2('admin', { route: '/administration' }); const page = r.page; page.setDefaultTimeout(15000);
const log = (...a) => console.log(...a); const T = s => s.replace(/\s+/g, ' ').trim();
await page.waitForTimeout(3000); log('URL', page.url());
const links = await page.locator('a:visible, .q-item:visible, .q-tab:visible').evaluateAll(els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)); log('NAV:', JSON.stringify(links.slice(0, 70)));
const b = T(await page.locator('body').innerText()); for (const s of ['Require Approval for New Lines', 'Canned Lines', 'SERVICE', 'Save Settings']) { const i = b.indexOf(s); log(s, '=>', i >= 0 ? b.slice(Math.max(0, i - 80), i + 80) : 'not on this page'); }
await page.screenshot({ path: OUT + '01-settings.png' });
await page.locator('main a:visible, main .q-tab:visible, .q-tab:visible').filter({ hasText: /^\s*info\s*Settings\s*$/ }).first().click(); await page.waitForTimeout(3000); log('SETTINGS TAB URL', page.url());
const inner = await page.locator('main .q-tab:visible').allInnerTexts(); log('INNER TABS:', JSON.stringify(inner.map(T)));
const wt = page.locator('main .q-tab:visible').filter({ hasText: /Work Orders/ }).first(); if (await wt.count()) { await wt.click(); await page.waitForTimeout(2500); }
{ const t = T(await page.locator('main').innerText()); const i = t.indexOf('Require Approval for New Lines'); log('ctx:', i >= 0 ? t.slice(i - 80, i + 100) : 'not found'); log('Save Settings:', await page.locator('main button:visible', { hasText: 'Save Settings' }).count()); log('state:', await page.locator('.q-toggle, .q-checkbox').filter({ hasText: 'Require Approval for New Lines' }).first().getAttribute('aria-checked').catch(() => 'n/a')); await page.screenshot({ path: OUT + '02-wo-settings.png' }); }
const cl = page.locator('a:visible, .q-item:visible, .q-tab:visible').filter({ hasText: /Canned Lines/ }).first(); if (await cl.count()) { await cl.click(); await page.waitForTimeout(3000); log('CANNED URL', page.url(), '| head:', T(await page.locator('main').innerText()).slice(0, 200)); }
await r.browser?.close?.(); process.exit(0);
