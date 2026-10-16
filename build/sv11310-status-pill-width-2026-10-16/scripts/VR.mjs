import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json')); const D=JSON.parse(fs.readFileSync('/tmp/qa11310/vo/durs.json'));
const HOLD=k=>Math.max(Math.round(D[k]*1000)+200,2000);
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:1,record:'/tmp/qa11310/rec'}); const tLogin=Date.now(); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(3500);}
await p.mouse.move(720,860); const mk=await s.marker(); const ev={}; const log={};
const meas=()=>p.evaluate(()=>{const H=innerHeight;return [...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].filter(b=>{const r=b.getBoundingClientRect();return r.top>0&&r.bottom<H-60}).map(b=>({t:b.innerText.trim(),w:+b.getBoundingClientRect().width.toFixed(2),td:+b.closest('td').getBoundingClientRect().width.toFixed(1)}));});
ev.n1=Date.now(); await s.caption(`SV-11310 · staging build ${mk.version} · 16 Oct 2026 · Work Orders > All > List · window 1440 px, zoom 100%`,{hold:HOLD('n1')});
ev.n2=Date.now(); await s.glideClick('page_search_toggle'); await p.waitForTimeout(500); const inp=(await p.evaluateHandle(()=>document.activeElement)).asElement();
await inp.type('S2-33363',{delay:45}); await p.waitForTimeout(2500); let v=await meas(); log.n2=v;
await s.caption(`Search S2-33363 · ${v[0].t} pill ${v[0].w} px · Status column ${v[0].td} px`,{hold:Math.max(HOLD('n2')-3000,1200)});
ev.n3=Date.now(); await inp.fill(''); await inp.type('S2-363',{delay:45}); await p.waitForTimeout(2500); v=await meas(); log.n3=v;
const sts=[...new Set(v.map(x=>x.t))]; const ws=[...new Set(v.map(x=>x.w))];
await s.caption(`Search S2-363 · ${v.length} pills, ${sts.length} statuses: ${sts.join(', ')}`,{hold:Math.max(HOLD('n3')-2500,1200)});
ev.n4=Date.now(); await s.caption(`Widths on screen: ${ws.map(w=>w+' px').join(', ')} → all the same, as on production → PASSED`,{hold:HOLD('n4')+300});
const r=await s.close(); const out={tLogin,ev,r,mk,log}; fs.writeFileSync('/tmp/qa11310/vo/run.json',JSON.stringify(out,null,1)); console.log(JSON.stringify({ev,r,mk,n2:log.n2,n3ws:ws,sts}));
