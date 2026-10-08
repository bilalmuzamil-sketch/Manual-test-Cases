import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('w7'); const w=st().woA; const b=await start(w.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+700);};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500); log('L0',await lines());
 // Edit Line on line 1: replace Cal with Ben
 await page.locator('text=ZZAUTOTEST Oil change').first().click(); await page.waitForTimeout(2500); log('EL',await menu(page));
 const chip=page.locator('.q-dialog .q-chip').filter({hasText:'Cal Charlie'}); log('chips',await chip.count()); if(await chip.count()) { await chip.locator('i,button').filter({hasText:'close'}).first().click(); await page.waitForTimeout(800);} 
 const t=page.locator('.q-dialog').getByLabel('Add technician'); await t.click(); await t.pressSequentially('ZZAUTOTEST Ben',{delay:60}); await page.waitForTimeout(2500); await page.locator('.q-menu .q-item').filter({hasText:'ZZAUTOTEST Ben'}).first().click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
 log('EL before save',await menu(page)); await page.locator('.q-dialog button').filter({hasText:'Save & Close'}).click(); await page.waitForTimeout(3500); log('EL after',await notes(page),await menu(page));
 await page.reload(); await page.waitForTimeout(6000); log('L1',await lines());
 // Edit labor on line 2 -> Ana
 const row=page.locator('tr').filter({hasText:'Replace - Drive axle gaskets'}).first(); await row.locator('i:has-text("more_vert")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Edit labor'}).click(); await page.waitForTimeout(2500); log('ELAB',await menu(page));
 const t2=page.locator('.q-dialog').getByLabel(/Technician/i).first(); await t2.click(); await page.waitForTimeout(1000); await page.keyboard.type('ZZAUTOTEST Ana',{delay:60}); await page.waitForTimeout(2500); await page.locator('.q-menu .q-item').filter({hasText:'ZZAUTOTEST Ana'}).first().click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
 log('ELAB before save',await menu(page)); await page.locator('.q-dialog button').filter({hasText:'Save & Close'}).click(); await page.waitForTimeout(3500); log('ELAB after',await notes(page),await menu(page));
 await page.reload(); await page.waitForTimeout(6000); log('L2',await lines()); await dump('W7-after');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('W7-err');}
await b.browser.close();
