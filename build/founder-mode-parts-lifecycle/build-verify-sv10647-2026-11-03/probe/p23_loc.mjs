// Probe 23 (read-only): which location the shared Admin is on, and whether the probe-18 work order opens.
import { start } from './lib.mjs';
import fs from 'fs';
const { r, page } = await start(process.env.OUT);
const prof = await page.locator('[data-test-id=profile_menu_button]:visible').first().innerText(); console.log('profile box:', prof.replace(/\n/g, ' | '));
await page.goto(JSON.parse(fs.readFileSync('probe/18/wo-url.json', 'utf8'))); await page.waitForTimeout(5000); console.log('wo url now:', page.url());
await r.browser.close();
