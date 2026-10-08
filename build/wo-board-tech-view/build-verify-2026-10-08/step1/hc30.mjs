import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc30.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/parts/part-sales','admin'); const {page}=b; const {dump,ov,body,go}=mk(page); page.setDefaultTimeout(15000);
const btns=async()=>JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+'|'+(e.getAttribute('aria-label')||'')).filter(x=>/Authorize|Order|Receive|Return|context|Add Part|Decline/i.test(x))));
try{
 await page.waitForTimeout(3000); let t=await body(); log('LIST',t.slice(t.indexOf('Number'),t.indexOf('Number')+300));
 await page.locator('input[placeholder*="Search" i]').last().fill('P10043-248').catch(()=>{}); await page.waitForTimeout(4000);
 await page.locator('tr').filter({hasText:'P10043-248'}).first().click(); await page.waitForTimeout(6000); log('URL',page.url());
 await page.locator('button:has-text("Order")').last().click(); await page.waitForTimeout(3500); log('ORDER OV',(await ov()).slice(0,300));
 await page.reload(); await page.waitForTimeout(6000); log('BTNS1',await btns());
 await page.locator('button:has-text("Receive")').last().click(); await page.waitForTimeout(4000); log('RECV OV',(await ov()).slice(0,500));
 const d=page.locator('.q-dialog').last();
 const tx=d.locator('input[type=text]').last(); await tx.fill('ZZPN-PS1').catch(e=>log('pn',e.message.slice(0,60)));
 const nums=d.locator('input[type=number]'); const nn=await nums.count(); log('numcount',nn); if(nn>=3) await nums.nth(2).fill('1');
 await d.getByLabel('Vendor invoice number').fill('ZZINV-PS1').catch(()=>{});
 const cbs=d.locator('.q-checkbox'); log('checkboxes',await cbs.count()); await cbs.last().click(); await page.waitForTimeout(1200); log('FILLED',(await ov()).slice(0,600));
 await page.locator('button:has-text("Receive Parts")').last().click(); await page.waitForTimeout(4000); log('AFTER RECV',(await ov()).slice(0,200));
 await page.reload(); await page.waitForTimeout(6000); t=await body(); log('PARTS NOW',t.slice(t.indexOf('Parts ('),t.indexOf('Parts (')+900)); log('BTNS2',await btns()); await dump('hc-ps-received');
 log('ARIA',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,[role=button],i')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').trim().slice(0,25)).filter(x=>/return|undo|assignment/i.test(x)))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
