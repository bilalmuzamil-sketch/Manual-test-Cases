import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'')+' :: '+(await r.text()).slice(0,300));}catch(e){}});
const UN='b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d', OV='b62e76cc-3e2d-4383-9752-b50497c33d4d';
await s.go('/administration/categories'); await p.waitForTimeout(1500);
for(const id of [UN,OV]){ const b=await s.box('category_row_'+id); await p.mouse.move(b.x,b.y); await p.waitForTimeout(800);
 const ctr=await p.evaluate(id=>{const r=document.querySelector(`[data-test-id="category_row_${id}"]`); return [...r.querySelectorAll('*')].filter(e=>e.getAttribute('data-test-id')||e.tagName==='BUTTON'||e.classList.contains('q-icon')).map(e=>(e.getAttribute('data-test-id')||e.tagName)+':'+(e.innerText||'').trim()).join(' | ');},id);
 console.log(id.slice(0,8),'controls:',ctr);
 await p.screenshot({path:`/tmp/qa9138/hover-${id.slice(0,8)}.png`}); }
await s.close();
