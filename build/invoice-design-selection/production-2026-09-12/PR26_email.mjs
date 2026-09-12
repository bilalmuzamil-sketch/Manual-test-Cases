// PRODUCTION -- email the invoice to the account's own address under each design, so the received
// PDF can be opened and compared. Also C53550: a file already downloaded does not change afterwards.
import fs from 'fs';
import { execSync } from 'child_process';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const WO='f58e3fda-af5d-45fc-afc6-b0c79bd77046';   // S1-852, invoiced earlier this run
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), sends:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR26.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const post=(p,b)=>page.evaluate(async({a,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:'POST',credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(b)});return {s:r.status};},{a:APIH,p,b});
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
const setDesign=async(w)=>{for(let i=0;i<4;i++){ if((await stored())===w) return w;
  await post('/api/organizations/invoice-settings/change-design',{documentDesign:w}); await page.waitForTimeout(1800);} return await stored();};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
// ---------- C53550: a file already saved does not change when the setting changes
const F=`${EV}/PR13-legacy-print.pdf`;
if(fs.existsSync(F)){
  const before={bytes:fs.statSync(F).size, sha:execSync(`sha256sum "${F}"`).toString().split(' ')[0]};
  await setDesign('modern'); const d1=await stored();
  const after={bytes:fs.statSync(F).size, sha:execSync(`sha256sum "${F}"`).toString().split(' ')[0]};
  R.alreadyDownloaded={file:'the invoice PDF saved earlier while the shop was on the old look',
    designWhenSaved:'legacy', designNow:d1, before, after, identical: before.sha===after.sha};
  L('[C53550] saved file: %d bytes, unchanged after switching to %s: %s',
    before.bytes, d1, R.alreadyDownloaded.identical);
}
save();
// ---------- the email dialog
for(const want of ['modern','legacy']){
  const now=await setDesign(want); L('=== design %s', now); if(now!==want) continue;
  await page.goto(`${APP}/workorders/${WO}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(16000);
  const onPage=await page.evaluate(()=>((document.body.innerText||'').includes('S1-852')));
  if(!onPage){ L('  not on S1-852 - skipping'); continue; }
  const opened=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const b=[...document.querySelectorAll('button,a')].filter(ok).find(e=>{const i=e.querySelector('i');
      return i && /^(email|mail)$/i.test((i.innerText||'').trim());});
    if(b){b.click(); return true;} return false;});
  await page.waitForTimeout(6000);
  const dlg=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop();
    if(!d) return null;
    return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300),
      inputs:[...d.querySelectorAll('input,textarea')].filter(ok).map(e=>({
        ph:e.getAttribute('placeholder')||'', val:(e.value||'').slice(0,40), type:e.type||''})).slice(0,8),
      buttons:[...d.querySelectorAll('button')].filter(ok).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
      checkboxes:[...d.querySelectorAll('input[type=checkbox],[role=switch]')].filter(ok).length};});
  R.sends.push({design:want, emailButtonFound:opened, dialog:dlg});
  L('  email button: %s | dialog: %s', opened, JSON.stringify(dlg).slice(0,420));
  await page.screenshot({path:`${EV}/PR26-${want}-email-dialog.png`, fullPage:true});
  // close it without sending, for now -- the send itself is the next step once the shape is known
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog')].filter(ok).pop(); if(!d) return;
    const b=[...d.querySelectorAll('button')].filter(ok).find(x=>/close|cancel/i.test((x.innerText||'').trim()));
    if(b) b.click();});
  await page.waitForTimeout(2500);
  save();
}
L('design left at %s', await stored()); save(); L('done'); await browser.close(); process.exit(0);
