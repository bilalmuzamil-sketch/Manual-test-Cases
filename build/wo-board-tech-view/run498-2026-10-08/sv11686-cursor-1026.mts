/** sv11686-cursor-1026.mts — 26 Oct 2026, QA branch sv11686 (SV-11686 fix check). Reads the pointer the page sets (computed CSS cursor) on:
 *  Tech View row grip (six dots), Tech View technician group header, Board View technician column header (open hand), and mid-drag on a
 *  Tech View row (closed hand). Decodes each url(data:image/svg+xml,…) to a file in EV. Read-only (drag released where it started). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = {};
await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(p.url(), { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {});
o.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const cur = (x: number, y: number) => p.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); return e ? getComputedStyle(e).cursor : null; })()`) as Promise<string | null>;
const save = (name: string, c: string | null) => { if (!c) return null; const i = c.indexOf('url("'); if (i < 0) return { raw: c.slice(0, 120) }; const j = c.indexOf('")', i + 5); const u = c.slice(i + 5, j);
  const svg = decodeURIComponent(u.replace(/^data:image\/svg\+xml(;utf8)?,/, '')); fs.writeFileSync(path.join(EV, `${name}.svg`), svg); return { file: `${name}.svg`, bytes: svg.length, tail: c.slice(j + 2).trim(), fill: (svg.match(/fill='([^']+)'/) || [])[1], stroke: (svg.match(/stroke='([^']+)'/) || [])[1], sw: (svg.match(/stroke-width='([^']+)'/) || [])[1], icon: (svg.match(/'([a-z-]+)' \(solid\)/) || [])[1] }; };
await display(p, 'Tech View'); await p.waitForTimeout(4000);
const ut = p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]'); if (await ut.count()) { await ut.click(); await p.waitForTimeout(2000); }
const grip = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-test-id^="tech_view_row_drag_handle_"]')].find(x => x.getBoundingClientRect().top > 250 && x.getBoundingClientRect().bottom < innerHeight - 20); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`) as any; o.grip = grip;
for (const k of [1, 2]) { await p.mouse.move(700, 160); await p.waitForTimeout(400); await p.mouse.move(grip.x, grip.y); await p.waitForTimeout(700); o[`techGrip${k}`] = save(`new-open-hand-tech-grip-${k}`, await cur(grip.x, grip.y)); }
const th = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-test-id^="tech_view_group_drag_handle_"]')].find(x => !/unassigned/.test(x.getAttribute('data-test-id')) && x.getBoundingClientRect().top > 200); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`) as any;
if (th) { await p.mouse.move(th.x, th.y); await p.waitForTimeout(700); o.techHeader = save('new-open-hand-tech-header', await cur(th.x, th.y)); }
await p.mouse.move(grip.x, grip.y); await p.mouse.down(); await p.mouse.move(grip.x + 30, grip.y + 10, { steps: 5 }); await p.mouse.move(grip.x + 80, grip.y + 30, { steps: 5 }); await p.waitForTimeout(500);
o.techDrag = save('new-closed-hand-tech-drag', await cur(grip.x + 80, grip.y + 30)); await p.mouse.move(grip.x, grip.y, { steps: 5 }); await p.keyboard.press('Escape'); await p.mouse.up(); await p.waitForTimeout(1500);
await display(p, 'Board View'); await p.waitForTimeout(5000);
const bh = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].find(x => !/unassigned/.test(x.getAttribute('data-test-id'))); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width * 0.55, y: r.top + r.height / 2 }; })()`) as any;
if (bh) { await p.mouse.move(bh.x, bh.y); await p.waitForTimeout(700); o.boardHeader = save('new-open-hand-board-header', await cur(bh.x, bh.y)); }
await display(p, 'Tech View').catch(() => {});
fs.writeFileSync(path.join(EV, 'sv11686-cursor-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'CURSOR', JSON.stringify(o));
await done(browser);
