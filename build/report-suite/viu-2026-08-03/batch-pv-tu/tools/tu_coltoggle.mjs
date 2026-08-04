import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/tu/ui';
const { browser, page, netlog } = await boot('admin');
const R={}; const shot=n=>page.screenshot({path:`${OUT}/${n}.png`});
const hdrs=()=>page.$$eval('thead th',ths=>ths.map(th=>th.innerText.replace(/\n/g,' ').replace(/arrow_drop_\w+|keyboard_double_arrow_down|info_outline/g,'').trim()).filter(Boolean));
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(9000);
R.before=await hdrs();
const cb=await page.$('[data-test-id="button_column_selection"]');const b=await cb.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1500);
// enumerate menu rows with their toggle element
R.menuStructure = await page.$$eval('.q-menu .q-item', items=>items.map(i=>({text:i.innerText.replace(/\n/g,' ').trim(), html:i.innerHTML.slice(0,260)})));
const items=await page.$$('.q-menu .q-item');
let target=null;
for(const it of items){ const t=await it.evaluate(e=>e.innerText.trim()); if(t==='Est. Lost Labor'){target=it;break;} }
if(target){
  // click the toggle knob (right-hand control) inside the item
  const tg=await target.$('.q-toggle')||target;
  const bb=await tg.boundingBox();
  R.toggleBox=bb;
  R.toggleAria=await tg.evaluate(e=>({aria:e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked'), cls:e.className.toString()}));
  await page.mouse.click(bb.x+bb.width/2, bb.y+bb.height/2);
  await page.waitForTimeout(2000);
  R.afterToggleKnob={headers:await hdrs(), toggleAria: await tg.evaluate(e=>({aria:e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked'), cls:e.className.toString()}))};
  await shot('tu-coltoggle-after-knob');
  R.lsNow=await page.evaluate(()=>localStorage.getItem('report_view:technician-utilization'));
  // toggle back
  await page.mouse.click(bb.x+bb.width/2, bb.y+bb.height/2); await page.waitForTimeout(1800);
  R.afterToggleBack={headers:await hdrs()};
}
// keyboard-accessible name of the control (S8-R16)
R.colBtnAria = await cb.evaluate(e=>({aria:e.getAttribute('aria-label'), title:e.getAttribute('title')}));
// tooltip on hover
{const bb=await cb.boundingBox(); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
 await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(1500);
 R.colBtnTooltip=await page.$$eval('.q-tooltip',ts=>ts.map(t=>t.innerText));}
// PRINT control check on both reports
for(const slug of ['technician-utilization','parts-velocity']){
  await page.goto(APP+'/reports/'+slug,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(8000);
  const eb=await page.$('[aria-label="Export report"]'); const bb=await eb.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(1200);
  R['print_'+slug]={menu: await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText)),
    anyPrintWord: (await page.locator('body').innerText()).toLowerCase().includes('print'),
    printishButtons: await page.$$eval('button,[role=button]',bs=>bs.map(x=>x.getAttribute('aria-label')+'|'+x.innerText.trim().slice(0,20)).filter(s=>/print/i.test(s)))};
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
}
fs.writeFileSync(`${OUT}/tu-coltoggle.json`,JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,7000));
await browser.close();
