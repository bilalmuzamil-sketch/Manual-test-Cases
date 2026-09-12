// PRODUCTION PASS A -- the setting screen itself. Driven THROUGH THE SCREEN, because these cases are
// about the control, its dialog, its toast and its cancel behaviour, not about an endpoint.
// Covers C53518 C53519 C53520 C53524 C53525 C53526 C53528 C53530 C53532.
// Every sub-step reads the stored value before and after, so a flip by another user on this shared
// account is recorded rather than silently believed.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`; fs.mkdirSync(EV,{recursive:true});
const APIH='api.shopview.com', APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), drift:[], c:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR5.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',
  headers:{'Content-Type':'application/json',Accept:'application/json'},body:b?JSON.stringify(b):undefined});
  return {s:r.status,t:(await r.text()).slice(0,4000)};},{a:APIH,m,p,b:b||null});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  try{return JSON.parse(r.t).data.documentDesign;}catch(e){return null;}};
const settingsAll=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  try{return JSON.parse(r.t).data;}catch(e){return null;}};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
L('build %s', R.build);

const openInvoiceTab=async()=>{
  await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(ok).find(e=>t(e)==='Invoice'); if(el)el.click();});
  await page.waitForTimeout(7000);
};
// read the whole toggle list in ORDER, with each row's title, helper text and state
const readRows=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const inputs=[...document.querySelectorAll('input[type=checkbox],[role=switch]')].filter(ok);
  const rows=inputs.map(inp=>{
    let n=inp, row=null;
    for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      const tx=(n.innerText||'').trim(); if(tx && tx.split('\n')[0].length>2 && tx.length<400){ row=n; break; } }
    const txt=row?(row.innerText||'').trim():'';
    const lines=txt.split('\n').map(s=>s.trim()).filter(Boolean);
    const r=inp.getBoundingClientRect();
    return {title:lines[0]||null, helper:lines.slice(1).join(' ')||null,
            state: inp.getAttribute('aria-checked') ?? String(inp.checked), y:Math.round(r.y)};
  }).sort((a,b)=>a.y-b.y);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {rows, hasDisclaimer:/Disclaimer/.test(body),
    afterLast:(body.match(/Legacy invoice layout.{0,260}/)||[])[0]||null};
});
const findToggle=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const inputs=[...document.querySelectorAll('input[type=checkbox],[role=switch]')].filter(ok);
  for(const inp of inputs){ let n=inp;
    for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      if(/^Legacy invoice layout/.test((n.innerText||'').trim())) return true; } }
  return false;});
const clickToggle=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const inputs=[...document.querySelectorAll('input[type=checkbox],[role=switch]')].filter(ok);
  for(const inp of inputs){ let n=inp;
    for(let i=0;i<8&&n;i++){ n=n.parentElement; if(!n) break;
      if(/^Legacy invoice layout/.test((n.innerText||'').trim())){
        const lbl=inp.closest('label')||inp.parentElement; (lbl||inp).click(); return true; } } }
  return false;});
const readDialog=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const d=[...document.querySelectorAll('[role=dialog],.q-dialog,[class*=dialog],[class*=modal]')].filter(ok).pop();
  if(!d) return null;
  const btns=[...d.querySelectorAll('button')].filter(ok).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const lines=(d.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean);
  return {title:lines[0]||null, body:lines.slice(1).filter(l=>!btns.includes(l)).join(' '), buttons:btns,
          full:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,700)};});
const clickIn=(label)=>page.evaluate((lab)=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const d=[...document.querySelectorAll('[role=dialog],.q-dialog,[class*=dialog],[class*=modal]')].filter(ok).pop();
  const scope=d||document;
  const b=[...scope.querySelectorAll('button')].filter(ok)
    .find(x=>(x.innerText||'').replace(/\s+/g,' ').trim()===lab);
  if(b){b.click(); return true;} return false;}, label);
const readToast=()=>page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=[...document.querySelectorAll('[role=alert],[role=status],.q-notification,[class*=toast],[class*=notification],[class*=snackbar]')].filter(ok);
  return t.map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,220),
                    hasClose:!!e.querySelector('button,[role=button],[class*=close]')}));});

