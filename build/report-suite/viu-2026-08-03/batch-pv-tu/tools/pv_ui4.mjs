import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/pv/ui';
const { browser, page, netlog } = await boot('admin');
const R={}; const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const hdrTxt=()=>page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|info_outline/g,'').trim()));
const apiPV=from=>netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/parts-velocity')&&!n.url.includes('/export')).map(n=>n.status+' '+decodeURIComponent(n.url).replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/parts-velocity/,''));
const pollToasts=async(ms)=>{const s=new Set();const t0=Date.now();while(Date.now()-t0<ms){(await page.$$eval('.q-notification',n=>n.map(x=>x.innerText.replace(/\n/g,' ').trim())).catch(()=>[])).forEach(t=>s.add(t));await page.waitForTimeout(250);}return [...s];};
const rowCount=()=>page.$$eval('tbody tr',trs=>trs.filter(t=>t.querySelectorAll('td').length>5).length);
const firstRow=()=>page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.querySelectorAll('td').length>5);
  const ths=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|info_outline/g,'').trim());
  return tr?Object.fromEntries([...tr.querySelectorAll('td')].map((td,i)=>[ths[i],td.innerText.trim()])):null;});
const clickTid=async tid=>{const e=await page.$(`[data-test-id="${tid}"]`); if(!e) return false; await e.evaluate(x=>x.scrollIntoView({block:'center'})); await page.waitForTimeout(300); const b=await e.boundingBox(); if(!b) return false; await page.mouse.click(b.x+b.width/2,b.y+b.height/2); return true;};
const openSelByAria=async aria=>{const e=await page.$(`input[aria-label="${aria}"]`); if(!e) return false; const b=await e.boundingBox(); await page.mouse.click(b.x+Math.min(b.width-6,60),b.y+b.height/2); await page.waitForTimeout(1500); return true;};
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(10000);
// A. report toolbar search (page-local), case-insensitive, part# OR description
{const si=await page.$('[data-test-id="input_report_search"]');
 R.searchPlaceholder=await si.evaluate(e=>e.getAttribute('placeholder'));
 let from=netlog.length; await si.click(); await si.fill('brakeclean'); await page.waitForTimeout(6500);
 R.searchLowerPartNo={calls:apiPV(from), rows:await rowCount(), first:await firstRow()};
 from=netlog.length; await si.fill('stover locknut'); await page.waitForTimeout(6500);
 R.searchDescription={calls:apiPV(from), rows:await rowCount(), first:await firstRow()};
 // long description truncation check
 from=netlog.length; await si.fill('WHEEL BEARING'); await page.waitForTimeout(6500);
 R.searchLongDesc={calls:apiPV(from), rows:await rowCount(),
   cells: await page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.querySelectorAll('td').length>5); if(!tr)return null;
     return [...tr.querySelectorAll('td')].slice(1,5).map(td=>({text:td.innerText.trim(),title:td.getAttribute('title')||td.querySelector('[title]')?.getAttribute('title')||null,
      overflow:getComputedStyle(td).textOverflow,scrollW:td.scrollWidth,clientW:td.clientWidth,truncated:td.scrollWidth>td.clientWidth}));})};
 await shot('pv-search-wheelbearing');
 // empty state
 from=netlog.length; await si.fill('ZZZNOSUCHPARTXYZ'); await page.waitForTimeout(6500);
 R.emptyState={calls:apiPV(from), rows:await rowCount(),
   exact:(await page.locator('body').innerText()).includes('Empty bays, endless possibilities. Get Going!')};
 await shot('pv-empty-state-real');
 // export on an empty result
 {const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
  const f=netlog.length; const tp=pollToasts(10000);
  const items=await page.$$('.q-menu .q-item'); for(const it of items){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Download (CSV)'){const bb=await it.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
  R.emptyExport={toasts:await tp, calls:netlog.slice(f).filter(n=>n.url.includes('/export')).map(n=>n.status)};
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);}
 // narrow to GREASE for the successful-export toast + PDF
 from=netlog.length; await si.fill('GREASE'); await page.waitForTimeout(6500);
 R.searchGrease={rows:await rowCount()};
}
// B. successful CSV export toast + filename
{const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
 const dlp=page.waitForEvent('download',{timeout:60000}).catch(()=>null); const tp=pollToasts(12000);
 const items=await page.$$('.q-menu .q-item'); for(const it of items){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Download (CSV)'){const bb=await it.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
 const toasts=await tp; const d=await dlp;
 R.csvOk={toasts, filename:d?d.suggestedFilename():null};
 if(d) await d.saveAs(`${OUT}/dl-${d.suggestedFilename()}`);
 await page.keyboard.press('Escape'); await page.waitForTimeout(700);}
// C. successful PDF export toast + filename
{const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
 const dlp=page.waitForEvent('download',{timeout:90000}).catch(()=>null); const tp=pollToasts(20000);
 const items=await page.$$('.q-menu .q-item'); for(const it of items){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Download (PDF)'){const bb=await it.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
 const toasts=await tp; const d=await dlp;
 R.pdfOk={toasts, filename:d?d.suggestedFilename():null};
 if(d) await d.saveAs(`${OUT}/dl-${d.suggestedFilename()}`);
 await page.keyboard.press('Escape'); await page.waitForTimeout(700);}
// D. Type filter single-select via test ids
{await openSelByAria('Type');
 R.typeAria = await page.$$eval('.q-menu [role=option]',os=>os.map(o=>({tid:o.getAttribute('data-test-id'),sel:o.getAttribute('aria-selected'),t:o.innerText.trim()})));
 const from=netlog.length; const ok=await clickTid('option_pv_type_special_order'); await page.waitForTimeout(6500); await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
 R.typeSpecialOrder={clicked:ok, calls:apiPV(from), first:await firstRow(), rows:await rowCount()};
 await shot('pv-type-so-real');
 await openSelByAria('Type');
 R.typeAria2 = await page.$$eval('.q-menu [role=option]',os=>os.map(o=>({tid:o.getAttribute('data-test-id'),sel:o.getAttribute('aria-selected')})));
 await clickTid('option_pv_type_both'); await page.waitForTimeout(6000); await page.keyboard.press('Escape'); await page.waitForTimeout(1500);}
// E. Category + Vendor filters + AND logic
{await openSelByAria('Category');
 R.categoryOptions=(await page.$$eval('.q-menu [role=option]',os=>os.slice(0,6).map(o=>o.innerText.trim())));
 const its=await page.$$('.q-menu [role=option]');
 let picked=null; const from=netlog.length;
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t&&!/All categories|Clear all/.test(t)){await it.evaluate(x=>x.scrollIntoView({block:'center'}));const b=await it.boundingBox(); if(b&&b.y>0){await page.mouse.click(b.x+b.width/2,b.y+b.height/2);picked=t;break;}}}
 await page.waitForTimeout(6000); await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
 R.categoryFilter={picked, calls:apiPV(from), rows:await rowCount(), first:await firstRow()};
 // add a Vendor filter on top (AND)
 await openSelByAria('Vendor'); const its2=await page.$$('.q-menu [role=option]'); let v=null; const from2=netlog.length;
 for(const it of its2){const t=await it.evaluate(e=>e.innerText.trim()); if(t&&!/All vendors|Clear all/.test(t)){await it.evaluate(x=>x.scrollIntoView({block:'center'}));const b=await it.boundingBox(); if(b&&b.y>0){await page.mouse.click(b.x+b.width/2,b.y+b.height/2);v=t;break;}}}
 await page.waitForTimeout(6000); await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
 R.andLogic={vendor:v, calls:apiPV(from2), rows:await rowCount(), first:await firstRow()};
 await shot('pv-and-logic');
}
// F. Units Returned toggle -> canonical slot (position 7, after Units Sold)
{const cb=await page.$('[aria-label="Column Selection"]'); const b=await cb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 const its=await page.$$('.q-menu .q-item'); let done=false;
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Units Returned'){await it.evaluate(x=>x.scrollIntoView({block:'center'}));await page.waitForTimeout(400);
   const tg=await it.$('.q-toggle')||it; const bb=await tg.boundingBox(); if(bb&&bb.y>0){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);done=true;} break;}}
 await page.waitForTimeout(2500);
 R.unitsReturned={clicked:done, headers:await hdrTxt()};
 await shot('pv-units-returned-on');
 await page.keyboard.press('Escape'); await page.waitForTimeout(800);}
