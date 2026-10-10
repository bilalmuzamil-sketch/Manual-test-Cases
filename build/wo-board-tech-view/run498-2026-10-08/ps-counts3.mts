/**
 * C368217 (2026-10-10) — Part Sales list counts. Fix of ps-counts2: building the setup through the "Add Part" window's typed
 * part never found its Part Number box. The setup is a PRECONDITION, so it is made the reliable way (playbook "Add parts (UI,
 * reliable)": pick a catalogue part) and the return is raised with make-return-request; the CHECK itself is the case's own:
 * Parts > Part Sales, type the number in Search, read the Parts and Returns columns.
 * Positive control: the second location's part sale gets its own two parts, and its row is read the same way, so "not added"
 * is measured against counts that really exist.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { api, customer } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { HEAVY, LETH } from './staff.mts';
const { browser, page: p } = await open('/parts/part-sales'); p.setDefaultTimeout(25_000); const a = api(p); const o: any = {}; const stamp = Date.now() % 100000;
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as Promise<string[]>;
const st = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 160) : ''}`;
async function partSale(name: string) { const c: any = await customer(a, name, 'PSC-1'); const r = await a.post('/api/part-sales', { company_id: c.company_id }); const id = r.body?.data?.[0]?.id ?? r.body?.data?.id; return { id, number: (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order?.number, create: st(r) }; }
async function addPart(id: string, term: string) { await p.goto(APP + `/parts/part-sale/${id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  /* FIX 2 (2026-10-10): a new part sale OPENS the Add Part window by itself and Escape does not close it — it covered the
     Add Part button. Use the open window; open it with the button only when none is showing. */
  let d = p.locator('.q-dialog').filter({ hasText: 'Add Part' }).last(); if (!(await d.isVisible().catch(() => false))) { await p.locator('[data-test-id="button_add_part"]').first().click(); d = p.locator('.q-dialog').filter({ hasText: 'Add Part' }).last(); await d.waitFor({ timeout: 15_000 }); }
  await p.waitForTimeout(1500); const sel0 = d.locator('[data-test-id="select_part"]').first(); const pn = (await sel0.count()) ? sel0 : d.locator('.q-field').filter({ hasText: /Part Number/ }).first();
  await pn.click(); await p.keyboard.type(term, { delay: 70 }); const opt = p.locator('.q-menu .q-item:not(.disabled)').first(); await opt.waitFor({ timeout: 15_000 }).catch(() => {});
  if (!(await opt.count())) { return `no option for ${term}`; } const label = (await opt.innerText()).replace(/\s+/g, ' ').slice(0, 60); await opt.click(); await p.waitForTimeout(2000);
  const q0 = d.locator('[data-test-id^="input_bin_quantity_"], [data-test-id="input_workorder_part_quantity"]').first(); const q = (await q0.count()) ? q0 : d.locator('.q-field').filter({ hasText: /^\s*Quantity/ }).locator('input').first(); await q.fill('1').catch(() => {});
  await d.getByRole('button', { name: /Save & Close/i }).first().click(); await p.waitForTimeout(4000); return label + (await p.locator('.q-dialog').filter({ hasText: 'Add Part' }).count() ? ' (window still open)' : ''); }
const parts = async (id: string) => { const d = (await a.get(`/api/work-orders/lines/${id}`)).body?.data; const c = Array.isArray(d) ? d : d?.collection ?? []; return c.flatMap((l: any) => [...(l.part_requests ?? []), ...(l.parts ?? [])]); };
async function listRow(num: string) { await p.goto(APP + '/parts/part-sales', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const box = p.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').click().catch(() => {}); if (!(await box.isVisible().catch(() => false))) await p.getByText('Search', { exact: true }).first().click().catch(() => {}); }
  await box.fill(num); await p.waitForTimeout(4500);
  const heads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim())`) as string[];
  const rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.offsetHeight > 0).map(r => [...r.cells].map(c => c.innerText.trim()))`) as string[][];
  const row = rows.find((r) => r[0] === num); const at = (h: string) => row ? row[heads.indexOf(h)] : null; return { heads, row: row ?? null, parts: at('Parts'), returns: at('Returns'), rowsShown: rows.length }; }
