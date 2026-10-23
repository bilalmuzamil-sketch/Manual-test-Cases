/**
 * c707077-stg-1023.mts — 23 Oct 2026, STAGING (QA lead: "mark the test case as passed" with the staging reference). C707077 re-run on
 * today's staging build by its current steps, from fixed-1021.mts (C707077 part only). Technician-A = staff record "David Sparks",
 * sign-in "Carol Neal" (L0497 — fixed-1021's header had the pair the wrong way round; the counts below read both names either way).
 * Fresh work order led by her, one approved line with her as its technician; Lines tab (Labor text + roster), Edit Line Technicians,
 * Cancel, Board View card + column header. Pictures EV/C707077-stg1023-*.png. Records only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { HEAVY } from './staff.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, shot, display, tab, search, switchLocUI, findRow, allBoardCols, toColumn, ensureLocation } from './wob.mts';
import { staffRows } from './staff.mts';
const only = (process.env.ONLY || '').split(',').filter(Boolean); const want = (id: string) => !only.length || only.includes(id);
const OUT = path.join(EV, 'c707077-stg-1023.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p); const W = (ms: number) => p.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list'; const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const R: any = { started: new Date().toISOString() }; const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const RUNNO = String(Date.now() % 100000);
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body).slice(0, 140) : ''}`;
const nm = (x: any) => typeof x === 'string' ? x : x?.name ?? '';
async function home(display_: string) {
  const v: any = {}; for (const [k, x] of Object.entries(ORIGINAL)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: [] }); await a.put(PREF, { value: v });
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500);
  const loc = await ensureLocation(p, a, HEAVY);
  await tab(p, 'All').catch(() => {}); await display(p, display_); return loc;
}
async function run(id: string, f: (o: any) => Promise<void>) {
  if (!want(id)) return; const o: any = (R[id] = {});
  try { await f(o); } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, `${id}-stg1023-error`).catch(() => {}); }
  save(); console.log(id, JSON.stringify(o).slice(0, 2500));
}
R.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);

await run('C707077', async (o) => {
  const CN = (await staffRows(a, 'Carol')).find((x: any) => x.first_name === 'Carol' && x.last_name === 'Neal' && x.staff_id);
  if (!CN) throw new Error('Carol Neal not found (setup not done)');
  o.staffRecord = `${CN.first_name} ${CN.last_name}`; o.accountName = [CN.user_first_name ?? CN.user?.first_name, CN.user_last_name ?? CN.user?.last_name].filter(Boolean).join(' ') || null;
  const name = `ZZAUTOTEST C11577 Staff Name ${RUNNO}`; const c = await customer(a, name, 'C11577-U1');
  const id = await workOrder(a, c, 'approved', null); o.wo = (await workOrders(a, name)).find((x: any) => x.id === id)?.number;
  const canned: any[] = []; { const cc = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(cc) ? cc : cc?.collection ?? [])); }
  const G = canned.find((x: any) => /Full grease service/i.test(String(x.canned_line_name ?? x.name ?? ''))) ?? canned[0];
  const ln = (await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: G.id, status: 'authorized' })).body?.data?.line_id;
  o.lead = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: CN.staff_id }));
  o.lineTech = ln ? say(await a.put(`/api/work-orders/lines/${ln}/technicians`, { staffIds: [CN.staff_id] })) : 'no line';
  const lines = (await a.get(`/api/work-orders/lines/${id}`)).body?.data; const L = (Array.isArray(lines) ? lines : lines?.collection ?? [])[0]; o.lineName = L?.line_name?.trim();
  o.apiLineTechs = (L?.assigned_techs ?? []).map((x: any) => `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim());
  o.location = await home('List');
  // positive control (L0402): the List's Lead Technician column shows the ACCOUNT name; it must differ from the staff record name, else
  // this test cannot show the fault at all
  await search(p, name); await W(2500);
  o.listLead = await p.evaluate(`(() => { const ths = [...document.querySelectorAll('thead th')].filter(th => th.getBoundingClientRect().width > 0); const i = ths.findIndex(th => /Lead Technician/.test(th.innerText));
    const row = [...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes(${JSON.stringify(o.wo)})); return row && i >= 0 ? (row.cells[i] || {}).innerText?.trim() : null; })()`);
  await shot(p, 'C707077-stg1023-control-list-lead');
  await p.goto(APP + `/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); o.linesHeader = await ensureLocation(p, a, HEAVY).catch((e: any) => String(e.message));
  const names = (t: string) => ({ staff: (t.match(/Carol Neal/g) || []).length, account: (t.match(/David Sparks/g) || []).length });
  const block = await p.evaluate(`(() => { const n = ${JSON.stringify(o.lineName || 'Full grease service')}; const el = [...document.querySelectorAll('[data-test-id^="line_"], .line-card, .q-card, tr')].filter(e => e.innerText && e.innerText.includes(n)).sort((a, b) => a.innerText.length - b.innerText.length)[0];
    const labor = [...document.querySelectorAll('*')].filter(e => e.children.length < 6 && /Labor/.test(e.innerText || '') && (e.innerText || '').length < 300).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 6);
    const roster = [...document.querySelectorAll('[data-test-id*="roster"], [data-test-id*="technician"]')].map(e => (e.getAttribute('data-test-id') || '') + ' = ' + (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || '').replace(/\\s+/g, ' ').trim()).filter(x => /Carol|David|Neal|Sparks|CN|DS/.test(x)).slice(0, 12);
    return { text: el ? el.innerText.replace(/\\s+/g, ' ').slice(0, 900) : null, labor, roster, pageNames: { staff: (document.body.innerText.match(/Carol Neal/g) || []).length, account: (document.body.innerText.match(/David Sparks/g) || []).length } }; })()`) as any;
  o.s1_2 = { ...block, blockNames: block.text ? names(block.text) : null }; await shot(p, 'C707077-stg1023-s1-lines');
  await p.getByText(o.lineName || 'Full grease service', { exact: false }).first().click().catch(() => {}); await W(2500);
  const d = p.locator('.q-dialog').filter({ hasText: 'Edit Line' }).last(); o.s3 = await d.count();
  o.s4 = await d.evaluate((e: any) => ({ roster: [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.replace(/\s+/g, ' ').trim()), staff: (e.innerText.match(/Carol Neal/g) || []).length, account: (e.innerText.match(/David Sparks/g) || []).length })).catch(() => null);
  await shot(p, 'C707077-stg1023-s4-edit-line');
  const cancel = d.locator('button').filter({ hasText: /^\s*Cancel\s*$/ }).first(); if (await cancel.count()) await cancel.click(); else await p.keyboard.press('Escape'); await W(1500); o.s5 = { dialogs: await p.locator('.q-dialog').filter({ hasText: 'Edit Line' }).count() };
  await home('Board View'); await search(p, name); await W(2500);
  const cols = await allBoardCols(p); const col = cols.find((x: any) => (x.cards || []).includes(o.wo)) ?? cols.find((x: any) => x.id === CN.staff_id);
  o.s7 = { column: col ? col.name : null, cards: col?.cards ?? null }; if (col) await toColumn(p, col.id);
  o.s7.cardText = await p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="board_card_"]')].find(e => e.innerText.includes(${JSON.stringify(o.wo)})); return c ? c.innerText.replace(/\\s+/g, ' ').slice(0, 300) : null; })()`);
  await shot(p, 'C707077-stg1023-s7-board');
});
R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); save();
await RUN.end().catch(() => {});
await done(browser);
