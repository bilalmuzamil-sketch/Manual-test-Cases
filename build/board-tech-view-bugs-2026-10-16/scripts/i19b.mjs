import {open} from './qa.mjs'; import {C,toView} from './rec.mjs';
const env=process.argv[2];
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:1600,height:1000},dpr:1})); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(env==='staging') await toView(p,'list');
const list=await p.evaluate(()=>{const out={}; for(const i of document.querySelectorAll('i.q-icon, i.material-icons, svg[data-icon]')){ const r=i.getBoundingClientRect(); if(!r.width||r.y<60) continue; const tid=i.closest('[data-test-id]')?.getAttribute('data-test-id')?.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/,'<id>'); const k=tid+' :: '+(i.getAttribute('data-icon')||'MATERIAL '+i.innerText.trim())+' '+Math.round(r.width)+'px'; out[k]=(out[k]||0)+1;} return out;});
console.log('=== LIST',env); for(const [k,c] of Object.entries(list).sort()) console.log(c,k);
if(env==='staging'){ for(const v of ['tech_view','board_view']){ await toView(p,v); await p.waitForTimeout(1500);
  const pins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_pin_],[data-test-id^=button_board_pin_]')].map(b=>(b.getAttribute('aria-label')||b.title||'')+' -> '+(b.querySelector('svg')?.getAttribute('data-icon'))+' '+getComputedStyle(b.querySelector('svg')).color));
  const agg={}; pins.forEach(x=>agg[x.replace(/^.*?(Pin|Unpin)/,'$1')]=(agg[x.replace(/^.*?(Pin|Unpin)/,'$1')]||0)+1); console.log('PINS',v,JSON.stringify(agg)); } }
await s.close();
