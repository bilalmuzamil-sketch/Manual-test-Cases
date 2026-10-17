import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
await p.mouse.move(700,600); await p.mouse.wheel(0,700); await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const th=document.querySelector('[data-test-id=table_tech_view] thead').getBoundingClientRect(); const y=th.bottom+15; const els=document.elementsFromPoint(300,y).slice(0,8).map(e=>e.tagName+':'+(e.getAttribute('data-test-id')||'')+':'+e.className.toString().slice(0,60)+':'+getComputedStyle(e).position); return 'thead bottom '+th.bottom+'\n'+els.join('\n');}));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*=sticky],[data-test-id*=held],[class*=sticky],[class*=held]')].slice(0,10).map(e=>e.tagName+':'+e.getAttribute('data-test-id')+':'+e.className.toString().slice(0,80)+':'+Math.round(e.getBoundingClientRect().y)).join('\n')));
await p.screenshot({path:'/tmp/qa11310/sh06y.png'}); await s.close();
