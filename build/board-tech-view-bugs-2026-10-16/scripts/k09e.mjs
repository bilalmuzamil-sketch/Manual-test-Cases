import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]; const keyX=process.argv[3]||'Enter';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={view,keyX,log:[]};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const act=()=>p.evaluate(()=>{const a=document.activeElement; return {tag:a.tagName,tid:a.dataset?.testId||'',role:a.getAttribute('role')||'',label:a.getAttribute('aria-label')||'',text:(a.innerText||'').trim().replace(/\s+/g,' ').slice(0,40)};});
const chipState=()=>p.evaluate(()=>{const c=document.querySelector('[data-test-id=filter_chip_status]'); const wrap=c.parentElement; return {text:c.innerText.trim().replace(/\s+/g,' '),url:location.search,near:[...wrap.querySelectorAll('[data-test-id],button,[tabindex]')].map(e=>(e.dataset.testId||e.tagName)+'|'+(e.getAttribute('aria-label')||'')+'|ti='+e.getAttribute('tabindex')),rows:document.querySelectorAll('[data-test-id^=tech_view_row_],[data-test-id^=board_card_]').length};});
const L=async(k,extra={})=>{ const x={k,...(await act()),...extra}; out.log.push(x); console.log(JSON.stringify(x).slice(0,400)); };
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,view); await p.waitForTimeout(2500); await p.mouse.move(700,880);
 await L('start',{chip:await chipState()});
 await p.focus('[data-test-id=page_search_toggle]'); await p.keyboard.press('Tab'); await p.waitForTimeout(300); await L('onStatus');
 await p.keyboard.press('Enter'); await p.waitForTimeout(1200); out.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().height>0).map(m=>m.innerText.trim().replace(/\s+/g,' ').slice(0,200))); await L('menuOpen',{menu:out.menu});
 for(let i=0;i<3;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(300); const a=await act(); if(/paid/i.test(a.text+a.label)) break; }
 await L('onOption'); await p.keyboard.press('Space'); await p.waitForTimeout(2000); await L('optionSpace');
 await p.keyboard.press('Escape'); await p.waitForTimeout(1500); await L('afterEsc',{chip:await chipState()});
 // tab to the x
 for(let i=0;i<6;i++){ const a=await act(); if(/clear|remove/i.test(a.tid+a.label)) break; await p.keyboard.press('Tab'); await p.waitForTimeout(300); }
 await L('onX'); await p.keyboard.press(keyX); await p.waitForTimeout(2500); await L('afterX',{chip:await chipState()});
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const changed=Object.keys(prefs0).filter(k=>JSON.stringify(prefs0[k])!==JSON.stringify(cur[k])); out.changedKeys=changed;
if(changed.length){ const v={...cur}; for(const k of changed) v[k]=prefs0[k]; out.put=await putP(v); }
console.log('changedKeys',changed);
fs.writeFileSync(`/tmp/qa11310/ev09/k09e-${view}-${keyX}.json`,JSON.stringify(out,null,1)); await s.close();
