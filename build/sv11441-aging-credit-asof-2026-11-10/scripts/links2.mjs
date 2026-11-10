import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ap-unpaid-invoices?vendorIds=98c705a1-ba42-42c1-b291-303deb797d3b'); await p.waitForTimeout(8000);
console.log(p.url()); console.log((await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).slice(0,6).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,90)))).join('\n'));
console.log((await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*="toggle"]')].slice(0,5).map(e=>e.getAttribute('data-test-id')))).join(' '));
const t=p.locator('[data-test-id*="toggle_98c705a1"]').first(); console.log('t',await t.count()); if(await t.count()){ await t.click(); await p.waitForTimeout(3000); }
const links=await p.evaluate(()=>[...document.querySelectorAll('tbody a, tbody [role=link], tbody .cursor-pointer')].map(a=>a.tagName+':'+a.innerText.trim()).slice(0,8)); console.log(links);
const b=p.getByText('5956',{exact:true}).first(); if(await b.count()){ await b.click(); await p.waitForTimeout(7000); console.log('opened',p.url()); console.log((await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,200)); await p.screenshot({path:'../ev/link-bill.png'}); }
await s.close(); process.exit(0);
