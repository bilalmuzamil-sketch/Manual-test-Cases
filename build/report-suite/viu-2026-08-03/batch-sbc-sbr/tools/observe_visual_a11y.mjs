// observe_visual_a11y.mjs — the visual-conformance, dark-mode, mobile and accessibility facts for
// one report, so those cases get real observed verdicts rather than assumptions (Rule 12).
// SECRET-FREE. Usage: node observe_visual_a11y.mjs <slug>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid } from './reportlib.mjs';

const slug = process.argv[2];
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);
const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(3500);
if (slug === 'sales-by-representative') {
  await clickEl(page, page.locator('.q-toggle').filter({ hasText: /Show Unassigned/i }).first(), 5000);
}

// ---------- accessible names on icon-only controls ----------
rec.accessibleNames = await page.evaluate(() => {
  const out = [];
  for (const b of document.querySelectorAll('button, .q-btn, [role=switch], [role=button]')) {
    if (!b.getClientRects().length) continue;
    const t = (b.innerText || '').trim();
    const iconOnly = /^[a-z_]+$/.test(t) || !t;
    if (!iconOnly) continue;
    out.push({ glyph: t, ariaLabel: b.getAttribute('aria-label'), title: b.getAttribute('title'),
      testId: b.getAttribute('data-test-id'), tabIndex: b.getAttribute('tabindex'),
      role: b.getAttribute('role') });
  }
  const u = []; for (const x of out) if (!u.some(y => y.glyph === x.glyph && y.ariaLabel === x.ariaLabel)) u.push(x);
  return u.slice(0, 20);
});
L('ICON-ONLY CONTROLS + accessible names:');
rec.accessibleNames.forEach(a => L('  ', JSON.stringify(a.glyph), '-> aria:', JSON.stringify(a.ariaLabel),
  '| title:', JSON.stringify(a.title), '| testId:', a.testId));

// ---------- keyboard operability + aria-sort on headers, chevron aria-expanded ----------
rec.keyboard = await page.evaluate(() => {
  const th = Array.from(document.querySelectorAll('thead th'));
  const chev = Array.from(document.querySelectorAll('tbody tr .q-btn')).slice(0, 2);
  return {
    headers: th.map(h => ({ text: (h.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 24),
      tabIndex: h.getAttribute('tabindex'), ariaSort: h.getAttribute('aria-sort'),
      role: h.getAttribute('role') })),
    chevrons: chev.map(c => ({ tabIndex: c.getAttribute('tabindex'),
      ariaExpanded: c.getAttribute('aria-expanded'), ariaLabel: c.getAttribute('aria-label'),
      testId: c.getAttribute('data-test-id') })),
  };
});
L('HEADER a11y:', JSON.stringify(rec.keyboard.headers.slice(0, 6)));
L('CHEVRON a11y:', JSON.stringify(rec.keyboard.chevrons));

// ---------- surfaces: toolbar / page / table / totals colours + row striping ----------
rec.surfaces = await page.evaluate(() => {
  const bg = el => (el ? getComputedStyle(el).backgroundColor : null);
  const t = document.querySelector('table');
  const rows = Array.from(document.querySelectorAll('tbody tr')).filter(r => r.querySelectorAll('td').length > 1);
  return {
    body: bg(document.body),
    page: bg(document.querySelector('main') || document.body),
    toolbar: bg(document.querySelector('.sbr-toolbar, .q-toolbar, header, [class*="toolbar"]')),
    thead: bg(document.querySelector('thead tr')),
    totalsRow: bg(document.querySelector('tbody tr.report-totals-row')),
    firstRows: rows.slice(0, 4).map(r => ({ cls: r.className.slice(0, 60), bg: bg(r) })),
    subtotalHeaderSticky: (() => { const th = Array.from(document.querySelectorAll('thead th'))
      .find(h => /Subtotal/.test(h.innerText || '')); if (!th) return null;
      const cs = getComputedStyle(th); return { position: cs.position, right: cs.right, fontWeight: cs.fontWeight }; })(),
    theadSticky: (() => { const th = document.querySelector('thead th'); if (!th) return null;
      const cs = getComputedStyle(th); return { position: cs.position, top: cs.top }; })(),
  };
});
L('SURFACES:', JSON.stringify(rec.surfaces, null, 1).slice(0, 1400));

// ---------- dark mode ----------
{
  await page.evaluate(() => {
    // Quasar dark mode toggles the body class; set it directly to observe the rendered surfaces.
    document.body.classList.add('body--dark');
    document.body.classList.remove('body--light');
  });
  await page.waitForTimeout(2500);
  rec.darkMode = await page.evaluate(() => {
    const bg = el => (el ? getComputedStyle(el).backgroundColor : null);
    const col = el => (el ? getComputedStyle(el).color : null);
    return { bodyClass: document.body.className.slice(0, 120),
      body: bg(document.body), thead: bg(document.querySelector('thead tr')),
      totals: bg(document.querySelector('tbody tr.report-totals-row')),
      totalsText: col(document.querySelector('tbody tr.report-totals-row td')),
      badges: Array.from(document.querySelectorAll('tbody .q-badge')).slice(0, 3)
        .map(b => ({ text: (b.innerText || '').trim(), bg: bg(b), color: col(b) })) };
  });
  await page.screenshot({ path: OUT + 'dark-mode.png', fullPage: true });
  L('DARK MODE:', JSON.stringify(rec.darkMode, null, 1).slice(0, 1000));
  await page.evaluate(() => { document.body.classList.remove('body--dark'); document.body.classList.add('body--light'); });
  await page.waitForTimeout(1500);
}

// ---------- mobile: toolbar wrap, touch-target sizes, totals bar, sticky Subtotal ----------
{
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(4500);
  rec.mobile = await page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const t = document.querySelector('table');
    const sc = t && (t.closest('.q-table__middle') || t.parentElement);
    const controls = Array.from(document.querySelectorAll('main button, main .q-btn, main .q-select, main .q-toggle'))
      .filter(b => b.getClientRects().length);
    const small = controls.map(b => { const r = b.getBoundingClientRect();
      return { label: (txt(b) || b.getAttribute('aria-label') || '').slice(0, 26),
        w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter(x => x.w < 44 || x.h < 44);
    const totalsRow = document.querySelector('tbody tr.report-totals-row');
    return {
      tableScrollWidth: t ? t.scrollWidth : null, containerWidth: sc ? sc.clientWidth : null,
      horizontallyScrollable: t && sc ? t.scrollWidth > sc.clientWidth + 2 : null,
      overflowX: sc ? getComputedStyle(sc).overflowX : null,
      controlCount: controls.length, undersizedTouchTargets: small.slice(0, 14),
      undersizedCount: small.length,
      totalsRowPresent: !!totalsRow,
      totalsRowText: totalsRow ? txt(totalsRow).slice(0, 160) : null,
      totalsOutsideTable: !!document.querySelector('main [class*="totals"]:not(tr)'),
      toolbarLineCount: (() => { const tb = document.querySelector('.sbr-toolbar, .q-toolbar, [class*="toolbar"]');
        return tb ? Math.round(tb.getBoundingClientRect().height) : null; })(),
    };
  });
  await page.screenshot({ path: OUT + 'mobile-a11y.png', fullPage: true });
  L('MOBILE:', JSON.stringify(rec.mobile, null, 1).slice(0, 1500));
  await page.setViewportSize({ width: 1680, height: 1050 });
}

fs.writeFileSync(OUT + 'visual-a11y.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'visual-a11y.json');
await browser.close();
