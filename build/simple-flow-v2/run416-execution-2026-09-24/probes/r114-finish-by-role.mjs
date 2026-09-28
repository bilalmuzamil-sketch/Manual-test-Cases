// C44601 point 6: what finish action each kind of person is offered, on a work order that is
// waiting to be reviewed and on one that is ready to invoice.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG=process.env.TAG||'someone';
const WOS=[{what:'waiting to be reviewed',id:'b172fe19-a99c-41dc-aa1d-b52a1955fa9e'},
           {what:'ready to invoice',      id:'ee9adbb2-0df5-4e12-8771-506591445638'}];
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={tag:TAG,seen:[]};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
console.log('as',TAG,'- holds:',['woReviewWorkOrders','invoicingPaymentsCreateAndEdit','invoicingPaymentsView','seeFinancialData']
  .map(k=>((R.perms||[]).includes(k)?'':'no ')+k).join(', '));
for(const w of WOS){
  await openWo(page,w.id); await page.waitForTimeout(8000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return {reached:false, where:location.pathname};
    const top=[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.y<200;})
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean))];
    // and what hides behind the header's three-dot
    return {reached:true, header:top.filter(b=>!/ShopHub|Work Orders|Schedule|Customers|Parts|Reports|notifications|Clock|Trucks Hill|search|width_normal|location_on|SHOPCOACH|expand_less/.test(b))};});
  let menu=[];
  if(st.reached){
    const dots=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>{const r=e.getBoundingClientRect();
      return r.width&&r.y<200&&/more_vert/.test((e.innerText||e.textContent||'').trim());}).pop();
      if(!b)return null; const r=b.getBoundingClientRect(); return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
    if(dots){ await page.mouse.click(dots.x,dots.y); await page.waitForTimeout(2200);
      menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
        return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):[];});
      await page.keyboard.press('Escape'); await page.waitForTimeout(900); }
  }
  console.log(`\n${w.what}: reached it: ${st.reached}`);
  console.log('  the header offers:',JSON.stringify(st.header||[]));
  console.log('  its three-dot holds:',JSON.stringify(menu));
  R.seen.push({...w,...st,menu});
  await page.screenshot({path:`${EV}/r114-${TAG}-${w.what.replace(/ /g,'-')}.png`}).catch(()=>{});
}
fs.writeFileSync(`${EV}/r114-${TAG}.json`,JSON.stringify(R,null,1));
await browser.close();
