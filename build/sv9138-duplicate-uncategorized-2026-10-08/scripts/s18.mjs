import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()!=='GET'&&!/envelope/.test(u.pathname)) log.push(r.request().method()+' '+r.status()+' '+u.pathname+' REQ '+(r.request().postData()||'')+' :: '+(await r.text()).slice(0,600));}catch(e){}});
await s.go('/administration/open-api'); await p.waitForTimeout(1500);
const b=await s.box('button_create_api_key'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
console.log('DLG',(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'')).replace(/\n+/g,' | ').slice(0,1500));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await p.fill('[data-test-id="input_credential_name"]','ZZAUTOTEST SV-9138 key');
const ck=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="checkbox_all_scopes"]'); return e.getAttribute('aria-checked');}); console.log('allscopes',ck);
if(ck!=='true'){const c=await s.box('checkbox_all_scopes'); await p.mouse.click(c.x,c.y); await p.waitForTimeout(500);}
const cf=await s.box('button_confirm_dialog'); await p.mouse.click(cf.x,cf.y); await p.waitForTimeout(3000);
const txt=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||'');
const key=(txt.match(/sv_[A-Za-z0-9_\-]+|[A-Za-z0-9_\-]{32,}/)||[])[0]; if(key) fs.writeFileSync('/tmp/qa9138/apikey.txt',key);
console.log('after save dialog has key?',!!key, txt.replace(/[A-Za-z0-9_\-]{24,}/g,'<KEY>').replace(/\n+/g,' | ').slice(0,600));
console.log(log.join('\n').replace(/[A-Za-z0-9_\-]{40,}/g,'<KEY>').slice(0,1200));
await s.close();
