// The header read came back "no buttons" for all six states, which is my region, not the product:
// I cut at the top of the tab row, and the work order's actions (New Line, the AI item, the header
// three-dot) sit INSIDE that row. Take everything above the COLUMN HEADINGS instead, so the whole
// header area is included, and list it with positions.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const g=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await g('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
const byStatus={}; for(const w of wos){const s=w.status?.label||w.status?.value||w.status||'?'; if(!byStatus[s])byStatus[s]=w;}
const R={states:[]};
for(const [st,w] of Object.entries(byStatus)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const h=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
    const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
    const cut=hdrRow?hdrRow.getBoundingClientRect().top:260;   // everything ABOVE the column headings
    const ctrls=[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>{const r=e.getBoundingClientRect();
        return {t:(e.innerText||'').replace(/\s+/g,' ').trim(), x:Math.round(r.x), y:Math.round(r.y),
          disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||'')};})
      .filter(b=>b.t && !/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Trucks)/.test(b.t))
      .sort((a,b)=>a.y-b.y||a.x-b.x);
    return {controls:ctrls, cut:Math.round(cut), sendWord:/\bSend\b/.test(document.body.innerText)};});
  let menu=null;
  const dot=await page.evaluate((cut)=>{const c=[];
    document.querySelectorAll('button,.q-btn,i').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
      const r=b.getBoundingClientRect(); if(!r.width||r.y>=cut)return; c.push({x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)});});
    c.sort((a,b)=>b.x-a.x); return c[0]||null;},h.cut);
  if(dot){await page.mouse.click(dot.x,dot.y); await page.waitForTimeout(2000);
    menu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect();return r.width>20&&r.height>20;}).pop();
      return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
        .map(i=>(i.innerText||'').trim()+(i.classList.contains('disabled')||/q-item--disabled/.test(i.className)?' [disabled]':'')):null;});
    await page.keyboard.press('Escape'); await page.waitForTimeout(700);}
  R.states.push({status:st, wo:w.work_order_number, controls:h.controls, menu, sendWord:h.sendWord});
  console.log('['+st+']', w.work_order_number||'');
  console.log('   header controls:',JSON.stringify(h.controls.map(c=>c.t+(c.disabled?' [disabled]':''))));
  console.log('   three-dot      :',JSON.stringify(menu));
  console.log('   word "Send" anywhere on the page:',h.sendWord);
}
// positive control for the negative: the same scan finds Send on a screen that HAS one
R.control=await page.evaluate(()=>({anySendOnThisPage:/\bSend\b/.test(document.body.innerText)}));
fs.writeFileSync(`${EV}/p5d-headers.json`,JSON.stringify(R,null,1));
await browser.close();
