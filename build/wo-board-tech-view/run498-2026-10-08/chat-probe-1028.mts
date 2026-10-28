/** chat-probe-1028.mts — 28 Oct 2026: does the chat bubble (Intercom) load on this QA branch? For SV-11835 / C682419 step 8
 *  (PRD v81 S3-E2a: "While it shows, the chat launcher at the bottom right moves up so it never covers the minimap, as on the work
 *  order page."). Reads: every request to an intercom host (and its status), window.Intercom, the launcher element(s) and their box,
 *  on Board View and on a work order page; waits up to 25 s on each. Positive control: the minimap box on Board View.
 *  Output EV/chat-probe-1028.json + pictures EV/CHAT-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const o: any = { at: new Date().toISOString(), requests: [] as any[] };
p.on('response', (r) => { if (/intercom/i.test(r.url())) o.requests.push({ url: r.url().slice(0, 120), status: r.status() }); });
p.on('requestfailed', (r) => { if (/intercom/i.test(r.url())) o.requests.push({ url: r.url().slice(0, 120), failed: r.failure()?.errorText }); });
const read = () => p.evaluate(`(() => { const L = [...document.querySelectorAll('.intercom-launcher, .intercom-lightweight-app-launcher, #intercom-container, iframe[name*=intercom], [class*=intercom-launcher], .intercom-namespace')]
  .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: String(e.className).slice(0, 80), name: e.getAttribute('name'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
  const m = document.querySelector('[data-test-id="board_minimap"]'); const mb = m ? m.getBoundingClientRect() : null;
  return { hasIntercom: typeof window.Intercom, launchers: L, minimap: mb ? { x: Math.round(mb.x), y: Math.round(mb.y), w: Math.round(mb.width), h: Math.round(mb.height) } : null }; })()`);
await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
await p.locator('[data-test-id^="board_column_header_"]').first().waitFor({ timeout: 60_000 }).catch(() => {});
for (let i = 0; i < 5; i++) { await p.waitForTimeout(5000); o.board = await read(); if (o.board.launchers.some((l: any) => l.w > 0)) break; }
await p.screenshot({ path: path.join(EV, 'CHAT-board.png') });
const wo = await p.locator('[data-test-id^="board_card_"] a, [data-test-id^="board_card_"]').first().getAttribute('data-test-id').catch(() => null);
const id = wo?.replace('board_card_', ''); if (id) { await p.goto(process.env.GS_APP + `/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 5; i++) { await p.waitForTimeout(5000); o.woPage = await read(); if (o.woPage.launchers.some((l: any) => l.w > 0)) break; }
  await p.screenshot({ path: path.join(EV, 'CHAT-wo-page.png') }); }
fs.writeFileSync(path.join(EV, 'chat-probe-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 3000)); await done(browser);
