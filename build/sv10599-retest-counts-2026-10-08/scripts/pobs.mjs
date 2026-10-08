// node obs.mjs <label> <woNumber> <shotPrefix> [tech]
import {op,j} from '../lib.mjs'; import fs from 'fs';
const [num,pre]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync('prod/wo.json')); const label='prod', role=null;
const s=await op({dpr:2,vp:{width:1600,height:900}}); const p=s.page; await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'})}); const R={label,num,role:role||'admin'};
R.marker=(await s.marker()).version; R.me=(await s.api('/api/auth/me/fe-permissions')).json?.data?.view_mode; R.who=(await s.api('/api/iam/view-profile/')).json?.data?.user?.email;
R.api=(await s.api('/api/work-orders/lines/'+wo)).json?.data?.collection?.flatMap(l=>(l.part_requests||[]).map(r=>[r.part_number,r.status,r.quantity,r.on_hand_quantity]));
const w=(await s.api('/api/work-orders?limit=100&search='+num)).json?.data?.work_orders||[]; R.listApi=w.map(x=>({inStock:x.statusInStock,auth:x.statusAuthToOrderCount}));
// Parts tab expanded: per-row badges
await s.go(`/workorders/${wo}/part-requests`); await p.waitForTimeout(2200);
R.expanded=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>r.querySelector('input')).map(r=>{const ch=[...r.querySelectorAll('.q-badge,.q-chip')].map(c=>c.innerText.trim()).filter(Boolean);return {txt:r.innerText.replace(/\s+/g,' ').slice(0,70),ch};}));
await p.screenshot({path:`prod/${pre}-parts-expanded.png`});
// collapse every group
for(let i=0;i<6;i++){ const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,i,.q-icon')].find(x=>/^(expand_less|keyboard_arrow_up|keyboard_arrow_down|expand_more)$/.test(x.innerText.trim())&&x.getBoundingClientRect().y>150&&!x.dataset.qaDone);if(!e)return null;e.dataset.qaDone='1';const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};}); if(!t) break; if(/expand_less|keyboard_arrow_up/.test(t.t)){ await p.mouse.click(t.x,t.y); await p.waitForTimeout(1000);} }
R.collapsed=await p.evaluate(()=>[...document.querySelectorAll('.q-badge,.q-chip')].filter(e=>e.getBoundingClientRect().width>0&&/^\d+\s/.test(e.innerText.trim())).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
R.groups=await p.evaluate(()=>[...document.querySelectorAll('tr,div')].filter(x=>/^\s*\d+ - /.test(x.innerText)&&x.innerText.length<250&&x.getBoundingClientRect().height<80).map(x=>{const r=x.getBoundingClientRect();return {t:x.innerText.replace(/\s+/g,' '),g:[r.x,r.y,r.width,r.height].map(Math.round)};}).slice(0,4));
await p.screenshot({path:`prod/${pre}-parts-collapsed.png`});
// list bubble + tooltip
await s.go('/workorders?tab=work_orders'); await p.waitForTimeout(1800);
const sb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,div,span')].find(x=>x.innerText&&x.innerText.trim()==='Search'&&x.getBoundingClientRect().width>0);const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(800); await p.keyboard.type(num,{delay:50}); await p.waitForTimeout(3500);
R.row=await p.evaluate(n=>{const r=[...document.querySelectorAll('tr')].find(t=>new RegExp('-'+n+'\\b').test(t.innerText));if(!r)return null;const g=r.getBoundingClientRect();const st=[...r.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^(Approved|Open|Estimate|Review|Pending)/.test(e.innerText.trim())).map(e=>{const b=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[b.x,b.y,b.width,b.height].map(Math.round)};});const bub=[...r.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^\d+$/.test(e.innerText.trim())&&e.getBoundingClientRect().width<26&&e.getBoundingClientRect().width>0).map(e=>{const b=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[b.x,b.y,b.width,b.height].map(Math.round)};});return {g:[g.x,g.y,g.width,g.height].map(Math.round),st,bub};},num);
await p.screenshot({path:`prod/${pre}-list.png`});
R.tip=null; if(R.row?.bub?.length){ const b=R.row.bub[0].g; await p.mouse.move(b[0]+b[2]/2,b[1]+b[3]/2); await p.waitForTimeout(1800);
  R.tip=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\n+/g,' | '),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
  await p.screenshot({path:`prod/${pre}-list-tip.png`}); }
fs.writeFileSync(`prod/${pre}.json`,JSON.stringify(R,null,1));
console.log(j({who:R.who,view:R.me,api:R.api,listApi:R.listApi,expanded:R.expanded.map(x=>x.ch.join('+')),collapsed:R.collapsed.map(x=>x.t),bub:R.row?.bub?.map(x=>x.t),tip:R.tip?.map(x=>x.t)},1500));
await s.close();
