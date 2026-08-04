import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-search.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
const A=await H.open(); const {page,netlog}=A;
await H.resetFilters(page);
const putBodies=[];
page.on('request',r=>{if(/preferences/.test(r.url())&&r.method()==='PUT'){try{putBodies.push(r.postData());}catch{}}});
await T('collapsedControl',()=>page.evaluate(()=>{
  const b=[...document.querySelectorAll('button')].find(x=>/^search$/i.test(x.innerText.trim())||/search\s*$/i.test(x.innerText.trim()));
  if(!b) return {found:false,all:[...document.querySelectorAll('button')].map(x=>x.innerText.trim()).slice(0,25)};
  const r=b.getBoundingClientRect();const cs=getComputedStyle(b);const i=b.querySelector('i');
  return {found:true,text:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),
    icon:i?i.textContent.trim():null,iconSize:i?getComputedStyle(i).fontSize:null,
    color:cs.color,bg:cs.backgroundColor,radius:cs.borderRadius,padding:cs.padding,
    fontSize:cs.fontSize,lineHeight:cs.lineHeight,fontWeight:cs.fontWeight,fontFamily:cs.fontFamily,
    x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}));
await T('toolbarOrder',()=>page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>{const r=e.getBoundingClientRect();return r.y>75&&r.y<130&&r.x>1200;}).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\n/g,'|'),testid:e.getAttribute('data-test-id'),aria:e.getAttribute('aria-label'),x:Math.round(r.x),w:Math.round(r.width)};})));
await T('expand',async()=>{
  await page.locator('button:has-text("Search")').first().click({timeout:20000});await page.waitForTimeout(1800);
  return page.evaluate(()=>{const inp=[...document.querySelectorAll('input')].filter(i=>{const r=i.getBoundingClientRect();return r.y>75&&r.y<135;});
    if(!inp.length) return {noInput:true,html:document.querySelector('.q-page-container')?'':''};
    const i=inp[0];const f=i.closest('.q-field')||i.parentElement;const r=(f||i).getBoundingClientRect();const cs=getComputedStyle(i);
    return {placeholder:i.placeholder,testid:i.getAttribute('data-test-id'),focused:document.activeElement===i,
      fieldW:Math.round(r.width),fieldX:Math.round(r.x),fieldH:Math.round(r.height),
      color:cs.color,fontSize:cs.fontSize,phColor:(()=>{return null;})(),
      icons:[...(f||i).querySelectorAll('i')].map(x=>x.textContent.trim())};});});
await H.shot(page,'se-01-expanded');
await T('type',async()=>{
  const inp=page.locator('input').filter({hasNot:page.locator('[type=checkbox]')});
  const box=page.locator('.q-page-container input, header input').first();
  const target=page.locator('input').nth(0);
  // find the toolbar input precisely
  const sel=await page.evaluate(()=>{const inp=[...document.querySelectorAll('input')].find(i=>{const r=i.getBoundingClientRect();return r.y>75&&r.y<135;});return inp?inp.getAttribute('data-test-id'):null;});
  const loc=sel?page.locator(`[data-test-id="${sel}"]`):target;
  const n=H.listCalls(netlog).length;
  await loc.first().click(); await loc.first().type('Lastone',{delay:60});
  await page.waitForTimeout(2500);
  const st=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});
    const f=i?i.closest('.q-field'):null;const cs=i?getComputedStyle(i):null;
    return {val:i?i.value:null,color:cs?cs.color:null,icons:f?[...f.querySelectorAll('i')].map(x=>({t:x.textContent.trim(),size:getComputedStyle(x).fontSize,testid:x.getAttribute('data-test-id')})):[],
      fieldW:f?Math.round(f.getBoundingClientRect().width):null};});
  return {sel,state:st,calls:H.listCalls(netlog).slice(n),url:page.url(),rows:await H.rows(page)};});
