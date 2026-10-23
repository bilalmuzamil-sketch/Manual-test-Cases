/** invoice-fail-1023.mts — 23 Oct 2026, PRODUCTION. C368170 step 2 twice showed "Part of the page failed to load" right after Create Invoice
 *  (no payment window, still Complete). Which request fails? Opens the newest "ZZAUTOTEST Edit WO Card Refused" work order (Complete),
 *  Finance tab, clicks Create Invoice, and records every failed request and every response >= 400, plus what shows. Pictures EV/invfail-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, toasts } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { failed: [], bad: [] };
p.on('requestfailed', (r) => o.failed.push(`${r.method()} ${r.url().slice(0, 160)} :: ${r.failure()?.errorText}`));
p.on('response', (r) => { if (r.status() >= 400) o.bad.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 160)}`); });
try {
  const ws = (await workOrders(a, 'ZZAUTOTEST Edit WO Card Refused')).filter((w: any) => /complete/i.test(w.status ?? '')); o.found = ws.map((w: any) => `${w.number} ${w.status}`).slice(0, 5);
  const w = ws.sort((x: any, y: any) => String(y.number).localeCompare(String(x.number), undefined, { numeric: true }))[0]; if (!w) throw new Error('no Complete work order');
  o.wo = w.number; await p.goto(`${APP}/workorders/${w.id}/finance`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  o.failedBeforeClick = o.failed.length; o.badBeforeClick = o.bad.length;
  await p.locator('button').filter({ hasText: /^\s*Create Invoice\s*$/ }).first().click(); await p.waitForTimeout(8000);
  o.dialogs = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ').slice(0, 140))`); o.messages = await toasts(p);
  await p.screenshot({ path: path.join(EV, 'invfail-after-click.png') });
  o.statusAfter = (await a.get(`/api/work-orders/${w.id}`)).body?.data?.work_order?.status ?? null;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'INVFAIL', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'invoice-fail-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
