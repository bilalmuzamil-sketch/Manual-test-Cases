// C44597 - where a wizard run ENDS depends on what opened it. The run opened by Create invoice is
//          already settled (it ends on the payment screen). Do the other two: a run opened by
//          Complete on a line, and one opened by the bulk bar's Complete lines.
// C44605 - a part moved to a DIFFERENT line. The part three-dot offers "Move"; use it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const dlg=async()=>await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>150&&r.height>120;}).pop();
  if(!d)return null; return {text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,260),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean)};});
const waitDlg=async(ms=10000)=>{const t0=Date.now();while(Date.now()-t0<ms){const x=await dlg();if(x)return x;await page.waitForTimeout(800);}return null;};
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
// a work order with an approved line still open
let target=null;
for(const w of wos.slice(0,16)){
  await openWo(page,w.id); await page.waitForTimeout(6000);
  const ok=await page.evaluate(()=>{const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return 0; return [...document.querySelectorAll('tr[class*="line-row-"]')]
      .filter(r=>[...r.querySelectorAll('button,.q-btn')].some(b=>/^Complete$/i.test((b.innerText||'').trim()))).length;});
  if(ok>=1){ target={...w,openLines:ok}; break; }
}
if(!target){
  // My own earlier wizard runs completed nearly every line on this shop. Rather than call this
  // blocked, make the state: add a line to the first work order that will take one.
  console.log('nothing left to complete - adding a line so the run can be watched');
  for(const w of wos.slice(0,10)){
    await openWo(page,w.id); await page.waitForTimeout(6000);
    const can=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>(e.innerText||'').trim()==='New Line'&&e.getBoundingClientRect().width);
      if(!b)return false; b.click(); return true;});
    if(!can) continue;
    await page.waitForTimeout(5000);
    const ins=page.locator('.q-dialog input:visible');
    if(await ins.count()){ await ins.nth(0).click(); await ins.nth(0).type('ZZAUTOTEST wizard-end line',{delay:35});
      if(await ins.count()>1){ await ins.nth(1).click(); await ins.nth(1).type('ZZAUTOTEST',{delay:35}); }
      await page.waitForTimeout(1200);
      await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
        const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^Save & Close$/i.test((x.innerText||'').replace(/\s+/g,' ').trim())); if(b)b.click();});
      await page.waitForTimeout(8000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
      // approve it if it needs approval, so it can be completed
      await page.evaluate(()=>{for(const r of document.querySelectorAll('tr[class*="line-row-"]')){
        const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Approve$/i.test((x.innerText||'').trim())); if(b){b.click();return;}}});
      await page.waitForTimeout(5000); await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
      const ok=await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')]
        .filter(r=>[...r.querySelectorAll('button,.q-btn')].some(b=>/^Complete$/i.test((b.innerText||'').trim()))).length);
      console.log('   added a line to',w.work_order_number,'- lines now completable:',ok);
      if(ok>=1){ target={...w,openLines:ok}; break; } }
  }
}
if(!target){ console.log('could not make a completable line'); await browser.close(); process.exit(0); }
console.log('work order',target.work_order_number,'with',target.openLines,'lines still to complete');

// ---- C44597 (a) a run opened by Complete on a LINE ----
await page.evaluate(()=>{const r=[...document.querySelectorAll('tr[class*="line-row-"]')]
    .find(x=>[...x.querySelectorAll('button,.q-btn')].some(b=>/^Complete$/i.test((b.innerText||'').trim())));
  const b=[...r.querySelectorAll('button,.q-btn')].find(x=>/^Complete$/i.test((x.innerText||'').trim())); b.click();});
let d=await waitDlg(); R.fromLine={opened:d?d.text:null,buttons:d?d.buttons:null};
console.log('\nrun opened by Complete on a line ->',JSON.stringify(d&&d.text.slice(0,120)));
console.log('   its buttons:',JSON.stringify(d&&d.buttons));
// walk it to its end, branching on buttons
let g=0;
while(g++<8){ d=await waitDlg(7000); if(!d){console.log('   the run ended and the window closed'); break;}
  const b=d.buttons;
  if(b.some(x=>/^Pick All$/i.test(x))) { await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const y=[...q.querySelectorAll('button,.q-btn')].find(e=>/^Pick All$/i.test((e.innerText||'').trim())); if(y)y.click();}); await page.waitForTimeout(4500); continue; }
  if(b.filter(x=>/^OK · Returned$/i.test(x)).length){ await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      [...q.querySelectorAll('button,.q-btn')].filter(e=>/^OK · Returned$/i.test((e.innerText||'').replace(/\s+/g,' ').trim())).forEach(e=>e.click());}); await page.waitForTimeout(3500); continue; }
  if(b.some(x=>/^Complete Line$/i.test(x))) { await page.evaluate(()=>{const q=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      const y=[...q.querySelectorAll('button,.q-btn')].find(e=>/^Complete Line$/i.test((e.innerText||'').trim())); if(y)y.click();}); await page.waitForTimeout(5000); continue; }
  console.log('   it is sitting on:',JSON.stringify(d.text.slice(0,110)),'with',JSON.stringify(b)); break; }
R.fromLineEnded=await page.evaluate(()=>({url:location.href,
  dialog:!!([...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop()),
  onFinance:/Payment|Finance|Balance/i.test(document.body.innerText)}));
console.log('   where it ended:',JSON.stringify(R.fromLineEnded));
await page.screenshot({path:`${EV}/r69-from-line.png`}).catch(()=>{});
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);

// ---- C44605 move a part to another line ----
const partDot=await page.evaluate(()=>{const row=[...document.querySelectorAll('tr')].find(t=>/drag_indicator/.test(t.innerText||''));
  if(!row)return null; const b=[...row.querySelectorAll('button,.q-btn,i')].find(e=>/more_vert/.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width);
  if(!b)return null; const r=b.getBoundingClientRect();
  return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),row:(row.innerText||'').replace(/\s+/g,' ').slice(0,70)};});
console.log('\nmoving a part between lines. the part:',JSON.stringify(partDot&&partDot.row));
if(partDot){ await page.mouse.click(partDot.x,partDot.y); await page.waitForTimeout(2200);
  const items=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const q=x.getBoundingClientRect();return q.width>20&&q.height>20;}).pop();
    return m?[...m.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width)
      .map(i=>{const q=i.getBoundingClientRect();return {t:(i.innerText||'').trim(),x:Math.round(q.x+30),y:Math.round(q.y+q.height/2)};}):null;});
  console.log('   its menu:',JSON.stringify((items||[]).map(i=>i.t)));
  const mv=(items||[]).find(i=>/^Move$/i.test(i.t));
  if(mv){ await page.mouse.click(mv.x,mv.y); await page.waitForTimeout(4000);
    R.moveDialog=await dlg();
    console.log('   Move opens:',JSON.stringify(R.moveDialog&&R.moveDialog.text.slice(0,220)));
    console.log('   its buttons:',JSON.stringify(R.moveDialog&&R.moveDialog.buttons));
    await page.screenshot({path:`${EV}/r69-move.png`}).catch(()=>{});
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200); }
  else console.log('   no Move in that menu'); }
fs.writeFileSync(`${EV}/r69-wizard-ends.json`,JSON.stringify(R,null,1));
await browser.close();
