import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/tu/ui'; fs.mkdirSync(OUT,{recursive:true});
const { browser, page, netlog } = await boot('admin');
const R={};
const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
R.url=page.url();
const grab=async()=>({
  headers: await page.$$eval('thead th',ths=>ths.map(th=>({t:th.innerText.replace(/\n/g,' ').trim(), aria:th.getAttribute('aria-sort'), tid:th.getAttribute('data-test-id')}))),
  rows: await page.$$eval('tbody tr',trs=>trs.map(tr=>[...tr.querySelectorAll('td,th')].map(td=>td.innerText.replace(/\n/g,' ').trim()))),
});
R.initial=await grab();
R.dateBtn = await page.$$eval('button,[role=button]',bs=>bs.map(b=>({t:b.innerText.replace(/\n/g,' ').trim().slice(0,60),aria:b.getAttribute('aria-label'),tid:b.getAttribute('data-test-id')})).filter(b=>b.tid||b.aria));
await shot('tu-default-thismonth');
// localStorage keys
R.lsKeys = await page.evaluate(()=>Object.keys(localStorage).map(k=>({k, v:String(localStorage.getItem(k)).slice(0,300)})));
// export menu
const eb=await page.$('[aria-label="Export report"]');
if(eb){const b=await eb.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1200);
 R.exportMenu=await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText)); await shot('tu-export-menu'); await page.keyboard.press('Escape');await page.waitForTimeout(500);}
// column selector
const cb=await page.$('[aria-label="Column Selection"]')||await page.$('[data-test-id="button_column_selection"]');
if(cb){const b=await cb.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1200);
 R.columnMenu=await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText));
 R.columnItems=await page.$$eval('.q-menu .q-item, .q-menu .q-checkbox, .q-menu .q-toggle',is=>is.map(i=>({t:i.innerText.replace(/\n/g,' ').trim(),cls:i.className.toString().slice(0,140),aria:i.getAttribute('aria-disabled'),dis:i.classList.contains('disabled')||i.classList.contains('q-checkbox--disabled')})));
 await shot('tu-column-selector'); await page.keyboard.press('Escape');await page.waitForTimeout(500);}
// filters (selects)
R.selects = await page.$$eval('.q-select',ss=>ss.map(s=>({t:s.innerText.replace(/\n/g,' ').trim().slice(0,80),tid:s.getAttribute('data-test-id')})));
// technician filter contents
const sels=await page.$$('.q-select');
for (let i=0;i<sels.length;i++){
  const txt=await sels[i].evaluate(e=>e.innerText.replace(/\n/g,' ').trim());
  const b=await sels[i].boundingBox(); if(!b) continue;
  await page.mouse.click(b.x+b.width-14,b.y+b.height/2); await page.waitForTimeout(1200);
  const menus=await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText));
  R['filter'+i]={label:txt,menus}; await shot('tu-filter-'+i+'-'+txt.replace(/\W+/g,'_').slice(0,28));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
}
// expand-all control + per-row expand
const ea=await page.$('[data-test-id="button_tu_expand_all"]');
R.expandAll = ea? {aria: await ea.evaluate(e=>e.getAttribute('aria-label')), text: await ea.evaluate(e=>e.innerText.trim())}:null;
R.rowExpandControls = await page.$$eval('tbody tr button, tbody tr [role=button]', bs=>bs.map(b=>({aria:b.getAttribute('aria-label'),exp:b.getAttribute('aria-expanded'),t:b.innerText.trim().slice(0,30),tid:b.getAttribute('data-test-id')})));
const before=netlog.length;
if(R.rowExpandControls.length){
  const btn=(await page.$$('tbody tr button'))[0];
  const b=await btn.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(4000);
  R.afterExpand=await grab();
  R.expandNet=netlog.slice(before).filter(n=>n.url.includes('/api/')).map(n=>n.status+' '+n.method+' '+n.url.replace(/^https:\/\/[^/]+/,''));
  R.rowExpandControlsAfter = await page.$$eval('tbody tr button', bs=>bs.map(b=>({aria:b.getAttribute('aria-label'),exp:b.getAttribute('aria-expanded')})));
  await shot('tu-row-expanded');
}
// Est Lost Labor info icon
const ic=await page.$('[data-test-id="icon_tu_est_lost_labor_info"]');
if(ic){ const b=await ic.boundingBox(); R.ellIcon={aria:await ic.evaluate(e=>e.getAttribute('aria-label')), title:await ic.evaluate(e=>e.getAttribute('title'))};
 await page.mouse.move(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(1500);
 R.ellTooltip=await page.$$eval('.q-tooltip',ts=>ts.map(t=>t.innerText)); await shot('tu-ell-tooltip'); await page.mouse.move(5,5);}
// link on Total Hours
R.links = await page.$$eval('tbody a, tbody [role=link]',as=>as.map(a=>({t:a.innerText.trim(),href:a.getAttribute('href'),td:a.getAttribute('target'),style:getComputedStyle(a).textDecorationLine+' / '+getComputedStyle(a).color})));
// visual
R.visual = await page.evaluate(()=>{const th=document.querySelector('thead th'),td=document.querySelector('tbody td');
 const sum=[...document.querySelectorAll('tbody tr, tfoot tr')].find(tr=>/Summary/.test(tr.innerText));
 return {thBg:th&&getComputedStyle(th).backgroundColor, tdBg:td&&getComputedStyle(td).backgroundColor,
  rowBgs:[...document.querySelectorAll('tbody tr')].slice(0,4).map(tr=>getComputedStyle(tr).backgroundColor),
  summaryText: sum&&sum.innerText.replace(/\n/g,' | '), summaryPos: sum&&getComputedStyle(sum).position,
  ellHeaderWeight: [...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/\n/g,' ').trim()+'='+getComputedStyle(t).fontWeight+'/'+getComputedStyle(t).position)};});
R.net=netlog.filter(n=>n.url.includes('/api/reporting')).map(n=>n.status+' '+n.method+' '+n.url.replace(/^https:\/\/[^/]+/,''));
fs.writeFileSync(`${OUT}/tu-ui-1.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,12000));
await browser.close();
