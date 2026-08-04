import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-p2.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,200)};}S(k);};
await H.resetFilters(page);
for(const [nm,fld,short] of [['Lead Technician','tech_assigned_id','lt'],['Service Advisor','service_advisor_id','sa'],['Asset on Site','vehicleHere','ao']]){
  await T(short+'_panel',async()=>{await H.openChip(page,nm);const p=await H.panel(page);
    return {n:p.options.length,opts:p.options.slice(0,14),inputs:p.inputs,buttons:p.buttons.map(b=>[b.t,b.testid]),text:p.text.slice(0,400),tags:p.tags};});
  await H.shot(page,short+'-P-panel');
  await T(short+'_select',async()=>{if(!await H.panelOpen(page)) await H.openChip(page,nm);
    const p=await H.panel(page);
    const o=p.options.find(x=>x.label && x.label.replace(/\ncheck/,'').trim().length>0);
    if(!o) return {noOptions:true,panel:p};
    const n=H.listCalls(netlog).length;
    await page.locator(`[data-test-id="${o.testid}"]`).first().click({timeout:15000});await page.waitForTimeout(4000);
    return {picked:o,calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),
      rows:await H.rows(page),panelOpen:await H.panelOpen(page)};});
  await H.shot(page,short+'-P-sel');
  await T(short+'_reopenMarks',async()=>{await H.openChip(page,nm);const p=await H.panel(page);
    return {opts:p.options.slice(0,14),tags:p.tags,text:p.text.slice(0,350)};});
  await H.shot(page,short+'-P-marks');
  if(short!=='ao') await T(short+'_search',async()=>{
    if(!await H.panelOpen(page)) await H.openChip(page,nm);
    const q=short==='lt'?'Joel':'Bonnie';
    await page.locator(`[data-test-id="filter_search_${fld}"]`).fill(q);await page.waitForTimeout(2500);
    const p=await H.panel(page);
    const r1={q,n:p.options.length,labels:p.options.map(o=>o.label)};
    await page.locator(`[data-test-id="filter_search_${fld}"]`).fill('ZZQQNOPE');await page.waitForTimeout(2500);
    const p2=await H.panel(page);
    return {...r1,noResText:p2.text.slice(0,200),noResN:p2.options.length};});
  await T(short+'_multi',async()=>{
    if(!await H.panelOpen(page)) await H.openChip(page,nm);
    if(short!=='ao') await page.locator(`[data-test-id="filter_search_${fld}"]`).fill('');
    await page.waitForTimeout(1800);
    const p=await H.panel(page);
    const unsel=p.options.filter(o=>!/check$/.test(o.label)&&o.label.trim());
    if(unsel.length<1) return {noSecond:true};
    const n=H.listCalls(netlog).length;
    await page.locator(`[data-test-id="${unsel[0].testid}"]`).first().click({timeout:15000});await page.waitForTimeout(4000);
    return {second:unsel[0],calls:H.listCalls(netlog).slice(n),url:page.url(),chips:await H.chips(page),rows:await H.rows(page)};});
  await H.shot(page,short+'-P-multi');
  await T(short+'_outsideClose',async()=>{await H.openChip(page,nm);
    await page.mouse.click(1300,55);await page.waitForTimeout(2000);
    return {panelOpen:await H.panelOpen(page),chips:await H.chips(page),url:page.url()};});
  await T(short+'_clearsel',async()=>{await H.openChip(page,nm);
    const r=await H.clearSelById(page,fld);
    return {r,url:page.url(),chips:await H.chips(page),rows:await H.rows(page),panelOpen:await H.panelOpen(page)};});
  await H.shot(page,short+'-P-clear');
  await H.resetFilters(page);
}
await browser.close(); console.log('DONE');
