import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob47.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
const WO='S2-13556';
try{
 await page.getByRole('button',{name:'Tech View'}).first().click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(WO,{delay:40}); await page.waitForTimeout(5000);
 await page.locator(`button[aria-label="More actions for ${WO}"]`).first().click(); await page.waitForTimeout(1200);
 await page.locator('.q-menu .q-item, [role=menuitem]').filter({hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
 const o=await ov(); log('DLG CURRENT', (o.match(/[A-Z]{1,2} [A-Z][a-z]+ [A-Z][a-z]+ Current|Unassigned Current/)||['?'])[0]);
 const dlg=page.locator('.q-dialog').last(); await dlg.locator('input').first().fill('Brent'); await page.waitForTimeout(1500);
 await dlg.locator('text=Brent Avila').first().click(); await page.waitForTimeout(600); await dlg.getByRole('button',{name:'Reassign'}).click(); await page.waitForTimeout(3000);
 log('TO BRENT',await ov());
 await page.goto('https://sv10043.qa.shopview.com/schedule'); await page.waitForTimeout(8000);
 await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(6000);
 const cb=await page.locator('text='+WO).first().boundingBox(); const rb=await page.locator('text=Brent Avila').last().boundingBox(); const h=await page.locator('text="9 AM"').first().boundingBox();
 log('BOX',JSON.stringify(cb),JSON.stringify(rb));
 const tx=h.x+20, ty=rb.y+10;
 await page.mouse.move(cb.x+20,cb.y+8); await page.mouse.down();
 for(let i=1;i<=20;i++){await page.mouse.move(cb.x+20+(tx-cb.x-20)*i/20, cb.y+8+(ty-cb.y-8)*i/20); await page.waitForTimeout(40);}
 await page.mouse.up(); await page.waitForTimeout(3000);
 log('PICKER',await ov()); await page.screenshot({path:OUT+'schedule-picker.png'}); await dump('schedule-picker');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
