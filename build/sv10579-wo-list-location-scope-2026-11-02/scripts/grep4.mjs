import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set(); p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
for(const path of ['/workorders/'+S.wos[0].woId+'/lines','/parts/orders','/reports/punch-clock-activities','/customers','/schedule']){ await s.go(path); await p.waitForTimeout(3500); }
const found=await p.evaluate(async list=>{ const set=new Set(); for(const u of list){ const t=await (await fetch(u)).text();
  for(const m of t.matchAll(/["'`]\/?(?:api\/)?((?:work-orders|technician-tasks|inventory\/orders|schedule|part-sales)[a-z0-9\-\/${}._]*)["'`]/gi)) set.add(m[1]); } return [...set].sort(); },[...urls]);
console.log(urls.size,'files'); console.log(found.filter(x=>/task|merge|transfer|workplace|location|change|move|order|assign|link|attach|convert|copy|duplicate|split/i.test(x)).join('\n'));
process.exit(0);
