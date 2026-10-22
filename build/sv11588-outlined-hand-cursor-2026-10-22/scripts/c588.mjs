import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const theme=process.argv[3]||'light'; const OUT='/tmp/qa11588/'+env+'-'+theme;
const o= env==='prod'?{env:'prod',user:'bilal.muzamil@shopview.com'}:{env:'branch',ticket:'11588',cookies:JSON.parse(fs.readFileSync('/tmp/qa11588/cookies.json')),quick:'admin'};
const s=await open({...o,dir:'/tmp/qa21',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const R={};
// every element whose cursor is SET on it (differs from its parent), grouped by a stable key
const scan=()=>p.evaluate(()=>{const key=e=>{const tid=(e.getAttribute('data-test-id')||'').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>').replace(/\d+/g,'#');return e.tagName.toLowerCase()+(tid?'['+tid+']':'')+'.'+[...e.classList].filter(c=>!/^q-(focus|hover)|active|selected/.test(c)).slice(0,3).join('.')};
  const out={};for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;const c=getComputedStyle(e).cursor;const pc=e.parentElement?getComputedStyle(e.parentElement).cursor:'auto';if(c===pc)continue;const k=key(e)+' => '+c;out[k]=(out[k]||0)+1;}
  return {build:document.querySelector('meta[name=app-version]')?.content,url:location.pathname,set:out};});
const view=async v=>{const b=await p.$('[data-test-id=display_option_'+v+']'); if(!b) return false; const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(6000); await p.mouse.move(5,500); return true;};
if(theme==='dark'){ await s.go('/workorders'); await p.waitForTimeout(4000); await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=button_night_mode_dark]'); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); }
await s.go('/workorders'); await p.waitForTimeout(6000);
R.startView=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=display_option_]')].filter(e=>/selected|active|--on/.test(e.className)).map(e=>e.getAttribute('data-test-id')));
for(const v of ['board_view','tech_view','list']){ await view(v); R[v]=await scan(); console.log(env,theme,v,R[v].build,Object.keys(R[v].set).length,'keys'); }
// drag samples: press on a card/row, move in steps, read the cursor the user sees at each step, then drop back where it started
async function drag(v,sel){ await view(v); const el=await p.$(sel); if(!el) return {err:'no '+sel}; await el.scrollIntoViewIfNeeded(); const bb=await el.boundingBox(); const x=bb.x+bb.width/2,y=bb.y+Math.min(bb.height/2,14);
  const read=()=>p.evaluate(([x,y])=>{const t=document.elementFromPoint(x,y);return {under:t?getComputedStyle(t).cursor:null,body:getComputedStyle(document.body).cursor,html:getComputedStyle(document.documentElement).cursor,bodyClass:document.body.className.slice(0,80)}},[x,y]);
  await p.mouse.move(x,y); await p.waitForTimeout(300); const hover=await read(); await p.mouse.down(); const steps=[];
  for(const [dx,dy] of [[4,0],[12,6],[40,20],[90,30],[160,40],[90,30],[30,10],[0,0]]){ await p.mouse.move(x+dx,y+dy,{steps:4}); await p.waitForTimeout(250); steps.push(await p.evaluate(([x,y])=>{const t=document.elementFromPoint(x,y);return {under:t?getComputedStyle(t).cursor:null,body:getComputedStyle(document.body).cursor,html:getComputedStyle(document.documentElement).cursor,ghost:!!document.querySelector('.sortable-drag,.sortable-ghost,[class*=dragging],[class*=drag-ghost]')}},[x+dx,y+dy])); }
  await p.mouse.up(); await p.waitForTimeout(1500); return {sel,hover,steps};}
R.dragBoard=await drag('board_view','[data-test-id^=board_card_]:not([data-test-id*=status])');
R.dragTech=await drag('tech_view','[data-test-id^=tech_view_row_]');
console.log('dragBoard',JSON.stringify(R.dragBoard).slice(0,900)); console.log('dragTech',JSON.stringify(R.dragTech).slice(0,900));
// other pages
const hrefs=await p.evaluate(()=>[...new Set([...document.querySelectorAll('header a[href]')].map(a=>a.getAttribute('href')).filter(h=>h&&h.startsWith('/')))]);
R.pages={}; for(const h of hrefs){ if(/workorders/.test(h)) continue; await s.go(h); await p.waitForTimeout(6000); R.pages[h]=await scan(); console.log(env,theme,'page',h,Object.keys(R.pages[h].set).length); }
// restore view + theme
await s.go('/workorders'); await p.waitForTimeout(4000); const sv=(R.startView[0]||'display_option_list').replace('display_option_',''); await view(sv);
if(theme==='dark'){ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=button_night_mode_light]'); await p.waitForTimeout(1200); }
R.buildEnd=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
fs.writeFileSync(OUT+'.json',JSON.stringify(R,null,1)); await s.close();
