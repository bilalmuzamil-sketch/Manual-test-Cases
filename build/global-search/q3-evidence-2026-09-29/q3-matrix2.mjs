import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'node:fs';
const CUST = { name: 'ZZQ3 Switchboard Customer', phone: '555-3301-0001',
               id: 'e6876b15-6734-4909-8928-ecd3c0fac989' };
const VEND = { name: 'ZZQ3 Switchboard Vendor', phone: '555-3302-0002' };
const out = { customer: CUST, vendor: VEND, steps: [] };
const log = (k,v) => { out.steps.push({[k]:v}); console.log('\n##', k, JSON.stringify(v).slice(0,700)); };
const { page, browser } = await boot('/parts/vendors', { key:'admin', settle:14000 });
try {
  await page.setViewportSize({width:1440,height:900});
  const vbtn = page.getByRole('button',{name:/New Vendor|Add Vendor/i}).first();
  await vbtn.click(); await page.waitForTimeout(3000);
  const btns = await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')]
    .map(b=>b.innerText.replace(/\s+/g,' ').trim()).filter(Boolean));
  log('vendor_dialog_buttons', btns);
  const inp = page.locator('.q-dialog input');
  await inp.nth(0).fill(VEND.name);
  await inp.nth(5).fill(VEND.phone);     // Telephone, from the form dump
  await page.waitForTimeout(500);
  // click the last enabled button that is not "close"
  const ok = await page.evaluate(()=>{
    const bs=[...document.querySelectorAll('.q-dialog button')]
      .filter(b=>!/close/i.test(b.innerText) && !b.disabled);
    const b=bs[bs.length-1]; if(b){ b.click(); return b.innerText.replace(/\s+/g,' ').trim(); } return null;
  });
  log('vendor_save_clicked', ok);
  await page.waitForTimeout(8000);
  log('vendor_created', { dialogStillOpen: !!(await page.locator('.q-dialog').count()),
    err: await page.evaluate(()=>[...document.querySelectorAll('.q-field--error')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,3)) });

  await page.waitForTimeout(45000);      // index: the requirement allows up to 30s

  async function search(term){
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1500);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(term,{delay:45});
    await page.waitForTimeout(6000);
    return page.evaluate(()=>({
      tabs:[...document.querySelectorAll('.search-tabs__tab')].map(e=>e.innerText.replace(/\s+/g,' ').trim()),
      rows:[...document.querySelectorAll('.search-row')].map(r=>r.innerText.replace(/\s+/g,' ').trim()),
      empty:(document.querySelector('.search-modal__body')?.innerText||'').replace(/\s+/g,' ').trim().slice(0,160)}));
  }
  for (const [what,term] of [
    ['A_customer_by_its_OWN_phone', CUST.phone],
    ['A_control_customer_by_name',  CUST.name],
    ['B_vendor_by_its_OWN_phone',   VEND.phone],
    ['B_control_vendor_by_name',    VEND.name],
    ['C_existing_customer_own_phone_609', '609-461-6502'],
  ]) log(what, await search(term));
  fs.writeFileSync('q3-matrix.json', JSON.stringify(out,null,1));
} finally { await browser.close(); }