// ---------- start from a KNOWN state: OFF (Modern)
R.designAtStart=await stored(); L('design at start: %s', R.designAtStart);
if(R.designAtStart!=='modern'){ await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:'modern'});
  await page.waitForTimeout(1500); L('set to modern to start from a known state -> %s', await stored()); }
await openInvoiceTab();

// ---------- C53518 the row is last, under Summarize labor total, above the Disclaimer
const rows=await readRows();
R.rows=rows.rows.map(r=>({title:r.title, state:r.state}));
const titles=rows.rows.map(r=>r.title);
R.c['53518']={rowTitles:titles, last:titles[titles.length-1],
  prev:titles[titles.length-2], disclaimerPresent:rows.hasDisclaimer, toggleFound:await findToggle()};
L('[C53518] rows in order: %s', JSON.stringify(titles));
L('[C53518] last=%s | previous=%s | Disclaimer on page=%s', R.c['53518'].last, R.c['53518'].prev, rows.hasDisclaimer);
await page.screenshot({path:`${EV}/PR5-01-invoice-tab.png`, fullPage:true});

// ---------- C53520 the helper text, character for character
const EXPECT_HELPER='Every estimate, invoice and credit invoice your shop shows, prints or sends uses the legacy design while this is on, including documents created before you changed it.';
const lastRow=rows.rows[rows.rows.length-1];
R.c['53520']={observed:lastRow?lastRow.helper:null, expected:EXPECT_HELPER,
  exact: (lastRow&&lastRow.helper||'').replace(/\s+/g,' ').trim()===EXPECT_HELPER};
L('[C53520] helper exact match: %s', R.c['53520'].exact);
L('   observed: %s', String(R.c['53520'].observed).slice(0,190));

// ---------- C53519 part 1: OFF means Modern
R.c['53519']={offState:lastRow?lastRow.state:null, offStored:await stored()};
L('[C53519] toggle off -> stored design %s', R.c['53519'].offStored);
save();

// ---------- C53530 cancel reverts and saves nothing
const before530=await stored();
await clickToggle(); await page.waitForTimeout(2500);
R.c['53530']={dialogAppeared:!!(await readDialog())};
await page.screenshot({path:`${EV}/PR5-02-dialog-to-legacy.png`, fullPage:true});
// ---------- C53524 the dialog wording, read before anything is confirmed
const dlg=await readDialog();
R.c['53524']={dialog:dlg,
  titleExpected:'Switch to the Legacy design?',
  bodyExpected:'Every estimate, invoice and credit invoice will use the Legacy design straight away, including documents your shop has already sent. Reprints and portal copies of older documents change too. You can switch back at any time.',
  buttonsExpected:['Switch to Legacy','Cancel']};
if(dlg){
  R.c['53524'].titleMatch = dlg.title===R.c['53524'].titleExpected;
  R.c['53524'].bodyMatch  = (dlg.body||'').replace(/\s+/g,' ').trim()===R.c['53524'].bodyExpected;
  R.c['53524'].buttonsMatch = JSON.stringify(dlg.buttons)===JSON.stringify(R.c['53524'].buttonsExpected);
  R.c['53524'].toggleMovedBeforeConfirm = (await stored())!==before530;
  L('[C53524] title "%s" match=%s', dlg.title, R.c['53524'].titleMatch);
  L('[C53524] buttons %s match=%s', JSON.stringify(dlg.buttons), R.c['53524'].buttonsMatch);
  L('[C53524] body match=%s', R.c['53524'].bodyMatch);
  if(!R.c['53524'].bodyMatch) L('   observed body: %s', String(dlg.body).slice(0,260));
} else L('[C53524] NO DIALOG APPEARED');
save();
// cancel it
R.c['53530'].cancelClicked=await clickIn('Cancel');
await page.waitForTimeout(2500);
R.c['53530'].storedAfterCancel=await stored();
const rowsAfterCancel=await readRows();
R.c['53530'].toggleAfterCancel=(rowsAfterCancel.rows.slice(-1)[0]||{}).state;
await openInvoiceTab();
const rowsReload=await readRows();
R.c['53530'].toggleAfterReload=(rowsReload.rows.slice(-1)[0]||{}).state;
R.c['53530'].storedAfterReload=await stored();
L('[C53530] cancel -> toggle %s, stored %s | after reload toggle %s, stored %s',
  R.c['53530'].toggleAfterCancel, R.c['53530'].storedAfterCancel,
  R.c['53530'].toggleAfterReload, R.c['53530'].storedAfterReload);
