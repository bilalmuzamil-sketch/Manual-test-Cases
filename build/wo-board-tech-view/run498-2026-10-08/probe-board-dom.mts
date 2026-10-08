/** Board View markup: data-test-id families, one column header, one card, the density menu (2026-10-08). */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV, t, display, search, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all');
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
await tab(p, 'All'); await display(p, 'Board View'); await search(p, 'ZZAUTOTEST Fibridge');
const ids = await p.evaluate(`(() => { const m = {}; for (const e of document.querySelectorAll('[data-test-id]')) { const k = e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'); m[k] = (m[k] || 0) + 1; } return m; })()`);
const col = await p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="board_column_"]')].find(e => /S\\d+-\\d+/.test(e.innerText) && !/unassigned/.test(e.getAttribute('data-test-id'))); return c ? c.outerHTML.slice(0, 5000) : null; })()`);
await p.locator('[data-test-id="button_density"]').click().catch(() => {}); await p.waitForTimeout(1000);
const dens = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerHTML.slice(0, 1500))`);
await p.keyboard.press('Escape');
fs.writeFileSync(path.join(EV, 'probe-board-dom.json'), JSON.stringify({ ids, col, dens }, null, 1));
console.log(t(), JSON.stringify(ids));
await done(browser);
