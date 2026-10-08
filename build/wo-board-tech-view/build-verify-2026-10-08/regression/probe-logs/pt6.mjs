import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt6'); const b=await start('/parts/returns','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const rows=async()=>{const r=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(e=>e.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,40))); return r.length+' :: '+r.slice(1,3).join(' / ');};
const fb=(re)=>page.locator('.q-btn,button').filter({hasText:re}).first();
const ftext=async(re)=>(await fb(re).innerText()).replace(/\s+/g,' ');
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 // Returns vendor (radio)
 const r0=await rows(); await fb(/Vendor\s*keyboard|Vendorkeyboard|Vendor:/).click(); await page.waitForTimeout(1500); const opt=page.locator('.q-menu [role=radio]').nth(1); const name=await opt.getAttribute('aria-label'); await opt.click(); await page.waitForTimeout(2500); await esc(); await page.waitForTimeout(1500);
 log('RET picked',name,'btn',await ftext(/Vendor/),'rows',r0,'->',await rows(),'url',page.url());
 await page.reload(); await page.waitForTimeout(7000); log('RET reload btn',await ftext(/Vendor/),'rows',await rows(),'url',page.url(),'notes',await notes(page)); await dump('PT6-returns-reload');
 const x=fb(/Vendor/).locator('i,button').filter({hasText:/^cancel$/}); if(await x.count()){ await x.first().click({force:true}); await page.waitForTimeout(2500);} log('RET restored',await ftext(/Vendor/));
 // Credits Date
 await page.locator('.q-btn,button,.q-tab').filter({hasText:/^\s*Credits\s*$/}).first().click(); await page.waitForTimeout(4000); const c0=await rows(); log('CRED url',page.url());
 await fb(/Date:/).click(); await page.waitForTimeout(1500); log('DATE MENU',await menu(page)); const dopt=page.locator('.q-menu [role=radio], .q-menu .q-item'); const n=await dopt.count(); let pick=null; for(let i=0;i<n;i++){ const t=((await dopt.nth(i).getAttribute('aria-label'))||(await dopt.nth(i).innerText())).trim(); if(t&&!/30 days/.test(t)){ await dopt.nth(i).click(); pick=t; break;} } await page.waitForTimeout(2500); await esc(); await page.waitForTimeout(1500);
 log('CRED picked',pick,'btn',await ftext(/Date:/),'rows',c0,'->',await rows(),'url',page.url());
 await page.reload(); await page.waitForTimeout(7000); log('CRED reload tab',await page.evaluate(()=>[...document.querySelectorAll('.q-btn--active,.q-tab--active,[aria-pressed=true]')].map(e=>e.innerText.trim()).join(',')),'btn',await ftext(/Date:/).catch(()=>'no Date btn'),'rows',await rows(),'url',page.url()); await dump('PT6-credits-reload');
 // restore credits date
 await fb(/Date:/).click().catch(()=>{}); await page.waitForTimeout(1200); await page.locator('.q-menu [role=radio], .q-menu .q-item').filter({hasText:/30 days/}).first().click().catch(()=>{}); await page.waitForTimeout(2000); await esc(); log('CRED restored',await ftext(/Date:/).catch(()=>'?'));
 // restore part sales / inventory / catalog
 await page.goto(B+'/parts/part-sales?status=estimate&status=approved'); await page.waitForTimeout(6000); log('PS now',await ftext(/Status/));
 for(const [p,re] of [['/parts/inventory',/Category/],['/parts/parts-catalogue',/Manufacturer/]]){ await page.goto(B+p); await page.waitForTimeout(6000); const x2=fb(re).locator('i,button').filter({hasText:/^cancel$/}); if(await x2.count()){ await x2.first().click({force:true}); await page.waitForTimeout(2500);} log('restored',p,await ftext(re)); }
 // attempt 2 on no-filter pages
 for(const p of ['orders','deliveries','vendors']){ await page.goto(B+'/parts/'+p); await page.waitForTimeout(10000); log('ATTEMPT2',p,(await btns(page)).slice(18,32).join(' ; ')); await page.screenshot({path:OUT+'PT6-'+p+'-toolbar.png'}); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PT6-err');}
await b.browser.close();
