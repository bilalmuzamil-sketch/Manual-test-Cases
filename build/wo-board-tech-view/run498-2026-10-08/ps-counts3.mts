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
const st = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 160) : ''}`;
async function partSale(name: string) { const c: any = await customer(a, name, 'PSC-1'); const r = await a.post('/api/part-sales', { company_id: c.company_id }); const id = r.body?.data?.[0]?.id ?? r.body?.data?.id; return { id, number: (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order?.number, create: st(r) }; }
async function addPart(id: string, term: string) { await p.goto(APP + `/parts/part-sale/${id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(700); }
  await p.locator('[data-test-id="button_add_part"]').first().click(); const d = p.locator('.q-dialog').last(); await d.waitFor({ timeout: 15_000 });
  const sel = d.locator('[data-test-id="select_part"]').first(); for (let i = 0; i < 15 && !(await sel.count()); i++) await p.waitForTimeout(1000);
  await sel.click(); await p.keyboard.type(term, { delay: 60 }); const opt = p.locator('.q-menu .q-item:not(.disabled)').first(); await opt.waitFor({ timeout: 15_000 }).catch(() => {});
  if (!(await opt.count())) { await p.keyboard.press('Escape'); return `no option for ${term}`; } const label = (await opt.innerText()).replace(/\s+/g, ' ').slice(0, 60); await opt.click(); await p.waitForTimeout(1500);
  const q = d.locator('[data-test-id^="input_bin_quantity_"], [data-test-id="input_workorder_part_quantity"]').first(); if (await q.count()) await q.fill('1');
  await d.getByRole('button', { name: /Save & Close/i }).first().click(); await p.waitForTimeout(3500); return label; }
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
  const pr = await parts(ps.id); o.ps1parts = pr.map((x: any) => ({ id: x.id?.slice(0, 8), status: x.status, qty: x.quantity }));
  o.return = st(await a.post('/api/work-orders/part/make-return-request', { part_id: pr[0]?.id, quantity: 1, return_reason: 'ZZAUTOTEST wrong part' }));
  if (!/^2/.test(o.return)) o.returnAlt = st(await a.post('/api/part/manual-return-request/create', { part_id: pr[0]?.id, quantity: 1, return_reason: 'ZZAUTOTEST wrong part' }));
  // second location: its own part sale with two parts (the counts that must NOT be added)
  o.toL2 = st(await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }));
  const ps2 = await partSale(`ZZAUTOTEST Part Sale Counts L2 ${stamp}`); o.ps2 = ps2; o.l2add = [await addPart(ps2.id, 'Brake'), await addPart(ps2.id, 'Brake')]; o.l2parts = (await parts(ps2.id)).length;
  o.l2row = await listRow(ps2.number); await shot(p, 'C368217-v3-l2-list');
  o.toL1 = st(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
  // THE CHECK (the case's steps): Parts > Part Sales, search the number, read Parts and Returns
  o.check = await listRow(ps.number); await shot(p, 'C368217-v3-list');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, 'C368217-v3-error'); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }).catch(() => {}); }
console.log(t(), 'C368217', JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'ps-counts3.json'), JSON.stringify({ C368217: o }, null, 1));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
