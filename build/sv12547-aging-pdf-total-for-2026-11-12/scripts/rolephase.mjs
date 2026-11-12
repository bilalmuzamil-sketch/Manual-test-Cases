import {sess,post} from './common.mjs'; import fs from 'fs';
const PH=process.argv[2]; const RID=process.argv[3];
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/administration/settings'); await p.waitForTimeout(2500);
const get=u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return {st:r.status,j:await r.json().catch(()=>null)}},s.host.api+u);
const role=async id=>{const r=await get('/api/roles/'+id); const d=r.j?.data||r.j; return {name:d?.name, fe:(d?.fe_permissions||d?.fePermissions||[]).map(x=>x.code||x.name).sort(), cross:d?.cross_toggles||d?.crossToggles}};
const out={};
if(PH==='reset'){ // UI reset to template
  out.before=await role(RID);
  await s.go('/administration/roles-permissions'); await p.waitForTimeout(3000);
  let ed=p.locator(`[data-test-id=action_edit_${RID}]`); if(!await ed.count()){ await s.go('/administration/roles'); await p.waitForTimeout(3000); ed=p.locator(`[data-test-id=action_edit_${RID}]`);} 
  out.editFound=await ed.count(); if(out.editFound){ await ed.first().click(); await p.waitForTimeout(2000);
   const rt=p.locator('[data-test-id=reset_template_edit]'); out.resetBtn=await rt.count();
   if(out.resetBtn){ await rt.click(); await p.waitForTimeout(1200); await p.locator('.q-dialog button:has-text("Reset")').last().click(); await p.waitForTimeout(1200);
     const sv=p.locator('[data-test-id=submit_edit_role]'); out.saveEnabled=await sv.isEnabled();
     if(out.saveEnabled){ await sv.click(); await p.waitForTimeout(1500); const c=p.locator('.q-dialog button:has-text("Confirm")'); out.confirm=await c.count(); if(out.confirm) await c.last().click(); await p.waitForTimeout(2500);} }
   await p.screenshot({path:`../ev/role-reset-${RID.slice(0,8)}.png`}); }
  out.after=await role(RID);
}
if(PH==='read') out.role=await role(RID);
if(PH==='assign'){ const r=await post(s,'/api/staff/d2cb20a6-90a8-4884-ac50-022ff2fb9313/change',{first_name:'Tech',last_name:'ShopView',email:'tech@shopview.com',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',role_id:RID,billable:1,clockable:true});
  out.assign=r; const t=await get('/api/staff?search=tech%40shopview.com'); const a=t.j?.data||t.j; out.now=(Array.isArray(a)?a:a?.collection||[]).filter(x=>x.email==='tech@shopview.com').map(x=>x.role_label);}
console.log(JSON.stringify(out).slice(0,1500)); fs.appendFileSync('../ev/role-log.json',JSON.stringify({PH,RID,at:new Date().toISOString(),out})+'\n');
await s.close(); process.exit(0);
