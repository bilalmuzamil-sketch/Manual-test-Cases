// Re-run of the UI walks, WITH A POSITIVE CONTROL BEFORE EVERY READ.
//
// The first attempt reported Contact=false, Phone=false, Authorizer=false on a work order page
// where all three were captured earlier today, and found zero payment controls on a finance tab
// that definitely has them. That is a probe that did not fire; its negatives are void. The cause
// was reading after a fixed 4s wait instead of waiting for the page to actually be there.
//
// So each section now WAITS FOR A KNOWN ANCHOR and refuses to report if the anchor never appears.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const EST_WO = 'f5678f51-f531-4c21-a45f-5a2279b922be';
const PAID_WO = '06747f14-bf1e-4c03-8358-732e78b0167d';
const log = (...a) => console.log(...a);
const out = {}, nonGet = [];

const { browser, page } = await boot(`/workorders/${EST_WO}/lines`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,240); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });

async function anchored(sel, label, ms = 45000) {
  const ok = await page.waitForSelector(sel, { timeout: ms }).then(() => true).catch(() => false);
  log(`  anchor ${label}: ${ok ? 'PRESENT' : '*** NEVER APPEARED — nothing will be reported ***'}`);
  return ok;
}

// ---------- C45190: the work order customer card ----------
log('\n=== C45190: work order customer card ===');
if (await anchored('[data-test-id="select_authorizer"]', 'select_authorizer')) {
  await page.waitForTimeout(2500);
  const card = await page.evaluate(() => {
    const t = document.body.innerText || '';
    return { Contact: t.includes('Contact'), Phone: t.includes('Phone'),
             Authorizer: t.includes('Authorizer'), Title: t.includes('Title'),
             ids: [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id'))
                   .filter(i => /contact|phone|authorizer|title/i.test(i)) };
  });
  out.C45190_work_order = card;
  log(`  Contact=${card.Contact} Phone=${card.Phone} Authorizer=${card.Authorizer} Title=${card.Title}`);
  log(`  ids: ${[...new Set(card.ids)].join(', ')}`);
  await page.screenshot({ path: `${EV}/c45190-wo-card.png`, fullPage: true }).catch(() => {});
}

// ---------- the PART SALE customer card (the other half of C45190) ----------
log('\n=== C45190: part sale customer card ===');
const PS = '50c51ff1-c5f6-42ba-86ec-d3ce283df81e';
await page.goto(`${APP}/workorders/${PS}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
if (await anchored('[data-test-id="link_finance_tab"]', 'link_finance_tab (part sale)', 40000)) {
  await page.waitForTimeout(2500);
  const psc = await page.evaluate(() => {
    const t = document.body.innerText || '';
    return { Contact: t.includes('Contact'), Phone: t.includes('Phone'),
             Authorizer: t.includes('Authorizer'), chars: t.length };
  });
  out.C45190_part_sale = psc;
  log(`  Contact=${psc.Contact} Phone=${psc.Phone} Authorizer=${psc.Authorizer} (page ${psc.chars} chars)`);
  await page.screenshot({ path: `${EV}/c45190-partsale-card.png`, fullPage: true }).catch(() => {});
}

// ---------- C45177 / C45196: payment controls on a PAID work order finance tab ----------
log('\n=== C45177 / C45196: payment controls ===');
await page.goto(`${APP}/workorders/${PAID_WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
if (await anchored('[data-test-id="link_finance_tab"]', 'link_finance_tab (paid WO)', 40000)) {
  await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 12000 }).catch(() => {});
  const ok = await page.waitForSelector('[data-test-id="button_print_invoice"]', { timeout: 40000 }).then(()=>true).catch(()=>false);
  log(`  anchor button_print_invoice (finance loaded): ${ok ? 'PRESENT' : '*** NEVER APPEARED ***'}`);
  if (ok) {
    await page.waitForTimeout(2500);
    const pay = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
      .map(e => e.getAttribute('data-test-id'))
      .filter(i => /pay|reverse|refund|void|credit|deposit|cash|more|action/i.test(i)));
    out.payment_controls = [...new Set(pay)];
    log('  payment-ish test-ids:');
    out.payment_controls.forEach(i => log('    ', i));
    const menu = page.locator('[data-test-id="button_wo_invoice_menu"]').first();
    if (await menu.count()) {
      await menu.click({ timeout: 9000 }).catch(() => {});
      await page.waitForTimeout(2000);
      const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
        .map(e => ({ t: (e.innerText||'').trim().replace(/\s+/g,' '), id: e.getAttribute('data-test-id')||'' })).filter(x=>x.t));
      out.invoice_menu_paid = items;
      log('  invoice menu items on a PAID work order:');
      items.forEach(i => log(`     ${JSON.stringify(i.t).padEnd(30)} ${i.id}`));
      await page.keyboard.press('Escape');
    }
    await page.screenshot({ path: `${EV}/payment-controls-paid.png`, fullPage: true }).catch(() => {});
  }
}
fs.writeFileSync(`${DIR}/ui-walk-evidence.json`, JSON.stringify({ ...out, nonGet }, null, 1));
log(`\nNON-GET CALLS THIS RUN (expect 0): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
