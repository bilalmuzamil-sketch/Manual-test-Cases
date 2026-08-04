import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/pv/ui';
const { browser, page, netlog } = await boot('admin');
const R={}; const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const hdrTxt=()=>page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').replace(/info_outline/g,'').trim()));
const apiPV=from=>netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/parts-velocity')&&!n.url.includes('/export')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/parts-velocity/,''));
const pollToasts=async(ms=15000)=>{const seen=new Set();const t0=Date.now();
  while(Date.now()-t0<ms){const ts=await page.$$eval('.q-notification',ns=>ns.map(n=>n.innerText.replace(/\n/g,' ').trim())).catch(()=>[]);
    ts.forEach(t=>seen.add(t)); await page.waitForTimeout(250);} return [...seen];};
const openSelByLabel=async lbl=>{const ss=await page.$$('.q-select');for(const s of ss){const t=await s.evaluate(e=>e.innerText.replace(/\n/g,' '));if(t.includes(lbl)){const b=await s.boundingBox();await page.mouse.click(b.x+b.width-14,b.y+b.height/2);await page.waitForTimeout(1500);return true;}}return false;};
const clickOption=async txt=>{ // works inside a scrollable q-menu
  const r = await page.evaluate(t=>{
    const menus=[...document.querySelectorAll('.q-menu')];
    for(const m of menus){ const items=[...m.querySelectorAll('.q-item')];
      const it=items.find(i=>i.innerText.trim()===t);
      if(it){ it.scrollIntoView({block:'center'}); return true; } }
    return false;}, txt);
  if(!r) return null;
  await page.waitForTimeout(500);
  const its=await page.$$('.q-menu .q-item');
  for(const it of its){ const t=await it.evaluate(e=>e.innerText.trim()); if(t===txt){ const b=await it.boundingBox(); if(b&&b.y>0){ await page.mouse.click(b.x+b.width/2,b.y+b.height/2); return txt; } } }
  return null;
};
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(10000);
// A. sort indicator classes on the active column vs others
R.sortIndicators = await page.evaluate(()=>[...document.querySelectorAll('thead th')].map(th=>{
  const ic=th.querySelector('.q-icon, i'); const arrows=[...th.querySelectorAll('i,.q-icon')].map(i=>i.textContent.trim()+':'+getComputedStyle(i).opacity+':'+getComputedStyle(i).color);
  return {t:th.innerText.replace(/\n/g,' ').trim(), cls:th.className.toString(), arrows};}));
// B. real-row cell alignment (skip the virtual spacer)
R.rowAlign = await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.querySelectorAll('td').length>5);
  if(!tr) return null; const ths=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|info_outline/g,'').trim());
  return [...tr.querySelectorAll('td')].map((td,i)=>ths[i]+' => '+getComputedStyle(td).textAlign);});
// C. truncation on a LONG description: search for the long part
{await page.keyboard.press('Escape');
 const si=await page.$('input[type="search"], .q-input input, input[placeholder]');
 R.searchInputInfo = si? await si.evaluate(e=>({ph:e.getAttribute('placeholder'),tid:e.getAttribute('data-test-id'),cls:e.className})):null;
 if(si){ const from=netlog.length; await si.click(); await si.fill('WHEEL BEARING GREASE'); await page.waitForTimeout(6000);
  R.searchLong={calls:apiPV(from), rowCount:(await page.$$('tbody tr')).length,
   cells: await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.querySelectorAll('td').length>5); if(!tr)return null;
     return [...tr.querySelectorAll('td')].slice(1,5).map(td=>({text:td.innerText.trim(),title:td.getAttribute('title')||td.querySelector('[title]')?.getAttribute('title')||null,
       overflow:getComputedStyle(td).textOverflow, scrollW:td.scrollWidth, clientW:td.clientWidth, truncated:td.scrollWidth>td.clientWidth,
       inner: td.innerHTML.slice(0,200)}));})};
  await shot('pv-search-long-description');
  // D. empty state
  const from2=netlog.length; await si.fill('ZZZNOSUCHPARTXYZ'); await page.waitForTimeout(6000);
  R.emptyState={calls:apiPV(from2), rowCount:(await page.$$('tbody tr')).length,
    exact:(await page.locator('body').innerText()).includes('Empty bays, endless possibilities. Get Going!'),
    tableText:(await page.$$eval('main',es=>es.map(e=>e.innerText.replace(/\n+/g,' | ')).join(' '))).slice(-260)};
  await shot('pv-empty-state');
  // E. export toast on empty result
  {const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
   const from3=netlog.length; const tp=pollToasts(12000); await clickOption('Download (CSV)');
   R.emptyResultExport={toasts:await tp, calls:netlog.slice(from3).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,110))};
   await page.keyboard.press('Escape'); await page.waitForTimeout(600);}
  await si.fill(''); await page.waitForTimeout(6000);
 }
}
// F. error toast on the over-cap 400 (whole multi-location list)
{const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
 const from=netlog.length; const tp=pollToasts(20000); await clickOption('Download (CSV)');
 R.overCapExport={toasts:await tp, calls:netlog.slice(from).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,110))};
 await shot('pv-overcap-toast'); await page.keyboard.press('Escape'); await page.waitForTimeout(800);}
