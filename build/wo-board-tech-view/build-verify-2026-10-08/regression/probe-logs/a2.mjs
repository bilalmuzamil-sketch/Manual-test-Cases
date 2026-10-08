import {start,mk,L,btns,menu,inputs,B} from './lib2.mjs';
const log=L('a2'); const b=await start('/workorders/31a3135b-b8e4-4aec-87f4-229f6ebf13b7/lines','admin'); const {page}=b; const {dump,esc}=mk(page); page.setDefaultTimeout(10000);
try{
 await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 // Lead technician field
 const f=page.locator('.q-field').filter({hasText:'Lead Technician'}).first(); log('LT field count',await page.locator('.q-field').filter({hasText:'Lead Technician'}).count());
 await f.click(); await page.waitForTimeout(1500); log('LT MENU',await menu(page)); await esc();
 // line row: hover the line row and list icons
 const row=page.locator('tr').filter({hasText:'Replace - Brake pot'}).first(); await row.hover(); await page.waitForTimeout(800);
 log('ROW HTML btns',await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>r.innerText.includes('Replace - Brake pot')).slice(0,1).map(r=>[...r.querySelectorAll('i,button,[role=button]')].map(e=>(e.tagName+':'+(e.getAttribute('aria-label')||'')+':'+e.innerText.trim()).slice(0,50)))));
 const lmv=row.locator('i:has-text("more_vert"), button:has-text("more_vert")').first(); await lmv.click().catch(e=>log('lmv',e.message.slice(0,60))); await page.waitForTimeout(1200); log('LINE MV',await menu(page)); await dump('A2-line-menu'); await esc();
 // click line name
 await page.locator('text=Replace - Brake pot').first().click(); await page.waitForTimeout(2500); log('AFTER NAME CLICK url',page.url()); log('DLG',await menu(page)); log('INPUTS',await inputs(page)); await dump('A2-line-name-click'); await esc();
 // labor row Unassigned click
 const lab=page.locator('tr').filter({hasText:'Labor'}).filter({hasText:'Unassigned'}).first(); await lab.locator('text=Unassigned').first().click().catch(e=>log('lab',e.message.slice(0,60))); await page.waitForTimeout(1500); log('LABOR CLICK',await menu(page)); await dump('A2-labor-click'); await esc();
 // Lines tab header controls (checkbox?)
 log('HEADER', await page.evaluate(()=>{const th=[...document.querySelectorAll('thead tr')][0]; return th? [...th.querySelectorAll('*')].filter(e=>e.children.length===0).map(e=>e.tagName+':'+e.innerText.trim()+':'+(e.getAttribute('aria-label')||'')).slice(0,30):null;}));
 log('CHECKBOXES', await page.locator('.q-checkbox').count());
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
