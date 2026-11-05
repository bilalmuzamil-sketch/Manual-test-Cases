// opens the Admin role edit screen; finds toggles whose label mentions receive/later; prints state; screenshot
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const me=(await s.api('/api/auth/me')).json; console.log('me',JSON.stringify(me).slice(0,300));
await s.go('/administration/roles-permissions/73f72525-'+''); 
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]); const admin=L.find(r=>/^admin/i.test(r.name));
await s.go('/administration/roles-permissions/'+admin.id+'/edit'); await p.waitForTimeout(4000);
const t=await p.evaluate(()=>[...document.querySelectorAll('.q-toggle,[role=switch],.q-checkbox')].map(x=>{ const row=x.closest('.row,.q-item,tr,div'); return (row?.innerText||'').replace(/\s+/g,' ').slice(0,90)+' | aria='+(x.getAttribute('aria-checked'))+' | id='+(x.getAttribute('data-test-id')||x.closest('[data-test-id]')?.getAttribute('data-test-id')); }).filter(x=>/receiv|later|defer/i.test(x)));
console.log(t); const txt=await p.evaluate(()=>document.body.innerText); console.log('page mentions later:',(txt.match(/.{0,60}[Ll]ater.{0,40}/g)||[]).slice(0,6));
await p.screenshot({path:'../ev/branch-admin-role.png',fullPage:true}); await s.close(); process.exit(0);
