import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
fs.mkdirSync('/tmp/qa84',{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa84',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2});
const p=s.page; console.log('marker',JSON.stringify(await s.marker()));
for(const r of ['ar-aging-summary','ap-aging-summary']){ await s.go('/reports/'+r); await p.waitForTimeout(6000);
  const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/export|print|download|dropdown|filter_chip|page_/i.test(t)));
  const btns=await p.evaluate(()=>[...document.querySelectorAll('main button, .q-page button')].map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ')).filter(Boolean).slice(0,15));
  console.log(r,p.url(),'| ids:',[...new Set(ids)].join(','),'| buttons:',btns.join(' / ')); await p.screenshot({path:`../ev/prod-${r}.png`}); }
await s.close(); process.exit(0);
