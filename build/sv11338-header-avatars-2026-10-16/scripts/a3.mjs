import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const view=async v=>{await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click(`[data-test-id=display_option_${v}]`); await p.waitForTimeout(5000);};
const dens=async d=>{await p.click('[data-test-id=button_density]'); await p.waitForTimeout(600); await p.click(`[data-test-id=option_density_${d}]`); await p.waitForTimeout(2500); await p.keyboard.press('Escape').catch(()=>{});};
const read=(sel,nameSel)=>p.evaluate(([sel,nameSel])=>{const agg={}; const ex=[]; let n=0;
  for(const a of document.querySelectorAll(`[data-test-id^=${sel}]`)){ const r=a.getBoundingClientRect(); if(!r.width) continue; n++; const id=a.getAttribute('data-test-id').slice(sel.length);
    const cs=getComputedStyle(a); const sp=a.querySelector('span')||a; const ci=getComputedStyle(sp); const img=!!a.querySelector('img');
    const nm=document.querySelector(`[data-test-id=${nameSel}${id}]`); const cn=nm?getComputedStyle(nm):null;
    const k=[img?'PHOTO':'initials',Math.round(r.width)+'px',cs.backgroundColor,ci.color,ci.fontSize,ci.fontWeight,cn?cn.fontSize+'/'+cn.fontWeight+'/'+cn.color:'-'].join(' | ');
    agg[k]=(agg[k]||0)+1; if(ex.length<40) ex.push([a.innerText.trim(),nm?.innerText.trim(),img,a.className.slice(0,50)]);}
  return {n,agg,ex};},[sel,nameSel]);
const out={mk};
await view('tech_view'); await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);
for(const d of ['compact','regular','comfortable']){ await dens(d); out['tech_'+d]=await read('tech_view_group_avatar_','tech_view_group_name_'); await p.screenshot({path:`/tmp/qa11310/a3-tech-${d}.png`}); console.log('tech',d,out['tech_'+d].n,JSON.stringify(out['tech_'+d].agg)); }
await view('board_view');
for(const d of ['compact','regular','comfortable']){ await dens(d); 
  // scroll board fully sideways collecting
  const all={n:0,agg:{},ex:[]}; await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0); 
  for(let i=0;i<40;i++){ const r=await read('board_column_avatar_','board_column_name_'); for(const [k,v] of Object.entries(r.agg)) all.agg[k]=Math.max(all.agg[k]||0,0)+v; all.n+=r.n; all.ex.push(...r.ex); const more=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); const b=sc.scrollLeft; sc.scrollLeft+=1200; return sc.scrollLeft!==b;}); await p.waitForTimeout(700); if(!more) break; }
  out['board_'+d]=all; if(d==='regular'){ await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0); await p.waitForTimeout(800); } await p.screenshot({path:`/tmp/qa11310/a3-board-${d}.png`}); console.log('board',d,all.n,JSON.stringify(all.agg)); }
await dens('regular');
fs.writeFileSync('/tmp/qa11310/a3.json',JSON.stringify(out,null,1)); await s.close();
