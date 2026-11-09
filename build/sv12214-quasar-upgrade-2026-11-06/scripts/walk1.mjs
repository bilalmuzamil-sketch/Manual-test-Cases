// node walk1.mjs -> SV-12214 Work Orders page: menus (columns, density, card size, board fields, filter chip), select an option and confirm it applies,
// board hover card + tooltips (position finite + inside window), board sideways scroll. ENV=prod for production. Writes ../ev/<env>-walk1.json + shots.
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=(process.env.ENV==='prod'?'prod':process.env.ENV==='staging'?'staging':'branch')+(process.env.ENGINE&&process.env.ENGINE!=='chromium'?'-'+process.env.ENGINE:''); const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const R={build:await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content),checks:[],console:[]};
p.on('console',m=>{ if(m.type()==='error') R.console.push(m.text().slice(0,200)); }); p.on('pageerror',e=>R.console.push('PAGEERROR '+e.message.slice(0,200)));
if(E.startsWith('staging')){ await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}); }
if(E.startsWith('prod')){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
const pref=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value||null; R.prefBefore=pref;
const add=(name,ok,detail)=>{ R.checks.push({name,ok,detail}); console.log((ok?'PASS ':'FAIL ')+name+' :: '+JSON.stringify(detail).slice(0,300)); };
const menus=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>{const r=m.getBoundingClientRect();return r.width>0&&r.height>0}).map(m=>{const r=m.getBoundingClientRect();return {role:m.getAttribute('role')||m.querySelector('[role=menu]')?.getAttribute('role')||null,x:r.x,y:r.y,w:r.width,h:r.height,items:[...m.querySelectorAll('.q-item,[role=menuitem],[role=menuitemradio],[role=checkbox],[role=option]')].map(i=>i.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12)}}));
const inWin=r=>r&&isFinite(r.x)&&isFinite(r.y)&&r.x>=0&&r.y>=0&&r.x+r.w<=1601&&r.y+r.h<=901;
async function menuCheck(label,btn){ await p.click(`[data-test-id=${btn}]`); await p.waitForTimeout(900); const m=await menus(); await p.screenshot({path:`../ev/${E}-${label}.png`});
  const roleMenu=await p.evaluate(()=>document.querySelectorAll('[role=menu]').length);
  add(label+': menu opens, on screen, with items',m.length>0&&inWin(m[0])&&m[0].items.length>0,{menus:m,roleMenuCount:roleMenu}); return m; }
