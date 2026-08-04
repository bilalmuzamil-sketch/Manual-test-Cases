import {boot,APP} from './boot.mjs';
import fs from 'fs';
const {browser,page}=await boot({tz:'America/Edmonton',viewport:{width:1680,height:1050}});
const E='/tmp/sviu/evidence/'; const F={};
await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(9000);
const inp=await page.$('[data-test-id=input_sidebar_search]'); await inp.click(); await inp.fill('S-14531'); await page.waitForTimeout(2500);
const c2=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=sidebar_work_order_card]'); const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
const R=await page.evaluate(()=>[...document.querySelectorAll('.fc-datagrid-body tr')].map(tr=>({t:tr.innerText.trim().replace(/\n/g,' '),y:tr.getBoundingClientRect().y+tr.getBoundingClientRect().height/2})));
const C=await page.evaluate(()=>[...document.querySelectorAll('.fc-timeline-header-row th')].map(th=>({cls:th.className.match(/fc-day-\w+/)?.[0]||'',x:th.getBoundingClientRect().x+th.getBoundingClientRect().width/2})));
const tgt=R.find(r=>/Brittany Anderson/.test(r.t)); const fri=C.find(c=>c.cls==='fc-day-fri');
console.log('tgt',JSON.stringify(tgt));
const drop=async()=>{await page.mouse.move(c2.x,c2.y); await page.mouse.down();
  for(let k=1;k<=12;k++){await page.mouse.move(c2.x+(fri.x-c2.x)*k/12,c2.y+(tgt.y-c2.y)*k/12,{steps:2}); await page.waitForTimeout(85);}
  await page.mouse.up(); await page.waitForTimeout(2800);};
await drop();
F.scope=await page.evaluate(()=>document.querySelector('.q-menu')?.innerText.trim().slice(0,400)||null);
console.log('SCOPE',JSON.stringify(F.scope));
// Select multiple -> Select all
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const b=[...m.querySelectorAll('button')].find(e=>/Select multiple/.test(e.innerText)); if(b)b.click();});
await page.waitForTimeout(1600);
await page.screenshot({path:E+'94-select-multiple.png'});
F.selMulti=await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m?{text:m.innerText.trim().slice(0,700),cbs:m.querySelectorAll('.q-checkbox').length,btns:[...m.querySelectorAll('button')].map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean).slice(0,10)}:null;});
console.log('SEL MULTI',JSON.stringify(F.selMulti,null,1));
await page.keyboard.press('Escape'); await page.waitForTimeout(1400);
// whole order -> spread step custom options
await drop();
await page.evaluate(()=>{const m=document.querySelector('.q-menu'); const b=[...m.querySelectorAll('button')].find(e=>/Schedule whole work order/.test(e.innerText)); b.click();});
await page.waitForTimeout(3000);
F.spreadBase=await page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.trim().slice(0,500)||null);
console.log('SPREAD BASE',JSON.stringify(F.spreadBase));
for(const opt of ['Until a date','Specific hours']){
  const ok=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(!d)return false; const i=[...d.querySelectorAll('input')][0]; if(!i)return false; i.click(); return true;});
  if(!ok){console.log('no dialog for',opt); break;}
  await page.waitForTimeout(1300);
  await page.evaluate(o=>{const ms=[...document.querySelectorAll('.q-menu')]; const m=ms[ms.length-1]; if(!m)return; const it=[...m.querySelectorAll('.q-item')].find(e=>e.innerText.includes(o)); if(it)it.click();},opt);
  await page.waitForTimeout(1900);
  await page.screenshot({path:E+'95-spread-'+opt.replace(/\s/g,'-')+'.png'});
  F['sp_'+opt]=await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.trim().slice(0,700),inputs:[...d.querySelectorAll('input')].map(i=>({t:i.type,v:i.value}))}:null;});
  console.log(opt,'->',JSON.stringify(F['sp_'+opt],null,1));
}
await page.evaluate(()=>{const d=document.querySelector('.q-dialog'); if(d){const b=[...d.querySelectorAll('button')].find(e=>/^Cancel$/.test(e.innerText.trim())); if(b)b.click();}});
fs.writeFileSync('/tmp/sviu/f-batch16.json',JSON.stringify(F,null,1));
await browser.close();
