// QA lead, 2026-09-25: a pre-existing role must be RESET to its default and SAVED before it is
// assigned and before any permission check is run on it - the estate is shared and another session
// may have edited it. Find the lower-permission person's role, reset it, save it, and read back what
// it then holds, so the technician check that follows measures the product and not another session.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const APP='https://app.shopview.com';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/administration/roles-permissions',{settle:12000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(25000);
const g=async p=>{const r=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{}return{s:r.status(),j,t:t.slice(0,200)};};
const R={};
// which role does the lower-permission person carry?
for (const p of ['/api/staff?pagination%5BrowsPerPage%5D=200&pagination%5Bpage%5D=1','/api/staff?limit=200','/api/iam/staff?limit=200']) {
  const r=await g(p); if(r.s===200&&r.j){ const arr=r.j.data?.staff||r.j.data?.collection||r.j.data||[];
    if(Array.isArray(arr)&&arr.length){ const me=arr.find(s=>/serviceadvisorlimitedview/.test(JSON.stringify(s)));
      R.staffEndpoint=p; R.person=me?{id:me.id,email:me.email,role:me.role?.name||me.role,roleId:me.role?.id||me.role_id}:null;
      console.log('staff endpoint',p,'-> person:',JSON.stringify(R.person)); break; } } }
// the roles list
for (const p of ['/api/roles?limit=100','/api/iam/roles?limit=100','/api/roles-permissions?limit=100']) {
  const r=await g(p); if(r.s===200&&r.j){ const arr=r.j.data?.roles||r.j.data?.collection||r.j.data||[];
    if(Array.isArray(arr)&&arr.length){ R.rolesEndpoint=p;
      R.roles=arr.map(x=>({id:x.id,name:x.name,system:x.is_system??x.system??null}));
      console.log('roles:',JSON.stringify(R.roles.map(x=>x.name+(x.system?' [system]':'')))); break; } } }
// the page itself, so the reset control can be named from the screen
await page.goto(`${APP}/administration/roles-permissions`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(11000);
R.pageRoles=await page.evaluate(()=>[...document.querySelectorAll('tr,.q-card,.q-item')]
  .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<120).slice(0,40));
console.log('\nroles as the screen shows them:'); R.pageRoles.forEach(r=>console.log('   ',r));
await page.screenshot({path:`${EV}/p3m-roles-page.png`,fullPage:true}).catch(()=>{});
const roleId = R.person?.roleId || (R.roles||[]).find(r=>/technician/i.test(r.name||''))?.id;
R.roleId=roleId; console.log('\nrole to reset:',roleId);
if (roleId) {
  await page.goto(`${APP}/administration/roles-permissions/${roleId}/edit`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(12000);
  R.editorButtons=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width)
    .map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
  console.log('buttons in the role editor:',JSON.stringify(R.editorButtons));
  R.editorText=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,600));
  console.log('editor says:',R.editorText.slice(0,300));
  await page.screenshot({path:`${EV}/p3m-role-editor.png`,fullPage:true}).catch(()=>{});
}
fs.writeFileSync(`${EV}/p3m-role-reset.json`,JSON.stringify(R,null,1));
await browser.close();
