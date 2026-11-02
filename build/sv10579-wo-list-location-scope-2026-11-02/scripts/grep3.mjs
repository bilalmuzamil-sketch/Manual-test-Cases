import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set(); p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
await s.go('/workorders/'+S.wos[1].woId+'/lines'); await p.waitForTimeout(5000);
const found=await p.evaluate(async list=>{ const set=new Set(); for(const u of list){ const t=await (await fetch(u)).text();
  let i=-1; while((i=t.indexOf("splitWorkOrder(",i+1))>=0) set.add(u.split("/").pop()+": "+t.slice(i-250,i+150)); } return [...set]; },[...urls]);
console.log(found.join('\n')); process.exit(0);
