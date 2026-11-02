import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const W=JSON.parse(rd('br-w.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const caps=[]; p.on('response',async r=>{const u=r.url(); if(u.includes('/api/')&&!/release-notes|notifications|feature-flags|statuses|my-workplaces|preferences|punch-clock|my-current|view-profile|maps/.test(u)&&r.request().method()==='GET'){ try{ caps.push({u:u.replace(/^https:\/\/[^/]+/,''),j:await r.json()}); }catch(e){} }});
const IDS={X:S.wos[0].woId,Y:S.wos[1].woId,W:W.wId};
await s.go('/workorders'); await p.waitForTimeout(3000); await p.click('[data-test-id="display_option_board_view"]'); await p.waitForTimeout(4000);
console.log('board-load urls',caps.map(c=>c.u.slice(0,110)).join(' ; ')); const board=caps.filter(c=>/work_orders/.test(JSON.stringify(c.j).slice(0,200))).pop();
const rows=board?.j?.data?.work_orders||[]; for(const [k,id] of Object.entries(IDS)){ const r=rows.find(x=>x.id===id); console.log('board',k,r?JSON.stringify({lt:r.lineTechnicians,cl:r.clockedInTechnicians}).slice(0,300):'not in board page'); }
console.log('board url',board?.u.slice(0,200));
for(const [k,id] of Object.entries(IDS)){ caps.length=0; await s.go(`/workorders/${id}/timesheets`); await p.waitForTimeout(3500);
  console.log('timesheets',k,caps.map(c=>c.u.slice(0,90)).join(' ; ')); const t=caps.find(c=>/timesheet|task/i.test(c.u)); if(t) console.log('  ',JSON.stringify(t.j).slice(0,500)); }
process.exit(0);
