// Customer 4 Star Truck Repair → Invoices tab → Open only off → Search <number>; prints matching rows + the list requests. Screenshot per number.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const nums=process.argv[2].split(',');
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1600,height:1000}});
const p=s.page; const seen=[]; p.on('response',r=>{ const u=r.url(); if(/\/api\//.test(u)&&r.request().method()==='GET'&&/invoice|transaction|ledger/i.test(u)) seen.push(u.replace(/^https:\/\/[^/]+/,'').slice(0,200)); });
await s.go('/administration/settings'); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a')));
await s.go('/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="tab_invoices"]').click(); await p.waitForTimeout(4000);
const tg=p.locator('[data-test-id="toggle_filter_open_invoices"]'); console.log('toggle aria',await tg.getAttribute('aria-checked')); await tg.click(); await p.waitForTimeout(4000); console.log('toggle aria after',await tg.getAttribute('aria-checked'));
const srch=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/search/i.test(t))); console.log('search ids',srch.join(' '));
for(const n of nums){
  const sb=p.locator('[data-test-id*="search"]').first(); await sb.click().catch(()=>{}); await p.waitForTimeout(800);
  const inp=p.locator('input[type=search], input[placeholder*="earch"]').first(); await inp.fill(n).catch(e=>console.log('fill',e.message)); await p.waitForTimeout(4000);
  const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).slice(0,5)); console.log('==',n,JSON.stringify(rows));
  await p.screenshot({path:`ev/import/found-${n}.png`});
}
console.log(seen.slice(-6).join('\n'));
await s.close(); process.exit(0);
