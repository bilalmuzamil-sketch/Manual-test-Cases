// As the person who cannot see money (See Financial Data off, and with it Part Sales, Invoicing &
// Payments, Order Parts and AP/AR). Three checks at once:
//   C44587 - receiving still works and the money fields are ABSENT, not masked
//   C44591 - the same on the purchase orders page
//   C44601 - no Create invoice in the header for someone without See Financial Data
// Plus what C44607 needs: which actions this person is and is not offered.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const perms=await (async()=>{const r=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  try{const j=JSON.parse(await r.text()); return j.data?.fe_permissions||j.data||j;}catch{return null;}})();
R.permissions=perms;
console.log('this person holds',(perms||[]).length,'permissions');
console.log(JSON.stringify(perms));
console.log('  can see money   :',(perms||[]).includes('seeFinancialData'));
console.log('  can order parts :',(perms||[]).includes('woOrderParts'));
console.log('  can pick parts  :',(perms||[]).includes('woPickParts'));

// find a work order that still has a part awaiting receipt
const call=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
console.log('\nwork orders visible to this person:',wos.length);
R.checked=[];
for(const w of wos.slice(0,10)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const st=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
    const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
    if(!hdrRow) return {onWO:false};
    const cut=hdrRow.getBoundingClientRect().top;
    const cols=[...hdrRow.querySelectorAll('th,td')].map(c=>(c.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    return {onWO:true, columns:cols,
      moneyColumns:cols.filter(c=>/Rate|Margin|Total|Cost|Price/i.test(c)),
      receiveButtons:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&/^Receive$/i.test((e.innerText||'').trim())).length,
      header:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
        .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),label:e.getAttribute('aria-label')||e.getAttribute('title')||null}))
        .filter(b=>(b.t||b.label)&&!/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck|Inventory|QA|SANKAN|Import|For Ryan)/.test(b.t||'')),
      dollarsOnPage:(document.body.innerText.match(/\$[\d,]+\.?\d*/g)||[]).length };});
  if(!st.onWO) continue;
  R.checked.push({wo:w.work_order_number,...st});
  console.log('\n  ',w.work_order_number,'| money columns:',JSON.stringify(st.moneyColumns),'| $ figures on the page:',st.dollarsOnPage);
  console.log('     columns:',JSON.stringify(st.columns));
  console.log('     header :',JSON.stringify(st.header.map(h=>h.t||h.label)));
  console.log('     Receive buttons on part rows:',st.receiveButtons);
  if(st.receiveButtons>0){
    const b=await page.evaluate(()=>{const e=[...document.querySelectorAll('button,.q-btn')].find(x=>/^Receive$/i.test((x.innerText||'').trim())&&x.getBoundingClientRect().width);
      if(!e)return null; e.click(); return 'pressed Receive';});
    console.log('     ',b); await page.waitForTimeout(7000);
    R.receiveModal=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').trim();
      return {text:t.slice(0,420),
        moneyWords:['Cost','Subtotal','Tax','Total','Sell'].filter(w=>new RegExp('\\b'+w+'\\b').test(t)),
        dollars:(t.match(/\$[\d,]+\.?\d*/g)||[]).length,
        columns:[...d.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
        buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};});
    console.log('     THE RECEIVE WINDOW as this person:');
    console.log('       columns   :',JSON.stringify(R.receiveModal&&R.receiveModal.columns));
    console.log('       money words:',JSON.stringify(R.receiveModal&&R.receiveModal.moneyWords),'| $ figures:',R.receiveModal&&R.receiveModal.dollars);
    console.log('       buttons   :',JSON.stringify(R.receiveModal&&R.receiveModal.buttons));
    await page.screenshot({path:`${EV}/r64-receive-no-money.png`}).catch(()=>{});
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
    break;
  }
}
// the purchase orders page as this person
await page.goto(`${APP}/parts/orders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.poPage=await page.evaluate(()=>({url:location.href,
  columns:[...document.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
  dollars:(document.body.innerText.match(/\$[\d,]+\.?\d*/g)||[]).length,
  receive:[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width&&/^Receive/i.test((e.innerText||'').trim())).length}));
console.log('\npurchase orders page as this person:');
console.log('   columns:',JSON.stringify(R.poPage.columns));
console.log('   $ figures on the page:',R.poPage.dollars,'| Receive buttons:',R.poPage.receive);
await page.screenshot({path:`${EV}/r64-po-no-money.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r64-no-money.json`,JSON.stringify(R,null,1));
await browser.close();
