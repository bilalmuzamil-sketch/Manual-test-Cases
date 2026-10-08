import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt3d'); const b=await start('/parts/inventory','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const rows=async()=>{const r=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(e=>e.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,40))); return r.length+' :: '+r.slice(0,3).join(' / ');};
const fbtn=(lab)=>page.locator('.q-btn,button').filter({hasText:new RegExp(lab+'(:|\\s|keyboard)')}).first();
async function test(path,lab,tab){
 await page.goto(B+path); await page.waitForTimeout(6000); if(tab){ await page.locator('.q-tab,[role=tab],button').filter({hasText:new RegExp('^\\s*'+tab+'\\s*$')}).first().click(); await page.waitForTimeout(3000);} 
 const before=await rows(); const b0=await fbtn(lab).innerText(); await fbtn(lab).click(); await page.waitForTimeout(1500); const m=await menu(page); log(path,tab||'','MENU',m.slice(0,300));
 let items=page.locator('.q-menu .filter-panel__list [role=checkbox]'); if(!(await items.count())) items=page.locator('.q-menu .q-item'); const n=await items.count(); let picked=null; for(let i=0;i<n;i++){ const t=((await items.nth(i).getAttribute('aria-label'))||(await items.nth(i).innerText())).replace(/\s+/g,' ').trim(); if(t&&!/Clear|Select all|^All /i.test(t)&&!(path.includes('part-sales')&&/Estimate|Approved/.test(t))){ await items.nth(i).click(); picked=t; break; } }
 await page.waitForTimeout(2500); await esc(); await page.waitForTimeout(1500); const after=await rows(); const b1=await fbtn(lab).innerText(); log(path,tab||'','PICKED',picked,'| btn',b0.replace(/\s+/g,' '),'->',b1.replace(/\s+/g,' '),'| rows',before,'->',after,'| url',page.url());
 await page.reload(); await page.waitForTimeout(7000); if(tab && !page.url().includes(tab.toLowerCase())) log('tab after reload?',await page.evaluate(()=>[...document.querySelectorAll('.q-tab--active')].map(e=>e.innerText.trim()).join(',')));
 const b2=await fbtn(lab).innerText().catch(()=>'?'); const rr=await rows(); log(path,tab||'','RELOAD btn',b2.replace(/\s+/g,' '),'| rows',rr,'| notes',await notes(page),'| url',page.url()); await dump('PT3-'+path.replace(/\W/g,'')+(tab||''));
 return picked;
}
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await test('/parts/returns','Vendor','Returns');
 await test('/parts/returns','Vendor','Credits');
 // restore earlier filters
 await page.goto(B+'/parts/part-sales?status=estimate&status=approved'); await page.waitForTimeout(6000); log('PS restore btn',(await fbtn('Status').innerText()).replace(/\s+/g,' '));
 for(const [p,lab] of [['/parts/inventory','Category'],['/parts/parts-catalogue','Manufacturer'],['/parts/returns','Vendor']]){ await page.goto(B+p); await page.waitForTimeout(6000); const x=fbtn(lab).locator('i,button').filter({hasText:/^cancel$/}); if(await x.count()){ await x.first().click({force:true}); await page.waitForTimeout(2500);} log('restored',p,(await fbtn(lab).innerText()).replace(/\s+/g,' ')); }
 for(const p of ['orders','deliveries','vendors']){ await page.goto(B+'/parts/'+p); await page.waitForTimeout(10000); log('ATTEMPT2',p,(await btns(page)).slice(18,40).join(' ; ')); await page.screenshot({path:OUT+'PT3-'+p+'-toolbar.png'}); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PT3-err');}
await b.browser.close();
