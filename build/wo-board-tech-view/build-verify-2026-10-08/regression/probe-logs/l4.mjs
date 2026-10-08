import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('l4e'); const S=st(); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const tabSel=()=>page.evaluate(()=>[...document.querySelectorAll('.q-tab--active, [role=tab][aria-selected=true]')].map(e=>e.innerText.trim()).join(','));
const rowOf=(n)=>page.evaluate((n)=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).find(t=>t.includes(n))||'none',n);
const C='ZZAUTOTEST Regression Walk';
const search=async(v)=>{ await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); await page.keyboard.type(v,{delay:30}); await page.waitForTimeout(3500); };
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await search(C);
 // 198 invoiced only + Invoiced Date
 await page.goto(B+'/workorders'); await page.waitForTimeout(6000); await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 await page.locator('.q-btn,.q-chip,button').filter({hasText:/^\s*Status/}).first().click({force:true}); await page.waitForTimeout(1000); log('SMENU',await menu(page)); await page.locator('.q-menu').getByText('Invoiced',{exact:true}).first().click(); await page.waitForTimeout(2000); await esc();
 await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Invoiced Date'}).locator('.q-toggle').first().click(); await page.waitForTimeout(2000); await esc();
 const hs=await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim())); const ii=hs.indexOf('Invoiced Date'); log('HEADS',hs.join('|'));
 log('INV DATES',await page.evaluate((ii)=>[...document.querySelectorAll('tbody tr')].slice(0,15).map(r=>(r.children[2]?.innerText||'').trim()+':'+(r.children[ii]?.innerText||'').trim()+':'+(r.children[1]?.innerText||'').trim()).join(' | '),ii)); log('URL',page.url());
 await page.screenshot({path:OUT+'L4-invoiced-only.png'});
 // restore
 await page.getByRole('button',{name:'Column Selection'}).click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Invoiced Date'}).locator('.q-toggle').first().click(); await page.waitForTimeout(1500); await esc();
 await page.locator('.q-btn,.q-chip,button').filter({hasText:/^\s*Status/}).first().click({force:true}); await page.waitForTimeout(1000); await page.locator('.q-menu').getByText('Clear selection',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(1500); await esc();
 log('RESTORED url',page.url());
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L4-err');}
await b.browser.close();
