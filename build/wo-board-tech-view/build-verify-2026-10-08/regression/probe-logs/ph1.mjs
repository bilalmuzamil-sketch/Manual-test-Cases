import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ph1'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:'Profile'}).click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Edit Profile'}).first().click(); await page.waitForTimeout(3500);
 log('URL',page.url()); log('DLG',await menu(page)); log('IN',await inputs(page)); log('FILE inputs',await page.locator('input[type=file]').count()); log('BTNS',(await btns(page)).slice(8,40)); await dump('PH1-edit-profile'); await page.screenshot({path:OUT+'PH1-edit-profile.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PH1-err');}
await b.browser.close();
