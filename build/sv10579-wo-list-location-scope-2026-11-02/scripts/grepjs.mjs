import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set();
p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
await s.go('/workorders'); await p.waitForTimeout(4000);
await p.click('[data-test-id="display_option_board_view"]').catch(()=>{}); await p.waitForTimeout(3000);
const NEEDLES=['navigateToReceiveParts','Receive parts','receive_parts','unreceivedPartRequestsCount','lineTechnicians'];const out=[];for(const NEEDLE of NEEDLES){out.push('=== '+NEEDLE);out.push(...await p.evaluate(async([list,NEEDLE])=>{const res=[]; for(const u of list){ const t=await (await fetch(u)).text();
  let i=-1, n=0; while((i=t.indexOf(NEEDLE,i+1))>=0 && n<4){ const c=t.slice(Math.max(0,i-150),i+150); {res.push(u.split('/').pop()+': '+c.replace(/\s+/g,' ')); n++;} } } return res;},[[...urls],NEEDLE]));}
console.log(urls.size,'js files'); console.log(out.slice(0,40).join('\n---\n'));
process.exit(0);
