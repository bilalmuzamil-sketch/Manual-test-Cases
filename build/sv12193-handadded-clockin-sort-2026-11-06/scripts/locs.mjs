import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
for(const r of ['/administration/locations','/administration/settings/locations','/settings/locations']){ await s.go(r); await p.waitForTimeout(6000); if(!/workorders|no-location/.test(p.url())) { console.log('url',p.url()); break; } }
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr, .q-item, [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.replace(/\s+/g,' ').slice(0,80)).filter(t=>/QA Testing|edit|timezone|Abidjan/i.test(t)).slice(0,25))));
await p.screenshot({path:'../ev/prod-locations.png'}); await s.close(); process.exit(0);
