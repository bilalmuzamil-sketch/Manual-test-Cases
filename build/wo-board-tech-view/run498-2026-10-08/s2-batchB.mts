/**
 * S2 Tech View, batch B (2026-10-08): second measurements (C96927 Assigned Techs column, C96935 sticky header,
 * C368125 collapsed group during search, C96937 with the advisor set as the case says, C368162 Collapse all
 * looked for in the Tech View code) and C96936, C368126, C368127, C96929, C368130.
 */
import { ME_NAME, HEAVY, LOC2_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder } from './data.mts';
import { staffRows } from './staff.mts';
import { pickTech } from './fx6-1017.mts';
import { startState } from './fixup-1017.mts';
import { EV, t, shot, display, tab, search, groups, toggleGroup, read, columnHeads, switchLocUI } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
await startState(p, a, 's2-batchB');   // L0415, fix-up 2
const techs = await candidates(a);
const by = (n: string) => techs.find((x) => x.name === n)!;
const tA = by('Ayesha Khan'), tB = by('Bilal Muzamil'), me = by(ME_NAME);
const free = techs.filter((x) => x.open === 0 && x.name !== ME_NAME);
console.log(t(), 'technicians with no open work', free.slice(0, 6).map((x) => x.name).join(', '));
// 22 Oct 2026: HEAVY comes from the environment profile (was a hard-coded QA-branch id)
const tv = async (name: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Tech View'); if (name) await search(p, name); };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1800));
  fs.writeFileSync(path.join(EV, 's2-batchB.json'), JSON.stringify(R, null, 1));
}
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
async function scrollToGroup(id: string) {
  for (let i = 0; i < 40; i++) {
    if (await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).count()) { await p.locator(`[data-test-id="tech_view_group_${id}"]`).scrollIntoViewIfNeeded(); return true; }
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 600`); await p.waitForTimeout(500);
  }
  return false;
}

await run('C96927', async () => {
  await tv('ZZAUTOTEST F2 Tech Columns');
  await p.locator('[data-test-id="button_tech_view_column_selection"]').click(); await p.waitForTimeout(1200);
  const item = p.locator('.q-menu').getByText('Assigned Techs', { exact: true }).first();
  R.C96927 = { itemFound: await item.count(), itemHtml: await item.evaluate((e) => (e.closest('.q-item, [role=checkbox], label') || e).outerHTML.slice(0, 400)).catch(() => null) };
  const state = () => item.evaluate((e) => { const c = e.closest('.q-item, label, [role=checkbox]') || e; const cb = c.querySelector('[role=checkbox], .q-checkbox, input') || c; return cb.getAttribute('aria-checked') ?? (cb as HTMLInputElement).checked ?? null; }).catch(() => null);
  R.C96927.before = await state();
  if (String(R.C96927.before) !== 'true') { await item.click(); await p.waitForTimeout(1500); }
  R.C96927.after = await state(); await shot(p, 'C96927-menu-assigned-on');
  await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  R.C96927.headers = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`); await shot(p, 'C96927-assigned-techs-column');
});

