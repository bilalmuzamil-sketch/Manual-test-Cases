import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/pv/ui';
const { browser, page, netlog } = await boot('admin');
const R={}; const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const hdrs=()=>page.$$eval('thead th',ths=>ths.map(th=>({t:th.innerText.replace(/\n/g,' ').replace(/info_outline/g,'').trim(),aria:th.getAttribute('aria-sort')})));
const toasts=()=>page.$$eval('.q-notification__message,.q-notification',ns=>ns.map(n=>n.innerText.replace(/\n/g,' ').trim()));
const apiPV=from=>netlog.slice(from).filter(n=>n.url.includes('/api/reporting/reports/parts-velocity')).map(n=>n.status+' '+decodeURIComponent(n.url.replace(/^https:\/\/[^/]+\/api\/reporting\/reports\/parts-velocity/,'')));
const clickMenuItem=async txt=>{const its=await page.$$('.q-menu .q-item');for(const it of its){const t=(await it.evaluate(e=>e.innerText.trim()));if(t===txt){const b=await it.boundingBox();if(b){await page.mouse.click(b.x+b.width/2,b.y+b.height/2);return t;}}}return null;};
const openSelByLabel=async lbl=>{const ss=await page.$$('.q-select');for(const s of ss){const t=await s.evaluate(e=>e.innerText.replace(/\n/g,' '));if(t.includes(lbl)){const b=await s.boundingBox();await page.mouse.click(b.x+b.width-14,b.y+b.height/2);await page.waitForTimeout(1300);return true;}}return false;};
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(10000);
R.initialHeaders=await hdrs();
R.lsInitial=await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'));
// 1. default sort indicator on Demand
R.demandIndicator = await page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').trim()).filter(t=>/Demand/.test(t)));
// 2. click Part # header (not active) -> ascending, server call
{let from=netlog.length; const ths=await page.$$('thead th');
 for(const th of ths){const t=await th.evaluate(e=>e.innerText.trim()); if(t.startsWith('Part #')){const b=await th.boundingBox();await page.mouse.click(b.x+30,b.y+b.height/2);break;}}
 await page.waitForTimeout(6000);
 R.sortPartAsc={headers:await hdrs(), calls:apiPV(from), firstRows: await page.$$eval('tbody tr',trs=>trs.slice(0,3).map(tr=>[...tr.querySelectorAll('td')].slice(0,2).map(td=>td.innerText.trim()).join(' | ')))};
 from=netlog.length;
 for(const th of ths){const t=await th.evaluate(e=>e.innerText.trim()); if(t.startsWith('Part #')){const b=await th.boundingBox();await page.mouse.click(b.x+30,b.y+b.height/2);break;}}
 await page.waitForTimeout(6000);
 R.sortPartDesc={headers:await hdrs(), calls:apiPV(from), firstRows: await page.$$eval('tbody tr',trs=>trs.slice(0,3).map(tr=>[...tr.querySelectorAll('td')].slice(0,2).map(td=>td.innerText.trim()).join(' | ')))};
 await shot('pv-sorted-partnum-desc');
}
// 3. Type filter -> Special Order, reload
{const from=netlog.length; await openSelByLabel('Type');
 R.typeOptions=await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText));
 await clickMenuItem('Special Order'); await page.waitForTimeout(5000); await page.keyboard.press('Escape');await page.waitForTimeout(1500);
 R.typeSpecialOrder={calls:apiPV(from), headers:await hdrs(),
  firstRow: await page.$$eval('tbody tr',trs=>trs.slice(0,2).map(tr=>[...tr.querySelectorAll('td')].map(td=>td.innerText.trim())))};
 await shot('pv-type-specialorder');
}
// 4. Bin filter + Special Order = empty by design
{const from=netlog.length; await openSelByLabel('Bin');
 R.binOptions=(await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText)))[0]?.slice(0,300);
 const its=await page.$$('.q-menu .q-item'); let picked=null;
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t && !/^All bins$/.test(t) && !/Clear all/.test(t)){const b=await it.boundingBox(); if(b){await page.mouse.click(b.x+b.width/2,b.y+b.height/2); picked=t; break;}}}
 await page.waitForTimeout(4500); await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
 R.binPlusSpecialOrder={pickedBin:picked, calls:apiPV(from), rowCount:(await page.$$('tbody tr')).length,
   emptyShown:(await page.locator('body').innerText()).includes('Empty bays, endless possibilities. Get Going!')};
 await shot('pv-bin-plus-specialorder-empty');
}
// 5. export with empty result -> toast?
{const from=netlog.length; const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1000);
 const dlp=page.waitForEvent('download',{timeout:20000}).catch(()=>null);
 await clickMenuItem('Download (CSV)'); await page.waitForTimeout(4000);
 const d=await dlp;
 R.emptyExport={toasts:await toasts(), downloaded: d?d.suggestedFilename():null,
   calls: netlog.slice(from).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,120))};
 await shot('pv-empty-export'); await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// 6. clear filters back: Type=Both, Bin=Clear all
{await openSelByLabel('Bin'); await clickMenuItem('Clear all'); await page.waitForTimeout(3000); await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
 await openSelByLabel('Type'); await clickMenuItem('Both'); await page.waitForTimeout(4500); await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
 R.restored={rowsPresent:(await page.$$('tbody tr')).length};}
