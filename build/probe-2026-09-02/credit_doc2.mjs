// The tooltip "Print credit memo" is a hover-only Quasar q-tooltip, so it is NOT in the DOM as a
// title/aria-label - searching for it found nothing. Target the Action cell's controls instead, hover
// to read the tooltip, then click.
//
// NOTE for the reading discipline: this table's Type cell has textContent "credit"/"invoice" in
// LOWERCASE - the capitalised "Credit"/"Invoice" a tester sees comes from CSS text-transform.
// textContent does not reflect text-transform. Hover/computed style is the only way to see the
// displayed casing.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST = '039fd202-c7f5-4b34-8000-969488b49687';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const out = { calls: [], popups: [], downloads: [] };
page.on('request', r => { const u = r.url(); if (u.includes(APIH)) out.calls.push(`${r.method()} ${u.replace(`https://${APIH}`,'<api>')}`); });
page.context().on('page', async p2 => { try { await p2.waitForLoadState('domcontentloaded'); out.popups.push(p2.url()); } catch(e){} });
page.on('download', d => out.downloads.push(d.suggestedFilename()));

await page.goto(`${APP}/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);

// mark the Action cell's controls on the CREDIT row
const marked = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  for (const tr of t.querySelectorAll('tbody tr')) {
    const txt = (tr.textContent || '').toLowerCase();
    if (!txt.includes('credit') || !txt.includes('cm')) continue;
    const cell = tr.cells[tr.cells.length - 1];
    const ctrls = [...cell.querySelectorAll('button, i, [role="button"], .q-btn')];
    ctrls.forEach((c, i) => c.setAttribute('data-qa-act', String(i)));
    return { n: ctrls.length,
             detail: ctrls.map((c, i) => ({ i, tag: c.tagName, text: (c.textContent||'').trim().slice(0,24),
                                            cls: (c.className||'').toString().slice(0,60) })) };
  }
  return null;
});
console.log('controls in the credit row Action cell:', JSON.stringify(marked, null, 1));
if (!marked) { await browser.close(); process.exit(1); }

// hover each to read its tooltip, so we click the RIGHT one rather than guessing
for (let i = 0; i < marked.n; i++) {
  await page.locator(`[data-qa-act="${i}"]`).first().hover().catch(()=>{});
  await page.waitForTimeout(1200);
  const tip = await page.evaluate(() => [...document.querySelectorAll('.q-tooltip, [role="tooltip"]')]
    .map(e => (e.textContent||'').trim()).filter(Boolean));
  console.log(`   control ${i} tooltip:`, JSON.stringify(tip));
  out[`tip${i}`] = tip;
}
// click the one whose tooltip says Print credit memo
let target = null;
for (let i = 0; i < marked.n; i++) if ((out[`tip${i}`]||[]).some(t => /print credit memo/i.test(t))) target = i;
console.log('\nclicking control', target);
if (target !== null) {
  const before = out.calls.length;
  await page.locator(`[data-qa-act="${target}"]`).first().click({ timeout: 20000 }).catch(e => console.log('click err:', String(e).split('\n')[0]));
  await page.waitForTimeout(10000);
  console.log('requests fired by the print icon:');
  [...new Set(out.calls.slice(before))].forEach(c => console.log('   ' + c));
  console.log('popups:', JSON.stringify(out.popups), '| downloads:', JSON.stringify(out.downloads));
  await page.screenshot({ path: 'build/probe-2026-09-02/credit-doc-after-print.png' });
}
fs.writeFileSync('build/probe-2026-09-02/credit-doc2.json', JSON.stringify(out, null, 1));
await browser.close();
