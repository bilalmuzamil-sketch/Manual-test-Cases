import {op} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const A=JSON.parse(fs.readFileSync('prod/wo-A.json'));
await s.go('/workorders/'+A.wo+'/finance'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().y<120).map(e=>e.getAttribute('data-test-id')+'|'+(e.getAttribute('title')||e.getAttribute('aria-label')||e.innerText.trim().slice(0,20))));
console.log(ids.join('\n'));
const g=ids.map(x=>x.split('|')[0]).find(x=>/setting/i.test(x)); console.log('gear',g);
if(g){ const b=await s.box(g); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
 console.log('DIALOG:',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog,.q-menu')].map(e=>e.innerText.replace(/\n+/g,' | ')).join(' ## ').slice(0,900)));
 console.log('toggles',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id],.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));}
await s.close();
