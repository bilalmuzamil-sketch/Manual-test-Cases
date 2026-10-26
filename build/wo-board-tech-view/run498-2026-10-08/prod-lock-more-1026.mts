/** prod-lock-more-1026.mts — 26 Oct 2026, PRODUCTION (source prod-env.sh, WOB_SCALE=2). Two checks before results go into run 498:
 *  C590114 step 9: hover a Tech View row padlock (Invoiced/Paid) — is a styled tooltip shown, or only the browser's title hint?
 *    Positive control: hovering a group header count shows its styled tooltip (the reader works).
 *  C590121 step 3: hover a Board View card — where does the More actions button sit against the status pill (beside or over)?
 *  Pictures EV/P-C590114-*.png, EV/P-C590121-*.png; result EV/prod-lock-more-1026.json. Read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, display, tab, search, expandSmallGroups } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const o: any = { at: new Date().toISOString() };
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { text: e.innerText.trim(), box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], bg: cs.backgroundColor, color: cs.color }; })`) as Promise<any[]>;
await p.setViewportSize({ width: 1440, height: 900 }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
await tab(p, 'All'); await display(p, 'Tech View'); await search(p, 'ZZAUTOTEST'); await p.waitForTimeout(3000); await expandSmallGroups(p).catch(() => {}); await p.waitForTimeout(1500);
const lock = await p.evaluate(`(() => { const l = [...document.querySelectorAll('.tech-view__row-lock')].find(e => e.getBoundingClientRect().width > 0); if (!l) return null; l.scrollIntoView({ block: 'center' }); const r = l.getBoundingClientRect(); const row = l.closest('tr'); return { x: r.x, y: r.y, w: r.width, h: r.height, title: l.getAttribute('title') || (l.querySelector('[title]')||{}).getAttribute?.('title') || null, aria: l.getAttribute('aria-label'), row: row ? row.innerText.replace(/\\s+/g,' ').slice(0, 80) : null }; })()`) as any;
o.lockFound = lock;
if (lock) { await p.waitForTimeout(800); const l2 = await p.evaluate(`(() => { const l = [...document.querySelectorAll('.tech-view__row-lock')].find(e => e.getBoundingClientRect().width > 0); const r = l.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
  await p.mouse.move(5, 5); await p.waitForTimeout(400); await p.mouse.move(l2.x + l2.w / 2, l2.y + l2.h / 2, { steps: 6 }); await p.waitForTimeout(1800);
  o.s9 = { tips: await tips(), under: await p.evaluate(`(() => { const e = document.elementFromPoint(${l2.x + l2.w / 2}, ${l2.y + l2.h / 2}); return e ? e.tagName + ' title=' + (e.getAttribute('title') || (e.closest('[title]') || {}).getAttribute?.('title') || '') : null; })()`) };
  await p.screenshot({ path: path.join(EV, 'P-C590114-s9-lock-hover.png'), clip: { x: Math.max(0, l2.x - 160), y: Math.max(0, l2.y - 90), width: 700, height: 180 } });
  // positive control: a group header count's tooltip
  const cnt = await p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="tech_view_group_count_"]')].find(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y > 150); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
  if (cnt) { await p.mouse.move(5, 5); await p.waitForTimeout(400); await p.mouse.move(cnt.x + cnt.w / 2, cnt.y + cnt.h / 2, { steps: 6 }); await p.waitForTimeout(1500); o.control = await tips(); }
  o.controlCountFound = !!cnt;
  const sw = await p.evaluate(`(() => { const e = [...document.querySelectorAll('[aria-label="Board View"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`) as any;
  if (sw) { await p.mouse.move(5, 5); await p.waitForTimeout(400); await p.mouse.move(sw.x + sw.w / 2, sw.y + sw.h / 2, { steps: 6 }); await p.waitForTimeout(1500); o.control2 = await tips(); await p.mouse.move(5, 5); await p.waitForTimeout(600); }
}
// C590121: Board View card hover
await display(p, 'Board View'); await p.waitForTimeout(3500);
const card = await p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="board_card_"]')].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.y > 150 && r.y < 600 && /Approved|Estimate|Declined|Open/i.test(e.innerText); }); if (!c) return null; const r = c.getBoundingClientRect(); return { tid: c.getAttribute('data-test-id'), x: r.x, y: r.y, w: r.width, h: r.height, text: c.innerText.replace(/\\s+/g,' ').slice(0, 60) }; })()`) as any;
o.card = card;
if (card) { await p.mouse.move(5, 5); await p.waitForTimeout(400); await p.mouse.move(card.x + card.w / 2, card.y + card.h / 2, { steps: 6 }); await p.waitForTimeout(1500);
  o.s3 = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="${card.tid}"]'); const b = c.querySelector('[data-test-id="button_work_order_more_actions"]'); const s = [...c.querySelectorAll('.q-badge, [class*=status]')].find(e => e.getBoundingClientRect().width > 20 && e.getBoundingClientRect().height < 40); const bx = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x*10)/10, r: Math.round(r.right*10)/10, y: Math.round(r.y), w: Math.round(r.width), visible: getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0' }; }; const B = bx(b), S = bx(s); return { button: B, status: S, statusText: s ? s.innerText.trim() : null, overlapPx: B && S ? Math.round(Math.max(0, Math.min(B.r, S.r) - Math.max(B.x, S.x))*10)/10 : null, gapPx: B && S ? Math.round((S.x - B.r)*10)/10 : null }; })()`);
  await p.screenshot({ path: path.join(EV, 'P-C590121-s3-card-hover.png'), clip: { x: card.x - 12, y: card.y - 12, width: card.w + 24, height: card.h + 24 } });
}
fs.writeFileSync(path.join(EV, 'prod-lock-more-1026.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o));
await done(browser, 0);
