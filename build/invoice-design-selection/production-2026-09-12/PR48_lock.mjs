// PRODUCTION -- C53570 step 3: is the Authorizer locked once the work order is invoiced? Absence of a
// "disabled" attribute is not proof; ATTEMPT the change through the screen and read the value back.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const WO={n:'S2-863', id:'93b1516a-5639-4b4b-a722-2a0895dc3a57'};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR48.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const woView=async()=>{const d=await call(`/api/work-orders/view/${WO.id}`); let x=(d.j&&(d.j.data||d.j))||{};
  if(x.work_order) x=x.work_order;
  return {status:x.status, invoiceId:x.invoice_id||null, editable:x.editable, authorizer:x.authorizer_full_name};};
const open=async()=>{ await page.goto(`${APP}/workorders/${WO.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000);
  return page.evaluate(n=>({onRecord:(document.body.innerText||'').includes(n)}), WO.n); };
R.steps.before=await woView(); L('before: %s', JSON.stringify(R.steps.before));
const id=await open(); L('onRecord=%s', id.onRecord);
if(!id.onRecord){ L('not on the record -- stop'); save(); await browser.close(); process.exit(0); }
await page.screenshot({path:`${EV}/PR48-finance.png`, fullPage:true});
// POSITIVE CONTROL: does the select still open at all?
R.steps.opened=await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]');
  if(!s) return {present:false}; s.click(); return {present:true};});
await page.waitForTimeout(3500);
R.steps.options=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok)
    .map(e=>(e.textContent||'').replace(/\s+/g,' ').replace(/^check/,'').trim()).slice(0,12);});
L('select opens: %s | options %s', JSON.stringify(R.steps.opened), JSON.stringify(R.steps.options));
await page.screenshot({path:`${EV}/PR48-select-open.png`, fullPage:true});
save();
if(R.steps.options.length){
  const current=(R.steps.before.authorizer||'').trim();
  R.steps.attempt=await page.evaluate((cur)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const its=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(ok);
    const other=its.find(e=>{const t=(e.textContent||'').replace(/^check/,'').replace(/\s+/g,' ').trim();
      return t && t!==cur && !/no authorizer/i.test(t);});
    if(!other) return null; const t=(other.textContent||'').replace(/^check/,'').replace(/\s+/g,' ').trim();
    other.click(); return t;}, current);
  L('attempted to change to: %s', R.steps.attempt);
  await page.waitForTimeout(9000);
  await page.screenshot({path:`${EV}/PR48-after-attempt.png`, fullPage:true});
  R.steps.toast=await page.evaluate(()=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    const m=t.match(/(cannot|not allowed|locked|denied|error|invoiced)[^.]{0,90}/i); return m?m[0]:null;});
  R.steps.after=await woView();
  R.steps.shownNow=await page.evaluate(()=>{const s=document.querySelector('[data-test-id="select_authorizer"]');
    return s?(s.textContent||'').replace(/\s+/g,' ').trim().slice(0,60):null;});
  L('after attempt -> work order says: %s | screen shows: %s | message: %s',
    R.steps.after.authorizer, R.steps.shownNow, R.steps.toast);
}
R.verdict={wasInvoiced:!!R.steps.before.invoiceId, editableFlag:R.steps.before.editable,
  authorizerBefore:R.steps.before.authorizer, attemptedChangeTo:R.steps.attempt||null,
  authorizerAfter:(R.steps.after||{}).authorizer,
  changeTook:(R.steps.after||{}).authorizer!==R.steps.before.authorizer,
  locked:(R.steps.after||{}).authorizer===R.steps.before.authorizer};
L('VERDICT %s', JSON.stringify(R.verdict));
save(); await browser.close();
