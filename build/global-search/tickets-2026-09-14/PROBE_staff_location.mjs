// What does the Location field in the staff editor actually open?
//
// The blocker gate refused the claim "a staff member's role cannot be changed here", and it was right
// to: the only thing proved is that the save is refused while Location is empty. That the Location
// list has nothing in it is NOT proved -- my poll returned nothing, and when I widened the selector it
// matched the staff table behind the dialog. The identical situation on the profile-menu location
// picker was my selector twice over.
//
// So: open the editor, click Location, and dump EVERYTHING that appears anywhere on the page.
// Read only. Nothing is saved.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APP } = await boot('sv9160','/administration/staff','admin');
await page.waitForTimeout(8000);
const out={at:new Date().toISOString()};

const EMAIL='angelica.harper@staging.shopview.local';
out.openedEditor=await page.evaluate((em)=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const tr=[...document.querySelectorAll('tr')].filter(vis).find(t=>(t.innerText||'').includes(em));
  if(!tr) return false;
  const btn=[...tr.querySelectorAll('button,[role=button],a,i,span')].filter(vis)
    .find(e=>/edit/i.test((e.getAttribute('data-test-id')||'')+' '+(e.innerText||'')+' '+(e.className||'')));
  if(!btn) return false; (btn.closest('button,[role=button],a')||btn).click(); return true;}, EMAIL);
await page.waitForTimeout(6000);

// describe the Location field itself before touching it
out.locationField=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!dlg) return null;
  const f=[...dlg.querySelectorAll('.q-select,label.q-field,div')].filter(vis)
    .filter(e=>/^Location\b/.test((e.innerText||'').replace(/\s+/g,' ').trim()))
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
  if(!f) return null;
  return {tag:f.tagName, cls:(''+(f.className||'')).slice(0,90),
    text:(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
    isQSelect:/q-select/.test(''+(f.className||'')),
    inputs:[...f.querySelectorAll('input')].map(i=>({cls:(''+(i.className||'')).slice(0,50),
      value:i.value, readOnly:i.readOnly, disabled:i.disabled, ariaExpanded:i.getAttribute('aria-expanded')})),
    hasArrow:/arrow_drop_down/.test(f.innerText||'')};});

// count the menus BEFORE, so anything new is attributable to the click
const menusBefore=await page.evaluate(()=>document.querySelectorAll('.q-menu,[role=listbox],[role=menu]').length);

// click it the way a person does -- a real pointer press on the field
const clicked=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!dlg) return null;
  const f=[...dlg.querySelectorAll('.q-select,label.q-field')].filter(vis)
    .find(e=>/^Location\b/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
  if(!f) return null;
  const r=f.getBoundingClientRect();
  return {x:Math.round(r.x+r.width-20), y:Math.round(r.y+r.height/2)};});
out.clickPoint=clicked;
if(clicked){ await page.mouse.click(clicked.x, clicked.y); }
await page.waitForTimeout(4000);

// dump EVERY menu-like container on the page, wherever it was appended
out.afterClick=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const menus=[...document.querySelectorAll('.q-menu,[role=listbox],[role=menu],.q-virtual-scroll')].filter(vis);
  return {menuCount:menus.length,
    menus:menus.map(m=>({cls:(''+(m.className||'')).slice(0,70),
      text:(m.innerText||'').replace(/\s+/g,' ').slice(0,300),
      itemCount:m.querySelectorAll('[role=option],.q-item').length,
      items:[...m.querySelectorAll('[role=option],.q-item')].map(e=>
        (e.innerText||'').replace(/\s+/g,' ').trim().slice(0,50)).slice(0,12)})),
    // and any element that merely LOOKS like an empty-list message
    emptyMessages:[...document.querySelectorAll('*')].filter(vis)
      .filter(e=>e.children.length===0 && /no (results|options|data)|nothing found/i.test(e.innerText||''))
      .map(e=>(e.innerText||'').trim().slice(0,60)).slice(0,4)};});
out.menusBefore=menusBefore;
await page.screenshot({path:`${DIR}/roles-evidence/PROBE-staff-location.png`}).catch(()=>{});
fs.writeFileSync(`${DIR}/PROBE-STAFF-LOCATION.json`, JSON.stringify(out,null,2));
console.log(JSON.stringify({locationField:out.locationField, clickPoint:out.clickPoint,
  menusBefore:out.menusBefore, afterClick:out.afterClick},null,1).slice(0,2000));
await browser.close();
