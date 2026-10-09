/** Read the WORK ORDER log (⋮ > Audit Log) for S10043-18751 after the line technician adds (QA lead 9 Oct: lead changes are
 *  checked in the work order's log, not the line's). Read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const W = '414a9680-4159-49da-b134-6f16efb5ad27'; const R: any = {};
await p.goto(`${APP}/workorders/${W}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
R.menu = (await p.locator('.q-menu .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim());
await p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first().click(); await p.waitForTimeout(3000);
R.rows = await p.evaluate(`[...document.querySelectorAll('.q-dialog tbody tr')].map(r => [...r.cells].map(c => c.innerText.replace(/\\s+/g, ' ').trim()).join(' | '))`);
await p.screenshot({ path: path.join(EV, 'C96962-wo-log.png') });
fs.writeFileSync(path.join(EV, 'wo-log-probe.json'), JSON.stringify(R, null, 1)); console.log(t(), JSON.stringify(R, null, 1)); await done(browser);
