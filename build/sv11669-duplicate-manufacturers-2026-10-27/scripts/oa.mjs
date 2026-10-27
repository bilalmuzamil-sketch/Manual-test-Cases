import {sess} from './lib.mjs'; const s=await sess(); const P=s.page; const req=[];
P.on('request',q=>{const u=q.url(); if(/\/api\//.test(u)) req.push(q.method()+' '+u.split('/api')[1].slice(0,90));});
for(const r of ['/administration/open-api','/settings/open-api','/administration/integrations/open-api']){await s.go(r); await P.waitForTimeout(2500); const t=await P.evaluate(()=>document.querySelector('.q-page, main')?.innerText.replace(/\n+/g,' | ').slice(0,400)); console.log(r,'=>',P.url(),'::',t); if(!/totaled/.test(t||'')&&t) break;}
console.log(await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav|module|clock|notif|profile|search|skip/.test(t)).join(' | ')));
console.log(req.filter(r=>/open|api-key|token|key/i.test(r)).join('\n'));
await P.screenshot({path:'../ev/oa-page.png'}); await s.browser.close(); process.exit(0);
