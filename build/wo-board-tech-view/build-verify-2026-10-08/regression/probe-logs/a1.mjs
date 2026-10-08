import {start,mk,L,btns,menu,inputs,B} from './lib2.mjs';
const log=L('a1'); const b=await start('/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines','admin'); const {page}=b; const {dump,esc}=mk(page); page.setDefaultTimeout(12000);
try{
 await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const t=await dump('A1-wo-page'); log('PAGE',t.slice(0,1500));
 log('BTNS',await btns(page));
 // all more_vert buttons
 const mv=page.locator('button:has-text("more_vert")'); const n=await mv.count(); log('MOREVERT count',n);
 for(let i=0;i<n;i++){ const bb=await mv.nth(i).boundingBox().catch(()=>null); await mv.nth(i).click().catch(e=>log('mv',i,e.message.slice(0,60))); await page.waitForTimeout(1200); log('MV',i,JSON.stringify(bb),await menu(page)); await esc(); }
 // lead tech dropdown
 const lt=page.locator('text=Lead Technician').first(); await lt.click().catch(e=>log('lt',e.message.slice(0,80))); await page.waitForTimeout(1500); log('LT MENU',await menu(page)); await esc();
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