await run('C96935', async () => {
  await tv('ZZAUTOTEST F2 Sticky Header');
  for (const g of await groups(p)) if ((g.id === tA.id || g.id === tB.id) && g.collapsed) await toggleGroup(p, g.id);
  const probe = (id: string) => p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); const h = document.querySelector('[data-test-id="tech_view_group_${id}"]'); if (!h) return null; const th = s.querySelector('thead'); const top = th ? th.getBoundingClientRect().bottom : s.getBoundingClientRect().top; const r = h.getBoundingClientRect(); const td = h.querySelector('td'); return { headerTop: Math.round(r.top), tableTop: Math.round(top), position: getComputedStyle(td || h).position + '/' + getComputedStyle(h).position, offset: h.offsetTop }; })()`);
  const rows = (gid: string) => p.evaluate(`[...document.querySelectorAll('tr[data-group-key="${gid}"]')].map(r => ({ n: (r.innerText.match(/S\\d+-\\d+/) || [''])[0], top: Math.round(r.getBoundingClientRect().top) }))`) as Promise<any[]>;
  R.C96935 = {};
  const offA = (await probe(tA.id))?.offset ?? 0;
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = ${offA + 400}`); await p.waitForTimeout(1200);
  R.C96935.inA = { header: await probe(tA.id), firstRowsInView: (await rows(tA.id)).filter((r) => r.top > 150).slice(0, 2) }; await shot(p, 'C96935-inside-A');
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(800);
  const offB = (await probe(tB.id))?.offset ?? 0;
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = ${offB + 60}`); await p.waitForTimeout(1200);
  R.C96935.inB = { header: await probe(tB.id), aHeader: await probe(tA.id), rowsB: await rows(tB.id) }; await shot(p, 'C96935-inside-B');
});

await run('C368125', async () => {
  await tv('');
  if (!(await scrollToGroup(tA.id))) throw new Error('could not bring Ayesha Khan\'s group on screen');
  const gA = async () => (await groups(p)).find((g) => g.id === tA.id);
  if (!(await gA())?.collapsed) await toggleGroup(p, tA.id);
  R.C368125 = { collapsedBefore: (await gA())?.collapsed, countBefore: (await gA())?.count };
  await search(p, 'Collapse Kept'); const d = await gA(); R.C368125.during = d && { count: d.count, collapsed: d.collapsed, rows: d.rows }; await shot(p, 'C368125-during-search');
  await toggleGroup(p, tA.id); const e = await gA(); R.C368125.expanded = e && { count: e.count, collapsed: e.collapsed, rows: e.rows }; await shot(p, 'C368125-expanded');
  R.C368125.otherCustomerWo = (await workOrders(a, 'ZZAUTOTEST F2 Collapse Other')).map((w: any) => w.number);
});

await run('C96937', async () => {
  const n = 'ZZAUTOTEST F2 Assigned Groups';
  const wos = await workOrders(a, n);
  const w2 = wos.find((w: any) => w.techAssignedFirstName === 'Bilal');
  // the case: [WO-2] is led by another technician and is NOT yours in any way, so it has another Service Advisor
  if (w2) { const r = await a.post('/api/work-orders/change-service-advisor', { work_order_id: w2.id, service_advisor_id: tB.id }); R.C96937 = { advisorChange: r.status }; }
  const back = await workOrders(a, n);
  R.C96937.data = back.map((w: any) => `${w.number} lead=${w.techAssignedFirstName ?? '-'} advisor=${w.serviceAdvisorFirstName ?? '-'}`);
  await tv(n);
  const carol = by('Carol Neal');
  await p.locator(`[data-test-id="button_tech_view_pin_${carol.id}"]`).click(); await p.waitForTimeout(1800);
  await display(p, 'List'); await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  R.C96937.list = Object.keys(await read(p, 'List'));
  await display(p, 'Tech View'); R.C96937.tech = (await groups(p)).map((g) => `${g.name}(${g.count}) [${g.rows.join(' ')}]`); await shot(p, 'C96937-assigned-on');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  const g = await groups(p); R.C96937.offCount = g.length; R.C96937.offFirst = g.slice(0, 3).map((x) => `${x.name}${x.pin?.pressed === 'true' ? ' (pinned)' : ''}`); await shot(p, 'C96937-assigned-off');
  await p.locator(`[data-test-id="button_tech_view_pin_${carol.id}"]`).click(); await p.waitForTimeout(1500);
});

await run('C368162', async () => {
  await tv('ZZAUTOTEST F2 Collapse All');
  const chunk = (await p.evaluate(`performance.getEntriesByType('resource').map(e => e.name).find(n => /WorkOrdersTechViewDisplay.*\\.js$/.test(n)) || ''`)) as string;
  const txt = chunk ? (await p.evaluate(`fetch(${JSON.stringify(chunk)}).then(r => r.text())`)) as string : '';
  R.C368162 = { chunk: chunk.replace(APP, ''), size: txt.length,
    hits: [...new Set((txt.match(/.{0,50}(Collapse all|Expand all|collapseAll|expandAll|collapse_all|unfold_less|unfold_more|toggleAll).{0,50}/gi) || []).map((x) => x.slice(0, 120)))].slice(0, 8),
    headerRowButtons: await p.evaluate(`[...document.querySelectorAll('thead button, thead [role=button], thead i')].map(e => (e.getAttribute('aria-label') || e.innerText || '').trim())`),
    firstHeaderCell: await p.evaluate(`(document.querySelector('thead th') || {}).outerHTML?.slice(0, 300) || null`) };
  await shot(p, 'C368162-header-row');
});

// ───────── FIX-UP 2 (17 Oct 2026, C96936): the 16 Oct run stopped with an error — seedCase() makes the case's work orders only ONCE,
// and an earlier run had moved their leads, so no work order was left with the first technician. It also used Ayesha Khan / Bilal
// Muzamil, while the case names Esther Howard and Ralph Edwards ("keep these names"). Now the case's own customer is used and its
// work orders are SET every run: five Approved ones (made if missing), [WO-1]-[WO-3] led by Esther Howard, [WO-4]/[WO-5] by Ralph
// Edwards, any other work order of this customer back to no lead — and read back (Esther 3, Ralph 2) before step 1. Both technicians
// are pinned for the run (saved choice, put back after) so their groups sit at the top. Step 5 is done in tab B on the work order page;
// Ralph Edwards is past the ~100-name cut-off of that list (KNOWN PRODUCT FAULT SV-11393), so if he is not offered the same save the
// page makes is sent from tab B instead, and the log says which way it went (step5.how) with the list read (step5.list).
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
    o.before = await pick(); await shot(p, 'C96936-tabA-start');
    // step 5: tab B, the work order page, Lead Technician = Ralph Edwards
    const pB = await p.context().newPage(); pB.setDefaultTimeout(20_000); o.step5 = {};
    try { await pB.goto(`${APP}/workorders/${w1.id}/lines`, { waitUntil: 'domcontentloaded' }); await pB.waitForTimeout(7000);
      // 22 Oct 2026 (production): a work order with no lines opens a "New Line" window over the page, hiding the status card's Lead
      // Technician field (the old search then marked the On Site button). Close it first — its X, else Escape — and read it closed.
      for (let k = 0; k < 2 && await pB.locator('.q-dialog').filter({ hasText: /New Line/ }).count(); k++) { await pB.locator('.q-dialog').filter({ hasText: /New Line/ }).locator('button:has(i:text-is("close")), [data-test-id="button_close_dialog"]').first().click({ timeout: 4000 }).catch(async () => { await pB.keyboard.press('Escape'); }); await pB.waitForTimeout(1500); }
      o.step5.newLineWindowClosed = !(await pB.locator('.q-dialog').filter({ hasText: /New Line/ }).count());
      // FIX-UP 2c (17 Oct 2026, last automated try): on 17 Oct no Lead Technician field was found in tab B within 20 s. Every candidate is now
      // logged (test ids holding "lead", q-fields by label, the element reading "Lead Technician" and its clickable container) for up to
      // 20 s, the best one is MARKED (select_lead_technician > a test id with "lead" that is not read-only > the labelled q-field > the
      // clickable container next to the label), scrolled on screen and photographed; only then is the list opened from it.
      let cand: any = null;
      for (let i = 0; i < 20; i++) { cand = await pB.evaluate(`(() => { document.querySelectorAll('[data-zz-lead]').forEach(e => e.removeAttribute('data-zz-lead')); const vis = (e) => e && e.getBoundingClientRect().width > 0; const txt = (e) => (e.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 60);
          const byTid = [...document.querySelectorAll('[data-test-id*="lead" i]')].filter(vis); const fields = [...document.querySelectorAll('.q-field')].filter(f => vis(f) && /Lead Tech/i.test(((f.querySelector('.q-field__label') || {}).textContent || '') + ' ' + (f.getAttribute('aria-label') || '')));
          const lab = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && /^\\s*Lead Technician\\s*$/i.test(e.textContent || '') && vis(e)); let near = null; if (lab) { let c = lab.parentElement; for (let k = 0; k < 4 && c && !c.querySelector('.q-field, [role=combobox], [role=button], button, .cursor-pointer'); k++) c = c.parentElement; near = c ? (c.querySelector('.q-field, [role=combobox], [role=button], button, .cursor-pointer') || c) : null; }
          const pick = document.querySelector('[data-test-id="select_lead_technician"]') || byTid.find(e => !/readonly/i.test(e.getAttribute('data-test-id'))) || fields[0] || near; if (pick && vis(pick)) pick.setAttribute('data-zz-lead', '1');
          return { picked: pick ? (pick.getAttribute('data-test-id') || pick.className.toString().slice(0, 40)) : null, byTestId: byTid.map(e => e.getAttribute('data-test-id') + '=' + txt(e)), labelledFields: fields.map(txt), label: lab ? txt(lab) : null, nearLabel: near ? (near.getAttribute('data-test-id') || near.tagName) + '=' + txt(near) : null, url: location.pathname.slice(0, 60) }; })()`).catch((e) => ({ error: String(e).slice(0, 80) }));
        if (cand?.picked) break; await pB.waitForTimeout(1000); }
      o.step5.leadCandidates = cand; console.log(t(), 'C96936 tab B Lead Technician candidates', JSON.stringify(cand));
      await pB.locator('[data-zz-lead="1"]').first().scrollIntoViewIfNeeded().catch(() => {}); await pB.waitForTimeout(500); await pB.screenshot({ path: path.join(EV, 'C96936-tabB-lead-field.png') }).catch(() => {});
      const sel = async () => (await pB.locator('[data-zz-lead="1"]').count()) ? pB.locator('[data-zz-lead="1"]').first() : ((await pB.locator('[data-test-id="select_lead_technician"]').count()) ? pB.locator('[data-test-id="select_lead_technician"]').first() : pB.locator('.q-field').filter({ has: pB.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first());
      if (!cand?.picked) throw new Error(`tab B: no Lead Technician control on the work order page after 20 s (candidates ${JSON.stringify(cand).slice(0, 300)}) — step 5 NOT done`);
      const pk = await pickTech(pB, async () => { await (await sel()).click(); }, 'C96936 tab B Lead Technician', { prefer: ['Ralph Edwards'], control: ['Esther Howard', 'Dana Ortiz'], exact: true });
      o.step5.list = { count: pk.list.count, first: pk.list.first, last: pk.list.last, offered: pk.list.offered, readingValid: pk.list.readingValid };
      if (pk.picked) o.step5.how = 'picked on the work order page in tab B';
      else { o.step5.how = 'Ralph Edwards is not offered on the work order page (SV-11393); the same save the page makes was sent from tab B'; o.step5.api = (await api(pB).post('/api/work-orders/change-lead-technician', { work_order_id: w1.id, tech_assigned_id: RE.staff_id })).status; }
      await pB.waitForTimeout(2500); await pB.screenshot({ path: path.join(EV, 'C96936-tabB.png') }).catch(() => {});
    } finally { await pB.close().catch(() => {}); }
    o.step5.leadNow = leadOfW((await workOrders(a, n)).find((w: any) => w.id === w1.id) ?? {});   // read back from the server
    // step 6: tab A, not refreshed
    const showGroups = async (k: string) => { for (const [id, nmx] of [[ES.staff_id, 'Esther'], [RE.staff_id, 'Ralph']] as const) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(400); if (await scrollToGroup(id)) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${id}"]')?.scrollIntoView({ block: 'start' })`); await p.waitForTimeout(900); } await shot(p, `C96936-${k}-group-${nmx}`); } };
    await p.bringToFront(); await p.waitForTimeout(3000); o.beforeRefresh = await pick(); await showGroups('before-refresh');
    // steps 7-8: refresh tab A
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, n); await p.waitForTimeout(2000); o.afterRefresh = await pick(); await shot(p, 'C96936-after-refresh'); await showGroups('after-refresh');
    o.wo1Group = (o.afterRefresh as any[]).find((g) => g.rows.includes(w1.number))?.name ?? null;
  } finally { o.pinsBack = (await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefs()), pinnedTechnicianIds: o.pinsAtStart } })).status; }
});
await run('C96929', async () => {
  const lead = free[0];
  for (const c of ['Zeta Hauling', 'Alpha Freight', 'Mid Trucking']) await seedCase(a, `ZZAUTOTEST ${c}`, 'ZZF2' + c.slice(0, 3).toUpperCase(), [{ lead: lead.id }]);
  R.C96929 = { lead: lead.name, note: 'customers named ZZAUTOTEST Zeta Hauling / Alpha Freight / Mid Trucking so they are found again; their relative order is the same' };
});

