// Standing Rule 105: reset a role to its template (UI two-confirm flow), returning before/after permission codes
export async function rolePerms(s,id){ const d=await s.api('/api/roles/'+id); return (d.json.data?.fe_permissions||d.json.fe_permissions||[]).map(p=>p.code||p.name).sort(); }
export async function resetRole(s,id){
  const p=s.page; const before=await rolePerms(s,id); const log=[];
  for(const path of ['/administration/roles','/administration/roles-and-permissions','/administration/settings']){
    await s.go(path); await p.waitForTimeout(2500); if(await s.box('action_edit_'+id)) { log.push('page '+path); break; }
    const tab=p.locator('.q-tab, a').filter({hasText:/Roles & Permissions/}).first(); if(await tab.count()){ await tab.click(); await p.waitForTimeout(2500); if(await s.box('action_edit_'+id)){ log.push('tab via '+path+' -> '+p.url()); break; } }
  }
  await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),'action_edit_'+id); await p.waitForTimeout(400);
  let b=await s.box('action_edit_'+id); if(!b) throw new Error('role edit not found '+id); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000);
  b=await s.box('reset_template_edit'); if(!b) throw new Error('reset button not found'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
  const rb=p.locator('.q-dialog button').filter({hasText:/^\s*Reset\s*$/}).last(); if(await rb.count()){ await rb.click(); log.push('reset confirmed'); } await p.waitForTimeout(1200);
  const sv=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="submit_edit_role"]'); return e? !(e.disabled||e.getAttribute('aria-disabled')==='true'||e.classList.contains('disabled')) : null;});
  log.push('save enabled='+sv);
  if(sv){ b=await s.box('submit_edit_role'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
    const cb=p.locator('.q-dialog button').filter({hasText:/^\s*Confirm\s*$/}).last(); if(await cb.count()){ await cb.click(); log.push('save confirmed'); } await p.waitForTimeout(2500); }
  else { const c=p.locator('.q-dialog button').filter({hasText:/Cancel|Close/}).last(); if(await c.count()) await c.click().catch(()=>{}); await p.keyboard.press('Escape'); }
  const after=await rolePerms(s,id);
  return {before,after,added:after.filter(x=>!before.includes(x)),removed:before.filter(x=>!after.includes(x)),log};
}
export async function assignRole(s,staff,roleId){
  const body={first_name:staff.first_name,last_name:staff.last_name,email:staff.email,role_id:roleId,workplace_id:staff.workplace_id,job_title:staff.job_title,salary_type:staff.salary_type,salary:staff.salary,billable:staff.billable,clockable:staff.clockable,is_sales_rep:staff.is_sales_rep};
  const r=await s.api('/api/staff/'+staff.staff_id+'/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  return {status:r.status, body:JSON.stringify(r.json).slice(0,300)};
}
