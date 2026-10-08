import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc29.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/parts/part-sales','admin'); const {page}=b; const {dump,ov,body,go}=mk(page); page.setDefaultTimeout(15000);
const btns=async()=>JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+'|'+(e.getAttribute('aria-label')||'')).filter(x=>/Authorize|Order|Receive|Return|context|Add Part|Decline/i.test(x))));
try{
 await page.waitForTimeout(3000); let t=await body(); log('LIST',t.slice(t.indexOf('Number'),t.indexOf('Number')+300));
 await page.locator('input[placeholder*="Search" i]').last().fill('P10043-248').catch(()=>{}); await page.waitForTimeout(4000);
 await page.locator('tr').filter({hasText:'P10043-248'}).first().click(); await page.waitForTimeout(6000); log('URL',page.url());
 t=await body(); log('PS PAGE',t.slice(t.indexOf('P10043-248'),t.indexOf('P10043-248')+1500)); log('BTNS',await btns()); await dump('hc-ps-248');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
