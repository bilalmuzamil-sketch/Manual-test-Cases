import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const {id,num}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({dpr:2,vp:{width:1900,height:1000}}); const p=s.page;
const listOf=async()=>{let all=[];for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`)).json.data.partSales;all=all.concat(c);if(c.length<100)break;} return all.find(x=>x.number===num)?.totalPrice;};
await s.go('/parts/returns'); await p.waitForTimeout(3500);
const rows=await p.evaluate(n=>[...document.querySelectorAll('tbody tr')].map(r=>{const a=r.querySelector('[data-test-id^="button_manual_return_actions_"]');return {t:r.innerText.replace(/\s+/g,' ').slice(0,180),tid:a?.getAttribute('data-test-id')};}).filter(x=>x.t.includes(n)||/2208H476/.test(x.t)).slice(0,5),num);
console.log('rows',j(rows,900));
const row=rows.find(r=>r.tid); if(!row){ console.log('no row'); await p.screenshot({path:'/tmp/qa9226/returns.png'}); await s.close(); process.exit(0);}
let b=await s.box(row.tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900);
console.log('menu',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+'['+(e.getAttribute('data-test-id')||'')+']')))); b=await s.box('menu_item_cancel_return'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
const c=await s.confirm('button_remove_return_positive_answer',{shotPrefix:'/tmp/qa9226/cancel'}); console.log('confirm',j(c,800));
await p.waitForTimeout(2000);
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,200)).join('\n'));
console.log('list',await listOf(),'fin',j(await fin(s,id)));
await p.waitForSelector('[data-test-id^="badge_part_request_status_"]',{timeout:30000}); await p.waitForTimeout(1000);
console.log('rows now',j(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_part_request_status_"],[data-test-id^="button_return_core_"]')].map(e=>e.getAttribute('data-test-id').slice(0,30)+':'+e.innerText.trim()))));
await p.screenshot({path:'/tmp/qa9226/core-3-cancelled.png'});
await s.close();
