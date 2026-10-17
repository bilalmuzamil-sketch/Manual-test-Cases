import {open} from './qa.mjs'; import {C,toView} from './rec.mjs'; import fs from 'fs';
const env=process.argv[2];
const s=await open(env==='prod'?{env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900},dpr:1}:{env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:1});
const p=s.page; await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); if(env!=='prod'){ await toView(p,'list'); await p.waitForTimeout(2000);} await p.mouse.move(5,890); await p.waitForTimeout(500);
const r=await p.evaluate(()=>[...document.querySelectorAll('svg[data-icon], i.q-icon, svg')].filter(e=>{const b=e.getBoundingClientRect(); return b.y>60&&b.y<130&&b.width>4&&!e.parentElement.closest('svg');}).map(e=>{const b=e.getBoundingClientRect(); const own=e.closest('[data-test-id]')?.getAttribute('data-test-id'); const k=e.tagName==='I'?'MAT:'+e.innerText.trim():(e.getAttribute('data-icon')||'svg:'+e.innerHTML.length); return own+'='+k+'@'+Math.round(b.width);}));
fs.writeFileSync(`/tmp/qa11310/tb04-${env}.json`,JSON.stringify(r,null,1)); console.log(env,r.length); await s.close();
