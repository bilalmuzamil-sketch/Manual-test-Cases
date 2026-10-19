// SV-11466 measurement: env, width, theme, location -> scrollbar thickness, handle length (pixels), drag end to end
import {open} from './qa.mjs'; import {toView} from './rec.mjs'; import fs from 'fs';
const [env='staging',W='1920',theme='light',loc='',drag='0',view='board_view',DPR='1'] = process.argv.slice(2);
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env,dir:'/tmp/qa11310',cookies:env==='staging'?C:null,quick:'admin',vp:{width:+W,height:1000},dpr:+DPR});
const out={env,W:+W,theme,loc,view,mk:await s.marker()};

const prof=async()=>{ await s.page.click('[data-test-id=profile_menu_button]'); await s.page.waitForTimeout(1200); };
const pickLoc=async name=>{ await prof(); await s.page.click('[data-test-id=select_location]'); await s.page.waitForTimeout(1200);
  const ok=await s.page.evaluate(n=>{const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>e.innerText.trim().replace(/^check\s*/,'')===n); if(!it) return [...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()); it.click(); return true;},name);
  await s.page.waitForTimeout(6000); return ok; };
const setTheme=async t=>{ await prof(); await s.page.click(`[data-test-id=button_night_mode_${t}]`); await s.page.waitForTimeout(1500); await s.page.keyboard.press('Escape'); await s.page.waitForTimeout(800); };

const tag=`${env}-${W}-${theme}${loc?'-'+loc:''}-${view}${DPR!=='1'?'-hd':''}`;
try{
 await s.go('/workorders?tab=all'); await s.page.waitForTimeout(3500);
 if(loc){ out.pick=await pickLoc(loc); await s.go('/workorders?tab=all'); await s.page.waitForTimeout(3500); }
 if(theme==='dark') await setTheme('dark');
 await toView(s.page,view); await s.page.waitForTimeout(4500);
 out.top=await s.page.evaluate(()=>document.querySelector('.q-toolbar, header')?.innerText?.replace(/\s+/g,' ').slice(0,200));
 const sel = view==='board_view' ? '[data-test-id=board_view_scroller]' : (view==='tech_view' ? '.tech-view .q-table__middle' : '.q-table__middle, .q-page');
 out.sel=sel;
 const g=await s.page.evaluate(sel=>{const e=document.querySelector(sel); if(!e) return null; const b=e.getBoundingClientRect(); return {x:b.x,y:b.y,w:b.width,h:b.height,thickH:e.offsetHeight-e.clientHeight,thickV:e.offsetWidth-e.clientWidth,sw:e.scrollWidth,cw:e.clientWidth,sl:e.scrollLeft,
   cols:document.querySelectorAll('[data-test-id^=board_column_header_]').length, first:[...document.querySelectorAll('[data-test-id^=board_column_header_]')].map(h=>h.innerText.replace(/\s+/g,' ').slice(0,30)).slice(0,3)};},sel);
 out.g=g;
 if(g && g.thickH>0){
  out.yy=Math.round(g.y+g.h-g.thickH/2);
  const shot=`/tmp/qa11310/s466/${tag}.png`; await s.page.screenshot({path:shot});
  const yy=Math.round(g.y+g.h-g.thickH/2), mx=Math.round(g.x+40);
  if(drag==='1'){
   const hy=yy, hx=mx; out.yy=yy; await s.page.mouse.move(hx,hy); await s.page.mouse.down(); await s.page.mouse.move(g.x+g.w+400,hy,{steps:40}); await s.page.mouse.up(); await s.page.waitForTimeout(2500);
   out.afterRight=await s.page.evaluate(sel=>{const e=document.querySelector(sel); const hs=[...document.querySelectorAll('[data-test-id^=board_column_header_]')]; const vis=hs.filter(h=>{const r=h.getBoundingClientRect(); return r.right>0&&r.left<innerWidth;}).map(h=>({t:h.innerText.replace(/\s+/g,' ').slice(0,28),x:Math.round(h.getBoundingClientRect().x)})); return {sl:e.scrollLeft,max:e.scrollWidth-e.clientWidth,vis:vis.slice(-4),firstVis:vis.slice(0,2)};},sel);
   await s.page.screenshot({path:`/tmp/qa11310/s466/${tag}-dragged-right.png`});
   const b2=out.afterRight; await s.page.mouse.move(g.x+g.w-80,hy); await s.page.mouse.down(); await s.page.mouse.move(g.x-400,hy,{steps:40}); await s.page.mouse.up(); await s.page.waitForTimeout(2500);
   out.afterLeft=await s.page.evaluate(sel=>{const e=document.querySelector(sel); const hs=[...document.querySelectorAll('[data-test-id^=board_column_header_]')]; const vis=hs.filter(h=>{const r=h.getBoundingClientRect(); return r.right>0&&r.left<innerWidth;}).map(h=>({t:h.innerText.replace(/\s+/g,' ').slice(0,28),x:Math.round(h.getBoundingClientRect().x)})); return {sl:e.scrollLeft,vis:vis.slice(0,3)};},sel);
  }
 }
 // column inner scrollbars on the board
 if(view==='board_view') out.colBody=await s.page.evaluate(()=>{const bs=[...document.querySelectorAll('.board-column__body')]; const e=bs.find(b=>b.scrollHeight>b.clientHeight+4); if(!e) return {n:bs.length,none:true}; const cs=getComputedStyle(e); return {n:bs.length,thickV:e.offsetWidth-e.clientWidth,sw:cs.scrollbarWidth,sc:cs.scrollbarColor};});
}catch(e){ out.err=e.message.slice(0,300); }
try{ if(theme==='dark') await setTheme('light'); if(loc){ out.restore=await pickLoc('Staging Heavy Duty - 9919'); } }catch(e){ out.restoreErr=e.message.slice(0,200); }
fs.writeFileSync(`/tmp/qa11310/s466/${tag}.json`,JSON.stringify(out,null,1)); console.log(JSON.stringify(out));
await s.close();
