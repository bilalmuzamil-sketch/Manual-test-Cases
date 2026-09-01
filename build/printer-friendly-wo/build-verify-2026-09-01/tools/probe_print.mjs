// probe_print.mjs — Printer Friendly Work Orders (6617), Stories 1 to 5.
//
// HOW A PRINT LAYOUT IS VERIFIED WITHOUT A PRINTER, and why this is the honest instrument:
//   * `window.print` is STUBBED before the menu item is clicked, so the click can be proven to reach
//     it (S1-R4) without a native dialog that automation cannot see or dismiss.
//   * `page.emulateMedia({ media: 'print' })` makes the browser apply the @media print rules, so
//     everything the printout hides or shows can be read off the live DOM - visibility, colours,
//     font sizes, borders - exactly as the paper would carry it.
//   * A PDF is also produced with `page.pdf({ format: 'Letter' })`, which is the closest thing to the
//     paper itself and settles pagination questions (footer repetition, page breaks).
// Nothing here reads the SCREEN layout and calls it the print layout: every read below happens with
// print media emulated, and each probe says so.
import { boot, APP, apiGet } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/printer-friendly-wo/build-verify-2026-09-01';
const WO = process.env.WO || 'c6d4b883-6f78-4c9e-ab7e-436a6d99c17a';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const RESULTS_FILE = `${OUT}/evidence/probe-print.json`;
const results = (() => { try { return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch (_) { return {}; } })();
const { browser, page } = await boot('/workorders');

const settle = async () => {
  await page.waitForFunction(() => {
    const t = document.body?.innerText || '';
    if (/\bLoading\.\.\./.test(t)) return false;
    return t.length > 2000;
  }, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
};
const land = async (wo = WO) => {
  for (let a = 0; a < 3; a++) {
    await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await settle();
    const ok = await page.evaluate(() => !!document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]'));
    if (ok) return true;
  }
  return false;
};
const openMoreMenu = async () => {
  await page.evaluate(() => document.querySelector('[data-test-id="button_work_order_nav_bar_menu"]')?.click());
  await page.waitForTimeout(2200);
  return page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    if (!m) return null;
    return { items: [...m.querySelectorAll('.q-item')].map(e => {
      const st = getComputedStyle(e);
      return { text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
               id: e.getAttribute('data-test-id'),
               iconElements: [...e.querySelectorAll('i, .q-icon, svg, img')].map(x => (x.textContent || x.tagName).trim()).filter(Boolean),
               disabled: e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true'
                         || st.pointerEvents === 'none' || st.opacity !== '1' }; }) };
  });
};
// stub window.print, click the item, report whether print was reached
const clickPrint = async () => {
  await page.evaluate(() => { window.__printCalls = 0;
    if (!window.__printStubbed) { const real = window.print;
      window.print = function () { window.__printCalls++; };
      window.__printStubbed = true; window.__realPrint = real; } });
  const m = await openMoreMenu();
  const clicked = await page.evaluate(() => {
    const it = [...document.querySelectorAll('.q-menu .q-item')]
      .find(e => e.getAttribute('data-test-id') === 'menu_item_print_work_order');
    if (!it) return false; it.click(); return true; });
  await page.waitForTimeout(3500);
  const calls = await page.evaluate(() => window.__printCalls || 0);
  return { menu: m, clicked, printCalls: calls };
};
// read the page WITH PRINT MEDIA EMULATED
const readPrintView = async () => {
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const vis = el => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    };
    const shown = [];
    const hidden = [];
    const check = (sel, label) => {
      const els = [...document.querySelectorAll(sel)];
      if (!els.length) { hidden.push(`${label} (no such element)`); return; }
      (els.some(vis) ? shown : hidden).push(label);
    };
    check('header, .q-header', 'top bar / header');
    check('aside, .q-drawer', 'sidebar drawer');
    check('.q-tabs, [role="tablist"]', 'tab navigation');
    check('[data-test-id="button_work_order_nav_bar_menu"]', 'the More menu button');
    check('[data-test-id="clock_in_button"]', 'clock in/out button');
    check('[data-test-id="button_add_part"]', 'Add Part buttons');
    check('[data-test-id="button_edit_part"]', 'part edit controls');
    check('[data-test-id^="button_action_"]', 'line action buttons (Approve/Decline/Complete)');
    check('.q-linear-progress, progress, [class*="progress"]', 'progress bars');
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    const text = (body.innerText || '');
    // font sizes actually in use on visible text
    const sizes = {};
    for (const el of [...document.querySelectorAll('div,span,p,td,th,li,h1,h2,h3,h4')].slice(0, 4000)) {
      if (el.childElementCount === 0 && (el.innerText || '').trim() && vis(el)) {
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px) sizes[px] = (sizes[px] || 0) + 1;
      }
    }
    return {
      shownOnPaper: shown, hiddenOnPaper: hidden,
      bodyColor: bodyStyle.color, bodyBackground: bodyStyle.backgroundColor,
      fontSizes: Object.fromEntries(Object.entries(sizes).sort((a, b) => b[1] - a[1]).slice(0, 8)),
      textLength: text.length,
      textSample: text.replace(/\s+/g, ' ').slice(0, 1200),
      dollarSignsVisible: (() => {
        let n = 0;
        for (const el of document.querySelectorAll('div,span,td,p')) {
          if (el.childElementCount === 0 && /\$/.test(el.innerText || '') && vis(el)) n++;
        }
        return n; })(),
      moneyWords: ['Rate', 'Margin', 'Total', 'Sell price', 'Subtotal', 'Tax']
        .filter(w => [...document.querySelectorAll('div,span,td,th,p')]
          .some(el => el.childElementCount === 0 && (el.innerText || '').trim() === w && vis(el))),
    };
  });
  await page.emulateMedia({ media: null });
  return r;
};

