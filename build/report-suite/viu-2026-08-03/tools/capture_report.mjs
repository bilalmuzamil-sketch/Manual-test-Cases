// capture_report.mjs — capture the LIVE build-accurate labels of one report page on sv8582.
// Read-only observation (Rule 12: observed, never inferred). Outputs, per report:
//   evidence/<slug>/page.png            full-page screenshot
//   evidence/<slug>/labels.json         headings, column headers in order, filters, buttons, menus
//   evidence/<slug>/body.txt            the whole rendered text (so nothing is lost)
//   evidence/<slug>/api-calls.json      every /api call the page made, with the report payload
//
// Usage: node capture_report.mjs <route-slug>            e.g. sales-by-customer
//        node capture_report.mjs <slug> --menus          also open each dropdown and list options
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node capture_report.mjs <route-slug> [--menus]'); process.exit(1); }
const withMenus = process.argv.includes('--menus');
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

const labels = await page.evaluate(() => {
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  // The report content area = the main region excluding the reports side-nav.
  const main = document.querySelector('main') || document.body;
  const navLinks = new Set(Array.from(document.querySelectorAll('a[href*="/reports/"]')));

  // --- table column headers, in DOM order, per table ---
  const tables = Array.from(main.querySelectorAll('table')).filter(vis).map((t, i) => {
    const headRows = Array.from(t.querySelectorAll('thead tr'));
    return {
      index: i,
      headerRows: headRows.map(tr => Array.from(tr.querySelectorAll('th,td')).map(th => ({
        text: txt(th).replace(/arrow_drop_(up|down)$/,'').replace(/arrow_(upward|downward)$/,'').trim(),
        raw: txt(th),
        sortable: /arrow_drop|arrow_up|arrow_down/.test(txt(th)) || th.classList.contains('sortable'),
        colspan: th.getAttribute('colspan') || null,
      }))),
      firstBodyRow: Array.from(t.querySelectorAll('tbody tr')).slice(0, 1)
        .map(tr => Array.from(tr.querySelectorAll('td,th')).map(td => txt(td))),
      bodyRowCount: t.querySelectorAll('tbody tr').length,
    };
  });

  // --- buttons (exact wording), excluding nav ---
  const buttons = Array.from(main.querySelectorAll('button, .q-btn, [role=button]'))
    .filter(b => vis(b) && !navLinks.has(b))
    .map(b => ({ text: txt(b), aria: b.getAttribute('aria-label'), title: b.getAttribute('title'),
      testId: b.getAttribute('data-test-id'), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' }))
    .filter(b => b.text || b.aria || b.title);

  // --- form / filter controls ---
  const controls = Array.from(main.querySelectorAll('.q-field, .q-select, .q-toggle, .q-checkbox, .q-radio, input, select'))
    .filter(vis).map(c => {
      const lab = c.closest('.q-field')?.querySelector('.q-field__label');
      return { tag: c.tagName.toLowerCase(), cls: c.className.toString().slice(0, 120),
        label: lab ? txt(lab) : null, placeholder: c.getAttribute?.('placeholder') || null,
        value: c.value !== undefined ? String(c.value).slice(0, 120) : null,
        testId: c.getAttribute?.('data-test-id') || null, text: txt(c).slice(0, 160) };
    });

  // --- tabs ---
  const tabs = Array.from(main.querySelectorAll('.q-tab, [role=tab]')).filter(vis)
    .map(t => ({ text: txt(t), active: t.classList.contains('q-tab--active') || t.getAttribute('aria-selected') === 'true' }));

  // --- page heading candidates (largest visible text near the top of main) ---
  const headings = Array.from(main.querySelectorAll('h1,h2,h3,h4,.text-h4,.text-h5,.text-h6,.page-title'))
    .filter(vis).map(h => txt(h)).filter(Boolean);

  return { url: location.pathname, docTitle: document.title, headings, tabs, tables, buttons, controls,
    mainText: txt(main).slice(0, 20000) };
});

fs.writeFileSync(OUT + 'labels.json', JSON.stringify(labels, null, 2));
fs.writeFileSync(OUT + 'body.txt', await page.locator('body').innerText().catch(() => ''));
fs.writeFileSync(OUT + 'api-calls.json', JSON.stringify(
  netlog.filter(n => n.url.includes('shopview.com/api/')).map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') })), null, 2));
await page.screenshot({ path: OUT + 'page.png', fullPage: true });

console.log('=== ' + slug + ' ===');
console.log('url:', labels.url, '| headings:', JSON.stringify(labels.headings));
console.log('tabs:', JSON.stringify(labels.tabs));
for (const t of labels.tables) {
  console.log('TABLE', t.index, 'rows=' + t.bodyRowCount);
  t.headerRows.forEach((hr, i) => console.log('  headerRow' + i + ':', JSON.stringify(hr.map(h => h.text))));
  if (t.firstBodyRow.length) console.log('  firstRow:', JSON.stringify(t.firstBodyRow[0]));
}
console.log('BUTTONS:', JSON.stringify(labels.buttons.map(b => b.text || b.aria || b.title)));
console.log('CONTROLS:', JSON.stringify(labels.controls.filter(c => c.label || c.placeholder || c.text).map(c => c.label || c.placeholder || c.text).slice(0, 40)));
console.log('API:'); for (const n of JSON.parse(fs.readFileSync(OUT + 'api-calls.json', 'utf8'))) console.log('  ', n.status, n.method, n.path);
await browser.close();
