import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  // toolbar icons + tooltips
  const icons=page.locator('main i, .q-page i').filter({hasText:/^(view_list|person|view_kanban|format_line_spacing|width_normal|tune|view_column|settings)$/});
  const n=await icons.count(); log('toolbar icons',n);
  for(let i=0;i<n;i++){ const ic=icons.nth(i); const name=await ic.innerText(); const btn=ic.locator('xpath=ancestor::button[1]'); const aria=await btn.getAttribute('aria-label').catch(()=>null); log('icon',i,name,'aria:',aria,'tooltip:',await tip(btn.count()?btn:ic)); }
  await dump('wo-list-default');
  // click each display
  for(const nm of ['view_list','person','view_kanban']){
    const ic=page.locator('i').filter({hasText:new RegExp('^'+nm+'$')}).first(); await ic.click({force:true}).catch(e=>log('click',nm,e.message.slice(0,50))); await page.waitForTimeout(4000);
    const t=await dump('display-'+nm); log('DISPLAY',nm,'url',page.url(),'::',t.slice(t.indexOf('Create Work Order')-300,t.indexOf('Create Work Order')+900));
  }
  // density + fields
  for(const nm of ['format_line_spacing','width_normal']){
    const ic=page.locator('i').filter({hasText:new RegExp('^'+nm+'$')}).first(); await ic.click({force:true}).catch(()=>{}); await page.waitForTimeout(2000); log('MENU',nm,':',await ov()); await dump('menu-'+nm); await esc();
  }
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
