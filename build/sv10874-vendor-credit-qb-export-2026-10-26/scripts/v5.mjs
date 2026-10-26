import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const A=s.page; await s.go('/parts/returns'); await A.waitForTimeout(3000);
const rc=(await s.api('/api/inventory/returns')).json.data; const arr=rc.collection||rc.returns||rc; const v=arr.find(x=>/^f9618e14/.test(x.vendor_id)).vendor_id; console.log('vendor',v);
await s.go(`/parts/vendor/${v}/unpaid-invoices`); await A.waitForTimeout(6000);
const rows=await A.evaluate(()=>{const t=document.querySelector('[data-test-id="table-unpaid-transactions"]'); return [...t.querySelectorAll('tr')].filter(r=>r.innerText.trim()).slice(0,20).map(r=>{const b=r.getBoundingClientRect(); return {t:r.innerText.replace(/\s+/g,' ').slice(0,150),cur:getComputedStyle(r.querySelector('td')||r).cursor,a:[...r.querySelectorAll('a[href],[data-test-id]')].map(a=>a.getAttribute('href')||a.getAttribute('data-test-id')).slice(0,4),y:b.y}})});
console.log(rows.map(r=>JSON.stringify(r)).join('\n')); await A.screenshot({path:'v5-vendor-unpaid.png'}); 
process.exit(0);
