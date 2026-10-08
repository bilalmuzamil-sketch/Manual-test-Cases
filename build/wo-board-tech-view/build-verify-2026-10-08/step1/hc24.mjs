import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc24.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const url0=page.url(); await page.locator('button:has-text("Receive")').last().click(); await page.waitForTimeout(6000); log('URL',url0,'->',page.url()); log('RECEIVE OV',(await ov()).slice(0,900));
 const d=page.locator('.q-dialog').last();
 await d.getByLabel('Assign vendor').click(); await page.waitForTimeout(1500); log('VENDORS',(await ov()).split('||').pop().slice(0,200)); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1500);
 await d.getByLabel('Vendor invoice number').fill('ZZINV-1');
 const tx=d.locator('input[type=text]').last(); await tx.fill('ZZPN-1'); const nums=d.locator('input[type=number]'); await nums.nth(2).fill('1'); await page.waitForTimeout(800);
 const cbs=d.locator('.q-checkbox'); log('checkboxes',await cbs.count()); await cbs.last().click(); await page.waitForTimeout(1000);
 const ins=d.locator('input'); const n=await ins.count(); log('dialog inputs',n, JSON.stringify(await d.evaluate(el=>[...el.querySelectorAll('input')].map(i=>(i.getAttribute('aria-label')||i.placeholder||i.type)+'='+i.value))));
 log('AFTER FILL',(await ov()).slice(0,700)); await dump('hc-wo-receive-filled');
 const rb=page.locator('button:has-text("Receive Parts")').last(); log('RB',await rb.innerText()); await rb.click(); await page.waitForTimeout(4000); log('AFTER RECEIVE',(await ov()).slice(0,500));
 await page.reload(); await page.waitForTimeout(7000); const t2=await body(); log('PART AFTER',t2.slice(t2.indexOf('Parts add'),t2.indexOf('Parts add')+500)); await dump('hc-wo-received');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
