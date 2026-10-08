import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob48.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
const WO='S2-13556';
try{
 await page.goto('https://sv10043.qa.shopview.com/schedule'); await page.waitForTimeout(8000);
 await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(6000);
 const cb=await page.locator('text='+WO).first().boundingBox(); const rb=await page.locator('text=Brent Avila').last().boundingBox(); const h=await page.locator('text="9 AM"').first().boundingBox();
 log('BOX',JSON.stringify(cb),JSON.stringify(rb));
 const tx=h.x+20, ty=rb.y+10;
 await page.mouse.move(cb.x+20,cb.y+8); await page.mouse.down();
 for(let i=1;i<=20;i++){await page.mouse.move(cb.x+20+(tx-cb.x-20)*i/20, cb.y+8+(ty-cb.y-8)*i/20); await page.waitForTimeout(40);}
 await page.mouse.up(); await page.waitForTimeout(3000);
 log('PICKER',await ov());
 const pk=page.locator('.q-dialog, .q-menu').last();
 await page.locator('text=Entire work order').last().click().catch(e=>log('ewo',e.message.slice(0,60))); await page.waitForTimeout(800);
 await page.locator('button:has-text("Create 1 shift")').last().click(); await page.waitForTimeout(3000); log('CREATED',await ov());
 await page.goto('https://sv10043.qa.shopview.com/workorders'); await page.waitForTimeout(7000);
 await page.getByRole('button',{name:'Tech View'}).first().click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(WO,{delay:40}); await page.waitForTimeout(5000);
 await page.locator(`button[aria-label="More actions for ${WO}"]`).first().click(); await page.waitForTimeout(1200);
 await page.locator('.q-menu .q-item, [role=menuitem]').filter({hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
 const dlg=page.locator('.q-dialog').last(); await dlg.locator('input').first().fill('Bilal'); await page.waitForTimeout(1500);
 await dlg.locator('text=Bilal Muzamil').first().click(); await page.waitForTimeout(600); await dlg.getByRole('button',{name:'Reassign'}).click(); await page.waitForTimeout(3000);
 log('PROMPT',await ov()); await page.screenshot({path:OUT+'clear-shifts-prompt.png'}); await dump('clear-shifts-prompt');
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()))));
 const cancel=page.locator('.q-dialog button').filter({hasText:/^Cancel$/}).last(); if(await cancel.count()){await cancel.click(); await page.waitForTimeout(2500); log('AFTER CANCEL',await ov());}

}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
