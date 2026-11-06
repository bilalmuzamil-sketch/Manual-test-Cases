import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
const WO=process.env.WO; await s.go('/workorders/'+WO+'/finance'); await p.waitForTimeout(4000);
const href=await p.evaluate(()=>[...document.querySelectorAll('a[href*="/customers/"]')].map(a=>a.getAttribute('href'))[0]); console.log('cust',href);
const cid=href.match(/customers\/([0-9a-f-]{36})/)[1]; await s.go('/customers/'+cid+'/invoices'); await p.waitForTimeout(5000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(a=>a.getAttribute('data-test-id')+'='+(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,50)).filter(x=>!/^(link_|nav|menu|skip|module|global|clock|button_notif|notification)/.test(x)).slice(0,70))));
await p.screenshot({path:'../ev/prod-cust-invoices.png'}); await s.close(); process.exit(0);
