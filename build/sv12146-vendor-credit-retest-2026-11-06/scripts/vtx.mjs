// node vtx.mjs <vendorId> -> logs every /api call (method,url,body excerpt) made by the vendor's Unpaid Invoices + Payments tabs
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const vid=process.argv[2];
p.on('response',async r=>{ const u=r.url(); if(u.includes('sv11839api')&&!/release-notes|recent-entities|feature-flags|my-current-task/.test(u)&&!/notification|fe-permissions|auth\/me|my-workplaces|list-vendor-contacts/.test(u)){ let t=''; try{t=(await r.text()).slice(0,900)}catch(e){} console.log('RES',r.status(),u.replace(/^https:\/\/[^/]+/,'').slice(0,200),'\n   ',t.replace(/\s+/g,' ')); } });
for(const tab of ['unpaid-invoices','payments']){ console.log('== TAB',tab); await s.go(`/parts/vendor/${vid}/${tab}`); await p.waitForTimeout(4000); await p.screenshot({path:`../ev/vt-${tab}.png`}); }
await s.close(); process.exit(0);
