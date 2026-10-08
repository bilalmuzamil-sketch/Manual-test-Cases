import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob50.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
const reassign=async(name)=>{ const more=page.locator('button[aria-label="More actions for S2-13556"]').first(); await more.scrollIntoViewIfNeeded(); await more.click(); await page.waitForTimeout(1200);
 await page.locator('.q-menu .q-item, [role=menuitem]').filter({hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
 const dlg=page.locator('.q-dialog').last(); await dlg.locator('input').first().fill(name.split(' ')[0]); await page.waitForTimeout(1500);
 await dlg.locator('text='+name).first().click(); await page.waitForTimeout(600); await dlg.getByRole('button',{name:'Reassign'}).click(); await page.waitForTimeout(3000); return ov(); };
try{
 await page.setViewportSize({width:2600,height:1000}); await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S2-13556',{delay:40}); await page.waitForTimeout(5000);
 log('TO BRENT', await reassign('Brent Avila'));

}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
