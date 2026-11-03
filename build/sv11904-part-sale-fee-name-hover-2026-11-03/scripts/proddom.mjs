import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa43',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}}); const p=s.page;
await s.go('/parts/part-sale/99997e1d-f641-4deb-b774-273adddfe690/part-requests'); await p.waitForTimeout(8000);
console.log('url',p.url(),'loc',await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.split('\n')[0]));
console.log('ids',JSON.stringify([...new Set(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/,'<id>')).filter(x=>/menu|fee|adjust|part_request/i.test(x))))]));
await p.screenshot({path:'/tmp/sv11904/prod-p85.png'}); await s.close(); process.exit(0);
