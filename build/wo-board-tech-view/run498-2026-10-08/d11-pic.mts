/** D11 (C368204) picture, 9 Oct 2026: open the Estimates + Assigned-to-me link, click Work Orders in the top menu, capture. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const R: any = {};
await p.goto(`${APP}/workorders?tab=estimate&assigned_to_me=1`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await p.locator('header, .q-header').first().getByText('Work Orders', { exact: true }).first().click(); await p.waitForTimeout(5000);
R.url = p.url().replace(APP, ''); R.tab = await p.evaluate(`(document.querySelector('.q-tab--active, [role=tab][aria-selected=true]')||{}).innerText`);
R.assigned = await p.locator('button:has-text("Assigned to me")').first().getAttribute('aria-pressed');
const box = async (sel: string) => { const b = await p.locator(sel).first().boundingBox(); return b ? [b.x, b.y, b.width, b.height].map(Math.round) : null; };
R.boxTab = await box('.q-tab--active'); R.boxAssigned = await box('button:has-text("Assigned to me")');
await p.screenshot({ path: path.join(EV, 'D11-top-menu-after-link.png') });
fs.writeFileSync(path.join(EV, 'd11-pic.json'), JSON.stringify(R, null, 1)); console.log(t(), JSON.stringify(R)); await done(browser);
