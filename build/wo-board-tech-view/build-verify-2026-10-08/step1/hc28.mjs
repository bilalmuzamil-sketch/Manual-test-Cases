import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc28.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,body}=mk(page); page.setDefaultTimeout(15000);
const openCols=async()=>{await page.locator('button[aria-label="Column Selection"]').first().click(); await page.waitForTimeout(1500);};
const state=async()=>JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.replace(/\s+/g,' ').trim()+':'+(i.querySelector('[aria-checked]')?.getAttribute('aria-checked')))));
const flip=async(name)=>{ const it=page.locator('.q-menu .q-item').filter({hasText:new RegExp('^\\s*'+name+'\\s*$')}).first(); const sw=it.locator('[aria-checked], .q-toggle').first(); await sw.click(); await page.waitForTimeout(1500); };
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500);
 await openCols(); log('BEFORE',await state()); await flip('Parts'); await flip('Returns'); log('ON',await state()); await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
 const hdr=await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\s+/g,' ').replace('arrow_drop_up','').trim()));
 const cells=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')].find(r=>r.innerText.includes('S10043-17594'));return r?[...r.cells].map(c=>c.innerText.replace(/\s+/g,' ').trim()):null;});
 log('HDR',JSON.stringify(hdr)); log('CELLS',JSON.stringify(cells)); await dump('hc-list-parts-returns2');
 await openCols(); await flip('Parts'); await flip('Returns'); log('RESTORED',await state()); await page.keyboard.press('Escape');
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
