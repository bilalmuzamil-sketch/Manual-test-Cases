import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:1440,height:900}});
console.log(JSON.stringify(await s.marker()));
await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await s.page.waitForTimeout(6500);
console.log('cells',JSON.stringify(await s.page.evaluate(()=>[...document.querySelectorAll('td.fees-cell')].map(t=>t.innerText.replace(/\n/g,' ')).filter(Boolean))));
await s.close(); process.exit(0);
