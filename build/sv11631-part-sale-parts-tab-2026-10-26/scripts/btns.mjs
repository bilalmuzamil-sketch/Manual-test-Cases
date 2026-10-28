// Retest 28 Oct: list the action buttons on a part sale's rows (env, partSaleId).
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [ENV,PS]=process.argv.slice(2);
const s=ENV==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2}):await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
const p=s.page; await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(7000);
console.log(await p.evaluate(()=>location.pathname+' | '+document.title));
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>10).map(r=>({st:r.querySelector('.status-cell')?.innerText.trim()||'',d:[...r.querySelectorAll('input')].map(i=>i.value).filter(Boolean).slice(0,2).join('/'),b:[...r.querySelectorAll('button,[data-test-id^=button]')].map(b=>(b.getAttribute('data-test-id')||'').replace(/_[0-9a-f-]{36}.*/,'')+':'+b.innerText.trim()).join(', ')})))));
await p.screenshot({path:`/tmp/qa11631/w/act/btns-${ENV}.png`}); process.exit(0);
