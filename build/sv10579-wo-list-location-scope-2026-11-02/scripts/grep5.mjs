import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set(); p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
for(const path of ['/workorders/'+S.wos[0].woId+'/lines','/parts/orders','/workorders','/parts/deliveries']){ await s.go(path); await p.waitForTimeout(3500); }
const found=await p.evaluate(async list=>{ const out=new Set(); for(const u of list){ const t=await (await fetch(u)).text();
  for(const m of t.matchAll(/["'`]\/?(?:api\/)?([a-z\-]+\/[a-z0-9\-\/${}._]*)["'`]/gi)) if(/locat|workplace|transfer|reassign|move|change-work|link/i.test(m[1])) out.add(m[1]);
  for(const m of t.matchAll(/.{0,120}workplace_id.{0,120}/g)) if(/work-?order|order|task/i.test(m[0])) out.add('CTX: '+m[0]); } return [...out].sort(); },[...urls]);
console.log(urls.size,'files'); console.log(found.slice(0,80).join('\n'));
process.exit(0);
