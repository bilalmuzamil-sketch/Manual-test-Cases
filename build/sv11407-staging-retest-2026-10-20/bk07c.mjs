import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]; const frac=+process.argv[3]; const hx=+process.argv[4]||0; const q=process.argv[5]||''; const tab=process.argv[6]||'all'; const tag=process.argv[7]||`${view}-${frac}-${hx}`;
const s=await session({quick:process.argv[8]||'tech',vp:{width:1440,height:900},dpr:+(process.env.DPR||1)}); const p=s.page; const out={view,frac,hx,q,tab,mk:await s.marker()};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
// Tech: rows in q-table__middle, viewTop = bottom of held header (if shown) else thead bottom. Board: first column body inside the scroller + the left pinned column
const meas=(view)=>p.evaluate((view)=>{
 const R=e=>e.getBoundingClientRect();
 if(view==='tech_view'){
  const sc=document.querySelector('.q-table__middle'); const th=R(document.querySelector('[data-test-id=table_tech_view] thead'));
  const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].find(e=>{const r=R(e); const cs=getComputedStyle(e); return r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';});
  const clip=held?R(held.closest('.tech-view__held')):null; const top=clip? Math.max(th.bottom, clip.bottom): th.bottom;
  const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId));
  const vis=rows.map(e=>({id:e.dataset.testId.slice(14),num:(e.querySelector('[data-test-id^=tech_view_row_number_link_]')||{}).innerText,t:R(e).top,b:R(e).bottom})).filter(r=>r.b>top+1).sort((a,b)=>a.t-b.t);
  return {cols:[{name:'table',scrollTop:Math.round(sc.scrollTop),scrollLeft:Math.round(sc.scrollLeft),viewTop:Math.round(top),heldName:held?held.innerText.replace(/\s+/g,' ').trim().slice(0,30):null,first:vis[0]?{num:vis[0].num,id:vis[0].id,t:Math.round(vis[0].t),b:Math.round(vis[0].b)}:null,second:vis[1]?{num:vis[1].num,t:Math.round(vis[1].t)}:null}]};
 } else {
  const scr=document.querySelector('[data-test-id=board_view_scroller]');
  const bodies=[...document.querySelectorAll('.board-column__body')].filter(b=>{const r=R(b); return r.width>0&&r.left<1440&&r.right>0;});
  return {scrollLeft:Math.round(scr.scrollLeft),cols:bodies.filter(b=>R(b).left>=-1&&R(b).right<=1441&&b.querySelector('[data-test-id^=board_card_]')).slice(0,5).map(b=>{const col=b.closest('[data-test-id^=board_column_]')||b.parentElement; const hdr=b.closest('.board-column__panel')?.querySelector('[data-test-id^=board_column_header_]'); const top=R(b).top; const cards=[...b.querySelectorAll('[data-test-id^=board_card_]')].filter(c=>/^board_card_[0-9a-f-]{36}$/.test(c.dataset.testId)).map(c=>({id:c.dataset.testId.slice(11),num:(c.innerText.match(/S\d-\d+/)||[''])[0],t:R(c).top,b:R(c).bottom})).filter(c=>c.b>top+1).sort((a,b)=>a.t-b.t);
   return {name:hdr?hdr.innerText.replace(/\s+/g,' ').trim().slice(0,24):'?',x:Math.round(R(b).left),scrollTop:Math.round(b.scrollTop),viewTop:Math.round(top),first:cards[0]?{num:cards[0].num,id:cards[0].id,t:Math.round(cards[0].t),b:Math.round(cards[0].b)}:null};})};
 }},view);
