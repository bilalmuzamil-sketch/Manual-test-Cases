import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess('admin',{vp:{width:2000,height:1100}}); const bodies=[];
s.page.on('request',q=>{const u=q.url(); if(/technician-tasks\/(change|move)|department\/create/.test(u)) bodies.push(q.method()+' '+u.replace(/https:\/\/[^/]+/,'')+' :: '+q.postData());});
s.page.on('response',async r=>{const u=r.url(); if(/technician-tasks\/(change|move)|department\/create/.test(u)) bodies.push('  -> '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await s.go('/reports/punch-clock-activities'); await s.page.waitForTimeout(4000);
const row=s.page.locator('tr').filter({hasText:'Shop Time'}).first(); console.log('rows with Shop Time',await s.page.locator('tr').filter({hasText:'Shop Time'}).count());
await row.hover(); await s.page.waitForTimeout(600);
const eb=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id="button_edit_timesheet"]')].find(x=>x.offsetParent); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
console.log('edit',eb); if(eb){ await s.page.mouse.click(eb.x,eb.y); await s.page.waitForTimeout(2000);
 await s.page.screenshot({path:'../ev/raw-edit-dept-entry.png'});
 const ids=await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId)); console.log('dialog',ids.join(' | '));
 const sel=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog .q-field')][0]; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await s.page.mouse.click(sel.x,sel.y); await s.page.waitForTimeout(1200);
 const opts=await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())); console.log('dept options',opts.join(' | '));
 const o=await s.page.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/Shop Time/.test(x.innerText))||document.querySelector('.q-menu .q-item'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};}); console.log('pick',o.t); await s.page.mouse.click(o.x,o.y); await s.page.waitForTimeout(800);
 const b=await s.box('button_save_timesheet'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(2500);
 const c=await s.box('button_confirm_overwrite_confirmation'); if(c){ console.log('overlap confirm shown'); await s.page.mouse.click(c.x,c.y); await s.page.waitForTimeout(2500);} }
console.log(bodies.join('\n'));
await s.browser.close(); process.exit(0);
