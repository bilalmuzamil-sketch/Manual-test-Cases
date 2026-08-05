// Is the missing customer NAME on the chip specific to the restore path? Test every path.
import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-custchip3.json',JSON.stringify(R,null,1));console.log('..'+n);};
const act=async page=>(await H.chips(page)).map(c=>({t:c.text.replace('|keyboard_arrow_down',''),active:c.cls.includes('filter-chip--active')}));
const {browser,page,netlog}=await H.open();
await H.resetFilters(page);
// Status (static enum) + Customer (async list) together, so the two are compared side by side
await H.openChip(page,'Status');
await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:20000});
await page.waitForTimeout(2500); await H.closePanel(page);
await H.openChip(page,'Customer');
const ids=await page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/^filter_option_/.test(t)).slice(0,1));
R.picked=await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);return e?e.innerText.trim():null;},ids[0]);
await page.locator(`[data-test-id="${ids[0]}"]`).first().click({timeout:20000});
await page.waitForTimeout(3000); await H.closePanel(page); await page.waitForTimeout(2000);
R.A_justSelected={url:page.url(),chips:await act(page)};
await H.shot(page,'rc3-01-just-selected'); S('A');
// B: navigate away and back (FLT-PERS-01)
await page.goto(APP+'/customers',{waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(8000);
await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(14000);
R.B_navAwayBack={url:page.url(),chips:await act(page)};
await H.shot(page,'rc3-02-nav-back'); S('B');
// C: full page reload
await page.reload({waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(15000);
R.C_reload={url:page.url(),chips:await act(page)};
await H.shot(page,'rc3-03-reload'); S('C');
await browser.close();
// D: brand-new context (closing the browser)
{ const b2=await boot();
  await b2.page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000}); await b2.page.waitForTimeout(18000);
  R.D_freshContext={url:b2.page.url(),chips:await act(b2.page)};
  await H.shot(b2.page,'rc3-04-fresh'); S('D');
  // E: URL-driven with the same customer id (shared link)
  const cid=R.A_justSelected.url.match(/company_id=([0-9a-f-]+)/)[1];
  await b2.page.goto(APP+'/workorders?company_id='+cid+'&tab=all',{waitUntil:'domcontentloaded',timeout:90000});
  await b2.page.waitForTimeout(15000);
  R.E_urlDriven={url:b2.page.url(),chips:await act(b2.page)};
  await H.shot(b2.page,'rc3-05-urldriven'); S('E');
  await b2.browser.close(); }
{ const b3=await H.open(); await H.resetFilters(b3.page); S('cleanup'); await b3.browser.close(); }
