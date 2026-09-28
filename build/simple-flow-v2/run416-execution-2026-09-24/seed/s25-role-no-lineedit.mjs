// A person who cannot create or edit work order lines - C44574 says they should see no tick boxes and
// no bar at all. Build the role from the Admin template. The label must be matched as the editor
// actually writes it, so list the toggles first rather than guessing a wording.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST No Line Edit';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
await page.waitForTimeout(4000);
if(await page.evaluate((n)=>[...document.querySelectorAll('tr')].some(t=>(t.innerText||'').includes(n)),NAME)){
  console.log('role already exists - reusing'); }
else {
  await page.locator('.q-btn:has-text("Create custom role")').first().click(); await page.waitForTimeout(6000);
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
    const c=[...d.querySelectorAll('div,li,button')].find(e=>/^Admin\b/.test((e.innerText||'').trim())&&(e.innerText||'').length<60); if(c)c.click();});
  await page.waitForTimeout(2000);
  await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Apply'); if(b)b.click();});
  await page.waitForTimeout(11000);
  // list every toggle's label so the right one is matched, not guessed
  R.labels=await page.evaluate(()=>{const out=[];
    document.querySelectorAll('.q-toggle').forEach(t=>{let row=t.parentElement,txt='';
      for(let i=0;i<5&&row;i++){ txt=(row.innerText||'').replace(/\s+/g,' ').trim(); if(txt&&txt.length<70) break; row=row.parentElement; }
      if(txt) out.push(txt.slice(0,60));});
    return [...new Set(out)];});
  console.log('toggles on the role editor:'); R.labels.forEach(l=>console.log('   ',JSON.stringify(l)));
  const target=(R.labels||[]).find(l=>/line/i.test(l)&&/create|edit/i.test(l));
  console.log('\nthe one that governs editing lines:',JSON.stringify(target));
  if(target){
    R.flip=await page.evaluate((L)=>{let el=null;
      for(const e of document.querySelectorAll('*')) if(e.children.length===0&&(e.textContent||'').trim()===L.split(' ')[0]) {}
      // find the toggle whose surrounding row reads exactly this label
      const tg=[...document.querySelectorAll('.q-toggle')].find(t=>{let row=t.parentElement,txt='';
        for(let i=0;i<5&&row;i++){txt=(row.innerText||'').replace(/\s+/g,' ').trim(); if(txt&&txt.length<70)break; row=row.parentElement;}
        return txt===L;});
      if(!tg) return 'toggle not found for '+L;
      const on=tg.getAttribute('aria-checked')==='true';
      tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click();
      return 'flipped "'+L+'" from '+(on?'on':'off');},target);
    console.log('  ',R.flip); await page.waitForTimeout(2000);
    const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
      if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').slice(0,170);
      const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
        .find(e=>/^(Disable|Enable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
      if(b){b.click(); return 'confirmed on: '+t;} return 'dialog: '+t;});
    if(casc){console.log('   cascade ->',casc); await page.waitForTimeout(2500);}
  }
  await page.locator('.q-field:has-text("Role Name") input').first().fill(NAME);
  await page.waitForTimeout(1000);
  R.created=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width)
    .find(x=>/^(Create|Save)$/i.test((x.innerText||'').trim())); if(!b)return 'no Create'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed '+(b.innerText||'').trim();});
  console.log('  ',R.created); await page.waitForTimeout(6000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(x=>/Anyway|^(Disable|Confirm|Yes|Continue|Save|Create)$/i.test((x.innerText||'').trim())); if(b)b.click();});
  await page.waitForTimeout(9000);
}
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.row=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():null;},NAME);
console.log('\nthe role row reads:',JSON.stringify(R.row));
fs.writeFileSync(`${EV}/s25-role-no-lineedit.json`,JSON.stringify(R,null,1));
await browser.close();
