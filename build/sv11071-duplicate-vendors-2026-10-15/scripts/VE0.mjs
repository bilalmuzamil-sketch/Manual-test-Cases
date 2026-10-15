import {ob,J,post} from './lib.mjs';
const s=await ob(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/vendors'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(500); await p.keyboard.type('ZZAUTOTEST Other Vendor',{delay:30}); await p.waitForTimeout(3000);
console.log('rows',J(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,80))),500));
await p.locator('tbody tr').filter({hasText:'Other Vendor'}).first().click(); await p.waitForTimeout(3500); console.log('url',p.url());
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').trim().replace(/\s+/g,' ').slice(0,30)));
console.log(J(t.filter(x=>!/nav|clock_in|notif|profile|module|skip|global/.test(x)).slice(0,40),2500)); await p.screenshot({path:'ev/VE0.png'}); await s.close();
