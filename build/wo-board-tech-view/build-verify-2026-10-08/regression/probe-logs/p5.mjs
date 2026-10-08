import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('p5'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const cards=()=>page.evaluate(()=>[...new Set((document.body.innerText.match(/S\d+-\d+/g)||[]))]);
try{ await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(7000);
 log('BTNS',(await btns(page)).slice(0,30)); await dump('P5-phone-list'); await page.screenshot({path:OUT+'P5-phone-list.png'});
 const sb=page.locator('button').filter({hasText:/sort|Sort/}).first(); log('sort count',await page.locator('button').filter({hasText:/sort|Sort/}).count());
 if(await sb.count()){ await sb.click(); await page.waitForTimeout(1500); log('SORT MENU',await menu(page)); await page.screenshot({path:OUT+'P5-sort-menu.png'}); const o=page.locator('.q-menu,.q-dialog').getByText(/Customer A/).first(); if(await o.count()){ await o.click(); await page.waitForTimeout(3000);} await esc(); }
 const c1=(await body()).match(/S\d+-\d+ [^S]{0,60}/g)?.slice(0,6); log('AFTER SORT cards',c1);
 await page.reload(); await page.waitForTimeout(8000); log('RELOAD sort btn',(await btns(page)).filter(x=>/sort|Sort|A-Z|Z-A/.test(x))); log('RELOAD cards',(await body()).match(/S\d+-\d+ [^S]{0,60}/g)?.slice(0,6)); await page.screenshot({path:OUT+'P5-after-reload.png'});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('P5-err');}
await b.browser.close();
