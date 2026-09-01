// probe_print3.mjs — Story 6 (the audit entry) and the line-level details the first two passes did
// not reach: the tech story row, a cancelled line, and what the PDF's own pages carry (the repeated
// work order number in the footer, and whether many lines flow without splitting).
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const BIGWO = process.env.BIGWO || 'dd536622-5d71-4524-bac2-3f6b060d1f59';  // S9315-13145, 7 lines
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS_FILE = `${OUT}/evidence/probe-print3.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch (_) { return {}; } })();
const { browser, page } = await boot('/workorders');
const settle = async () => {
  await page.waitForFunction(() => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return t.length > 1200;
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const land = async (wo) => { for (let a = 0; a < 3; a++) {
  await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  if (await page.evaluate(() => !!document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]'))) return true;
} return false; };
const openMore = async () => { await page.evaluate(() =>
  document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
  await page.waitForTimeout(2000); };
const clickPrint = async () => {
  await page.evaluate(() => { window.__printCalls = 0;
    if (!window.__printStubbed) { window.print = function () { window.__printCalls++; }; window.__printStubbed = true; } });
  await openMore();
  const ok = await page.evaluate(() => {
    const it = document.querySelector('.q-menu [data-test-id="menu_item_print_work_order"]');
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(3200);
  return { clicked: ok, calls: await page.evaluate(() => window.__printCalls || 0) };
};
const openAuditLog = async () => {
  await openMore();
  const ok = await page.evaluate(() => {
    const it = document.querySelector('.q-menu [data-test-id="menu_item_audit_log"]');
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(5000);
  return { clicked: ok, content: await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    const src = d || document.body;
    const t = (src.innerText || '').replace(/\s+/g, ' ');
    return { isDialog: !!d, url: location.pathname,
      printedEntries: (t.match(/[^|]{0,60}Print[^|]{0,80}/g) || []).slice(0, 8),
      hasWorkOrderPrinted: /Work Order Printed/i.test(t),
      firstRows: [...src.querySelectorAll('tr, .q-item')].map(r => (r.innerText||'').replace(/\s+/g,' ').trim())
        .filter(Boolean).slice(0, 12) }; }) };
};

const P = {};

// Story 6: print, then look in the audit log. Print twice and count.
P['H-audit-trail'] = async () => {
  await land(WO);
  const before = await openAuditLog();
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1500);
  await land(WO);
  const p1 = await clickPrint();
  await page.waitForTimeout(3000);
  await land(WO);
  const p2 = await clickPrint();
  await page.waitForTimeout(4000);
  await land(WO);
  const after = await openAuditLog();
  await page.screenshot({ path: `${OUT}/evidence/print-audit-log.png`, fullPage: true });
  return { auditBefore: before, print1: p1, print2: p2, auditAfter: after };
};

// the line-level details, with print media on
P['I-line-details'] = async () => {
  await land(WO);
  await clickPrint();
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && b.width > 0 && b.height > 0; };
    const t = (document.body?.innerText || '').replace(/\s+/g, ' ');
    const lineBlocks = [...document.querySelectorAll('[class*="wo-print"]')].filter(vis)
      .map(e => ({ cls: (e.className||'').toString().slice(0, 70),
                   borderBottom: getComputedStyle(e).borderBottomWidth,
                   borderTop: getComputedStyle(e).borderTopWidth,
                   marginBottom: getComputedStyle(e).marginBottom,
                   text: (e.innerText||'').replace(/\s+/g,' ').trim().slice(0, 90) })).slice(0, 14);
    return {
      printClasses: [...new Set([...document.querySelectorAll('[class*="wo-print"]')]
        .flatMap(e => (e.className||'').toString().split(/\s+/)).filter(x => /wo-print/.test(x)))],
      lineBlocks,
      techStoryWordPresent: /tech story/i.test(t),
      placeholderTextPresent: /Add tech story/i.test(t),
      cancelledWordPresent: /cancel/i.test(t),
      statusWordsOnPaper: ['Needs Approval', 'Authorized', 'Complete', 'Cancelled', 'Declined']
        .filter(w => t.includes(w)),
      timestampLike: (t.match(/Printed[^A-Z]{0,60}|\d{1,2}\/\d{1,2}\/\d{4}[^A-Z]{0,20}/g) || []).slice(0, 5),
      totalsLine: (t.match(/Total Actual Time:[^A-Za-z]*Total Estimated Time:[^A-Za-z]*/) || [])[0] || null,
    };
  });
  await page.screenshot({ path: `${OUT}/evidence/print-line-details.png`, fullPage: true });
  await page.emulateMedia({ media: null });
  return r;
};

// a bigger work order: pages, and the footer on each
P['J-pagination'] = async () => {
  const landed = await land(BIGWO);
  if (!landed) return { landed };
  await clickPrint();
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(2000);
  const pdf = `${OUT}/evidence/printout-multipage.pdf`;
  await page.pdf({ path: pdf, format: 'Letter' }).catch(() => {});
  await page.emulateMedia({ media: null });
  let pages = null, footerHits = null, woNumber = null;
  if (fs.existsSync(pdf)) {
    const buf = fs.readFileSync(pdf);
    const s = buf.toString('latin1');
    pages = (s.match(/\/Type\s*\/Page[^s]/g) || []).length;
    woNumber = (await page.evaluate(() => (document.body?.innerText||'').match(/S9315-\d+/)?.[0] || null));
  }
  return { landed, pdfBytes: fs.existsSync(pdf) ? fs.statSync(pdf).size : null, pdfPageCount: pages,
           workOrderNumber: woNumber,
           note: 'the footer text cannot be read out of a compressed PDF here; the page count is what '
               + 'this settles. Footer repetition is read off the print-media DOM instead.' };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await browser.close();
