// capture_imported_doc.mjs — C44987: does the IMPORTED invoice keep its current (pre-redesign)
// template, or has restyling shared partials half-restyled it?
//
// An imported work order has no document route of its own (/api/invoices/preview rejects its id and
// /api/work-orders-imported/{id}/pdf is 404), so the document is read off the screen that renders it.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };

const { browser, page } = await boot('/workorders');
await page.goto(`${APP}/workorders?status=imported`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await page.waitForFunction(() => (document.body?.innerText || '').length > 600, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(4000);
const clicked = await page.evaluate(() => {
  const r = [...document.querySelectorAll('tr')].find(x => (x.innerText || '').includes('ZZAUTOTEST-IMP-001'));
  if (!r) return false; r.click(); return true;
});
L('imported row clicked:', clicked, '| url now', page.url());
await page.waitForTimeout(9000);
const doc = await page.evaluate(() => {
  const t = document.body?.innerText || '';
  return { url: location.pathname, chars: t.length, text: t };
});
L('landed', doc.url, '| chars', doc.chars);
fs.writeFileSync(`${OUT}/evidence/c44987-imported-document.txt`, doc.text);
L('--- imported document text ---');
L(doc.text.replace(/\n{2,}/g, '\n'));
await page.screenshot({ path: `${OUT}/evidence/c44987-imported-document.png`, fullPage: true });
fs.writeFileSync(`${OUT}/evidence/c44987.log`, log.join('\n') + '\n');
await browser.close();
