import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const p=s.page; await s.go('/reports'); await p.waitForTimeout(4000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="report_nav_"]')].map(e=>[e.getAttribute('data-test-id'),e.innerText.trim().replace(/\s+/g,' '),e.getAttribute('href')]))));
await s.close(); process.exit(0);
