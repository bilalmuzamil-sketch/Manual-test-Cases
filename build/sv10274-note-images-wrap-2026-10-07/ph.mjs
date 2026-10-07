import {ob,j} from './lib.mjs';
const s=await ob({vp:{width:375,height:812},dpr:2}); const P=s.page;
await s.go('/workorders/9027964a-0ff2-49ff-9838-172c4bb00c61/notes'); await P.waitForTimeout(1500);
const sel='[data-test-id="note_card_3aebdd5b-06fa-4b4e-8afd-935a27248ce1"]';
await P.evaluate(s=>document.querySelector(s).scrollIntoView({block:'start'}),sel);
const t0=Date.now(); for(let i=0;i<60;i++){const ok=await P.evaluate(s=>{const im=[...document.querySelectorAll(s+' img')]; return im.length>0&&im.slice(0,4).every(x=>x.complete&&x.naturalWidth>0)&&!document.querySelector(s+' .q-spinner, '+s+' svg.q-spinner');},sel); if(ok) break; await P.waitForTimeout(500);}
await P.evaluate(s=>document.querySelector(s).scrollIntoView({block:'start'}),sel); await P.waitForTimeout(800);
const m=await P.evaluate(s=>{const c=document.querySelector(s);const b=c.querySelector('[data-test-id="button_note_actions"]').getBoundingClientRect();return {btn:[b.left,b.top,b.right,b.bottom].map(Math.round),docSW:document.documentElement.scrollWidth};},sel);
console.log('waited',Date.now()-t0,j(m));
await P.screenshot({path:'/tmp/qa9667b/shots/after-wo12-375c.png'});
await s.close();
