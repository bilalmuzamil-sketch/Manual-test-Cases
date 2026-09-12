// PRODUCTION -- C53533, the failed save. The failure is forced in MY OWN BROWSER by refusing the
// save request, so nothing on the server is harmed and no real error is provoked on production.
// Also C53522: can the starting state be established from the audit trail?
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/PR20.json`, JSON.stringify(R,null,1));
const { browser, ctx, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j,t:t.slice(0,400)};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
const openTab=async()=>{ for(let a=0;a<3;a++){
    await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
    await page.waitForTimeout(11000);
    await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
    for(let i=0;i<12;i++){ if(await page.evaluate(()=>/Legacy invoice layout/.test(document.body.innerText||''))) return true;
      await page.waitForTimeout(1500);} }
  throw new Error('Invoice tab never rendered the row'); };
const tg=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  for(const el of [...document.querySelectorAll('input[type=checkbox],[role=switch],.q-toggle')].filter(ok)){
    let n=el; for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      if(/^Legacy invoice layout/.test((n.innerText||'').trim())){const r=el.getBoundingClientRect();
        return {aria:el.getAttribute('aria-checked'), x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2)};}}}
  return null;});
const press=(w)=>page.evaluate((x)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok).find(q=>/Switch to the (Legacy|Modern) design\?/.test(q.innerText||''));
  if(!d) return false; const b=d.querySelector(`[data-test-id="button_${x}_invoice_design_change"]`);
  if(b){b.click(); return true;} return false;},w);
const toast=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('.q-notification,[role=alert],[role=status]')].filter(ok)
    .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,200),
      hasClose:!!e.querySelector('button,[class*=close]')})).filter(t=>t.text);});
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// start from Modern so the attempted change is "to Legacy"
await setDesign('modern'); L('starting from %s', await stored());
await openTab();
R.before={aria:(await tg()||{}).aria, stored:await stored()};
// refuse the save request, in this browser only
await ctx.route('**/invoice-settings/change-design*', r=>r.abort('failed'));
L('the save request is now being refused in this browser only');
const t=await tg(); await page.mouse.click(t.x,t.y); await page.waitForTimeout(2600);
R.dialogAppeared=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return !!([...document.querySelectorAll('.q-dialog')].filter(ok).find(q=>/Switch to the/.test(q.innerText||'')));});
R.confirmed=await press('confirm');
await page.waitForTimeout(2500);
R.toastImmediate=await toast();
L('toast right after the failed save: %s', JSON.stringify(R.toastImmediate).slice(0,260));
await page.screenshot({path:`${EV}/PR20-fail-toast.png`, fullPage:true});
await page.waitForTimeout(12000);
R.toastAfter12s=await toast();
R.toastPersisted=(R.toastAfter12s||[]).length>0;
R.ariaAfter=(await tg()||{}).aria;
R.storedAfter=await stored();
L('after 12s the alert is still there: %s | toggle %s | stored %s', R.toastPersisted, R.ariaAfter, R.storedAfter);
await page.screenshot({path:`${EV}/PR20-fail-after12s.png`, fullPage:true});
await ctx.unroute('**/invoice-settings/change-design*');
await openTab();
R.ariaAfterReload=(await tg()||{}).aria; R.storedAfterReload=await stored();
L('after reload: toggle %s | stored %s', R.ariaAfterReload, R.storedAfterReload);
save();
// C53522 -- is there an audit trail that shows the first ever change?
for(const p of ['/api/audit-logs?limit=20','/api/organization/audit-logs?limit=20','/api/audit?limit=20']){
  const r=await call(p); L('audit try %s -> %s %s', p, r.s, r.s===200?String(JSON.stringify(r.j)).slice(0,150):r.t.slice(0,80));
  if(r.s===200){ R.audit={route:p, sample:String(JSON.stringify(r.j)).slice(0,600)}; break; }
}
save(); L('done'); await browser.close(); process.exit(0);
