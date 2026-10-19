// SV-11101: create Zeta, Alpha, Mid; assign lead Vic Hover from each work order page in order Mid, Zeta, Alpha; read Tech/Board order
import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900}}); const p=s.page; const J={method:'POST',headers:{'Content-Type':'application/json'}}; const log={mk:await s.marker()};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const C={Z:['5e28493c-81ad-491f-b1bc-1db01694fc2b','e92844f4-f56f-4395-b718-97c1be1d1cca'],A:['9155093b-a433-4320-80aa-71108917cb1f','d2271ca9-4b01-4e6a-9089-22fbab30bd56'],M:['28812082-2711-4aca-a5f8-c19a252c04a3','e5ef1848-7ebf-4f6c-a607-090c6b6063fd']};
const reqs=[]; p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&/lead|tech|assign/.test(q.url())) reqs.push({u:q.url().replace(/^https:\/\/[^/]+/,''),st:r.status(),b:(q.postData()||'').slice(0,200)});});
try{
 log.wo={Z:{id:'93b05166-26bf-4c67-84df-38d3a1e7d6a1',n:'S2-37345'},A:{id:'16e0979e-4e6c-4572-8d62-0158469c1a37',n:'S2-37346'},M:{id:'f33bf65a-65e6-482a-81b4-dd2bb1567f5f',n:'S2-37347'}};
 await s.go('/workorders?tab=all&search=ZZ96929'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 for(const k of ['M','Z','A']){ const n=log.wo[k].n;
  const h=await p.evaluateHandle(n=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); c.scrollIntoView({block:'center'}); c.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})); return c.querySelector('[data-test-id=button_work_order_more_actions]');},n); await p.waitForTimeout(600);
  const cb=await h.asElement().boundingBox(); await p.mouse.move(cb.x-60,cb.y+30); await p.waitForTimeout(400); await p.mouse.click(cb.x+cb.width/2,cb.y+cb.height/2); await p.waitForTimeout(900);
  const mb=await p.locator('[data-test-id=menu_item_reassign_lead_technician]').last().boundingBox(); await p.mouse.click(mb.x+mb.width/2,mb.y+mb.height/2); await p.waitForTimeout(2000);
  if(k==='M') log.dlgTids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f-]{36}/,'{id}')+':'+(e.innerText||'').replace(/\s+/g,' ').slice(0,25)).slice(0,40));
  await p.keyboard.type('Vic Hover',{delay:50}); await p.waitForTimeout(1500);
  const row=await p.evaluateHandle(()=>[...document.querySelectorAll('.q-dialog .q-item, .q-dialog [role=option], .q-dialog [data-test-id*=technician]')].find(e=>/Vic Hover/.test(e.innerText))); const rb=await row.asElement().boundingBox(); await p.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2); await p.waitForTimeout(1200);
  for(let i=0;i<4;i++){ const d=await p.evaluateHandle(()=>[...document.querySelectorAll('.q-dialog button')].find(b=>/^(Reassign|Confirm|Save|Yes|Assign|Keep shifts|Are You Sure\?)$/i.test(b.innerText.trim()))); const de=d.asElement(); if(!de) break; log['btn_'+k+i]=await de.innerText(); const db=await de.boundingBox(); await p.mouse.click(db.x+db.width/2,db.y+db.height/2); await p.waitForTimeout(2000); }
  log['dlgLeft_'+k]=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText.replace(/\s+/g,' ').slice(0,200)));
  log['toast_'+k]=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ').trim()));
  const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; log['lead_'+k]=w.techAssignedLastName; await p.waitForTimeout(2500); }
 await s.go('/workorders?tab=all&search=ZZ96929'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(3500);
 for(let i=0;i<150;i++){ const ok=await p.evaluate(()=>{const g=[...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].find(e=>/Vic Hover/.test(e.innerText)); if(g){ g.scrollIntoView({block:'start'}); return true;} const m=document.querySelector('.q-table__middle'); m.scrollTop+=500; return false;}); if(ok) break; await p.waitForTimeout(300); }
 await p.waitForTimeout(1500); log.tech=await p.evaluate(()=>{ const rows=[...document.querySelectorAll('tbody tr')]; const gi=rows.findIndex(r=>/Vic Hover/.test(r.innerText)&&r.querySelector('[data-test-id^=tech_view_group_name_]')); const out=[]; for(let i=gi+1;i<rows.length;i++){ if(rows[i].querySelector('[data-test-id^=tech_view_group_name_]')) break; const t=rows[i].innerText; const n=(t.match(/S\d*-\d+/)||[])[0]; if(n) out.push(n+' '+(t.match(/(Zeta|Alpha|Mid)[^\n]*/)||[''])[0].slice(0,30)); } return out; });
 await p.screenshot({path:'/tmp/qa11310/ex20/k3-tech.png'});
 await toView(p,'board_view'); await p.waitForTimeout(3500);
 for(let i=0;i<120;i++){ const ok=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Vic Hover/.test(e.innerText)); if(h){ h.scrollIntoView({inline:'center'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900; return false;}); if(ok) break; await p.waitForTimeout(300); }
 await p.waitForTimeout(1500); log.board=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Vic Hover/.test(e.innerText)); const pn=h.closest('.board-column__panel'); return [...pn.querySelectorAll('.board-card')].map(c=>{const t=c.innerText; return (t.match(/S\d*-\d+/)||[])[0]+' '+((t.match(/(Zeta|Alpha|Mid)[^\n]*/)||[''])[0]).slice(0,25);});});
 await p.screenshot({path:'/tmp/qa11310/ex20/k3-board.png'});
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
log.reqs=reqs; fs.writeFileSync('/tmp/qa11310/ex20/k3.json',JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
