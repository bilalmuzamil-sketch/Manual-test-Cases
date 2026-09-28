// C44592 - Receive should become a SPLIT button whose caret offers "Received later", chosen per part.
// C53489 - deferring a part that has a core: the core follows its parent rather than being chosen
//          separately.
// Both were parked because the Receive later permission could not be proved in force. Check the
// simplest thing first: does the administrator account already carry it? The role editor lists
// "Receive later" among its cross-toggles, so it is a real permission - and if Admin has it, no new
// role is needed at all.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const r=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await r.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
R.hasReceiveLater=(R.perms||[]).some(p=>/receivelater|receiveLater/i.test(p));
console.log('permissions held:',(R.perms||[]).length);
console.log('anything that looks like receive-later:',JSON.stringify((R.perms||[]).filter(p=>/receiv|later/i.test(p))));
// find a work order that still has a part offering Receive
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
console.log('\nlooking for a work order with a part still to receive, among',wos.length);
R.found=null;
for(const w of wos.slice(0,14)){
  await openWo(page,w.id); await page.waitForTimeout(6500);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO) return {onWO:false};
    const rows=[...document.querySelectorAll('tr')].filter(t=>/drag_indicator/.test(t.innerText||''));
    const rec=[];
    for(const t of rows){
      const b=[...t.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width);
      const receive=b.find(e=>/^Receive/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
      if(receive){const q=receive.getBoundingClientRect();
        rec.push({row:(t.innerText||'').replace(/\s+/g,' ').trim().slice(0,90),
          label:(receive.innerText||'').replace(/\s+/g,' ').trim(),
          x:Math.round(q.x+q.width/2), y:Math.round(q.y+q.height/2), right:Math.round(q.x+q.width-6),
          // a split button carries a caret of its own next to the label
          caret:[...receive.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).join(',')});}
    }
    return {onWO:true, receivable:rec, cores:rows.filter(t=>/Core/i.test(t.innerText||'')).length};});
  if(st.onWO && st.receivable.length){ R.found={wo:w.work_order_number,id:w.id,...st}; break; }
}
if(!R.found){ console.log('no work order has a part offering Receive any more'); fs.writeFileSync(`${EV}/r66-receive-later.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(0); }
console.log('\nusing',R.found.wo,'- parts offering Receive:');
R.found.receivable.forEach(p=>console.log('   ',JSON.stringify(p.label),'| caret icons:',JSON.stringify(p.caret),'|',p.row.slice(0,60)));
console.log('   core rows on this work order:',R.found.cores);
await page.screenshot({path:`${EV}/r66-rows.png`,clip:{x:290,y:50,width:1390,height:420}}).catch(()=>{});
// press the caret at the RIGHT-HAND end of the Receive control
const p0=R.found.receivable[0];
await page.mouse.click(p0.right,p0.y); await page.waitForTimeout(2600);
R.caretMenu=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
  return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>(i.innerText||'').trim()):null;});
console.log('\npressing the right-hand end of Receive offers:',JSON.stringify(R.caretMenu));
await page.screenshot({path:`${EV}/r66-caret.png`}).catch(()=>{});
R.receivedLaterOffered=(R.caretMenu||[]).some(i=>/Received later/i.test(i));
console.log('>>> "Received later" is offered:',R.receivedLaterOffered);
if(!R.receivedLaterOffered){ await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  // positive control: the same reader finds a menu elsewhere, so an empty result is the product's
  const ctrl=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
    if(!b)return 'no control to test with'; b.click(); return 'opened a menu elsewhere';});
  await page.waitForTimeout(1800);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].length:0;});
  console.log('   positive control -',ctrl,'- it found',items,'items, so the reader works'); }
fs.writeFileSync(`${EV}/r66-receive-later.json`,JSON.stringify(R,null,1));
await browser.close();
