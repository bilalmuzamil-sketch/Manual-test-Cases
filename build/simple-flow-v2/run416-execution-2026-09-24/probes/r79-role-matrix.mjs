// My role builder only ever scanned .q-toggle, which holds the cross-toggles. The main permission
// matrix is checkboxes. Read it properly: every checkbox, with the row heading it belongs to and the
// column it sits under, so a role can be built by naming a real permission instead of guessing.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/administration/roles-permissions',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(30000);
await page.waitForTimeout(5000);
await page.locator('.q-btn:has-text("Create custom role")').first().click(); await page.waitForTimeout(6000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const c=[...d.querySelectorAll('div,li,button')].find(e=>/^Admin\b/.test((e.innerText||'').trim())&&(e.innerText||'').length<60); if(c)c.click();});
await page.waitForTimeout(2000);
await page.evaluate(()=>{const d=document.querySelector('.q-dialog');
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>(x.innerText||'').trim()==='Apply'); if(b)b.click();});
await page.waitForTimeout(12000);
const R=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const boxes=[...document.querySelectorAll('.q-checkbox')].filter(vis).map(c=>{
    const r=c.getBoundingClientRect();
    // the row heading: the nearest ancestor row whose text is short and descriptive
    let row=c.parentElement, rowText='';
    for(let i=0;i<6&&row;i++){ const t=(row.innerText||'').replace(/\s+/g,' ').trim();
      if(t && t.length<90){ rowText=t; } row=row.parentElement; }
    return {checked:c.getAttribute('aria-checked')==='true', x:Math.round(r.x), y:Math.round(r.y),
      own:(c.innerText||'').replace(/\s+/g,' ').trim().slice(0,30), row:rowText.slice(0,80)};});
  // column headings sit above the first row of boxes
  const minY=Math.min(...boxes.map(b=>b.y));
  const heads=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&vis(e)
      &&/^(View|Create & Edit|Delete|Full|None)$/i.test((e.textContent||'').trim())
      &&e.getBoundingClientRect().y<minY+10)
    .map(e=>({t:(e.textContent||'').trim(),x:Math.round(e.getBoundingClientRect().x)}));
  const groups={};
  boxes.forEach(b=>{ (groups[b.row]=groups[b.row]||[]).push({x:b.x,checked:b.checked}); });
  return {count:boxes.length, columnHeads:heads, groups:Object.entries(groups).slice(0,26)
    .map(([k,v])=>({row:k, boxes:v.sort((a,b)=>a.x-b.x)}))};});
console.log('checkboxes in the matrix:',R.count);
console.log('column headings:',JSON.stringify(R.columnHeads));
console.log('\nrows:');
R.groups.forEach(g=>console.log('  ',JSON.stringify(g.row.slice(0,62)).padEnd(66),g.boxes.map(b=>(b.checked?'[x]':'[ ]')+'@'+b.x).join(' ')));
await page.screenshot({path:`${EV}/r79-matrix.png`,fullPage:true}).catch(()=>{});
fs.writeFileSync(`${EV}/r79-matrix.json`,JSON.stringify(R,null,1));
await browser.close();
