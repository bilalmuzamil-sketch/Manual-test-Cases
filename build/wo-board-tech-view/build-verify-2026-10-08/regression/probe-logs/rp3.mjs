import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('rp3'); const b=await start('/reports','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const fb=(lab)=>page.locator('.q-btn,button').filter({hasText:new RegExp(lab+'(:|\\s|keyboard)')}).first();
const state=()=>page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return 'nomenu'; const sa=m.querySelector('.filter-panel__select-all [role=checkbox]'); const opts=[...m.querySelectorAll('.filter-panel__list [role=checkbox],.filter-panel__list [role=radio]')].map(e=>e.getAttribute('aria-label')+':'+e.getAttribute('aria-checked')); const bt=[...m.querySelectorAll('button')].map(e=>e.innerText.trim()); return 'SA='+(sa?sa.getAttribute('aria-label')+':'+sa.getAttribute('aria-checked'):'none')+' | n='+opts.length+' | '+opts.slice(0,4).join(', ')+' | btns='+bt.join(',')+' | text='+m.innerText.replace(/\s+/g,' ').slice(0,160);});
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 for(const [r,f] of [['Work In Progress','Location'],['Technician Utilization','Technician'],['Sales By Customer','Customer'],['Sales By Representative','Location'],['Parts Velocity','Vendor'],['Inventory Value','Category']]){
  await page.getByText(r,{exact:true}).first().click(); await page.waitForTimeout(6000);
  await fb(f).click(); await page.waitForTimeout(1500); log(r,f,'OPEN',await state()); await page.screenshot({path:OUT+'RP3-'+r.replace(/\W/g,'')+'-'+f+'.png'}); await esc(); await page.waitForTimeout(800);
 }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('RP3-err');}
await b.browser.close();
