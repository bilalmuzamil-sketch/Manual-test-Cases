// Find the control a person actually uses to change location.
//
// Changing it behind the app returns success and the header does not move, so the case about
// switching location cannot be run that way. A first attempt at driving the screen clicked something
// carrying the location name but found no option to pick afterwards. Rather than guess again, look:
// dump every element that carries the location text, click the most likely, and dump whatever opens.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APP } = await boot('sv9160','/workorders','admin');
await page.waitForTimeout(5000);
const out={at:new Date().toISOString()};

const carriers=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const re=/Staging [A-Za-z ]+- ?\d+/;
  return [...document.querySelectorAll('*')].filter(vis)
    .filter(e=>re.test(e.innerText||'') && (e.innerText||'').length<120)
    // smallest elements first: the one that OWNS the text, not its ancestors
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)
    .slice(0,8)
    .map(e=>({tag:e.tagName, tid:e.getAttribute('data-test-id'),
      cls:(''+(e.className||'')).slice(0,70),
      role:e.getAttribute('role'),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
      clickableAncestor:(()=>{const a=e.closest('button,[role=button],a,[tabindex]');
        return a?{tag:a.tagName, tid:a.getAttribute('data-test-id'), cls:(''+(a.className||'')).slice(0,60)}:null;})()}));});

out.before=await carriers();
// click the smallest carrier's clickable ancestor and see what opens
const clicked=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const re=/Staging [A-Za-z ]+- ?\d+/;
  const all=[...document.querySelectorAll('*')].filter(vis)
    .filter(e=>re.test(e.innerText||'') && (e.innerText||'').length<120)
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length);
  const el=all[0]; if(!el) return null;
  const target=el.closest('button,[role=button],a,[tabindex]')||el;
  target.click();
  return {tag:target.tagName, tid:target.getAttribute('data-test-id'), cls:(''+(target.className||'')).slice(0,70)};});
out.clicked=clicked;
await page.waitForTimeout(3000);

out.afterClick=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const menus=[...document.querySelectorAll('.q-menu,.q-dialog,[role=menu],[role=listbox],[role=dialog]')].filter(vis);
  return {menuCount:menus.length,
    menus:menus.map(m=>({cls:(''+(m.className||'')).slice(0,60),
      text:(m.innerText||'').replace(/\s+/g,' ').slice(0,400),
      items:[...m.querySelectorAll('[role=option],.q-item,li,button')].filter(vis)
        .map(e=>({tag:e.tagName, tid:e.getAttribute('data-test-id'),
          text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)})).slice(0,15)}))};});
await page.screenshot({path:`${DIR}/special-evidence/PROBE-location-after-click.png`});

// SECOND STEP: click the "Change Location" row and dump whatever that opens. The menu and the row
// are both reachable; what could not be found was the location to pick, so the picker's own shape is
// the missing piece.
out.step2={};
out.step2.clickedChangeLocation=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const row=[...document.querySelectorAll('div,button,a,[role=menuitem],.q-item')].filter(vis)
    .filter(e=>/Change Location/i.test(e.innerText||'') && (e.innerText||'').length<90)
    .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
  if(!row) return false; (row.closest('button,[role=button],a,.q-item')||row).click(); return true;});
await page.waitForTimeout(4000);
out.step2.opened=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const panels=[...document.querySelectorAll('.q-menu,.q-dialog,[role=menu],[role=listbox],[role=dialog],.q-select')].filter(vis);
  return {panelCount:panels.length,
    panels:panels.map(m=>({cls:(''+(m.className||'')).slice(0,60),
      text:(m.innerText||'').replace(/\s+/g,' ').slice(0,500),
      selects:[...m.querySelectorAll('.q-select,select,input')].map(e=>({tag:e.tagName,
        tid:e.getAttribute('data-test-id'), cls:(''+(e.className||'')).slice(0,50),
        value:e.value||null})),
      items:[...m.querySelectorAll('[role=option],.q-item,li,button,label')].filter(vis)
        .map(e=>({tag:e.tagName, tid:e.getAttribute('data-test-id'),
          text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)})).slice(0,20)}))};});
await page.screenshot({path:`${DIR}/special-evidence/PROBE-location-step2.png`});
fs.writeFileSync(`${DIR}/PROBE-LOCATION.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1).slice(0,2200));
await browser.close();
