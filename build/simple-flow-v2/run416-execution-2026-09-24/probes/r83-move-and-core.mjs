// C44605 - move a part to a DIFFERENT line (the last piece besides two people at once)
// C53489 - a deferred part's core follows its parent. A427 was ordered rather than taken from stock,
//          and catalogue parts carry cores, so its core should appear once it is received or deferred.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,340),
    fields:[...d.querySelectorAll('.q-field')].filter(vis).map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const poll=async(ms=12000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(700);}return null;};
const structure=async()=>await page.evaluate(()=>{const out=[];let cur=null;
  for(const tr of document.querySelectorAll('tr')){
    const m=(tr.className||'').match(/line-row-([0-9a-f-]+)/);
    const t=(tr.innerText||'').replace(/\s+/g,' ').trim();
    if(m){ cur=t.slice(0,44); out.push({kind:'LINE',t:cur}); }
    else if(/drag_indicator|Core/i.test(t)) out.push({kind:'part',line:cur,t:t.slice(0,80)});}
  return out;});
await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await structure();
console.log('before:'); R.before.forEach(r=>console.log('  ',r.kind==='LINE'?('LINE  '+r.t):('   part ('+(r.line||'').slice(0,20)+') '+r.t)));
// --- move a part ---
const spot=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/drag_indicator/.test(t.innerText||''));
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),part:(row.innerText||'').replace(/\s+/g,' ').slice(0,60)};});
console.log('\nmoving:',JSON.stringify(spot&&spot.part));
if(spot){ await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(2200);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),dis:/disabled/.test(i.className),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):[];});
  console.log('   its menu:',JSON.stringify(items.map(i=>i.t+(i.dis?' [disabled]':''))));
  const mv=items.find(i=>/^Move$/i.test(i.t)&&!i.dis);
  if(mv){ await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(4500);
    R.moveDialog=await poll(12000);
    console.log('\n   Move opens:',JSON.stringify(R.moveDialog&&R.moveDialog.text.slice(0,260)));
    console.log('   fields :',JSON.stringify(R.moveDialog&&R.moveDialog.fields));
    console.log('   buttons:',JSON.stringify((R.moveDialog&&R.moveDialog.buttons||[]).map(b=>b.t+(b.disabled?' [disabled]':''))));
    await page.screenshot({path:`${EV}/r83-move.png`}).catch(()=>{});
    if(R.moveDialog){
      // choose a different line, then confirm
      const f=(R.moveDialog.fields||[]).findIndex(x=>/line/i.test(x));
      if(f>=0){ const b=page.locator('.q-dialog .q-field').nth(f); await b.click().catch(()=>{}); await page.waitForTimeout(2500);
        R.lineChoices=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width)
          .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,44),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}));
        console.log('   lines it offers to move to:',JSON.stringify(R.lineChoices.map(c=>c.t)));
        if(R.lineChoices.length){ await page.mouse.click(R.lineChoices[R.lineChoices.length-1].x,R.lineChoices[R.lineChoices.length-1].y);
          console.log('   chose',JSON.stringify(R.lineChoices[R.lineChoices.length-1].t)); await page.waitForTimeout(2200); } }
      // Do not guess the confirm button's wording. List what the dialog offers, then press the last
      // enabled one that is not a cancel or a close - which is where a confirm sits in this product.
      const go=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
        const all=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
          .map(e=>({e, t:(e.innerText||'').replace(/\s+/g,' ').trim(), dis:/disabled/.test(e.className||'')}));
        const names=all.map(a=>a.t+(a.dis?' [disabled]':''));
        const c=all.filter(a=>a.t && !a.dis && !/^(cancel|close|×)$/i.test(a.t));
        if(!c.length) return 'nothing pressable; the dialog offers: '+names.join(' | ');
        const pick=c[c.length-1]; pick.e.click();
        return 'pressed "'+pick.t+'" (the dialog offered: '+names.join(' | ')+')';});
      console.log('   ',go); await page.waitForTimeout(6000); }
  } else console.log('   Move is not offered'); }
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await structure();
console.log('\nafter:'); R.after.forEach(r=>console.log('  ',r.kind==='LINE'?('LINE  '+r.t):('   part ('+(r.line||'').slice(0,20)+') '+r.t)));
const key=s=>s.slice(0,34);
R.moved=[];
for(const b of R.before.filter(x=>x.kind==='part')){ const a=R.after.find(x=>x.kind==='part'&&key(x.t)===key(b.t));
  if(a && a.line!==b.line) R.moved.push({part:key(b.t),from:b.line,to:a.line}); }
console.log('\nparts that changed line:',JSON.stringify(R.moved));
await page.screenshot({path:`${EV}/r83-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r83-move.json`,JSON.stringify(R,null,1));
await browser.close();
