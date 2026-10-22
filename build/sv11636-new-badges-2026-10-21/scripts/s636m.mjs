import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const SIZES={1920:1080,1440:900,1280:800,1024:768,1023:768,768:1024,390:844}; const R={};
const measure=()=>document.fonts.ready.then(()=>{
 const rc=e=>{const r=e.getBoundingClientRect();return {x:+r.x.toFixed(2),y:+r.y.toFixed(2),w:+r.width.toFixed(2),h:+r.height.toFixed(2)}};
 const vis=e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'};
 const isNew=e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&vis(e);
 const badges=[...document.querySelectorAll('*')].filter(isNew);
 const cand=[...document.querySelectorAll('header a, header button, header input, header [role=search], [data-test-id=toggle_display_option], [data-test-id^=display_option_], main button, main .q-tab, main a')].filter(vis);
 const nm=e=>(e.getAttribute('data-test-id')||e.innerText||e.tagName).toString().replace(/\s+/g,' ').trim().slice(0,28);
 const inter=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>0.5&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>0.5;
 const navRects=()=>cand.map(e=>[nm(e),rc(e)]);
 const before=navRects();
 const out=badges.map(b=>{const r=rc(b);const cs=getComputedStyle(b);
  const overl=cand.filter(e=>!e.contains(b)&&!b.contains(e)&&inter(r,rc(e))).map(e=>nm(e));
  const overlAnc=cand.filter(e=>e.contains(b)).map(e=>nm(e));
  // glyph overlap with the link's text
  let glyph=null; const a=b.closest('a,[data-test-id=toggle_display_option]'); if(a){const w=document.createTreeWalker(a,NodeFilter.SHOW_TEXT);let n,hit=0,txt=[];while(n=w.nextNode()){if(/^\s*new\s*$/i.test(n.textContent)||!n.textContent.trim())continue;const g=document.createRange();g.selectNodeContents(n);const gr=g.getBoundingClientRect();const o={x:gr.x,y:gr.y,w:gr.width,h:gr.height};txt.push(n.textContent.trim()+'@'+o.x.toFixed(1)+','+o.y.toFixed(1)+' '+o.w.toFixed(1)+'x'+o.h.toFixed(1));if(inter(r,o))hit++;}glyph={labelsOverlappedByPill:hit,txt};}
  // clipping
  const clipped=[];let p=b.parentElement;while(p&&p!==document.documentElement){const c=getComputedStyle(p);if(c.overflowX!=='visible'||c.overflowY!=='visible'){const pr=rc(p);if(r.x<pr.x-0.5||r.y<pr.y-0.5||r.x+r.w>pr.x+pr.w+0.5||r.y+r.h>pr.y+pr.h+0.5)clipped.push((p.className||p.tagName).toString().slice(0,40)+' '+JSON.stringify(pr));}p=p.parentElement;}
  const inVp=r.x>=0&&r.y>=0&&r.x+r.w<=innerWidth&&r.y+r.h<=innerHeight;
  const par=b.closest('a,[data-test-id=toggle_display_option]');const pr=par?rc(par):null;
  return {kind:b.getAttribute('data-test-id')||b.className.toString().slice(0,30),rect:r,bg:cs.backgroundColor,color:cs.color,font:cs.fontSize+'/'+cs.fontWeight,br:cs.borderRadius,pad:cs.padding,text:b.textContent.trim(),host:par&&nm(par),hostRect:pr,
   centreDiff:pr?+((r.x+r.w/2)-(pr.x+pr.w/2)).toFixed(2):null,gapAboveHost:pr?+(pr.y-(r.y+r.h)).toFixed(2):null,overlaps:overl,glyph,clipped,inViewport:inVp,pe:cs.pointerEvents}});
 // layout shift: hide badges, compare every interactive rect
 const sty=document.createElement('style');sty.textContent='.desktop-link__badge,.display-switcher__badge,[data-test-id=badge_display_option_new]{display:none!important}';document.head.appendChild(sty);
 const after=navRects();sty.remove();
 let shift=0,shiftWho='';before.forEach((b,i)=>{const a=after[i];if(!a)return;['x','y','w','h'].forEach(k=>{const d=Math.abs(b[1][k]-a[1][k]);if(d>shift){shift=d;shiftWho=b[0]+' '+k}})});
 const btns=['list','tech_view','board_view'].map(v=>{const e=document.querySelector('[data-test-id=display_option_'+v+']');if(!e||!vis(e))return null;const r=e.getBoundingClientRect();const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return [v,rc(e),t&&t.closest('[data-test-id^=display_option_]')?.getAttribute('data-test-id')]}).filter(Boolean);
 const sw=document.querySelector('[data-test-id=toggle_display_option]');
 return {build:document.querySelector('meta[name=app-version]')?.content,newCount:badges.length,badges:out,maxShiftWhenBadgesHidden:+shift.toFixed(3),shiftWho,switcher:sw&&vis(sw)?rc(sw):null,btns,hScroll:document.documentElement.scrollWidth>document.documentElement.clientWidth,docW:[document.documentElement.scrollWidth,document.documentElement.clientWidth],dashboard:(()=>{const a=[...document.querySelectorAll('header a')].find(a=>/^dashboard/i.test(a.innerText.trim()));return a&&vis(a)?rc(a):null})()};
});
const theme=async(p,t)=>{await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click(`[data-test-id=button_night_mode_${t}]`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
const only=(process.argv[2]||'light,dark').split(','); const widths=(process.argv[3]||'1920,1440,1280,1024,1023,768,390').split(',').map(Number);
for(const th of only){
 const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page;
 await s.go('/workorders'); await p.waitForTimeout(5000); await theme(p,th);
 for(const W of widths){ await p.setViewportSize({width:W,height:SIZES[W]}); await s.go('/workorders'); await p.waitForTimeout(5000);
  const key=th+'-'+W; R[key]=await p.evaluate(measure); await p.screenshot({path:`/tmp/qa21/m636-${key}.png`});
  if(W<1024){ await p.click('[data-test-id=button_open_mobile_menu]').catch(()=>{}); await p.waitForTimeout(2000);
   R[key].menu=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-drawer')].pop(); if(!d) return null; const rc=e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)]};
     const badges=[...d.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^new$/i.test(e.textContent.trim())&&e.getBoundingClientRect().width).map(e=>({rect:rc(e),host:(e.closest('a,.q-item')?.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),hostRect:e.closest('a,.q-item')?rc(e.closest('a,.q-item')):null,bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color,font:getComputedStyle(e).fontSize+'/'+getComputedStyle(e).fontWeight}));
     return {drawer:rc(d),items:[...d.querySelectorAll('a,.q-item')].map(e=>[e.innerText.replace(/\s+/g,' ').trim().slice(0,22),...rc(e)]).filter(i=>i[3]),badges,newInMenu:badges.length}});
   await p.screenshot({path:`/tmp/qa21/m636-${key}-menu.png`}); }
  console.log(key,R[key].build,'new',R[key].newCount,'shift',R[key].maxShiftWhenBadgesHidden,'hScroll',R[key].hScroll,R[key].menu?('menuNew '+R[key].menu.newInMenu):'');
 }
 if(th==='dark'){ await p.setViewportSize({width:1440,height:900}); await s.go('/workorders'); await p.waitForTimeout(4000); await theme(p,'light'); }
 await s.close();
}
fs.writeFileSync('/tmp/qa21/m636.json',JSON.stringify(R,null,1));
