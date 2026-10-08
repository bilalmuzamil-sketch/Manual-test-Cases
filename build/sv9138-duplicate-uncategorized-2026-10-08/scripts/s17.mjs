import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'')+' :: '+(await r.text()).slice(0,600));}catch(e){}});
await s.go('/administration/open-api'); await p.waitForTimeout(1500);
const b=await s.box('button_create_api_key'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
console.log('DLG',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'')).replace(/\n+/g,' | ').slice(0,1500));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await p.screenshot({path:'/tmp/qa9138/apikey-dialog.png'});
await s.close();