const P = {};

// ---- Story 1: the menu item, its label, its position, and that it reaches print ----
P['A-menu-item'] = async () => {
  const landed = await land();
  const r = await clickPrint();
  const items = (r.menu?.items || []).map(i => i.text);
  const idx = t => items.findIndex(x => x.startsWith(t));
  await page.screenshot({ path: `${OUT}/evidence/print-menu.png`, fullPage: true });
  return { landed, menuItems: items,
    printItemPresent: items.some(t => t === 'Print Work Order'),
    printItemIcons: (r.menu?.items || []).find(i => i.id === 'menu_item_print_work_order')?.iconElements,
    order: { timesheets: idx('Timesheets'), print: idx('Print Work Order'), delete: idx('Delete Work Order') },
    belowTimesheetsAndAboveDelete: idx('Print Work Order') > idx('Timesheets') && idx('Print Work Order') < idx('Delete Work Order'),
    whatSitsBetween: items.slice(idx('Timesheets') + 1, idx('Print Work Order')),
    clicked: r.clicked, browserPrintCalled: r.printCalls };
};

// ---- Story 1 across statuses: the item must be there on every status ----
P['B-across-statuses'] = async () => {
  // one work order per status that exists on this branch
  const wos = JSON.parse(process.env.STATUS_WOS || '[]');
  const out = [];
  for (const w of wos) {
    const landed = await land(w.id);
    const m = landed ? await openMoreMenu() : null;
    out.push({ number: w.number, status: w.status, landed,
      printPresent: !!(m?.items || []).find(i => i.id === 'menu_item_print_work_order'),
      printDisabled: (m?.items || []).find(i => i.id === 'menu_item_print_work_order')?.disabled ?? null });
    await page.keyboard.press('Escape').catch(() => {});
  }
  return out;
};

// ---- Story 1 mobile ----
P['C-mobile'] = async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  const landed = await land();
  const m = landed ? await openMoreMenu() : null;
  const found = (m?.items || []).find(i => i.id === 'menu_item_print_work_order');
  await page.screenshot({ path: `${OUT}/evidence/print-menu-mobile.png`, fullPage: true });
  await page.setViewportSize({ width: 1600, height: 1000 });
  return { landed, viewport: '390x844', menuItems: (m?.items || []).map(i => i.text),
           printPresent: !!found, printDisabled: found?.disabled ?? null };
};

// ---- Stories 2 to 5: what the paper actually carries ----
P['D-print-view'] = async () => {
  await land();
  const r = await clickPrint();
  const view = await readPrintView();
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/evidence/print-media-view.png`, fullPage: true });
  const pdf = `${OUT}/evidence/work-order-printout-letter.pdf`;
  await page.pdf({ path: pdf, format: 'Letter', printBackground: false }).catch(e => null);
  await page.emulateMedia({ media: null });
  return { browserPrintCalled: r.printCalls, ...view, pdfWritten: fs.existsSync(pdf) };
};

const names = Object.keys(P).filter(n => !ONLY.length || ONLY.some(o => n.startsWith(o)));
for (const n of names) {
  process.stdout.write(`\n### ${n}\n`);
  try { results[n] = await P[n](); console.log(JSON.stringify(results[n], null, 1).slice(0, 3500)); }
  catch (e) { results[n] = { PROBE_ERROR: String(e).slice(0, 300) }; console.log('PROBE ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 1));
}
await browser.close();
