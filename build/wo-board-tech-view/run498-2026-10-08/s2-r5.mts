/**
 * s2-r5.mts — 17 Oct 2026, ROUND 5 of the run 498 fix-ups on STAGING: C96936 alone (ONLY=C96936), "A lead changed elsewhere moves the work
 * order to its new group on refresh". Step 5 (tab B, the work order page): the work order has no lines, so a New Line window opens over
 * the page; it is now closed with its X (the close question answered, both logged) BEFORE the Lead Technician control is looked for, and
 * the control is found by its label text, never button_toggle_vehicle_here. Ralph Edwards is typed into the field first (pickLeadTyped),
 * then the old list pick; the old logged fallback for SV-11393 stays. Everything else is s2-batchB.mts's code, copied unchanged (lines 6-44
 * and the C96936 block; only the start tag, output file, picture names and the step-5 lines named above changed).
 * Output EV/s2-r5-<ONLY>.json; pictures EV/C96936-r5-*.png. Records only.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder } from './data.mts';
import { staffRows } from './staff.mts';
import { pickTech } from './fx6-1017.mts';
import { startState } from './fixup-1017.mts';
import { EV, t, shot, display, tab, search, groups, toggleGroup, read, columnHeads, switchLocUI, pickLeadTyped } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
await startState(p, a, 's2-r5');   // L0415, fix-up 2
const techs = await candidates(a);
const by = (n: string) => techs.find((x) => x.name === n)!;
const tA = by('Ayesha Khan'), tB = by('Bilal Muzamil'), me = by('Admin ShopView');
const free = techs.filter((x) => x.open === 0 && x.name !== 'Admin ShopView');
console.log(t(), 'technicians with no open work', free.slice(0, 6).map((x) => x.name).join(', '));
const HEAVY = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const tv = async (name: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Tech View'); if (name) await search(p, name); };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1800));
  fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
}
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
async function scrollToGroup(id: string) {
  for (let i = 0; i < 40; i++) {
    if (await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).count()) { await p.locator(`[data-test-id="tech_view_group_${id}"]`).scrollIntoViewIfNeeded(); return true; }
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 600`); await p.waitForTimeout(500);
  }
  return false;
}

const OUT5 = path.join(EV, `s2-r5${only.length ? '-' + only.join('-') : ''}.json`);

await run('C96936', async () => {
  const n = 'ZZAUTOTEST F2 Refresh Lead'; const o: any = {}; R.C96936 = o;
  const D = '@staging.shopview.local'; const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x: any) => x.email === `zz.wob.${e}${D}`);
  const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'); if (!ES || !RE) throw new Error(`technicians not found: Esther ${!!ES}, Ralph ${!!RE}`);
  const leadOfW = (w: any) => w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none';
  let have = (await workOrders(a, n)).filter((w: any) => !w.companyName || w.companyName === n);
  console.log(t(), 'START STATE found C96936', JSON.stringify(have.map((w: any) => `${w.number} ${w.status} lead=${leadOfW(w)}`)));
  const c = await customer(a, n, 'TRK-118'); const approved = () => have.filter((w: any) => /^approved$/i.test(String(w.status)));
  for (let k = approved().length; k < 5; k++) await workOrder(a, c, 'approved', null);
  have = (await workOrders(a, n)).filter((w: any) => !w.companyName || w.companyName === n);
  const five = approved().sort((x: any, y: any) => String(x.number).localeCompare(String(y.number), undefined, { numeric: true })).slice(0, 5);
  o.setLeads = [];
  for (const [i, w] of five.entries()) { const want = i < 3 ? ES.staff_id : RE.staff_id; o.setLeads.push(`${w.number} ${(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: want })).status}`); }
  for (const w of have.filter((x: any) => !five.some((f: any) => f.id === x.id) && x.techAssignedFirstName)) o.setLeads.push(`${w.number} no lead ${(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: null })).status}`);
  const back = await workOrders(a, n); const lead = (id: string) => leadOfW(back.find((w: any) => w.id === id) ?? {});
  o.wos = five.map((w: any, i: number) => ({ wo: `WO-${i + 1}`, number: w.number, lead: lead(w.id) }));
  o.setupOk = o.wos.filter((x: any) => x.lead === 'Esther Howard').length === 3 && o.wos.filter((x: any) => x.lead === 'Ralph Edwards').length === 2;
  console.log(t(), 'START STATE set C96936', JSON.stringify({ wos: o.wos, setupOk: o.setupOk, others: back.filter((w: any) => !five.some((f: any) => f.id === w.id)).map((w: any) => `${w.number} lead=${leadOfW(w)}`) }));
  if (!o.setupOk) throw new Error('the set-up did not read back as Esther Howard 3 / Ralph Edwards 2: ' + JSON.stringify(o.wos));
  const w1 = five[0]; o.wo1 = w1.number;
  const pv0 = await prefs(); o.pinsAtStart = pv0.pinnedTechnicianIds ?? []; o.pin = (await a.put('/api/users/me/preferences/work-orders-list', { value: { ...pv0, pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } })).status;
  try {
    // steps 1-4: tab A, Work Orders > All > Search > Tech View
    await tv(n);
    const pick = async () => (await groups(p)).filter((g) => [ES.staff_id, RE.staff_id].includes(g.id)).map((g) => ({ name: g.name, count: g.count, rows: g.rows }));
    o.before = await pick(); await shot(p, 'C96936-r5-tabA-start');
    // step 5: tab B, the work order page, Lead Technician = Ralph Edwards
    const pB = await p.context().newPage(); pB.setDefaultTimeout(20_000); o.step5 = {};
    try { await pB.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }); await pB.waitForTimeout(7000);
      // FIX-UP 2c (17 Oct 2026, last automated try): on 17 Oct no Lead Technician field was found in tab B within 20 s. Every candidate is now
      // logged (test ids holding "lead", q-fields by label, the element reading "Lead Technician" and its clickable container) for up to
      // 20 s, the best one is MARKED (select_lead_technician > a test id with "lead" that is not read-only > the labelled q-field > the
      // clickable container next to the label), scrolled on screen and photographed; only then is the list opened from it.
      // ROUND 5 (17 Oct 2026): the work order has no lines, so its page opens a New Line window over it; on 17 Oct the Lead Technician search
      // then hit button_toggle_vehicle_here behind it. The window is closed with its X and the close question answered (both logged), then
      // the Lead Technician control is found by its LABEL TEXT ("Lead Technician" / "Lead technician"), never by a test id that merely
      // holds "lead" or the nearest button (button_toggle_vehicle_here is excluded by name).
      const winsB = () => pB.evaluate(`[...document.querySelectorAll('.q-dialog')].filter(d => d.getBoundingClientRect().width > 0 && getComputedStyle(d).visibility !== 'hidden').map(d => ({ text: d.innerText.replace(/\\s+/g, ' ').slice(0, 160), buttons: [...d.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim()).filter(Boolean) }))`).catch(() => []) as Promise<any[]>;
      o.step5.windowsOnOpen = await winsB(); o.step5.newLine = [];
      for (let k = 0; k < 3; k++) { const nl = pB.locator('.q-dialog:visible').filter({ hasText: /New Line/i }).last(); if (!(await nl.count())) break;
        const x = nl.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first(); const how = (await x.count()) ? await x.click({ timeout: 5000 }).then(() => 'X clicked').catch(() => 'X click failed') : await pB.keyboard.press('Escape').then(() => 'Escape');
        await pB.waitForTimeout(1500); const ws = await winsB(); const qn = ws.find((w: any) => !/New Line/i.test(w.text) && w.buttons.length); let answered: string | null = null;
        if (qn) { answered = qn.buttons.find((b: string) => /^(Yes|Discard|Close|Leave|OK|Confirm|Don.t save)/i.test(b)) ?? null; if (answered) { await pB.locator('.q-dialog button:visible').filter({ hasText: answered }).last().click().catch(() => {}); await pB.waitForTimeout(1500); } }
        o.step5.newLine.push({ how, question: qn ?? null, answered }); }
      o.step5.windowsLeft = await winsB(); await pB.screenshot({ path: path.join(EV, 'C96936-r5-tabB-new-line-closed.png') }).catch(() => {});
      console.log(t(), 'C96936 tab B New Line window', JSON.stringify({ onOpen: o.step5.windowsOnOpen.map((w: any) => w.text.slice(0, 50)), closed: o.step5.newLine, left: o.step5.windowsLeft.length }));
      let cand: any = null;
      for (let i = 0; i < 20; i++) { cand = await pB.evaluate(`(() => { document.querySelectorAll('[data-zz-lead]').forEach(e => e.removeAttribute('data-zz-lead')); const vis = (e) => e && e.getBoundingClientRect().width > 0; const txt = (e) => (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60);
          const byTid = [...document.querySelectorAll('[data-test-id*="lead" i]')].filter(vis); const fields = [...document.querySelectorAll('.q-field')].filter(f => vis(f) && /Lead Tech/i.test(((f.querySelector('.q-field__label') || {}).textContent || '') + ' ' + (f.getAttribute('aria-label') || '')));
          const lab = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && /^\\s*Lead Technician\\s*:?\\s*$/i.test(e.textContent || '') && vis(e) && !e.closest('.q-dialog')); let near = null; if (lab) { let c = lab.parentElement; for (let k = 0; k < 4 && c && !c.querySelector('.q-field, [role=combobox], [role=button], button, .cursor-pointer'); k++) c = c.parentElement; near = c ? (c.querySelector('.q-field, [role=combobox], [role=button], button, .cursor-pointer') || c) : null; }
          const ok = (e) => e && !/vehicle_here/i.test(e.getAttribute('data-test-id') || '') && !(e.closest && e.closest('[data-test-id*="vehicle_here"]')); const pick = [document.querySelector('[data-test-id="select_lead_technician"]'), fields[0], near, byTid.find(e => !/readonly/i.test(e.getAttribute('data-test-id')))].find(e => ok(e) && vis(e)) || null; if (pick && vis(pick)) pick.setAttribute('data-zz-lead', '1');
          return { picked: pick ? (pick.getAttribute('data-test-id') || pick.className.toString().slice(0, 40)) : null, byTestId: byTid.map(e => e.getAttribute('data-test-id') + '=' + txt(e)), labelledFields: fields.map(txt), label: lab ? txt(lab) : null, nearLabel: near ? (near.getAttribute('data-test-id') || near.tagName) + '=' + txt(near) : null, url: location.pathname.slice(0, 60) }; })()`).catch((e) => ({ error: String(e).slice(0, 80) }));
        if (cand?.picked) break; await pB.waitForTimeout(1000); }
      o.step5.leadCandidates = cand; console.log(t(), 'C96936 tab B Lead Technician candidates', JSON.stringify(cand));
      await pB.locator('[data-zz-lead="1"]').first().scrollIntoViewIfNeeded().catch(() => {}); await pB.waitForTimeout(500); await pB.screenshot({ path: path.join(EV, 'C96936-r5-tabB-lead-field.png') }).catch(() => {});
      const sel = async () => (await pB.locator('[data-zz-lead="1"]').count()) ? pB.locator('[data-zz-lead="1"]').first() : ((await pB.locator('[data-test-id="select_lead_technician"]').count()) ? pB.locator('[data-test-id="select_lead_technician"]').first() : pB.locator('.q-field').filter({ has: pB.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first());
      if (!cand?.picked) throw new Error(`tab B: no Lead Technician control on the work order page after 20 s (candidates ${JSON.stringify(cand).slice(0, 300)}) — step 5 NOT done`);
      o.step5.typed = await pickLeadTyped(pB, ['Ralph Edwards', 'Edwards', 'Ralph'], 'Ralph Edwards').catch((e: any) => ({ picked: false, error: String(e).slice(0, 80) }));
      if (o.step5.typed?.picked) { o.step5.how = 'typed into the Lead Technician field and picked on the work order page in tab B'; }
      const pk = o.step5.typed?.picked ? { picked: 'Ralph Edwards', list: { count: null, first: null, last: null, offered: null, readingValid: null } } as any : await pickTech(pB, async () => { await (await sel()).click(); }, 'C96936 tab B Lead Technician', { prefer: ['Ralph Edwards'], control: ['Esther Howard', 'Dana Ortiz'], exact: true });
      o.step5.list = { count: pk.list.count, first: pk.list.first, last: pk.list.last, offered: pk.list.offered, readingValid: pk.list.readingValid };
      if (pk.picked) { o.step5.how = 'picked on the work order page in tab B'; o.step5Route = 'screen'; }
      else { o.step5Route = 'behind-the-screen (Ralph not offered, SV-11393)'; o.step5.how = 'Ralph Edwards is not offered on the work order page (SV-11393); the same save the page makes was sent from tab B'; o.step5.api = (await api(pB).post('/api/work-orders/change-lead-technician', { work_order_id: w1.id, tech_assigned_id: RE.staff_id })).status; }
      await pB.waitForTimeout(2500); await pB.screenshot({ path: path.join(EV, 'C96936-r5-tabB.png') }).catch(() => {});
    } finally { await pB.close().catch(() => {}); }
    o.step5.leadNow = leadOfW((await workOrders(a, n)).find((w: any) => w.id === w1.id) ?? {});   // read back from the server
    o.step5Route = o.step5Route ?? 'not reached (step 5 did not complete)'; console.log(t(), 'C96936 step5Route', JSON.stringify({ step5Route: o.step5Route, leadNow: o.step5.leadNow }));   // judge: tab B's change is only the trigger
    // step 6: tab A, not refreshed
    const showGroups = async (k: string) => { for (const [id, nmx] of [[ES.staff_id, 'Esther'], [RE.staff_id, 'Ralph']] as const) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(400); if (await scrollToGroup(id)) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${id}"]')?.scrollIntoView({ block: 'start' })`); await p.waitForTimeout(900); } await shot(p, `C96936-r5-${k}-group-${nmx}`); } };
    await p.bringToFront(); await p.waitForTimeout(3000); o.beforeRefresh = await pick(); await showGroups('before-refresh');
    // steps 7-8: refresh tab A
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, n); await p.waitForTimeout(2000); o.afterRefresh = await pick(); await shot(p, 'C96936-r5-after-refresh'); await showGroups('after-refresh');
    o.wo1Group = (o.afterRefresh as any[]).find((g) => g.rows.includes(w1.number))?.name ?? null;
  } finally { o.pinsBack = (await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefs()), pinnedTechnicianIds: o.pinsAtStart } })).status; }
});

fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
await done(browser);
