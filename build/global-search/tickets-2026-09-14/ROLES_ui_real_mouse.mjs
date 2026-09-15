// Give one spare TECHNICIAN a narrower role THROUGH THE SCREEN, with REAL mouse events.
//
// Why this exists: the previous attempt drove the Location picker with element.click() from inside
// page.evaluate(). Quasar's QSelect opens its popup on mousedown/focus, which a synthetic click()
// never produces -- so the list read as EMPTY and got reported as "the branch offers no locations".
// The QA lead's own screenshot shows both locations listed. The product was fine; the instrument
// was not (Rule 104). Everything here uses page.mouse / page.keyboard so the app sees real input.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const WANT_ROLE=process.env.WANT_ROLE||'Time Clock User';
const SUBJECT=process.env.SUBJECT||'stephen.grimes@staging.shopview.local';
const R={at:new Date().toISOString(), subject:SUBJECT, wantRole:WANT_ROLE, steps:[]};
const save=()=>fs.writeFileSync(`${DIR}/ROLES-UI-REALMOUSE.json`,JSON.stringify(R,null,2));
const L=(...a)=>{ console.log(...a); R.steps.push(a.join(' ').slice(0,300)); };

const { browser, page } = await boot('sv9160','/administration/staff','admin');
await page.waitForTimeout(7000);

// real click at the centre of whatever the callback returns
// A box measured off-screen sends the mouse nowhere, and the click then reads as "the control does
// nothing". Scroll it into view, then check the point is actually inside the viewport before
// clicking, and say so when it is not instead of reporting a silent failure.
const clickReal=async(fn,arg)=>{
  const box=await page.evaluate(fn,arg);
  if(!box) return {ok:false,why:'no element matched'};
  const vp=page.viewportSize()||{width:1280,height:900};
  const x=box.x+box.w/2, y=box.y+box.h/2;
  if(x<0||y<0||x>vp.width||y>vp.height) return {ok:false,why:`element is off-screen at ${Math.round(x)},${Math.round(y)} in a ${vp.width}x${vp.height} viewport`};
  await page.mouse.move(x,y); await page.waitForTimeout(150);
  await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
  return {ok:true, at:`${Math.round(x)},${Math.round(y)}`};
};
// The staff list is long and only the first page is in the DOM, so the person must be SEARCHED
// for first -- the page has its own Search control. Clicking a row that is not rendered is the
// thing that made the last attempt report "the dialog did not open".
const searchFor=async term=>{
  const box=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis)
      .find(e=>/^search$/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
  if(box){ await page.mouse.move(box.x+box.w/2, box.y+box.h/2); await page.mouse.down();
    await page.waitForTimeout(80); await page.mouse.up(); await page.waitForTimeout(1500); }
  const typed=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const i=[...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
    if(!i) return null; i.focus(); const r=i.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};});
  if(typed){ await page.mouse.click(typed.x+typed.w/2, typed.y+typed.h/2); }
  await page.keyboard.type(term,{delay:60});
  await page.waitForTimeout(4000);
  return await page.evaluate(t=>[...document.querySelectorAll('tr')]
    .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x.includes(t)).slice(0,4), term);
};

// The row's edit control is a Material icon whose TEXT is the ligature "edit_note". Matching
// /edit/ against className grabbed a wrapper instead and the click went nowhere -- so match the
// ligature exactly, and fall back to the smallest element that carries it.
const boxOfRow=email=>{
  const rows=[...document.querySelectorAll('tr')].filter(r=>(r.innerText||'').includes(email));
  if(!rows.length) return null;
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  rows[0].scrollIntoView({block:'center'});
  const exact=[...rows[0].querySelectorAll('*')].filter(vis)
    .filter(e=>(e.textContent||'').trim()==='edit_note')
    .sort((a,b)=>(a.getBoundingClientRect().width*a.getBoundingClientRect().height)
                -(b.getBoundingClientRect().width*b.getBoundingClientRect().height));
  const btn=exact[0]
    || [...rows[0].querySelectorAll('button,[role=button],i,.q-btn')].filter(vis)
         .find(e=>/edit_note|more_vert|pencil/i.test((e.getAttribute('data-test-id')||'')+' '+(e.innerText||'')))
    || rows[0].querySelector('td');
  if(!btn) return null;
  const r=btn.getBoundingClientRect();
  return {x:r.x,y:r.y,w:r.width,h:r.height};
};
R.searchHits = await searchFor(SUBJECT.split('@')[0].split('.')[0]);
L('search hits:', JSON.stringify(R.searchHits).slice(0,300));
R.openedEditor = await clickReal(boxOfRow, SUBJECT);
L('edit control click:', JSON.stringify(R.openedEditor));
await page.screenshot({path:`${DIR}/run-evidence2/staff-after-edit-click.png`}).catch(()=>{});
if(!(await page.evaluate(()=>!!document.querySelector('.q-dialog')))){
  // second route: the row itself. Some tables open the editor on a row click rather than the icon.
  R.rowClickFallback=await clickReal(email=>{
    const r=[...document.querySelectorAll('tr')].find(x=>(x.innerText||'').includes(email));
    if(!r) return null; r.scrollIntoView({block:'center'});
    const c=r.querySelector('td'); const b=(c||r).getBoundingClientRect();
    return {x:b.x,y:b.y,w:b.width,h:b.height};}, SUBJECT);
  L('row click fallback:', JSON.stringify(R.rowClickFallback));
}
for(let i=0;i<8;i++){ await page.waitForTimeout(1200);
  if(await page.evaluate(()=>!!document.querySelector('.q-dialog'))) break; }
