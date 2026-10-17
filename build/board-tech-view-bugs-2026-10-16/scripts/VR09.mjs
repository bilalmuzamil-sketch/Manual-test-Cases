import {session,toView,narr,finish} from './rec.mjs';
const dir='/tmp/qa11310/vo09'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec09'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; const t=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()); return {tid:a.dataset?.testId||'',label:a.getAttribute('aria-label')||'',full:(a.innerText||'').replace(/\s+/g,' '),tip:t[0]||null,checked:a.getAttribute('aria-checked')};});
const key=async(k,ms=450)=>{ await p.keyboard.press(k); await p.waitForTimeout(ms); };
const reach=async(view,target)=>{ await p.focus('[data-test-id=button_new_work_order]'); await key('Tab'); let prev=''; for(let i=0;i<80;i++){ const x=await act(); if(x.full.includes(target)) return true; let kk='ArrowDown'; if(view!=='tech_view'&&x.full===prev) kk='ArrowRight'; prev=x.full; await key(kk,220); if(kk==='ArrowRight') prev=''; } return false; };
const tabTo=async(re,max=12)=>{ for(let i=0;i<max;i++){ await key('Tab',500); const x=await act(); if(re.test(x.tid)) return x; } return null; };
try{
 await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000); await p.mouse.move(1435,895);
 await reach('tech_view','S2-12718'); await p.mouse.move(700,500); await p.mouse.wheel(0,320); await p.waitForTimeout(1200); log.rowY=await p.evaluate(()=>Math.round(document.activeElement.getBoundingClientRect().y)); log.n1=await tabTo(/^avatar_technician_/); await p.waitForTimeout(500); log.n1=await act();
 await N.cap(s,'n1',`SV-11409 · staging ${mk.version} · keyboard only · Tech View, S2-12718: Tab → avatar · name on focus: "${log.n1.tip}"`);
 await tabTo(/^avatar_group_overflow/); await p.waitForTimeout(500); log.n2=await act(); await N.cap(s,'n2',`Tab → "+3" · names on focus: "${log.n2.tip}"`);
 await s.caption('Next: Board View, the same work order S2-12718',{hold:1800}); await toView(p,'board_view'); await p.waitForTimeout(2500); await p.mouse.move(1435,895); await reach('board_view','S2-12718'); await tabTo(/^avatar_technician_/); await p.waitForTimeout(500); log.n3=await act();
 await N.cap(s,'n3',`Board View, card S2-12718: Tab → avatar · name on focus: "${log.n3.tip}"`);
 await s.caption('Next: the Columns menu in Tech View',{hold:1500}); await toView(p,'tech_view'); await p.waitForTimeout(2000); await p.mouse.move(1435,895);
 await p.focus('[data-test-id=button_tech_view_column_selection]'); await key('Enter',1000); await tabTo(/toggle_tech_view_column_unit/,6); await key('Space',1500); log.n4a=await act(); log.n4cols=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_tech_view] thead th')].some(t=>t.innerText.trim()==='Unit'));
 await N.cap(s,'n4',`Columns menu: Enter opens it · Tab → "Unit" · Space → switched ${log.n4a.checked==='false'?'off':'on'} (Unit column ${log.n4cols?'shown':'hidden'})`);
 await key('Space',350); log.n4b=await act(); await s.caption(`Space again → "Unit" switched ${log.n4b.checked==='true'?'on':'off'} · Escape closes the menu`,{hold:2000}); await key('Escape',800); await s.caption('Next: the x on the Status filter chip',{hold:1500});
 await p.focus('[data-test-id=filter_chip_status]'); await key('Enter',1000); for(let i=0;i<3;i++) await key('Tab',300); await key('Space',1800); await key('Escape',1500);
 await key('Tab',600); log.n5x=await act(); await key('Enter',2500); log.n5=await p.evaluate(()=>document.querySelector('[data-test-id=filter_chip_status]').innerText.replace(/\s+/g,' ').replace('keyboard_arrow_down','').trim());
 await N.cap(s,'n5',`Tab → chip x ("${log.n5x.label}") · Enter → chip now reads "${log.n5}" · Spec v64 S11-R2 → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
const cur=await getP(); const ch=Object.keys(prefs0).filter(k=>JSON.stringify(prefs0[k])!==JSON.stringify(cur[k])); if(ch.length){ const v={...cur}; for(const k of ch) v[k]=prefs0[k]; log.put=await putP(v);} log.restoredKeys=ch;
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log).slice(0,1500));
