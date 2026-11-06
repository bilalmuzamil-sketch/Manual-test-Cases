import {sess} from './common.mjs'; const s=await sess(); const p=s.page; await s.go(process.env.R||'/reports'); await p.waitForTimeout(7000);
console.log(p.url()); console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(a=>a.getAttribute('data-test-id')+'='+(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)).filter(t=>/export|payment|transaction|EXPORT/i.test(t)).filter(t=>t.length<80).slice(0,80))));
await p.screenshot({path:'../ev/'+(process.env.ENV||'branch')+'-reports-menu.png'}); await s.close(); process.exit(0);
