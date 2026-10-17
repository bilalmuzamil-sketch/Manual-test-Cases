import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all&search=S2-968'); await p.waitForTimeout(5000); await p.mouse.move(5,890);
const o=await p.evaluate(()=>{const heads=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace('arrow_drop_up','').trim()); const i=heads.indexOf('Lead Technician'); const row=[...document.querySelectorAll('tbody tr')].find(r=>/S2-968/.test(r.innerText)); const c=row.children[i]; const b=c.getBoundingClientRect(); return {text:c.innerText.trim(),x:b.x,y:b.y,w:b.width,h:b.height};});
await p.screenshot({path:'/tmp/qa11310/ex/p16l-list.png'}); console.log(JSON.stringify({o,mk:await s.marker()})); fs.writeFileSync('/tmp/qa11310/ex/p16l.json',JSON.stringify(o)); await s.close();
