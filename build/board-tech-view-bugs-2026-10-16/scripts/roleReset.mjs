// Reset a role to its template via the UI (Rule 105). usage: node roleReset.mjs "Technician"
import {open} from './qa.mjs'; import fs from 'fs';
const NAME=process.argv[2]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:1}); const p=s.page;
await s.go('/administration/roles-permissions'); await p.waitForTimeout(4000);
const org='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const roles=await s.api(`/api/organizations/${org}/roles`); const list=roles.json?.data?.collection||roles.json?.data||[];
const role=list.find(r=>r.name===NAME); if(!role){console.log('no role',org,JSON.stringify(roles.json).slice(0,300)); process.exit(1);}
const codes=async()=>{const r=await s.api('/api/roles/'+role.id); return (r.json?.data?.fe_permissions||[]).map(x=>x.code).sort();};
const before=await codes();
await p.click(`[data-test-id=action_edit_${role.id}]`); await p.waitForTimeout(3000);
await p.click('[data-test-id=reset_template_edit]'); await p.waitForTimeout(1200);
await p.locator('.q-dialog button').filter({hasText:/^\s*Reset\s*$/}).last().click(); await p.waitForTimeout(1500);
const dis=await p.$eval('[data-test-id=submit_edit_role]',e=>e.disabled||e.getAttribute('aria-disabled')==='true').catch(()=>null);
let saved=false; if(dis===false){ await p.click('[data-test-id=submit_edit_role]'); await p.waitForTimeout(1500); await p.locator('.q-dialog button').filter({hasText:/Confirm/}).last().click().catch(()=>{}); await p.waitForTimeout(2500); saved=true;}
const after=await codes();
console.log(JSON.stringify({role:NAME,id:role.id,saveDisabled:dis,saved,before,after,removed:before.filter(c=>!after.includes(c)),added:after.filter(c=>!before.includes(c))}));
await s.close();
