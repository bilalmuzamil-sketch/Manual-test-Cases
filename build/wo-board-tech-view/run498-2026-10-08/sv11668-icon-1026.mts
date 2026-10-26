/** sv11668-icon-1026.mts — 26 Oct 2026, QA branch sv11668 (SV-11668 fix check). In List, Board View and Tech View, read the column-selector
 *  button (the toolbar button just left of the display switcher): its data-test-id, aria-label/tooltip, icon (svg markup hash / icon class)
 *  and icon size. Then in List open its menu and read the first options (the menu still works). Two readings each. Pictures per view. */
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = {};
await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(p.url(), { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {});
o.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const read = () => p.evaluate(`(() => { const sw = document.querySelector('[aria-label="List"]')?.closest('.q-btn-group, .q-btn-toggle, div'); const swx = sw ? sw.getBoundingClientRect().x : innerWidth;
  const btns = [...document.querySelectorAll('button, .q-btn')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.y < 200 && r.x < swx && r.x > swx - 160; });
  return btns.map(b => { const ic = b.querySelector('svg, i, img'); const r = (ic || b).getBoundingClientRect(); return { tid: b.getAttribute('data-test-id'), label: b.getAttribute('aria-label') || b.getAttribute('title') || b.innerText.trim(), iconTag: ic ? ic.tagName : null, iconCls: ic ? (ic.getAttribute('class') || '') : '', iconText: ic && ic.tagName === 'I' ? ic.textContent.trim() : '', svg: ic && ic.tagName.toLowerCase() === 'svg' ? ic.innerHTML.replace(/\\s+/g, ' ') : '', w: Math.round(r.width), h: Math.round(r.height), x: Math.round(b.getBoundingClientRect().x), y: Math.round(b.getBoundingClientRect().y), bw: Math.round(b.getBoundingClientRect().width), bh: Math.round(b.getBoundingClientRect().height) }; }); })()`) as Promise<any[]>;
for (const v of ['List', 'Board View', 'Tech View', 'List']) {
  await display(p, v); await p.waitForTimeout(3000);
  const r = (await read()).map((x) => ({ ...x, svgHash: x.svg ? crypto.createHash('md5').update(x.svg).digest('hex').slice(0, 10) : null, svg: x.svg ? x.svg.slice(0, 160) : '' }));
  (o.views ??= []).push({ view: v, buttons: r }); await p.screenshot({ path: path.join(EV, `SV-11668-${v.replace(' ', '')}-${o.views.length}.png`) });
}
// open List's column selector (the button whose label/test id mentions column/field) and read the menu
const lb = o.views[3].buttons.find((b: any) => /column|field/i.test(`${b.tid} ${b.label}`)) ?? o.views[3].buttons.slice(-1)[0];
if (lb) { await p.mouse.click(lb.x + lb.bw / 2, lb.y + lb.bh / 2); await p.waitForTimeout(2000);
  o.listMenu = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); return m ? m.innerText.replace(/\\s+/g, ' ').slice(0, 400) : null; })()`);
  await p.screenshot({ path: path.join(EV, 'SV-11668-List-menu-open.png') }); await p.keyboard.press('Escape'); }
fs.writeFileSync(path.join(EV, 'sv11668-icon-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'ICON', JSON.stringify(o).slice(0, 4000));
await done(browser);
