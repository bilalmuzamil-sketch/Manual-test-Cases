// Clean up after myself:
//  1. "ZZAUTOTEST No Line Edit" was created WITHOUT its intended change (my label match failed), so it
//     is a full Admin clone wearing a name that lies. A misleading role is worse than no role - the
//     next person to use it would measure Admin and think they measured a restricted user. Delete it.
//  2. Put the second person back in Technician, and prove that role is default with Reset To Template
//     (Rule 118) so the next permission check starts from a known state.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setRoleFor } from './lib-role.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const BAD='ZZAUTOTEST No Line Edit';
const {browser,page}=await bootProdLogin('/administration/staff',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
// 1. put the person back first - a role in use cannot be deleted
for(const from of ['ZZAUTOTEST Order No Money','Technician','Admin']){
  R.restored=await setRoleFor(page,WHO,from,'Technician');
  console.log('restoring via the',from,'filter ->',R.restored);
  if(!/not listed/.test(R.restored)) break;
}
await page.goto(`${APP}/administration/staff?roles=Technician`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.readBack=await page.evaluate((e)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(e));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():'not in Technician';},WHO);
console.log('read back:',JSON.stringify(R.readBack));

// 2. delete the misleading role
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
const open=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  if(!t) return 'not listed'; const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/edit/.test((e.innerText||e.textContent||'').trim()));
  if(!b) return 'no edit control'; b.click(); return 'opened '+n;},BAD);
console.log('\n',open); await page.waitForTimeout(11000);
if(/opened/.test(open)){
  const del=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .find(e=>/Delete Role/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return 'no Delete Role button'; b.click(); return 'pressed Delete Role';});
  console.log('  ',del); await page.waitForTimeout(3500);
  const conf=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d) return 'no confirmation'; const t=(d.innerText||'').replace(/\s+/g,' ').slice(0,140);
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^(Delete|Yes|Confirm|OK)$/i.test((e.innerText||'').trim()));
    if(!b) return 'no confirm button on: '+t; b.click(); return 'confirmed on: '+t;});
  console.log('  ',conf); await page.waitForTimeout(8000);
}
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.stillThere=await page.evaluate((n)=>[...document.querySelectorAll('tr')].some(t=>(t.innerText||'').includes(n)),BAD);
console.log('  the misleading role is still listed:',R.stillThere);
R.roles=await page.evaluate(()=>[...document.querySelectorAll('tr')].map(t=>(t.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>/ZZAUTOTEST/.test(t)));
console.log('  my test roles now:',JSON.stringify(R.roles));
await page.screenshot({path:`${EV}/s26-cleanup.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/s26-cleanup.json`,JSON.stringify(R,null,1));
await browser.close();
