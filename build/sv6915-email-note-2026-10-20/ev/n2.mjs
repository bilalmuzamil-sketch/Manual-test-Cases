import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/qa6915/seed.json'));
const s=await open({env:'prod',dir:'/tmp/qa6915',vp:{width:1440,height:900},dpr:2,user:'bilal.muzamil@shopview.com'});
const p=s.page; const reqs=[];
p.on('request',r=>{if(/\/api\//.test(r.url())&&r.method()!=='GET')reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,160))});
await s.go('/workorders/'+S.wo+'/notes'); await p.waitForTimeout(6000);
const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:15000}).catch(()=>null), p.locator('[data-test-id="button_attach_files"]').click()]);
console.log('filechooser',!!fc);
if(fc){await fc.setFiles('/tmp/qa6915/sv6915-attachment.png');}
await p.waitForTimeout(5000);
await p.screenshot({path:'/tmp/qa6915/after-attach.png'});
const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-dialog label, .q-dialog .q-toggle, .q-dialog .q-checkbox')].map(e=>[e.getAttribute('data-test-id'),(e.innerText||'').slice(0,60).replace(/\n/g,' ')]));
console.log('dialog',JSON.stringify(ids).slice(0,1500));
console.log('reqs',JSON.stringify(reqs));
await s.close();
