import {open} from './qa.mjs'; import {C,toView} from './rec.mjs'; import fs from 'fs';
const env=process.argv[2]||'staging';
const s=await open(env==='prod'?{env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900},dpr:2}:{env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2});
const p=s.page; const out={env,mk:await s.marker(),runs:[]};
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const geo=sel=>p.evaluate(sel=>{const e=document.querySelector(sel); if(!e) return null; const r=e.getBoundingClientRect(); const anc=[]; let n=e; for(let i=0;i<10&&n&&n!==document.body;i++){ const cs=getComputedStyle(n); const rr=n.getBoundingClientRect(); if(cs.backgroundColor!=='rgba(0, 0, 0, 0)'||parseFloat(cs.borderRadius)>0||cs.boxShadow!=='none'||parseFloat(cs.paddingLeft)>0||parseFloat(cs.marginLeft)>0||cs.borderLeftWidth!=='0px') anc.push({tag:n.tagName,tid:n.getAttribute('data-test-id'),cls:(n.className||'').toString().slice(0,50),x0:Math.round(rr.x),x1:Math.round(rr.x+rr.width),bg:cs.backgroundColor,rad:cs.borderRadius,sh:cs.boxShadow==='none'?'':'shadow',pl:cs.paddingLeft,pr:cs.paddingRight,ml:cs.marginLeft,bl:cs.borderLeftWidth}); n=n.parentElement;} return {x0:+r.x.toFixed(1),x1:+(r.x+r.width).toFixed(1),y0:+r.y.toFixed(1),vw:document.documentElement.clientWidth,anc};},sel);
const tips=async view=>{ const res=[]; for(const b of ['list','tech_view','board_view']){ const bx=await s.box(`display_option_${b}`); if(!bx){res.push({b,none:true});continue;} await p.mouse.move(bx.x,bx.y); await p.waitForTimeout(1600);
  const t=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {text:e.innerText.trim(),y0:r.y,y1:r.y+r.height,x0:r.x,x1:r.x+r.width};}));
  const hdr=await p.evaluate(()=>{const h=document.querySelector('[data-test-id=table_tech_view] thead, .q-table thead, [data-test-id^=board_column_header_]'); if(!h) return null; const r=h.getBoundingClientRect(); return {y0:r.y,y1:r.y+r.height};});
  res.push({b,btn:{y0:bx.by,y1:bx.by+bx.bh},tip:t[0]||null,hdr,above:t[0]?t[0].y1<=bx.by:null,overHeader:t[0]&&hdr?(t[0].y1>hdr.y0&&t[0].y0<hdr.y1):null}); await p.mouse.move(5,890); await p.waitForTimeout(500);} return res; };
const views=env==='prod'?['list']:['list','tech_view','board_view'];
for(const w of [1280,1440,1536,1920]){ await p.setViewportSize({width:w,height:900}); await p.waitForTimeout(1200);
 for(const v of views){ if(env!=='prod'){ await toView(p,v); await p.waitForTimeout(1500);} await p.mouse.move(5,890); await p.waitForTimeout(600);
  const r={w,v};
  if(v==='tech_view'){ r.table=await geo('[data-test-id=table_tech_view]'); r.grp=await geo('[data-test-id^=tech_view_group_]'); }
  if(v==='board_view'){ r.board=await geo('[data-test-id=board_view_scroller]'); r.col1=await geo('[data-test-id^=board_column_header_]'); r.lastCol=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); const hs=[...document.querySelectorAll('[data-test-id^=board_column_header_]')]; const last=hs[hs.length-1]?.getBoundingClientRect(); return {scW:sc.scrollWidth,cW:sc.clientWidth,lastX1:last?last.x+last.width:null};}); }
  if(v==='list'){ r.list=await geo('.q-table__container'); }
  if(env!=='prod' && (w===1440||w===1536)) r.tips=await tips(v);
  if(w===1440) await p.screenshot({path:`/tmp/qa11310/p22-${env}-${v}-1440.png`});
  out.runs.push(r); console.log(JSON.stringify(r).slice(0,700)); } }
if(env!=='prod'){ await p.setViewportSize({width:1440,height:900}); await toView(p,'tech_view'); }
fs.writeFileSync(`/tmp/qa11310/p22-${env}.json`,JSON.stringify(out,null,1)); await s.close();
