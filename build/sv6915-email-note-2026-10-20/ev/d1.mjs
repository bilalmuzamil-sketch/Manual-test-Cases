import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',dir:'/tmp/qa6915',vp:{width:1440,height:900},dpr:2,user:'bilal.muzamil@shopview.com'});
const p=s.page;
const m=await p.evaluate(async()=>{const r=await fetch('/index.html?cb='+Date.now(),{cache:'no-store'});const t=await r.text();
 return {v:(t.match(/name="app-version"\s+content="([^"]+)"/)||[])[1],lm:r.headers.get('last-modified')};});
console.log('BUILD',JSON.stringify(m),new Date().toISOString());
const r=await s.api('/api/work-orders?pagination[rowsPerPage]=30&pagination[page]=1&filters[0][field]=status&filters[0][value]=invoiced');
const rows=r.json?.data?.work_orders||[];
console.log('invoiced WOs',r.status,Array.isArray(rows)?rows.length:JSON.stringify(r.json).slice(0,200));
const w=(Array.isArray(rows)?rows:[])[0]; if(!w){await s.close();process.exit()}
console.log('WO',JSON.stringify(Object.fromEntries(Object.entries(w).filter(([k,v])=>typeof v!=='object'))).slice(0,500));
await s.go('/workorders/'+w.id+'/finance'); await p.waitForTimeout(8000);
const b=p.locator('[data-test-id="button_send_email"]'); console.log('send btn',await b.count(), await b.first().isEnabled().catch(()=>null));
await b.first().click(); await p.waitForTimeout(4000);
await p.screenshot({path:'/tmp/qa6915/dlg.png'});
const f=await p.evaluate(()=>{const d=document.querySelector('.q-dialog')||document;return [...d.querySelectorAll('[data-test-id],label,input,textarea')].map(e=>[e.tagName,e.getAttribute('data-test-id'),e.getAttribute('aria-label')||e.placeholder||'',(e.innerText||'').slice(0,60).replace(/\n/g,' / ')]).filter(x=>x[1]||x[2]||x[3]).slice(0,60)});
console.log(JSON.stringify(f));
await s.close();
