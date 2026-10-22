// prod-feature-check-1022.mjs — 22 Oct 2026: has the WO Board / Tech View release reached PRODUCTION? Second admin test account
// (prod-login.env), never the QA lead's. Reads the app-version, then Work Orders: is the display switcher (List / Tech View / Board View)
// there, and does Board View draw columns? Positive control: the Work Orders page itself (Create Work Order button) must be read.
// Output evidence/prod-2026-10-22/prod-feature-check.json + pictures. Values never printed.
import fs from 'fs'; import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-22'); fs.mkdirSync(EV, { recursive: true });
const { browser, page: p, version } = await bootProdLogin('/workorders', { deviceScaleFactor: 2, viewport: { width: 1440, height: 900 } });
const R = { at: new Date().toISOString(), version };
await p.waitForTimeout(6000);
R.workOrdersPage = await p.locator('button:has-text("Create Work Order")').count();
R.switcher = await p.evaluate(`['List','Tech View','Board View'].map(l => [l, document.querySelectorAll('[aria-label="' + l + '"]').length])`);
R.location = await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
await p.screenshot({ path: path.join(EV, 'prod-workorders.png') });
const bv = p.locator('[aria-label="Board View"]').first();
if (await bv.count()) { await bv.click().catch(() => {}); await p.waitForTimeout(5000); R.boardColumns = await p.locator('[data-test-id^="board_column_header_"]').count(); await p.screenshot({ path: path.join(EV, 'prod-board-view.png') }); }
const tv = p.locator('[aria-label="Tech View"]').first();
if (await tv.count()) { await tv.click().catch(() => {}); await p.waitForTimeout(5000); R.techGroups = await p.locator('[data-test-id^="tech_view_group_name_"]').count(); await p.screenshot({ path: path.join(EV, 'prod-tech-view.png') }); }
const lv = p.locator('[aria-label="List"]').first(); if (await lv.count()) { await lv.click().catch(() => {}); await p.waitForTimeout(2500); }
fs.writeFileSync(path.join(EV, 'prod-feature-check.json'), JSON.stringify(R, null, 1)); console.log('PRODCHECK', JSON.stringify(R));
await browser.close();
