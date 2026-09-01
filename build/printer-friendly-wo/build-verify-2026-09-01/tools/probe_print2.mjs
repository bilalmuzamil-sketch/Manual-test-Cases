// probe_print2.mjs — the rest of Printer Friendly WO: statuses, mobile, the no-lines work order,
// what the still-visible header actually contains, badges, landscape, and the footer.
//
// ONE THING TO SETTLE CAREFULLY: the first pass found a `header`/`.q-header` element still visible
// with print media emulated, which looks like a breach of "application navigation is hidden". But the
// printout's own text begins "WO #S9315-14846" and carries none of the app's nav labels, so that
// element may BE the print header. Its contents are read before anything is reported.
//
// AND A SPEC CONTRADICTION TO TEST: Key Decisions say print is "disabled ... when no line items
// exist", while S3-N1 and S4-N1 describe what the printout shows when there are no line items. Both
// cannot be true. The build decides which case is testable; the contradiction is a PO question.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const T = JSON.parse(fs.readFileSync('/tmp/pf6617/targets.json', 'utf8'));
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS_FILE = `${OUT}/evidence/probe-print2.json`;
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
const openMore = async () => {
  await page.evaluate(() => document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
  await page.waitForTimeout(2000);
  return page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    if (!m) return null;
    return { items: [...m.querySelectorAll('.q-item')].map(e => {
      const st = getComputedStyle(e);
      return { text: (e.innerText || '').replace(/\s+/g,' ').trim(), id: e.getAttribute('data-test-id'),
        disabled: e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true'
                  || st.pointerEvents === 'none' || parseFloat(st.opacity) < 1 }; }) };
  });
};
const stubPrint = () => page.evaluate(() => { window.__printCalls = 0;
  if (!window.__printStubbed) { window.print = function () { window.__printCalls++; }; window.__printStubbed = true; } });
const clickPrint = async () => {
  await stubPrint();
  await openMore();
  const ok = await page.evaluate(() => {
    const it = document.querySelector('.q-menu [data-test-id="menu_item_print_work_order"]');
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(3200);
  return { clicked: ok, calls: await page.evaluate(() => window.__printCalls || 0) };
};

const P = {};

P['B-across-statuses'] = async () => {
  const out = [];
  for (const w of T.statuses) {
    const landed = await land(w.id);
    const m = landed ? await openMore() : null;
    const item = (m?.items || []).find(i => i.id === 'menu_item_print_work_order');
    out.push({ number: w.number, status: w.status, lines: w.lines, landed,
               printPresent: !!item, printDisabled: item?.disabled ?? null });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(600);
  }
  return out;
};

P['C-mobile'] = async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  const landed = await land(WO);
  const m = landed ? await openMore() : null;
  const item = (m?.items || []).find(i => i.id === 'menu_item_print_work_order');
  await page.screenshot({ path: `${OUT}/evidence/print-menu-mobile.png`, fullPage: true });
  await page.setViewportSize({ width: 1600, height: 1000 });
  return { landed, viewport: '390x844', items: (m?.items || []).map(i => i.text),
           printPresent: !!item, printDisabled: item?.disabled ?? null };
};

// what IS that visible header on paper?
P['E-header-contents'] = async () => {
  await land(WO);
  await clickPrint();
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && b.width > 0 && b.height > 0; };
    const hs = [...document.querySelectorAll('header, .q-header')].filter(vis);
    const navWords = ['Work Orders', 'Schedule', 'Customers', 'Parts', 'Reports', 'Clock In', 'Search'];
    return { visibleHeaders: hs.map(h => ({ cls: (h.className||'').toString().slice(0,80),
              text: (h.innerText || '').replace(/\s+/g,' ').trim().slice(0, 220),
              rect: (() => { const b = h.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; })() })),
      appNavWordsVisibleAnywhere: navWords.filter(w =>
        [...document.querySelectorAll('a,button,div,span')].some(e => e.childElementCount === 0
          && (e.innerText || '').trim() === w && vis(e))),
      badges: [...document.querySelectorAll('.q-badge, .q-chip, [class*="badge"], [class*="chip"]')]
        .filter(vis).map(b => ({ text: (b.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
          cls: (b.className||'').toString().slice(0,70),
          bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color })).slice(0, 10),
    };
  });
  await page.emulateMedia({ media: null });
  return r;
};

// the no-lines work order: is print even reachable, and what does the paper say?
P['F-no-lines'] = async () => {
  const w = (T.nolines || [])[0];
  if (!w) return { note: 'no work order without lines on this branch' };
  const landed = await land(w.id);
  const m = landed ? await openMore() : null;
  const item = (m?.items || []).find(i => i.id === 'menu_item_print_work_order');
  const out = { number: w.number, status: w.status, landed, printPresent: !!item, printDisabled: item?.disabled ?? null };
  await page.keyboard.press('Escape').catch(() => {});
  if (item && !item.disabled) {
    const c = await clickPrint();
    out.printCalled = c.calls;
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(1500);
    out.paper = await page.evaluate(() => {
      const t = (document.body?.innerText || '').replace(/\s+/g, ' ');
      return { text: t.slice(0, 700),
               noLinesPlaceholder: /No lines on this work order/i.test(t),
               totals: (t.match(/Total Actual Time:[^A-Z]*|Total Estimated[^A-Z]*/g) || []).slice(0, 3) };
    });
    await page.screenshot({ path: `${OUT}/evidence/print-no-lines.png`, fullPage: true });
    await page.emulateMedia({ media: null });
  }
  return out;
};

// landscape, and the PDF footers
P['G-orientation-and-footer'] = async () => {
  await land(WO);
  await clickPrint();
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1200);
  const portrait = `${OUT}/evidence/printout-portrait-letter.pdf`;
  const landscape = `${OUT}/evidence/printout-landscape-letter.pdf`;
  const a4 = `${OUT}/evidence/printout-portrait-a4.pdf`;
  await page.pdf({ path: portrait, format: 'Letter' }).catch(() => {});
  await page.pdf({ path: landscape, format: 'Letter', landscape: true }).catch(() => {});
  await page.pdf({ path: a4, format: 'A4' }).catch(() => {});
  // does anything overflow the printable width?
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const wide = [...document.querySelectorAll('*')].filter(e => {
      const b = e.getBoundingClientRect();
      return b.width > de.clientWidth + 4 && b.height > 0;
    }).slice(0, 6).map(e => ({ tag: e.tagName, cls: (e.className||'').toString().slice(0,60),
                               w: Math.round(e.getBoundingClientRect().width) }));
    return { viewportWidth: de.clientWidth, scrollWidth: de.scrollWidth,
             horizontalOverflow: de.scrollWidth > de.clientWidth + 4, widestOffenders: wide };
  });
  await page.emulateMedia({ media: null });
  const sizes = {};
  for (const [k, f] of [['portrait-letter', portrait], ['landscape-letter', landscape], ['portrait-a4', a4]])
    sizes[k] = fs.existsSync(f) ? fs.statSync(f).size : null;
  return { pdfBytes: sizes, overflow };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3000)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await browser.close();