await H.shot(page,'se-02-typed');
await T('savedPayloadAfterQuery',async()=>{await page.waitForTimeout(2500);
  const r=await H.api('GET','/api/users/me/preferences/work-orders-list');
  return {putBodies:putBodies.slice(-3),getBody:JSON.stringify(r.body).slice(0,900)};});
await T('searchPlusFilter',async()=>{
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_paid"]').first().click({timeout:15000});await page.waitForTimeout(4000);
  return {url:page.url(),rows:await H.rows(page),calls:H.listCalls(netlog).slice(-1),chips:await H.chips(page)};});
await H.shot(page,'se-03-search-plus-filter');
await T('clearFiltersKeepsQuery',async()=>{
  const ok=await H.resetFilters(page); await page.waitForTimeout(2500);
  const q=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});return i?i.value:null;});
  return {ok,query:q,url:page.url(),rows:(await H.rows(page)).n,calls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'se-04-clearfilters-keeps-query');
await T('clearQuery',async()=>{
  const x=page.locator('.q-field i').filter({hasText:/cancel|close|clear/}).first();
  const n=H.listCalls(netlog).length;
  const found=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});
    const f=i?i.closest('.q-field'):null; if(!f) return null;
    return [...f.querySelectorAll('i')].map(e=>({t:e.textContent.trim(),testid:e.getAttribute('data-test-id')}));});
  let clicked=false;
  for(const ic of (found||[])){ if(/cancel|close|highlight_off|clear/.test(ic.t)){
    await page.evaluate(t=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});
      const f=i.closest('.q-field');const e=[...f.querySelectorAll('i')].find(y=>y.textContent.trim()===t);e.click();},ic.t);
    clicked=true;break;}}
  await page.waitForTimeout(3500);
  const st=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});
    return {present:!!i,val:i?i.value:null,btnSearch:!!([...document.querySelectorAll('button')].find(b=>/^search$/i.test(b.innerText.trim())))};});
  return {icons:found,clicked,state:st,url:page.url(),rows:(await H.rows(page)).n,calls:H.listCalls(netlog).slice(n)};});
await H.shot(page,'se-05-query-cleared');
await T('blurEmptyCollapses',async()=>{
  const st0=await page.evaluate(()=>({input:!!([...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;}))}));
  await page.mouse.click(1300,55);await page.waitForTimeout(2000);
  return {before:st0,after:await page.evaluate(()=>({input:!!([...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;})),
    searchBtn:!!([...document.querySelectorAll('button')].find(b=>/^search$/i.test(b.innerText.trim())))}))};});
await T('noResultsQuery',async()=>{
  await page.locator('button:has-text("Search")').first().click({timeout:20000});await page.waitForTimeout(1500);
  const sel=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});return i?i.getAttribute('data-test-id'):null;});
  const loc=sel?page.locator(`[data-test-id="${sel}"]`).first():page.locator('input').first();
  await loc.type('ZZQQNOMATCHXX',{delay:40});await page.waitForTimeout(3000);
  return {url:page.url(),rows:(await H.rows(page)).n,
    empty:await page.evaluate(()=>document.body.innerText.slice(-450)),calls:H.listCalls(netlog).slice(-1)};});
await H.shot(page,'se-06-no-results');
await T('queryTabSessionOnly',async()=>{
  const url=page.url();
  await A.browser.close();
  const B=await H.open();
  const r={priorUrl:url,newUrl:B.page.url(),
    query:await B.page.evaluate(()=>{const i=[...document.querySelectorAll('input')].find(x=>{const r=x.getBoundingClientRect();return r.y>75&&r.y<135;});return i?i.value:null;}),
    rows:(await H.rows(B.page)).n,
    pref:JSON.stringify((await H.api('GET','/api/users/me/preferences/work-orders-list')).body).slice(0,700)};
  await H.shot(B.page,'se-07-new-session');
  await B.browser.close(); return r;});
console.log('DONE');
