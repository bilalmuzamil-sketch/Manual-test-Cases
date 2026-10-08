import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('rp4'); const b=await start('/reports','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const fb=(lab)=>page.locator('.q-btn,button').filter({hasText:new RegExp(lab+'(:|\\s|keyboard)')}).first();
const state=()=>page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return 'nomenu'; const sa=m.querySelector('.filter-panel__select-all [role=checkbox]'); const opts=[...m.querySelectorAll('.filter-panel__list [role=checkbox]')].map(e=>e.getAttribute('aria-checked')); const cnt={}; opts.forEach(o=>cnt[o]=(cnt[o]||0)+1); return 'SA='+(sa?sa.getAttribute('aria-checked'):'none')+' opts='+JSON.stringify(cnt)+' first2='+opts.slice(0,2).join(',')+' txt='+(m.querySelector('.filter-panel__all-implied')?.innerText||'')+(m.innerText.match(/\d+ selected/)||[''])[0];});
const rep=async()=>{const t=await page.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ')||''); return (t.match(/Total[^A-Za-z]{0,40}/g)||[]).slice(0,2).join('|')+' rows='+(await page.locator('tbody tr:visible').count());};
async function seq(r,f,style){
 await page.getByText(r,{exact:true}).first().click(); await page.waitForTimeout(6000);
 await fb(f).click(); await page.waitForTimeout(1500); const o=page.locator('.q-menu .filter-panel__list [role=checkbox]'); const sa=page.locator('.q-menu .filter-panel__select-all [role=checkbox]');
 log(r,'S0',await state(),await rep());
 const target=style===1? o.nth(0) : o.nth(0);
 await target.click(); await page.waitForTimeout(2500); log(r,'S4 click opt1',await state(),await rep());
 await target.click(); await page.waitForTimeout(2500); log(r,'S5 click opt1 again',await state(),await rep());
 await sa.click(); await page.waitForTimeout(2500); log(r,'S6 select-all',await state(),await rep());
 const cl=page.locator('.q-menu button').filter({hasText:'Clear selection'}); if(await cl.count()){ await cl.click(); await page.waitForTimeout(2500); log(r,'S7 clear',await state(),await rep()); } else { await sa.click(); await page.waitForTimeout(2500); log(r,'S7 no Clear button; select-all clicked again',await state(),await rep()); }
 await page.screenshot({path:OUT+'RP4-'+r.replace(/\W/g,'')+'.png'}); await esc(); await page.waitForTimeout(1500); log(r,'closed btn',(await fb(f).innerText()).replace(/\s+/g,' '),await notes(page));
}
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 for(const [r,f,s] of [['Work In Progress','Location',1],['Technician Utilization','Technician',1],['Sales By Representative','Location',1],['Sales By Customer','Customer',2],['Parts Velocity','Vendor',2],['Inventory Value','Category',2]]) await seq(r,f,s);
}catch(e){log('ERR',e.message.slice(0,300)); await dump('RP4-err');}
await b.browser.close();
