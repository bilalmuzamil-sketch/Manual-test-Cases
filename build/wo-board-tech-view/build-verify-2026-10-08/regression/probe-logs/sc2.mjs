import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc2'); const b=await start('/schedule','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1800,height:1100}); await page.waitForTimeout(3000);
 log('BTNS',(await btns(page)).slice(8,30));
 for(const sel of ['button:has-text("tune")','button:has-text("space_dashboard")','button:has-text("filter_list")']){ const x=page.locator(sel).first(); if(await x.count()){ await x.click(); await page.waitForTimeout(1500); log(sel,await menu(page)); await page.screenshot({path:OUT+'SC2-'+sel.replace(/\W/g,'')+'.png'}); await esc(); } }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
