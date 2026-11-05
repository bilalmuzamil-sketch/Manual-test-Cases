// switches ON the Admin role's "Receive later" toggle, saves, accepts confirmations; re-reads
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page;
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]); const admin=L.find(r=>/^admin/i.test(r.name));
const before=(await s.api('/api/roles/'+admin.id)).json?.data?.fe_permissions||[];
await s.go('/administration/roles-permissions/'+admin.id+'/edit'); await p.waitForTimeout(4000);
const bodies=[]; p.on('request',r=>{ if(r.method()==='PUT') bodies.push(r.postData()); });
const t=p.locator('[data-test-id="wosetting_receivedlater"]'); await t.scrollIntoViewIfNeeded(); await t.click(); await p.waitForTimeout(800);
console.log('aria now',await t.getAttribute('aria-checked')); await p.screenshot({path:'../ev/branch-admin-role-on.png'});
const save=p.getByRole('button',{name:/^save/i}).first(); await save.click(); await p.waitForTimeout(2000);
for(let i=0;i<3;i++){ const d=p.locator('.q-dialog button').filter({hasText:/edit anyway|confirm|yes|save/i}).last(); if(await d.count()){ console.log('dialog btn',(await d.innerText()).trim()); await d.click(); await p.waitForTimeout(2000);} }
const after=(await s.api('/api/roles/'+admin.id)).json?.data?.fe_permissions||[]; console.log('added',after.filter(x=>!before.includes(x)),'removed',before.filter(x=>!after.includes(x)));
fs.writeFileSync('/tmp/sv11006/role-put.json',bodies.join('\n')); await s.close(); process.exit(0);
