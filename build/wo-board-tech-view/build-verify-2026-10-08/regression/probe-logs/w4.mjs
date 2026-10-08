import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w4'); const w=st().woB; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.locator('thead [role=checkbox]').first().click(); await page.waitForTimeout(1200);
 await page.getByRole('button',{name:/More/}).first().click(); await page.waitForTimeout(1200); log('MORE MENU',await menu(page)); await dump('W4-more-menu'); await esc();
 await page.getByRole('button',{name:'Clear selection'}).click().catch(()=>{}); await page.waitForTimeout(800);
 await page.locator('button:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); log('PAGE MENU',await menu(page)); await page.locator('.q-menu .q-item').filter({hasText:'Timesheets'}).first().click(); await page.waitForTimeout(3500); log('TIMESHEETS',await menu(page)); log('TS btns',await btns(page,'.q-dialog')); await dump('W4-timesheets');
 const tmv=page.locator('.q-dialog button:has-text("more_vert"), .q-dialog i:has-text("more_vert")'); log('ts mv',await tmv.count()); if(await tmv.count()){ await tmv.first().click(); await page.waitForTimeout(1200); log('TS MV MENU',await menu(page)); await dump('W4-ts-menu'); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W4-err');}
await b.browser.close();
