import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const reqs=[]; p.on('request',r=>{ if(r.method()!=='GET'||/credit|transaction|invoice/.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,160)); });
await s.go('/customers/4255e024-938c-4514-83d9-95f1a0a7f324/deposits'); await p.waitForTimeout(6000); console.log(p.url());
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(t=>t.innerText.trim()+'|'+(t.getAttribute('data-test-id')||'')));
console.log(tabs.join(' ; '));
const t=p.locator('.q-tab,[role=tab]',{hasText:/^Deposits/}).first(); if(await t.count()){ await t.click(); await p.waitForTimeout(5000); }
console.log(p.url()); console.log((await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().slice(0,30)))).join(' ; '));
console.log(reqs.slice(-12).join('\n')); await s.close(); process.exit(0);
