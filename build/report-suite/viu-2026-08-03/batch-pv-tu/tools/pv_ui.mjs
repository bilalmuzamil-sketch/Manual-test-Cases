import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/pv/ui'; fs.mkdirSync(OUT,{recursive:true});
const { browser, page, netlog } = await boot('admin');
const rec = {};
await page.goto(APP+'/reports/parts-velocity',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
rec.url = page.url();
// 1. header order on screen
rec.headers = await page.$$eval('thead th', ths=>ths.map(th=>({text:th.innerText.replace(/\n/g,' ').trim(), aria:th.getAttribute('aria-sort'), testid:th.getAttribute('data-test-id')})));
// 2. toolbar control order
rec.toolbar = await page.$$eval('.q-toolbar, .report-toolbar, header', els=>els.map(e=>e.innerText.replace(/\n+/g,' | ').slice(0,400)));
rec.buttons = await page.$$eval('button', bs=>bs.map(b=>({t:b.innerText.trim().slice(0,40), aria:b.getAttribute('aria-label'), tid:b.getAttribute('data-test-id'), dis:b.disabled})).filter(b=>b.tid||b.aria));
// 3. column selector contents
const colBtn = await page.$('[aria-label="Column Selection"]');
if(colBtn){ const bb=await colBtn.boundingBox(); await page.mouse.click(bb.x+bb.width/2, bb.y+bb.height/2); await page.waitForTimeout(1200);
  rec.columnMenu = await page.$$eval('.q-menu', ms=>ms.map(m=>m.innerText));
  await page.screenshot({path:`${OUT}/pv-column-selector.png`});
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
// 4. export menu
const expBtn = await page.$('[aria-label="Export report"]');
if(expBtn){ const bb=await expBtn.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(1000);
  rec.exportMenu = await page.$$eval('.q-menu', ms=>ms.map(m=>m.innerText));
  await page.screenshot({path:`${OUT}/pv-export-menu.png`});
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
}
// 5. info icon tooltips (Units Sold, Demand)
rec.tooltips=[];
for (const label of ['Units Sold','Demand']){
  const icons = await page.$$('thead th .q-icon, thead th i');
  for (const ic of icons){
    const th = await ic.evaluateHandle(e=>e.closest('th'));
    const txt = await th.evaluate(e=>e.innerText.replace(/\n/g,' '));
    if(!txt.includes(label)) continue;
    const bb = await ic.boundingBox(); if(!bb) continue;
    await page.mouse.move(bb.x+bb.width/2, bb.y+bb.height/2); await page.waitForTimeout(1400);
    const tips = await page.$$eval('.q-tooltip', ts=>ts.map(t=>t.innerText));
    rec.tooltips.push({label, aria: await ic.evaluate(e=>e.getAttribute('aria-label')), title: await ic.evaluate(e=>e.getAttribute('title')), tips});
    await page.screenshot({path:`${OUT}/pv-tooltip-${label.replace(/\W/g,'')}.png`});
    await page.mouse.move(5,5); await page.waitForTimeout(400);
    break;
  }
}
// 6. alignment of cells on screen
rec.align = await page.evaluate(()=>{
  const out=[]; const ths=[...document.querySelectorAll('thead th')];
  ths.forEach((th,i)=>{ const cs=getComputedStyle(th); out.push({col:th.innerText.replace(/\n/g,' ').trim(), thAlign:cs.textAlign, thFontWeight:cs.fontWeight, thBg:cs.backgroundColor}); });
  return out;
});
// 7. date range picker
const dr = await page.$('span.date-range-label') || await page.$('[data-testid*="date-range"]');
if(dr){ const bb=await dr.boundingBox(); rec.dateLabelBefore = await dr.evaluate(e=>e.innerText.trim());
  await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(1200);
  rec.datePopup = await page.$$eval('.q-menu, .q-popup-proxy', ms=>ms.map(m=>m.innerText));
  await page.screenshot({path:`${OUT}/pv-date-picker.png`, fullPage:false});
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
}
// 8. page background / card styles (visual)
rec.visual = await page.evaluate(()=>{
  const body=getComputedStyle(document.body);
  const tb=document.querySelector('.q-toolbar')||document.querySelector('header');
  const th=document.querySelector('thead th'); const td=document.querySelector('tbody td');
  const card=document.querySelector('.q-card')||th?.closest('div');
  return { bodyBg:body.backgroundColor,
    toolbarBg: tb?getComputedStyle(tb).backgroundColor:null, toolbarPad: tb?getComputedStyle(tb).padding:null,
    thBg: th?getComputedStyle(th).backgroundColor:null, thBorderTop: th?getComputedStyle(th).borderTopWidth+' '+getComputedStyle(th).borderTopColor:null,
    thPosition: th?getComputedStyle(th).position:null,
    tdBg: td?getComputedStyle(td).backgroundColor:null,
    cardRadius: card?getComputedStyle(card).borderRadius:null };
});
await page.screenshot({path:`${OUT}/pv-page.png`, fullPage:false});
rec.netlog = netlog.map(n=>n.status+' '+n.method+' '+n.url.replace(/^https:\/\/[^/]+/,''));
fs.writeFileSync(`${OUT}/pv-ui-1.json`, JSON.stringify(rec,null,1));
console.log(JSON.stringify(rec,null,1).slice(0,7000));
await browser.close();
