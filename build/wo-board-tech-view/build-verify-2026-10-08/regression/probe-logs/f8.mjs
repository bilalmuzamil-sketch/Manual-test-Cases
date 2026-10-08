import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,B,OUT} from './h.mjs';
const log=L('f8'); const w=st().woC; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const status=async()=>((await body()).match(/S10043-\d+ (\w+( \w+)?)/)||[])[1];
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 log('STATUS0',await status()); log('LEAD0',await leadVal(page)); 
 await page.locator('.q-tab').filter({hasText:'Finance'}).first().click(); await page.waitForTimeout(5000); log('FIN btns',(await btns(page)).slice(18,40));
 let pay=page.getByRole('button',{name:/Payment|Pay/}); log('pay btns',await pay.allInnerTexts());
 if(!(await page.locator('.q-dialog').count())){ if(await pay.count()) { await pay.first().click(); await page.waitForTimeout(3000);} }
 log('DLG',await menu(page));
 await page.locator('.q-dialog').getByLabel('Payment method').click(); await page.waitForTimeout(1500); log('PM opts',(await menu(page)).split('||').slice(1).join('|').slice(0,300)); await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(800);
 await page.locator('.q-dialog button').filter({hasText:'Make Payment'}).click(); await page.waitForTimeout(4000); log('after pay',await notes(page),await menu(page)); await esc();
 await page.reload(); await page.waitForTimeout(6000); log('STATUS1',await status()); await dump('F8-paid');
 const f=page.locator('.q-field').filter({hasText:'Lead Technician'}); log('lead field count',await f.count(), 'disabled', await f.first().getAttribute('class').catch(()=>'-'));
 log('LEAD1',await leadVal(page)); await page.locator('text=Lead Technician').first().click({force:true}).catch(()=>{}); await f.first().click({force:true}).catch(()=>{}); await page.waitForTimeout(1500); log('menu after click',await menu(page)); await page.screenshot({path:OUT+'F8-paid-lead.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F8-err');}
await b.browser.close();
