import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-fin.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
const A=await H.open(); const {page,netlog}=A;
await H.resetFilters(page);
await T('custPanelFocus',async()=>{await H.openChip(page,'Customer');
  return page.evaluate(()=>{const i=document.querySelector('[data-test-id="filter_search_company_id"]');
    return {focused:document.activeElement===i,ph:i?i.placeholder:null,active:document.activeElement?document.activeElement.tagName+'.'+(document.activeElement.className||'').slice(0,40):null};});});
await T('importedUntick',async()=>{
  await H.closePanel(page); await H.resetFilters(page);
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:20000});await page.waitForTimeout(4000);
  const on={chips:await H.chips(page),url:page.url()};
  await H.openChip(page,'Status');
  const n=H.listCalls(netlog).length;
  await page.locator('[data-test-id="filter_option_status_imported"]').first().click({timeout:20000});await page.waitForTimeout(4500);
  return {withImported:on,after:{chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n,calls:H.listCalls(netlog).slice(n)}};});
await H.shot(page,'fn-01-imported-untick');
await T('sevenValuesChipFormat',async()=>{
  await H.resetFilters(page);
  for(const s of ['estimate','approved','in_progress','ready_for_review','complete']){
    await H.openChip(page,'Status');
    await page.locator(`[data-test-id="filter_option_status_${s}"]`).first().click({timeout:20000});
    await page.waitForTimeout(2200);}
  return {chips:await H.chips(page),url:page.url()};});
await H.shot(page,'fn-02-five-values');
await T('clearFiltersClearsAll',async()=>{
  await H.openChip(page,'Customer');
  await page.locator('[data-test-id="filter_search_company_id"]').fill('Lastone Construction');await page.waitForTimeout(2200);
  const p=await H.panel(page); if(p.options[0]) await page.locator(`[data-test-id="${p.options[0].testid}"]`).first().click({timeout:15000});
  await page.waitForTimeout(3500);
  const before={chips:await H.chips(page),url:page.url()};
  const ok=await H.resetFilters(page);
  return {before,ok,after:{chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n,
    clearBtn:await page.evaluate(()=>!!document.querySelector('[data-test-id="clear_filters"]'))}};});
await H.shot(page,'fn-03-clear-all');
await T('emptyStateClearLink',async()=>{
  await page.goto(H.APP+'/workorders?status=declined&company_id=54d98c61-217d-44ad-89bb-79005c902fff&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const st={rows:(await H.rows(page)).n,msg:await page.evaluate(()=>{const m=document.body.innerText.match(/No work orders[^\n]*/);return m?m[0]:null;}),
    links:await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})))};
  await page.locator('[data-test-id="empty_state_clear_filters"]').first().click({timeout:20000});await page.waitForTimeout(4500);
  return {...st,after:{chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n}};});
await H.shot(page,'fn-04-empty-clear');
await T('perUserIsolation',async()=>{
  // find a second staff and impersonate; read their saved page prefs
  const s=await H.api('GET','/api/staff?limit=200');
  const list=(s.body&&s.body.data&&(s.body.data.collection||s.body.data))||[];
  const me=(await H.api('GET','/api/iam/view-profile/')).body;
  const other=(Array.isArray(list)?list:[]).find(x=>x.id&&x.email&&!/^admin/i.test(x.email||''));
  if(!other) return {noOther:true,sample:(Array.isArray(list)?list.slice(0,2):list)};
  const sw=await H.api('POST','/api/switch-user',{user_id:other.user_id||other.id});
  const pr=await H.api('GET','/api/users/me/preferences/work-orders-list');
  return {other:{id:other.id,user_id:other.user_id,email:other.email,role:other.role_label},
    switchStatus:sw.status,prefStatus:pr.status,pref:JSON.stringify(pr.body).slice(0,500)};});
await A.browser.close(); console.log('DONE');
