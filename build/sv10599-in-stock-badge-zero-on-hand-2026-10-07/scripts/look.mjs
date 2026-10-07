// node look.mjs <label> <shotprefix>  -> part rows on Lines tab + Parts tab, with badge text and geometry
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,pre,who]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob({dpr:2,quick:who||'admin'}); const p=s.page; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(1200);
const grab=()=>p.evaluate(()=>{const out=[];
  document.querySelectorAll('[data-test-id]').forEach(e=>{const t=e.getAttribute('data-test-id'); if(/badge|status|chip|pick/i.test(t)&&e.getBoundingClientRect().width>0){const r=e.getBoundingClientRect(); out.push({tid:t,txt:(e.innerText||'').trim().replace(/\n/g,' ').slice(0,60),g:[r.x,r.y,r.width,r.height].map(Math.round)});}});
  const chips=[...document.querySelectorAll('.q-badge,.q-chip')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {txt:e.innerText.trim(),g:[r.x,r.y,r.width,r.height].map(Math.round)};});
  return {tids:out,chips};});
const L=await grab(); console.log('LINES tids',j(L.tids.filter(x=>!/nav|module/.test(x.tid)),1500)); console.log('LINES chips',j(L.chips,800));
await s.shot(pre+'-lines','shots'); fs.writeFileSync(`shots/${pre}-lines.json`,JSON.stringify(L));
await s.go(`/workorders/${wo}/part-requests`); await p.waitForTimeout(1500); console.log('url',p.url());
const P=await grab(); console.log('PARTS tids',j(P.tids.filter(x=>!/nav|module/.test(x.tid)),1500)); console.log('PARTS chips',j(P.chips,800));
await s.shot(pre+'-parts','shots'); fs.writeFileSync(`shots/${pre}-parts.json`,JSON.stringify(P));
const ls=(await s.api('/api/work-orders/lines/'+wo)).json.data.collection; console.log('api parts',j(ls.flatMap(l=>(l.part_requests||[]).map(r=>({pn:r.part_number,st:r.status,oh:r.on_hand_quantity,q:r.quantity}))),600));
await s.close();
