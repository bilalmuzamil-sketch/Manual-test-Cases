import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/qa6915/seed.json'));
const s=await open({env:'prod',dir:'/tmp/qa6915',vp:{width:1440,height:900},dpr:2,user:'bilal.muzamil@shopview.com'});
const p=s.page; const reqs=[];
p.on('request',r=>{if(/\/api\//.test(r.url())&&r.method()!=='GET')reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200))});
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(6000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/tab|note/i.test(t)));
console.log('tabs',JSON.stringify([...new Set(tabs)]));
const t=p.locator('[data-test-id*="notes"]').first(); if(await t.count()){await t.click();await p.waitForTimeout(4000);}
console.log('url',p.url());
await p.screenshot({path:'/tmp/qa6915/notes.png'});
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>[e.getAttribute('data-test-id'),(e.innerText||'').slice(0,40).replace(/\n/g,' ')]).filter(x=>/note|attach|file|upload|customer/i.test(x[0]+x[1])));
console.log(JSON.stringify(ids).slice(0,1500));
await s.close();