try{
 await s.go(`/workorders?tab=${tab}`+(q?'&search='+encodeURIComponent(q):'')); await p.waitForTimeout(4000); await toView(p,view); await p.waitForTimeout(2500);
 if(view==='tech_view'){ for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000); }
 // horizontal
 if(hx){ if(view==='tech_view'){ await p.mouse.move(700,500); await p.mouse.wheel(hx,0); } else { const b=await p.evaluate(()=>{const r=document.querySelector('[data-test-id=board_view_scroller]').getBoundingClientRect(); return {x:r.x+300,y:r.y+30};}); await p.mouse.move(b.x,b.y); await p.mouse.wheel(hx,0);} await p.waitForTimeout(1500); }
 // vertical: scroll by wheel to ~1500 px, then fine-tune so the first item is cut by frac of its height
 const pos= view==='tech_view' ? [{x:700,y:500}] : (await meas(view)).cols.slice(0,3).map(c=>({x:c.x+140,y:500}));
 out.pre=[];
 for(const [i,pt] of pos.entries()){
  await p.mouse.move(pt.x,pt.y); await p.mouse.wheel(0,900+i*350); await p.waitForTimeout(1500);
  let m=(await meas(view)).cols.find(c=>Math.abs(c.x-(pt.x-140))<5)||(await meas(view)).cols[0];
  const f=m.first; const h=f.b-f.t; const want=Math.round(m.viewTop - frac*h); const d=Math.round(f.t-want);
  if(d) { await p.mouse.wheel(0,d); await p.waitForTimeout(1200); }
 }
 await p.waitForTimeout(1500); out.before=await meas(view);
 await p.screenshot({path:`/tmp/qa11310/ev07/${tag}-before.png`}); out.store=await p.evaluate(()=>({hist:JSON.stringify(history.state).slice(0,400),ss:Object.keys(sessionStorage).filter(k=>/scroll|tech|board|anchor|restore/i.test(k)).map(k=>k+'='+sessionStorage.getItem(k).slice(0,200)),ls:Object.keys(localStorage).filter(k=>/scroll|anchor|restore/i.test(k))}));
 // open the first visible item of the first column
 const pick=process.argv[9]||'first'; const c0= pick==='second' ? await p.evaluate((view)=>{const rows=[...document.querySelectorAll(view==='tech_view'?'[data-test-id^=tech_view_row_]':'[data-test-id^=board_card_]')].filter(e=>/^(tech_view_row|board_card)_[0-9a-f-]{36}$/.test(e.dataset.testId)&&e.getBoundingClientRect().top>300&&e.getBoundingClientRect().top<700); const e=rows[0]; return {id:e.dataset.testId.slice(view==='tech_view'?14:11),num:e.innerText.match(/S\d-\d+/)?.[0]};},view) : out.before.cols[0].first; out.clicked=c0.num;
 if(view==='tech_view' && pick==='mouse'){ const vt=out.before.cols[0].viewTop; const b=await p.evaluate(id=>{const r=document.querySelector(`[data-test-id=tech_view_row_number_link_${id}]`).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},c0.id); out.clickAt={x:Math.round(b.x+12),y:Math.round(Math.max(b.y,vt)+Math.min(4,(b.y+b.h-Math.max(b.y,vt))/2)),link:b}; out.stAtClick=await p.evaluate(()=>document.querySelector('.q-table__middle').scrollTop); await p.mouse.move(out.clickAt.x,out.clickAt.y,{steps:5}); await p.waitForTimeout(400); await p.mouse.click(out.clickAt.x,out.clickAt.y); }
 else if(view==='tech_view') await p.click(`[data-test-id=tech_view_row_number_link_${c0.id}]`,{position:{x:5,y:5}}); else if(pick==='mouse'){ const vt=out.before.cols[0].viewTop; const b=await p.evaluate(id=>{const r=document.querySelector(`[data-test-id=board_card_${id}]`).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},c0.id); const top=Math.max(b.y,vt); out.clickAt={x:Math.round(b.x+b.w-40),y:Math.round(top+(b.y+b.h-top)/2),card:b}; await p.mouse.move(out.clickAt.x,out.clickAt.y,{steps:5}); await p.waitForTimeout(400); await p.mouse.click(out.clickAt.x,out.clickAt.y); }
 else await p.click(`[data-test-id=board_card_${c0.id}]`,{position:{x:60,y:20}});
 await p.waitForTimeout(3500); out.opened=p.url();
 await p.goBack(); out.poll=[]; for(let i=0;i<12;i++){ await p.waitForTimeout(1000); const m=await meas(view); out.poll.push(m.cols.map(c=>c.scrollTop+':'+(c.first?.num||'')).join(',')+(m.scrollLeft!==undefined?' L'+m.scrollLeft:'')); } out.backUrl=p.url();
 out.after=await meas(view);
 out.whereFirst=await p.evaluate(({id,view})=>{const e=document.querySelector(view==='tech_view'?`[data-test-id=tech_view_row_${id}]`:`[data-test-id=board_card_${id}]`); if(!e) return 'not in page'; const r=e.getBoundingClientRect(); return Math.round(r.top)+'..'+Math.round(r.bottom);},{id:out.before.cols[0].first.id,view});
 await p.screenshot({path:`/tmp/qa11310/ev07/${tag}-after.png`});
 out.tabActive=await p.evaluate(()=>[...document.querySelectorAll('.q-tab--active, [role=tab][aria-selected=true]')].map(e=>e.innerText.trim()).join('|'));
 out.searchVal=await p.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.value).filter(Boolean).join('|'));
}catch(e){ out.err=e.message.slice(0,300); }
{ const cur=await getP(); out.put=await putP({...cur,collapsedGroups:prefs0.collapsedGroups}); out.restored=JSON.stringify((await getP()).collapsedGroups)===JSON.stringify(prefs0.collapsedGroups); }
fs.writeFileSync(`/tmp/qa11310/ev07/${tag}.json`,JSON.stringify(out,null,1));
const B=out.before, A=out.after;
console.log(tag, out.err||'', 'opened', (out.opened||'').replace('https://app.staging.shopview.com',''), 'back', (out.backUrl||'').replace('https://app.staging.shopview.com',''));
if(B&&A){ if(view!=='tech_view') console.log(' scrollLeft', B.scrollLeft,'->',A.scrollLeft);
 B.cols.slice(0,3).forEach((b,i)=>{const a=A.cols[i]||{}; console.log(' ',b.name,'sl',b.scrollLeft??'','->',a.scrollLeft??'','| st',b.scrollTop,'->',a.scrollTop,'| viewTop',b.viewTop,'->',a.viewTop,'| first',b.first?.num,b.first?.t+'..'+b.first?.b,'->',a.first?.num,a.first?.t+'..'+a.first?.b, a.first&&b.first? (a.first.id===b.first.id? (a.first.t>=a.viewTop-1?'SAME, FULLY SHOWN':'SAME, CUT '+(a.viewTop-a.first.t)+'px'):'DIFFERENT'):'', 'held',b.heldName||'','->',a.heldName||'');});
 console.log(' store',JSON.stringify(out.store)); console.log(' clickAt',JSON.stringify(out.clickAt),'stAtClick',out.stAtClick); console.log(' clicked',out.clicked,'| before-first now at',out.whereFirst,'| restored prefs',out.restored); console.log(' poll',out.poll.join(' | ')); console.log(' tab',out.tabActive,'search',out.searchVal);}
await s.close();