// G. date picker: 366-day cap
{const dr=await page.$('span.date-range-label'); const b=await dr.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 const clickBtn=async txt=>{const bs=await page.$$('.q-menu button'); for(const bt of bs){const t=await bt.evaluate(e=>e.innerText.trim()); if(t===txt){const bb=await bt.boundingBox(); if(bb&&bb.y>0){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); return true;}}} return false;};
 R.presetClick={last12: await clickBtn('Last 12 Months')};
 await page.waitForTimeout(1500);
 R.after12 = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const t=m?m.innerText:''; return {range:(t.match(/Range:\s*([0-9]+)\s*days/)||[])[1], head:t.split('\n')[0]};});
 // now go back 2 years in the calendar and click day 1 to make a >366 day span
 await clickBtn('chevron_left'); await page.waitForTimeout(400);
 R.calBackHead = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m?m.innerText.split('\n').slice(0,6).join(' | '):null;});
 fsSpan: {
   // click on the year chevron_left twice (2nd chevron pair is the year)
   const bs=await page.$$('.q-menu button');
   let ci=0; for(const bt of bs){const t=await bt.evaluate(e=>e.innerText.trim()); if(t==='chevron_left'){ci++; if(ci===2){const bb=await bt.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(500); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(600); break;}}}
 }
 R.calAfterYearBack = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m?m.innerText.split('\n').slice(0,6).join(' | '):null;});
 await clickBtn('1'); await page.waitForTimeout(900);
 R.afterBigSpan = await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const t=m?m.innerText:'';
   const b=[...(m?m.querySelectorAll('button'):[])].find(x=>x.innerText.trim()==='Apply');
   return {range:(t.match(/Range:\s*([0-9]+)\s*days/)||[])[1], head:t.split('\n')[0], applyDisabled:b?b.disabled:null, applyAria:b?b.getAttribute('aria-disabled'):null,
     warn:(t.match(/366|too (long|large)|maximum|max/i)||[])[0]||null};});
 await shot('pv-date-bigspan');
 const applied=await clickBtn('Apply'); await page.waitForTimeout(6000);
 R.afterApplyBigSpan={applied, label: await page.$eval('span.date-range-label',e=>e.innerText.trim()).catch(()=>null),
   calls: apiPV(netlog.length-8).slice(-3), toasts: await pollToasts(4000)};
 await shot('pv-date-after-apply');
}
fs.writeFileSync(`${OUT}/pv-ui-4.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,12000));
await browser.close();
