// Standing Rule 118, applied. Press "Reset To Template" on the Technician role and READ THE SAVE
// BUTTON: enabled means another session had changed the role, so it was not default and every check
// already taken on it is void; disabled means it was default all along. Then save if there is
// anything to save, and read the permission set back.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='31e70dbe-8d9f-485b-9e32-457acd069743'; // Technician (System), carried by the lower-permission person
const {browser,ctx,page,APIH}=await bootProdLogin(`/administration/roles-permissions/${ROLE}/edit`,{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const R={role:ROLE};
const readSave=async()=>await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
  .find(x=>/^Save$/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b) return null;
  return { disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test(b.className||''),
           cls:(b.className||'').toString().slice(0,90) };});
const perms=async()=>await page.evaluate(()=>{const o={};
  document.querySelectorAll('.q-toggle,.q-checkbox').forEach(t=>{
    const row=t.closest('div'); const label=(row&&row.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);
    if(label) o[label]= t.getAttribute('aria-checked')==='true'; }); return o;});

R.saveBefore=await readSave();
console.log('Save BEFORE pressing reset:', JSON.stringify(R.saveBefore));
R.permsBefore=await perms();
await page.screenshot({path:`${EV}/p3n-role-before-reset.png`,fullPage:true}).catch(()=>{});

const pressed=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
  .find(x=>/Reset To Template/i.test((x.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b) return 'no Reset To Template button'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed Reset To Template';});
console.log(pressed);
await page.waitForTimeout(3500);
R.resetDialog=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300),buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').trim()).filter(Boolean)}:null;});
if(R.resetDialog){ console.log('reset dialog:',JSON.stringify(R.resetDialog));
  await page.screenshot({path:`${EV}/p3n-reset-dialog.png`}).catch(()=>{});
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Reset|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim()));if(b)b.click();});
  await page.waitForTimeout(4000); }

R.saveAfterReset=await readSave();
console.log('\nSave AFTER pressing reset:', JSON.stringify(R.saveAfterReset));
R.roleHadDrifted = R.saveAfterReset && R.saveAfterReset.disabled===false;
console.log('>>> Save is', R.saveAfterReset&&R.saveAfterReset.disabled?'DISABLED -> the role was ALREADY in its default shape':'ENABLED -> the role HAD BEEN CHANGED by someone, so it was NOT default');
await page.screenshot({path:`${EV}/p3n-after-reset.png`,fullPage:true}).catch(()=>{});

if (R.roleHadDrifted) {
  const saved=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^Save$/i.test((x.innerText||'').trim())); if(!b)return 'no Save'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed Save';});
  console.log(saved); await page.waitForTimeout(5000);
  R.afterSaveDialog=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    if(!d)return null; const o=(d.innerText||'').replace(/\s+/g,' ').slice(0,260);
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Anyway|^(Save|Yes|Confirm|OK)$/i.test((x.innerText||'').trim())); if(b)b.click(); return o;});
  if(R.afterSaveDialog) console.log('after Save:',JSON.stringify(R.afterSaveDialog));
  await page.waitForTimeout(7000);
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
  R.saveAfterSaving=await readSave();
  console.log('Save after saving and reloading:',JSON.stringify(R.saveAfterSaving),'(should be disabled - nothing left to save)');
  await page.screenshot({path:`${EV}/p3n-role-saved.png`,fullPage:true}).catch(()=>{});
}
// what the person actually holds now
const g=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return{s:r.status(),j};};
const st=await g('/api/staff?pagination%5BrowsPerPage%5D=200&pagination%5Bpage%5D=1');
const arr=st.j?.data?.staff||[];
const me=arr.find(s=>/serviceadvisorlimitedview/.test(JSON.stringify(s)));
R.personRoleNow = me? (me.role?.name||me.role) : null;
console.log('\nthe lower-permission person now carries role:',JSON.stringify(R.personRoleNow));
fs.writeFileSync(`${EV}/p3n-role-reset.json`,JSON.stringify(R,null,1));
await browser.close();
