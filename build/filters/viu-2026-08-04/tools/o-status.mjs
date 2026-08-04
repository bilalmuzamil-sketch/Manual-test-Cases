import * as H from './h.mjs';
import fs from 'fs';
const {browser,page,netlog}=await H.open();
const R={};
const step=async(name,fn)=>{try{R[name]=await fn();}catch(e){R[name]={ERROR:e.message.slice(0,300)};}
  fs.writeFileSync('/tmp/fviu/o-status.json',JSON.stringify(R,null,1));console.log('..'+name);};
await step('chipsInitial',()=>H.chips(page));
await step('rowsInitial',()=>H.rows(page));
R.urlInitial=page.url();
await step('openStatus',async()=>{await page.locator(H.chipSel('Status')).first().click();await page.waitForTimeout(2000);return H.panel(page);});
await H.shot(page,'st-01-panel');
let n=H.listCalls(netlog).length;
await step('tickEstimate',async()=>{const c=await H.tick(page,'filter_option_status_estimate','Status');
  return {c,calls:H.listCalls(netlog).slice(n),panelStillOpen:!!(await H.panel(page)),panel:await H.panel(page),rows:await H.rows(page),chips:await H.chips(page),url:page.url()};});
await H.shot(page,'st-02-estimate');
n=H.listCalls(netlog).length;
await step('tickApproved',async()=>{const c=await H.tick(page,'filter_option_status_approved','Status');
  return {c,calls:H.listCalls(netlog).slice(n),rows:await H.rows(page),chips:await H.chips(page),url:page.url(),panel:await H.panel(page)};});
await H.shot(page,'st-03-two');
await step('clearFiltersCtl',()=>page.evaluate(()=>[...document.querySelectorAll('button,a,span,div')].filter(e=>/^clear filters$/i.test((e.innerText||'').trim())).map(e=>({tag:e.tagName,cls:e.className.toString().slice(0,80),testid:e.getAttribute('data-test-id'),vis:e.offsetParent!==null})).slice(0,5)));
n=H.listCalls(netlog).length;
await step('clearSelection',async()=>{const ok=await H.clearSel(page);
  return {ok,calls:H.listCalls(netlog).slice(n),rows:await H.rows(page),panel:await H.panel(page),chips:await H.chips(page),url:page.url()};});
await H.shot(page,'st-04-cleared');
await step('pageStateAfterClear',()=>page.evaluate(()=>({url:location.href,chipCount:document.querySelectorAll('button.filter-chip').length,
  chipTexts:[...document.querySelectorAll('button.filter-chip')].map(b=>b.innerText.trim().replace(/\n/g,'|')),
  bodyTop:document.body.innerText.slice(0,400)})));
await step('outsideClick',async()=>{
  const c=await page.locator(H.chipSel('Status')).count();
  if(!c) return {note:'Status chip absent',chips:await H.chips(page)};
  await page.locator(H.chipSel('Status')).first().click({timeout:15000});await page.waitForTimeout(1500);
  await H.tick(page,'filter_option_status_paid','Status');
  await page.mouse.click(30,760);await page.waitForTimeout(2500);
  return {panel:await H.panel(page),chips:await H.chips(page),rows:await H.rows(page),url:page.url()};});
await H.shot(page,'st-05-outside');
await step('imported',async()=>{
  const c=await page.locator(H.chipSel('Status')).count();
  if(!c) return {note:'Status chip absent'};
  await page.locator(H.chipSel('Status')).first().click({timeout:15000});await page.waitForTimeout(1500);
  const before=await H.panel(page);
  const n2=H.listCalls(netlog).length;
  const cl=await H.tick(page,'filter_option_status_imported','Status');
  return {cl,before,calls:H.listCalls(netlog).slice(n2),panel:await H.panel(page),chips:await H.chips(page),rows:await H.rows(page),url:page.url()};});
await H.shot(page,'st-06-imported');
R.prefs=H.prefCalls(netlog);
R.allListCalls=H.listCalls(netlog);
fs.writeFileSync('/tmp/fviu/o-status.json',JSON.stringify(R,null,1));
await browser.close();
console.log('DONE');
