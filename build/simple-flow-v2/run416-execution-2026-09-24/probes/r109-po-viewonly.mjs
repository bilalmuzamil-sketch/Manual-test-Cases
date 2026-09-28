// C44591 point 5: somebody whose vendor and order management is View only should be able to OPEN
// the purchase orders page but not receive on it. Read the page properly - is the list there, and
// is any way to receive offered, on a row, on a ticked selection, or by going straight to a
// receive page.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG=process.env.TAG||'viewonly';
const {browser,ctx,page,APIH}=await bootProdLogin('/parts/orders',{settle:15000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={tag:TAG};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
R.vendorPerms=(R.perms||[]).filter(x=>/vendorOrderManagement/i.test(x));
console.log('what they hold for vendors and orders:',JSON.stringify(R.vendorPerms));
R.page={url:page.url().replace('https://app.shopview.com',''),
  heading:await page.evaluate(()=>{const m=document.querySelector('main,.q-page')||document.body; return (m.innerText||'').replace(/\s+/g,' ').trim().slice(0,300);})};
console.log('\nthe page they land on:',R.page.url);
console.log('what it shows:',JSON.stringify(R.page.heading.slice(0,250)));
R.rows=await page.evaluate(()=>[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
  .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,90)).slice(0,8));
console.log('rows listed:',R.rows.length); R.rows.forEach(r=>console.log('   ',r));
R.rowActions=await page.evaluate(()=>{const out=[];
  for(const t of [...document.querySelectorAll('tr')].filter(x=>x.getBoundingClientRect().height)){
    const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    if(b.length) out.push(b.join('|'));} return out.slice(0,8);});
console.log('actions on the rows:',JSON.stringify(R.rowActions));
// tick everything and see whether a bulk receive appears
R.ticked=await page.evaluate(()=>{const c=[...document.querySelectorAll('.q-checkbox')].filter(e=>e.getBoundingClientRect().width);
  if(!c.length)return 'there are no tick boxes on this page'; c[0].click(); return 'ticked the first of '+c.length;});
console.log('\n',R.ticked); await page.waitForTimeout(3000);
R.afterTick=await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<34))]);
console.log('what is offered after ticking:',JSON.stringify(R.afterTick));
R.receiveOffered=R.afterTick.some(b=>/receive/i.test(b))||R.rowActions.some(b=>/receive/i.test(b));
console.log('>>> any way to receive offered on the page:',R.receiveOffered);
await page.screenshot({path:`${EV}/r109-${TAG}-po.png`,fullPage:true}).catch(()=>{});
// and the direct route: ask the server to receive, and see whether it refuses
const po=await ctx.request.get(`https://${APIH}/api/purchase-orders?pagination%5BrowsPerPage%5D=5&pagination%5Bpage%5D=1`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
let first=null; try{const j=JSON.parse(await po.text()); first=(j.data?.purchase_orders||j.data?.collection||j.data||[])[0];}catch{}
R.poListStatus=po.status();
console.log('\nasking the server for the purchase orders list:',R.poListStatus,'| got one:',!!first);
if(first&&first.id){
  await page.goto(`https://app.shopview.com/parts/orders/${first.id}`,{waitUntil:'domcontentloaded'}).catch(()=>{});
  await page.waitForTimeout(9000);
  R.onePO={url:page.url().replace('https://app.shopview.com',''),
    buttons:await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<34))])};
  console.log('one purchase order opened at',R.onePO.url);
  console.log('what it offers:',JSON.stringify(R.onePO.buttons));
  R.receiveOnPO=R.onePO.buttons.some(b=>/receive/i.test(b));
  console.log('>>> Receive offered on the purchase order itself:',R.receiveOnPO);
  await page.screenshot({path:`${EV}/r109-${TAG}-onepo.png`,fullPage:true}).catch(()=>{});
}
fs.writeFileSync(`${EV}/r109-${TAG}.json`,JSON.stringify(R,null,1));
await browser.close();
