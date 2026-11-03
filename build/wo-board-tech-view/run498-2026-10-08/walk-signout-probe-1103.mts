/** walk-signout-probe-1103.mts — 3 Nov 2026, production v26.45.0. Three C682419 runs were signed out ~60 s in, during the sideways
 *  walk over Truck Hill 1's 143 columns; an idle session (idle-session-probe-1103) stayed on Work Orders for 195 s.
 *  This walks Board View like allBoardCols() (900 px steps, 400 ms) and records every response with status 401/403/419/440 (URL,
 *  method, time), the scrollLeft and the visible column names at each step, and the first moment the page shows the sign-in form.
 *  Positive control: the same response listener sees the board's own 200s (counted). Output EV/walk-probe.json + pictures. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, display } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const t0 = Date.now(); const s = () => Math.round((Date.now() - t0) / 100) / 10;
const bad: any[] = []; let ok200 = 0;
p.on('response', (r) => { const st = r.status(); if (st === 200) ok200++; if ([401, 403, 419, 440].includes(st)) bad.push({ s: s(), st, m: r.request().method(), u: r.url().slice(0, 200) }); });
const o: any = { steps: [], bad };
await display(p, 'Board View').catch((e: any) => (o.displayErr = String(e).slice(0, 120)));
await p.waitForSelector('[data-test-id^="board_column_header_"]', { timeout: 30000 }).catch(() => {});
const SC = `document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller')`;
for (let i = 0; i < 80; i++) {
  const st = await p.evaluate(`(() => { const h = ${SC}; const login = !!document.querySelector('.login-container'); if (!h) return { login, h: null };
    const b = h.scrollLeft; h.scrollLeft += 900; const names = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(e => e.textContent.trim().slice(0, 30));
    return { login, from: Math.round(b), to: Math.round(h.scrollLeft), first: names[0], last: names.at(-1), n: names.length }; })()`).catch((e: any) => ({ err: String(e).slice(0, 100) }));
  o.steps.push({ s: s(), ...(st as any), bad: bad.length }); console.log(JSON.stringify(o.steps.at(-1)));
  if ((st as any).login || (st as any).err || (st as any).h === null) { await p.screenshot({ path: path.join(EV, 'walk-signedout.png') }); break; }
  if ((st as any).from === (st as any).to) { await p.screenshot({ path: path.join(EV, 'walk-end.png') }); o.reachedEnd = true; break; }
  await p.waitForTimeout(400);
}
await p.waitForTimeout(3000); o.after = { url: p.url(), login: await p.locator('.login-container').count() };
o.ok200 = ok200; fs.writeFileSync(path.join(EV, 'walk-probe.json'), JSON.stringify(o, null, 1));
console.log('BAD', JSON.stringify(bad).slice(0, 1500)); console.log('AFTER', JSON.stringify(o.after), 'ok200', ok200);
await done(browser);
