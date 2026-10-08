import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob38.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
try{
 await page.getByRole('button',{name:'Tech View'}).first().click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S2-14294',{delay:40}); await page.waitForTimeout(5000);
 const more=page.locator('button[aria-label="More actions for S2-14294"]').first();
 await dump('tech-search-s2-14294'); log('more count',await page.locator('button[aria-label="More actions for S2-14294"]').count());
 const card=page.locator('button[aria-label="More actions for S2-14294"]').first(); await card.scrollIntoViewIfNeeded().catch(()=>{}); await page.waitForTimeout(800);
 await more.click(); await page.waitForTimeout(1500); log('MENU',await ov());
 await page.locator('.q-menu .q-item, [role=menuitem]').filter({hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2500);
 log('DLG',(await ov()).slice(0,700));
 const dlg=page.locator('.q-dialog').last();
 await dlg.locator('input').first().fill('Brent'); await page.waitForTimeout(1500);
 await dlg.locator('text=Brent Avila').first().click(); await page.waitForTimeout(800);
 await dlg.getByRole('button',{name:'Reassign'}).click(); await page.waitForTimeout(3000);
 log('PROMPT',await ov()); await dump('clear-shifts-prompt');
 log('PROMPT BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()))));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
