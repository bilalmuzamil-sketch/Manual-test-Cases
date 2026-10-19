/** sv11393-lists.mts — 19 Oct 2026, LIVE re-observation of SV-11393 ("technician lists stop after about 100 people") for the five tests
 *  that failed on it. Set-up (Rule 107): customer "ZZAUTOTEST SV11393 Lists <n>" with one Approved work order holding ONE line (so the
 *  page offers the Lead Technician field and opens no New Line window), lead Esther Howard. On the work order page, three lists are
 *  opened and read top to bottom (every option, scrolling the list): (1) the status card's Lead Technician; (2) Edit Line (the line's
 *  title) > Add Technician; (3) the line's number > Edit labor > Technician. For each: how many names, the first and last, whether
 *  "Ralph Edwards" is offered; then "Ralph" is typed into the list's own box and what it offers is read. Pictures of each list at the top,
 *  after scrolling to the end, and after typing (2x with QA_DPR=2). Nothing is saved (each window closed without saving).
 *  Output EV/sv11393-lists.json, pictures EV/SV11393-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import type { Locator } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders, candidates } from './data.mts';
import { EV, t, listAllOptions } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
const W = (ms: number) => p.waitForTimeout(ms); const RUN = String(Date.now() % 100000);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `SV11393-${n}.png`) }).catch(() => {});
const optsNow = async () => (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').replace(/^check\s+/, '').trim()).filter(Boolean);
async function readList(tag: string, opener: () => Promise<void>, field: Locator) {
  const r: any = {};
  await opener(); await W(1500); r.menuOpen = await p.locator('.q-menu').filter({ visible: true }).count(); await shot(`${tag}-top`);
  const all = (await listAllOptions(p)).map((x) => x.replace(/^check\s+/, '').trim()); r.count = all.length; r.first = all[0] ?? null; r.last = all[all.length - 1] ?? null;
  r.ralphOffered = all.some((x) => /^Ralph Edwards\b/.test(x)); r.estherOffered = all.some((x) => /^Esther Howard\b/.test(x)); r.lastFive = all.slice(-5); await shot(`${tag}-end`);
  await p.keyboard.press('Escape').catch(() => {}); await W(800);
  // typed: "Ralph" into the list's own box
  await opener(); await W(1200); const inp = field.locator('input').first(); r.hasInput = await inp.count();
  if (r.hasInput) { await inp.fill('Ralph').catch(() => {}); } else await p.keyboard.type('Ralph', { delay: 60 });
  await W(3000); const typed = await optsNow(); r.typed = { term: 'Ralph', boxHolds: r.hasInput ? await inp.inputValue().catch(() => null) : null, count: typed.length, first: typed.slice(0, 6), ralphOffered: typed.some((x) => /Ralph Edwards/.test(x)) };
  await shot(`${tag}-typed-ralph`); await p.keyboard.press('Escape').catch(() => {}); await W(800);
  console.log(t(), `SV-11393 ${tag}`, JSON.stringify({ count: r.count, first: r.first, last: r.last, ralph: r.ralphOffered, typed: r.typed }));
  return r; }
try {
  const ralph = (await candidates(a)).find((x) => x.name === 'Ralph Edwards'); o.ralphIsEligible = !!ralph; o.candidatesCount = (await candidates(a)).length;
  const es = (await candidates(a)).find((x) => x.name === 'Esther Howard');
  const CUST = `ZZAUTOTEST SV11393 Lists ${RUN}`; const c = await customer(a, CUST, 'SV1139'); const w = await workOrder(a, c, 'estimate', null);
  const canned = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data); const cl = canned[0];
  const lr = await a.post(`/api/work-orders/${w}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' }); const lineId = lr.body?.data?.line_id;
  await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); if (es) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: es.id });
  const wo = (await workOrders(a, CUST)).find((x: any) => x.id === w); o.workOrder = { number: wo?.number, status: wo?.status, lead: wo?.techAssignedFirstName ? `${wo.techAssignedFirstName} ${wo.techAssignedLastName}` : 'none', line: String(cl.canned_line_name ?? cl.name ?? '').trim(), lineId: !!lineId };
  console.log(t(), 'START STATE set SV-11393 lists', JSON.stringify({ ...o.workOrder, ralphIsEligibleTechnician: o.ralphIsEligible, eligibleTechnicians: o.candidatesCount }));
  await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000);
  o.newLineWindow = await p.locator('.q-dialog').filter({ hasText: /New Line/i }).count();
  // (1) Lead Technician on the status card
  const lead = p.locator('[data-test-id="select_lead_technician"]').first(); o.leadField = await lead.count();
  if (o.leadField) o.leadTechnician = await readList('lead-technician', async () => { await lead.click(); }, p.locator('.q-field').filter({ has: lead }).first());
  // (2) Edit Line > Add Technician
  await p.getByText(o.workOrder.line, { exact: false }).first().click().catch(() => {}); await W(2500);
  const dlg = p.locator('.q-dialog').last(); o.editLineOpen = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 80);
  const add = dlg.locator('[data-test-id="select_line_roster_add_technician"]').first(); o.addTechField = await add.count();
  if (o.addTechField) o.editLineAddTechnician = await readList('edit-line-add-technician', async () => { await add.click(); }, dlg.locator('.q-field').filter({ has: add }).first());
  await dlg.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click().catch(async () => { await p.keyboard.press('Escape'); }); await W(1500);
  { const q = p.locator('.q-dialog:visible').last(); const txt = (await q.innerText().catch(() => '')).replace(/\s+/g, ' '); if (/discard|unsaved|leave/i.test(txt)) { o.closeQuestion = txt.slice(0, 120); await q.locator('button').filter({ hasText: /Discard|Yes|Leave|OK/i }).first().click().catch(() => {}); await W(1200); } }
  // (3) line number > Edit labor > Technician
  if (lineId) { await p.locator(`[data-test-id="line_number_${lineId}"]`).first().click().catch(() => {}); await W(1200);
    o.lineMenu = (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 12);
    const ed = p.locator('.q-menu .q-item').filter({ hasText: /Edit labor/i }).first(); o.editLaborItem = await ed.count();
    if (o.editLaborItem) { await ed.click(); await W(2500); const d2 = p.locator('.q-dialog').last(); o.editLaborFields = await d2.evaluate((e: any) => [...e.querySelectorAll('.q-field__label')].map((x: any) => x.innerText)).catch(() => []);
      const tf = d2.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Technician/ }) }).first(); o.laborTechField = await tf.count();
      if (o.laborTechField) o.editLaborTechnician = await readList('edit-labor-technician', async () => { await tf.click(); }, tf);
      await d2.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click().catch(async () => { await p.keyboard.press('Escape'); }); await W(1200); }
    else await p.keyboard.press('Escape').catch(() => {}); }
  o.leadAfter = ((await workOrders(a, CUST)).find((x: any) => x.id === w)?.techAssignedFirstName) ?? 'none';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'sv11393-lists.json'), JSON.stringify(o, null, 1)); console.log(t(), 'SV-11393', JSON.stringify(o).slice(0, 2500)); await done(browser);
