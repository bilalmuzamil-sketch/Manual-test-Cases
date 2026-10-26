import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const OUT='/tmp/qa11685/w/ui1026/'; const wo='f94beef2-ce77-4ec3-8d23-be8fb787348f';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const p=s.page; await s.go(`/workorders/${wo}/finance`); await p.waitForTimeout(7000);
console.log(JSON.stringify(await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(t=>/setting|gear|invoice|print|email|estimate|preview|toggle/i.test(t)))));
const g=await p.$('[data-test-id*="setting"]'); if(g){ await g.click(); await p.waitForTimeout(2000);
 console.log('dialog',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||'').trim().replace(/\n/g,' ').slice(0,40)+(e.getAttribute('aria-checked')?' checked='+e.getAttribute('aria-checked'):'')))));
 await p.screenshot({path:OUT+'gear.png'}); }
process.exit(0);