// ── as User-B (fresh preferences): C368127, C368126 and the default order for C96929 ─
const EMAIL = 'zzautotest.wob.userb.1008@staging.shopview.local';
const ub = ((await a.get('/api/staff?search=' + encodeURIComponent(EMAIL))).body?.data?.collection ?? []).find((x: any) => x.email === EMAIL);
async function asUserB<T>(f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: ub.id }); if (s.status >= 300) throw new Error(`switch to User-B ${s.status} ${JSON.stringify(s.body).slice(0, 200)}`);
  await p.waitForTimeout(800); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') });
  try { return await f(); } finally { const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); await p.waitForTimeout(800); }
}
if (want('C368127') || want('C368126') || want('C96929')) await asUserB(async () => {
  await run('C368127', async () => {
    const reqs: string[] = []; const h = (q: any) => { if (/\/api\/work-orders/.test(q.url())) reqs.push(q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 220)); }; p.on('request', h);
    await tv('');
    const u = async () => (await groups(p)).find((g) => g.id === 'unassigned');
    const g0 = await u(); R.C368127 = { opensCollapsed: g0?.collapsed, count: g0?.count, rowsAtOpen: g0?.rows.length };
    await shot(p, 'C368127-open');
    if (g0?.collapsed) { await toggleGroup(p, 'unassigned'); R.C368127.expandedByHand = true; }
    const counts: number[] = [];
    for (let i = 0; i < 12; i++) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 1500`); await p.waitForTimeout(1200); counts.push((await p.evaluate(`document.querySelectorAll('tr[data-group-key="unassigned"]').length`)) as number); }
    R.C368127.renderedRowsWhileScrolling = counts;
    R.C368127.header = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="tech_view_group_unassigned"]'); const s = document.querySelector('.q-table__middle'); const th = s.querySelector('thead'); if (!h) return 'not drawn'; return { top: Math.round(h.getBoundingClientRect().top), tableTop: Math.round(th.getBoundingClientRect().bottom), scrollTop: Math.round(s.scrollTop) }; })()`);
    await shot(p, 'C368127-scrolled');
    const tog = p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]');
    R.C368127.toggleVisibleMidScroll = await tog.isVisible().catch(() => false);
    if (R.C368127.toggleVisibleMidScroll) { await tog.click(); await p.waitForTimeout(1500); R.C368127.collapsedFromMid = (await u())?.collapsed; await toggleGroup(p, 'unassigned'); }
    R.C368127.pageRequests = reqs.filter((x) => /unassigned|page|offset|cursor|limit/i.test(x)).slice(0, 12);
    p.off('request', h);
    // List's own count of unassigned work orders on the All tab (the endpoint List uses, filtered to no lead)
    for (const v of ['unassigned', 'null', 'none', '']) { const r = await a.get(`/api/work-orders?pagination[rowsPerPage]=1&filters[0][field]=tech_assigned_id&filters[0][value]=${v}`); const pg = r.body?.data?.pagination; R.C368127['listCount_' + (v || 'empty')] = `${r.status} total=${pg?.rowsNumber ?? pg?.total ?? JSON.stringify(pg ?? r.body).slice(0, 120)}`; }
  });
  await run('C368126', async () => {
    const n = 'ZZAUTOTEST F2 Tech Pin Order';
    const four = [tA, tB, free[1], free[2]];
    await seedCase(a, n, 'ZZF2PO', [...four.map((x) => ({ lead: x.id })), { lead: null }]);
    await tv(n);
    const order = async () => (await groups(p)).filter((g) => g.id === 'unassigned' || four.some((f) => f.id === g.id)).map((g) => g.name);
    R.C368126 = { four: four.map((x) => x.name), pinsAtStart: (await prefs()).pinnedTechnicianIds ?? null, start: await order() };
    const sorted = [...four].sort((x, y) => x.name.localeCompare(y.name));
    const k = sorted[2], e = sorted[0];      // pin a later name first, then an earlier one (the case: Kristin Watson, then Esther Howard)
    await p.locator(`[data-test-id="button_tech_view_pin_${k.id}"]`).click(); await p.waitForTimeout(1800); R.C368126.afterPin1 = { pinned: k.name, order: await order() };
    await p.locator(`[data-test-id="button_tech_view_pin_${e.id}"]`).click(); await p.waitForTimeout(1800); R.C368126.afterPin2 = { pinned: e.name, order: await order() }; await shot(p, 'C368126-tech');
    // 15 Oct 2026 (staging second pass): only the columns drawn on screen were read, so Bilal Muzamil's column (further right
    // among ~119 technicians) was missed. allBoardCols scrolls the board to its END and returns every column in board order.
    await display(p, 'Board View'); const ids = (await (await import('./wob.mts')).allBoardCols(p)).map((c) => 'board_column_' + c.id);
    const nameOf = Object.fromEntries(techs.map((x) => ['board_column_' + x.id, x.name])); nameOf['board_column_unassigned'] = 'Unassigned';
    R.C368126.board = ids.map((i) => nameOf[i]).filter((x) => x === 'Unassigned' || four.some((f) => f.name === x)); await shot(p, 'C368126-board');
    await display(p, 'Tech View');
    for (const x of [k, e]) { await p.locator(`[data-test-id="button_tech_view_pin_${x.id}"]`).click().catch(() => {}); await p.waitForTimeout(1200); }
  });
  await run('C96929', async () => {
    const lead = free[0];
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await display(p, 'List'); await tab(p, 'All'); await search(p, 'ZZAUTOTEST');
    const L = Object.keys(await read(p, 'List'));
    const mineWos = (await Promise.all(['Zeta Hauling', 'Alpha Freight', 'Mid Trucking'].map((c) => workOrders(a, `ZZAUTOTEST ${c}`)))).flat();
    const nm = Object.fromEntries(mineWos.map((w: any) => [w.number, w.companyName]));
    R.C96929.listSortHeader = await p.evaluate(`[...document.querySelectorAll('thead th.sorted')].map(e => e.innerText.trim() + ' ' + e.className.match(/sort-(asc|desc)/)?.[0])`);
    R.C96929.list = L.filter((x) => nm[x]).map((x) => nm[x]);
    await display(p, 'Tech View'); await search(p, '');
    if (!(await scrollToGroup(lead.id))) throw new Error('lead group not on screen');
    const g = (await groups(p)).find((x) => x.id === lead.id); if (g?.collapsed) await toggleGroup(p, lead.id);
    R.C96929.tech = ((await groups(p)).find((x) => x.id === lead.id)?.rows ?? []).map((x) => nm[x] ?? x); await shot(p, 'C96929-tech');
    await display(p, 'Board View'); const col = await p.evaluate(`(document.querySelector('[data-test-id="board_column_${lead.id}"]') || {}).innerText || ''`) as string;
    R.C96929.board = (col.match(/\bS\d+-\d+\b/g) || []).map((x) => nm[x] ?? x); await shot(p, 'C96929-board');
    await display(p, 'List'); await search(p, '');
  });
});

