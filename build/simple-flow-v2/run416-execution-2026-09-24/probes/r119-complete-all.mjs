// C44597 run 2: with the review requirement on, finish a run opened by "Complete all lines".
// Expected: every open line completes, a message appears, you stay on the work order, and this is
// the moment the sign-off action appears in the header.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO=process.env.WO||'281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const lines=async()=>await page.evaluate(()=>[...document.querySelectorAll('tr')]
  .filter(t=>/^\d+\s+more_vert/.test((t.innerText||'').replace(/\s+/g,' ').trim())&&t.getBoundingClientRect().height)
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)));
const header=async()=>await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
  .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')||e.disabled}))
  .filter(b=>/Mark Reviewed|Create Invoice|Complete/i.test(b.t)));
await openWo(page,WO); await page.waitForTimeout(9000);
R.linesBefore=await lines(); R.headerBefore=await header();
console.log('lines before:'); R.linesBefore.forEach(l=>console.log('   ',l));
console.log('header before:',JSON.stringify(R.headerBefore.map(b=>b.t+(b.dis?' [greyed]':''))));
// find Complete all lines - header three-dot first, then the bulk bar
const dots=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();
  return r.width&&r.y<200&&/more_vert/.test((e.innerText||e.textContent||'').trim());}).pop();
  if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
let opened=false;
if(dots){ await page.mouse.click(dots.x,dots.y); await page.waitForTimeout(2200);
  const menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const r=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}):[];});
  console.log('\nthe header three-dot holds:',JSON.stringify(menu.map(m=>m.t+(m.dis?' [off]':''))));
  R.headerMenu=menu.map(m=>m.t);
  const c=menu.find(m=>/Complete all lines/i.test(m.t)&&!m.dis);
  if(c){ await page.mouse.click(c.x,c.y); opened=true; console.log('chose "Complete all lines" from the header'); await page.waitForTimeout(7000); }
  else { await page.keyboard.press('Escape'); await page.waitForTimeout(1000); } }
if(!opened){
  console.log('\nnot in the header - ticking every line and looking in the action bar');
  const tick=await page.evaluate(()=>{
    const sa=document.querySelector('[data-test-id="checkbox_select_all_lines"]');
    if(sa){ (sa.querySelector('input')||sa).click(); return 'pressed the select-all tick box'; }
    const c=[...document.querySelectorAll('[data-test-id^="line_checkbox"]')].filter(e=>e.getBoundingClientRect().width);
    if(c.length){ c.forEach(x=>(x.querySelector('input')||x).click()); return 'ticked '+c.length+' line boxes'; }
    return 'no line tick boxes found';});
  console.log(' ',tick); await page.waitForTimeout(4000);
  // the action bar is the strip that says "n selected" - find THAT element, not the whole page
  const bar=await page.evaluate(()=>{
    const host=[...document.querySelectorAll('div,section,footer')].filter(e=>{const r=e.getBoundingClientRect();
      return r.width>300&&r.height>0&&r.height<160&&/\bselected\b/i.test(e.innerText||'')&&(e.innerText||'').length<220;})
      .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
    if(!host)return {found:false, controls:[]};
    return {found:true, text:(host.innerText||'').replace(/\s+/g,' ').trim().slice(0,160),
      controls:[...host.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),
          dis:/disabled/.test(e.className||''),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};}).filter(b=>b.t)};});
  console.log('  the action bar:',bar.found?JSON.stringify(bar.text):'not found');
  console.log('  it offers:',JSON.stringify((bar.controls||[]).map(b=>b.t+(b.dis?' [off]':''))));
  R.bar=bar;
  let c=(bar.controls||[]).find(b=>/Complete all lines/i.test(b.t)&&!b.dis);
  if(!c){ // it may live behind More
    const more=(bar.controls||[]).find(b=>/^More/i.test(b.t));
    if(more){ await page.mouse.click(more.x,more.y); await page.waitForTimeout(2200);
      const m=await page.evaluate(()=>{const mm=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
        return mm?[...mm.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
          .map(i=>{const r=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}):[];});
      console.log('  behind More:',JSON.stringify(m.map(x=>x.t+(x.dis?' [off]':''))));
      R.more=m.map(x=>x.t);
      c=m.find(x=>/Complete all lines/i.test(x.t)&&!x.dis)||m.find(x=>/Complete/i.test(x.t)&&!x.dis);
      if(!c) await page.keyboard.press('Escape'); } }
  if(!c) c=(bar.controls||[]).find(b=>/^Complete/i.test(b.t)&&!b.dis);
  if(c){ await page.mouse.click(c.x,c.y); opened=true; console.log('  pressed',JSON.stringify(c.t)); await page.waitForTimeout(7000); }
}
if(!opened){ console.log('\nnothing here offers a way to complete every line'); }
else{
  // drive the wizard to its end
  R.steps=[];
  for(let i=0;i<8;i++){
    const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
      if(!q)return null;
      return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,220),
        buttons:[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
          .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
    if(!d){ console.log(`  step ${i+1}: nothing is open any more`); break; }
    console.log(`  step ${i+1}:`,JSON.stringify(d.text.slice(0,150)));
    console.log('          buttons:',JSON.stringify(d.buttons.map(b=>b.t+(b.dis?' [off]':''))));
    R.steps.push(d);
    await page.screenshot({path:`${EV}/r119-step${i+1}.png`}).catch(()=>{});
    const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
      const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')}))
        .filter(x=>x.t&&!/^(cancel|close|back|×)$/i.test(x.t));
      if(!c.length)return 'nothing to press'; const b=c[c.length-1];
      if(b.dis)return '"'+b.t+'" will not press'; b.e.click(); return 'pressed "'+b.t+'"';});
    console.log('         ',go);
    if(/nothing to press|will not press/.test(go)) break;
    await page.waitForTimeout(6000);
  }
  R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
  R.endedAt=page.url().replace('https://app.shopview.com','');
  console.log('\nit said:',JSON.stringify(R.toast));
  console.log('it ended at:',R.endedAt);
}
await page.waitForTimeout(3000);
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.linesAfter=await lines(); R.headerAfter=await header();
console.log('\nlines after:'); R.linesAfter.forEach(l=>console.log('   ',l));
console.log('header after:',JSON.stringify(R.headerAfter.map(b=>b.t+(b.dis?' [greyed]':''))));
await page.screenshot({path:`${EV}/r119-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r119-complete-all.json`,JSON.stringify(R,null,1));
await browser.close();
