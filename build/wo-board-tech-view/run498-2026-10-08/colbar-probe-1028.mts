/** colbar-probe-1028.mts — 28 Oct 2026: positive control for SV-11835's "The scrollbars inside each column are unchanged" (PRD v81
 *  S3-E2). Reads one Board View column's inner scroller (bar width, scrollbar-width/colour CSS) on whatever GS_APP is given, so the
 *  minimap branch (sv11835) can be compared with a branch without the change (sv11567). Output EV/colbar-<host>.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
await p.locator('[data-test-id^="board_column_header_"]').first().waitFor({ timeout: 60_000 }).catch(() => {}); await p.waitForTimeout(2500);
const o = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => [...e.querySelectorAll('*')].find(x => x.scrollHeight > x.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(x).overflowY))).filter(Boolean).slice(0, 3)
  .map(c => ({ barW: c.offsetWidth - c.clientWidth, scrollable: c.scrollHeight - c.clientHeight, sbw: getComputedStyle(c).scrollbarWidth, sbc: getComputedStyle(c).scrollbarColor, cls: String(c.className).slice(0, 100) }))`);
const host = new URL(process.env.GS_APP!).host.split('.')[0]; fs.writeFileSync(path.join(EV, `colbar-${host}.json`), JSON.stringify(o, null, 1)); console.log(t(), host, JSON.stringify(o)); await done(browser);
