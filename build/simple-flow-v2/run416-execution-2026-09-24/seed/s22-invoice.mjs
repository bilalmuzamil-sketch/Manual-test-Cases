// SEED 2 - invoice a work order. This is the single biggest unblocker: five unfinished checks need
// an invoiced or paid work order (where a wizard run ends, Create invoice running the wizard then
// opening payment, reordering refused once invoiced, the receive modal after invoicing, and the
// finish-action negatives).
// I had recorded these as "could not be judged - it would create a real invoice". On a branch whose
// data the QA lead has said is not real, and where he has authorised creating anything, that was a
// restriction I put on myself, which his standing authorisation calls a rule breach. So: do it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={steps:[]};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d)return null; const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  return {text:(d.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(vis).map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')})).filter(b=>b.t)};});
const waitDlg=async(ms=10000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(800);}return null;};
const pressIn=async(rx,label)=>{const r=await page.evaluate((src)=>{const re=new RegExp(src,'i');
    const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop(); if(!d)return 'no dialog';
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
      .find(e=>re.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b)return 'not found'; b.click(); return 'pressed '+(b.innerText||'').replace(/\s+/g,' ').trim();},rx.source);
  console.log('     ',label,'->',r); await page.waitForTimeout(5000); return r;};

await openWo(page,WO); await page.waitForTimeout(9000);
// approve anything still awaiting approval, or invoicing is refused
const appr=await page.evaluate(()=>{let n=0;
  for(const r of document.querySelectorAll('tr[class*="line-row-"]')){
    const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Approve$/i.test((x.innerText||'').trim()));
    if(b){b.click();n++;}} return n;});
console.log('lines approved so invoicing is not refused:',appr);
await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
R.linesBefore=await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')]
  .map(r=>[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+')).filter(Boolean));
console.log('line statuses now:',JSON.stringify(R.linesBefore));

// Create invoice - from the header three-dot, or the promoted button if it is there
const start=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  const btn=[...document.querySelectorAll('button,.q-btn')].filter(vis).find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
  if(btn){btn.click(); return 'pressed the Create Invoice button';}
  const hdr=[...document.querySelectorAll('button,.q-btn,i')].filter(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&vis(e)&&e.getBoundingClientRect().y<200)
    .sort((a,b)=>b.getBoundingClientRect().x-a.getBoundingClientRect().x)[0];
  if(hdr){hdr.click(); return 'opened the header menu';} return 'found neither';});
console.log('\nstarting the invoice:',start);
await page.waitForTimeout(2500);
if(/menu/.test(start)){
  const r=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
    if(!m)return 'no menu'; const i=[...m.querySelectorAll('.q-item')].find(x=>/^Create invoice$/i.test((x.innerText||'').trim()));
    if(!i)return 'no Create invoice item; menu holds '+[...m.querySelectorAll('.q-item')].map(x=>(x.innerText||'').trim()).join(' | ');
    if(/disabled/.test(i.className)) return 'Create invoice is greyed out';
    i.click(); return 'pressed Create invoice';});
  console.log('  ',r); await page.waitForTimeout(6000);
}
// walk whatever it opens, branching on the buttons each step shows
let guard=0;
while(guard++<12){
  const d=await waitDlg(9000);
  if(!d){ console.log('   no dialog at step',guard,'- the flow may have finished'); break; }
  const b=d.buttons.map(x=>x.t);
  console.log('\n   step',guard,':',JSON.stringify(d.text.slice(0,110)));
  console.log('           buttons:',JSON.stringify(b));
  R.steps.push({text:d.text.slice(0,200),buttons:b});
  await page.screenshot({path:`${EV}/s22-step${guard}.png`}).catch(()=>{});
  // The cores step greys out Create Invoice until every core has a decision, so decide them all
  // first. ("not found" from pressIn means the button is there but disabled - my selector skips
  // disabled ones on purpose, so a repeated "not found" is a sign the step still wants something.)
  if(b.filter(x=>/^OK · Returned$/i.test(x)).length){
    const n=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const ok=[...d.querySelectorAll('button,.q-btn')].filter(e=>/^OK · Returned$/i.test((e.innerText||'').replace(/\s+/g,' ').trim())&&e.getBoundingClientRect().width);
      ok.forEach(e=>e.click()); return ok.length;});
    console.log('      decided',n,'core(s) as returned'); await page.waitForTimeout(3500); continue; }
  if(b.some(x=>/^Pick All$/i.test(x)))                   { await pressIn(/^Pick All$/,'pick all'); continue; }
  if(b.some(x=>/Continue Without Resolving/i.test(x)))   { await pressIn(/Continue Without Resolving/,'skip cores'); continue; }
  if(b.some(x=>/^Receive Parts$/i.test(x)))              { await pressIn(/^Receive Parts$/,'open receive'); continue; }
  if(b.some(x=>/^Create Invoice$|^Invoice$|^Confirm$|^Yes$/i.test(x))) { await pressIn(/^(Create Invoice|Invoice|Confirm|Yes)$/,'confirm the invoice'); continue; }
  if(b.some(x=>/^Finish Work Order$/i.test(x)))          { await pressIn(/^Finish Work Order$/,'finish'); continue; }
  console.log('   nothing I know how to press; stopping here');
  break;
}
await page.waitForTimeout(4000);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.after=await page.evaluate(()=>({url:location.href,
  badges:[...document.querySelectorAll('.q-badge')].filter(e=>e.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).slice(0,8),
  lines:[...document.querySelectorAll('tr[class*="line-row-"]')].map(r=>[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+')).filter(Boolean),
  text:document.body.innerText.replace(/\s+/g,' ').slice(0,260)}));
console.log('\nafter the run: badges',JSON.stringify(R.after.badges),'| lines',JSON.stringify(R.after.lines));
await page.screenshot({path:`${EV}/s22-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s22-invoice.json`,JSON.stringify(R,null,1));
await browser.close();
