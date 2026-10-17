import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'tech',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={};
const geo=()=>p.evaluate(()=>{const R=e=>{const r=e.getBoundingClientRect(); return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)};}; return [...document.querySelectorAll('.board-column__body')].slice(0,3).map(b=>{const c=[...b.querySelectorAll('[data-test-id^=board_card_]')].filter(c=>/^board_card_[0-9a-f-]{36}$/.test(c.dataset.testId)).map(c=>({num:(c.innerText.match(/S\d-\d+/)||[''])[0],...R(c),bt:getComputedStyle(c).borderTopWidth})).filter(c=>c.y+c.h>R(b).y).sort((a,b)=>a.y-b.y)[0]; const cs=getComputedStyle(b); return {body:R(b),pad:cs.paddingTop,scrollTop:b.scrollTop,card:c,panel:R(b.closest('.board-column__panel')||b)};});});
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'board_view'); await p.waitForTimeout(3000);
out.fresh=await geo(); await p.screenshot({path:'/tmp/qa11310/ev07/bv-fresh.png'});
// scroll each of the first 3 columns a bit (aligned scroll by wheel), then half-card, open a lower card, back
const cols=out.fresh.map(c=>c.body);
for(const [i,b] of cols.entries()){ await p.mouse.move(b.x+140,500); await p.mouse.wheel(0,900+i*350); await p.waitForTimeout(1200); }
let g=await geo(); for(const [i,c] of g.entries()){ const want=c.body.y-c.card.h*0.5; const d=Math.round(c.card.y-want); if(d){ await p.mouse.move(c.body.x+140,500); await p.mouse.wheel(0,d); await p.waitForTimeout(1000);} }
await p.waitForTimeout(1500); out.before=await geo(); await p.screenshot({path:'/tmp/qa11310/ev07/bv-before.png'});
const id=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id^=board_card_]')].filter(e=>/^board_card_[0-9a-f-]{36}$/.test(e.dataset.testId)&&e.getBoundingClientRect().top>400&&e.getBoundingClientRect().left<300)[0]; return e.dataset.testId;});
out.clicked=id; await p.click(`[data-test-id=${id}]`,{position:{x:60,y:20}}); await p.waitForTimeout(3500); out.opened=p.url(); await p.goBack(); await p.waitForTimeout(6000);
out.after=await geo(); await p.screenshot({path:'/tmp/qa11310/ev07/bv-after.png'});
fs.writeFileSync('/tmp/qa11310/ev07/bv-detail.json',JSON.stringify(out,null,1));
for(const k of ['fresh','before','after']) console.log(k, out[k].map(c=>`${c.card?.num} card ${c.card?.y}..${(c.card?.y+c.card?.h).toFixed(1)} body ${c.body.y} pad ${c.pad} st ${c.scrollTop} panel ${c.panel.y}`).join(' | '));
await s.close();