await page.screenshot({path:`${EV}/PR5-03-after-cancel.png`, fullPage:true});
save();

// ---------- C53532 the other settings are untouched by a design change
const beforeAll=await settingsAll();
// ---------- C53526 confirm, toast, persistence
await clickToggle(); await page.waitForTimeout(2200);
R.c['53526']={confirmClicked:await clickIn('Switch to Legacy')};
await page.waitForTimeout(1200);
R.c['53526'].toastImmediate=await readToast();
L('[C53526] toast: %s', JSON.stringify(R.c['53526'].toastImmediate).slice(0,220));
await page.screenshot({path:`${EV}/PR5-04-toast.png`, fullPage:true});
await page.waitForTimeout(9000);
R.c['53526'].toastAfter9s=await readToast();
R.c['53526'].toastFaded = (R.c['53526'].toastAfter9s||[]).length===0;
R.c['53526'].storedAfterConfirm=await stored();
await openInvoiceTab();
const rowsAfterSave=await readRows();
R.c['53526'].toggleAfterReload=(rowsAfterSave.rows.slice(-1)[0]||{}).state;
R.c['53526'].storedAfterReload=await stored();
L('[C53526] faded on its own: %s | stored %s | toggle after reload %s',
  R.c['53526'].toastFaded, R.c['53526'].storedAfterConfirm, R.c['53526'].toggleAfterReload);
// C53519 part 2: ON means Legacy
R.c['53519'].onState=R.c['53526'].toggleAfterReload;
R.c['53519'].onStored=R.c['53526'].storedAfterReload;
L('[C53519] toggle on -> stored design %s', R.c['53519'].onStored);
const afterAll=await settingsAll();
R.c['53532']={before:beforeAll, after:afterAll};
if(beforeAll&&afterAll){
  const keys=[...new Set([...Object.keys(beforeAll),...Object.keys(afterAll)])].filter(k=>k!=='documentDesign');
  R.c['53532'].changedKeys=keys.filter(k=>JSON.stringify(beforeAll[k])!==JSON.stringify(afterAll[k]));
  L('[C53532] other settings changed by the design change: %s', JSON.stringify(R.c['53532'].changedKeys));
}
save();

// ---------- C53525 the dialog on the way BACK to Modern
await clickToggle(); await page.waitForTimeout(2500);
const dlg2=await readDialog();
R.c['53525']={dialog:dlg2, titleExpected:'Switch to the Modern design?'};
L('[C53525] title "%s" | buttons %s', dlg2&&dlg2.title, JSON.stringify(dlg2&&dlg2.buttons));
if(dlg2) L('   body: %s', String(dlg2.body).slice(0,300));
await page.screenshot({path:`${EV}/PR5-05-dialog-to-modern.png`, fullPage:true});
const confirmLabel=(dlg2&&dlg2.buttons||[]).find(b=>/Modern/i.test(b))||'Switch to Modern';
R.c['53525'].confirmClicked=await clickIn(confirmLabel);
await page.waitForTimeout(3000);
R.c['53525'].storedAfter=await stored();
L('[C53525] confirmed "%s" -> stored %s', confirmLabel, R.c['53525'].storedAfter);
save();

// ---------- C53528 change it repeatedly, both directions
const seq=[];
for(let i=0;i<3;i++){
  await openInvoiceTab();
  await clickToggle(); await page.waitForTimeout(2200);
  const d=await readDialog();
  const lab=(d&&d.buttons||[]).find(b=>/^Switch to/.test(b));
  if(lab) await clickIn(lab); else { seq.push({i, err:'no confirm button'}); break; }
  await page.waitForTimeout(3000);
  seq.push({i, confirmed:lab, stored:await stored()});
  L('[C53528] round %d: %s -> %s', i+1, lab, seq[seq.length-1].stored);
}
R.c['53528']={sequence:seq};
R.designAtEnd=await stored();
L('design at end: %s (left as is -- the QA lead asked for no cleanup on this account)', R.designAtEnd);
save(); L('done'); await browser.close(); process.exit(0);
