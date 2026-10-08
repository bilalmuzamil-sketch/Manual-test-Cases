import {start,mk,L,menu,inputs,btns,st} from './h.mjs';
const log=L('p3'); const w=st().woA; const b=await start(w.url.replace('https://sv10043.qa.shopview.com','')+'/lines','admin'); const {page}=b; const {dump,esc}=mk(page); page.setDefaultTimeout(15000);
const dl=()=>page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)));
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const w2=page.getByLabel('What are you doing?'); await w2.click(); await w2.pressSequentially('ZZAUTOTEST Oil change',{delay:60}); await page.waitForTimeout(3000); log('menu typed',(await menu(page)).split('||').slice(1).join('||').slice(0,300));
 await page.keyboard.press('Enter'); await page.waitForTimeout(2000); log('after enter',await dl()); log('IN',(await inputs(page)).slice(8));
 await page.keyboard.press('Tab'); await page.waitForTimeout(1500); log('after tab',await dl());
 const t=page.getByLabel('Add technician'); log('tech field',await t.count()); if(await t.count()){ await t.click(); await t.pressSequentially('ZZAUTOTEST Cal',{delay:60}); await page.waitForTimeout(2500); log('tech menu',(await menu(page)).split('||').slice(1).join('||').slice(0,300)); await page.locator('.q-menu .q-item').filter({hasText:'ZZAUTOTEST Cal'}).first().click().catch(e=>log('pick',e.message.slice(0,50))); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(500); log('after tech',await dl()); }
 const lr=page.getByLabel('Labor rate'); await lr.click(); await page.waitForTimeout(1500); log('LR menu',(await menu(page)).split('||').slice(1).join('||').slice(0,200)); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(800);
 const est=page.getByLabel('Estimated time'); if(await est.count()) await est.fill('1');
 await dump('P3-newline-free');
 await page.getByRole('button',{name:/Save and close|Save & Close/}).first().click(); await page.waitForTimeout(4000); log('after save dialogs',await dl()); log('errs',await page.evaluate(()=>[...document.querySelectorAll('.q-field--error')].map(e=>e.innerText.replace(/\s+/g,' ')))); log('notes',await page.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText).join('|')));
 await page.reload(); await page.waitForTimeout(7000); const bt=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ')); const i=bt.indexOf('Name/Description'); log('LINES',bt.slice(i,i+1500)); await dump('P3-lines');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
