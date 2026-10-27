import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const RID='73f72525-3d67-436b-9c1d-12677cdf9883';
await s.go('/administration/roles-permissions'); await s.waitFor('action_edit_'+RID);
let b=await s.box('action_edit_'+RID); await s.page.mouse.click(b.x,b.y); await s.waitFor('wosetting_movelabor');
const st=()=>s.page.evaluate(()=>{const e=document.querySelector('[data-test-id="wosetting_movelabor"]'); return {aria:e.getAttribute('aria-checked'),cls:e.className.slice(0,120),inner:e.innerText.slice(0,40)};});
console.log('before',JSON.stringify(await st()));
await s.page.locator('[data-test-id="wosetting_movelabor"]').scrollIntoViewIfNeeded(); b=await s.box('wosetting_movelabor'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(600);
console.log('after click',JSON.stringify(await st()));
await s.page.screenshot({path:'../ev/raw-0-admin-move-labor-toggle.png'});
b=await s.box('submit_edit_role'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1200);
console.log('confirm text:',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.slice(0,300)).join(' || ')));
for(const re of ['Edit Anyway','Confirm']){ const bb=await s.page.evaluate(x=>{const e=[...document.querySelectorAll('.q-dialog button')].filter(b=>b.offsetParent&&b.innerText.trim().toLowerCase()===x.toLowerCase()).pop(); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},re); console.log(re,bb); if(bb){await s.page.mouse.click(bb.x,bb.y); await s.page.waitForTimeout(1800);} console.log("dlg:",await s.page.evaluate(()=>[...document.querySelectorAll(".q-dialog")].map(d=>d.innerText.slice(0,160).replace(/\n/g,' ')).join(" || "))); }
const q=await s.api('/api/roles/'+RID); console.log('woMoveLabor now',(q.json.data.fe_permissions||[]).some(x=>x.code==='woMoveLabor'));
console.log(s.writes.join('\n'));
await s.browser.close(); process.exit(0);
