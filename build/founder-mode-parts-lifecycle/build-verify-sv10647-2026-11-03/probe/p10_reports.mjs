// Probe 10 (read-only): the Reports left menu.
import { start } from './lib.mjs';
import fs from 'fs';
const { r, page, go } = await start(process.env.OUT);
await go('/reports/inventory-value'); fs.writeFileSync(process.env.OUT + '/reports-body.txt', await page.locator('body').innerText()); await page.screenshot({ path: process.env.OUT + '/reports.png' });
await r.browser.close();
