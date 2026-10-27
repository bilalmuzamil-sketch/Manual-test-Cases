import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
let r=await s.api('/api/organizations/settings'); const org=r.json.data.organizationId; 
r=await s.api(`/api/organizations/${org}/roles`); const roles=r.json?.data?.collection||r.json?.data||[]; 
const adm=roles.find(x=>x.name==='Admin'); console.log('roles',roles.length,'admin',adm?.id);
const get=async()=>{const q=await s.api('/api/roles/'+adm.id); return (q.json?.data?.fe_permissions||q.json?.data?.role?.fe_permissions||[]).map(x=>x.code||x.name).sort();};
const before=await get(); console.log('before',before.length,'woMoveLabor',before.includes('woMoveLabor'));
await s.go('/administration/roles-permissions'); await s.page.waitForTimeout(2000);
let b=await s.box('action_edit_'+adm.id); if(!b){ console.log('no edit btn; ids:',await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="action_edit"]')].map(e=>e.dataset.testId).slice(0,5))); }
await s.page.mouse.click(b.x,b.y); await s.waitFor('reset_template_edit'); b=await s.box('reset_template_edit'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(800);
await s.page.locator('.q-dialog button').filter({hasText:/^\s*Reset\s*$/}).last().click(); await s.page.waitForTimeout(800);
const dis=await s.page.evaluate(()=>document.querySelector('[data-test-id="submit_edit_role"]')?.disabled); console.log('save disabled',dis);
if(!dis){ b=await s.box('submit_edit_role'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1200);
  await s.page.locator('.q-dialog button').filter({hasText:/Confirm/}).last().click(); await s.page.waitForTimeout(2000);}
const after=await get(); console.log('after',after.length,'woMoveLabor',after.includes('woMoveLabor'));
console.log('added',after.filter(x=>!before.includes(x)).join(','),' removed',before.filter(x=>!after.includes(x)).join(','));
fs.writeFileSync('../data/admin-role-reset.json',JSON.stringify({role:adm.id,before,after},null,1));
await s.browser.close(); process.exit(0);
