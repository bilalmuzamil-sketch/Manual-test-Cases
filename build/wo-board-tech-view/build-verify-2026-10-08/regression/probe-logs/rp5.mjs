import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('rp5'); const b=await start('/reports','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const fb=(lab)=>page.locator('.q-btn,button').filter({hasText:new RegExp(lab+'(:|\\s|keyboard)')}).first();
const lbl=async(f)=>(await fb(f).innerText()).replace(/\s+/g,' ');
const rep=async()=>{const t=await page.evaluate(()=>document.querySelector('main')?.innerText.replace(/\s+/g,' ')||''); return 'rows='+(await page.locator('tbody tr:visible').count())+' '+(t.match(/Total[^A-Za-z]{0,30}/g)||[]).slice(-1).join('');};
const opt=(name)=>page.locator('.q-menu .filter-panel__list [role=checkbox]').filter({has:page.locator('xpath=.')}).and(page.locator(`[aria-label="${name}"]`));
async function persist(r,f,how){
 await page.getByText(r,{exact:true}).first().click(); await page.waitForTimeout(6000); log(r,'START',await lbl(f),await rep());
 await fb(f).click(); await page.waitForTimeout(1500);
 if(how==='restoreLoc'){} 
 const o=page.locator('.q-menu .filter-panel__list [role=checkbox]'); const sa=page.locator('.q-menu .filter-panel__select-all [role=checkbox]');
 if(how==='loc'){ // restore to 9919 only then add Lethbridge for the test
   const st=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .filter-panel__list [role=checkbox]')].map(e=>e.getAttribute('aria-checked'))); if(st[0]!=='true') await o.nth(0).click(); await page.waitForTimeout(1500); if(st[1]==='true') { await o.nth(1).click(); await page.waitForTimeout(1500);} await esc(); await page.waitForTimeout(2500); log(r,'RESTORED',await lbl(f),await rep()); await fb(f).click(); await page.waitForTimeout(1500); await o.nth(1).click(); }
 else if(how==='tech'){ const s=await sa.getAttribute('aria-checked'); if(s!=='true'){ await sa.click(); await page.waitForTimeout(1500);} await esc(); await page.waitForTimeout(2500); log(r,'RESTORED',await lbl(f),await rep()); await fb(f).click(); await page.waitForTimeout(1500); await o.nth(0).click(); }
 else { const s=await sa.getAttribute('aria-checked'); if(s!=='true'){ await sa.click(); await page.waitForTimeout(1500);} await esc(); await page.waitForTimeout(2500); log(r,'RESTORED',await lbl(f),await rep()); await fb(f).click(); await page.waitForTimeout(1500); await o.nth(0).click(); }
 await page.waitForTimeout(2000); await esc(); await page.waitForTimeout(3000); const b1=await lbl(f), r1=await rep(); log(r,'CHANGED',b1,r1,'url',page.url());
 await page.reload(); await page.waitForTimeout(8000); log(r,'RELOAD',await lbl(f),await rep(),'url',page.url(),'notes',await notes(page)); await dump('RP5-'+r.replace(/\W/g,''));
 // restore
 await fb(f).click(); await page.waitForTimeout(1500);
 if(how==='loc'){ await o.nth(1).click(); } else { await sa.click(); await page.waitForTimeout(1200); if(how!=='tech'){ const s=await sa.getAttribute('aria-checked'); if(s!=='true') await sa.click(); } else { const s=await sa.getAttribute('aria-checked'); if(s!=='true') await sa.click(); } }
 await page.waitForTimeout(2000); await esc(); await page.waitForTimeout(2500); log(r,'FINAL',await lbl(f));
}
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await persist('Work In Progress','Location','loc');
 await persist('Sales By Representative','Location','loc');
 await persist('Technician Utilization','Technician','tech');
 await persist('Sales By Customer','Customer','all');
 await persist('Parts Velocity','Vendor','all');
 await persist('Inventory Value','Category','all');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('RP5-err');}
await b.browser.close();
