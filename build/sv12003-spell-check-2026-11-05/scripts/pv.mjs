import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders/56f31a00-7806-414b-806c-82a870d2cb15/lines'); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/vehicle|asset|customer_card/i.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,30))));
const a=await p.evaluate(()=>[...document.querySelectorAll('a')].filter(x=>/vehicle/.test(x.getAttribute('href')||'')).map(x=>x.getAttribute('href')+' '+x.innerText.trim()).slice(0,5)); console.log(a); await s.close(); process.exit(0);
