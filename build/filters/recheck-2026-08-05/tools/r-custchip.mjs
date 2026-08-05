// Does a RESTORED Customer filter show the customer NAME on the chip? (S7 chip label)
import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-custchip.json',JSON.stringify(R,null,1));console.log('..'+n);};
const {browser,page,netlog}=await boot();
await page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(16000);
R.at16s={url:page.url(),chips:(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active'),testid:c.testid}))};
await page.waitForTimeout(12000);
R.at28s={url:page.url(),chips:(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active'),testid:c.testid}))};
await H.shot(page,'rc-01-restored');
// open the Customer chip: is the tag there?
R.openCustomer=await H.openChip(page,'Customer');
const p=await H.panel(page);
R.customerPanel={tags:p&&p.tags,inputs:p&&p.inputs,checkedOptions:(p&&p.options||[]).filter(o=>o.checked==='true'||/check/i.test(JSON.stringify(o.icons||[]))).map(o=>o.label).slice(0,6)};
await H.shot(page,'rc-02-customer-panel');
R.chipsAfterOpening=(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}));
await H.closePanel(page);
R.chipsAfterClosing=(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}));
// reload the page and look again
await page.reload({waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(15000);
R.afterReload={url:page.url(),chips:(await H.chips(page)).map(c=>({t:c.text,active:c.cls.includes('filter-chip--active')}))};
await H.shot(page,'rc-03-after-reload');
// and the customer-name lookup calls, if any
R.net=netlog.filter(n=>n.phase==='res'&&/compan|customer/i.test(n.url)).slice(0,12).map(n=>({s:n.status,u:n.url.replace(/^https:\/\/[^/]+/,'').slice(0,140)}));
S('done'); await browser.close();
