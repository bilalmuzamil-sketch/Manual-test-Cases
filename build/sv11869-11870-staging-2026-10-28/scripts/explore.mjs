// Discover: line-create fields (validation), a customer+vehicle at Heavy Duty, Export Reports page controls, bookkeeping status.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
console.log('location',await s.page.evaluate(()=>localStorage.getItem('location')));
console.log('lines/create {}',JSON.stringify((await post('/api/work-orders/lines/create',{})).json).slice(0,600));
const cs=(await s.api('/api/customers?limit=5&search=ZZAUTOTEST')).json?.data?.collection||[]; console.log('customers',cs.map(c=>c.name+'|'+c.id).join(' ; '));
for(const c of cs.slice(0,3)){ const v=(await s.api('/api/vehicles?company_id='+c.id)).json; console.log('vehicles of',c.name,JSON.stringify(v).slice(0,200)); }
console.log('bookkeeping',JSON.stringify((await s.api('/api/bookkeeping/status')).json||'').slice(0,200), JSON.stringify((await s.api('/api/organizations/settings')).json).match(/"[a-z_]*(quickbooks|bookkeeping|accounting)[a-z_]*":[^,]*/gi));
await s.go('/reports/export'); await s.page.waitForTimeout(4000); console.log('export url',s.page.url());
console.log('tids',[...new Set(await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id'))))].filter(t=>!/nav|module_|global|clock|notif|profile/.test(t)).join(' ; ').slice(0,1200));
await s.close(); process.exit(0);
