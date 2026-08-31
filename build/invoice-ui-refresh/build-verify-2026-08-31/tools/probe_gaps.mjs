// PROVE OR DISPROVE two "label absent" claims that I may have caused myself.
//
// CLAIM 1: 'Show declined work' and 'Show % on Estimates and Invoices' are absent from the build,
//   blocking C44937/C44938/C44939/C44942. But spec S5-R7 says the Invoice Details settings number
//   NINE, and my first capture recorded only FIVE toggles -- consistent with a dialog I never
//   scrolled. If the other four are there, those four cases were never blocked by the build.
//
// CLAIM 2: 'Due date' is absent, blocking C44963. But S10-R4 says the masthead shows "Paid date"
//   when fully paid and "Due date" when NOT fully paid -- and every document I captured was for a
//   PAID work order. A label that only appears in a state I never rendered is not an absent label.
//
// This is Rule 68 in practice: a blocker blocks only what it ACTUALLY blocks, and Rule 12: absent
// must be OBSERVED absent, on the surface and in the state where it is supposed to appear.
// Read-only: opens the settings dialog to READ it and Escapes; renders documents via GET.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const COOK = fs.readFileSync('/tmp/qa-cookies/sv8218-live-session.txt', 'utf8').trim();
const log = (...a) => console.log(...a);
const out = {};

const { browser, page } = await boot(`/workorders/${WO.id}/lines`);
await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 10000 }).catch(() => {});
await page.waitForTimeout(3500);

// ---- CLAIM 1: the FULL settings dialog, scrolled ----
const st = page.locator('[data-test-id="button_invoice_settings"]').first();
if (await st.count()) {
  await st.click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2500);
  // scroll the dialog's own scroll container to the bottom so late toggles render
  await page.evaluate(async () => {
    const d = document.querySelector('.q-dialog');
    if (!d) return;
    const sc = d.querySelector('.q-card, .scroll, [class*=scroll]') || d;
    for (let i = 0; i < 12; i++) { sc.scrollTop = sc.scrollHeight; await new Promise(r => setTimeout(r, 250)); }
  });
  await page.waitForTimeout(1200);
  const toggles = await page.evaluate(() => [...document.querySelectorAll('.q-dialog [data-test-id^="toggle_setting"],.q-dialog [data-test-id*="setting"],.q-dialog .q-toggle,.q-dialog .q-checkbox')]
    .map(e => {
      // the visible label is usually a sibling/ancestor text node, not inside the toggle
      let lab = '';
      let n = e;
      for (let i = 0; i < 4 && n; i++) { n = n.parentElement; if (n && (n.innerText || '').trim()) { lab = n.innerText.trim().replace(/\s+/g, ' '); break; } }
      return { id: e.getAttribute('data-test-id') || '', label: lab.slice(0, 70) };
    }));
  const uniq = [...new Map(toggles.map(t => [t.id + '|' + t.label, t])).values()];
  const dlgText = await page.evaluate(() => (document.querySelector('.q-dialog')?.innerText || ''));
  out.settings = { count: uniq.length, toggles: uniq, text: dlgText };
  fs.writeFileSync(`${DIR}/surface-invoice-settings-full.txt`, dlgText);
  await page.screenshot({ path: `${EV}/invoice-settings-full.png`, fullPage: true }).catch(() => {});
  log(`\n=== CLAIM 1: invoice settings dialog, scrolled ===`);
  log(`toggles found: ${uniq.length}   (first capture found 5; spec S5-R7 says nine settings)`);
  uniq.forEach(t => log(`   ${t.id.padEnd(42)} ${JSON.stringify(t.label).slice(0, 60)}`));
  log('\nlabel check in the dialog text:');
  for (const l of ['Show declined work', 'Show %', 'Part number', 'Part description', 'Labor rate',
                   'Labor hours', 'Labor price', 'Summarize labor total', 'Summarize parts total']) {
    log(`   ${l.padEnd(26)} ${dlgText.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
  }
  log(`   ${'zz-9f3a (control)'.padEnd(26)} ${dlgText.includes('zz-9f3a') ? 'FOUND (BAD)' : 'absent (control OK)'}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
}

// ---- CLAIM 2: which work-order states exist, and what date label each document carries ----
const wos = await (await fetch('https://sv8218api.qa.shopview.com/api/work-orders?limit=200',
  { headers: { Cookie: COOK } })).json();
function rows(o) { if (Array.isArray(o) && o[0] && typeof o[0] === 'object') return o; if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = rows(v); if (r) return r; } } return null; }
const list = rows(wos) || [];
const byStatus = {};
for (const w of list) (byStatus[String(w.status).toLowerCase()] ||= []).push(w);
log(`\n=== CLAIM 2: work-order states available ===`);
log(Object.entries(byStatus).map(([k, v]) => `${k}=${v.length}`).join('  '));

async function dateLabels(wo) {
  const v = await (await fetch(`https://sv8218api.qa.shopview.com/api/work-orders/view/${wo.id}`,
    { headers: { Cookie: COOK } })).json();
  const s = JSON.stringify(v);
  const m = s.match(/"invoice_id"\s*:\s*"([0-9a-f-]{8,})"/);
  if (!m) return { wo: wo.number, status: wo.status, note: 'no invoice_id' };
  const isEst = /estimate/i.test(wo.status) ? 1 : 0;
  const html = await (await fetch(`https://sv8218api.qa.shopview.com/api/invoices/preview?invoice_id=${m[1]}&type=html&isEstimate=${isEst}&includeDeclined=0&historyEvent=`,
    { headers: { Cookie: COOK } })).text();
  const found = ['Estimate date', 'Invoice date', 'Due date', 'Paid date', 'Receipt']
    .filter(l => html.includes(l));
  return { wo: wo.number, status: wo.status, isEstimate: isEst, bytes: html.length, date_labels: found };
}
const probes = [];
for (const st of ['paid', 'invoiced', 'complete', 'approved', 'estimate', 'in progress', 'review']) {
  const w = (byStatus[st] || [])[0];
  if (w) probes.push(await dateLabels(w));
}
out.date_probes = probes;
log('\ndate labels per work-order state, from the RENDERED document:');
probes.forEach(p => log(`   ${String(p.status).padEnd(12)} ${String(p.wo).padEnd(14)} ${p.date_labels ? p.date_labels.join(', ') : p.note}`));
fs.writeFileSync(`${DIR}/gap-probe.json`, JSON.stringify(out, null, 1));
await browser.close();
