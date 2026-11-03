// Probe 02 (read-only): location box menu, Settings sidebar, imports, roles editor grid, bin locations, avatar menu. Nothing saved.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const r = await boot('sv10647', '/parts/inventory', 'admin'); const page = r.page;
async function dump(name) { await page.waitForTimeout(2500); const t = await page.locator('body').innerText();
  fs.writeFileSync(`${OUT}/${name}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log(name, page.url(), t.length); }
const step = async (n, f) => { try { await f(); } catch (e) { console.log('FAIL', n, e.message.slice(0, 120)); } };
await step('locbox', async () => { await page.getByText('Staging Heavy Duty - 9919', { exact: true }).first().click(); await dump('01-location-menu'); });
await step('settings', async () => { await page.getByText('Settings', { exact: true }).first().click(); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await dump('02-settings'); });
const side = async (label, n) => step(n, async () => { await page.locator(`text="${label}"`).first().click(); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await dump(n); });
await side('Inventory', '03-settings-inventory');
await side('Roles & Permissions', '04-roles');
await step('createrole', async () => { await page.getByRole('button', { name: /Create Custom Role/ }).first().click(); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await dump('05-create-role'); await page.goBack(); });
await side('Bin Locations', '06-bin-locations');
await side('Staff', '07-staff');
await step('avatar', async () => { await page.goto('https://sv10647.qa.shopview.com/parts/inventory'); await page.waitForTimeout(3000); await page.getByText('AS', { exact: true }).first().click(); await dump('08-avatar-menu'); });
await r.browser.close();
