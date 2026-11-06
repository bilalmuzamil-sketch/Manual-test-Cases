// usage: node vexplore.mjs [vendorId] -> lists vendor API calls made by the Vendors list / a vendor's Unpaid Invoices and Payments tabs, and the test-ids on those tabs
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const vid=process.argv[2];
p.on('response',async r=>{ const u=r.url(); if(/\/api\/.*(vendor|bill|payment|credit)/i.test(u)){ let t=''; try{t=(await r.text()).slice(0,350)}catch(e){} console.log('RES',r.request().method(),r.status(),u.replace(/^https:\/\/[^/]+/,''),t.replace(/\s+/g,' ')); } });
if(!vid){ await s.go('/parts/vendors'); await p.waitForTimeout(5000); }
else { for(const tab of ['unpaid-invoices','payments']){ await s.go(`/parts/vendor/${vid}/${tab}`); await p.waitForTimeout(4000);
  const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(x=>!/mobile|menu_link|nav/.test(x))); console.log('IDS',tab,ids.join(' ').slice(0,1500)); await p.screenshot({path:`../ev/vx-${tab}.png`}); } }
await s.close(); process.exit(0);
