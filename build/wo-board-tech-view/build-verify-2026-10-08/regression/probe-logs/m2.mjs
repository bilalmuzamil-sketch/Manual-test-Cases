import {start,mk,L,menu,inputs,btns,notes,st,save,leadVal,B,OUT} from './h.mjs';
const log=L('m2'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 await page.locator('.q-btn,.q-chip,button').filter({hasText:/^\s*Status/}).first().click({force:true}); await page.waitForTimeout(1200); await page.locator('.q-menu').getByText('Imported',{exact:true}).first().click(); await page.waitForTimeout(4000); await esc();
 const r=(await body()).match(/S\d+-\d+/g); log('IMPORTED',page.url(),r&&r.slice(0,5),'rows',await page.locator('tbody tr:visible').count());
 if(r&&r.length){ await page.locator('tbody tr').filter({hasText:r[0]}).first().locator('td').nth(2).click(); await page.waitForTimeout(7000); log('IMP url',page.url(),'lead',await leadVal(page),'dropdown',await page.locator('.q-field').filter({hasText:'Lead Technician'}).count()); await page.screenshot({path:OUT+'M2-imported-wo.png'}); await dump('M2-imported-wo'); const t=await body(); log('IMP card',t.slice(t.search(/S\d+-\d+/),t.search(/S\d+-\d+/)+300)); await page.goBack(); await page.waitForTimeout(4000);}
 await page.locator('.q-btn,.q-chip,button').filter({hasText:/^\s*Status/}).first().click({force:true}); await page.waitForTimeout(1000); await page.locator('.q-menu').getByText('Clear selection',{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(1500); await esc(); log('cleared',page.url());
 await page.goto(B+'/dashboard'); await page.waitForTimeout(9000);
 const card=page.locator('.q-card').filter({hasText:'At Risk Customers'}).first(); const col=()=>card.evaluate(c=>[...c.querySelectorAll('tbody tr')].map(r=>r.children[1]?.innerText.trim()).slice(0,6));
 log('ARC before',await col()); const bb=await card.evaluate(c=>{const th=[...c.querySelectorAll('th')].find(e=>e.innerText.includes('Last Work')); const r=th.getBoundingClientRect(); return {x:r.x+20,y:r.y+r.height/2};}); await page.mouse.click(bb.x,bb.y); await page.waitForTimeout(2500); log('ARC sort1',await col()); await page.mouse.click(bb.x,bb.y); await page.waitForTimeout(2500); log('ARC sort2',await col()); log('notes',await notes(page));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('M2-err');}
await b.browser.close();
