import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('f3'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 for(let k=0;k<2;k++){ const c=page.getByRole('button',{name:/^Complete$/}); log('complete btns',await c.count()); if(!(await c.count())) break; await c.first().click(); await page.waitForTimeout(2500); log('COMPLETE DLG',await menu(page), await notes(page)); log('cbtns',await btns(page,'.q-dialog'));
  const ta=page.locator('.q-dialog textarea').first(); if(await ta.count()){ await ta.fill('ZZAUTOTEST done'); await page.waitForTimeout(600); log('cbtns2',await btns(page,'.q-dialog')); const ok=page.locator('.q-dialog button').filter({hasText:/Complete|Save|Confirm/}).last(); if(await ok.count()){ await ok.click(); await page.waitForTimeout(3000);} }
  log('after',await notes(page)); await dump('F3-complete-'+k); await page.reload(); await page.waitForTimeout(6000); }
 const t=await body(); log('STATUS',(t.match(/S10043-\d+ (\w+( \w+)?)/)||[])[0]); const i=t.indexOf('Name/Description'); log('LINES',t.slice(i,i+500));
 // status badge click
 const badge=page.locator('.q-badge, .q-chip').filter({hasText:/Approved|In Progress|Complete|Review/}).first(); log('badge',await badge.innerText().catch(()=>'none')); await badge.click().catch(e=>log('badge click',e.message.slice(0,60))); await page.waitForTimeout(1500); log('STATUS MENU',await menu(page)); await dump('F3-status-menu');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F3-err');}
await b.browser.close();
