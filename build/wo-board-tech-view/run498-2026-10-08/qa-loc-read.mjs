/** Read-only: the QA branch's Administration > Locations rows (name + time zone), normal sign-in. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'ah-retest-2026-10-12');
const { browser, page: p, APP } = await boot('sv10043', '/administration/locations', 'admin');
await p.goto(`${APP}/administration/locations`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
const rows = (await p.locator('tbody tr').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 140)).filter((x) => /Heavy|Leth|Foothill|Dubai|Edmonton|Asia|America/i.test(x)).slice(0, 12);
await p.screenshot({ path: path.join(EV, 'qa-locations.png') }); console.log('LOCS', JSON.stringify(rows)); await browser.close(); process.exit(0);
