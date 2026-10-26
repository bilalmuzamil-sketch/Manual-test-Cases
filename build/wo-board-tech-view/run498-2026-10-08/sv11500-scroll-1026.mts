/** sv11500-scroll-1026.mts — 26 Oct 2026, sv11500. SV-11500 follow-up: at 1920 the "Total Price" heading reads "Tota" (clipped). Ticket's own
 *  set-up: window 1440 x 900, Tech View, All; find which element scrolls sideways, scroll it to the end (mouse wheel with Shift, then
 *  scrollLeft), and read the heading's text box vs the visible area. Two widths: 1440 and 1920. Pictures + JSON in EV. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = {};
const scan = () => p.evaluate(`(() => { const out = []; for (const e of document.querySelectorAll('*')) { if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 300) { const cs = getComputedStyle(e); out.push({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 60), sw: e.scrollWidth, cw: e.clientWidth, ox: cs.overflowX, sl: e.scrollLeft }); } } return out.slice(0, 12); })()`);
const hdr = () => p.evaluate(`(() => { const th = [...document.querySelectorAll('thead th')].find(e => /total/i.test(e.innerText)); if (!th) return null; const r = th.getBoundingClientRect(); const cs = getComputedStyle(th);
  return { text: th.innerText.trim(), cellL: Math.round(r.left), cellR: Math.round(r.right), vw: innerWidth, docSW: document.documentElement.scrollWidth, sw: th.scrollWidth, cw: th.clientWidth, ox: cs.overflow, pr: cs.paddingRight, align: cs.textAlign }; })()`);
for (const w of [1440, 1920]) {
  await p.setViewportSize({ width: w, height: 900 }); await p.goto(p.url(), { waitUntil: 'domcontentloaded' }).catch(() => {});
  await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await p.waitForTimeout(4000);
  const r: any = (o[w] = { scrollers: await scan(), before: await hdr() });
  await p.mouse.move(w / 2, 500); await p.keyboard.down('Shift'); for (let i = 0; i < 20; i++) await p.mouse.wheel(0, 400); await p.keyboard.up('Shift'); await p.waitForTimeout(1200);
  r.afterShiftWheel = await hdr(); await p.screenshot({ path: path.join(EV, `SV-11500-w${w}-after-scroll.png`) });
  await p.evaluate(`(() => { for (const e of document.querySelectorAll('*')) if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 300) e.scrollLeft = e.scrollWidth; window.scrollTo(document.documentElement.scrollWidth, window.scrollY); })()`); await p.waitForTimeout(1200);
  r.afterScrollLeft = await hdr(); r.scrollersAfter = await scan(); await p.screenshot({ path: path.join(EV, `SV-11500-w${w}-scrollleft.png`) });
}
fs.writeFileSync(path.join(EV, 'sv11500-scroll-1026.json'), JSON.stringify(o, null, 1)); console.log(t(), 'SCROLL', JSON.stringify(o).slice(0, 3500));
await done(browser);
