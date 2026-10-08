import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc25.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 log('ARIA near parts',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,[role=button],i')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').trim().slice(0,20)).filter(x=>/return|receiv|part|undo|keyboard_return|assignment_return/i.test(x)))));
 const menus=page.locator('button[aria-label="Part context menu"]'); log('menus',await menus.count());
 await menus.last().click(); await page.waitForTimeout(1500); log('MENU part1',await ov()); await dump('hc-wo-part1-menu'); await esc();
 await menus.first().click(); await page.waitForTimeout(1500); log('MENU part2',await ov()); await esc();
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
