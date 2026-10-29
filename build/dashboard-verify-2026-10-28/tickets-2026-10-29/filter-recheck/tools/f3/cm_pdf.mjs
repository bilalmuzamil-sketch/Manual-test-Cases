// SV-11949 follow-up: open CM2-4523 itself through its row's "print" action (Heavy Duty, Karachi) and read its lines and tax. SECRET-FREE.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com'; const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SV-11949-followup';
const { browser, ctx, page, WP, TZ, LNAME } = await f3boot('hd');
const meta = JSON.parse(fs.readFileSync(`${OUT}/meta.json`)); meta.pdf = { observed_at_utc: new Date().toISOString(), browser_zone: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone };
await page.goto(APP + '/customers/1c385fee-d4cc-46f4-b20a-b8e01987e0ff/invoices?search=CM2-4523', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
meta.pdf.loc_start = await assertLoc(page, LNAME, WP);
const tog = page.locator('[data-test-id="toggle_filter_open_invoices"]'); if (await tog.getAttribute('aria-checked').catch(() => null) === 'true') { await tog.click(); await page.waitForTimeout(7000); }
const pdfs = []; ctx.on('response', async r => { const ct = r.headers()['content-type'] || ''; if (ct.includes('pdf')) { try { pdfs.push(await r.body()); } catch {} } });
const row = page.locator('main tbody tr').filter({ hasText: 'CM2-4523' }).first();
const dlP = page.waitForEvent('download', { timeout: 20000 }).catch(() => null); const popP = ctx.waitForEvent('page', { timeout: 20000 }).catch(() => null);
await row.getByText('print', { exact: true }).first().click().catch(e => { meta.pdf.click_err = String(e).slice(0, 150); });
const [dl, pop] = await Promise.all([dlP, popP]); await page.waitForTimeout(6000);
const f = `${OUT}/CM2-4523.pdf`;
if (dl) await dl.saveAs(f); else if (pdfs.length) fs.writeFileSync(f, pdfs.at(-1));
meta.pdf.how = dl ? 'download' : pdfs.length ? 'pdf-response' : pop ? 'popup:' + pop.url() : 'none';
if (fs.existsSync(f)) meta.pdf.text = execFileSync('python3', ['-I', '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/pdftext.py', f]).toString().slice(0, 1500);
meta.pdf.loc_end = await assertLoc(page, LNAME, WP); meta.pdf.VALID = meta.pdf.loc_start.ok && meta.pdf.loc_end.ok;
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ how: meta.pdf.how, VALID: meta.pdf.VALID, err: meta.pdf.click_err, text: meta.pdf.text }));
await browser.close();
