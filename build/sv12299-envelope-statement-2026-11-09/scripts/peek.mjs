import {sess,load} from './common.mjs';
const s=await sess(); const p=s.page; const S=load();
await s.go('/customers/'+S.cid); await p.waitForTimeout(8000);
console.log(p.url());
console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'-')+':'+b.innerText.replace(/\s+/g,' ').slice(0,25)).slice(0,40).join(' | ')));
await p.screenshot({path:'/tmp/qa12299/cust.png'}); await s.close();
