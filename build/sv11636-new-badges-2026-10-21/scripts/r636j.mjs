import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const SID='d2cb20a6-90a8-4884-ac50-022ff2fb9313', WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const ORIG=JSON.parse(fs.readFileSync('/tmp/qa21/r636-tech-original.json')); const L=ORIG.list;
const ROLES=[['Technician','af8d02b5-ecd1-4205-a82f-32a4d5bb1015'],['Service Advisor','2c04abb3-f348-4349-81e2-f934afe33e91'],['Parts Manager','2f39dd36-49fb-4bcc-b0b3-107854c5a82c']];
const only=process.argv[2]?process.argv[2].split(','):ROLES.map(r=>r[0]); const R={};
const permsOf=async(s,id)=>((await s.api('/api/roles/'+id)).json.data.fe_permissions||[]).map(x=>x.code).sort();
async function reset(s,p,id){ const before=await permsOf(s,id); await s.go(`/administration/roles-permissions/${id}/edit`); await p.waitForSelector('[data-test-id=reset_template_edit]',{timeout:45000});
  await p.click('[data-test-id=reset_template_edit]'); await p.waitForTimeout(1200); await p.locator('.q-dialog').last().locator('button',{hasText:/^Reset$/}).click(); await p.waitForTimeout(1500);
  const sub=p.locator('[data-test-id=submit_edit_role]'); const dis=await sub.isDisabled(); if(!dis){ await sub.click(); await p.waitForTimeout(1500); await p.locator('.q-dialog').last().locator('button',{hasText:/^Confirm$/}).click(); await p.waitForTimeout(2500); }
  const after=await permsOf(s,id); return {n_before:before.length,n_after:after.length,saveWasDisabled:dis,removed:before.filter(x=>!after.includes(x)),added:after.filter(x=>!before.includes(x)),reports:after.includes('reportsPageAccess')}; }
const assign=async(s,roleId)=>{ const body={first_name:L.first_name,last_name:L.last_name,email:L.email,role_id:roleId,workplace_id:WP,job_title:L.job_title,salary_type:L.salary_type,salary:L.salary,billable:L.billable,clockable:L.clockable,is_sales_rep:L.is_sales_rep};
  const r=await s.api('/api/staff/'+SID+'/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return r; };
const rec=async s=>(await s.api('/api/staff?limit=100&search=tech@shopview')).json.data.collection.find(x=>x.email==='tech@shopview.com');
const sameAsOrig=(x)=>['first_name','last_name','is_active','job_title','salary','salary_type','billable','clockable','is_sales_rep','defaultWorkplace','workplace_id'].filter(k=>JSON.stringify(x[k])!==JSON.stringify(L[k])).concat(JSON.stringify(x.departments)!==JSON.stringify(L.departments)?['departments']:[]);
for(const [name,id] of ROLES){ if(!only.includes(name)) continue;
  const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page;
  R[name]={reset:await reset(s,p,id)}; console.log(name,'reset',JSON.stringify(R[name].reset));
  const a=await assign(s,id); console.log(name,'assign status',a.status,JSON.stringify(a.json).slice(0,160)); const rr=await rec(s); R[name].staff={role:rr.role_label,diffVsOriginal:sameAsOrig(rr)}; console.log(name,'staff now',JSON.stringify(R[name].staff));
  await s.close();
  const t=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'tech',vp:{width:1440,height:900},dpr:2}); const tp=t.page; await t.go('/workorders'); await tp.waitForTimeout(7000);
  const read=()=>tp.evaluate(()=>({nav:[...document.querySelectorAll('header a')].map(a=>a.innerText.replace(/\s+/g,' ').trim()),switcher:!!document.querySelector('[data-test-id=toggle_display_option]')&&document.querySelector('[data-test-id=toggle_display_option]').getBoundingClientRect().width>0,pills:[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).map(e=>(e.getAttribute('data-test-id')||e.className.toString()).slice(0,28)),build:document.querySelector('meta[name=app-version]')?.content}));
  R[name].desktop=await read(); const fp=(await t.api('/api/auth/me/fe-permissions')).json.data; R[name].view=fp.view_mode; R[name].reportsPerm=fp.fe_permissions.includes('reportsPageAccess'); console.log(name,'1440',JSON.stringify(R[name].desktop),'reportsPerm',R[name].reportsPerm,'view',fp.view_mode);
  await tp.screenshot({path:`/tmp/qa21/role636-${name.replace(/ /g,'')}-1440.png`});
  await tp.setViewportSize({width:390,height:844}); await t.go('/workorders'); await tp.waitForTimeout(5000); await tp.click('[data-test-id=button_open_mobile_menu]').catch(()=>{}); await tp.waitForTimeout(1800);
  R[name].phone=await tp.evaluate(()=>{const d=[...document.querySelectorAll('.q-drawer')].pop(); return d?{items:[...d.querySelectorAll('a,.q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,22)).filter(Boolean),pills:[...d.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).length,switcherOnPage:!!document.querySelector('[data-test-id=toggle_display_option]')&&document.querySelector('[data-test-id=toggle_display_option]').getBoundingClientRect().width>0}:null}); console.log(name,'phone',JSON.stringify(R[name].phone));
  await tp.screenshot({path:`/tmp/qa21/role636-${name.replace(/ /g,'')}-390-menu.png`}); await t.close(); }
// restore Tech: reset Technician first (Rule 105), then assign back
const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page;
R.restore={techReset:await reset(s,p,ROLES[0][1])}; const a=await assign(s,ROLES[0][1]); const rr=await rec(s); R.restore.staff={status:a.status,role:rr.role_label,diffVsOriginal:sameAsOrig(rr)}; console.log('RESTORE',JSON.stringify(R.restore));
fs.writeFileSync('/tmp/qa21/r636-roles.json',JSON.stringify(R,null,1)); await s.close();
