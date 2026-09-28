// Build "no work order line editing" properly. The matrix is checkboxes in View / Create & Edit /
// Delete columns; the feature name sits to the LEFT on the same row. Match by vertical position,
// which is how a person reads it, rather than by walking ancestors.
//   -> C44574 (no tick boxes and no bar without that permission)
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const NAME='ZZAUTOTEST No Line Editing';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
const R={};
await page.waitForTimeout(5000);
if(await page.evaluate((n)=>[...document.querySelectorAll('tr')].some(t=>(t.innerText||'').includes(n)),NAME)){
  console.log('already exists - deleting it first so this run builds it cleanly');
  await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
    const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/edit/.test((e.innerText||e.textContent||'').trim())); if(b)b.click();},NAME);
  await page.waitForTimeout(11000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/Delete Role/i.test((e.innerText||'').replace(/\s+/g,' ')));if(b)b.click();});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].find(e=>/^Delete$/i.test((e.innerText||'').trim())); if(b)b.click();});
  await page.waitForTimeout(8000);
  await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
}
await page.locator('.q-btn:has-text("Create custom role")').first().click(); await page.waitForTimeout(6000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const c=[...d.querySelectorAll('div,li,button')].find(e=>/^Admin\b/.test((e.innerText||'').trim())&&(e.innerText||'').length<60); if(c)c.click();});
await page.waitForTimeout(2000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Apply'); if(b)b.click();});
await page.waitForTimeout(12000);
// map each checkbox to the feature name on its left, by vertical position
R.map=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const labels=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&vis(e))
    .map(e=>{const r=e.getBoundingClientRect();return {t:(e.textContent||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x),y:Math.round(r.y+r.height/2)};})
    .filter(l=>l.t && l.t.length>3 && l.t.length<44 && l.x<900);
  const boxes=[...document.querySelectorAll('.q-checkbox')].filter(vis).map(c=>{const r=c.getBoundingClientRect();
    return {x:Math.round(r.x), y:Math.round(r.y+r.height/2), checked:c.getAttribute('aria-checked')==='true'};});
  return boxes.map(b=>{ const near=labels.filter(l=>Math.abs(l.y-b.y)<16).sort((p,q)=>q.x-p.x)[0];
    const col = b.x<1380?'View' : b.x<1480?'Create & Edit' : 'Delete';
    return {feature: near?near.t:'(?)', column:col, x:b.x, y:b.y, checked:b.checked};});});
console.log('the matrix, read as a person reads it:');
const seen=new Set();
for(const m of R.map){ const k=m.feature+'|'+m.column; if(seen.has(k))continue; seen.add(k);
  console.log('   ',m.feature.padEnd(34),m.column.padEnd(14),m.checked?'[x]':'[ ]'); }
// untick "Create & Edit" on the work order LINES row
const target=R.map.find(m=>/line/i.test(m.feature)&&m.column==='Create & Edit')
         || R.map.find(m=>/work order line/i.test(m.feature));
console.log('\nthe one to switch off:',JSON.stringify(target));
if(target){
  await page.mouse.click(target.x+9,target.y); await page.waitForTimeout(2200);
  const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').slice(0,160);
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^(Disable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
    if(b){b.click(); return 'confirmed on: '+t;} return 'dialog: '+t;});
  if(casc){ console.log('   cascade ->',casc); await page.waitForTimeout(2500); }
  R.afterFlip=await page.evaluate((y)=>{const c=[...document.querySelectorAll('.q-checkbox')].filter(e=>{const r=e.getBoundingClientRect();
      return r.width>4 && Math.abs(r.y+r.height/2-y)<10;}).map(e=>({x:Math.round(e.getBoundingClientRect().x),checked:e.getAttribute('aria-checked')==='true'}));
    return c;},target.y);
  console.log('   that row now reads:',JSON.stringify(R.afterFlip));
}
await page.locator('.q-field:has-text("Role Name") input').first().fill(NAME); await page.waitForTimeout(1200);
R.created=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width&&!/disabled/.test(x.className||''))
  .find(x=>/^(Create|Save)$/i.test((x.innerText||'').trim())); if(!b)return 'no Create'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed '+(b.innerText||'').trim();});
console.log('\n',R.created); await page.waitForTimeout(7000);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .find(x=>/Anyway|^(Confirm|Yes|Continue|Save|Create)$/i.test((x.innerText||'').trim())); if(b)b.click();});
await page.waitForTimeout(10000);
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.row=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():null;},NAME);
console.log('the role row:',JSON.stringify(R.row));
fs.writeFileSync(`${EV}/s32-role.json`,JSON.stringify(R,null,1));
await browser.close();
