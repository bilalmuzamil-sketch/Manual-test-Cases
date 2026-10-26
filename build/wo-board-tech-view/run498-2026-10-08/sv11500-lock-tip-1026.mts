/** sv11500-lock-tip-1026.mts — 26 Oct 2026 (QA lead: padlock tooltip report, "can be tested on sv11500"). C590114 step 9 on QA branch sv11500:
 *  hover the padlock of an Invoiced work order in Tech View AND on its Board View card — is a styled (dark) tooltip shown, with which words, and where?
 *  Positive control: hovering "Board View" in the display switcher opens the app's dark tooltip. 2x pictures EV/S-*.png, result EV/sv11500-lock-tip-1026.json. Read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { EV, display, tab, search, expandSmallGroups, findRow } from './wob.mts'; import { api, workOrders } from './data.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = { at: new Date().toISOString(), app: APP };
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { text: e.innerText.trim(), box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], bottom: Math.round(r.bottom), bg: cs.backgroundColor, color: cs.color }; })`) as Promise<any[]>;
await p.setViewportSize({ width: 1440, height: 900 }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || null`);
await tab(p, 'All');
const Q = 'ZZAUTOTEST DC05 Cell Styles 4583'; const ws = await workOrders(api(p), Q); const w2 = ws.find((x: any) => x.number === 'S11500-17581'); o.wo = w2 ? { id: w2.id, number: w2.number, status: w2.status ?? w2.status_name ?? null } : null;
async function hoverLock(sel: string, name: string) {
  const l = await p.evaluate(`(() => { const l = [...document.querySelectorAll('${sel}')].find(e => e.getBoundingClientRect().width > 0); if (!l) return null; l.scrollIntoView({ block: 'center', inline: 'center' }); return true; })()`);
  if (!l) return { found: false };
  await p.waitForTimeout(800);
  const b = await p.evaluate(`(() => { const l = [...document.querySelectorAll('${sel}')].find(e => e.getBoundingClientRect().width > 0); const r = l.getBoundingClientRect(); const host = l.closest('tr,[data-test-id^="board_card_"]'); return { x: r.x, y: r.y, w: r.width, h: r.height, title: l.getAttribute('title') || (l.querySelector('[title]')||{}).getAttribute?.('title') || null, row: host ? host.innerText.replace(/\\s+/g,' ').slice(0, 70) : null }; })()`) as any;
  await p.mouse.move(5, 5); await p.waitForTimeout(500); await p.mouse.move(b.x + b.w / 2, b.y + b.h / 2, { steps: 6 }); await p.waitForTimeout(1800);
  const t = await tips();
  await p.screenshot({ path: path.join(EV, `S-${name}-lock-hover.png`), clip: { x: Math.max(0, b.x - 200), y: Math.max(0, b.y - 110), width: 720, height: 220 } });
  await p.screenshot({ path: path.join(EV, `S-${name}-lock-hover-full.png`) });
  return { found: true, lock: b, tips: t, tipAbove: t.length ? t.every((x: any) => x.bottom <= b.y + 1) : null };
}
await display(p, 'Tech View'); await search(p, Q); await p.waitForTimeout(3000); await expandSmallGroups(p).catch(() => {}); await p.waitForTimeout(1500);
o.find = await findRow(p, w2.id).catch((e: any) => String(e).slice(0, 100)); await p.waitForTimeout(1200);
o.tech = await hoverLock(`[data-test-id="tech_view_row_${w2.id}"] [class*=lock]`, 'tech');
await display(p, 'Board View'); await p.waitForTimeout(3500);
o.board = await hoverLock(`[data-test-id="board_card_${w2.id}"] [class*=lock]`, 'board');
const sw = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[aria-label="Board View"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
if (sw) { await p.mouse.move(5, 5); await p.waitForTimeout(500); await p.mouse.move(sw.x + sw.w / 2, sw.y + sw.h / 2, { steps: 6 }); await p.waitForTimeout(1500); o.control = await tips(); await p.screenshot({ path: path.join(EV, 'S-control-switcher-tip.png'), clip: { x: 0, y: 0, width: 700, height: 220 } }); }
fs.writeFileSync(path.join(EV, 'sv11500-lock-tip-1026.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o));
await done(browser, 0);
