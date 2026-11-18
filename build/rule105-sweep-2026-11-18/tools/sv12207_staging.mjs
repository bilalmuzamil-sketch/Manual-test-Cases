// SV-12207 staging half (Rule 105 (3) a+b). For every payment of the vendors found by scan_payments (those with a payment
// whose stored UTC instant falls on another day than the location's day, plus that vendor's other payments as controls):
// stored values (payment, bill and credit dates) -> day in the location's zone (machine tz db) -> Payments tab (screen)
// -> downloaded Remittance Slip text, with all four zones recorded at start and end.
// Usage: TZ=Asia/Karachi node sv12207_staging.mjs HD   (reads /tmp/cln/r105/scan_payments_HD.json)
import { boot, rule99, LOC, sleep, save, dayIn, OUT } from './common.mjs';
import fs from 'fs'; import { execFileSync } from 'child_process';
const key = process.argv[2]; const loc = LOC[key]; const APP = 'https://app.staging.shopview.com';
const D = `${OUT}/SV-12207`; fs.mkdirSync(D, { recursive: true });
const scan = JSON.parse(fs.readFileSync(`/tmp/cln/r105/scan_payments_${key}.json`, 'utf8'));
const vendors = [...new Set(scan.hits.filter(h => h.payment_date >= '2026').map(h => h.vendor_id))];
const r = await boot(loc); const page = r.page; page.setDefaultTimeout(30000);
const net = []; page.on('response', async q => { const u = q.url(); if (/list-by-vendor-account/.test(u)) { let b = null; try { b = await q.json(); } catch {} net.push({ u, b }); } });
const stamp = new Date().toISOString().slice(0, 16).replace(/:/g, '');
const res = { ticket: 'SV-12207', location: loc.name, zone: loc.tz, rule99_start: r.rule99, records: [] };
const dl = s => s ? { stored_utc: s, ...(({ local, day }) => ({ local, day_in_location_zone: day }))(dayIn(s, loc.tz)), day_utc: dayIn(s, 'UTC').day } : null;
for (const vendorId of vendors) {
  net.length = 0;
  await page.goto(`${APP}/parts/vendor/${vendorId}/payments`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('goto', e.message));
  await sleep(10000);
  const exp = await page.locator('tbody tr i, tbody tr button').filter({ hasText: 'expand_more' }).all();
  for (const b of exp.slice(0, 8)) { await b.click({ timeout: 5000 }).catch(() => {}); await sleep(1000); }
  const rowsText = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(tr => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
  const shotFile = `${D}/payments-tab-${key}-${vendorId.slice(0, 8)}.png`; await page.screenshot({ path: shotFile, fullPage: true });
  const pays = net.at(-1)?.b?.data?.collection || [];
  for (const p of pays) {
    const rec = { vendor_id: vendorId, payment_id: p.id, payment: dl(p.payment_date),
      lines: (p.payment_statements || []).map(s => ({ type: s.type, number: s.invoice_number, amount: s.amount, date: dl(s.date || s.transaction_date) })),
      credits: (p.credits || []).map(c => ({ number: c.credit_number || c.invoice_number || c.number, date: dl(c.date || c.credit_date || c.created_at) })),
      screen_rows_for_vendor: rowsText, screenshot_payments_tab: shotFile.replace(OUT + '/', '') };
    const btn = page.locator(`[data-test-id="button_download_remittance_${p.id}"]`).first();
    rec.slip_button_present = await btn.count() > 0;
    if (rec.slip_button_present) {
      const [d] = await Promise.all([page.waitForEvent('download', { timeout: 40000 }).catch(() => null), btn.click({ timeout: 10000 }).catch(() => null)]);
      if (d) {
        const tmp = `/tmp/cln/r105/slip-${p.id.slice(0, 8)}.pdf`; await d.saveAs(tmp);
        const txt = execFileSync('pdftotext', ['-layout', '-f', '1', '-l', '1', tmp, '-'], { timeout: 20000 }).toString();
        rec.slip_lines = txt.split('\n').map(s => s.replace(/\s+/g, ' ').trim()).filter(s => /Date:|Bill Number|Credit Number|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d+, \d{4}/.test(s));
        const png = `${D}/slip-${key}-${p.id.slice(0, 8)}`; execFileSync('pdftoppm', ['-png', '-r', '80', '-f', '1', '-l', '1', '-singlefile', tmp, png], { timeout: 20000 });
        rec.slip_picture = png.replace(OUT + '/', '') + '.png';
      } else rec.slip_error = 'no download within 40 s';
    }
    res.records.push(rec); save(`${D}/staging-${key}-${stamp}Z.json`, res);
    console.log(JSON.stringify({ p: p.id.slice(0, 8), pay: rec.payment, lines: rec.lines.map(l => [l.type, l.number, l.date?.stored_utc, l.date?.day_in_location_zone]), slip: rec.slip_lines, err: rec.slip_error }));
  }
}
res.rule99_end = await rule99(page, loc); save(`${D}/staging-${key}-${stamp}Z.json`, res);
console.log('zones_end', JSON.stringify(res.rule99_end));
await r.browser.close();
