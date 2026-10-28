// Top bar search (Ctrl K) → type a number → print the results shown + the request used. Screenshot.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const n=process.argv[2]; const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1600,height:1000}});
const p=s.page; const seen=[]; p.on('response',async r=>{ const u=r.url(); if(/\/api\/.*search/i.test(u)) seen.push(r.status()+' '+u.replace(/^https:\/\/[^/]+/,'').slice(0,160)+' => '+(await r.text().catch(()=>'')).slice(0,400)); });
await s.go('/workorders'); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a'))); await s.go('/workorders'); await p.waitForTimeout(3000);
await p.locator('[data-test-id="global_search_trigger"]').click(); await p.waitForTimeout(1500); await p.keyboard.type(n,{delay:40}); await p.waitForTimeout(5000);
console.log('shown',await p.evaluate(()=>(document.querySelector('.q-dialog')||document.body).innerText.replace(/\s+/g,' ').slice(0,500)));
await p.screenshot({path:`ev/import/gsearch-${n}.png`}); console.log(seen.join('\n'));
await s.close(); process.exit(0);
