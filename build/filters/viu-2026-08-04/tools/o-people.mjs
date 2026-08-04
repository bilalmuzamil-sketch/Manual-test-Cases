import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-people.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
await H.resetFilters(page);
// ---------- CUSTOMER ----------
await T('cust_open',()=>H.openChip(page,'Customer'));
await T('cust_panel',()=>H.panel(page));
await H.shot(page,'cu-01-panel');
await T('cust_panel_html',()=>page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?m.innerHTML.slice(0,3000):null;}));
await T('cust_search_type',async()=>{
  const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  const has=await inp.count();
  if(!has) return {noInput:true};
  const before=await H.panel(page);
  await inp.fill('Lastone'); await page.waitForTimeout(2500);
  const after=await H.panel(page);
  return {placeholder:before.inputs[0]&&before.inputs[0].ph,beforeCount:before.options.length,afterCount:after.options.length,
    afterLabels:after.options.map(o=>o.label).slice(0,12),afterText:after.text.slice(0,300)};});
await H.shot(page,'cu-02-search');
await T('cust_no_results',async()=>{const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  await inp.fill('ZZZQQQNOPE'); await page.waitForTimeout(2500);
  const p=await H.panel(page); return {options:p.options.length,text:p.text.slice(0,300)};});
await H.shot(page,'cu-03-noresults');
await T('cust_select', async()=>{const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  await inp.fill('Lastone'); await page.waitForTimeout(2200);
  const p=await H.panel(page);
  const first=p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${first.testid}"]`).first().click({timeout:15000});
  await page.waitForTimeout(4000);
  return {picked:first,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),
    rows:await H.rows(page),panelOpen:await H.panelOpen(page),panel:await H.panel(page)};});
await H.shot(page,'cu-04-selected');
await T('cust_tag_and_second',async()=>{
  if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  const p1=await H.panel(page);
  const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  let second=null;
  if(await inp.count()){ await inp.fill('Xiriver'); await page.waitForTimeout(2200);
    const p=await H.panel(page); second=p.options[0]; }
  const n=H.listCalls(netlog).length;
  if(second) await page.locator(`[data-test-id="${second.testid}"]`).first().click({timeout:15000});
  await page.waitForTimeout(4000);
  return {panelAfterReopen:p1,second,calls:H.listCalls(netlog).slice(n),url:page.url(),
    chips:await H.chips(page),rows:await H.rows(page),panel:await H.panel(page)};});
await H.shot(page,'cu-05-two');
await T('cust_tags',()=>page.evaluate(()=>{const m=document.querySelector('.q-menu');
  if(!m) return {noMenu:true};
  return {chipsInPanel:[...m.querySelectorAll('.q-chip')].map(c=>({t:c.innerText.trim(),removable:!!c.querySelector('.q-chip__icon--remove,[class*=remove]')})),
   html:m.innerHTML.slice(0,1600)};}));
await T('cust_remove_tag',async()=>{
  if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  const rm=page.locator('.q-menu .q-chip .q-chip__icon--remove').first();
  const cnt=await rm.count();
  if(!cnt) return {noRemoveIcon:true,panel:await H.panel(page)};
  const n=H.listCalls(netlog).length;
  await rm.click({timeout:15000}); await page.waitForTimeout(4000);
  return {calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),panel:await H.panel(page)};});
await H.shot(page,'cu-06-tagremoved');
await T('cust_clear_selection',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  const r=await H.clearSelById(page,'company_id'); return {r,url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.resetFilters(page);
// ---------- LEAD TECHNICIAN ----------
await T('tech_open',()=>H.openChip(page,'Lead Technician'));
await T('tech_panel',()=>H.panel(page));
await H.shot(page,'lt-01-panel');
await T('tech_select',async()=>{const p=await H.panel(page);const o=p.options.find(x=>x.label&&x.label!=='')||p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000}); await page.waitForTimeout(4000);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'lt-02-selected');
await T('tech_search',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Lead Technician');
  const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  if(!await inp.count()) return {noInput:true};
  const b=(await H.panel(page)).options.length;
  await inp.fill('Joel'); await page.waitForTimeout(2200);
  const p=await H.panel(page); return {before:b,after:p.options.length,labels:p.options.map(o=>o.label).slice(0,8),ph:(p.inputs[0]||{}).ph};});
await H.shot(page,'lt-03-search');
await T('tech_clearsel',async()=>{const r=await H.clearSelById(page,'tech_assigned_id');return {r,url:page.url(),chips:await H.chips(page)};});
await H.resetFilters(page);
// ---------- SERVICE ADVISOR ----------
await T('sa_open',()=>H.openChip(page,'Service Advisor'));
await T('sa_panel',()=>H.panel(page));
await H.shot(page,'sa-01-panel');
await T('sa_select',async()=>{const p=await H.panel(page);const o=p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000}); await page.waitForTimeout(4000);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'sa-02-selected');
await T('sa_search',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Service Advisor');
  const inp=page.locator('.q-menu input:not([type=checkbox])').first();
  if(!await inp.count()) return {noInput:true};
  await inp.fill('Bonnie'); await page.waitForTimeout(2200);
  const p=await H.panel(page); return {after:p.options.length,labels:p.options.map(o=>o.label).slice(0,8),ph:(p.inputs[0]||{}).ph};});
await T('sa_clearsel',async()=>{const r=await H.clearSelById(page,'service_advisor_id');return {r,url:page.url()};});
await H.resetFilters(page);
// ---------- ASSET ON SITE ----------
await T('ao_open',()=>H.openChip(page,'Asset on Site'));
await T('ao_panel',()=>H.panel(page));
await H.shot(page,'ao-01-panel');
await T('ao_yes',async()=>{const p=await H.panel(page);const o=p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000}); await page.waitForTimeout(4000);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'ao-02-yes');
await T('ao_no',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Asset on Site');
  const p=await H.panel(page);const o=p.options[1];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000}); await page.waitForTimeout(4000);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
await H.shot(page,'ao-03-no');
await T('ao_clearsel',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Asset on Site');
  const r=await H.clearSelById(page,'vehicleHere');return {r,url:page.url(),chips:await H.chips(page)};});
await H.resetFilters(page);
R.prefs=H.prefCalls(netlog);
R.allNet=netlog.filter(n=>n.phase==='res'&&/sv8785api/.test(n.url)&&!/sentry/.test(n.url)).map(n=>n.status+' '+n.method+' '+decodeURIComponent(n.url.replace(/^https:\/\/[^/]+/,'')).slice(0,240));
S('done');
await browser.close();
