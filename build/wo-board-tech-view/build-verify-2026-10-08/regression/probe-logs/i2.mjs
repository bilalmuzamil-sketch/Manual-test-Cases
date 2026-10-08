import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('i2'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Profile'}).click(); await page.waitForTimeout(1500); log('PROFILE MENU',await menu(page)); await dump('I2-profile-menu');
 const items=await page.locator('.q-menu .q-item').allInnerTexts(); log('ITEMS',items);
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
