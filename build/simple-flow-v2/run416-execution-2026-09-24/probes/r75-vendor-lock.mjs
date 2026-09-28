// C53487 - a vendor can be corrected until a part is received, then it is fixed.
// The receive page offers Vendor (a drop-down), Vendor Invoice # and Invoice Date, with Receive
// Parts (5). Assign a vendor, receive SOME of the parts, then come back and see whether the vendor
// is still a drop-down or has become plain text.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const PO='806dcdca-eb70-4634-acb5-7bcb3ecdd7b8';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const readVendor=async()=>await page.evaluate(()=>{
  const f=[...document.querySelectorAll('.q-field')].filter(e=>e.getBoundingClientRect().width)
    .find(e=>/^Vendor\b/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!f) { const t=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/vendor/i.test(e.textContent||'')&&e.getBoundingClientRect().width)
      .map(e=>(e.textContent||'').trim()).slice(0,4);
    return {asField:false, textMentions:t}; }
  const input=f.querySelector('input');
  return {asField:true, text:(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
    editable: !!input && !input.disabled && !input.readOnly,
    hasDropdown:/arrow_drop_down/.test(f.innerText||''),
    value: input?input.value:null};});
await page.goto(`${APP}/order/${PO}?receive=1&returnTo=Order`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.before=await readVendor();
console.log('the Vendor control BEFORE anything is received:',JSON.stringify(R.before));
await page.screenshot({path:`${EV}/r75-before.png`,fullPage:true}).catch(()=>{});
// assign a vendor
if(R.before.asField && R.before.editable){
  const f=await page.evaluate(()=>{const e=[...document.querySelectorAll('.q-field')].filter(x=>x.getBoundingClientRect().width)
      .find(x=>/^Vendor\b/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
    const r=e.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
  await page.mouse.click(f.x,f.y); await page.waitForTimeout(2600);
  R.vendorChoices=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}).slice(0,8));
  console.log('vendors offered:',JSON.stringify(R.vendorChoices.map(v=>v.t)));
  if(R.vendorChoices.length){ await page.mouse.click(R.vendorChoices[0].x,R.vendorChoices[0].y);
    console.log('chose',JSON.stringify(R.vendorChoices[0].t)); await page.waitForTimeout(3000); }
}
// invoice number and date
const put=async(src,val,label)=>{const ix=await page.evaluate((s)=>{const re=new RegExp(s,'i');
    const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().width);
    return i.findIndex(x=>re.test(((x.closest('.q-field')||{}).innerText||'')+' '+(x.getAttribute('placeholder')||'')));},src);
  if(ix<0){console.log('   no field for',label);return;}
  const b=page.locator('input:visible').nth(ix); await b.click({timeout:9000}).catch(()=>{});
  await b.type(val,{delay:40}); console.log('   typed',label,'=',val); await page.waitForTimeout(1600);};
await put('Vendor Invoice','ZZAUTOTEST-PARTIAL-1','the invoice number');
// tick ONE part only, so some stay unreceived
const ticked=await page.evaluate(()=>{const cb=[...document.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
  if(cb.length<2)return 'only '+cb.length+' tick boxes'; cb[1].click(); return 'ticked one of '+cb.length;});
console.log('  ',ticked); await page.waitForTimeout(2500);
R.beforeReceive=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+(/disabled/.test(e.className||'')?' [disabled]':'')).filter(t=>/Receive/i.test(t)));
console.log('   receive controls:',JSON.stringify(R.beforeReceive));
await page.screenshot({path:`${EV}/r75-filled.png`,fullPage:true}).catch(()=>{});
const go=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&!/disabled/.test(e.className||''))
    .find(e=>/^Receive Parts?\s*\(\d+\)$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b)return 'the receive button is not pressable'; b.click(); return 'pressed '+(b.innerText||'').trim();});
console.log('  ',go); await page.waitForTimeout(9000);
R.toast=await page.evaluate(()=>[...document.querySelectorAll('.q-notification,[role=alert]')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('   message:',JSON.stringify(R.toast));
// come back and read the vendor control again
await page.goto(`${APP}/order/${PO}?receive=1&returnTo=Order`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.after=await readVendor();
console.log('\nthe Vendor control AFTER one part was received:',JSON.stringify(R.after));
R.lockedAfterReceive = R.before.editable===true && R.after.editable===false;
console.log('>>> it was changeable before and is fixed now:',R.lockedAfterReceive);
await page.screenshot({path:`${EV}/r75-after.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r75-vendor-lock.json`,JSON.stringify(R,null,1));
await browser.close();
