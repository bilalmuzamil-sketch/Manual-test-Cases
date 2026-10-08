import {start,mk,L,menu,inputs,btns,notes,B,OUT} from './h.mjs';
const log=L('c1'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000});
 await page.getByRole('button',{name:'Profile'}).click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Settings'}).click(); await page.waitForTimeout(4000);
 await page.getByText('Canned Lines',{exact:true}).click(); await page.waitForTimeout(5000); log('URL',page.url()); const t=await body(); log('PAGE',t.slice(t.indexOf('Canned Lines',600),t.indexOf('Canned Lines',600)+1200)); log('BTNS',(await btns(page)).slice(25,50)); await dump('C1-canned-lines');
 const nb=page.getByRole('button',{name:/New|Add|Create/}).filter({hasText:/Canned|New/}); log('new btns',await nb.allInnerTexts());
 if(await nb.count()){ await nb.first().click(); await page.waitForTimeout(3000); log('NEW DLG',await menu(page)); log('IN',await inputs(page,'.q-dialog')); await dump('C1-new-canned'); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('C1-err');}
await b.browser.close();
