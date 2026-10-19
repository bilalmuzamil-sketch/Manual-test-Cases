/** prod-invoice-x.mts — 19 Oct 2026, Rule 121 comparison for C368167 on PRODUCTION (dummy environment, authorised; password sign-in via
 *  prod-login-boot.mjs, credentials stay in /tmp). Question: on production, does closing the "New Customer Payment" window with its X right
 *  after Finance > Create Invoice put the work order back to Complete (as staging does, L0439), or does it stay Invoiced?
 *  Picks a work order whose status is Complete (read from the list API), then through the SCREEN: Finance tab > Create Invoice; server status
 *  read at 2/5/10 s; the payment window closed with its X; status read again; page reloaded; status read again. Every request to /invoices
 *  logged. Pictures at 2x when QA_DPR=2. Output EV/prod-invoice-x.json, pictures EV/C368167-prod-*.png. */
import fs from 'node:fs'; import path from 'node:path';
const EV = process.env.WOB_EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any;
const P = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.QA_DPR || 1) });
const pg = P.page; const APP = P.APP; pg.setDefaultTimeout(20_000); const W = (ms: number) => pg.waitForTimeout(ms);
const o: any = { version: P.version ?? null, at: new Date().toISOString() };
const api = (m: string, u: string, b?: any) => pg.evaluate(async ([m0, u0, b0]: any) => { const r = await fetch(`https://api.shopview.com${u0}`, { method: m0, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: b0 ? JSON.stringify(b0) : undefined }); let j: any = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; }, [m, u, b]);
const state = async (id: string) => { const v = (await api('GET', `/api/work-orders/view/${id}`)).body?.data?.work_order ?? {}; return { status: v.status ?? null, invoice_id: v.invoice_id ?? v.invoiceId ?? null }; };
const shot = (n: string) => pg.screenshot({ path: path.join(EV, `C368167-prod-${n}.png`) }).catch(() => {});
const net: string[] = []; pg.on('request', (r: any) => { if (/invoice|transaction|payment/i.test(r.url())) net.push(`${r.method()} ${r.url().replace(/^https:\/\/[^/]+/, '')}`); });
try {
  const list = (await api('GET', '/api/work-orders?pagination[rowsPerPage]=200&search=')).body?.data?.work_orders ?? [];
  o.statuses = list.reduce((m: any, w: any) => { m[w.status] = (m[w.status] ?? 0) + 1; return m; }, {});
  const w = list.find((x: any) => /^complete$/i.test(String(x.status)));
  if (!w) throw new Error('no Complete work order in the first 200 on production: ' + JSON.stringify(o.statuses));
  o.workOrder = { number: w.number, id: w.id, customer: w.companyName ?? null }; o.before = await state(w.id);
  await pg.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(8000);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Finance\s*$/ }).first().click().catch(() => {}); await W(3500); await shot('1-finance-before');
  const ci = pg.locator('button').filter({ hasText: /^\s*Create Invoice\s*$/i }).first(); o.button = await ci.count(); o.disabled = o.button ? await ci.isDisabled().catch(() => null) : null;
  if (!o.button || o.disabled) throw new Error('Create Invoice not offered/enabled: ' + JSON.stringify({ button: o.button, disabled: o.disabled }));
  await ci.click(); for (const s of [2, 5, 10]) { await W(s === 2 ? 2000 : s === 5 ? 3000 : 5000); o[`server${s}s`] = await state(w.id); }
  await shot('2-after-create');
  const pay = pg.locator('.q-dialog').filter({ hasText: /Payment/i }).last(); o.paymentWindow = await pay.count();
  if (o.paymentWindow) { o.paymentText = (await pay.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160);
    await pay.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click({ timeout: 5000 }).then(() => { o.closedWith = 'X'; }).catch(async () => { await pg.keyboard.press('Escape'); o.closedWith = 'Escape'; });
    await W(4000); o.afterClose = await state(w.id); await shot('3-after-x'); }
  await pg.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000); o.afterReload = await state(w.id); await shot('4-after-reload');
  o.requests = net; o.invoiceUndoneByX = /^complete$/i.test(String(o.afterReload.status)) && /^invoiced$/i.test(String(o.server10s?.status));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); o.requests = net; }
fs.writeFileSync(path.join(EV, 'prod-invoice-x.json'), JSON.stringify(o, null, 1)); console.log('PRODX', JSON.stringify(o));
await P.browser?.close?.().catch(() => {}); process.exit(0);
