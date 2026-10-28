/** sv11754-board-lock-1028.mts — 28 Oct 2026, QA branch sv11754 (SV-11754 names Tech View AND Board View). Board View card padlock:
 *  pin the lead (Eva, of design-stg5 run "Cell Styles 29081") so her column sits next to Unassigned, search the customer, hover the
 *  padlock on the Invoiced card S11754-17581: dark tooltip with "Invoiced · can't be reassigned" above it? Positive control: the
 *  switcher's Board View tooltip. Preference put back. Output EV/sv11754-board-lock-1028.json, EV/SV11754-board-lock.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const o: any = {}; const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const Q = 'ZZAUTOTEST DC05 Cell Styles 29081';
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { text: e.innerText.trim(), box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], bottom: Math.round(r.bottom), bg: cs.backgroundColor, color: cs.color }; })`) as Promise<any[]>;
try {
  const w2 = (await workOrders(a, Q)).find((x: any) => x.number === 'S11754-17581'); o.wo = w2?.number;
  const lead = (await a.get(`/api/work-orders/view/${w2.id}`)).body?.data?.work_order?.tech_assigned_id; o.leadId = !!lead;
  o.pin = (await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [lead] } })).status;
  await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await W(2000); await search(p, Q); await W(3000);
  const card = p.locator(`[data-test-id="board_card_${w2.id}"]`).first(); o.cardFound = await card.count();
  if (o.cardFound) { await card.scrollIntoViewIfNeeded().catch(() => {}); await W(800);
    const lock = await card.evaluate((e) => { const l = [...e.querySelectorAll('svg, i, [class*="lock"]')].find((x) => /lock/i.test((x.getAttribute('class') || '') + (x.textContent || '') + (x.getAttribute('data-test-id') || ''))) as HTMLElement | undefined; if (!l) return null; const r = l.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, title: l.getAttribute('title') || (l.closest('[title]') as HTMLElement | null)?.getAttribute('title') || null, aria: l.getAttribute('aria-label') || (l.closest('[aria-label]') as HTMLElement | null)?.getAttribute('aria-label') || null }; });
    o.lock = lock;
    if (lock) { await p.mouse.move(5, 5); await W(400); await p.mouse.move(lock.x + lock.w / 2, lock.y + lock.h / 2, { steps: 6 }); await W(1800); o.lockTips = await tips(); o.tipAbove = (o.lockTips[0]?.bottom ?? 9999) <= lock.y + 2;
      const b = await card.boundingBox(); await p.screenshot({ path: path.join(EV, 'SV11754-board-lock.png'), clip: { x: Math.max(0, (b?.x ?? 0) - 40), y: Math.max(0, lock.y - 80), width: 520, height: (b?.height ?? 200) + 120 } }); }
  }
  const sw = p.locator('[aria-label="Board View"]').first(); await p.mouse.move(5, 5); await W(400); await sw.hover(); await W(1500); o.control = await tips();
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
o.restore = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(path.join(EV, 'sv11754-board-lock-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o)); await done(browser);
