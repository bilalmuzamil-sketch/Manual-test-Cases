// node b5.mjs -> Board view: find the horizontal column scroller (wide, overflowing), scroll it by 600 px with the mouse wheel (shift) and by scrollLeft, read before/after; also vertical scroll inside the first column. ENV=prod. ../ev/<env>-B5b*.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=(process.env.ENV==='prod'?'prod':process.env.ENV==='staging'?'staging':'branch')+(process.env.ENGINE&&process.env.ENGINE!=='chromium'?'-'+process.env.ENGINE:''); const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const R={};
if(E.startsWith('prod')){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const pref=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value||null;
await s.go('/workorders'); await p.waitForTimeout(3000); await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(4000);
const find=()=>p.evaluate(()=>{const els=[...document.querySelectorAll('[data-test-id=board_view] *, [data-test-id=board_view]')]; const h=els.filter(e=>e.clientWidth>300&&e.scrollWidth>e.clientWidth+50&&['auto','scroll'].includes(getComputedStyle(e).overflowX)); const v=els.filter(e=>e.clientHeight>200&&e.scrollHeight>e.clientHeight+50&&['auto','scroll'].includes(getComputedStyle(e).overflowY)); const d=e=>e?{cls:e.className.toString().slice(0,60),tid:e.getAttribute('data-test-id'),sw:e.scrollWidth,cw:e.clientWidth,sl:e.scrollLeft,sh:e.scrollHeight,ch:e.clientHeight,st:e.scrollTop}:null; window.__h=h[0]; window.__v=v[0]; return {h:d(h[0]),v:d(v[0]),nh:h.length,nv:v.length};});
R.before=await find(); for(let i=0;i<6&&!R.before.h;i++){ await p.waitForTimeout(2000); R.before=await find(); } await p.screenshot({path:`../ev/${E}-B5b-before.png`});
const hb=await p.evaluate(()=>{const r=window.__h?.getBoundingClientRect(); return r?{x:r.x+r.width/2,y:r.y+r.height/2}:null}); if(hb){ await p.mouse.move(hb.x,hb.y); await p.keyboard.down('Shift'); for(let i=0;i<6;i++){ await p.mouse.wheel(0,200); await p.waitForTimeout(100);} await p.keyboard.up('Shift'); await p.waitForTimeout(800); }
R.afterWheel=await p.evaluate(()=>({sl:window.__h?.scrollLeft}));
await p.evaluate(()=>{ if(window.__h) window.__h.scrollLeft+=600; if(window.__v) window.__v.scrollTop+=500; }); await p.waitForTimeout(1200);
R.after=await p.evaluate(()=>({sl:window.__h?.scrollLeft,st:window.__v?.scrollTop,cards:document.querySelectorAll('[data-test-id^=board_card_]').length}));
await p.screenshot({path:`../ev/${E}-B5b-after.png`}); console.log(JSON.stringify(R));
if(pref) await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({value:pref})});
fs.writeFileSync(`../ev/${E}-B5b.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
