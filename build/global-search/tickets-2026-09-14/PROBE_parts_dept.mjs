// Turning "Parts Department" on reveals NINE more checkboxes -- three groups of
// View / Create & Edit / Delete. The reader attributes all nine to the "Parts Department" card,
// because the sub-groups do not use `.permission-card__title`, so a checkbox cannot yet be named.
// C45143 needs exactly ONE of the nine (Part Sales - View), so the names have to come first.
//
// This changes nothing: it turns the toggle on, reads the labels around each new checkbox, and
// reloads WITHOUT saving.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EDITOR=process.env.EDITOR_URL||'/administration/roles-permissions/f975eb82-3fd5-4c21-a577-f5754533c257/edit';
const R={at:new Date().toISOString(), editor:EDITOR};
const { browser, page } = await boot('sv9160','/administration/staff','admin');
await page.setViewportSize({width:1600,height:1800}).catch(()=>{});
await page.waitForTimeout(6000);
await page.goto('https://sv9160.qa.shopview.com'+EDITOR,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const park=async()=>{ await page.mouse.move(5,5); await page.waitForTimeout(300); };
await park();

// turn the department on -- named the way the reader names it
const box=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const nameOf=e=>{ const r=e.getBoundingClientRect();
    let nm=(e.innerText||'').replace(/\s+/g,' ').trim();
    if(!nm){ const near=[...document.querySelectorAll('div,span')].filter(vis)
      .map(t=>({d:Math.abs(t.getBoundingClientRect().top-r.top),
                txt:(t.innerText||'').replace(/\s+/g,' ').trim()}))
      .filter(t=>t.txt&&t.txt.length<60&&t.d<30).sort((a,b)=>a.d-b.d);
      nm=near.length?near[0].txt:''; }
    return nm; };
  const t=[...document.querySelectorAll('.q-toggle')].filter(vis)
    .find(e=>nameOf(e).startsWith('Parts Department'));
  if(!t) return null; t.scrollIntoView({block:'center'});
  const r=t.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
R.toggleFound=!!box;
if(box){ await page.mouse.move(box.x+box.w/2,box.y+box.h/2); await page.waitForTimeout(140);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  await page.waitForTimeout(2500); }
await park();

// name every checkbox by the nearest text ABOVE it that is not a column label
R.controls=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const colLabels=new Set([...document.querySelectorAll('.permission-card__column-label')]
    .map(e=>(e.innerText||'').trim()));
  const headings=[...document.querySelectorAll('div,span,h1,h2,h3,h4,h5,label')].filter(vis)
    .map(e=>({y:e.getBoundingClientRect().top, x:e.getBoundingClientRect().left,
              txt:(e.innerText||'').replace(/\s+/g,' ').trim(),
              cls:(e.className||'').toString().slice(0,60)}))
    .filter(h=>h.txt&&h.txt.length<50&&!colLabels.has(h.txt));
  return [...document.querySelectorAll('.q-checkbox')].filter(vis).map(e=>{
    const r=e.getBoundingClientRect();
    const above=headings.filter(h=>h.y<r.top-4&&h.y>r.top-160&&h.x<r.left+40)
      .sort((a,b)=>(r.top-a.y)-(r.top-b.y)).slice(0,3);
    // which column: nearest column label by x on the same row band
    const cols=[...document.querySelectorAll('.permission-card__column-label')].filter(vis)
      .map(c=>{const q=c.getBoundingClientRect();
               return {mid:q.left+q.width/2, y:q.top, name:(c.innerText||'').trim()};});
    let best=null,bd=1e9;
    for(const c of cols){ const d=Math.abs(c.mid-(r.left+r.width/2));
      if(Math.abs(c.y-r.top)<400 && d<bd){bd=d;best=c;} }
    return {y:Math.round(r.top), x:Math.round(r.left),
      column:best&&bd<90?best.name:null,
      on:e.getAttribute('aria-checked')==='true'||/q-checkbox--truthy/.test((e.className||'').toString()),
      nearestTextsAbove:above.map(a=>a.txt+'  ['+a.cls+']')};});});
fs.writeFileSync(`${DIR}/PROBE-PARTS-DEPT.json`,JSON.stringify(R,null,1));
for(const c of R.controls.slice(-12))
  console.log(String(c.y).padStart(5), (c.column||'?').padEnd(16), c.on?'on ':'off',
              JSON.stringify(c.nearestTextsAbove.slice(0,2)));
await page.screenshot({path:`${DIR}/roles-evidence/parts-department-open.png`,fullPage:true});
console.log('NOTHING SAVED');
await browser.close();
