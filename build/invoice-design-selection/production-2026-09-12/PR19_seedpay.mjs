// Can a payment recorded IN THE APP produce the portal's paid banner and a portal receipt?
// Online card processing is off on this account (accept_cards false, stripePaymentEnabled false,
// is_test_mode false), so no payment can be taken through the customer website itself. Recording a
// payment in the app is ordinary shop data, not a card transaction, and the QA lead has authorised
// seeding on this account.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const CUST='01de15df-5651-4704-9450-0b94f4375f6b';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR19.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
// find the payments control on a customer's invoice row and see what it offers
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(15000);
const info=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('tr,[role=row]')].filter(ok)
    .filter(r=>/Unpaid|Partially/i.test(r.innerText||''));
  const first=rows[0];
  return {unpaidRows:rows.length, firstRow:first?t(first).slice(0,110):null,
    topButtons:[...document.querySelectorAll('button')].filter(ok).map(t).filter(x=>x&&x.length<26).slice(0,16)};});
L('unpaid rows: %d | first: %s', info.unpaidRows, info.firstRow);
L('buttons: %s', JSON.stringify(info.topButtons));
R.list=info;
// open New Payment
const opened=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const b=[...document.querySelectorAll('button')].filter(ok).find(e=>/^New Payment$/i.test((e.innerText||'').trim()));
  if(b){b.click(); return true;} return false;});
L('New Payment opened: %s', opened);
await page.waitForTimeout(6000);
R.dialog=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
  if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,400),
    fields:[...d.querySelectorAll('.q-field,input,select')].filter(ok)
      .map(e=>((e.closest('.q-field')||e).innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,40)).filter(Boolean).slice(0,12),
    buttons:[...d.querySelectorAll('button')].filter(ok).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,8)};});
L('payment dialog: %s', JSON.stringify(R.dialog).slice(0,600));
await page.screenshot({path:`${EV}/PR19-new-payment.png`, fullPage:true});
save(); L('done'); await browser.close(); process.exit(0);
