// C44597 run 2, driven properly. The wizard's own button stays dead until each question on the step
// is answered - so answer them all first (every core gets "OK · Returned"), then press on.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={steps:[]};
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
await page.evaluate(()=>{const sa=document.querySelector('[data-test-id="checkbox_select_all_lines"]'); if(sa)(sa.querySelector('input')||sa).click();});
await page.waitForTimeout(4000);
const bar=await page.evaluate(()=>{const host=[...document.querySelectorAll('div,section,footer')].filter(e=>{const r=e.getBoundingClientRect();
    return r.width>300&&r.height>0&&r.height<160&&/\bselected\b/i.test(e.innerText||'')&&(e.innerText||'').length<220;})
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
  if(!host)return null;
  const b=[...host.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
  return {text:(host.innerText||'').replace(/\s+/g,' ').trim().slice(0,120), b};});
R.barLabel=bar&&bar.text;
console.log('\nthe action bar reads:',JSON.stringify(R.barLabel));
const go=bar&&bar.b.find(x=>/^Complete All Lines$/i.test(x.t));
if(!go){ console.log('no Complete All Lines in the bar'); await browser.close(); process.exit(0); }
await page.mouse.click(go.x,go.y); console.log('pressed "Complete All Lines"'); await page.waitForTimeout(8000);
for(let step=1;step<=8;step++){
  const d=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    if(!q)return null;
    return {text:(q.innerText||'').replace(/\s+/g,' ').trim().slice(0,200),
      buttons:[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')||e.disabled})).filter(b=>b.t)};});
  if(!d){ console.log(`step ${step}: nothing is open any more`); break; }
  console.log(`\nstep ${step}:`,JSON.stringify(d.text.slice(0,140)));
  console.log('        ',JSON.stringify(d.buttons.map(b=>b.t+(b.dis?' [off]':''))));
  R.steps.push(d);
  await page.screenshot({path:`${EV}/r121-step${step}.png`}).catch(()=>{});
  // answer every question on this step first
  const answered=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    const oks=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&/OK\s*.\s*Returned/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    oks.forEach(b=>b.click()); return oks.length?('answered '+oks.length+' core question(s) with "OK - Returned"'):'no questions on this step';});
  console.log('        ',answered);
  if(/answered/.test(answered)) await page.waitForTimeout(3500);
  // then press the step's own button - the last live one that is not a way out
  const press=await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>200).pop();
    if(!q)return 'the wizard closed';
    const c=[...q.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>({e,t:(e.innerText||'').replace(/\s+/g,' ').trim(),dis:/disabled/.test(e.className||'')||e.disabled}))
      .filter(x=>x.t&&!/^(cancel|close|back|×)$/i.test(x.t)&&!/OK\s*.\s*Returned|Not OK/i.test(x.t));
    const live=c.filter(x=>!x.dis);
    if(!live.length)return 'nothing on this step will press: '+c.map(x=>x.t+(x.dis?'[off]':'')).join(' | ');
    const b=live[live.length-1]; b.e.click(); return 'pressed "'+b.t+'"';});
  console.log('        ',press);
  if(/closed|will press/.test(press)&&!/^pressed/.test(press)) break;
  await page.waitForTimeout(7000);
}
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
R.endedAt=page.url().replace('https://app.shopview.com','');
console.log('\nit said:',JSON.stringify(R.toast));
console.log('it ended at:',R.endedAt);
R.stillOnWorkOrder=/\/workorders\//.test(R.endedAt);
await page.waitForTimeout(4000);
await page.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(14000);
R.linesAfter=await lines(); R.headerAfter=await header();
console.log('\nlines after:'); R.linesAfter.forEach(l=>console.log('   ',l));
console.log('header after:',JSON.stringify(R.headerAfter.map(b=>b.t+(b.dis?' [greyed]':''))));
R.markReviewedAppeared=R.headerAfter.some(b=>/Mark Reviewed/i.test(b.t)&&!b.dis);
console.log('\n>>> stayed on the work order:',R.stillOnWorkOrder,'| sign-off now offered in the header:',R.markReviewedAppeared);
await page.screenshot({path:`${EV}/r121-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r121-drive-wizard.json`,JSON.stringify(R,null,1));
await browser.close();
