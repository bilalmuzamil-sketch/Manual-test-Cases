import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('e2'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 for(const n of ['Change Customer','Change Asset']){ await page.getByRole('button',{name:n}).click({force:true}); await page.waitForTimeout(2500); log(n,await menu(page)); log(n+' IN',await inputs(page,'.q-dialog').catch(()=>[])); log(n+' btns',await btns(page,'.q-dialog').catch(()=>[])); await dump('E2-'+n.replace(' ','-')); await page.locator('.q-dialog button').filter({hasText:/close|Cancel/}).first().click().catch(()=>{}); await page.waitForTimeout(1000); await esc(); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('E2-err');}
await b.browser.close();
