import { boot } from './boot8582.mjs';
import { APP, login, api } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/final'; fs.mkdirSync(OUT,{recursive:true});
const R={buildMarker:'v3.4.1-0ed4433', at:new Date().toISOString()};
const {browser,page,netlog}=await boot('admin');
const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const hdr=()=>page.$$eval('thead th',t=>t.map(x=>x.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|info_outline|keyboard_double_arrow_down/g,'').trim()).filter(Boolean));
// ============ 1. FIRST-VISIT DEFAULTS (clear only the report_view keys) ============
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(6000);
await page.evaluate(()=>{Object.keys(localStorage).filter(k=>k.startsWith('report_view:')).forEach(k=>localStorage.removeItem(k));});
{const from=netlog.length;
 await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(2000);
 R.pvLoadingIndicator = await page.evaluate(()=>{const m=document.querySelector('main')||document.body;
   return {spinners:m.querySelectorAll('.q-spinner, .q-loading, [role=progressbar]').length, text:/loading/i.test(m.innerText)?'loading-word-present':null,
     rowsWhileLoading: document.querySelectorAll('tbody tr').length};});
 await page.waitForTimeout(9000);
 R.pvFirstVisit={dateLabel: await page.$eval('.date-range-label',e=>e.innerText.trim()).catch(()=>null),
  headers: await hdr(), typeLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Type/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
  locLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Location/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
  ls: await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity')),
  firstCalls: netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/parts-velocity')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/parts-velocity/,''))};
 await shot('pv-first-visit');}
// invalid saved view -> defensive fallback
{await page.evaluate(()=>localStorage.setItem('report_view:parts-velocity', JSON.stringify({version:"1",view:{dateRange:"not-a-range",locationIds:["00000000-0000-0000-0000-000000000000"],sortBy:"nope",descending:true,columns:["bogus_col"]},extra:{type:"nonsense",categoryIds:["bad"],vendorIds:[],binIds:[]}})));
 const from=netlog.length;
 await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(10000);
 R.pvBadSavedView={dateLabel: await page.$eval('.date-range-label',e=>e.innerText.trim()).catch(()=>null), headers:await hdr(),
   typeLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Type/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
   locLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Location/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
   calls: netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/parts-velocity')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/parts-velocity/,'').slice(0,180)),
   lsAfter: await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'))};
 await shot('pv-bad-saved-view');}
// all-columns-off -> empty selection not restored
{const cb=await page.$('[aria-label="Column Selection"]'); const b=await cb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 const names=await page.$$eval('.q-menu .q-item',is=>is.map(i=>i.innerText.trim()));
 let off=0;
 for(const nm of names){ const its=await page.$$('.q-menu .q-item');
   for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t===nm){await it.evaluate(x=>x.scrollIntoView({block:'center'})); await page.waitForTimeout(180);
     const tg=await it.$('.q-toggle'); if(tg){const bb=await tg.boundingBox(); if(bb&&bb.y>0){const on=await tg.evaluate(e=>e.getAttribute('aria-checked')); if(on==='true'){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); off++; await page.waitForTimeout(220);}}} break;}}}
 await page.waitForTimeout(1500);
 R.allColumnsOff={toggledOff:off, headers:await hdr(), ls:await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'))};
 await shot('pv-all-columns-off'); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
 // export with zero columns
 {const eb=await page.$('[aria-label="Export report"]'); const bb=await eb.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(900);
  const from=netlog.length; const its=await page.$$('.q-menu .q-item');
  for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Download (CSV)'){const b2=await it.boundingBox(); await page.mouse.click(b2.x+b2.width/2,b2.y+b2.height/2); break;}}
  await page.waitForTimeout(4000);
  R.zeroColumnExport={calls: netlog.slice(from).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+/,'').slice(0,200)),
    toasts: await page.$$eval('.q-notification',n=>n.map(x=>x.innerText.replace(/\n/g,' ').trim()))};
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);}
 // reload -> empty selection NOT restored
 await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
 R.afterReloadFromEmpty={headers:await hdr(), ls:await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'))};
 await shot('pv-after-reload-from-empty');}
// ============ 2. PV visual detail ============
R.pvVisual = await page.evaluate(()=>{
  const main=document.querySelector('main');
  const tb=[...main.querySelectorAll('div')].find(d=>d.querySelector('.q-select')&&d.querySelector('.date-range-label'));
  const table=main.querySelector('table'); const th=table&&table.querySelector('thead th');
  const tr=table&&[...table.querySelectorAll('tbody tr')].find(x=>x.querySelectorAll('td').length>5);
  const tds=tr?[...tr.querySelectorAll('td')]:[];
  const ths=table?[...table.querySelectorAll('thead th')]:[];
  const cs=e=>e?getComputedStyle(e):null;
  return {pageBg:cs(document.querySelector('.reports-page')||document.body).backgroundColor,
   mainBg:cs(main).backgroundColor,
   toolbarBg:tb?cs(tb).backgroundColor:null, toolbarPadding:tb?cs(tb).padding:null,
   tableWrapperBg: table? cs(table.parentElement).backgroundColor:null,
   thBg:cs(th).backgroundColor, thBorderTop:cs(th).borderTopWidth+' '+cs(th).borderTopStyle+' '+cs(th).borderTopColor,
   tdBg:tds[0]?cs(tds[0]).backgroundColor:null,
   firstThPadLeft:ths[0]?cs(ths[0]).paddingLeft:null, lastThPadRight:ths.length?cs(ths[ths.length-1]).paddingRight:null,
   firstTdPadLeft:tds[0]?cs(tds[0]).paddingLeft:null, lastTdPadRight:tds.length?cs(tds[tds.length-1]).paddingRight:null,
   cardRadius: table? cs(table.closest('.q-card')||table.parentElement).borderRadius:null,
   infoIconColor: (()=>{const i=[...document.querySelectorAll('thead th i')].find(x=>x.textContent.trim()==='info_outline'); return i?getComputedStyle(i).color:null;})()};});
