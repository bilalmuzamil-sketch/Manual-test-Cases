// SV-11950 ($0.00 invoice listed as Paid with a paid date) and SV-11951 (deposit part-paid invoice shown Paid, paid date =
// invoice date) — staging half. Stored values (work order view: invoice status, totals, customer_payments incl. deposits;
// report rows: status / createdOn / paidDate), the day each falls on in the location's zone (machine tz db), and the Sales
// Tax Collected screen (Last month, then Invoice Status: Partially Paid) with all four zones recorded.
// Usage: TZ=Pacific/Fiji node sv11950_51_staging.mjs DVI
import { boot, rule99, LOC, sleep, save, dayIn, get, OUT } from './common.mjs';
import fs from 'fs';
const key = process.argv[2] || 'DVI'; const loc = LOC[key]; const APP = 'https://app.staging.shopview.com';
const D = `${OUT}/SV-11950_51`; fs.mkdirSync(D, { recursive: true });
const WO = { 'S1-38218': '652bd535-ae94-4ad5-8e81-7e2db6f6902c', 'S1-38221': '1cf29c7d-295e-4919-be7e-12e90806e534', 'S1-38219': '420b6744-19e3-482e-aa9c-a682484065cd' };
const r = await boot(loc); const page = r.page; page.setDefaultTimeout(30000);
const rep = []; page.on('response', async q => { const u = q.url(); if (/sales-tax-report/.test(u)) { let b = null; try { b = await q.json(); } catch {} rep.push({ at: new Date().toISOString(), u: decodeURIComponent(u.replace('https://api.staging.shopview.com', '')), b }); } });
const d = s => s ? { stored_utc: s, local: dayIn(s, loc.tz).local, day_in_location_zone: dayIn(s, loc.tz).day, day_in_toronto: dayIn(s, 'America/Toronto').day } : null;
const res = { tickets: ['SV-11950', 'SV-11951'], location: loc.name, zone: loc.tz, rule99_start: r.rule99, stored: {}, screen: {} };
// (a) stored values, read inside the page
for (const [n, id] of Object.entries(WO)) {
  const v = await get(page, '/work-orders/view/' + id); const w = v.j?.data?.work_order || {};
  res.stored[n] = { status: v.s, ...Object.fromEntries(['display_number', 'invoice_status', 'open_balance', 'total', 'sub_total_with_tax', 'deposits_total', 'invoiced_at', 'invoice_date', 'completed_at', 'created_at'].filter(k => k in w).map(k => [k, w[k]])),
    deposit_total: w.deposit_total, invoice_balance: w.invoice_balance, payments_applied: w.payments_applied,
    customer_payments: (w.customer_payments || []).map(p => ({ payment_date: d(p.payment_date), applied_amount: p.applied_amount, amount: p.amount, is_deposit: p.is_deposit, status: p.status, created_at: p.created_at })),
    deposits: (w.deposits || []).map(x => Object.fromEntries(Object.entries(x).filter(([k, v]) => /date|_at|amount|number|status|method/i.test(k) && !(v && typeof v === 'object')).map(([k, v]) => [k, /date|_at/i.test(k) && typeof v === 'string' && /^\d{4}-/.test(v) ? d(v) : v]))) };
}
// (b) screen: Sales Tax Collected, Last month, then Invoice Status: Partially Paid
await page.goto(APP + '/reports/sales-tax', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
const chip = async re => { const c = page.getByText(re, { exact: false }).first(); await c.click({ timeout: 10000 }).catch(e => res['err_' + re] = e.message.slice(0, 120)); await sleep(1500); };
const pick = async txt => { const it = page.locator('.q-menu').last().getByText(txt, { exact: true }).first(); if (await it.count()) { await it.click(); await sleep(8000); return true; } res['menu_' + txt] = await page.evaluate(() => [...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\s+/g, ' ').slice(0, 300))); return false; };
const rows = () => page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(t => t.innerText.replace(/\s+/g, ' ').trim()).filter(t => /S1-3821[89]|S1-38221|No record/.test(t)));
const chips = () => page.evaluate(() => [...document.querySelectorAll('.q-page *')].filter(e => e.children.length < 4 && /^(Date Range:|Invoice Status)/.test((e.innerText || '').trim())).map(e => e.innerText.replace(/\s+/g, ' ').trim()).slice(0, 4));
await chip('Date Range:'); res.screen.last_month_picked = await pick('Last month'); await page.keyboard.press('Escape').catch(() => {}); await sleep(3000);
res.screen.last_month = { chips: await chips(), rows: await rows(), picture: 'SV-11950_51/sales-tax-DVI-last-month.png' };
await page.screenshot({ path: `${D}/sales-tax-${key}-last-month.png`, fullPage: true });
await chip('Invoice Status'); res.screen.partially_picked = await pick('Partially Paid'); await page.keyboard.press('Escape').catch(() => {}); await sleep(4000);
res.screen.partially_paid = { chips: await chips(), rows: await rows(), body_no_record: await page.evaluate(() => /No record matches these filters/.test(document.body.innerText)), picture: 'SV-11950_51/sales-tax-DVI-partially-paid.png' };
await page.screenshot({ path: `${D}/sales-tax-${key}-partially-paid.png`, fullPage: true });
// report rows the screen received (stored values the screen used)
res.report_requests = rep.map(x => { const coll = x.b?.data?.collection || []; return { at: x.at, u: x.u.slice(0, 220), n: coll.length, targets: coll.filter(c => WO[c.invoiceNumber]).map(c => ({ invoiceNumber: c.invoiceNumber, status: c.status, subTotalWithTax: c.subTotalWithTax, tax: c.tax, createdOn: d(c.createdOn), paidDate: d(c.paidDate) })) }; });
res.rule99_end = await rule99(page, loc);
save(`${D}/staging-${key}-${new Date().toISOString().slice(0, 16).replace(/:/g, '')}Z.json`, res);
console.log(JSON.stringify({ stored: res.stored, screen: res.screen, req: res.report_requests.map(x => ({ u: x.u.slice(0, 160), n: x.n, t: x.targets })), z: res.rule99_end.all_zones_match, ver: res.rule99_end.app_version }, null, 0).slice(0, 6000));
await r.browser.close();
