import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob51.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,tip}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.getByRole('button',{name:'Tech View'}).first().click(); await page.waitForTimeout(6000);
 const t=await page.evaluate(()=>document.body.innerText); log('HAS Collapse all', /Collapse all/i.test(t), 'Expand all', /Expand all/i.test(t));
 log('ARIA',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].map(e=>e.getAttribute('aria-label')||'').filter(a=>/collapse|expand|column/i.test(a)).slice(0,12))));
 await page.getByRole('button',{name:'Column Selection'}).first().click().catch(async()=>{await page.locator('button[aria-label="Column Selection"]').first().click();}); await page.waitForTimeout(2000);
 log('COLMENU',await ov());
 log('COL INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu input')].map(e=>(e.placeholder||'')+'|'+(e.getAttribute('aria-label')||'')+'|'+e.type))));
 await dump('techview-colmenu-recheck');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
