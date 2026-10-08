import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('f5'); const w=st().woC; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:/^Complete$/}).first().click(); await page.waitForTimeout(2500);
 await page.locator('.q-dialog textarea').first().fill('ZZAUTOTEST done'); await page.waitForTimeout(800); log('B1',await btns(page,'.q-dialog'));
 await page.screenshot({path:OUT+'F5-complete-step1.png'});
 const nx=page.locator('.q-dialog').getByText(/Missing Details/); log('next',await nx.allInnerTexts()); if(await nx.count()){ await nx.last().click(); await page.waitForTimeout(2000); log('STEP2',await menu(page)); log('IN2',await inputs(page,'.q-dialog')); log('B2',await btns(page,'.q-dialog')); await page.screenshot({path:OUT+'F5-complete-step2.png'}); }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
