import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'')+' :: '+(await r.text()).slice(0,300));}catch(e){}});
const OV='b62e76cc-3e2d-4383-9752-b50497c33d4d';
await s.go('/administration/categories'); await p.waitForTimeout(1500);
const b=await s.box('category_row_'+OV); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
console.log('OV dialog:',JSON.stringify(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'NONE')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await p.screenshot({path:'/tmp/qa9138/ov-click.png'});
// right click / menu?
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
await p.mouse.click(b.x,b.y,{button:'right'}); await p.waitForTimeout(800);
console.log('ctx menu:',await p.evaluate(()=>document.querySelector('.q-menu')?.innerText||'NONE'));
await s.close();
