import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc13.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {body}=mk(page); page.setDefaultTimeout(15000);
try{ const s=page.locator('input[placeholder*="Search"]').filter({hasNot:page.locator('xx')}); 
 log('BEFORE',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button[aria-label]')].filter(b=>/^(List|Tech View|Board View)$/.test(b.getAttribute('aria-label'))).map(b=>b.getAttribute('aria-label')+':'+(b.getAttribute('aria-pressed')||b.className.includes('active')||b.getAttribute('filled'))))));
 await page.locator('button[aria-label="List"]').first().click({force:true}); await page.waitForTimeout(3000);
 const t=await body(); log('AFTER has Number column',t.includes('Number'), 'search leftover', /ZZIMP-1001/.test(t));
 if(/ZZIMP-1001/.test(t)){ await page.locator('button:has-text("cancel"), button[aria-label*="Clear"]').first().click().catch(()=>{}); await page.waitForTimeout(2000);}
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
