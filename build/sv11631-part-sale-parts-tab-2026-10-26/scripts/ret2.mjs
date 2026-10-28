// Retest 28 Oct: what does the Return button do now? (P2-162)
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [ENV='branch',PS='90a95f29-f405-4763-834d-6e3a237f8c33']=process.argv.slice(2);
const s=ENV==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true}):await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
const p=s.page; await s.go(process.argv[4]==="wo"?`/workorders/${PS}/part-requests`:`/parts/part-sale/${PS}/part-requests`); console.log(ENV,JSON.stringify(await s.marker())); await p.waitForTimeout(6500);
const info=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_return_part_request]')].map(e=>{const r=e.getBoundingClientRect(); const tr=e.closest('tr'); const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2); return {id:e.getAttribute('data-test-id').slice(27,35),row:[...tr.querySelectorAll('input')].map(i=>i.value).slice(0,3),status:tr.querySelector('.status-cell')?.innerText.trim(),box:[r.x,r.y,r.width,r.height].map(Math.round),disabled:e.disabled||e.getAttribute('aria-disabled'),hit:top===e||e.contains(top),title:e.getAttribute('title')||e.innerText.trim()}}));
console.log(JSON.stringify(info));
const w0=s.writes.length; const L=p.locator('[data-test-id^=button_return_part_request]').first(); await L.hover(); await p.waitForTimeout(800);
const tip=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText)); await L.click(); await p.waitForTimeout(2500);
const after=await p.evaluate(()=>({dialogs:[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.slice(0,200)),menus:[...document.querySelectorAll('.q-menu')].map(d=>d.innerText.slice(0,200)),notif:[...document.querySelectorAll('.q-notification')].map(n=>n.innerText),url:location.pathname}));
console.log('tooltip',JSON.stringify(tip),'after',JSON.stringify(after),'writes',JSON.stringify(s.writes.slice(w0)));
await p.screenshot({path:`/tmp/qa11631/w/act/return-click-${ENV}.png`}); process.exit(0);
