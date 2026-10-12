/** Read-only: Lines tab Labor rows of S10043-19185 in a normally signed-in browser (after the time entry was moved to line 2). */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'clean-tz-2026-10-12');
const { browser, page: p, APP } = await boot('sv10043', '/workorders', 'admin'); const R = {};
const r = await p.evaluate(async () => (await fetch('https://sv10043api.qa.shopview.com/api/work-orders?search=S10043-19185&pagination[rowsPerPage]=5', { credentials: 'include', headers: { Accept: 'application/json' } })).json());
const w = (r?.data?.work_orders ?? []).find((x) => Object.values(x).includes('S10043-19185'));
await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
R.labor = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`);
R.lines = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_name_"], [data-test-id^="text_line_name"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 4)`);
await p.screenshot({ path: path.join(EV, 'clean-lines-after-move.png') }); console.log('LABOR', JSON.stringify(R)); await browser.close(); process.exit(0);
