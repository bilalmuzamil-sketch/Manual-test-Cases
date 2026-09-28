// Third attempt, and this time using the product's own affordance rather than guessing at the DOM:
// the Permissions panel has a "Search permission" box. Type the permission's name, let the product
// filter to it, then tick or untick it in the card that remains. Delete the misnamed clone my earlier
// attempts left behind first.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const BAD='ZZAUTOTEST No Line Editing';
const NAME='ZZAUTOTEST Lines Read Only';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const delRole=async(n)=>{ await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const there=await page.evaluate((x)=>[...document.querySelectorAll('tr')].some(t=>(t.innerText||'').includes(x)),n);
  if(!there) return n+' is not there';
  await page.evaluate((x)=>{const t=[...document.querySelectorAll('tr')].find(r=>(r.innerText||'').includes(x));
    const b=[...t.querySelectorAll('button,.q-btn,i')].find(e=>/edit/.test((e.innerText||e.textContent||'').trim())); if(b)b.click();},n);
  await page.waitForTimeout(11000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/Delete Role/i.test((e.innerText||'').replace(/\s+/g,' ')));if(b)b.click();});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].find(e=>/^Delete$/i.test((e.innerText||'').trim())); if(b)b.click();});
  await page.waitForTimeout(8000); return 'deleted '+n; };
console.log(await delRole(BAD));

await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.locator('.q-btn:has-text("Create custom role")').first().click(); await page.waitForTimeout(6000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const c=[...d.querySelectorAll('div,li,button')].find(e=>/^Admin\b/.test((e.innerText||'').trim())&&(e.innerText||'').length<60); if(c)c.click();});
await page.waitForTimeout(2000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Apply'); if(b)b.click();});
await page.waitForTimeout(12000);
// use the product's own search
const box=page.locator('input').filter({hasNot:page.locator('x')}).nth(0);
const sIx=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')].filter(x=>x.getBoundingClientRect().width);
  return i.findIndex(x=>/Search permission/i.test(((x.closest('.q-field')||{}).innerText||'')+' '+(x.getAttribute('placeholder')||'')));});
console.log('the Search permission box is input',sIx);
if(sIx>=0){ const b=page.locator('input:visible').nth(sIx); await b.click(); await b.type('line',{delay:70}); await page.waitForTimeout(4000); }
R.filtered=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const cards=[...document.querySelectorAll('div')].filter(e=>vis(e)&&e.querySelector('.q-checkbox')&&(e.innerText||'').length<300&&(e.innerText||'').length>10);
  const seen=new Set(); const out=[];
  cards.forEach(c=>{const t=(c.innerText||'').replace(/\s+/g,' ').trim().slice(0,90);
    if(seen.has(t))return; seen.add(t);
    out.push({t, boxes:[...c.querySelectorAll('.q-checkbox')].filter(vis).map(x=>{const r=x.getBoundingClientRect();
      return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),checked:x.getAttribute('aria-checked')==='true'};})});});
  return out.slice(0,8);});
console.log('\nafter searching "line", the cards showing are:');
R.filtered.forEach(f=>console.log('   ',JSON.stringify(f.t.slice(0,80)),'| boxes:',JSON.stringify(f.boxes.map(b=>(b.checked?'[x]':'[ ]')+'@'+b.x))));
await page.screenshot({path:`${EV}/s33-filtered.png`,fullPage:true}).catch(()=>{});
// the smallest card mentioning lines, its Create & Edit box is the middle column (~x 1456)
const card=R.filtered.filter(f=>/line/i.test(f.t)).sort((a,b)=>a.t.length-b.t.length)[0];
console.log('\nthe card to change:',JSON.stringify(card&&card.t.slice(0,70)));
if(card && card.boxes.length>=2){
  // This card has only TWO boxes - Create & Edit and Delete - because lines have no separate View.
  // Index 1 is therefore DELETE, not Create & Edit. Pick by the COLUMN's x instead: the column
  // headings sit at View 1347, Create & Edit 1456, Delete 1552.
  const CE_X=1456;
  const ce=card.boxes.sort((a,b)=>Math.abs(a.x-CE_X)-Math.abs(b.x-CE_X))[0];
  console.log('   unticking Create & Edit at',JSON.stringify(ce));
  await page.mouse.click(ce.x,ce.y); await page.waitForTimeout(2500);
  const casc=await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
    if(!d)return null; const t=(d.innerText||'').replace(/\s+/g,' ').slice(0,170);
    const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
      .find(e=>/^(Disable|Confirm|Yes|Continue|OK)$/i.test((e.innerText||'').trim()));
    if(b){b.click(); return 'confirmed on: '+t;} return 'dialog: '+t;});
  if(casc){ console.log('   cascade ->',casc); await page.waitForTimeout(3000); }
  // Re-read by finding the CARD again - the page re-renders, so a remembered y is stale.
  R.after=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
    const c=[...document.querySelectorAll('div')].filter(e=>vis(e)&&e.querySelector('.q-checkbox')
      &&/Work order lines/i.test(e.innerText||'')&&(e.innerText||'').length<300)
      .sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    if(!c) return null;
    return [...c.querySelectorAll('.q-checkbox')].filter(vis).map(x=>({x:Math.round(x.getBoundingClientRect().x),
      checked:x.getAttribute('aria-checked')==='true'}));});
  console.log('   the Work order lines card now reads:',JSON.stringify(R.after));
  R.flipped=Array.isArray(R.after) && R.after.some(b=>!b.checked);
}
if(!R.flipped){ console.log('\nthe change did not take - NOT creating a role that would lie about itself');
  fs.writeFileSync(`${EV}/s33-role.json`,JSON.stringify(R,null,1)); await browser.close(); process.exit(1); }
await page.locator('.q-field:has-text("Role Name") input').first().fill(NAME); await page.waitForTimeout(1200);
R.created=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width&&!/disabled/.test(x.className||''))
  .find(x=>/^(Create|Save)$/i.test((x.innerText||'').trim())); if(!b)return 'no Create'; b.scrollIntoView({block:'center'}); b.click(); return 'pressed '+(b.innerText||'').trim();});
console.log('\n',R.created); await page.waitForTimeout(8000);
await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  if(!d)return; const b=[...d.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .find(x=>/Anyway|^(Confirm|Yes|Continue|Save|Create)$/i.test((x.innerText||'').trim())); if(b)b.click();});
await page.waitForTimeout(10000);
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
R.row=await page.evaluate((n)=>{const t=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(n));
  return t?(t.innerText||'').replace(/\s+/g,' ').trim():null;},NAME);
console.log('the role row:',JSON.stringify(R.row));
fs.writeFileSync(`${EV}/s33-role.json`,JSON.stringify(R,null,1));
await browser.close();
