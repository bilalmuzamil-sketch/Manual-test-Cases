import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob52.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(6000);
 await page.locator('button[aria-label="Fields to display"]').first().click(); await page.waitForTimeout(2000);
 log('FIELDS MENU',await ov());
 log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu input')].map(e=>(e.placeholder||'')+'|'+e.type))));
 await dump('board-fields-menu-recheck');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
