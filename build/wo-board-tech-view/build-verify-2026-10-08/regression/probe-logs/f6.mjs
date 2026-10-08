import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('f6'); const w=st().woC; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const status=async()=>((await body()).match(/S10043-\d+ (\w+( \w+)?)/)||[])[1];
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:/^Complete$/}).first().click(); await page.waitForTimeout(2500);
 await page.locator('.q-dialog textarea').first().fill('ZZAUTOTEST done'); await page.locator('.q-dialog').getByText(/Missing Details/).click(); await page.waitForTimeout(1500);
 await page.locator('.q-dialog').getByLabel('Mileage').fill('120600'); await page.locator('.q-dialog button').filter({hasText:'Complete All Lines'}).click(); await page.waitForTimeout(4000); log('after CAL',await notes(page),await menu(page));
 await page.reload(); await page.waitForTimeout(6000); log('STATUS',await status()); await dump('F6-after-complete'); log('BTNS',(await btns(page)).slice(10,30));
 // look for status changers
 for(const lab of ['Review','Ready for Review','Send to Review','Mark as Reviewed']){ const x=page.getByRole('button',{name:new RegExp(lab,'i')}); if(await x.count()) log('FOUND',lab,await x.allInnerTexts()); }
 const badge=page.locator('text=/^(Complete|Approved|In Progress)$/').first(); await badge.click().catch(()=>{}); await page.waitForTimeout(1500); log('BADGE MENU',await menu(page));
 await page.getByText('Finance',{exact:true}).first().click(); await page.waitForTimeout(4000); const ci=page.getByRole('button',{name:/Create Invoice/i}).first(); log('CI disabled',await ci.getAttribute('aria-disabled'), await tip(ci));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('F6-err');}
await b.browser.close();
