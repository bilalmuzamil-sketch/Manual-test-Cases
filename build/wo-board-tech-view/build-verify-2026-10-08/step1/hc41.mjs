import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc41.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,esc}=mk(page); page.setDefaultTimeout(15000);
try{ await page.locator('button:has-text("Staging Heavy Duty - 9919")').first().click(); await page.waitForTimeout(1500); log('INITIALS MENU',(await ov()).slice(0,300));
 await page.locator('.q-menu .q-item').filter({hasText:/Change Location/}).first().click(); await page.waitForTimeout(2000); log('CHANGE LOCATION',(await ov()).slice(0,400)); await dump('hc-change-location-list'); await esc(); await esc();
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
