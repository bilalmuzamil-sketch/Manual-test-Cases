import {start,mk,L,menu,notes,btns,B,OUT} from './h.mjs';
const log=L('i8'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(20000);
try{ await page.setViewportSize({width:1600,height:1000});
 // 1 unconfirmed new staff (ZZAUTOTEST Ana Alpha)
 await page.goto(B+'/impersonate-user/db7729af-b3f0-42a6-8ed4-68d71d68de78'); await page.waitForTimeout(9000);
 log('ANA url',page.url(),'notes',await notes(page)); log('ANA top',(await body()).slice(0,400)); await dump('I8-impersonate-new-staff');
 // 2 confirmed active technician Brandi Smith
 await page.goto(B+'/impersonate-user/27869a91-6d0d-4dcf-bf50-585d862d06b2'); await page.waitForTimeout(9000);
 log('BRANDI url',page.url(),'notes',await notes(page)); log('BRANDI top',(await body()).slice(0,600)); await dump('I8-impersonate-brandi');
 log('BRANDI btns',(await btns(page)).slice(0,25));
 const ex=page.getByRole('button',{name:'Exit'}); log('exit count',await ex.count());
 if(await ex.count()){ await ex.first().click(); await page.waitForTimeout(8000); log('AFTER EXIT url',page.url(),(await body()).slice(0,300)); await dump('I8-after-exit'); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('I8-err');}
await b.browser.close();
