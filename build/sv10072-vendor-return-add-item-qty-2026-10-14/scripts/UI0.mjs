import {os,J,post} from './lib.mjs';
const s=await os(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/inventory'); await p.waitForTimeout(4000);
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').trim().replace(/\s+/g,' ').slice(0,25)));
console.log(J(t.filter(x=>!/nav|clock|notif|profile|module|skip/.test(x)).slice(0,60),2500)); await p.screenshot({path:'ev/UI0.png'}); await s.close();
