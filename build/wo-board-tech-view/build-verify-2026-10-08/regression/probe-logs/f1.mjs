import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('f1'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 // approve remaining line first
 const ap=page.getByRole('button',{name:/^Approve$/}); if(await ap.count()){ await ap.first().click(); await page.waitForTimeout(3000);} 
 await page.getByText('Finance',{exact:true}).first().click(); await page.waitForTimeout(4000); log('URL',page.url()); log('FIN btns',(await btns(page)).slice(18)); await dump('F1-finance');
 const ci=page.getByRole('button',{name:/Create Invoice/i}); log('create inv',await ci.count());
 if(await ci.count()){ await ci.first().click(); await page.waitForTimeout(4000); log('AFTER CI',await menu(page), await notes(page)); log('dlg btns',await btns(page,'.q-dialog')); await dump('F1-create-invoice'); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F1-err');}
await b.browser.close();
