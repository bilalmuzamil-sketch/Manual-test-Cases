import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc32.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/administration/staff','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.waitForTimeout(3000); await page.locator('button:has-text("New Staff Member")').first().click(); await page.waitForTimeout(3000);
 const d=page.locator('.q-dialog').last();
 await d.getByLabel('First Name').fill('ZZAUTOTEST Del'); await d.getByLabel('Last Name').fill('Tech'); await d.getByLabel('Email').fill('zzautotest.deltech.1008@example.com');
 await d.getByLabel('Role').click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:/^\s*Technician\s*$/}).first().click(); await page.waitForTimeout(800);
 await d.getByLabel(/Departments/).click(); await page.waitForTimeout(1200); log('DEPTS',(await ov()).split('||').pop().slice(0,200)); await page.locator('.q-menu .q-item').filter({hasText:/Service/}).first().click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
 log('SWITCHES',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog [role=switch],.q-dialog .q-toggle')].map(e=>(e.innerText||'').trim()+':'+e.getAttribute('aria-checked')))));
 await d.getByLabel('Location').click(); await page.waitForTimeout(1200); await page.locator('.q-menu .q-item').filter({hasText:'Staging Heavy Duty - 9919'}).first().click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
 await d.getByText('Time Clock',{exact:true}).first().click(); await page.waitForTimeout(800);
 log('SWITCHES2',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog [role=switch],.q-dialog .q-toggle')].map(e=>(e.innerText||'').trim()+':'+e.getAttribute('aria-checked')))));
 await page.keyboard.press('Escape'); await page.waitForTimeout(600); await d.locator('text=First Name').first().click().catch(()=>{}); await page.waitForTimeout(400);
 log('BEFORE SAVE',(await ov()).slice(0,600));
 await page.locator('.q-dialog button:has-text("Save & Close")').last().click({force:true}); await page.waitForTimeout(5000); log('AFTER SAVE',(await ov()).slice(0,300));
 const sl=await page.evaluate(async()=>{const r=await fetch('https://sv10043api.qa.shopview.com/api/staff?limit=200&search=ZZAUTOTEST%20Del',{credentials:'include',headers:{Accept:'application/json'}});const j=await r.json();return j.data.collection.filter(s=>/ZZAUTOTEST Del/.test(s.first_name)).map(s=>({id:s.id,staff_id:s.staff_id,name:s.first_name+' '+s.last_name,role:s.role_label,active:s.is_active}));});
 log('STAFF',JSON.stringify(sl)); fs.writeFileSync('/tmp/cln/deltech.json',JSON.stringify(sl));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
