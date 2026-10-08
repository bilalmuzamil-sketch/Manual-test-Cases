import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const W=JSON.parse(fs.readFileSync('prod/wo-B.json'));
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(3000);
const m=await s.box('button_work_order_nav_bar_menu'); if(m){ await p.mouse.click(m.x,m.y); await p.waitForTimeout(1200); console.log('menu',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\s+/g,' ')).join(' / '))); await p.keyboard.press('Escape'); }
console.log('portal-ish controls',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/portal|send|approval|estimate/i.test(x)).join(' ')));
await s.go('/workorders/'+W.wo+'/finance'); await p.waitForTimeout(3000);
console.log('finance controls',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/portal|send|approval|estimate|print|pdf/i.test(x)).filter((v,i,a)=>a.indexOf(v)===i).join(' ')));
await s.close();
