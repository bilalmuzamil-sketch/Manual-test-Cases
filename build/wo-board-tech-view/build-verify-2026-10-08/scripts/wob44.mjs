import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob44.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
try{
 await page.setViewportSize({width:2600,height:1000}); await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(5000);
 // schedule: open the shift
 await page.setViewportSize({width:1600,height:1000});
 await page.goto('https://sv10043.qa.shopview.com/schedule'); await page.waitForTimeout(8000);
 await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(4000);
 const blocks=page.locator('text=Ros...'); log('blocks',await blocks.count());
 const sb=page.locator('.fc-timeline-event');
 log('shift els',await sb.count());
 const el=sb.first(); await el.click(); await page.waitForTimeout(2000); log('CLICK',await ov()); await page.screenshot({path:OUT+'shift-click.png'});
 await el.click({button:'right'}); await page.waitForTimeout(1500); log('RIGHT',await ov()); await page.screenshot({path:OUT+'shift-right.png'});
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