try {
  const ps = await partSale(`ZZAUTOTEST Part Sale Counts ${stamp}`); o.ps1 = ps;
  o.add1 = await addPart(ps.id, 'Brake'); o.add2 = await addPart(ps.id, 'Brake');
  /* FIX 3 (2026-10-10): a return needs a RECEIVED part — the case's own setup clicks (Authorize, Order, Receive, Return
     part), reused from ps-counts2 where they were written but never reached; the number is read off the sale's own page
     (the list shows "P10043-262", the API says "P-262"). */
  const page = APP + `/parts/part-sale/${ps.id}/part-requests`; const st = (x: string) => { o.stages = [...(o.stages ?? []), x]; };
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const num = (await p.locator('body').innerText()).match(/\bP\d+-\d+\b/)?.[0] ?? ps.number;   // FIX 4: the number as the list shows it (P10043-264), not the API's P-264 o.number = num;
  const btn = (re: RegExp) => p.getByRole('button', { name: re }).first(); const dlgText = () => p.locator('.q-dialog').last().innerText().then((x) => x.replace(/\s+/g, ' ').slice(0, 300)).catch(() => null);
  await btn(/^Authorize$/).click(); await p.waitForTimeout(2000); if (await p.locator('.q-dialog').count()) { st('authorize dialog: ' + (await dlgText())); await p.locator('.q-dialog').last().getByRole('button', { name: /Authorize|Confirm|Yes|OK/i }).last().click().catch(() => {}); await p.waitForTimeout(2500); }
  st('after authorize: ' + (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200)); await shot(p, 'C368217-authorized');
  await btn(/^Order$/).click(); await p.waitForTimeout(2500); if (await p.locator('.q-dialog').count()) { st('order dialog: ' + (await dlgText())); await p.locator('.q-dialog').last().getByRole('button', { name: /Order|Create|Confirm|Save/i }).last().click().catch(() => {}); await p.waitForTimeout(3000); }
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await shot(p, 'C368217-ordered');
  await btn(/^Receive$/).click(); await p.waitForTimeout(3000); st('receive window: ' + (await dlgText())); const d = p.locator('.q-dialog').last();
  // the order can come out "Vendor missing": choose the vendor before receiving (playbook)
  const vend = d.locator('[data-test-id*="vendor" i]').first(); if (await vend.count() && /Vendor missing/i.test((await dlgText()) ?? '')) { await vend.click(); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').first().click().catch(() => {}); await p.waitForTimeout(1200); st('vendor picked'); }
  const field = (re: RegExp) => d.getByLabel(re).first(); await field(/Vendor Invoice/i).fill(`ZZINV-PS1-${stamp}`).catch(() => st('no invoice field'));
  await d.getByLabel(/Part (Number|#)/i).first().fill('ZZPN-PS1').catch(() => st('no part number field')); await d.getByLabel(/Qty Received|Received/i).first().fill('1').catch(() => st('no qty field'));
  await d.locator('tbody .q-checkbox, tbody [role=checkbox]').first().click().catch(async () => { st('no row tick - using Select All'); await d.getByText('Select All', { exact: true }).first().click().catch(() => st('no Select All')); }); await p.waitForTimeout(800); await shot(p, 'C368217-receive-window');
  await d.getByRole('button', { name: /Receive Parts/i }).first().click().catch(() => st('no Receive Parts button')); await p.waitForTimeout(4000); o.receiveToasts = await toasts();
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); st('after receive: ' + (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260));
  await btn(/Return part|^Return$/).click().catch(() => st('no Return part button')); await p.waitForTimeout(2500); st('return window: ' + (await dlgText()));
  const rd = p.locator('.q-dialog').last(); await rd.getByLabel(/Return Reason|Reason/i).first().fill('ZZAUTOTEST wrong part').catch(() => st('no reason field')); await rd.getByRole('button', { name: /Save & Close/i }).first().click().catch(() => st('no Save & Close')); await p.waitForTimeout(3500); o.returnToasts = await toasts();
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.setupCheck = { tab: await p.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Parts/ }).first().innerText().catch(() => null), rows: (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260) }; await shot(p, 'C368217-setup-check');
  o.ps1number = num;
  // second location: its own part sale with two parts (the counts that must NOT be added)
  o.toL2 = st(await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }));
  const ps2 = await partSale(`ZZAUTOTEST Part Sale Counts L2 ${stamp}`); o.ps2 = ps2; o.l2add = [await addPart(ps2.id, 'Brake'), await addPart(ps2.id, 'Brake')]; o.l2parts = (await parts(ps2.id)).length;
  await p.goto(APP + `/parts/part-sale/${ps2.id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); const num2 = (await p.locator('body').innerText()).match(/\bP\d+-\d+\b/)?.[0] ?? ps2.number; o.ps2number = num2; o.l2row = await listRow(num2); await shot(p, 'C368217-v3-l2-list');
  o.toL1 = st(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
  // THE CHECK (the case's steps): Parts > Part Sales, search the number, read Parts and Returns
  o.check = await listRow(o.ps1number ?? ps.number); await shot(p, 'C368217-v3-list');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, 'C368217-v3-error'); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }).catch(() => {}); }
console.log(t(), 'C368217', JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'ps-counts3.json'), JSON.stringify({ C368217: o }, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
