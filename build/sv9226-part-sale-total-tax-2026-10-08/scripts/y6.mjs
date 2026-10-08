import {ob,j} from './lib.mjs'; import fs from 'fs'; import {fin} from './fin.mjs';
const {id,num}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({dpr:2,vp:{width:1900,height:1000}}); const p=s.page;
const listOf=async()=>{let all=[];for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/part-sales?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=${pg}`)).json.data.partSales;all=all.concat(c);if(c.length<100)break;} return all.find(x=>x.number===num)?.totalPrice;};
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForSelector('[data-test-id^="button_return_core_"],[data-test-id^="badge_part_request_status_"]',{timeout:30000}); await p.waitForTimeout(1500);
const st=()=>p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(tr=>tr.innerText.trim()).map(tr=>({t:tr.innerText.replace(/\s+/g,' ').slice(25,70),ctl:[...tr.querySelectorAll('[data-test-id^="badge_"],[data-test-id^="button_return"],[data-test-id^="button_cancel"],[data-test-id^="cell_part_request_primary"]')].map(e=>e.getAttribute('data-test-id').replace(/_[0-9a-f-]{36}$/,'')+':'+(e.innerText||'').trim())})));
console.log('state',j(await st(),900));
const t=await p.evaluate(()=>{const e=document.querySelector('[data-test-id^="button_return_core_"]');if(!e) return null; const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,txt:e.innerText.trim(),dis:e.disabled};}); console.log('button',j(t));
if(t){ await p.mouse.click(t.x,t.y); for(let i=0;i<3;i++){ await p.waitForTimeout(1500); console.log('after click',i, j(await p.evaluate(()=>({btn:document.querySelector('[data-test-id^="button_return_core_"]')?.innerText,dlg:document.querySelector('.q-dialog')?.innerText?.replace(/\n+/g,' | ').slice(0,300),menu:[...document.querySelectorAll('.q-menu')].map(m=>m.innerText).join('|'),notif:[...document.querySelectorAll('.q-notification')].map(n=>n.innerText).join('|')})),600)); } await p.screenshot({path:'/tmp/qa9226/core-2-afterclick.png'}); }
console.log('writes',s.writes.filter(w=>!/envelope|quick-login|touch/.test(w)).map(w=>w.slice(0,200)).join('\n'));
console.log('list',await listOf(),'fin',j(await fin(s,id)));
await s.close();
