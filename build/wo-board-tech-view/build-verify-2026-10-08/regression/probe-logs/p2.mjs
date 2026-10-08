import {start,mk,L,menu,inputs,btns,st} from './h.mjs';
const log=L('p2'); const w=st().woA; const b=await start(w.url.replace('https://sv10043.qa.shopview.com','')+'/lines','admin'); const {page}=b; const {dump}=mk(page); page.setDefaultTimeout(15000);
const dl=()=>page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)));
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 log('lines now',await page.evaluate(()=>document.body.innerText.match(/Lines \(\d+\)/)?.[0]));
 log('dialogs',await dl());
 const w2=page.getByLabel('What are you doing?'); await w2.click(); await w2.pressSequentially('Brake pot',{delay:80}); await page.waitForTimeout(3000); log('menu',(await menu(page)).slice(-400));
 await page.locator('.q-menu .q-item').filter({hasText:'Brake pot'}).first().click(); await page.waitForTimeout(2500); log('dialogs after pick',await dl()); log('IN',await inputs(page));
 const tg=page.getByRole('switch',{name:'Line Approved'}).or(page.locator('[aria-label="Line Approved"]')); log('tg count',await tg.count());
 await tg.first().click(); await page.waitForTimeout(800); log('tg',await tg.first().getAttribute('aria-checked'));
 log('btns',await btns(page,'.q-dialog'));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
