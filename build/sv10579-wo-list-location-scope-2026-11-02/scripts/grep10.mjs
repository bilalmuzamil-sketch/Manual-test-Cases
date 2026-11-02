import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const p=s.page; const urls=new Set(); p.on('response',r=>{const u=r.url(); if(/\.js(\?|$)/.test(u)&&u.includes('sv10579')) urls.add(u);});
for(const path of ['/parts/orders','/order/ef3302c4-6455-4d81-b8b0-8185c12c01fe']){ await s.go(path); await p.waitForTimeout(4500); }
const out=await p.evaluate(async list=>{ const o=new Set(); for(const u of list){ const t=await (await fetch(u)).text(); for(const m of t.matchAll(/.{0,40}inventory\/orders\/(add-item|change-item|change|create|change-workplace|assign)[^"'`]*.{0,200}/g)) o.add(m[0]);
  for(const m of t.matchAll(/.{0,160}(work_order_id|workOrderId|part_request_id):.{0,160}/g)) if(/addItem|add-item|order_id|orderId/.test(m[0])) o.add('B '+m[0]); } return [...o]; },[...urls]);
console.log(out.slice(0,14).join('\n'));
process.exit(0);
