/** c682419-s8s9-prod-1103.mts — 3 Nov 2026, production v26.45.0 (SV-11835 Done). The two C682419 steps the full minimap run
 *  (sv11835-minimap-1028.mts) could not judge on production:
 *   Step 8 "the chat bubble sits above the minimap and does not cover it" — PRD v82 S3-E2a: "While it shows, the chat launcher at the
 *     bottom right moves up so it never covers the minimap, as on the work order page." Run with WOB_NOBLOCK=1 so the chat widget may
 *     load. Reads every intercom request + status, window.Intercom and every launcher element (25 s wait) on Board View AND on a work
 *     order page (the PRD's own reference) — the work order page is the positive control: if no launcher shows there either, the chat
 *     widget is not shown to this account at all and step 8 cannot be judged with it.
 *   Step 9 "Change to location B … every column fits, and there is no minimap and no sideways scroll bar" — walks this user's other
 *     locations (/api/staff/my-workplaces), measures the board (scrollWidth vs clientWidth = positive control for "fits") and the
 *     minimap at each, pictures the first one where every column fits. Location put back to Truck Hill 1 (HEAVY) after.
 *  Output EV/c682419-s8s9.json + pictures EV/C682419-*.png */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t, display, tab } from './wob.mts'; import { HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { at: new Date().toISOString(), requests: [] as any[], locs: [] as any[] }; const save = () => fs.writeFileSync(path.join(EV, 'c682419-s8s9.json'), JSON.stringify(o, null, 1));
p.on('response', (r) => { if (/intercom/i.test(r.url())) o.requests.push({ url: r.url().slice(0, 120), status: r.status() }); });
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || null`).catch(() => null);
const read = () => p.evaluate(`(() => { const L = [...document.querySelectorAll('.intercom-launcher, .intercom-lightweight-app-launcher, #intercom-container, iframe[name*=intercom], [class*=intercom-launcher], .intercom-namespace, [aria-label*="Intercom" i], [aria-label*="chat" i]')]
  .map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: String(e.className).slice(0, 80), aria: e.getAttribute('aria-label'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
  const m = document.querySelector('[data-test-id="board_minimap"]'); const mb = m ? m.getBoundingClientRect() : null;
  return { hasIntercom: typeof window.Intercom, launchers: L, minimap: mb && mb.width > 0 ? { x: Math.round(mb.x), y: Math.round(mb.y), w: Math.round(mb.width), h: Math.round(mb.height) } : null }; })()`);
const board = async () => { await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View').catch(() => {});
  await p.locator('[data-test-id^="board_column_header_"]').first().waitFor({ timeout: 60_000 }).catch(() => {}); await p.waitForTimeout(2000); };
const header = () => p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => '');
try {
  // ---- step 8 on Board View, then the work order page (positive control)
  await board(); for (let i = 0; i < 5; i++) { await p.waitForTimeout(5000); o.s8board = await read(); if (o.s8board.launchers.some((l: any) => l.w > 0)) break; }
  await p.screenshot({ path: path.join(EV, 'C682419-s8-board.png') }); save();
  const id = (await p.locator('[data-test-id^="board_card_"]').first().getAttribute('data-test-id').catch(() => null))?.replace('board_card_', '');
  if (id) { await p.goto(process.env.GS_APP + `/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 5; i++) { await p.waitForTimeout(5000); o.s8woPage = await read(); if (o.s8woPage.launchers.some((l: any) => l.w > 0)) break; }
    await p.screenshot({ path: path.join(EV, 'C682419-s8-wo-page.png') }); }
  save();
  // ---- step 9: other locations
  const wp = (await a.get('/api/staff/my-workplaces')).body?.data; const places: any[] = Array.isArray(wp) ? wp : wp?.collection ?? wp?.workplaces ?? [];
  o.places = places.map((w: any) => ({ id: w.id ?? w.workplace_id, name: w.name }));
  for (const w of o.places.filter((w: any) => w.id !== HEAVY)) {
    const st = (await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' })).status;
    await board(); const m = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); const mm = document.querySelector('[data-test-id="board_minimap"]'); const mb = mm ? mm.getBoundingClientRect() : null;
      return { cols: document.querySelectorAll('[data-test-id^="board_column_header_"]').length, scrollWidth: h ? h.scrollWidth : null, clientWidth: h ? h.clientWidth : null, barH: h ? h.offsetHeight - h.clientHeight : null, minimap: mb && mb.width > 0 ? { w: Math.round(mb.width), h: Math.round(mb.height) } : null }; })()`);
    const rec = { ...w, change: st, header: await header(), ...m, fits: m.scrollWidth != null && m.scrollWidth <= m.clientWidth + 2 }; o.locs.push(rec); console.log(t(), JSON.stringify(rec)); save();
    if (rec.fits && rec.cols > 1) { await p.screenshot({ path: path.join(EV, 'C682419-s9-location-b.png') }); o.s9 = rec; break; }
    if (o.locs.length >= 8) break;
  }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await p.screenshot({ path: path.join(EV, 'C682419-error.png') }).catch(() => {}); }
o.restore = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' }).catch(() => ({ status: 'ERR' }))).status;
save(); console.log(t(), JSON.stringify({ s8board: o.s8board, s8woPage: o.s8woPage, req: o.requests.length, s9: o.s9, restore: o.restore }).slice(0, 2500)); await done(browser);