// G. Type filter select Special Order properly
{const from=netlog.length; await openSelByLabel('Type'); const c=await clickOption('Special Order'); await page.waitForTimeout(6000); await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
 R.typeSO={clicked:c, calls:apiPV(from), label: await page.evaluate(()=>{const ss=[...document.querySelectorAll('.q-select')];const s=ss.find(x=>x.innerText.includes('Type'));return s&&s.innerText.replace(/\n/g,' ').trim();}),
   firstRowType: await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.querySelectorAll('td').length>5); return tr&&tr.querySelector('td').innerText.trim();}),
   onHandCells: await page.evaluate(()=>{const trs=[...document.querySelectorAll('tbody tr')].filter(t=>t.querySelectorAll('td').length>5).slice(0,2);
     const ths=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|info_outline/g,'').trim());
     return trs.map(tr=>Object.fromEntries([...tr.querySelectorAll('td')].map((td,i)=>[ths[i],td.innerText.trim()])));})};
 await shot('pv-type-specialorder-ok');
 // back to Both
 await openSelByLabel('Type'); await clickOption('Both'); await page.waitForTimeout(5000); await page.keyboard.press('Escape'); await page.waitForTimeout(1500);}
// H. column toggle Turns/Yr with scroll
{const cb=await page.$('[aria-label="Column Selection"]'); const b=await cb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 const from=netlog.length;
 const ok=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return 'nomenu';
   const items=[...m.querySelectorAll('.q-item')]; const it=items.find(i=>i.innerText.trim()==='Turns/Yr');
   if(!it) return 'noitem:'+items.map(i=>i.innerText.trim()).join('/');
   it.scrollIntoView({block:'center'}); return 'ok';});
 R.turnsScroll=ok;
 await page.waitForTimeout(700);
 const its=await page.$$('.q-menu .q-item');
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Turns/Yr'){const tg=await it.$('.q-toggle')||it; const bb=await tg.boundingBox(); if(bb&&bb.y>0){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);} break;}}
 await page.waitForTimeout(2500);
 R.turnsOn={headers:await hdrTxt(), reload:apiPV(from).length};
 await shot('pv-turns-on');
 R.turnsIconPresent = await page.evaluate(()=>{const th=[...document.querySelectorAll('thead th')].find(t=>/Turns/.test(t.innerText)); return th? {text:th.innerText.replace(/\n/g,' ').trim(), icons:[...th.querySelectorAll('i,.q-icon')].map(i=>i.textContent.trim()+'|'+(i.getAttribute('aria-label')||''))}:null;});
 R.lsTurns=await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'));
 await page.keyboard.press('Escape'); await page.waitForTimeout(800);}
// I. date range: custom span > 366 days
{const dr=await page.$('span.date-range-label')||await page.$('[data-test-id*="date-range"]');
 const b=await dr.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 R.datePopupText=(await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText.replace(/\n/g,' | '))))[0];
 // choose Last 12 Months then read the Range readout & Apply state
 const c=await clickOption('Last 12 Months'); await page.waitForTimeout(1200);
 R.after12m=(await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText.replace(/\n/g,' | '))))[0];
 // try a >366 day custom span by clicking calendar year back twice then a day
 R.rangeReadout = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const t=m?m.innerText:''; const mm=t.match(/Range:\s*([0-9]+)\s*days/); return mm?mm[1]:null;});
 R.applyDisabled = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m)return null; const b=[...m.querySelectorAll('button')].find(x=>x.innerText.trim()==='Apply'); return b?{disabled:b.disabled,aria:b.getAttribute('aria-disabled')}:null;});
 await shot('pv-date-12m'); await page.keyboard.press('Escape'); await page.waitForTimeout(600);}
fs.writeFileSync(`${OUT}/pv-ui-3.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,12000));
await browser.close();
