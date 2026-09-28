// Two corrections to how I was going about this:
//  1. change-location returned 500 after the first call and left my session on the wrong workplace.
//     Switch through the SCREEN (the workplace chip, top right) - Rule 107: use whichever surface
//     reaches the state.
//  2. His work order carries the badges "Estimate" and "Over Limit". Send to Portal is very likely an
//     ESTIMATE affordance - sending the estimate to the customer's portal to be approved - which is
//     why it was nowhere on the approved work orders I sampled. Look at an estimate.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
// --- switch workplace through the screen ---
const chip=await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length<4&&/Trucks? Hill|Inventory|QA |SANKAN|Import Test|For Ryan/.test((x.textContent||'').trim())&&x.getBoundingClientRect().width&&x.getBoundingClientRect().y<80)
    .sort((a,b)=>b.getBoundingClientRect().x-a.getBoundingClientRect().x)[0];
  if(!e)return null; const r=e.getBoundingClientRect(); return {t:(e.textContent||'').trim().slice(0,40),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};});
console.log('workplace chip on screen:',JSON.stringify(chip));
if(chip){ await page.mouse.click(chip.x,chip.y); await page.waitForTimeout(3000);
  const opts=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-dialog .q-item')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+20),y:Math.round(r.y+r.height/2)};}));
  console.log('  the menu offers:',JSON.stringify(opts.map(o=>o.t).slice(0,12)));
  const want=opts.find(o=>/Trucks Hill 2/i.test(o.t));
  if(want){ await page.mouse.click(want.x,want.y); await page.waitForTimeout(8000); console.log('  picked Trucks Hill 2'); }
  else { await page.keyboard.press('Escape'); console.log('  Trucks Hill 2 not in that menu'); } }
await page.waitForTimeout(3000);
R.workplaceNow=await page.evaluate(()=>document.body.innerText.match(/Trucks? Hill \d|Inventory \d|QA \w+|SANKAN|Import Test|For Ryan/)?.[0]||null);
console.log('  workplace now reads:',R.workplaceNow);

// --- find an ESTIMATE work order ---
const call=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
const ests=wos.filter(w=>/estimate/i.test(w.status?.label||w.status?.value||w.status||''));
console.log('\nestimate work orders available:',ests.length, JSON.stringify(ests.slice(0,5).map(w=>w.work_order_number)));
R.checked=[];
for(const w of ests.slice(0,4)){
  await openWo(page,w.id); await page.waitForTimeout(8000);
  const st=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
    const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
    if(!hdrRow) return {onWO:false};
    const cut=hdrRow.getBoundingClientRect().top;
    return {onWO:true,
      woBadges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,5),
      lineBadges:[...document.querySelectorAll('tr[class*="line-row-"] .q-badge')].map(b=>(b.innerText||'').trim()),
      sendText:/Send to Portal/i.test(document.body.innerText),
      controls:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
        .map(e=>{const r=e.getBoundingClientRect();
          return {text:(e.innerText||'').replace(/\s+/g,' ').trim(),
            label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
            icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
            disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
            x:Math.round(r.x),y:Math.round(r.y)};})
        .filter(b=>(b.text||b.icon||b.label)&&!/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck|Inventory|QA|SANKAN|Import|For Ryan)/.test(b.text||''))};});
  if(!st.onWO){ console.log('  ',w.work_order_number,'- did not load'); continue; }
  console.log('\n  ',w.work_order_number,'| badges',JSON.stringify(st.woBadges),'| lines',JSON.stringify(st.lineBadges));
  console.log('     "Send to Portal" in the page text:',st.sendText);
  for(const c of st.controls) console.log('      ',JSON.stringify(c.text).padEnd(22),'| label',JSON.stringify(c.label).padEnd(18),'| icon',(c.icon||'-').padEnd(12),'|',c.disabled?'DISABLED':'enabled');
  const tips=[];
  for(const c of st.controls){ await page.mouse.move(c.x+12,c.y+12); await page.waitForTimeout(1400);
    const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.textContent||'').trim()).filter(Boolean));
    if(t.length){tips.push({control:c.text||c.icon,tooltip:t.join(' | '),disabled:c.disabled});
      console.log('       hover',JSON.stringify(c.text||c.icon),'->',JSON.stringify(t.join(' | ')),c.disabled?'(DISABLED)':'(enabled)');}}
  R.checked.push({wo:w.work_order_number,...st,tips});
  if(tips.some(t=>/Send to Portal/i.test(t.tooltip))||st.sendText){
    await page.screenshot({path:`${EV}/p7f-send-to-portal.png`,clip:{x:290,y:50,width:1390,height:210}}).catch(()=>{});
    console.log('       ^^ FOUND IT'); break; }
}
fs.writeFileSync(`${EV}/p7f-estimate-send.json`,JSON.stringify(R,null,1));
await browser.close();
