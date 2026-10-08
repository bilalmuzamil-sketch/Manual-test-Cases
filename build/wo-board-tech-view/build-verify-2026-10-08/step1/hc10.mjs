import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc10.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('ZZAUTOTEST Imported',{delay:30}); await page.waitForTimeout(5000);
 const t=await body(); const i=t.indexOf('Created On'); log('ROWS',t.slice(i,i+500)); await dump('hc-imported-list');
 const row=page.locator('tbody tr').filter({hasText:'ZZAUTOTEST Imported'}).first(); log('rowcount',await page.locator('tbody tr').filter({hasText:'ZZAUTOTEST Imported'}).count());
 await page.locator('button:has-text("Status")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu').last().getByText('Imported',{exact:true}).first().click().catch(e=>log('imp opt',e.message.slice(0,80))); await page.waitForTimeout(4000); await esc();
 const u=await body(); log('IMPORTED FILTER',u.slice(u.indexOf('Created On'),u.indexOf('Created On')+300));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