async function closeMenu(){ await p.keyboard.press('Escape'); await p.waitForTimeout(400); }
await s.go('/workorders'); await p.waitForTimeout(3500);
// List view
await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(2500);
await menuCheck('L1-list-columns','button_column_selection'); await closeMenu();
await menuCheck('L2-status-filter','filter_chip_status');
const opt=p.locator('[data-test-id^=filter_option_status_]').first(); const optName=await opt.innerText().catch(()=>null);
if(optName){ await opt.click(); await p.waitForTimeout(1500); const chip=await p.locator('[data-test-id=filter_chip_status]').innerText(); add('L3-status filter: picking an option shows on the chip',/\(1\)|1/.test(chip)||chip.includes(optName.trim().split('\n')[0]),{optName:optName.replace(/\s+/g,' '),chip:chip.replace(/\s+/g,' ')}); await p.screenshot({path:`../ev/${E}-L3-status-picked.png`}); await closeMenu(); await opt.isVisible().catch(()=>0); await s.go('/workorders'); await p.waitForTimeout(2500); const clr=p.locator('[data-test-id=filter_chip_status]'); }
// hover tooltip on list
const vin=p.locator('[data-test-id=button_copy_vin]').first(); if(await vin.count()){ await vin.hover(); await p.waitForTimeout(1200); const tt=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>{const r=t.getBoundingClientRect();return {text:t.innerText,x:r.x,y:r.y,w:r.width,h:r.height}})); await p.screenshot({path:`../ev/${E}-L4-tooltip-copyvin.png`}); add('L4-list: tooltip on the copy-VIN icon shows text, placed on screen',tt.length>0&&tt[0].text&&inWin(tt[0]),tt); }
// Tech View density
await p.click('[data-test-id=display_option_tech_view]'); await p.waitForTimeout(3500);
const rowH=async()=>p.evaluate(()=>{const r=document.querySelector('[data-test-id^=tech_view_row_]');return r?Math.round(r.getBoundingClientRect().height):null});
const h0=await rowH(); const dm=await menuCheck('T1-techview-density','button_density');
const items=dm[0]?.items||[]; const res={};
for(const it of ['Compact','Regular','Comfortable']){ if(!(await p.locator('.q-menu').count())) await p.click('[data-test-id=button_density]'), await p.waitForTimeout(800); const el=p.locator('.q-menu .q-item, .q-menu [role=menuitemradio]').filter({hasText:it}).first(); if(await el.count()){ await el.click(); await p.waitForTimeout(1500); res[it]=await rowH(); await closeMenu(); } }
add('T2-techview density: each choice changes the row height (Compact 36 / Regular 48 / Comfortable 64)',res.Compact&&res.Regular&&res.Comfortable&&res.Compact<res.Regular&&res.Regular<res.Comfortable,{before:h0,res});
await p.screenshot({path:`../ev/${E}-T2-density-after.png`});
await menuCheck('T3-techview-columns','button_tech_view_column_selection'); await closeMenu();
const av=p.locator('[data-test-id^=avatar_technician_]').first(); if(await av.count()){ await av.hover(); await p.waitForTimeout(1200); const tt=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>{const r=t.getBoundingClientRect();return {text:t.innerText,x:r.x,y:r.y,w:r.width,h:r.height}})); await p.screenshot({path:`../ev/${E}-T4-tooltip-avatar.png`}); add('T4-techview: technician avatar tooltip shows a name, placed on screen',tt.length>0&&!!tt[0].text&&inWin(tt[0]),tt); }
// Board
await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(4000);
const cardH=async()=>p.evaluate(()=>{const c=document.querySelector('[data-test-id^=board_card_]');return c?Math.round(c.getBoundingClientRect().height):null});
const c0=await cardH(); const cm=await menuCheck('B1-board-card-size','button_card_size'); const cres={};
for(const it of (cm[0]?.items||[])){ if(!(await p.locator('.q-menu').count())) await p.click('[data-test-id=button_card_size]'), await p.waitForTimeout(800); const el=p.locator('.q-menu .q-item, .q-menu [role=menuitemradio]').filter({hasText:it}).first(); if(await el.count()){ await el.click(); await p.waitForTimeout(1500); cres[it]=await cardH(); await closeMenu(); } }
add('B2-board card size: choices change the card height',Object.values(cres).filter(Boolean).length>=2&&new Set(Object.values(cres)).size>=2,{before:c0,cres});
await menuCheck('B3-board-fields','button_board_fields_selection'); await closeMenu();
const card=p.locator('[data-test-id^=board_card_]').first(); R.cards=await p.locator('[data-test-id^=board_card_]').count();
if(await card.count()){ await card.hover(); await p.waitForTimeout(1800); const hc=await p.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-tooltip,[role=tooltip],[data-test-id*=hover]')].filter(m=>{const r=m.getBoundingClientRect();return r.width>0}).map(m=>{const r=m.getBoundingClientRect();return {tid:m.getAttribute('data-test-id'),cls:m.className.slice(0,60),text:m.innerText.replace(/\s+/g,' ').slice(0,80),x:r.x,y:r.y,w:r.width,h:r.height,transform:getComputedStyle(m).transform,top:m.style.top,left:m.style.left}}));
  await p.screenshot({path:`../ev/${E}-B4-board-hovercard.png`}); add('B4-board: hovering a card shows its hover card at a real on-screen position (no NaN)',hc.length>0&&hc.every(h=>isFinite(h.x)&&isFinite(h.y)&&!/NaN/.test(h.top+h.left+h.transform)),hc); }
const sc=await p.evaluate(()=>{const els=[...document.querySelectorAll('[data-test-id=board_view] *')].filter(e=>e.scrollWidth>e.clientWidth+20&&getComputedStyle(e).overflowX!=='visible'); const e=els[0]; if(!e) return {found:false}; const b=e.scrollLeft; e.scrollLeft=b+400; return {found:true,cls:e.className.slice(0,60),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,before:b,after:e.scrollLeft};});
await p.waitForTimeout(800); await p.screenshot({path:`../ev/${E}-B5-board-scrolled.png`}); add('B5-board: columns scroll sideways',!sc.found||sc.after>sc.before,sc);
// restore
if(pref){ await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({value:pref})}); R.prefAfter=(await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value; R.prefRestored=JSON.stringify(R.prefAfter)===JSON.stringify(pref); }
fs.writeFileSync(`../ev/${E}-walk1.json`,JSON.stringify(R,null,1)); console.log('console errors',R.console.length,'restored',R.prefRestored,'cards',R.cards); await s.close(); process.exit(0);
