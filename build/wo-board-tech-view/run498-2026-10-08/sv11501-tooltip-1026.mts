/** sv11501-tooltip-1026.mts — 26 Oct 2026, QA branch sv11501 (SV-11501 fix check). Ticket steps: 1440 wide, Work Orders > All > Tech View,
 *  close Unassigned, hover the count at the right of a technician group header. Reads the tooltip's text, box and colour against the count's
 *  box (above = tooltip bottom <= count top) and against every column-header label's text box (overlap = covers a label). Two groups, each
 *  hovered twice. Pictures EV/SV-11501-hover-<n>.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = { hovers: [] };
await p.setViewportSize({ width: 1440, height: 900 }); await p.goto(p.url(), { waitUntil: 'domcontentloaded' }).catch(() => {});
await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await p.waitForTimeout(4000);
o.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const ut = p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]'); if (await ut.count()) { await ut.click(); await p.waitForTimeout(2000); }
const counts = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].map(e => ({ id: e.getAttribute('data-test-id'), n: +e.textContent.trim(), y: Math.round(e.getBoundingClientRect().y) })).filter(x => x.n > 0 && !/unassigned/.test(x.id) && x.y > 0 && x.y < innerHeight - 60).slice(0, 2)`) as any[];
o.groups = counts;
for (const [i, c] of counts.entries()) for (const k of [1, 2]) {
  await p.mouse.move(5, 5); await p.waitForTimeout(800);
  const el = p.locator(`[data-test-id="${c.id}"]`); await el.hover(); await p.waitForTimeout(1500);
  const r = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="${c.id}"]').getBoundingClientRect(); const tip = [...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).pop();
    if (!tip) return { count: { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height) }, tip: null };
    const t = tip.getBoundingClientRect(); const tb = (e) => { const rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect(); };
    const labels = [...document.querySelectorAll('thead th')].map(th => ({ text: th.innerText.trim(), r: tb(th) })).filter(l => l.text);
    const covers = labels.filter(l => !(l.r.right < t.left || l.r.left > t.right || l.r.bottom < t.top || l.r.top > t.bottom)).map(l => l.text);
    return { count: { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height) }, tip: { text: tip.innerText.trim(), x: Math.round(t.x), y: Math.round(t.y), w: Math.round(t.width), h: Math.round(t.height), bottom: Math.round(t.bottom), bg: getComputedStyle(tip).backgroundColor, color: getComputedStyle(tip).color },
      above: t.bottom <= c.top + 1, coversHeaderLabels: covers }; })()`);
  o.hovers.push({ group: c.id, attempt: k, ...(r as any) }); await p.screenshot({ path: path.join(EV, `SV-11501-hover-g${i + 1}-a${k}.png`) });
}
fs.writeFileSync(path.join(EV, 'sv11501-tooltip-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'TIP', JSON.stringify(o).slice(0, 3000));
await done(browser);
