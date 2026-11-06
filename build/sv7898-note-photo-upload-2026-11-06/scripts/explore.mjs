// usage: node explore.mjs [woId] -> opens a WO notes page and prints every data-test-id containing note/attach/upload/file
import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
let wo=process.argv[2]; if(!wo){ for(const u of ['/api/work-orders?limit=5','/api/work-orders/list?limit=5']){ const r=await s.api(u); const w=r.json?.data?.work_orders?.[0]; if(w) console.log(Object.keys(w).filter(k=>/id|number|order/i.test(k)).map(k=>k+'='+w[k]).join(' ')); } }
console.log('url',s.page.url());
if(wo){ await s.go(`/workorders/${wo}/notes`); await s.page.waitForTimeout(3000); console.log('url',s.page.url());
 const t=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/note|attach|upload|file|photo|more|menu/i.test(x)));
 console.log([...new Set(t)].join(' ')); await s.page.screenshot({path:'../ev/explore.png'}); }
await s.close(); process.exit(0);
