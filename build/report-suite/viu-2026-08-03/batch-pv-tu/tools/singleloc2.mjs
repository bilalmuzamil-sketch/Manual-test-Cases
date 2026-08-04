import { boot } from './boot8582.mjs';
import { APP, login, api } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/perms';
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const SALES_REP='b176ec30-2def-49af-ab11-782c2f6bd503';
const SLUGS=['parts-velocity','technician-utilization'];
const res={buildMarker:'v3.4.1-0ed4433', capturedAt:new Date().toISOString(), method:'seed Sales Representative + single workplace, switch-user impersonate, observe, restore'};
const readToolbar=page=>page.evaluate(()=>{const main=document.querySelector('main')||document.body;
 const clean=s=>(s||'').replace(/\n+/g,' ').replace(/\s+/g,' ').trim();
 const selects=[...main.querySelectorAll('.q-select')].map(e=>clean(e.innerText));
 const labels=[...main.querySelectorAll('.q-field__label')].map(e=>clean(e.innerText));
 return {selectTexts:selects, fieldLabels:[...new Set(labels)],
  hasLocationControl: selects.some(s=>/^Location\b/i.test(s))||labels.some(l=>/^Location$/i.test(l)),
  columnHeaders:[...document.querySelectorAll('table thead th')].map(th=>clean(th.innerText).replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g,'').trim()).filter(Boolean),
  dateRangeLabel: clean(document.querySelector('.date-range-label')?.textContent||'')};});
let t=await login('admin');
const st=await api(t.sessCookie,'GET','/api/staff?limit=300');
const subj=(st.body.data.collection).find(s=>s.email==='wesley.mcclure@staging.shopview.local');
const origRole=subj.role_id, origWp=subj.workplace_id;
res.subject={email:subj.email, staff_id:subj.staff_id};
const change=(roleId,wp)=>api(t.sessCookie,'POST',`/api/staff/${subj.staff_id}/change`,{first_name:subj.first_name,last_name:subj.last_name,email:subj.email,
 role_id:roleId, workplace_id:wp, job_title:subj.job_title, salary_type:subj.salary_type, salary:subj.salary, billable:subj.billable, clockable:subj.clockable});
res.seedAssign=(await change(SALES_REP,HD)).status;
{const {browser,page,sessCookie}=await boot('admin');
 await api(sessCookie,'POST','/api/switch-user',{user_id:subj.id});
 const me=await api(sessCookie,'GET','/api/auth/me/fe-permissions');
 const mw=await api(sessCookie,'GET','/api/staff/my-workplaces');
 const wps=(mw.body.data?.collection||[]).map(w=>w.name);
 res.impersonated={slug:me.body?.data?.template_slug, atoms:me.body?.data?.fe_permissions?.length, workplaces:wps,
  hasReports:(me.body?.data?.fe_permissions||[]).includes('reportsPageAccess')};
 console.log('IMPERSONATED',JSON.stringify(res.impersonated));
 const cookies=sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return {name:p.slice(0,i),value:p.slice(i+1),domain:'.qa.shopview.com',path:'/'};});
 const ctx=page.context(); await ctx.clearCookies(); await ctx.addCookies(cookies);
 await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
 await page.evaluate(f=>{localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));},me.body.data);
 res.singleLoc={};
 for(const slug of SLUGS){ await page.goto(APP+'/reports/'+slug,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
   res.singleLoc[slug]=await readToolbar(page);
   const sels=await page.$$('.q-select');
   for(const s of sels){const tx=(await s.evaluate(e=>e.innerText.replace(/\n/g,' '))).trim(); if(/^Location/.test(tx)){const b=await s.boundingBox(); await page.mouse.click(b.x+b.width-14,b.y+b.height/2); await page.waitForTimeout(1400);
     res.singleLoc[slug].locationMenu=(await page.$$eval('.q-menu',ms=>ms.map(m=>m.innerText)))[0]; await page.keyboard.press('Escape'); await page.waitForTimeout(400); break;}}
   await page.screenshot({path:`${OUT}/singleloc2-${slug}.png`});
   console.log('1-LOC',slug,'LocationFilter:',res.singleLoc[slug].hasLocationControl,'| cols:',JSON.stringify(res.singleLoc[slug].columnHeaders),'| menu:',JSON.stringify(res.singleLoc[slug].locationMenu));}
 await browser.close();}
t=await login('admin'); res.restore=(await change(origRole,origWp)).status;
const v=await api(t.sessCookie,'GET','/api/staff?limit=300');
const back=(v.body.data.collection).find(s=>s.staff_id===subj.staff_id);
res.restoreVerify={role_label:back?.role_label, workplace_id:back?.workplace_id, matchesOriginal: back?.role_id===origRole&&back?.workplace_id===origWp};
console.log('RESTORED',JSON.stringify(res.restoreVerify));
fs.writeFileSync(`${OUT}/singleloc-pv-tu.json`,JSON.stringify(res,null,2));
