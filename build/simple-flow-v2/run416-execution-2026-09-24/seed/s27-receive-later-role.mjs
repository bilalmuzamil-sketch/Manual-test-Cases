// The Admin account carries no receive-later permission and the Receive control is a plain button.
// A role named "ZZAUTOTEST Receive Later" already exists from an earlier session - but a role's NAME
// is not evidence about its contents (L0215: my own builder once created a role whose name lied).
// Open it, read the "Receive later" toggle back, switch it on if it is off, save, and assign it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='ZZAUTOTEST Receive Later';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
await page.waitForTimeout(5000);
const open=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  if(!t)return 'not listed'; const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/edit/.test((e.innerText||e.textContent||'').trim()));
  if(!b)return 'no edit control'; b.click(); return 'opened';},ROLE);
console.log('opening the role:',open); await page.waitForTimeout(12000);
const readToggle=async()=>await page.evaluate(()=>{
  const t=[...document.querySelectorAll('.q-toggle')].find(tg=>{let row=tg.parentElement,txt='';
    for(let i=0;i<5&&row;i++){txt=(row.innerText||'').replace(/\s+/g,' ').trim(); if(txt&&txt.length<70)break; row=row.parentElement;}
    return /^Receive later$/i.test(txt);});
  if(!t) return null; return {on:t.getAttribute('aria-checked')==='true'};});
R.before=await readToggle();
console.log('the "Receive later" toggle reads:',JSON.stringify(R.before));
if(R.before && !R.before.on){
  await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-toggle')].find(tg=>{let row=tg.parentElement,txt='';
      for(let i=0;i<5&&row;i++){txt=(row.innerText||'').replace(/\s+/g,' ').trim(); if(txt&&txt.length<70)break; row=row.parentElement;}
      return /^Receive later$/i.test(txt);});
    t.scrollIntoView({block:'center'}); (t.querySelector('input')||t).click();});
  await page.waitForTimeout(2000);
  const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').slice(0,150);
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^(Enable|Disable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
    if(b){b.click(); return 'confirmed on: '+t;} return 'dialog: '+t;});
  if(casc){console.log('   cascade ->',casc); await page.waitForTimeout(2500);}
  R.saved=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^Save$/i.test((x.innerText||'').trim()));
    if(!b)return 'no Save'; if(/disabled/.test(b.className||''))return 'Save is greyed - nothing to save';
    b.scrollIntoView({block:'center'}); b.click(); return 'pressed Save';});
  console.log('   ',R.saved); await page.waitForTimeout(6000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(x=>/Anyway|^(Confirm|Yes|Continue|Save)$/i.test((x.innerText||'').trim())); if(b)b.click();});
  await page.waitForTimeout(9000);
  // read it back, from a fresh load
  await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
    const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/edit/.test((e.innerText||e.textContent||'').trim())); if(b)b.click();},ROLE);
  await page.waitForTimeout(12000);
  R.after=await readToggle();
  console.log('   read back after saving:',JSON.stringify(R.after));
}
// assign it
await page.goto(`${APP}/administration/staff`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
for(const from of ['Technician',ROLE,'Admin']){
  R.assigned=await setRoleFor(page,WHO,from,ROLE);
  console.log('assigning via the',from,'filter ->',R.assigned);
  if(!/not listed/.test(R.assigned)) break;
}
await page.goto(`${APP}/administration/staff?roles=`+encodeURIComponent(ROLE),{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.readBack=await page.evaluate((e)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(e));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():'not in this role';},WHO);
console.log('read back:',JSON.stringify(R.readBack));
fs.writeFileSync(`${EV}/s27-receive-later.json`,JSON.stringify(R,null,1));
await browser.close();
