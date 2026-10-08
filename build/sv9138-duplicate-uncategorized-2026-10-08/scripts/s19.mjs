import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'').slice(0,120)+' :: '+(await r.text()).slice(0,150));}catch(e){}});
const search=async q=>{ await s.go('/administration/categories'); await p.waitForTimeout(1200); const t=await s.box('page_search_toggle'); await p.mouse.click(t.x,t.y); await p.waitForTimeout(600); await p.keyboard.type(q); await p.waitForTimeout(3500); };
const rowFor=async name=>p.evaluate(n=>{const r=[...document.querySelectorAll('[data-test-id^="category_row_"]')].find(e=>e.innerText.trim()===n); if(!r) return null; const b=r.getBoundingClientRect(); return {id:r.getAttribute('data-test-id'),x:b.x+b.width/2,y:b.y+b.height/2};},name);
let b;
// 2 rename ordinary
await search('ZZAUTOTEST-9138-UI'); let r=await rowFor('ZZAUTOTEST-9138-UI'); console.log('row',j(r)); await p.mouse.click(r.x,r.y); await p.waitForTimeout(1200);
await p.fill('[data-test-id="category_name_input"]',''); await p.click('[data-test-id="category_name_input"]'); await p.keyboard.type('ZZAUTOTEST-9138-UI-renamed',{delay:30}); await p.waitForTimeout(3000);
b=await s.box('category_save_button'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
console.log('RENAME', log.splice(0).join(' || '));
// 3 delete ordinary (empty)
await search('ZZAUTOTEST-9138-UI'); r=await rowFor('ZZAUTOTEST-9138-UI-renamed'); console.log('row2',j(r)); await p.mouse.click(r.x,r.y); await p.waitForTimeout(1200);
const c=await s.confirm('category_delete_button',{shotPrefix:'/tmp/qa9138/del'}); console.log('confirm',j(c,600));
await p.waitForTimeout(2000); console.log('DELETE', log.splice(0).join(' || '));
const a=await s.api('/api/parts-catalogue/categories-list?search=ZZAUTOTEST&pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1');
console.log('zz now',JSON.stringify(a.json.data.collection.map(x=>x.name)));
await s.close();