await run('C368130', async () => {
  const n = 'ZZAUTOTEST F2 No Tech Location';
  // 14 Oct 2026: on staging the empty location is "ZZAUTOTEST F2 Empty Shop" (made by stg-setup.mts), looked up by name
  const EMPTY_NAME = process.env.WOB_EMPTY_LOC || 'ZZAUTOTEST Empty Shop';
  const ew = ((await a.get('/api/workplaces')).body?.data?.collection ?? []).find((x: any) => x.name === EMPTY_NAME);
  const EMPTY = ew?.id ?? '4775b927-423d-49e4-9066-8409c4bc82ef';
  await a.post('/api/iam/change-location', { workplace_id: EMPTY, workplace_timezone: ew?.timezone ?? 'Africa/Abidjan' });
  R.C368130 = { candidatesThere: (await candidates(a)).map((x) => x.name) };
  try { await seedCase(a, n, 'ZZF2NL', [{ lead: null }, { lead: null }]); } finally { await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') }); }
  R.C368130.note = 'the screen is switched to ZZAUTOTEST Empty Shop through the location menu below';
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  if (process.env.WOB_LOC_SELECT) await switchLocUI(p, EMPTY_NAME); else {
  await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').getByText(/ - \d{3,5}$|ZZAUTOTEST Empty Shop/).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').filter({ hasText: LOC2_NAME }).locator('.q-item').filter({ hasText: 'ZZAUTOTEST Empty Shop' }).first().click(); await p.waitForTimeout(6000); }
  await p.keyboard.press('Escape').catch(() => {});
  R.C368130.location = await p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => /Empty Shop| - \\d{3,5}$/.test(l)) || null`);
  await tab(p, 'All'); await display(p, 'Tech View');
  R.C368130.tech = { groups: (await groups(p)).map((g) => `${g.name}(${g.count}) [${g.rows.join(' ')}]`), text: (await p.evaluate(`(document.querySelector('[data-test-id="tech_view"]') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 400) };
  await shot(p, 'C368130-tech');
  await display(p, 'Board View');
  R.C368130.board = { columns: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => e.getAttribute('data-test-id')).filter(x => /^board_column_(unassigned|[0-9a-f-]{36})$/.test(x))`), text: (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 500) };
  await shot(p, 'C368130-board'); await display(p, 'List');
});

await search(p, '').catch(() => {});
fs.writeFileSync(path.join(EV, 's2-batchB.json'), JSON.stringify(R, null, 1));
await done(browser);
