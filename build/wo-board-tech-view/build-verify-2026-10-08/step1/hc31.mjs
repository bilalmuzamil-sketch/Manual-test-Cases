import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc31.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/parts/part-sales','admin'); const {page}=b; const {dump,ov,body,go}=mk(page); page.setDefaultTimeout(15000);
const btns=async()=>JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+'|'+(e.getAttribute('aria-label')||'')).filter(x=>/Authorize|Order|Receive|Return|context|Add Part|Decline/i.test(x))));
try{
 await page.waitForTimeout(3000); let t=await body(); log('LIST',t.slice(t.indexOf('Number'),t.indexOf('Number')+300));
 await page.locator('input[placeholder*="Search" i]').last().fill('P10043-248').catch(()=>{}); await page.waitForTimeout(4000);
 await page.locator('tr').filter({hasText:'P10043-248'}).first().click(); await page.waitForTimeout(6000); log('URL',page.url());
 await page.locator('button[aria-label="Return part"]').first().click(); await page.waitForTimeout(3000); log('RET OV',(await ov()).slice(0,500)); await dump('hc-ps-return-dlg');
 log('RET INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input,.q-dialog textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.type)+'='+e.value))));
 const rr=page.getByLabel('Return reason'); if(await rr.count()) await rr.fill('ZZAUTOTEST wrong part');
 const sv=page.locator('.q-dialog button').filter({hasText:/Save & Close|Return|Save/}).last(); log('save btn',await sv.innerText().catch(()=>'')); await sv.click(); await page.waitForTimeout(4000); log('AFTER RET',(await ov()).slice(0,300));
 await page.reload(); await page.waitForTimeout(6000); let u=await body(); log('PARTS NOW',u.slice(u.indexOf('Parts ('),u.indexOf('Parts (')+40)+' … '+(u.match(/(Returned|Return Requested|Return requested|Received)[^A-Z]{0,20}/g)||[]).join(','));
 await go('/parts/part-sales',6000); await page.locator('input[placeholder*="Search" i]').last().fill('P10043-248').catch(()=>{}); await page.waitForTimeout(4000);
 const hdr=await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\s+/g,' ').replace('arrow_drop_up','').trim()));
 const cells=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].find(r=>r.innerText.includes('P10043-248'));return r?[...r.cells].map(c=>c.innerText.replace(/\s+/g,' ').trim()):null;});
 log('HDR',JSON.stringify(hdr)); log('CELLS',JSON.stringify(cells)); await dump('hc-ps-list-counts');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
