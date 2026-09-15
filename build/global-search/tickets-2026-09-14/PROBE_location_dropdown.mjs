// The QA lead's own screenshot shows the Location list OPEN with both locations in it.
// So the earlier "the list offers none" was MY selector, not the product (Rule 104 exactly).
// This probe stops guessing at selectors: it opens the dialog, clicks the Location field, and
// DUMPS EVERY visible element that could be an option, with its classes -- so the real one is read,
// not assumed.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page } = await boot('sv9160','/administration/staff','admin');
const out={at:new Date().toISOString()};
await page.waitForTimeout(6000);

// find a TECHNICIAN row -- never the admin account (standing instruction: admin stays Admin)
const target='Stephen';
out.target=target;
const opened=await page.evaluate(name=>{
  const rows=[...document.querySelectorAll('tr')].filter(r=>(r.innerText||'').includes(name));
  if(!rows.length) return {found:false, sample:[...document.querySelectorAll('tr')].slice(0,3).map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,70))};
  rows[0].click(); return {found:true, text:(rows[0].innerText||'').replace(/\s+/g,' ').slice(0,90)};
}, target);
out.rowClick=opened;
await page.waitForTimeout(3000);
out.dialogOpen=await page.evaluate(()=>!!document.querySelector('.q-dialog'));

// what fields does the dialog carry, and which one is Location?
out.fields=await page.evaluate(()=>{
  const d=document.querySelector('.q-dialog'); if(!d) return null;
  return [...d.querySelectorAll('.q-field')].map((f,i)=>({i,
    label:(f.querySelector('.q-field__label')||{}).innerText||'',
    value:(f.querySelector('.q-field__native')||{}).innerText||(f.querySelector('input')||{}).value||'',
    cls:f.className.slice(0,80)}));});

// click the LOCATION field by its own label, then dump everything that appears
const before=await page.evaluate(()=>document.querySelectorAll('.q-menu').length);
out.menusBefore=before;
out.clicked=await page.evaluate(()=>{
  const d=document.querySelector('.q-dialog'); if(!d) return false;
  const f=[...d.querySelectorAll('.q-field')].find(f=>/Location/i.test((f.querySelector('.q-field__label')||{}).innerText||''));
  if(!f) return false;
  const t=f.querySelector('.q-field__native')||f.querySelector('.q-field__control')||f;
  t.click(); return true;});
await page.waitForTimeout(2500);

out.afterClick=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const dump=sel=>[...document.querySelectorAll(sel)].filter(vis).map(e=>({
    tag:e.tagName.toLowerCase(), cls:(e.className&&e.className.toString?e.className.toString():'').slice(0,70),
    text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)}));
  return {
    qmenu: dump('.q-menu'),
    roleOption: dump('[role=option]'),
    qitem: dump('.q-menu .q-item'),
    qitemAny: dump('.q-item').slice(0,25),
    listbox: dump('[role=listbox]'),
    portals: dump('.q-portal, #q-portal--menu--1, [id^=q-portal]'),
    bodyLastChildren: [...document.body.children].slice(-6).map(e=>({tag:e.tagName.toLowerCase(),
      cls:(e.className&&e.className.toString?e.className.toString():'').slice(0,60),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)}))};});
await page.screenshot({path:`${DIR}/run-evidence2/location-dropdown-open.png`,fullPage:false}).catch(()=>{});
fs.writeFileSync(`${DIR}/PROBE-LOCATION-DROPDOWN.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2).slice(0,4000));
await browser.close();
