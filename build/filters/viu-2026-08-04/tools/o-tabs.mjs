import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-tabs.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
const tab=async n=>{await page.locator(`.q-tab:has-text("${n}"), [role=tab]:has-text("${n}")`).first().click({timeout:20000});await page.waitForTimeout(5000);};
await H.resetFilters(page);
// ===== COLLAPSE =====
await T('toggleBtn',()=>page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText));
  if(!b) return {found:false};const r=b.getBoundingClientRect();const i=b.querySelector('i');
  return {found:true,icon:i?i.textContent.trim():null,iconCls:i?i.className:null,iconColor:i?getComputedStyle(i).color:null,
    testid:b.getAttribute('data-test-id'),aria:b.getAttribute('aria-label'),title:b.getAttribute('title'),x:Math.round(r.x),y:Math.round(r.y)};}));
await T('collapse',async()=>{
  const before=await page.evaluate(()=>({chips:document.querySelectorAll('button.filter-chip').length,
    tableTop:(()=>{const t=document.querySelector('thead');return t?Math.round(t.getBoundingClientRect().y):null;})()}));
  await page.locator('button:has-text("filter_list")').first().click({timeout:20000});await page.waitForTimeout(3000);
  const after=await page.evaluate(()=>({chips:document.querySelectorAll('button.filter-chip').length,
    tableTop:(()=>{const t=document.querySelector('thead');return t?Math.round(t.getBoundingClientRect().y):null;})(),
    icon:(()=>{const b=[...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText));const i=b?b.querySelector('i'):null;return i?{t:i.textContent.trim(),color:getComputedStyle(i).color}:null;})()}));
  return {before,after,url:page.url()};});
await H.shot(page,'cl-01-collapsed');
await T('expandAgain',async()=>{await page.locator('button:has-text("filter_list")').first().click({timeout:20000});await page.waitForTimeout(3000);
  return page.evaluate(()=>({chips:document.querySelectorAll('button.filter-chip').length,
    tableTop:(()=>{const t=document.querySelector('thead');return t?Math.round(t.getBoundingClientRect().y):null;})()}));});
await H.shot(page,'cl-02-expanded');
await T('collapseWithActiveFilter',async()=>{
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000});await page.waitForTimeout(4000);
  const rowsBefore=await H.rows(page);
  await page.locator('button:has-text("filter_list")').first().click({timeout:20000});await page.waitForTimeout(3500);
  const st=await page.evaluate(()=>({chips:document.querySelectorAll('button.filter-chip').length,
    icon:(()=>{const b=[...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText));const i=b?b.querySelector('i'):null;
      return i?{t:i.textContent.trim(),color:getComputedStyle(i).color,cls:i.className,btnCls:b.className}:null;})(),
    clearFilters:!!document.querySelector('[data-test-id="clear_filters"]')}));
  const rowsAfter=await H.rows(page);
  return {rowsBefore:{n:rowsBefore.n,st:rowsBefore.statuses},state:st,rowsAfter:{n:rowsAfter.n,st:rowsAfter.statuses},url:page.url()};});
await H.shot(page,'cl-03-collapsed-active');
await T('collapsePersistsAcrossNav',async()=>{
  await page.goto(H.APP+'/customers',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(6000);
  await page.goto(H.APP+'/workorders',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(11000);
  return page.evaluate(()=>({chips:document.querySelectorAll('button.filter-chip').length,url:location.href,
    icon:(()=>{const b=[...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText));const i=b?b.querySelector('i'):null;
      return i?{t:i.textContent.trim(),color:getComputedStyle(i).color}:null;})()}));});
await H.shot(page,'cl-04-after-nav');
await T('expandRestoresActive',async()=>{await page.locator('button:has-text("filter_list")').first().click({timeout:20000});await page.waitForTimeout(3000);
  return {chips:await H.chips(page),url:page.url(),rows:(await H.rows(page)).n};});
await H.shot(page,'cl-05-expanded-active');
// ===== TABS with a Status filter active (S9) =====
await T('tab_estimates',async()=>{await tab('Estimates');
  return {url:page.url(),chips:await H.chips(page),rows:await H.rows(page),
    listCalls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'tb-01-estimates');
await T('tab_completed',async()=>{await tab('Completed');
  return {url:page.url(),chips:await H.chips(page),rows:await H.rows(page),listCalls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'tb-02-completed');
await T('tab_myworkorders',async()=>{await tab('My Work Orders');
  return {url:page.url(),chips:await H.chips(page),rows:await H.rows(page),listCalls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'tb-03-mywo');
await T('tab_back_all',async()=>{await tab('All');
  return {url:page.url(),chips:await H.chips(page),rows:await H.rows(page),listCalls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'tb-04-all-again');
await browser.close();console.log('DONE');
