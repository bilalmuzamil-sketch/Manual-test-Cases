/** sv11838-more-1028.mts — 28 Oct 2026, QA branch sv11838 (SV-11838, Branko Cicovic: "Fix the placement and shape for the more icon",
 *  design vs staging pictures on the ticket). C590121 run whole: work orders of design-stg5's run on this branch (S11838-17580 Approved,
 *  S11838-17581 Invoiced, lead "ZZAUTOTEST DC12 Rae Menu"). The lead is pinned so the cards are drawn (L0430). For the … button the
 *  measurement is geometric: its box, corner radius, border, background; the status label's box; whether they OVERLAP (PRD v81 S3-R13:
 *  "to the left of the status label, and never covers it"; the design draws it over the label's right end) and whether the button is
 *  square (the ticket's "shape"). Positive controls: no button before hover; the menu opens. Pictures EV/SV11838-*.png (2x).
 *  Output EV/sv11838-more-1028.json. Preference put back. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const o: any = { at: new Date().toISOString() }; const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`) as Promise<string[]>;
const box = (sel: string, root = 'document') => p.evaluate(([s, r]) => { const R = r === 'document' ? document : document.querySelector(r); const e = R?.querySelector(s) as HTMLElement | null; if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e);
  return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), r: Math.round(b.right), radius: cs.borderRadius, border: cs.border, bg: cs.backgroundColor, shadow: cs.boxShadow, visible: cs.visibility !== 'hidden' && cs.opacity !== '0' && b.width > 0 }; }, [sel, root]);
async function moreBtn(host: string) { return p.evaluate((h) => { const H = document.querySelector(h); if (!H) return null; const btns = [...H.querySelectorAll('button')].filter((b) => /more|…|\.\.\./i.test((b.getAttribute('aria-label') || '') + (b.getAttribute('data-test-id') || '') + b.textContent) || b.querySelector('svg.lucide-ellipsis, svg[class*="ellipsis"], i'));
  const vis = btns.map((b) => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); let op = 1; let e: HTMLElement | null = b; while (e) { op *= parseFloat(getComputedStyle(e).opacity); e = e.parentElement; }
    return { tid: b.getAttribute('data-test-id'), aria: b.getAttribute('aria-label'), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), radius: cs.borderRadius, border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor, bg: cs.backgroundColor, opacity: op, visible: r.width > 0 && op > 0.05 && cs.visibility !== 'hidden' }; });
  const st = [...H.querySelectorAll('[class*="status"], .q-badge, [data-test-id*="status"]')].map((e) => { const r = (e as HTMLElement).getBoundingClientRect(); return { text: (e as HTMLElement).innerText.trim(), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right) }; }).filter((s) => s.w > 0 && s.text);
  return { btns: vis, status: st }; }, host); }
const overlap = (b: any, s: any) => b && s && !(b.right <= s.x || s.right <= b.x || b.y + b.h <= s.y || s.y + s.h <= b.y);
const menu = async () => p.locator('.q-menu').last().evaluate((m) => { const r = m.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), right: Math.round(r.right), items: [...m.querySelectorAll('.q-item')].map((i) => ({ text: (i as HTMLElement).innerText.replace(/\s+/g, ' ').trim(), disabled: i.classList.contains('disabled') || i.getAttribute('aria-disabled') === 'true' || i.classList.contains('q-item--disabled'), icon: !!i.querySelector('svg, i') })) }; }).catch(() => null);
try {
  const w1 = (await workOrders(a, 'S11838-17580'))[0], w2 = (await workOrders(a, 'S11838-17581'))[0]; o.wos = [w1?.number, w2?.number];
  const lead = (await a.get(`/api/work-orders/view/${w1.id}`)).body?.data?.work_order?.tech_assigned_id; o.pin = (await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [lead] } })).status;
  const cust = (await a.get(`/api/work-orders/view/${w1.id}`)).body?.data?.work_order; const Q = cust?.customer_name ?? cust?.customer?.name ?? 'ZZAUTOTEST DC12'; o.q = Q;
  await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await W(2000); await search(p, 'ZZAUTOTEST DC12'); await W(3000);
  const C1 = `[data-test-id="board_card_${w1.id}"]`; o.cardFound = await p.locator(C1).count(); await p.locator(C1).first().scrollIntoViewIfNeeded().catch(() => {}); await p.mouse.move(5, 5); await W(800);
  o.s2 = { card: await box(C1), more: await moreBtn(C1) }; const cb = o.s2.card;
  await p.screenshot({ path: path.join(EV, 'SV11838-s2-card.png'), clip: { x: Math.max(0, cb.x - 20), y: Math.max(0, cb.y - 20), width: cb.w + 40, height: Math.min(cb.h + 40, 320) } });
  await p.mouse.move(cb.x + cb.w / 2, cb.y + cb.h / 2, { steps: 5 }); await W(1200);
  o.s3 = { card: await box(C1), more: await moreBtn(C1) }; const vb = (o.s3.more?.btns ?? []).find((b: any) => b.visible); const sl = (o.s3.more?.status ?? [])[0];
  o.s3.button = vb ?? null; o.s3.statusLabel = sl ?? null; o.s3.overlapsStatus = overlap(vb, sl); o.s3.leftOfStatus = vb && sl ? vb.right <= sl.x : null; o.s3.square = vb ? Math.abs(vb.w - vb.h) <= 2 : null;
  await p.screenshot({ path: path.join(EV, 'SV11838-s3-card-hover.png'), clip: { x: Math.max(0, cb.x - 20), y: Math.max(0, cb.y - 20), width: cb.w + 40, height: Math.min(cb.h + 40, 320) } });
  if (vb) { await p.mouse.click(vb.x + vb.w / 2, vb.y + vb.h / 2); await W(1000); o.s4 = await menu(); await p.screenshot({ path: path.join(EV, 'SV11838-s4-card-menu.png'), clip: { x: Math.max(0, cb.x - 20), y: Math.max(0, cb.y - 20), width: cb.w + 120, height: 420 } }); await p.keyboard.press('Escape'); await W(600); }
  // ---- Tech View
  await display(p, 'Tech View'); await W(2500);
  const R1 = `[data-test-id="tech_view_row_${w1.id}"]`; o.rowFound = await p.locator(R1).count(); await p.locator(R1).first().scrollIntoViewIfNeeded().catch(() => {}); await W(600);
  const rb = await box(R1); if (rb) { await p.mouse.move(rb.x + 400, rb.y + rb.h / 2, { steps: 5 }); await W(1000); o.s7 = { row: await box(R1), more: await moreBtn(R1) };
    const tb = (o.s7.more?.btns ?? []).find((b: any) => b.visible); o.s7.button = tb ?? null; o.s7.square = tb ? Math.abs(tb.w - tb.h) <= 2 : null;
    await p.screenshot({ path: path.join(EV, 'SV11838-s7-row-hover.png'), clip: { x: Math.max(0, (tb?.x ?? 1400) - 700), y: Math.max(0, rb.y - 30), width: 900, height: rb.h + 60 } });
    if (tb) { await p.mouse.click(tb.x + tb.w / 2, tb.y + tb.h / 2); await W(1000); o.s8 = await menu(); await p.keyboard.press('Escape'); await W(600); } }
  const R2 = `[data-test-id="tech_view_row_${w2.id}"]`; await p.locator(R2).first().scrollIntoViewIfNeeded().catch(() => {}); const rb2 = await box(R2);
  if (rb2) { await p.mouse.move(rb2.x + 400, rb2.y + rb2.h / 2, { steps: 5 }); await W(1000); const m2 = await moreBtn(R2); const tb2 = (m2?.btns ?? []).find((b: any) => b.visible);
    if (tb2) { await p.mouse.click(tb2.x + tb2.w / 2, tb2.y + tb2.h / 2); await W(1000); o.s10 = await menu();
      const it = p.locator('.q-menu').last().locator('.q-item').filter({ hasText: /lead technician/i }).first(); const ib = await it.boundingBox(); if (ib) { await p.mouse.move(ib.x + ib.width / 2, ib.y + ib.height / 2, { steps: 4 }); await W(1500); o.s11 = await tips(); }
      await p.screenshot({ path: path.join(EV, 'SV11838-s10-locked-menu.png'), clip: { x: Math.max(0, tb2.x - 360), y: Math.max(0, rb2.y - 60), width: 640, height: 360 } }); await p.keyboard.press('Escape'); } }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await p.screenshot({ path: path.join(EV, 'SV11838-error.png') }).catch(() => {}); }
o.restore = (await a.put(PREF, { value: ORIGINAL })).status; fs.writeFileSync(path.join(EV, 'sv11838-more-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 6000)); await done(browser);
