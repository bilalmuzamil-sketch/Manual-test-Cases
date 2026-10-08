import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ph3'); const S=st(); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:2600,height:1000}); await page.waitForTimeout(3000);
 await page.getByRole('button',{name:'Board View'}).click(); await page.waitForTimeout(6000);
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type(S.woG.num,{delay:40}); await page.waitForTimeout(5000);
 for(let i=0;i<12;i++){ await page.mouse.move(1300,500); await page.mouse.wheel(4000,0); await page.waitForTimeout(500);} 
 await page.evaluate(()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollWidth>e.clientWidth+100) e.scrollLeft=e.scrollWidth;});}); await page.waitForTimeout(3000);
 const loc=page.locator('text=ZZAUTOTEST Dan Delta'); log('dan count',await loc.count()); const bb=await loc.first().boundingBox().catch(()=>null); log('BB',JSON.stringify(bb));
 log('header html',await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&x.innerText&&x.innerText.trim()==='ZZAUTOTEST Dan Delta'); if(!e) return 'none'; let p=e; for(let k=0;k<3;k++) p=p.parentElement; return p.outerHTML.replace(/\s+/g,' ').slice(0,600);}));
 await page.screenshot({path:OUT+'PH3-board-dan.png'});
 await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(2000);
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PH3-err');}
await b.browser.close();
