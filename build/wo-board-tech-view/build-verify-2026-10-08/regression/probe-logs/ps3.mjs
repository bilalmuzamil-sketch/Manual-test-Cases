import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ps3'); const S=st(); const b=await start(S.psUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:/^Add Part$/}).first().click(); await page.waitForTimeout(2500); const d0=page.locator('.q-dialog').filter({hasText:'Add Part'}).last();
 await d0.getByLabel('Description').fill('ZZAUTOTEST Air Filter'); await d0.getByLabel('Quantity').fill('1'); await d0.getByLabel('Category').click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Uncategorized'}).first().click(); await page.waitForTimeout(600);
 await d0.getByLabel('Vendor').click(); await page.waitForTimeout(1500); await page.locator('.q-menu .q-item,[role=option]').first().click(); await page.waitForTimeout(800); await d0.getByLabel('Cost',{exact:true}).first().fill('100'); await d0.getByLabel('Sell price').first().fill('290.91');
 await d0.getByRole('button',{name:'Save & close'}).click(); await page.waitForTimeout(4000); log('after add',await notes(page),await page.locator('.q-dialog').count());
 await page.reload(); await page.waitForTimeout(6000); const t=await body(); log('PARTS',t.slice(t.indexOf('Parts ('),t.indexOf('Parts (')+40));
 log('BTNS',(await btns(page)).slice(14,50));
 const mv=page.locator('tbody tr').first().locator('button').filter({hasText:'more_vert'}); log('row mv',await mv.count()); await mv.first().click(); await page.waitForTimeout(1500); log('ROW MENU',await menu(page)); await dump('PS3-part-row-menu'); await esc();
 const top=page.getByRole('button',{name:'Line bulk action'}); if(await top.count()){ await top.click(); await page.waitForTimeout(1200); log('BULK MENU',await menu(page)); await esc(); }
 await page.getByRole('button',{name:'Authorize'}).click(); await page.waitForTimeout(3000); log('after Authorize',await notes(page),await menu(page)); await page.reload(); await page.waitForTimeout(6000); const t2=await body(); log('AFTER AUTH card',t2.slice(t2.indexOf('P10043'),t2.indexOf('P10043')+60),'btns',(await btns(page)).slice(14,40));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PS3-err');}
await b.browser.close();
