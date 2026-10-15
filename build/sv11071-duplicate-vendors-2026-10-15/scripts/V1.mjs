import {ob,J,post} from './lib.mjs';
const s=await ob(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/vendors'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_new_vendor"]').click(); await p.waitForTimeout(2000);
const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?{txt:d.innerText.replace(/\s+/g,' ').slice(0,700),tids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.tagName+'|'+(e.getAttribute('aria-label')||'')+'|'+(e.value||'').slice(0,20))}:null;});
console.log(J(d,4000)); await p.screenshot({path:'ev/V1-dialog.png'}); await s.close();
