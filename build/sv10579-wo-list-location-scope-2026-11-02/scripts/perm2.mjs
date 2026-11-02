import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const EV='../ev/branch';
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; await s.go('/administration/roles-permissions'); await p.waitForTimeout(4500);
const row=await p.evaluate(()=>{ const tr=[...document.querySelectorAll('tr, .q-item')].find(t=>/^\s*Admin\b/.test(t.innerText)); if(!tr) return null; const b=tr.querySelector('button, [data-test-id*="edit"]'); const r=(b||tr).getBoundingClientRect(); return {t:tr.innerText.slice(0,60),x:r.x+r.width/2,y:r.y+r.height/2,tid:b?.getAttribute('data-test-id')}; });
console.log('admin row',JSON.stringify(row));
if(row){ await p.mouse.click(row.x,row.y); await p.waitForTimeout(4000); }
const has=await p.evaluate(()=>{ const t=document.body.innerText; return {moveLabor:/Move labor/i.test(t), sample:(t.match(/Work Orders[\s\S]{0,400}/)||[''])[0].replace(/\n/g,' | ').slice(0,400)}; });
console.log(JSON.stringify(has)); await p.screenshot({path:EV+'/role-admin-work-orders-perms.png',fullPage:true});
process.exit(0);
