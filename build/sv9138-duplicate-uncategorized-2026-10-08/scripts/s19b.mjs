import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'').slice(0,120)+' :: '+(await r.text()).slice(0,150));}catch(e){}});
const search=async q=>{ await s.go('/administration/categories'); await p.waitForTimeout(1200); const t=await s.box('page_search_toggle'); await p.mouse.click(t.x,t.y); await p.waitForTimeout(600); await p.keyboard.type(q); await p.waitForTimeout(3500); };
const rowFor=async name=>p.evaluate(n=>{const r=[...document.querySelectorAll('[data-test-id^="category_row_"]')].find(e=>e.innerText.trim()===n); if(!r) return null; const b=r.getBoundingClientRect(); return {id:r.getAttribute('data-test-id'),x:b.x+b.width/2,y:b.y+b.height/2};},name);
let b;
// 3 delete ordinary (empty)
let r; await search('ZZAUTOTEST-9138-UI'); r=await rowFor('ZZAUTOTEST-9138-UI-renamed'); console.log('row2',j(r)); await p.mouse.click(r.x,r.y); await p.waitForTimeout(1200);
let d=await s.box('category_delete_button'); await p.mouse.click(d.x,d.y); await p.waitForTimeout(1200); await p.screenshot({path:'/tmp/qa9138/del-1.png'});
for(let i=0;i<3;i++){ const st=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim())); console.log('dialog buttons',st.join(' | '));
 const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(b=>/confirmation_answer|button_confirm_dialog/.test(b.getAttribute('data-test-id')||'')); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};});
 if(!t) break; console.log('click',t.t); await p.mouse.click(t.x,t.y); await p.waitForTimeout(1500); await p.screenshot({path:`/tmp/qa9138/del-${i+2}.png`}); }
await p.waitForTimeout(2000); console.log('DELETE', log.splice(0).join(' || '));
const a=await s.api('/api/parts-catalogue/categories-list?search=ZZAUTOTEST&pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1');
console.log('zz now',JSON.stringify(a.json.data.collection.map(x=>x.name)));
await s.close();
