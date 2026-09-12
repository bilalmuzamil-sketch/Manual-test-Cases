// PRODUCTION -- the rest of the setting-screen cases: C53530 (cancel), C53528 (repeat, both
// directions), C53521 (one org-wide setting, no per-location variant).
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), c:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR7.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,3000)};},{a:APIH,m,p,b:b||null});
const stored=async()=>{for(let i=0;i<4;i++){const r=await api('GET','/api/organizations/invoice-settings/view');
  try{const v=JSON.parse(r.t).data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(1000);} return null;};
const openTab=async()=>{
  for(let attempt=0; attempt<3; attempt++){
    await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
    await page.waitForTimeout(11000);
    await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
    // wait for the row itself, not a fixed sleep -- a settled page is the precondition
    for(let i=0;i<12;i++){
      const seen=await page.evaluate(()=>/Legacy invoice layout/.test(document.body.innerText||''));
      if(seen) return true;
      await page.waitForTimeout(1500);
    }
    L('  Invoice tab did not show the row (attempt %d) - retrying', attempt+1);
  }
  await page.screenshot({path:`${EV}/PR7-tab-not-found.png`, fullPage:true});
  throw new Error('the Invoice tab never rendered the "Legacy invoice layout" row');
};
const tg=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  for(const el of [...document.querySelectorAll('input[type=checkbox],[role=switch],.q-toggle')].filter(ok)){
    let n=el; for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      if(/^Legacy invoice layout/.test((n.innerText||'').trim())){const r=el.getBoundingClientRect();
        return {aria:el.getAttribute('aria-checked'), x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2)};}}}
  return null;});
const dlgOpen=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return !!([...document.querySelectorAll('.q-dialog')].filter(ok)
    .find(x=>/Switch to the (Legacy|Modern) design\?/.test(x.innerText||'')));});
const press=(which)=>page.evaluate((w)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(ok)
    .find(x=>/Switch to the (Legacy|Modern) design\?/.test(x.innerText||''));
  if(!d) return false; const b=d.querySelector(`[data-test-id="button_${w}_invoice_design_change"]`);
  if(b){b.click(); return true;} return false;}, which);

// ---------- C53530  cancel reverts and saves nothing
await openTab();
const s530={};
s530.storedBefore=await stored(); s530.ariaBefore=(await tg()||{}).aria;
const t=await tg(); await page.mouse.click(t.x,t.y); await page.waitForTimeout(2600);
s530.dialogAppeared=await dlgOpen();
s530.ariaWithDialogOpen=(await tg()||{}).aria;
await page.screenshot({path:`${EV}/PR7-cancel-1-dialog.png`, fullPage:true});
s530.cancelClicked=await press('cancel'); await page.waitForTimeout(2500);
s530.ariaAfterCancel=(await tg()||{}).aria; s530.storedAfterCancel=await stored();
s530.dialogStillOpen=await dlgOpen();
await page.screenshot({path:`${EV}/PR7-cancel-2-after.png`, fullPage:true});
await openTab();
s530.ariaAfterReload=(await tg()||{}).aria; s530.storedAfterReload=await stored();
R.c['53530']=s530;
L('[C53530] before aria=%s stored=%s | dialog=%s | aria while open=%s', s530.ariaBefore, s530.storedBefore, s530.dialogAppeared, s530.ariaWithDialogOpen);
L('[C53530] after Cancel: aria=%s stored=%s dialog closed=%s | after reload aria=%s stored=%s',
  s530.ariaAfterCancel, s530.storedAfterCancel, !s530.dialogStillOpen, s530.ariaAfterReload, s530.storedAfterReload);
save();

// ---------- C53528  change it repeatedly, both directions, no limit
const seq=[];
for(let i=0;i<4;i++){
  await openTab();
  const before=await stored(); const t2=await tg();
  await page.mouse.click(t2.x,t2.y); await page.waitForTimeout(2400);
  const ok=await press('confirm'); await page.waitForTimeout(3200);
  const after=await stored();
  seq.push({round:i+1, before, confirmed:ok, after, changed:before!==after});
  L('[C53528] round %d: %s -> %s (confirmed %s)', i+1, before, after, ok);
}
R.c['53528']={sequence:seq, allChanged:seq.every(x=>x.changed), rounds:seq.length,
  directions:[...new Set(seq.map(x=>`${x.before}->${x.after}`))]};
L('[C53528] every round took effect: %s | directions seen: %s',
  R.c['53528'].allChanged, JSON.stringify(R.c['53528'].directions));
save();

// ---------- C53521  one org-wide setting, no per-location variant
await openTab();
R.c['53521']={rowsOnInvoiceTab: await page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  let n=0; for(const el of [...document.querySelectorAll('input[type=checkbox],[role=switch],.q-toggle')].filter(ok)){
    let p=el; for(let i=0;i<8&&p;i++){ p=p.parentElement; if(!p) break;
      if(/^Legacy invoice layout/.test((p.innerText||'').trim())){ n++; break; } } }
  return n;})};
await page.goto(`${APP}/administration/locations`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
R.c['53521'].locationsPage=await page.evaluate(()=>{const b=(document.body.innerText||'').replace(/\s+/g,' ');
  return {mentionsDesign:/Legacy invoice layout|Invoice Design/i.test(b),
    rows:[...document.querySelectorAll('tr,[role=row]')].length, head:b.slice(0,220)};});
L('[C53521] "Legacy invoice layout" rows on the Invoice tab: %d | Locations page mentions a design setting: %s',
  R.c['53521'].rowsOnInvoiceTab, R.c['53521'].locationsPage.mentionsDesign);
await page.screenshot({path:`${EV}/PR7-locations.png`, fullPage:true});
R.designAtEnd=await stored(); L('design left at: %s', R.designAtEnd);
save(); L('done'); await browser.close(); process.exit(0);
