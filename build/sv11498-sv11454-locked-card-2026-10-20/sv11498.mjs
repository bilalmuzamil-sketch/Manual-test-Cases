import {session,toView} from './rec.mjs'; import fs from 'fs';
const [,,wo,view='board_view',tag=wo]=process.argv;
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={wo,view,mk:await s.marker(),steps:[]};
const OWN=['display','tab','density','collapsedGroups','filters']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const card=a?.closest?.('.board-card,[data-test-id^=tech_view_row_]'); return {tag:a?.tagName,tid:a?.dataset?.testId||'',text:(a?.innerText||a?.value||'').replace(/\s+/g,' ').slice(0,60),cls:(a?.className||'').toString().slice(0,60),card:card?(card.innerText.match(/S\d-\d+/)||[''])[0]:'' ,dis:a?.getAttribute?.('aria-disabled')};});
const tips=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.width>0&&cs.visibility!=='hidden'&&cs.opacity!=='0';}).map(e=>e.innerText.trim()));
try{
 await s.go(`/workorders?tab=all&search=${encodeURIComponent(wo)}`); await p.waitForTimeout(4000); await toView(p,view); await p.waitForTimeout(3500);
 out.card=await p.evaluate(({wo,view})=>{const c=[...document.querySelectorAll(view==='tech_view'?'[data-test-id^=tech_view_row_]':'.board-card')].find(e=>e.innerText.includes(wo)); if(!c) return null; return {text:c.innerText.replace(/\s+/g,' ').slice(0,160),lock:!!c.querySelector('[data-test-id*=lock], .lucide-lock, [class*=lock]')};},{wo,view}).catch(e=>'ERR '+e.message); console.log('card',JSON.stringify(out.card));
 // click once in the Search box, then keyboard only
 const sb=await p.$('[data-test-id=input_search], input[type=search], .q-field input'); if(sb){ await sb.click(); } await p.waitForTimeout(500); out.steps.push({k:'click search',a:await act()});
 let found=false; for(let i=0;i<60;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(150); const a=await act(); out.steps.push({k:'Tab',a}); if(a.card===wo){found=true;break;} }
 console.log('card focused',found,JSON.stringify(out.steps.at(-1).a));
 await p.screenshot({path:`ex98/${tag}-1-card-focus.png`});
 // reach More actions
 let mo=false; for(let i=0;i<8;i++){ const a=await act(); if(/more|action|kebab|menu/i.test(a.tid)&&a.card===wo){mo=true;break;} await p.keyboard.press('Tab'); await p.waitForTimeout(200); out.steps.push({k:'Tab',a:await act()}); }
 console.log('more focused',mo,JSON.stringify(await act()));
 await p.keyboard.press('Enter'); await p.waitForTimeout(900);
 out.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>({t:e.innerText.trim(),dis:e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true',tab:e.getAttribute('tabindex'),tid:e.dataset.testId||''})));
 console.log('menu',JSON.stringify(out.menu)); await p.screenshot({path:`ex98/${tag}-2-menu-open.png`});
 for(let i=0;i<6;i++){ await p.keyboard.press('ArrowDown'); await p.waitForTimeout(700); const a=await act(); const t=await tips(); const bx=await p.evaluate(()=>{const R=e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}; const a=document.activeElement; const tp=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getBoundingClientRect().width>0).map(R); const m=document.querySelector('.q-menu'); return {focus:R(a),tip:tp[0]||null,menu:m?R(m):null};}); out.steps.push({k:'Down',a,tips:t,bx}); console.log('Down',i+1,JSON.stringify(a),'tips',JSON.stringify(t)); await p.screenshot({path:`ex98/${tag}-3-down${i+1}.png`}); }
 // Enter on the focused item: must not open the dialog
 const before=await act(); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); out.afterEnter={focused:before,dialogs:await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,80)))}; console.log('enter on',before.text,'dialogs',JSON.stringify(out.afterEnter.dialogs));
 await p.keyboard.press('Escape'); await p.waitForTimeout(600);
 // mouse comparison: open menu by mouse and hover each disabled item
 const mb=await p.evaluate((wo)=>{const c=[...document.querySelectorAll('.board-card,[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes(wo)); const b=c&&[...c.querySelectorAll('button,[role=button]')].find(x=>/more|action/i.test(x.dataset.testId||'')||/more/i.test(x.getAttribute('aria-label')||'')); if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,tid:b.dataset.testId};},wo);
 out.mouse=[]; if(mb){ const cr=await p.evaluate((wo)=>{const c=[...document.querySelectorAll('.board-card,[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes(wo)).getBoundingClientRect(); return {x:c.x+30,y:c.y+20};},wo); await p.mouse.move(cr.x,cr.y); await p.waitForTimeout(400); await p.mouse.click(mb.x,mb.y); await p.waitForTimeout(900);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{const r=e.getBoundingClientRect(); return {t:e.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2};}));
  for(const it of items){ await p.mouse.move(it.x,it.y,{steps:5}); await p.waitForTimeout(900); const t=await tips(); out.mouse.push({item:it.t,tips:t}); console.log('mouse hover',it.t,'tips',JSON.stringify(t)); await p.screenshot({path:`ex98/${tag}-4-mouse-${it.t.replace(/\W+/g,'_')}.png`}); }
  // lock icon tooltip
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  const lk=await p.evaluate((wo)=>{const c=[...document.querySelectorAll('.board-card,[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes(wo)); const l=c.querySelector('[data-test-id*=lock], .lucide-lock, svg[class*=lock], i[class*=lock]'); if(!l) return null; const r=l.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,tid:l.dataset?.testId||l.getAttribute('class')};},wo);
  if(lk){ await p.mouse.move(lk.x,lk.y,{steps:5}); await p.waitForTimeout(1000); out.lockTip=await tips(); console.log('lock tip',JSON.stringify(out.lockTip),lk.tid); await p.screenshot({path:`ex98/${tag}-5-lock.png`}); } else console.log('no lock icon found'); }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.restored=JSON.stringify(await getP())===JSON.stringify(prefs0); out.mkEnd=await s.marker(); fs.writeFileSync(`ex98/${tag}.json`,JSON.stringify(out,null,1)); await s.close(); console.log('restored',out.restored,out.mkEnd.version);
