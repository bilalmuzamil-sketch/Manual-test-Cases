// Work Orders -> All tab -> Status filter: Imported. Lists the imported invoices on screen.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:1000}});
const p=s.page; await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
await s.go('/workorders?status=imported'); await p.waitForTimeout(7000);
const t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '));
console.log('ZZ11870 rows:',(t.match(/ZZ11870-[A-Z]+\d+/g)||[]).join(' ')); console.log(t.slice(0,600));
await p.screenshot({path:'ev/workorders-status-imported.png'}); await s.close(); process.exit(0);
