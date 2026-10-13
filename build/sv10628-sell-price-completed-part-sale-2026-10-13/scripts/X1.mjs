import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const p=s.page;
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a')));
// permission ids
const r=(await s.api('/api/roles/73f72525'.length?'/api/roles/'+JSON.parse(fs.readFileSync('roles.json')).find(x=>x.name==='Admin').id:'')).json.data; const ids=Object.fromEntries(r.fe_permissions.map(x=>[x.name,x.id])); fs.writeFileSync('perm-ids.json',JSON.stringify(ids,null,1)); console.log('perm names',Object.keys(ids).join(','));
// part dialog path on completed PS (read-only)
await s.go('/parts/part-sale/6c6bb614-e7b0-4f48-aa76-053f7b29d33b/part-requests'); await p.waitForTimeout(3500);
const m=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="button_part_request_menu_"]')].map(e=>e.getAttribute('data-test-id'))); console.log('menus',m.length);
let b=await s.box(m[0]); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
console.log('menu items',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.trim().replace(/\s+/g,' ')).join(' | ')));
const edit=p.locator('.q-menu .q-item').filter({hasText:/Edit/}).first(); if(await edit.count()){ await edit.click(); await p.waitForTimeout(2500);
 console.log('dialog',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,500)).join(' ## ')));
 console.log('dialog ids',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' '))); }
// paid part sale: is the sell price editable?
const paid=(await s.api('/api/part-sales?limit=100&rowsPerPage=100')).json.data.partSales.filter(x=>x.status==='paid'&&x.partRequestsCount>0)[0]; console.log('paid',paid.number,paid.id);
fs.writeFileSync('paid.json',JSON.stringify(paid));
await s.close();
