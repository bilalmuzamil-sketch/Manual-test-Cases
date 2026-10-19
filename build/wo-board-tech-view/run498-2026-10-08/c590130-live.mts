/** c590130-live.mts — 19 Oct 2026, LIVE re-test of C590130 ("Lead technician updated message looks as in the design").
 *  Set-up (Rule 107): technician "ZZAUTOTEST DC21 Dee Toast" (reused), customer "ZZAUTOTEST DC21 Toast <n>" made now, one Estimate with no
 *  lead and no approved line (it sits in Unassigned). The technician is pinned for the signed-in Admin so the column sits next to
 *  Unassigned; the case's customer is typed in Search so the card is found (pins and search put back at the end). Window 1440 x 900.
 *  Step 2: the card dragged from Unassigned into the technician's column (press, move, release). A watcher started BEFORE the press records
 *  every message (.q-notification) the moment it appears and when it goes, in ms since the release. Step 3: the message read the moment
 *  it appears (words, box and place against the window, background, corners, shadow, icon and its colour, close control) and a picture
 *  taken at once (2x with QA_DPR=2). Step 4: the mouse is parked at the top-left corner (never over the message) and the message is
 *  watched for 12 s; when it goes, the time is recorded. The PRD (v64 §9 User Feedback Summary) says "Lead technician updated" — "Success
 *  toast, auto-fades"; S4-R16 "Success toasts dismiss automatically". Output EV/c590130-live.json, pictures EV/C590130-live-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, tab, display, search } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
const W = (ms: number) => p.waitForTimeout(ms); const RUN = String(Date.now() % 100000);
const PREF = '/api/users/me/preferences/work-orders-list';
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C590130-live-${n}.png`) }).catch(() => {});
const PV0 = (await a.get(PREF)).body?.data?.value ?? {};
try {
  const TECH = (await roleIds(a))['Technician'];
  const T = (await person(a, 'ZZAUTOTEST DC21', 'Dee Toast', { role: TECH, email: `zz.wob.dc21.dee${'@staging.shopview.local'}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = await ensureEligible(a, T, 'Technician-A');
  const CUST = `ZZAUTOTEST DC21 Toast ${RUN}`; const c = await customer(a, CUST, 'DC21'); const w1 = await workOrder(a, c, 'estimate', null);
  const n1 = (await workOrders(a, CUST)).find((x: any) => x.id === w1); o.wo = { number: n1?.number, status: n1?.status, lead: n1?.techAssignedFirstName ?? 'none' };
  o.pin = (await a.put(PREF, { value: { ...PV0, pinnedTechnicianIds: [T.staff_id], filters: {}, density: 'regular' } })).status;
  console.log(t(), 'START STATE set C590130', JSON.stringify({ customer: CUST, wo: o.wo, technician: 'ZZAUTOTEST DC21 Dee Toast', pinned: o.pin }));
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await search(p, CUST); await W(3000);
  const card = p.locator(`[data-test-id="board_card_${w1}"]`).first(), col = p.locator(`[data-test-id="board_column_${T.staff_id}"]`).first();
  const cb = await card.boundingBox(), tb = await col.boundingBox(); o.boxes = { card: cb, column: tb };
  if (!cb || !tb) throw new Error(`card ${!!cb} / column ${!!tb} not on screen`);
  await shot('s1-board');
  // the watcher: every message's appearance and departure, in ms since window.__t0 (set at the release)
  await p.evaluate(`(() => { window.__n = []; window.__t0 = null; const now = () => window.__t0 === null ? null : Math.round(performance.now() - window.__t0);
    const scan = () => { const live = [...document.querySelectorAll('.q-notification')]; for (const e of live) { if (!e.__zz) { e.__zz = 1; window.__n.push({ text: e.innerText.replace(/\\s+/g, ' ').trim(), shownAt: now(), goneAt: null, el: e }); } }
      for (const x of window.__n) if (x.goneAt === null && !document.contains(x.el)) x.goneAt = now(); };
    window.__mo2 = new MutationObserver(scan); window.__mo2.observe(document.body, { childList: true, subtree: true }); })()`);
  const read = () => p.evaluate(`(() => { const e = document.querySelector('.q-notification'); if (!e) return null; const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    const icon = e.querySelector('.q-notification__icon, i, svg'); const is = icon ? getComputedStyle(icon) : null; const close = [...e.querySelectorAll('button, [role=button], .q-btn')].map(b => ({ text: b.innerText.trim(), aria: b.getAttribute('aria-label') }));
    return { text: e.innerText.replace(/\\s+/g, ' ').trim(), box: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }, fromRight: Math.round(innerWidth - r.right), fromBottom: Math.round(innerHeight - r.bottom), window: { w: innerWidth, h: innerHeight },
      background: s.backgroundColor, color: s.color, radius: s.borderRadius, shadow: s.boxShadow.slice(0, 60), border: s.border, icon: icon ? { tag: icon.tagName, text: (icon.textContent || '').trim(), color: is.color, fill: is.fill } : null, closeControls: close, cls: String(e.className).slice(0, 80) }; })()`).catch(() => null);
  // step 2: drag, release
  const gx = cb.x + cb.width * 0.45, gy = cb.y + cb.height / 2;
  await p.mouse.move(gx, gy); await p.mouse.down(); await p.mouse.move(gx, gy + 8, { steps: 4 }); await p.mouse.move(tb.x + tb.width / 2, tb.y + 140, { steps: 20 }); await W(400);
  await p.mouse.up(); await p.evaluate('window.__t0 = performance.now()');
  await p.mouse.move(2, 2);   // step 4: never over the message
  // a question about shifts would come first; this estimate has none, so none is expected (read anyway)
  o.dialogAfterDrop = await p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count();
  // step 3: the moment the message appears
  let first: any = null; for (let i = 0; i < 40 && !first; i++) { first = await read(); if (!first) await W(100); }
  o.s3 = { message: first, seenAfterMs: await p.evaluate('Math.round(performance.now() - window.__t0)') }; await shot('s3-message');
  console.log(t(), 'C590130 step 3 message', JSON.stringify(o.s3));
  // step 4: 12 s, mouse parked away; when does it go?
  o.s4 = { samples: [] as string[] };
  for (let i = 0; i < 48; i++) { await W(250); const ms = await p.evaluate('Math.round(performance.now() - window.__t0)') as number; const on = (await p.locator('.q-notification').count()) > 0; if (i % 4 === 0) o.s4.samples.push(`${ms}ms ${on ? 'shown' : 'gone'}`); if (!on) { o.s4.goneByMs = ms; break; } if (i === 19) await shot('s4-at-5s'); }
  await shot('s4-end');
  o.watch = await p.evaluate('window.__n.map(x => ({ text: x.text, shownAt: x.shownAt, goneAt: x.goneAt }))');
  o.s4.disappearedByItself = o.s4.goneByMs !== undefined; o.lead = ((await workOrders(a, CUST)).find((x: any) => x.id === w1)?.techAssignedFirstName ?? 'none');
  console.log(t(), 'C590130 step 4', JSON.stringify({ disappeared: o.s4.disappearedByItself, goneByMs: o.s4.goneByMs ?? null, watch: o.watch, lead: o.lead }));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
o.restorePrefs = (await a.put(PREF, { value: PV0 })).status;
fs.writeFileSync(path.join(EV, 'c590130-live.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C590130', JSON.stringify(o).slice(0, 2500)); await done(browser);