R.dialogOpen = await page.evaluate(()=>!!document.querySelector('.q-dialog'));
if(!R.dialogOpen){ R.whatIsOnScreen=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {dialogsAny:document.querySelectorAll('.q-dialog,[role=dialog]').length,
    url:location.pathname,
    headings:[...document.querySelectorAll('h1,h2,h3,.text-h6')].filter(vis)
      .map(e=>(e.innerText||'').trim()).slice(0,8)};}); }
L('editor opened:', R.openedEditor, '| dialog:', R.dialogOpen);
if(!R.dialogOpen){ R.abort='the edit dialog did not open for '+SUBJECT; save(); L(R.abort); await browser.close(); process.exit(2); }

const fields=async()=>page.evaluate(()=>{
  const d=document.querySelector('.q-dialog'); if(!d) return [];
  return [...d.querySelectorAll('.q-field')].map((f,i)=>({i,
    label:((f.querySelector('.q-field__label')||{}).innerText||'').trim(),
    value:(((f.querySelector('input')||{}).value)||((f.querySelector('.q-field__native')||{}).innerText||'')).trim()}));});
R.fieldsBefore=await fields();
L('fields:', JSON.stringify(R.fieldsBefore).slice(0,400));

const boxOfField=label=>{
  const d=document.querySelector('.q-dialog'); if(!d) return null;
  const f=[...d.querySelectorAll('.q-field')]
    .find(f=>new RegExp('^'+label,'i').test(((f.querySelector('.q-field__label')||{}).innerText||'').trim()));
  if(!f) return null;
  const c=f.querySelector('.q-field__control')||f;
  const r=c.getBoundingClientRect();
  return {x:r.x,y:r.y,w:r.width,h:r.height};
};
// THE TRAP THIS FIXES: the staff table behind the dialog is itself a virtual-scroll list of
// .q-item rows, so an unscoped '.q-item, [role=option], .q-virtual-scroll__content > *' returns
// SIXTY-FIVE STAFF ROWS and reads as a populated dropdown. It then "picks an option" by clicking a
// person in the table. Options are read from the POPUP ONLY -- the last .q-menu on the page, which
// is the one this click opened.
const menuCount=async()=>page.evaluate(()=>document.querySelectorAll('.q-menu').length);
const readOptions=async()=>{
  for(let i=0;i<12;i++){
    await page.waitForTimeout(800);
    const o=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const menus=[...document.querySelectorAll('.q-menu')].filter(vis);
      if(!menus.length) return null;
      const m=menus[menus.length-1];
      const items=[...m.querySelectorAll('.q-item,[role=option]')].filter(vis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
      return {items, menuText:(m.innerText||'').replace(/\s+/g,' ').trim().slice(0,200)};});
    if(o && o.items.length) return o;
    if(o) LASTMENUTEXT=o.menuText;
  }
  return {items:[], menuText:LASTMENUTEXT};
};
let LASTMENUTEXT=null;
const pickOption=async text=>{
  const r=await clickReal(t=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const menus=[...document.querySelectorAll('.q-menu')].filter(vis);
    if(!menus.length) return null;
    const m=menus[menus.length-1];
    const hit=[...m.querySelectorAll('.q-item,[role=option]')].filter(vis)
      .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim().includes(t));
    if(!hit) return null; hit.scrollIntoView({block:'center'});
    const b=hit.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height};}, text);
  await page.waitForTimeout(1800); return r;
};

// --- ROLE
await clickReal(boxOfField,'Role');
R.menusBeforeRole=await menuCount();
R.roleOptions=await readOptions();
L('role options:', R.roleOptions.items.length, JSON.stringify(R.roleOptions.items).slice(0,300),
  '| menu text:', (R.roleOptions.menuText||'').slice(0,120));
R.rolePicked=await pickOption(WANT_ROLE);
L('role picked:', JSON.stringify(R.rolePicked));

// --- LOCATION, the one that was wrongly called empty
await clickReal(boxOfField,'Location');
R.menusBeforeLocation=await menuCount();
R.locationOptions=await readOptions();
L('LOCATION OPTIONS:', R.locationOptions.items.length, JSON.stringify(R.locationOptions.items).slice(0,300),
  '| menu text:', (R.locationOptions.menuText||'').slice(0,120));
await page.screenshot({path:`${DIR}/run-evidence2/location-list-open.png`}).catch(()=>{});
R.locationPicked=await pickOption('Heavy Duty');
L('location picked:', JSON.stringify(R.locationPicked));
R.fieldsAfterPick=await fields();

// --- SAVE
const saveBox=()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=document.querySelector('.q-dialog'); if(!d) return null;
  const b=[...d.querySelectorAll('button')].filter(vis)
    .find(e=>/^save/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};};
R.saveClicked=await clickReal(saveBox);
await page.waitForTimeout(7000);
R.afterSave=await page.evaluate(()=>{
  const d=document.querySelector('.q-dialog');
  return {dialogStillOpen:!!d,
    errors:[...document.querySelectorAll('.q-field--error, .text-negative, .q-notification')]
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,6)};});
L('saved:', R.saveClicked, '| dialog still open:', R.afterSave.dialogStillOpen,
  '| errors:', JSON.stringify(R.afterSave.errors).slice(0,240));

// --- read the role back OFF THE TABLE, which is the tester's own evidence
await page.waitForTimeout(2000);
R.roleAfterOnTable=await page.evaluate(email=>{
  const row=[...document.querySelectorAll('tr')].find(r=>(r.innerText||'').includes(email));
  return row?(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,160):null;}, SUBJECT);
L('row now:', R.roleAfterOnTable);
save();
await browser.close();
