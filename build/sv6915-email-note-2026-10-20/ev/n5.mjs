import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/qa6915/seed.json'));
const s=await open({env:'prod',dir:'/tmp/qa6915',vp:{width:1440,height:900},dpr:2,user:'bilal.muzamil@shopview.com'});
const p=s.page; const reqs=[];
p.on('request',r=>{if(/\/api\/(?!6364962)/.test(r.url())&&r.method()!=='GET')reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,120))});
await s.go('/workorders/'+(process.env.WO||S.wo)+'/notes'); await p.waitForTimeout(6000);
const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:15000}), p.locator('[data-test-id="button_attach_files"]').click()]);
await fc.setFiles('/tmp/qa6915/sv6915-attachment.png'); await p.waitForTimeout(6000);
const cbs=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="checkbox_attachment_for_customer_"]')].map(e=>[e.getAttribute('data-test-id'),e.getAttribute('aria-checked')]));
console.log('cbs',JSON.stringify(cbs));
for(const [t,v] of cbs) if(v!=='true'){await p.locator(`[data-test-id="${t}"]`).click();await p.waitForTimeout(2500);}
const cbs2=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="checkbox_attachment_for_customer_"]')].map(e=>[e.getAttribute('data-test-id'),e.getAttribute('aria-checked')]));
console.log('cbs after',JSON.stringify(cbs2));
await p.screenshot({path:'/tmp/qa6915/notes-wo2.png'});
console.log(JSON.stringify(reqs.filter(r=>!/recent/.test(r))));
await s.close();
