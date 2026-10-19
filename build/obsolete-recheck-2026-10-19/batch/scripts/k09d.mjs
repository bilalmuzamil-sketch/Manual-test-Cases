import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]; const BTN=view==='tech_view'?'button_tech_view_column_selection':'button_board_fields_selection';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={view,log:[]};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; return {tag:a.tagName,tid:a.dataset?.testId||'',role:a.getAttribute('role')||'',label:a.getAttribute('aria-label')||'',checked:a.getAttribute('aria-checked')??a.querySelector('[aria-checked]')?.getAttribute('aria-checked')??null,text:(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,40)};});
const menu=()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().height>0).map(m=>m.innerText.trim().replace(/\s+/g,' ').slice(0,200)));
const L=async(k,extra={})=>{ const x={k,...(await act()),...extra}; out.log.push(x); console.log(JSON.stringify(x).slice(0,300)); };
const colsShown=()=>p.evaluate(v=>v==='tech_view'?[...document.querySelectorAll('[data-test-id=table_tech_view] thead th')].map(t=>t.innerText.trim()).filter(Boolean).join('|'):(()=>{const c=document.querySelector('[data-test-id^=board_card_]'); return (c.innerText.includes('Asset')?'HAS Asset':'NO Asset')+' | '+c.innerText.replace(/\s+/g,' ').slice(0,90);})(),view);
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); await p.mouse.move(700,880);
 await p.focus('[data-test-id=page_search_toggle]'); for(let i=0;i<10;i++){ const a=await act(); if(a.tid===BTN) break; await p.keyboard.press('Tab'); await p.waitForTimeout(200); }
 await L('onButton'); out.cols0=await colsShown();
 await p.keyboard.press('Enter'); await p.waitForTimeout(1200); out.menu=await menu(); await L('afterEnter',{menu:out.menu});
 for(let i=0;i<3;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(400); await L('tab'+i); }
 const a1=await act(); out.optTid=a1.tid;
 await p.keyboard.press('Space'); await p.waitForTimeout(1500); await L('afterSpace'); out.colsAfterSpace=await colsShown();
 await p.keyboard.press('Space'); await p.waitForTimeout(1500); await L('afterSpace2'); out.colsAfterSpace2=await colsShown();
 await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await L('afterEnterOpt'); out.colsAfterEnter=await colsShown();
 await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await L('afterEnterOpt2'); out.colsAfterEnter2=await colsShown();
 await p.keyboard.press('Escape'); await p.waitForTimeout(1000); await L('afterEscape',{menu:await menu()});
 console.log('cols0',out.cols0.slice(0,200)); console.log('space',out.colsAfterSpace.slice(0,200)); console.log('space2',out.colsAfterSpace2.slice(0,200)); console.log('enter',out.colsAfterEnter.slice(0,200)); console.log('enter2',out.colsAfterEnter2.slice(0,200));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const changed=Object.keys(prefs0).filter(k=>JSON.stringify(prefs0[k])!==JSON.stringify(cur[k])); out.changedKeys=changed;
if(changed.length){ const v={...cur}; for(const k of changed) v[k]=prefs0[k]; out.put=await putP(v); }
out.restored=Object.keys(prefs0).every(k=>JSON.stringify(prefs0[k])===JSON.stringify((cur&&true)&&prefs0[k]))&&JSON.stringify(await getP())===JSON.stringify({...(await getP()),...Object.fromEntries(Object.keys(prefs0).map(k=>[k,prefs0[k]]))});
console.log('changedKeys',changed,'restored',out.restored);
fs.writeFileSync(`/tmp/qa11310/ev09/k09d-${view}.json`,JSON.stringify(out,null,1)); await s.close();
