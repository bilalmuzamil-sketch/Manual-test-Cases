// Retest 28 Oct: P2-109 at 1440, scroll the table's bottom edge into view and measure (R12 evidence).
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(6500);
const r=await p.evaluate(()=>{const m=[...document.querySelectorAll('table.q-table')].sort((a,b)=>b.querySelectorAll('tr').length-a.querySelectorAll('tr').length)[0].closest('.q-table__middle'); m.scrollIntoView({block:'end'}); const b=m.getBoundingClientRect(); return {box:[b.x,b.y,b.width,b.height],sw:m.scrollWidth,cw:m.clientWidth,sbH:m.offsetHeight-m.clientHeight};});
await p.waitForTimeout(800); const r2=await p.evaluate(()=>{const b=[...document.querySelectorAll('table.q-table')].sort((a,b)=>b.querySelectorAll('tr').length-a.querySelectorAll('tr').length)[0].closest('.q-table__middle').getBoundingClientRect(); return [b.x,b.y,b.width,b.height]});
await p.screenshot({path:'/tmp/qa11631/w/cap/A-1440-p2109-bottom.png'}); console.log(JSON.stringify({...r,after:r2})); process.exit(0);
