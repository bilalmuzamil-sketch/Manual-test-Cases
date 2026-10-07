import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,pre]=process.argv.slice(2); const {wo,line}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob({dpr:2}); const p=s.page;
const chips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-badge,.q-chip,[data-test-id*="summary"],[data-test-id*="count"]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {tid:e.getAttribute('data-test-id'),txt:e.innerText.trim().replace(/\n/g,' '),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
await s.go(`/workorders/${wo}/lines`); let b=await s.box('button_line_expand_'+line); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
console.log('LINES collapsed',j(await chips(),900)); await s.shot(pre+'-lines-collapsed','shots');
await s.go(`/workorders/${wo}/part-requests`); await p.waitForTimeout(1200);
const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,i,.q-icon')].find(x=>/expand_less|keyboard_arrow_up/.test(x.innerText)&&x.getBoundingClientRect().y>150);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(t){await p.mouse.click(t.x,t.y); await p.waitForTimeout(1200);}
console.log('PARTS collapsed',j(await chips(),900)); await s.shot(pre+'-parts-collapsed','shots');
const num=(await s.api('/api/work-orders/view/'+wo)).json.data; const n=num.work_order?.number??num.number;
await s.go('/workorders?tab=work_orders'); await p.waitForTimeout(1500);
const row=await p.evaluate(n=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes(n));if(!r)return null;r.scrollIntoView({block:'center'});const c=[...r.querySelectorAll('.q-badge,.q-chip,[class*=badge]')].map(e=>(e.getAttribute('data-test-id')||'')+':'+e.innerText.trim()+':'+(e.getAttribute('title')||''));return {txt:r.innerText.replace(/\s+/g,' ').slice(0,160),c};},n);
console.log('LIST',n,j(row,600)); await p.waitForTimeout(500); await s.shot(pre+'-list','shots');
const lst=(await s.api('/api/work-orders?limit=100')).json.data.work_orders.find(w=>w.number===n); console.log('list api',j({statusInStock:lst?.statusInStock,partRequestsCount:lst?.partRequestsCount,statusRequestedCount:lst?.statusRequestedCount}));
await s.close();
