// Can a staff member's role be changed through the SCREEN?
//
// Six role cases need permission sets nobody on this branch holds. Behind the app, the staff-change
// endpoint refuses the id every staff member is listed under -- "'Staff' was not found" -- and no
// other id route answers. That leaves the screen, which is the route a person would use anyway.
//
// READ ONLY. It finds the staff settings page, locates one spare non-administrator, opens their
// record, and reports whether a role control is there and what it offers. Nothing is changed. The
// change itself is a separate, deliberate step once the shape is known.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APP } = await boot('sv9160','/','admin');
const out={at:new Date().toISOString(), routes:{}};
const snap=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {url:location.pathname+location.search,
    heading:(document.querySelector('h1,h2,[class*=page-title]')||{}).innerText||null,
    rowsWithRole:[...document.querySelectorAll('tr,[role=row],.q-item')].filter(vis)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,90))
      .filter(t=>/Technician|Foreman|Admin|Advisor|Representative/.test(t)).slice(0,6),
    tids:[...new Set([...document.querySelectorAll('[data-test-id]')].filter(vis)
      .map(e=>e.getAttribute('data-test-id')))].slice(0,40),
    bodyHead:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,260)};});

for(const r of ['/administration/staff','/administration/users','/settings/staff',
                '/administration/roles-permissions','/administration']){
  await page.goto(APP+r,{waitUntil:'domcontentloaded'}).catch(()=>{});
  await page.waitForTimeout(6000);
  out.routes[r]=await snap();
  if((out.routes[r].rowsWithRole||[]).length){ out.staffListRoute=r; break; }
}
// if a staff list was found, open the first non-administrator row and describe the record
if(out.staffListRoute){
  const opened=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const row=[...document.querySelectorAll('tr,[role=row],.q-item')].filter(vis)
      .find(e=>/Technician|Foreman/.test(e.innerText||''));
    if(!row) return null;
    const t=(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,80);
    row.click(); return t;});
  out.openedRow=opened;
  await page.waitForTimeout(6000);
  out.record=await snap();
  out.roleControl=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const cands=[...document.querySelectorAll('.q-select,select,label.q-field')].filter(vis)
      .map(e=>({cls:(''+(e.className||'')).slice(0,60), tid:e.getAttribute('data-test-id'),
        text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
        value:(e.querySelector('input')||{}).value||null}));
    return cands.filter(c=>/role|technician|foreman|admin/i.test(c.text+' '+(c.value||''))).slice(0,6);});
  await page.screenshot({path:`${DIR}/roles-evidence/PROBE-staff-record.png`}).catch(()=>{});
}
fs.writeFileSync(`${DIR}/PROBE-STAFF-UI.json`, JSON.stringify(out,null,2));
console.log(JSON.stringify({staffListRoute:out.staffListRoute, openedRow:out.openedRow,
  roleControl:out.roleControl,
  routeStatuses:Object.fromEntries(Object.entries(out.routes).map(([k,v])=>[k,v.heading||v.bodyHead.slice(0,60)]))},null,2).slice(0,1600));
await browser.close();
