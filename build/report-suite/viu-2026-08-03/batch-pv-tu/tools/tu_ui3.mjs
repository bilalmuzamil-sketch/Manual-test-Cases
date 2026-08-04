import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/tu/ui'; fs.mkdirSync(OUT,{recursive:true});
const { browser, page, netlog } = await boot('admin');
const R={}; const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const rows=()=>page.$$eval('tbody tr',trs=>trs.map(tr=>[...tr.querySelectorAll('td,th')].map(td=>td.innerText.replace(/\n/g,' ').trim())).filter(r=>r.join('')));
const hdrs=()=>page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').trim()));
const toasts=()=>page.$$eval('.q-notification, .q-notification__message',ns=>ns.map(n=>n.innerText.replace(/\n/g,' ').trim()));
const openSel=async i=>{const s=(await page.$$('.q-select'))[i];const b=await s.boundingBox();await page.mouse.click(b.x+b.width-14,b.y+b.height/2);await page.waitForTimeout(1200);};
const clickMenuItem=async txt=>{const its=await page.$$('.q-menu .q-item');for(const it of its){const t=(await it.evaluate(e=>e.innerText.trim()));if(t===txt||t.startsWith(txt)){const b=await it.boundingBox();if(b){await page.mouse.click(b.x+b.width/2,b.y+b.height/2);return t;}}}return null;};
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(9000);
R.startHeaders=await hdrs(); R.startRows=await rows();
// --- 1. technician filter: deselect one -> row hidden, summary recalcs, no reload
{const before=netlog.length; await openSel(1);
 const names=(await rows()).filter(r=>!/^Summary/.test(r[0])).map(r=>r[0].replace(/^\S+\s/,''));
 R.techNames=names;
 const picked=await clickMenuItem(names[0]);
 await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
 R.afterDeselect={picked, rows:await rows(), selLabel: await (await page.$$('.q-select'))[1].evaluate(e=>e.innerText.replace(/\n/g,' ').trim()),
   reloadCalls: netlog.slice(before).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).length};
 await shot('tu-tech-deselected');
}
// --- 2. Clear all -> empty state, no Summary
{const before=netlog.length; await openSel(1); const c=await clickMenuItem('Clear all'); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
 R.afterClearAll={clicked:c, rows:await rows(), bodyHas: (await page.locator('body').innerText()).includes('Empty bays, endless possibilities. Get Going!'),
   emptyText: await page.$$eval('table, .q-table, main',es=>es.map(e=>e.innerText.replace(/\n+/g,' | ')).join(' ~~ ').slice(-300)),
   reloadCalls: netlog.slice(before).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).length};
 await shot('tu-tech-cleared-empty');
 // download with none selected -> silent no-op
 const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
 const dlBefore=netlog.length; const it=await clickMenuItem('Summary (CSV)'); await page.waitForTimeout(3500);
 R.noSelectionDownload={clicked:it, toasts:await toasts(), exportCalls: netlog.slice(dlBefore).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,120))};
 await shot('tu-noselection-download');
 await page.keyboard.press('Escape'); await page.waitForTimeout(500);
 // restore: All technicians
 await openSel(1); await clickMenuItem('All technicians'); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
 R.afterRestoreAll={rows:(await rows()).length};
}
// --- 3. column toggle
{const cb=await page.$('[data-test-id="button_column_selection"]'); const b=await cb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1200);
 const before=netlog.length;
 const tog=await clickMenuItem('Est. Lost Labor'); await page.waitForTimeout(1500);
 R.afterToggleOffELL={clicked:tog, headers:await hdrs(), reloadCalls: netlog.slice(before).filter(n=>n.url.includes('/api/reporting/reports/technician-utilization')).length};
 await shot('tu-ell-hidden');
 // toggle Total Hours off too
 await clickMenuItem('Total Hours'); await page.waitForTimeout(1200); R.afterToggleOffTotal={headers:await hdrs()};
 // toggle both back on
 await clickMenuItem('Total Hours'); await page.waitForTimeout(900); await clickMenuItem('Est. Lost Labor'); await page.waitForTimeout(1200);
 R.afterToggleBackOn={headers:await hdrs()};
 await page.keyboard.press('Escape'); await page.waitForTimeout(600);
 R.lsColumns = await page.evaluate(()=>localStorage.getItem('report_view:technician-utilization'));
}
// --- 4. downloads + toasts (all four menu items)
R.downloads=[];
for (const item of ['Summary (PDF)','Summary (CSV)','Expanded (PDF)','Expanded (CSV)']){
  const eb=await page.$('[aria-label="Export report"]'); const b=await eb.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(900);
  const before=netlog.length;
  const dlp = page.waitForEvent('download',{timeout:45000}).catch(()=>null);
  const clicked=await clickMenuItem(item); await page.waitForTimeout(1200);
  const t1=await toasts();
  const d=await dlp; let fn=null;
  if(d){ fn=d.suggestedFilename(); await d.saveAs(`${OUT}/dl-${fn}`); }
  await page.waitForTimeout(1500);
  R.downloads.push({item, clicked, filename:fn, toastsAtStart:t1, toastsAfter:await toasts(),
    calls: netlog.slice(before).filter(n=>n.url.includes('/export')).map(n=>n.status+' '+n.url.replace(/^https:\/\/[^/]+/,'').slice(0,160))});
  await shot('tu-download-'+item.replace(/\W+/g,'_'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// --- 5. dark mode
await page.evaluate(()=>{localStorage.setItem('mode','"dark"')});
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(8000);
R.dark = await page.evaluate(()=>{const th=document.querySelector('thead th'),td=document.querySelector('tbody td');
 const a=document.querySelector('tbody a'); const ic=document.querySelector('[data-test-id="icon_tu_est_lost_labor_info"]');
 return {bodyClass:document.body.className, bodyBg:getComputedStyle(document.body).backgroundColor,
  thBg:th&&getComputedStyle(th).backgroundColor, thColor:th&&getComputedStyle(th).color,
  tdBg:td&&getComputedStyle(td).backgroundColor, tdColor:td&&getComputedStyle(td).color,
  linkColor:a&&getComputedStyle(a).color, iconColor:ic&&getComputedStyle(ic).color};});
await shot('tu-dark-mode');
await page.evaluate(()=>{localStorage.setItem('mode','"light"')});
fs.writeFileSync(`${OUT}/tu-ui-3.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,10000));
await browser.close();
