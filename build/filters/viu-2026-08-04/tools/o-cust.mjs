import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-cust.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
await H.resetFilters(page);
await T('open',()=>H.openChip(page,'Customer'));
await T('panel0',async()=>{const p=await H.panel(page);return {n:p.options.length,first5:p.options.slice(0,5),tags:p.tags,buttons:p.buttons,inputs:p.inputs};});
await T('typeLastone',async()=>{await page.locator('[data-test-id="filter_search_company_id"]').fill('Lastone');await page.waitForTimeout(2500);
  const p=await H.panel(page);return {n:p.options.length,opts:p.options,text:p.text};});
await T('pick1',async()=>{const p=await H.panel(page);const o=p.options[0];
  const n=H.listCalls(netlog).length;
  await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000});await page.waitForTimeout(4000);
  const p2=await H.panel(page);
  return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),
    rows:await H.rows(page),panelOpen:!!p2,panelAfter:p2?{text:p2.text.slice(0,400),opts:p2.options,tags:p2.tags}:null};});
await H.shot(page,'cx-01-pick1');
await T('pick2',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  const p0=await H.panel(page);
  await page.locator('[data-test-id="filter_search_company_id"]').fill('Xiriver');await page.waitForTimeout(2500);
  const p=await H.panel(page); const o=p.options[0];
  const n=H.listCalls(netlog).length;
  if(o) await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000});
  await page.waitForTimeout(4000);
  const p2=await H.panel(page);
  return {panelOnReopen:{text:p0.text.slice(0,300),tags:p0.tags,opts:p0.options.slice(0,6)},picked:o,
    calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page),
    panelAfter:p2?{text:p2.text.slice(0,400),tags:p2.tags,opts:p2.options.slice(0,6)}:null};});
await H.shot(page,'cx-02-pick2');
await T('panelWithTwoSelected',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  return page.evaluate(()=>{const m=document.querySelector('.q-menu');return m?{html:m.innerHTML.slice(0,2600),text:m.innerText}:null;});});
await H.shot(page,'cx-03-panel2sel');
await T('removeTag',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  const rm=page.locator('.q-menu .q-chip__icon--remove');
  const c=await rm.count();
  if(!c) return {noRemove:true,tags:(await H.panel(page)).tags};
  const n=H.listCalls(netlog).length;
  await rm.first().click({timeout:15000}); await page.waitForTimeout(4000);
  return {calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),
    panel:(async()=>null)(),tags:(await H.panel(page)||{}).tags,rows:await H.rows(page)};});
await H.shot(page,'cx-04-tagremoved');
await T('outsideClickKeepsTags',async()=>{
  if(!await H.panelOpen(page)) await H.openChip(page,'Customer');
  await page.mouse.click(1300,55); await page.waitForTimeout(2000);
  return {panelOpen:await H.panelOpen(page),chips:await H.chips(page),url:page.url()};});
await T('clearSel',async()=>{await H.openChip(page,'Customer');
  const r=await H.clearSelById(page,'company_id');
  return {r,url:page.url(),chips:await H.chips(page),rows:await H.rows(page),panelOpen:await H.panelOpen(page)};});
await H.shot(page,'cx-05-clearsel');
await browser.close(); console.log('DONE');
