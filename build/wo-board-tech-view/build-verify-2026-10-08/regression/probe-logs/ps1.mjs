import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ps1'); const b=await start('/parts/part-sales','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.goto(B+'/parts/part-sales'); await page.waitForTimeout(7000); log('URL0',page.url(),(await btns(page)).filter(x=>/New|Part/.test(x)));
 await page.getByRole('button',{name:'New part sale'}).click(); await page.waitForTimeout(3000); log('NPS',await menu(page)); log('IN',await inputs(page,'.q-dialog').catch(()=>[]));
 const cf=page.locator('.q-dialog .q-field').first(); await cf.click(); await page.keyboard.type('ZZAUTOTEST Regression Walk',{delay:50}); await page.waitForTimeout(3000); await page.locator('.q-menu .q-item,[role=option]').filter({hasText:'ZZAUTOTEST Regression Walk'}).first().click(); await page.waitForTimeout(1500);
 log('NPS filled',await menu(page)); await page.locator('.q-dialog button').filter({hasText:/Save|Create/}).last().click(); await page.waitForTimeout(7000);
 if(await page.locator('.q-dialog').filter({hasText:'Confirmation'}).count()){ log('CONF',await menu(page)); await page.locator('.q-dialog').filter({hasText:'Confirmation'}).getByRole('button',{name:/Create|Yes|Confirm/}).click(); await page.waitForTimeout(7000);} 
 log('URL',page.url()); const t=await body(); log('PAGE',t.slice(200,1800)); save('psUrl',page.url()); log('BTNS',(await btns(page)).slice(8,40)); log('IN2',await inputs(page)); await dump('PS1-part-sale-page');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PS1-err');}
await b.browser.close();
