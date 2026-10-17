/** C614714-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C614714 alone ("A lead whose Time Clock is turned off keeps a
 *  named column that takes no drops"). Two questions left open by C614714-stg.mts:
 *  STEP 2 — after Save & Close the Edit Staff Member window "stayed open, no error" and the record still read Time Clock on. Script or
 *    product? The old click was `.q-dialog:visible >> button "Save & Close"` with its error swallowed — and staffloc.mts records that a
 *    hidden .q-dialog sits in front of the open one, so the click may never have happened. Now: (1) POSITIVE CONTROL first — a second
 *    ZZAUTOTEST staff record made for this run gets a harmless change (Job Title) through the same window and Save & Close; whether the window
 *    closes and the change lands on the server is read; (2) then Tim's Time Clock off, Save & Close — the button taken as the VISIBLE one,
 *    the click's own result logged, every staff/iam request the page sends logged, every visible window's words and buttons after the save
 *    (a confirmation question is answered with its confirming button and logged), every field with an error / required marker / red border
 *    after scrolling the whole form, and the record read back from the server. Time Clock is NEVER switched behind the screen: if the screen
 *    does not save it, the rest of the case is still read and the reading says Time Clock stayed on.
 *  STEP 8 — the work order has no lines, so its page opens a New Line window over it: the window is closed through its close button and the
 *    close question answered (both logged); the Lead Technician field is looked for on the page (every element whose test id or label
 *    names "lead" is logged), opened, and "Unassigned" picked through the screen; read back on the page and from the server.
 *  Steps 3-7 and 9-10 and the positive control for step 5 are C614714-stg.mts's code. Output EV/C614714-r4.json, pictures C614714-r4-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, customer, workOrder, workOrders, candidates } from './data.mts';
import { EV, t, display, tab, search, groups, drag, toColumn, allBoardCols, toasts, woPageLead, findRow } from './wob.mts';
import { pickTech } from './fx6-1017.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
import { startState } from './fixup-1017.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
await startState(p, a, 'C614714-r4');
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614714-r4-${n}.png`) }).catch(() => {});
const RUNNO = String(Date.now() % 100000); const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const calls: string[] = []; p.on('request', (q) => { if (q.method() !== 'GET' && /\/api\/(staff|iam|work-orders)/.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 200)}`); });
p.on('response', (r) => { if (r.request().method() !== 'GET' && /\/api\/(staff|iam)/.test(r.url())) calls.push(`  -> ${r.status()} ${r.url().replace(/^https:\/\/[^/]+/, '')}`); });
/** Settings > Staff, search, the pencil on the row holding `key` — returns what the window says */
async function openStaff(key: string, tag: string) {
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await W(6000);
  const box = p.locator('[data-test-id="page_search_input"]:visible, input[placeholder*="earch" i]:visible').first();
  if (!(await box.count())) { await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await W(700); }
  await p.locator('[data-test-id="page_search_input"]:visible, input[placeholder*="earch" i]:visible').first().fill(key).catch(() => {}); await W(3500);
  const row = p.locator('tbody tr').filter({ hasText: key }).first(); const r: any = { rowFound: await row.count() };
  if (r.rowFound) { await row.locator('td').last().locator('button, [role=button], i, a').first().click().catch(async () => { await row.click().catch(() => {}); }); await W(3000); }
  r.window = (await p.locator('.q-dialog:visible').filter({ hasText: 'Edit Staff Member' }).last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 220);
  await shot(`${tag}-opened`); return r;
}
/** every visible window, its words and buttons; every field with an error, an aria-invalid, a required marker or a red border (form scrolled) */
const windows = () => p.evaluate(`[...document.querySelectorAll('.q-dialog')].filter(d => { const r = d.getBoundingClientRect(); const s = getComputedStyle(d); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; }).map(d => ({ text: d.innerText.replace(/\\s+/g, ' ').slice(0, 260), buttons: [...d.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean) }))`).catch(() => []) as Promise<any[]>;
async function fieldProblems() {
  const out: any[] = [];
  for (let i = 0; i < 8; i++) {
    const part = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(x => x.getBoundingClientRect().width > 0 && x.innerText.includes('Edit Staff Member')).pop(); if (!d) return { done: true, items: [] };
      const items = [...d.querySelectorAll('.q-field, .q-toggle, .q-checkbox')].filter(f => { const s = getComputedStyle(f.querySelector('.q-field__control') || f); const red = /rgb\\((19[0-9]|2[0-5][0-9]), ([0-9]|[1-7][0-9]), ([0-9]|[1-7][0-9])\\)/; return f.classList.contains('q-field--error') || f.querySelector('[aria-invalid=true]') || red.test(s.borderColor) || red.test(s.color) || /\\*/.test((f.querySelector('.q-field__label') || {}).textContent || ''); })
        .map(f => ({ label: ((f.querySelector('.q-field__label') || f).textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40), error: (f.querySelector('.q-field__messages') || {}).textContent || '', value: (f.querySelector('input') || {}).value ?? null, invalid: !!f.querySelector('[aria-invalid=true]'), errorClass: f.classList.contains('q-field--error') }));
      const sc = [d, ...d.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); let done = true; if (sc) { const b = sc.scrollTop; sc.scrollTop += 400; done = sc.scrollTop === b; }
      return { done, items }; })()`).catch(() => ({ done: true, items: [] })) as any;
    for (const x of part.items) if (!out.some((y) => y.label === x.label)) out.push(x);
    await W(400); if (part.done) break;
  }
  return out;
}
/** Save & Close on the VISIBLE button, the click's own result kept; then windows, messages, a confirmation answered if one is asked */
async function saveClose(tag: string) {
  const r: any = {}; calls.length = 0;
  await p.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`).catch(() => {});
  // LIVE FIX 17 Oct (probe-staff-window.json): the button's own text is "Save & close" (shown capitalised by CSS), aria-label "Save and close", test id button_save_staff
  let btn = p.locator('.q-dialog [data-test-id="button_save_staff"]:visible').last(); r.buttons = await btn.count(); r.buttonBy = 'test id button_save_staff';
  if (!r.buttons) { btn = p.getByRole('button', { name: /save and close/i }).last(); r.buttons = await btn.count(); r.buttonBy = 'role name "Save and close"'; }
  r.click = await btn.click({ timeout: 10_000 }).then(() => 'clicked').catch((e: any) => 'click failed: ' + String(e?.message || e).split('\n')[0].slice(0, 120)); await W(3000);
  r.windowsAfter = await windows();
  const q = r.windowsAfter.find((w: any) => !/Edit Staff Member/.test(w.text) && w.buttons.length);
  if (q) { const yes = q.buttons.find((b: string) => /^(Yes|Confirm|OK|Save|Continue|Turn off|Proceed)/i.test(b)); r.question = { text: q.text, buttons: q.buttons, answered: yes ?? null };
    if (yes) { await p.locator('.q-dialog button:visible').filter({ hasText: new RegExp('^\\s*' + yes.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).last().click().catch(() => {}); await W(3000); r.windowsAfterAnswer = await windows(); } }
  r.editWindowOpen = (await windows()).some((w: any) => /Edit Staff Member/.test(w.text));
  if (r.editWindowOpen) r.fieldProblems = await fieldProblems();
  r.messages = [...new Set([...(await p.evaluate('window.__tl || []').catch(() => []) as string[]), ...(await toasts(p))])]; r.requests = [...calls];
  await shot(`${tag}-after-save`); return r;
}
try {
  const A = (await person(a, 'ZZAUTOTEST N1', `Tim ${RUNNO}`, { role: TECH, email: `zz.wob.n1.tim.${RUNNO}${D}`, clockable: true, workplace: HEAVY })).row;
  const CT = (await person(a, 'ZZAUTOTEST N1', `Control ${RUNNO}`, { role: TECH, email: `zz.wob.n1.control.${RUNNO}${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = await ensureEligible(a, A, 'A'); o.offeredBefore = (await candidates(a)).some((x) => x.id === A.staff_id);
  const CUST = `ZZAUTOTEST N1 Time Clock Off ${RUNNO}`; const c = await customer(a, CUST, 'N1-U1');
  const w1 = await workOrder(a, c, 'approved', A.staff_id), w2 = await workOrder(a, c, 'approved', null);
  // LIVE FIX 17 Oct (set-up, not a case step): the work order page shows Lead Technician as a read-only value ("lead_technician_readonly")
  // while the work order has NO lines, and opens a New Line window over the page; Work-order-1 gets one line (the app's add-line call)
  // so the page offers the Lead Technician field step 8 uses
  { const cl = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data)[0];
    o.wo1Line = cl ? (await a.post(`/api/work-orders/${w1}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' })).status : 'no ready-made line'; }
  const num = async (id: string) => (await workOrders(a, CUST)).find((x: any) => x.id === id)?.number;
  o.data = { techA: `${A.first_name} ${A.last_name}`, control: `${CT?.first_name} ${CT?.last_name}`, customer: CUST, wo1: await num(w1), wo2: await num(w2) };
  const recA = async () => (await staffRows(a, A.email)).find((x: any) => x.staff_id === A.staff_id);
  console.log(t(), 'START STATE found C614714', JSON.stringify({ data: o.data, timeClockOn: (await recA())?.clockable, offered: o.offeredBefore }));
  console.log(t(), 'START STATE set C614714', JSON.stringify({ techA: A.email, control: CT?.email ?? null, wo1Lead: 'Technician-A', wo2Lead: 'none' }));
  // ---- positive control for step 2: a harmless change on ANOTHER ZZAUTOTEST record through the same window
  if (CT) { const cc: any = { open: await openStaff(`Control ${RUNNO}`, 'control') };
    const jt0 = p.locator('.q-dialog [data-test-id="input_job_title"]:visible').first(); cc.jobTitleField = await jt0.count();   // LIVE FIX: label is "Job title", test id input_job_title
    if (cc.jobTitleField) { const isInput = await jt0.evaluate((e: any) => e.tagName === 'INPUT').catch(() => false); const jt = isInput ? jt0 : jt0.locator('input').first(); await jt.fill(`ZZ control ${RUNNO}`).catch((e: any) => { cc.fillError = String(e).slice(0, 80); }); await W(500); cc.jobTitleTyped = await jt.inputValue().catch(() => null); }
    cc.save = await saveClose('control'); cc.server = { jobTitle: (await staffRows(a, CT.email)).find((x: any) => x.staff_id === CT.staff_id)?.job_title ?? null };
    cc.closed = !cc.save.editWindowOpen; o.control2 = cc;
    console.log(t(), 'C614714 step 2 control (another record, Job Title)', JSON.stringify({ click: cc.save.click, closed: cc.closed, jobTitle: cc.server.jobTitle, messages: cc.save.messages, requests: cc.save.requests.slice(0, 4) }));
    await p.keyboard.press('Escape').catch(() => {}); }
  // ---- steps 1-2 on Tim: pencil, Time Clock off, Save & Close — screen only
  o.s1 = await openStaff(`Tim ${RUNNO}`, 's1');
  const dlg = p.locator('.q-dialog:visible').filter({ hasText: 'Edit Staff Member' }).last();
  const togState = (tg: any) => tg.evaluate((e: any) => { const sw = e.matches('[role=switch]') ? e : e.querySelector('[role=switch], [aria-checked]'); return sw ? sw.getAttribute('aria-checked') : (e.querySelector('.q-toggle__inner--truthy') ? 'true' : 'false'); }).catch(() => null);
  let tog = p.locator('.q-dialog [data-test-id="toggle_time_clock"]:visible').first(); o.s2 = { toggle: await tog.count(), toggleBy: 'test id toggle_time_clock' };
  if (!o.s2.toggle) { tog = dlg.locator('.q-toggle').filter({ hasText: /Time Clock/i }).first(); o.s2 = { toggle: await tog.count(), toggleBy: 'words' }; }
  if (o.s2.toggle) { o.s2.before = await togState(tog);
    if (o.s2.before !== 'false') { await tog.locator('.q-toggle__inner, .q-toggle__track').first().click().catch(async () => { await tog.click().catch(() => {}); }); await W(800); o.s2.afterClick = await togState(tog);
      if (o.s2.afterClick !== 'false') { await tog.focus().catch(() => {}); await p.keyboard.press('Space'); await W(800); o.s2.afterSpace = await togState(tog); } }
    o.s2.fieldProblemsBeforeSave = await fieldProblems(); await shot('s2-time-clock-off-before-save');
    o.s2.save = await saveClose('s2'); }
  for (let i = 0; i < 10; i++) { const rr = await recA(); if (rr && !rr.clockable) break; await W(1000); }
  o.s2.serverTimeClock = (await recA())?.clockable ?? null; o.s2.savedThroughScreen = o.s2.serverTimeClock === false;
  console.log(t(), 'C614714 step 2', JSON.stringify({ toggle: [o.s2.before, o.s2.afterClick, o.s2.afterSpace], click: o.s2.save?.click, question: o.s2.save?.question ?? null, windowOpen: o.s2.save?.editWindowOpen, fieldProblems: o.s2.save?.fieldProblems, messages: o.s2.save?.messages, requests: o.s2.save?.requests, serverTimeClock: o.s2.serverTimeClock }));
  await p.keyboard.press('Escape').catch(() => {}); await W(800);
  fs.writeFileSync(path.join(EV, 'C614714-r4.json'), JSON.stringify(o, null, 1));
  // ---- steps 3-5 (as C614714-stg)
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await search(p, CUST); await W(2000);
  const cols = await allBoardCols(p); const c1 = cols.find((x: any) => (x.cards ?? []).includes(o.data.wo1));
  o.s4_column = c1 ? { id: c1.id === A.staff_id ? 'Technician-A' : c1.id, name: c1.name, cards: c1.cards } : 'WO-1 not on the board';
  if (await toColumn(p, A.staff_id)) await shot('s4-column');
  await drag(p, `[data-test-id="board_card_${w2}"]`, `[data-test-id="board_column_${A.staff_id}"]`).catch((e) => { o.s5_dragError = String(e).slice(0, 120); });
  o.s5_messages = await toasts(p); o.s5_wo2Lead = (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id ?? null;
  o.s5_columnAfter = (await allBoardCols(p)).find((x: any) => x.id === A.staff_id)?.cards ?? null; await shot('s5-after-drop');
  // ---- step 6
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000); o.s6_rowGroupKey = await findRow(p, w1, A.staff_id).catch(() => null);
  const g = await groups(p); o.s6_group = g.filter((x) => x.rows.includes(o.data.wo1)).map((x) => ({ name: x.name, id: x.id === A.staff_id ? 'Technician-A' : x.id, rows: x.rows }));
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_row_${w1}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await W(600); await shot('s6-tech-view');
  // ---- step 7: the row opens its work order (number link, else a plain cell)
  const link = p.locator(`[data-test-id="number_link_${w1}"]`).first(); o.s7_numberLink = await link.count();
  if (o.s7_numberLink) await link.click().catch(() => {}); else await p.locator(`[data-test-id="tech_view_row_${w1}"] td`).nth(3).click().catch(() => {});
  for (let i = 0; i < 10 && !p.url().includes(`/workorders/${w1}`); i++) await W(1000);
  o.s7_opened = p.url().includes(`/workorders/${w1}`); await W(4000); await shot('s7-wo-page');
  if (!o.s7_opened) { await p.goto(`${APP}/workorders/${w1}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); o.s7_note = 'the row did not open the page; opened by its address to continue (step 7 NOT seen working)'; }
  // ---- step 8: close the New Line window (and its question), then Lead Technician -> Unassigned through the page
  const s8: any = (o.s8 = {}); s8.windowsOnOpen = await windows();
  for (let i = 0; i < 3; i++) { const nl = p.locator('.q-dialog:visible').filter({ hasText: /New Line/i }).last(); if (!(await nl.count())) break;
    const x = nl.locator('button').filter({ hasText: /^\s*close\s*$/i }).first(); s8[`close${i}`] = (await x.count()) ? await x.click().then(() => 'close button').catch(() => 'close click failed') : (await p.keyboard.press('Escape').then(() => 'Escape'));
    await W(1200); const ws = await windows(); const qn = ws.find((w: any) => !/New Line/i.test(w.text) && w.buttons.length);
    if (qn) { const yes = qn.buttons.find((b: string) => /^(Yes|Discard|Close|Leave|OK|Confirm)/i.test(b)); s8[`question${i}`] = { text: qn.text, buttons: qn.buttons, answered: yes ?? null };
      if (yes) { await p.locator('.q-dialog button:visible').filter({ hasText: new RegExp('^\\s*' + yes + '\\s*$') }).last().click().catch(() => {}); await W(1500); } } }
  s8.windowsLeft = await windows(); await shot('s8-new-line-closed');
  s8.leadCandidates = await p.evaluate(`[...document.querySelectorAll('[data-test-id*="lead" i], .q-field')].filter(e => { const t = (e.getAttribute('data-test-id') || '') + ' ' + ((e.querySelector && e.querySelector('.q-field__label')) || {}).textContent; return /lead/i.test(t) && e.getBoundingClientRect().width > 0; }).slice(0, 10).map(e => ({ tid: e.getAttribute('data-test-id'), tag: e.tagName, cls: String(e.className).slice(0, 50), text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), clickable: !!e.closest('button, .q-field, [role=button], [role=combobox]') || getComputedStyle(e).cursor === 'pointer' }))`).catch(() => []);
  const fieldSel = ['[data-test-id="select_lead_technician"]', '.q-field:has(.q-field__label:text-matches("Lead Tech", "i"))', '[data-test-id="lead_technician_readonly"]', '[data-test-id*="lead_technician" i]'];
  let opener: any = null; for (const sel of fieldSel) { const l = p.locator(sel).first(); if ((await l.count()) && (await l.isVisible().catch(() => false))) { opener = { sel, l }; break; } }
  s8.fieldUsed = opener?.sel ?? 'no Lead Technician field found on the page';
  if (opener) { const pk = await pickTech(p, async () => { await opener.l.click(); }, 'C614714 Lead Technician (work order page)', { prefer: ['Unassigned'], exact: true }); s8.pick = { picked: pk.picked, count: pk.list.count, first: pk.list.first, reason: pk.reason ?? null }; await W(2500); s8.messages = await toasts(p);
    const qn = (await windows()).find((w: any) => w.buttons.length && /shift|lead/i.test(w.text)); if (qn) s8.questionAfterPick = qn; }
  s8.serverLead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id ?? null; s8.route = s8.serverLead ? 'screen did not clear the lead (no fallback used)' : 'screen';
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000); s8.pageReads = await woPageLead(p, APP, w1).catch(() => null); await shot('s8-lead-after');
  console.log(t(), 'C614714 step 8', JSON.stringify({ windows: s8.windowsOnOpen?.map((w: any) => w.text.slice(0, 60)), close: [s8.close0, s8.question0], fieldUsed: s8.fieldUsed, candidates: s8.leadCandidates, pick: s8.pick, serverLead: s8.serverLead, pageReads: s8.pageReads }));
  // ---- steps 9-10
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
  o.s9_columnForA = (await allBoardCols(p)).some((x: any) => x.id === A.staff_id); await shot('s9-board');
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000);
  { const g10 = await groups(p); o.s10_groupForA = g10.some((x) => x.id === A.staff_id); o.s10_wo1Group = g10.find((x) => x.rows.includes(o.data.wo1))?.name ?? null; } await shot('s10-tech');
  // ---- positive control for step 5 (Rule 104)
  const es = (await candidates(a)).find((x) => x.name === 'Esther Howard');
  if (es) { await display(p, 'Board View'); await search(p, CUST); await toColumn(p, es.id); await drag(p, `[data-test-id="board_card_${w2}"]`, `[data-test-id="board_column_${es.id}"]`).catch(() => {});
    o.control5 = { messages: await toasts(p), accepted: (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id === es.id };
    await a.post('/api/work-orders/change-lead-technician', { work_order_id: w2, tech_assigned_id: null }); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'C614714-r4.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614714', JSON.stringify(o).slice(0, 3000)); await done(browser);
