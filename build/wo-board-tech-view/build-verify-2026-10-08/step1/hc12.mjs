import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc12.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/imported-work-orders/7327d127-968a-4214-83fd-8da16ac6dafb','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.waitForTimeout(4000); let t=await body(); log('ATTEMPT2 lead?',/lead tech/i.test(t),'| has ZZIMP',t.includes('ZZIMP-1001')); log('PAGE',t.slice(t.indexOf('ZZIMP-1001')-100,t.indexOf('ZZIMP-1001')+700)); await dump('hc-imported-wo-2');
 await go('/workorders',7000);
 await page.locator('button:has-text("Status")').first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu').last().getByText('Clear selection',{exact:true}).first().click(); await page.waitForTimeout(3000); await esc();
 log('STATUS AFTER CLEAR',(await page.locator('button:has-text("Status")').first().innerText()).replace(/\s+/g,' '));
 await page.setViewportSize({width:2600,height:1000});
 await page.getByRole('button',{name:'Board View'}).first().click(); await page.waitForTimeout(6000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('ZZIMP-1001',{delay:30}); await page.waitForTimeout(5000);
 t=await body(); log('BOARD search ZZIMP shows card',t.includes('ZZIMP-1001 ')||(t.match(/ZZIMP-1001/g)||[]).length>1, (t.match(/ZZIMP-1001/g)||[]).length); await dump('hc-board-zzimp');
 await page.locator('button[aria-label="Search"]').last().click().catch(()=>{});
 await page.getByRole('button',{name:'List'}).first().click(); await page.waitForTimeout(3000);
 log('VIEW RESET to List');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
