import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-mob2.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,250)};}S(k);};
// reset saved state to All tab, no filters, no query, via a desktop session first
{const D=await H.open();
 await D.page.evaluate(()=>{});
 await H.api('PUT','/api/users/me/preferences/work-orders-list',{value:{tab:'all',filters:{},collapsed:false,search:'',sortBy:'vehicle',descending:false,
   columns:{vin:true,vehicle:true,daysOpen:false,progress:true,startDate:true,linesCount:true,technician:true,totalPrice:true,invoicedDate:false,serviceAdvisor:true,partRequestsCount:false,clockedInTechnicians:true,partReturnRequestsCount:false,unreceivedPartRequestsCount:false}}});
 await D.browser.close();}
const M={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:2,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const A=await H.open(M); const {page,netlog}=A;
const cards=()=>page.evaluate(()=>{
  const c=[...document.querySelectorAll('[class*=card]')].filter(e=>/S\d-\d+/.test(e.innerText||''));
  return {n:c.length,first:c.slice(0,3).map(e=>e.innerText.replace(/\n/g,' | ').slice(0,120)),
    emptyMsg:(()=>{const t=document.body.innerText;const m=t.match(/No work orders[^\n]*/);return m?m[0]:null;})()};});
await T('chipDom',()=>page.evaluate(()=>{
  const all=[...document.querySelectorAll('[data-test-id^="filter_chip"]')].map(b=>{const r=b.getBoundingClientRect();
    return {t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),cls:b.className.slice(0,120),
      tag:b.tagName,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)};});
  let sc=null;
  if(all.length){const c=document.querySelector('[data-test-id^="filter_chip"]');let e=c.parentElement;
    for(let i=0;i<5&&e;i++){const cs=getComputedStyle(e);
      if(/auto|scroll/.test(cs.overflowX)){sc={cls:e.className.slice(0,90),overflowX:cs.overflowX,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollable:e.scrollWidth>e.clientWidth};break;}
      e=e.parentElement;}}
  const tabs=[...document.querySelectorAll('.q-tab')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),y:Math.round(r.y)};});
  return {chips:all,scroller:sc,tabs,toggle:!!([...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText)))};}));
await H.shot(page,'m2-01-layout');
await T('cardsInitial',cards);
// tap the Status chip
await T('tapStatus',async()=>{
  const l=page.locator('[data-test-id="filter_chip_status"]');
  if(!await l.count()) return {absent:true};
  await l.first().click({timeout:20000}); await page.waitForTimeout(2500);
  return page.evaluate(()=>{
    const cand=[...document.querySelectorAll('.q-dialog,.q-menu,[class*=sheet]')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed');
    const e=cand[cand.length-1]; if(!e) return {noSheet:true,body:document.body.innerText.slice(0,300)};
    const r=e.getBoundingClientRect();
    return {cls:e.className,text:e.innerText.slice(0,600),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),
      vw:window.innerWidth,vh:window.innerHeight,
      buttons:[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id')})).filter(b=>b.t),
      opts:[...e.querySelectorAll('[role=checkbox],[role=listitem]')].map(o=>({l:o.getAttribute('aria-label')||o.innerText.trim(),c:o.getAttribute('aria-checked'),testid:o.getAttribute('data-test-id')}))};});});
await H.shot(page,'m2-02-status-sheet');
await T('S12R6_deferredApply',async()=>{
  const n=H.listCalls(netlog).length; const url0=page.url(); const c0=await cards();
  const o=page.locator('[data-test-id="filter_option_status_paid"]');
  if(!await o.count()) return {noOption:true};
  await o.first().click({timeout:20000});
  await page.waitForTimeout(700);
  const t0={calls:H.listCalls(netlog).slice(n),url:page.url(),cards:(await cards()).n};
  await page.waitForTimeout(4500);
  const t1={calls:H.listCalls(netlog).slice(n),url:page.url(),cards:(await cards()).n,
    sheetOpen:await page.evaluate(()=>[...document.querySelectorAll('.q-dialog,.q-menu')].some(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed')),
    applyButtons:await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)).map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id'),vis:b.offsetParent!==null})))};
  return {before:{url:url0,cards:c0.n},immediately:t0,after4s:t1};});
await H.shot(page,'m2-03-after-tick');
await T('chipStateAfter',()=>page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="filter_chip"]')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),cls:b.className.includes('active')?'ACTIVE':'',bg:getComputedStyle(b).backgroundColor}))));
await T('clearFiltersMobile',()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id="clear_filters"]');
  return b?{present:true,text:b.innerText.trim(),vis:b.offsetParent!==null}:{present:false};}));
await T('allFiltersSheet',async()=>{
  const l=page.locator('[data-test-id="filter_chip_all_filters"]');
  if(!await l.count()) return {absent:true};
  await l.first().click({timeout:20000}); await page.waitForTimeout(2800);
  return page.evaluate(()=>{const cand=[...document.querySelectorAll('.q-dialog,[class*=sheet]')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed');
    const e=cand[cand.length-1]; if(!e) return {noSheet:true};
    const r=e.getBoundingClientRect();
    return {cls:e.className,text:e.innerText.slice(0,800),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),vh:window.innerHeight,
      buttons:[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id')})).filter(b=>b.t),
      rows:[...e.querySelectorAll('[class*=expansion],[class*=row],.q-item')].map(x=>x.innerText.trim().split('\n')[0]).slice(0,14)};});});
await H.shot(page,'m2-04-all-filters');
await T('allFiltersApply',async()=>{
  const n=H.listCalls(netlog).length;
  const btns=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)).map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id')})));
  return {applyPresent:btns,callsBefore:H.listCalls(netlog).length-n};});
await T('mobileEmpty',async()=>{
  await page.goto(H.APP+'/workorders?status=declined&company_id=00000000-0000-4000-8000-000000000000&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const c=await cards();
  return {cards:c.n,emptyMsg:c.emptyMsg,
    clear:await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/clear/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})))};});
await H.shot(page,'m2-05-empty');
await A.browser.close(); console.log('DONE');
