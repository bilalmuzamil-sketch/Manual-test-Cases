import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const EV='../ev/branch';
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const log=[]; p.on('response',async r=>{ if(/\/api\/roles/.test(r.url())&&r.request().method()!=='GET') log.push(r.request().method()+' '+r.status()+' '+(r.request().postData()||'').length+'b'); });
const openRole=async()=>{ await s.go('/administration/roles-permissions'); await p.waitForTimeout(4000); await p.click('[data-test-id="action_edit_73f72525-3d67-436b-9c1d-12677cdf9883"]'); await p.waitForTimeout(4000); };
const state=async()=>p.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/^\s*Move labor\s*$/i.test(e.textContent)); if(!el) return null; let row=el; for(let i=0;i<6&&row;i++){ if(row.querySelector('.q-toggle')) break; row=row.parentElement; } const tg=row&&row.querySelector('.q-toggle'); if(!tg) return {found:true,toggle:false}; tg.scrollIntoView({block:'center'}); const r=tg.getBoundingClientRect(); return {on:tg.getAttribute('aria-checked')==='true'||!!tg.querySelector('.q-toggle__inner--truthy'),x:r.x+r.width/2,y:r.y+r.height/2,tid:tg.getAttribute('data-test-id')}; });
await openRole(); let st=await state(); console.log('before',JSON.stringify(st)); await p.screenshot({path:EV+'/role-movelabor-before.png'});
if(st&&st.x&&!st.on){ await p.mouse.click(st.x,st.y); await p.waitForTimeout(800); console.log('after click',JSON.stringify(await state()));
  const save=await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(b=>/^\s*Save\s*$/i.test(b.innerText)&&!b.disabled); if(!b) return null; const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,tid:b.getAttribute('data-test-id')}; });
  console.log('save',JSON.stringify(save)); if(save){ await p.mouse.click(save.x,save.y); await p.waitForTimeout(2000);
    for(let k=0;k<3;k++){ const b=await p.evaluate(()=>{ const bs=[...document.querySelectorAll('.q-dialog button')]; const t=bs.find(b=>/Edit Anyway|Confirm|Yes|Are You Sure/i.test(b.innerText)); if(!t) return null; const r=t.getBoundingClientRect(); return {t:t.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2}; }); if(!b) break; console.log('dialog click',b.t); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000); } } }
console.log('writes',log.join(' | '));
await openRole(); st=await state(); console.log('re-read after reload',JSON.stringify(st)); await p.screenshot({path:EV+'/role-movelabor-after.png'});
const fe=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions; console.log('fe woMoveLabor',fe.includes('woMoveLabor'),fe.length);
process.exit(0);
