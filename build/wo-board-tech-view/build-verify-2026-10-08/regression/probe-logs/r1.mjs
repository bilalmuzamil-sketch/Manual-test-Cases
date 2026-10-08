import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('r1'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000);
 await page.getByText('Roles & Permissions').first().click(); await page.waitForTimeout(6000); log('URL',page.url());
 const t=await body(); const i=t.indexOf('Invoices',600); log('PAGE',t.slice(i,i+1800)); await dump('R1-roles');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R1-err');}
await b.browser.close();