// 7. successful export toast text
{const from=netlog.length; const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1000);
 const dlp=page.waitForEvent('download',{timeout:60000}).catch(()=>null);
 await clickMenuItem('Download (CSV)'); await page.waitForTimeout(2000);
 const t1=await toasts(); const d=await dlp; let fn=null; if(d){fn=d.suggestedFilename(); await d.saveAs(`${OUT}/dl-${fn}`);}
 await page.waitForTimeout(2000);
 R.csvExport={toastsEarly:t1, toastsLate:await toasts(), filename:fn,
  calls: netlog.slice(from).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+decodeURIComponent(n.url.replace(/^https:\/\/[^/]+/,'')).slice(0,220))};
 await shot('pv-csv-export-toast'); await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// 8. PDF export at whole-list scope -> error toast text
{const from=netlog.length; const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1000);
 await clickMenuItem('Download (PDF)'); await page.waitForTimeout(60000);
 R.pdfExportWholeList={toasts:await toasts(),
  calls: netlog.slice(from).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,140))};
 await shot('pv-pdf-export-error-toast'); await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// 9. column toggle: enable Turns/Yr and confirm canonical slot + no reload + its info icon
{const from=netlog.length; const cb=await page.$('[aria-label="Column Selection"]'); const b=await cb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1300);
 const its=await page.$$('.q-menu .q-item');
 for(const it of its){const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Turns/Yr'){const tg=await it.$('.q-toggle')||it; const bb=await tg.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); break;}}
 await page.waitForTimeout(2500);
 R.turnsEnabled={headers:await hdrs(), reloadCalls:apiPV(from).length};
 await page.keyboard.press('Escape'); await page.waitForTimeout(800);
 R.turnsIcon = await page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').trim()).filter(t=>/Turns/.test(t)));
 await shot('pv-turns-enabled');
 R.lsAfterColumns=await page.evaluate(()=>localStorage.getItem('report_view:parts-velocity'));
}
// 10. truncation / ellipsis
R.truncation = await page.evaluate(()=>{
  const trs=[...document.querySelectorAll('tbody tr')].slice(0,40);
  const out=[];
  for(const tr of trs){const tds=[...tr.querySelectorAll('td')];
    if(tds.length<5) continue;
    const g=i=>({text:tds[i].innerText.trim(), title:tds[i].getAttribute('title')||tds[i].querySelector('[title]')?.getAttribute('title')||null,
      overflow:getComputedStyle(tds[i]).textOverflow, white:getComputedStyle(tds[i]).whiteSpace, align:getComputedStyle(tds[i]).textAlign,
      scrollW:tds[i].scrollWidth, clientW:tds[i].clientWidth});
    out.push({part:g(1), desc:g(2), cat:g(3), vend:g(4)});
    if(out.length>=3) break;}
  return out;});
R.cellAlign = await page.evaluate(()=>{const tr=document.querySelector('tbody tr'); if(!tr) return null;
  return [...tr.querySelectorAll('td')].map((td,i)=>i+':'+getComputedStyle(td).textAlign);});
fs.writeFileSync(`${OUT}/pv-ui-2.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,11000));
await browser.close();
