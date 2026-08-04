import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-mob.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
const M={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:2,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const A=await H.open(M); const {page,netlog}=A;
await T('layout',()=>page.evaluate(()=>{
  const chips=[...document.querySelectorAll('button.filter-chip')].map(b=>{const r=b.getBoundingClientRect();
    return {t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width)};});
  const tabs=[...document.querySelectorAll('.q-tab')].map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),y:Math.round(r.y),h:Math.round(r.height)};});
  const toggle=[...document.querySelectorAll('button')].find(x=>/filter_list/.test(x.innerText));
  const allFilters=[...document.querySelectorAll('button')].filter(b=>/all filters/i.test(b.innerText)).map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id')}));
  const scroller=(()=>{const c=document.querySelector('button.filter-chip');if(!c)return null;
    let e=c.parentElement;for(let i=0;i<4&&e;i++){const cs=getComputedStyle(e);
      if(/auto|scroll/.test(cs.overflowX)) return {cls:e.className.slice(0,80),overflowX:cs.overflowX,sw:e.scrollWidth,cw:e.clientWidth};
      e=e.parentElement;} return {none:true};})();
  const cta=[...document.querySelectorAll('button')].filter(b=>/work order/i.test(b.innerText)).map(b=>{const r=b.getBoundingClientRect();return {t:b.innerText.trim(),w:Math.round(r.width),x:Math.round(r.x)};});
  const searchBtn=[...document.querySelectorAll('button')].filter(b=>/^search$/i.test(b.innerText.trim())).map(b=>{const r=b.getBoundingClientRect();return {t:b.innerText.trim(),testid:b.getAttribute('data-test-id'),x:Math.round(r.x),w:Math.round(r.width),y:Math.round(r.y)};});
  const kebab=[...document.querySelectorAll('button')].filter(b=>/more_vert|more_horiz/.test(b.innerText)).length;
  return {chips,tabs,toggleShown:!!toggle,allFilters,scroller,cta,searchBtn,kebab,
    cards:document.querySelectorAll('tbody tr').length,bodyTop:document.body.innerText.slice(0,500)};}));
await H.shot(page,'mo-01-layout');
await T('tapStatusChip',async()=>{
  const c=page.locator('button.filter-chip').first();
  const cnt=await c.count(); if(!cnt) return {noChips:true};
  await c.click({timeout:20000}); await page.waitForTimeout(2500);
  return page.evaluate(()=>{
    const sheets=[...document.querySelectorAll('.q-dialog,.q-menu,[class*=sheet],[class*=bottom]')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed');
    const e=sheets[sheets.length-1];
    if(!e) return {noSheet:true,body:document.body.innerText.slice(0,400)};
    const r=e.getBoundingClientRect();
    return {cls:e.className,text:e.innerText.slice(0,700),y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width),
      fullWidth:Math.round(r.width)>=window.innerWidth-4,bottomAnchored:Math.round(r.y+r.height)>=window.innerHeight-4,
      applyBtn:[...e.querySelectorAll('button')].map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id')})).filter(b=>b.t),
      opts:[...e.querySelectorAll('[role=checkbox],[role=listitem]')].map(o=>({l:o.getAttribute('aria-label')||o.innerText.trim(),c:o.getAttribute('aria-checked'),testid:o.getAttribute('data-test-id')}))};});});
await H.shot(page,'mo-02-sheet');
await T('tickInSheet_isItInstant',async()=>{
  const before=await H.rows(page); const url0=page.url();
  const n=H.listCalls(netlog).length;
  const opt=page.locator('[data-test-id^="filter_option_status_"]').first();
  if(!await opt.count()) return {noOption:true};
  const tid=await opt.getAttribute('data-test-id');
  await opt.click({timeout:20000});
  await page.waitForTimeout(600);
  const immediate={calls:H.listCalls(netlog).slice(n),url:page.url(),rows:(await H.rows(page)).n};
  await page.waitForTimeout(4000);
  const settled={calls:H.listCalls(netlog).slice(n),url:page.url(),rows:(await H.rows(page)).n,
    sheetOpen:await page.evaluate(()=>[...document.querySelectorAll('.q-dialog,.q-menu')].some(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed'))};
  const applyBtn=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/apply/i.test(b.innerText)).map(b=>({t:b.innerText.trim(),testid:b.getAttribute('data-test-id'),vis:b.offsetParent!==null})));
  return {ticked:tid,before:{n:before.n,url:url0},immediate,settled,applyBtn};});
await H.shot(page,'mo-03-after-tick');
await T('chipsAfterTick',()=>H.chips(page));
await T('mobileSearch',async()=>{
  const b=page.locator('button:has-text("Search")').first();
  if(!await b.count()) return {noSearchBtn:true};
  await b.click({timeout:20000}); await page.waitForTimeout(1800);
  return page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y<220&&r.width>40;});
    const f=i?i.closest('.q-field'):null;
    return {found:!!i,ph:i?i.placeholder:null,w:f?Math.round(f.getBoundingClientRect().width):null,
      focused:i?document.activeElement===i:null,
      ctaW:(()=>{const c=[...document.querySelectorAll('button')].find(b=>/work order/i.test(b.innerText));return c?Math.round(c.getBoundingClientRect().width):null;})(),
      ctaText:(()=>{const c=[...document.querySelectorAll('button')].find(b=>/work order/i.test(b.innerText));return c?c.innerText.trim():null;})(),
      modal:!!document.querySelector('.q-dialog')};});});
await H.shot(page,'mo-04-search');
await T('mobileEmptyState',async()=>{
  await page.goto(H.APP+'/workorders?status=declined&company_id=00000000-0000-4000-8000-000000000000&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  return {rows:(await H.rows(page)).n,text:await page.evaluate(()=>document.body.innerText.slice(-400))};});
await H.shot(page,'mo-05-empty');
await A.browser.close(); console.log('DONE');
