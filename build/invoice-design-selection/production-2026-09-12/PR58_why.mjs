// PRODUCTION -- why is Create Invoice disabled on COMPLETE work orders S2-832 / S2-830 when it was
// enabled on S2-863? Read the screen and the record rather than guessing. Compare against S2-863.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const SUBJ=[['S2-832','7e3d6612-7c95-483e-b015-c97a95347d6b'],['S2-830','83873634-403e-4ccd-a08d-674f1bc59aba'],
            ['S2-863','93b1516a-5639-4b4b-a722-2a0895dc3a57']];
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), jobs:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR58.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
for(const [n,id] of SUBJ){
  const d=await call(`/api/work-orders/view/${id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  await page.goto(`${APP}/workorders/${id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(12000);
  const scr=await page.evaluate((n)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    const b=[...document.querySelectorAll('button')].find(e=>/^Create Invoice$/i.test((e.innerText||'').trim()));
    let tip=null;
    if(b){ const w=b.closest('div'); tip=(b.getAttribute('title')||b.getAttribute('aria-label')||(w?w.getAttribute('title'):null)||null); }
    return {onRecord:t.includes(n), disabled:b?b.disabled:null,
      hint:(t.match(/(must|cannot|before it can|waiting|review|receive|approve)[^.]{0,110}/i)||[])[0]||null,
      tip, body:t.slice(0,300)};}, n);
  await page.screenshot({path:`${EV}/PR58-${n}.png`, fullPage:true});
  R.jobs[n]={status:x.status, total:x.total||x.grand_total, editable:x.editable, invoiceId:x.invoice_id||null,
    linesCount:Array.isArray(x.lines)?x.lines.length:null,
    flags:Object.fromEntries(Object.entries(x).filter(([k,v])=>/review|invoiceable|can_|approved|locked|ready/i.test(k)&&typeof v!=='object')),
    screen:scr};
  L('%-8s status=%s total=%s disabled=%s | hint: %s', n, x.status, x.total||x.grand_total, scr.disabled, scr.hint);
  L('   flags: %s', JSON.stringify(R.jobs[n].flags));
  save();
}
save(); await browser.close();
