import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob41.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
const reassign=async(name)=>{ const more=page.locator('button[aria-label="More actions for S2-14294"]').first(); await more.scrollIntoViewIfNeeded(); await more.click(); await page.waitForTimeout(1200);
 await page.locator('.q-menu .q-item, [role=menuitem]').filter({hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
 const dlg=page.locator('.q-dialog').last(); await dlg.locator('input').first().fill(name.split(' ')[0]); await page.waitForTimeout(1500);
 await dlg.locator('text='+name).first().click(); await page.waitForTimeout(600); await dlg.getByRole('button',{name:'Reassign'}).click(); await page.waitForTimeout(3000); return ov(); };
try{
 await page.getByRole('button',{name:'Tech View'}).first().click(); await page.waitForTimeout(5000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S2-14294',{delay:40}); await page.waitForTimeout(5000);
 log('LEAD NOW', (await page.evaluate(()=>document.body.innerText)).includes('S2-14294'));
 await page.setViewportSize({width:2600,height:1000}); await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(6000);
 const card=page.locator('text=S2-14294').filter({hasNot:page.locator('.global-search__label')}).last();
 const cb=await card.boundingBox(); const ub=await page.locator('text=Drag a work order here to assign it').first().boundingBox();
 log('BOXES',JSON.stringify(cb),JSON.stringify(ub));
 await page.mouse.move(cb.x+10,cb.y+5); await page.mouse.down();
 for(let i=1;i<=25;i++){await page.mouse.move(cb.x+10+(ub.x+40-cb.x-10)*i/25, cb.y+5+(ub.y+10-cb.y-5)*i/25); await page.waitForTimeout(40);}
 await page.mouse.up(); await page.waitForTimeout(3000);
 log('AFTER DRAG',await ov()); await dump('clear-shifts-prompt'); await page.screenshot({path:OUT+'clear-shifts-prompt.png'});
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()))));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
