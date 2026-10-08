import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('f2'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/finance','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const ci=page.getByRole('button',{name:/Create Invoice/i}).first(); log('tip',await tip(ci)); await ci.hover(); await page.waitForTimeout(1000); await page.screenshot({path:OUT+'F2-create-invoice-disabled.png'});
 const t=await body(); const i=t.indexOf('Add Deposit'); log('FIN text',t.slice(i-800,i+600));
 log('STATUS',(t.match(/S10043-\d+ (\w+( \w+)?)/)||[])[0]);
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
