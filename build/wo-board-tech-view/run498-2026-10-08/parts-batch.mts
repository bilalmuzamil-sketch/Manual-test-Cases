/**
 * PARTS / RETURNS COUNTS (2026-10-09): C368213. The case needs [WO-1] with TWO part requests, ONE of them received
 * with ONE return raised. Earlier pass: the canned line gave one request and the return refused ("part_id: Not found")
 * because nothing had been received. Route (playbook §X + the WO receive path): a canned line (no requests kept) →
 * two vendor part requests (`work-orders/part/make-request`) → Order the first (`perform-request-status-action`) →
 * RECEIVE it on its Purchase Order page through the screen (invoice number filled, Sell > 0, Receive) → the received
 * part is on the line → `make-return-request` on that part → List with Parts and Returns switched on.
 * Positive control: the API row's partRequestsCount / partReturnRequestsCount read beside the screen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const R: any = {}; const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 200) : ''}`;
const rows = (r: any) => { const d = r?.body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.data ?? d?.items ?? []; };
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return (Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []) as any[]; };
const o: any = {};
try {
  const q = `ZZAUTOTEST WO Parts Counts ${Date.now() % 100000}`; o.q = q;
  const c = await customer(a, q, 'TRK-118'); const w = await workOrder(a, c, 'estimate', null);
  const canned = rows(await a.get('/api/work-orders/canned-lines'));
  const lr = await a.post(`/api/work-orders/${w}/lines/create-from-canned-line`, { canned_line_id: canned[1 % canned.length].id, status: 'authorized' }); const line = lr.body?.data?.line_id;
  for (const r of (await linesRaw(w))[0]?.part_requests ?? []) await a.post(`/api/work-orders/part/remove-request/${r.id}`, {});
  o.approve = say(await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }));
  const vendors = rows(await a.get('/api/parts-catalogue/vendors?search=ZZ')).concat(rows(await a.get('/api/parts-catalogue/vendors')));
  const vendor = vendors.find((v: any) => v.id) ; const cats = rows(await a.get('/api/inventory/categories')); const cat = cats[0]?.value ?? cats[0]?.id;
  o.vendor = vendor?.name; o.cat = !!cat;
  for (const [i, pn] of ['ZZPC-A', 'ZZPC-B'].entries())
    o[`req${i}`] = say(await a.post('/api/work-orders/part/make-request', { line, work_order: w, description: `ZZAUTOTEST parts count ${pn}`, quantity: 1, part_source_type: 'vendor', part_category_id: cat, part_number: `${pn}-${Date.now() % 10000}`, cost: 10, sell_price: 20, vendor: vendor?.id, is_core: false }));
  let reqs = (await linesRaw(w))[0]?.part_requests ?? []; o.requests = reqs.map((r: any) => `${r.part_number}:${r.status}`);
  o.order = say(await a.post('/api/work-orders/part/perform-request-status-action', { part_request_id: reqs[0].id, action: 'order' }));
  reqs = (await linesRaw(w))[0]?.part_requests ?? []; const r0 = reqs.find((r: any) => r.id === reqs[0].id) ?? reqs[0]; o.afterOrder = reqs.map((r: any) => `${r.part_number}:${r.status}:${r.order_id ? 'po' : '-'}`);
  const orderId = r0.order_id; const itemId = r0.order_item_id;
  // receive through the screen
  await p.goto(`${APP}/order/${orderId}?receive=1&returnTo=WorkOrder&returnId=${w}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await p.locator(`[data-test-id="input_invoice_${orderId}"]`).fill(`ZZINV${Date.now() % 100000}`);
  const sell = p.locator(`[data-test-id="input_sell_${itemId}"]`); if (await sell.count()) { const v = await sell.inputValue().catch(() => ''); if (!(Number(v) > 0)) await sell.fill('20'); }
  await shot(p, 'C368213-receive'); await p.locator(`[data-test-id="button_receive_po_${orderId}"]`).click(); await p.waitForTimeout(7000); o.afterReceiveUrl = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>');
  const l = (await linesRaw(w))[0]; o.lineParts = (l?.parts ?? []).map((x: any) => `${x.part_number}:${x.status ?? ''}`); o.requestsNow = (l?.part_requests ?? []).map((r: any) => `${r.part_number}:${r.status}`);
  const part = (l?.parts ?? [])[0]; o.partKeys = part ? Object.keys(part).join(',').slice(0, 300) : null;
  if (part) o.ret = say(await a.post('/api/work-orders/part/make-return-request', { part_id: part.part_id ?? part.id, work_order_id: w, quantity: 1, return_reason: 'ZZAUTOTEST parts count' }));
  const row = (await workOrders(a, q))[0]; o.api = { parts: row?.partRequestsCount, returns: row?.partReturnRequestsCount, number: row?.number };
  // the case's steps on the screen
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, 'List'); await search(p, q); await p.waitForTimeout(3000);
  await p.locator('[data-test-id="button_column_selection"]').click(); await p.waitForTimeout(800);
  for (const k of ['toggle_column_partRequestsCount', 'toggle_column_partReturnRequestsCount']) { const s = p.locator(`[data-test-id="${k}"]`); const on = await s.evaluate((e) => !!e.querySelector('.q-toggle__inner--truthy') || (e.querySelector('[aria-checked]') ?? e).getAttribute('aria-checked') === 'true').catch(() => null); if (on === false) { await s.click(); await p.waitForTimeout(500); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  o.heads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.replace('arrow_drop_up','').trim())`);
  o.rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).map(r => [...r.cells].map(c => c.innerText.trim()))`);
  const hi = (h: string) => (o.heads as string[]).indexOf(h); const r1 = (o.rows as string[][]).find((r) => r.includes(o.api.number)) ?? null;
  o.screen = r1 ? { parts: r1[hi('Parts')], returns: r1[hi('Returns')] } : null; await shot(p, 'C368213-list');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, 'C368213-error'); }
R.C368213 = o; console.log(t(), 'C368213', JSON.stringify(o).slice(0, 4000));
fs.writeFileSync(path.join(EV, 'parts-batch.json'), JSON.stringify(R, null, 1)); await done(browser);
