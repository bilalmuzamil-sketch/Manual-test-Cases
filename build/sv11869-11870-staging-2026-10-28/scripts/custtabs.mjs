// Customer 4 Star Truck Repair: read tab counts; open Work Orders tab and list the newest rows.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1600,height:1000}});
const p=s.page; const seen=[]; p.on('response',r=>{ const u=r.url(); if(/\/api\//.test(u)&&r.request().method()==='GET'&&/work-orders\?/.test(u)) seen.push(u.replace(/^https:\/\/[^/]+/,'').slice(0,300)); });
await s.go('/workorders'); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a')));
await s.go('/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd'); await p.waitForTimeout(5000);
console.log('tabs',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="tab_"]')].map(e=>e.innerText.trim()).join(' | ')));
console.log('rows',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).slice(0,8))));
await p.screenshot({path:'ev/import/customer-wo-tab.png'}); console.log(seen.slice(-2).join('\n'));
await s.close(); process.exit(0);
