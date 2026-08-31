// Capture EVERY surface the 119 cases can send a tester to, not just the rendered document.
//
// WHY: the first evaluation searched only the document text and therefore reported labels as
// absent that are simply on a different surface. 'Summarize labor total', 'Labor rate',
// 'Part number' are fields of the INVOICE SETTINGS dialog (they match the settings/view
// payload keys exactly); 'Authorizer', 'Approves Work', 'Approval Code' live on the work-order
// page. Searching one surface and concluding "absent" is a probe that cannot fire.
//
// Surfaces captured: work-order page · finance tab · the invoice menu · the invoice settings
// dialog · the print/preview view. Menus and dialogs are OPENED TO BE READ; no commit control
// is pressed (core §7.5), and Escape closes each one.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';

const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`;
fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const surfaces = {};
const log = (...a) => console.log(...a);

const { browser, page } = await boot('/workorders?tab=complete');

async function capture(name, opts = {}) {
  await page.waitForTimeout(opts.wait || 2000);
  const text = await page.evaluate(() => document.body?.innerText || '');
  const controls = await page.evaluate(() => {
    const seen = new Set(), o = [];
    for (const el of document.querySelectorAll('button,[role=button],[data-test-id],a,.q-item,[role=menuitem],[role=tab],label,input,select,[role=switch],[role=checkbox]')) {
      const t = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ');
      const id = el.getAttribute('data-test-id') || '';
      if ((!t && !id) || t.length > 80) continue;
      const k = t + '|' + id;
      if (seen.has(k)) continue;
      seen.add(k);
      o.push({ t, id });
    }
    return o;
  });
  surfaces[name] = { url: page.url(), chars: text.length, text, controls };
  fs.writeFileSync(`${DIR}/surface-${name}.txt`, text);
  await page.screenshot({ path: `${EV}/surface-${name}.png`, fullPage: !!opts.full }).catch(() => {});
  log(`  ${name.padEnd(26)} ${String(text.length).padStart(6)} chars  ${controls.length} controls`);
  return surfaces[name];
}

// 1 — work order page (the authorizer / approval labels live here)
await page.goto(`${APP}/workorders/${WO.id}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
await capture('workorder-lines', { wait: 3000, full: true });

// 2 — finance tab
const fin = page.locator('[data-test-id="link_finance_tab"]').first();
if (await fin.count()) {
  await fin.click({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(3500);
  await capture('finance-tab', { wait: 1500, full: true });
}

// 3 — the invoice menu (this is where a credit invoice / void action would be)
const im = page.locator('[data-test-id="button_wo_invoice_menu"]').first();
if (await im.count()) {
  await im.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
    .map(e => ({ t: (e.innerText || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
    .filter(x => x.t));
  surfaces['invoice-menu'] = { items };
  log(`  invoice-menu               ${items.length} items`);
  items.forEach(i => log(`      - ${JSON.stringify(i.t).slice(0, 52).padEnd(54)} ${i.id}`));
  await page.screenshot({ path: `${EV}/surface-invoice-menu.png` }).catch(() => {});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
}

// 4 — the invoice SETTINGS dialog (Summarize labor total, Labor rate, Part number … live here)
const st = page.locator('[data-test-id="button_invoice_settings"]').first();
if (await st.count()) {
  await st.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await capture('invoice-settings', { wait: 1200, full: true });
  const opts = await page.evaluate(() => [...document.querySelectorAll('.q-dialog label,.q-dialog .q-item,.q-dialog [role=switch],.q-dialog [data-test-id]')]
    .map(e => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' '), id: e.getAttribute('data-test-id') || '' }))
    .filter(x => x.t && x.t.length < 60));
  surfaces['invoice-settings-options'] = { options: opts };
  log(`  invoice-settings options   ${opts.length}`);
  opts.slice(0, 24).forEach(o => log(`      - ${JSON.stringify(o.t).slice(0, 50)}`));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
}

// 5 — the print / preview view
const pr = page.locator('[data-test-id="button_print_invoice"]').first();
if (await pr.count()) {
  log('  print control present: button_print_invoice (not pressed — it commits to a print dialog)');
  surfaces['print-control'] = { present: true };
}

fs.writeFileSync(`${DIR}/surfaces.json`, JSON.stringify(surfaces, null, 1));
const total = Object.values(surfaces).reduce((n, s) => n + (s.text ? s.text.length : 0), 0);
log(`\ncaptured ${Object.keys(surfaces).length} surfaces, ${total} chars of on-screen text`);
await browser.close();
