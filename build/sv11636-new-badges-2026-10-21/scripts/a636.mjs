import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(6000);
const cur=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=display_option_]')].filter(e=>/selected|active|--on/.test(e.className)).map(e=>e.getAttribute('data-test-id')));
const b=await p.$('[data-test-id=display_option_tech_view]'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(4000); await p.mouse.move(300,600); await p.waitForTimeout(2500);
console.log('tips',await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).length),'build',await p.evaluate(()=>document.querySelector('meta[name=app-version]').content));
await p.screenshot({path:'/tmp/qa21/after-tech-1440.png'});
const b2=await p.$('[data-test-id=display_option_board_view]'); const b2b=await b2.boundingBox(); await p.mouse.click(b2b.x+b2b.width/2,b2b.y+b2b.height/2); await p.waitForTimeout(3000);
await s.close();