// dark mode
await page.evaluate(()=>localStorage.setItem('mode','"dark"'));
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
R.pvDark = await page.evaluate(()=>{const th=document.querySelector('thead th'); const tr=[...document.querySelectorAll('tbody tr')].find(x=>x.querySelectorAll('td').length>5);
 const i=[...document.querySelectorAll('thead th i')].find(x=>x.textContent.trim()==='info_outline');
 return {bodyClass:document.body.className, bodyBg:getComputedStyle(document.body).backgroundColor,
  thBg:th&&getComputedStyle(th).backgroundColor, thColor:th&&getComputedStyle(th).color,
  tdBg:tr&&getComputedStyle(tr.querySelector('td')).backgroundColor, tdColor:tr&&getComputedStyle(tr.querySelector('td')).color,
  infoIconColor:i&&getComputedStyle(i).color};});
await shot('pv-dark');
await page.evaluate(()=>localStorage.setItem('mode','"light"'));
// ============ 3. narrow viewport truncation ============
await page.setViewportSize({width:900,height:800});
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
{const si=await page.$('[data-test-id="input_report_search"]'); if(si){await si.click(); await si.fill('WHEEL BEARING'); await page.waitForTimeout(6500);}
 R.narrowTruncation = await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(x=>x.querySelectorAll('td').length>5); if(!tr)return null;
   return [...tr.querySelectorAll('td')].slice(1,5).map(td=>({text:td.innerText.trim().slice(0,50),title:td.getAttribute('title')||td.querySelector('[title]')?.getAttribute('title')||null,
    overflow:getComputedStyle(td).textOverflow, scrollW:td.scrollWidth, clientW:td.clientWidth, truncated:td.scrollWidth>td.clientWidth}));});
 R.narrowViewport='900x800';
 await shot('pv-narrow-truncation');}
await page.setViewportSize({width:1680,height:1050});
// ============ 4. TU first visit + links + open clock ============
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(6000);
await page.evaluate(()=>{Object.keys(localStorage).filter(k=>k.startsWith('report_view:')).forEach(k=>localStorage.removeItem(k));});
{const from=netlog.length;
 await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(1800);
 R.tuLoadingIndicator=await page.evaluate(()=>{const m=document.querySelector('main')||document.body;
   return {spinners:m.querySelectorAll('.q-spinner, .q-loading, [role=progressbar]').length, rowsWhileLoading:document.querySelectorAll('tbody tr').length};});
 await page.waitForTimeout(9000);
 R.tuFirstVisit={dateLabel: await page.$eval('.date-range-label',e=>e.innerText.trim()).catch(()=>null), headers:await hdr(),
   techLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Technician/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
   locLabel: await page.evaluate(()=>{const s=[...document.querySelectorAll('.q-select')].find(x=>/^Location/.test(x.innerText.trim()));return s&&s.innerText.replace(/\n/g,' ').trim();}),
   rows: await page.$$eval('tbody tr',t=>t.map(x=>[...x.querySelectorAll('td,th')].map(y=>y.innerText.replace(/\n/g,' ').trim())).filter(r=>r.join(''))),
   ls: await page.evaluate(()=>localStorage.getItem('report_view:technician-utilization')),
   calls: netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/technician-utilization/,''))};
 await shot('tu-first-visit');}
// link click-through
{const a=await page.$('tbody a');
 R.linkBefore = a? await a.evaluate(e=>({text:e.innerText.trim(),href:e.getAttribute('href'),deco:getComputedStyle(e).textDecorationLine,color:getComputedStyle(e).color})):null;
 // focus affordance
 if(a){await a.focus(); await page.waitForTimeout(400);
   R.linkFocus=await a.evaluate(e=>({deco:getComputedStyle(e).textDecorationLine, outline:getComputedStyle(e).outline, outlineWidth:getComputedStyle(e).outlineWidth, boxShadow:getComputedStyle(e).boxShadow}));
   await page.mouse.move(0,0);
   const bb=await a.boundingBox(); await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(600);
   R.linkHover=await a.evaluate(e=>({deco:getComputedStyle(e).textDecorationLine}));
   await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(9000);
   R.linkAfterClick={url:page.url(), title:await page.title(),
     pageText:(await page.locator('body').innerText()).replace(/\n+/g,' | ').slice(-500),
     headers: await hdr(),
     filterTexts: await page.$$eval('.q-select, .q-field',es=>es.map(e=>e.innerText.replace(/\n/g,' ').trim()).filter(Boolean).slice(0,10))};
   await shot('tu-link-landed-timesheet');}}
// open clock still running?
{const cur=await api((await login('admin')).sessCookie,'GET','/api/technician-tasks/my-current-task');
 R.adminOpenTask=JSON.stringify(cur.body).slice(0,160);}
fs.writeFileSync(`${OUT}/final-ui.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,11000));
await browser.close();
