/** Picture only: the lower lines of the C96960 work order (lines 5 and 6) after the drag. Read-only. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'case-retest-2026-10-12');
const S = JSON.parse(fs.readFileSync(path.join(EVD, 'seed.json'), 'utf8'));
const { browser, page: p, APP } = await boot('sv10043', '/workorders', 'admin');
await p.goto(`${APP}/workorders/${S.c96960.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
const last = p.locator('[data-test-id^="line_labor_name_"]').last(); await last.scrollIntoViewIfNeeded(); await p.waitForTimeout(1000);
const rows = await p.evaluate((L) => [...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map((e) => { const b = e.getBoundingClientRect(); return [L[e.getAttribute('data-test-id').replace('line_labor_name_', '')], e.innerText.trim(), Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }), S.c96960.labels);
await p.screenshot({ path: path.join(EVD, 'c96960-3b-lines-lower.png') }); console.log('PIC', JSON.stringify(rows)); await browser.close(); process.exit(0);
