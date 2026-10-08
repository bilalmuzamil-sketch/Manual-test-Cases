import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'')+' :: '+(await r.text()).slice(0,300));}catch(e){}});
const ZZ='0e51ee72-1a4d-4dc1-8717-878ede8a1aa5', UN='b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d';
await s.go('/administration/categories?search=ZZAUTO'); await p.waitForTimeout(1500);
// default row controls
await s.go('/administration/categories'); await p.waitForTimeout(1500);
const unRow=await p.evaluate(id=>{const r=document.querySelector(`[data-test-id="category_row_${id}"]`); return r? {html:[...r.querySelectorAll('[data-test-id],button')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim()).join(' '),text:r.innerText}:null;},UN);
console.log('UNROW',j(unRow,500));
const b=await s.box('category_row_'+UN); await p.mouse.move(b.x,b.y); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
console.log('after click default row dialog:',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'NONE'));
await p.screenshot({path:'/tmp/qa9138/default-row-click.png'});
await p.keyboard.press('Escape'); await p.waitForTimeout(600);
// zz row: controls
const zz=await p.evaluate(id=>{const r=document.querySelector(`[data-test-id="category_row_${id}"]`); if(!r) return null; r.scrollIntoView({block:'center'}); return [...r.querySelectorAll('[data-test-id],button')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim()).join(' ');},ZZ);
console.log('ZZROW',zz);
await p.waitForTimeout(600); const zb=await s.box('category_row_'+ZZ); await p.mouse.click(zb.x,zb.y); await p.waitForTimeout(1500);
console.log('zz dialog:',await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'NONE'));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await p.screenshot({path:'/tmp/qa9138/zz-row-click.png'});
console.log(log.join('\n'));
await s.close();
