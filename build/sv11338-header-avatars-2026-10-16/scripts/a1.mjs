import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_tech_view]'); await p.waitForTimeout(6000);
console.log(await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/,'<id>')))].filter(t=>!/^(tab_|filter_|button_desktop|module|global|clock|notification|profile|skip)/.test(t)).join(' ')));
const av=await p.evaluate(()=>{const out=[];document.querySelectorAll('[data-test-id*=avatar]').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width===0) return; const cs=getComputedStyle(e); const inner=[...e.querySelectorAll('*')].find(x=>x.children.length===0&&x.innerText?.trim()); const ci=inner?getComputedStyle(inner):cs; out.push([e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/,'<id>'),e.innerText.trim(),Math.round(r.width),cs.backgroundColor,ci.color,ci.fontSize,ci.fontWeight,e.className.slice(0,60),!!e.querySelector('img')]);}); return out.slice(0,25);});
console.log(JSON.stringify(av));
await p.screenshot({path:'/tmp/qa11310/tv.png'}); await s.close();
