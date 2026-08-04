import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-mob3.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,250)};}S(k);};
const M={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:2,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
// clean saved state
{const D=await H.open(); await H.api('PUT','/api/users/me/preferences/work-orders-list',{value:{tab:'all',filters:{},collapsed:false,search:'',sortBy:'vehicle',descending:false,columns:{vin:true,vehicle:true,daysOpen:false,progress:true,startDate:true,linesCount:true,technician:true,totalPrice:true,invoicedDate:false,serviceAdvisor:true,partRequestsCount:false,clockedInTechnicians:true,partReturnRequestsCount:false,unreceivedPartRequestsCount:false}}}); await D.browser.close();}
const A=await H.open(M); const {page,netlog}=A;
const cardStat=()=>page.evaluate(()=>{
  const txt=document.body.innerText;
  const nums=[...txt.matchAll(/\bS\d-\d{3,6}\b/g)].map(m=>m[0]);
  const uniq=[...new Set(nums)];
  const statuses=[...txt.matchAll(/\b(Estimate|Approved|In progress|Review|Complete|Invoiced|Paid|Declined)\b/g)].map(m=>m[1]);
  const cs={}; statuses.forEach(s=>cs[s]=(cs[s]||0)+1);
  return {uniqueWO:uniq.length,firstWO:uniq.slice(0,5),statusCounts:cs,
    empty:/No work orders/i.test(txt)?(txt.match(/No work orders[^\n]*/)||[''])[0]:null};});
await T('baseline',cardStat);
await T('tapPaid',async()=>{
  await page.locator('[data-test-id="filter_chip_status"]').first().click({timeout:20000});await page.waitForTimeout(2200);
  const n=H.listCalls(netlog).length;
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:20000});
  await page.waitForTimeout(5000);
  return {calls:H.listCalls(netlog).slice(n),url:page.url(),stat:await cardStat()};});
await H.shot(page,'m3-01-paid');
await T('urlDrivenMobile',async()=>{
  await page.goto(H.APP+'/workorders?status=declined&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  return {url:page.url(),calls:H.listCalls(netlog).slice(-2),stat:await cardStat(),
    chips:await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="filter_chip"]')].map(b=>b.innerText.trim().replace(/\n/g,'|')))};});
await H.shot(page,'m3-02-urldriven');
await T('urlDrivenNoMatchMobile',async()=>{
  await page.goto(H.APP+'/workorders?status=declined&company_id=00000000-0000-4000-8000-000000000000&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  return {url:page.url(),calls:H.listCalls(netlog).slice(-2),stat:await cardStat(),
    chips:await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="filter_chip"]')].map(b=>b.innerText.trim().replace(/\n/g,'|')))};});
await H.shot(page,'m3-03-nomatch');
await T('clearFiltersOnMobileWithActive',async()=>{
  await page.goto(H.APP+'/workorders?status=paid&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  return page.evaluate(()=>{const b=document.querySelector('[data-test-id="clear_filters"]');
    const any=[...document.querySelectorAll('button,a')].filter(e=>/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id'),vis:e.offsetParent!==null}));
    return {clearFiltersTestId:b?{text:b.innerText.trim(),vis:b.offsetParent!==null}:null,anyClear:any,
      chipRow:document.querySelector('.mobile-filter-chip-row')?document.querySelector('.mobile-filter-chip-row').innerText.replace(/\n/g,'|'):null};});});
await H.shot(page,'m3-04-clear');
await A.browser.close(); console.log('DONE');
