import {ob,J,post} from './lib.mjs';
const s=await ob(); const p=s.page; console.log('marker',J(await s.marker(),300));
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const G=[]; p.on('request',r=>{ if(/\/api\/.*vendor/i.test(r.url())) G.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')); });
await s.go('/parts/vendors'); await p.waitForTimeout(4500); console.log('url',p.url(),'| requests',J(G,800));
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').trim().replace(/\s+/g,' ').slice(0,30)));
console.log(J(t.filter(x=>!/nav_link|clock_in|notif|profile|module|skip|global/.test(x)).slice(0,50),2500));
console.log('first rows',J(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(0,8).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,60))),800));
await p.screenshot({path:'ev/V0-vendors.png'}); await s.close();
