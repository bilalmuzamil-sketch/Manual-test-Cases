import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('f7'); const w=st().woC; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const status=async()=>((await body()).match(/S10043-\d+ (\w+( \w+)?)/)||[])[1];
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Mark Reviewed'}).click(); await page.waitForTimeout(3000); log('MR IN',await inputs(page,'.q-dialog'));
 await page.locator('.q-dialog').getByLabel(/VIN/).fill('1FVACWDT1BDAZ0001'); await page.waitForTimeout(800); await page.locator('.q-dialog button').filter({hasText:'Confirm Review'}).click(); await page.waitForTimeout(3500); log('after CR',await notes(page),await menu(page));
 await page.reload(); await page.waitForTimeout(6000); log('STATUS',await status());
 await page.locator('.q-tab').filter({hasText:'Finance'}).first().click(); await page.waitForTimeout(5000); const ci=page.getByRole('button',{name:/Create Invoice/i}).first(); log('CI disabled',await ci.getAttribute('aria-disabled'));
 await ci.click(); await page.waitForTimeout(4000); log('CI DLG',await menu(page), await notes(page)); log('CI btns',await btns(page,'.q-dialog')); log('CI IN',await inputs(page,'.q-dialog').catch(()=>[])); await dump('F7-create-invoice');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F7-err');}
await b.browser.close();
