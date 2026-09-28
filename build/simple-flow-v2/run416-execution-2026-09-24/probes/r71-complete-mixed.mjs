// The line now carries parts in every state at once: one ordered and awaiting receipt, one picked
// with its core showing, and three still to pick. Pressing Complete on it answers two checks:
//   C44561 - an approved line completes whatever the state of its parts
//   C44597 - where a run opened by Complete on a LINE ends (this time there IS outstanding work,
//            so a real wizard run happens, unlike the empty line I tried before)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={steps:[]};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>100;}).pop();
  if(!d)return null; return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,300),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),disabled:/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const waitDlg=async(ms=10000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(800);}return null;};
const pressIn=async(rx,label)=>{const r=await page.evaluate((src)=>{const re=new RegExp(src,'i');
    const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); if(!d)return 'no dialog';
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>re.test((e.innerText||'').replace(/\s+/g,' ').trim())); if(!b)return 'not pressable'; b.click(); return 'pressed '+(b.innerText||'').trim();},rx.source);
  console.log('      ',label,'->',r); await page.waitForTimeout(5000); return r;};
const snapshot=async()=>await page.evaluate(()=>({
  lines:[...document.querySelectorAll('tr[class*="line-row-"]')].map(r=>({
    status:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'),
    buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)})),
  parts:[...document.querySelectorAll('tr')].filter(t=>/drag_indicator|Core/i.test(t.innerText||''))
    .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,100))}));

await openWo(page,WO); await page.waitForTimeout(9000);
R.before=await snapshot();
console.log('BEFORE - lines:'); R.before.lines.forEach(l=>console.log('   ',l.status||'(none)','->',JSON.stringify(l.buttons)));
console.log('BEFORE - parts:'); R.before.parts.forEach(p=>console.log('   ',p));
const pressed=await page.evaluate(()=>{const r=[...document.querySelectorAll('tr[class*="line-row-"]')]
    .find(x=>[...x.querySelectorAll('button,.q-btn')].some(b=>/^Complete$/i.test((b.innerText||'').trim())));
  if(!r)return 'no line offers Complete';
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); b.click(); return 'pressed Complete on a line';});
console.log('\n',pressed);
let g=0;
while(g++<10){
  const d=await waitDlg(8000);
  if(!d){ console.log('   the run has ended - no window left'); break; }
  const b=d.buttons.map(x=>x.t);
  console.log('\n   step',g,':',JSON.stringify(d.text.slice(0,110)));
  console.log('           buttons:',JSON.stringify(b));
  R.steps.push({text:d.text.slice(0,200),buttons:b});
  await page.screenshot({path:`${EV}/r71-step${g}.png`}).catch(()=>{});
  if(b.filter(x=>/^OK · Returned$/i.test(x)).length){
    await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      [...q.querySelectorAll('button,.q-btn')].filter(e=>/^OK · Returned$/i.test((e.innerText||'').replace(/\s+/g,' ').trim())).forEach(e=>e.click());});
    console.log('       decided the cores'); await page.waitForTimeout(3500); continue; }
  if(b.some(x=>/^Pick All$/i.test(x)))        { await pressIn(/^Pick All$/,'pick all'); continue; }
  if(b.some(x=>/^Complete Line$/i.test(x)))   { await pressIn(/^Complete Line$/,'complete the line'); continue; }
  if(b.some(x=>/Continue Without Resolving/i.test(x))) { await pressIn(/Continue Without Resolving/,'skip cores'); continue; }
  if(b.some(x=>/^Receive Parts$/i.test(x)))   { console.log('       it is offering to receive - NOT pressing, the point is that the line completes anyway'); 
    const alt=b.find(x=>/^Finish Work Order$|^Complete Line$/i.test(x));
    if(alt){ await pressIn(new RegExp('^'+alt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'),'completing instead'); continue; }
    break; }
  console.log('       nothing I should press here; stopping'); break;
}
await page.waitForTimeout(3000);
R.endedOn=await page.evaluate(()=>({url:location.href,
  dialogOpen:!!([...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop()),
  heading:(document.body.innerText.replace(/\s+/g,' ').match(/New Customer Payment|Payment|Finance/)||[])[0]||null}));
console.log('\nwhere the run ended:',JSON.stringify(R.endedOn));
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await snapshot();
console.log('\nAFTER - lines:'); R.after.lines.forEach(l=>console.log('   ',l.status||'(none)','->',JSON.stringify(l.buttons)));
console.log('AFTER - parts:'); R.after.parts.forEach(p=>console.log('   ',p));
await page.screenshot({path:`${EV}/r71-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r71-complete-mixed.json`,JSON.stringify(R,null,1));
await browser.close();
