import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set(); p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
for(const path of ['/workorders/'+S.wos[0].woId+'/lines']){ await s.go(path); await p.waitForTimeout(4000); }
const out=await p.evaluate(async list=>{ const o=new Set(); for(const u of list){ const t=await (await fetch(u)).text(); for(const m of t.matchAll(/.{0,60}work-orders\/[a-z\-]*(lead|tech-assign|technician)[a-z\-]*.{0,160}/gi)) o.add(m[0]); } return [...o]; },[...urls]);
console.log(out.join('\n'));
process.exit(0);
